import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Public endpoint — no auth required (translations are public UI strings)
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let body = {};
    try { body = await req.json(); } catch (_) {}
    const { lang = 'en', module_filter = '' } = body;

    // Fetch all translations (up to 5000 keys)
    const all = await base44.asServiceRole.entities.Translation.list('-created_date', 5000);

    const result = {};
    for (const t of all) {
      if (!t.lang_key) continue;
      // Return the requested language, fall back to English
      result[t.lang_key] = t[lang] || t['en'] || t.lang_key;
    }

    return Response.json({ success: true, lang, translations: result, count: Object.keys(result).length });

  } catch (err) {
    console.error('getTranslations error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
});