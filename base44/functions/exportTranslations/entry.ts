import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import * as XLSX from 'npm:xlsx@0.18.5';

const SUPPORTED_LANGS = ['en','ar','tr','fr','ru','id','vi','de','ur','hi','bn','zh','es','pt','it','th','ja','ko','fa'];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    let body = {};
    try { body = await req.json(); } catch (_) {}
    const { type = 'ui', module_filter = '' } = body; // type: 'ui' | 'locations'

    let rows = [];

    if (type === 'ui') {
      // Fetch all UI translations
      let translations = [];
      let offset = 0;
      const batchSize = 200;
      while (true) {
        const batch = await base44.asServiceRole.entities.Translation.list('-created_date', batchSize);
        if (batch.length === 0) break;
        translations = batch;
        break; // list doesn't support offset via SDK, get all
      }
      translations = await base44.asServiceRole.entities.Translation.list('-created_date', 2000);

      // Apply module filter if provided
      if (module_filter) {
        translations = translations.filter(t => t.module === module_filter);
      }

      rows = translations.map(t => {
        const row = { Lang_Key: t.lang_key, Module: t.module || 'common' };
        for (const lang of SUPPORTED_LANGS) {
          row[lang] = t[lang] || '';
        }
        return row;
      });

    } else if (type === 'locations') {
      const locTranslations = await base44.asServiceRole.entities.TranslationLocation.list('-created_date', 5000);
      rows = locTranslations.map(t => {
        const row = { Entity_Type: t.entity_type, Entity_ID: t.entity_id };
        for (const lang of SUPPORTED_LANGS) {
          row[lang] = t[lang] || '';
        }
        return row;
      });
    }

    // Build Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    // Auto column widths
    const colWidths = {};
    rows.forEach(row => {
      Object.keys(row).forEach(key => {
        const val = String(row[key] || '');
        colWidths[key] = Math.max(colWidths[key] || key.length, Math.min(val.length, 80));
      });
    });
    ws['!cols'] = Object.keys(colWidths).map(k => ({ wch: colWidths[k] }));

    XLSX.utils.book_append_sheet(wb, ws, type === 'ui' ? 'Translations' : 'Locations');
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    const filename = type === 'ui'
      ? `kemedar_translations_${module_filter || 'all'}_${new Date().toISOString().slice(0,10)}.xlsx`
      : `kemedar_locations_translations_${new Date().toISOString().slice(0,10)}.xlsx`;

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (err) {
    console.error('Export error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
});