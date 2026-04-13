import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import * as XLSX from 'npm:xlsx@0.18.5';

const SUPPORTED_LANGS = ['en','ar','tr','fr','ru','id','vi','de','ur','hi','bn','zh','es','pt','it','th','ja','ko','fa'];
const LANG_COL_MAP = { Ko: 'ko', ko: 'ko', Fa: 'fa', fa: 'fa' }; // handle case variants from Excel

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function withRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try { return await fn(); } catch (e) {
      if (e.message?.includes('Rate limit') && i < retries - 1) {
        await sleep(2000 * (i + 1));
      } else throw e;
    }
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    let body = {};
    try { body = await req.json(); } catch (_) {}
    const { file_url, type = 'ui' } = body;

    if (!file_url) {
      return Response.json({ error: 'file_url is required' }, { status: 400 });
    }

    // Fetch & parse Excel
    const fileRes = await fetch(file_url);
    if (!fileRes.ok) return Response.json({ error: 'Failed to fetch file' }, { status: 400 });
    const arrayBuffer = await fileRes.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: null });

    if (type === 'ui') {
      // Load existing translations to find by lang_key
      const existing = await base44.asServiceRole.entities.Translation.list('-created_date', 5000);
      const existingMap = {};
      for (const t of existing) { existingMap[t.lang_key] = t; }

      let created = 0, updated = 0, skipped = 0;

      for (const row of rows) {
        if (!row['Lang_Key']) { skipped++; continue; }
        const langKey = String(row['Lang_Key']).trim();
        if (!langKey) { skipped++; continue; }

        const data = {
          lang_key: langKey,
          module: row['Module'] || 'common',
        };
        for (const lang of SUPPORTED_LANGS) {
          // Handle Ko → ko, Fa → fa case variants from old Excel files
          const colName = Object.keys(row).find(k => k.toLowerCase() === lang.toLowerCase()) || lang;
          const val = row[colName];
          if (val !== null && val !== undefined && val !== '') {
            data[lang] = String(val).trim();
          }
        }

        const existing_record = existingMap[langKey];
        if (existing_record) {
          await withRetry(() => base44.asServiceRole.entities.Translation.update(existing_record.id, data));
          updated++;
        } else {
          await withRetry(() => base44.asServiceRole.entities.Translation.create(data));
          created++;
        }
        await sleep(80);
      }

      return Response.json({ success: true, type: 'ui', created, updated, skipped, total: rows.length });

    } else if (type === 'locations') {
      const existing = await base44.asServiceRole.entities.TranslationLocation.list('-created_date', 10000);
      const existingMap = {};
      for (const t of existing) { existingMap[`${t.entity_type}_${t.entity_id}`] = t; }

      let created = 0, updated = 0, skipped = 0;

      for (const row of rows) {
        if (!row['Entity_Type'] || !row['Entity_ID']) { skipped++; continue; }
        const entityType = String(row['Entity_Type']).trim();
        const entityId = String(row['Entity_ID']).trim();

        const data = { entity_type: entityType, entity_id: entityId };
        for (const lang of SUPPORTED_LANGS) {
          const colName = Object.keys(row).find(k => k.toLowerCase() === lang.toLowerCase()) || lang;
          const val = row[colName];
          if (val !== null && val !== undefined && val !== '') {
            data[lang] = String(val).trim();
          }
        }

        const key = `${entityType}_${entityId}`;
        const existing_record = existingMap[key];
        if (existing_record) {
          await withRetry(() => base44.asServiceRole.entities.TranslationLocation.update(existing_record.id, data));
          updated++;
        } else {
          await withRetry(() => base44.asServiceRole.entities.TranslationLocation.create(data));
          created++;
        }
        await sleep(80);
      }

      return Response.json({ success: true, type: 'locations', created, updated, skipped, total: rows.length });
    }

    return Response.json({ error: 'Invalid type. Use: ui | locations' }, { status: 400 });

  } catch (err) {
    console.error('Import error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
});