import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import * as XLSX from 'npm:xlsx@0.18.5';

const EGYPT_COUNTRY_ID = '69d0b93e19cff6ef7d6a38a7';
const EGYPT_PROVINCE_ID = '69d0ba78b2324457d06b088f';
const FILE_URL = 'https://media.base44.com/files/public/69c6065775877f52af7313ef/6b35a2adb_Egypt_Locations_Merged_Deduped.xlsx';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function createWithRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (e.message?.includes('Rate limit') && i < retries - 1) {
        console.log(`Rate limited, waiting 3s...`);
        await sleep(3000);
      } else {
        throw e;
      }
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

    // Parse request body for mode
    let body = {};
    try { body = await req.json(); } catch (_) {}
    const mode = body.mode || 'cities'; // cities | districts | areas

    // Fetch & parse Excel
    const fileRes = await fetch(FILE_URL);
    const arrayBuffer = await fileRes.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    const sheet = workbook.Sheets['All Locations'];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

    if (mode === 'cities') {
      // ── Create Cities ──────────────────────────────────────────────
      const cityNames = [...new Set(rows.map(r => r['Governorate/city/state']).filter(Boolean))];
      console.log(`Creating ${cityNames.length} cities...`);
      let count = 0;
      for (const name of cityNames) {
        await createWithRetry(() => base44.asServiceRole.entities.City.create({
          name,
          province_id: EGYPT_PROVINCE_ID,
        }));
        count++;
        await sleep(100);
      }
      return Response.json({ success: true, mode: 'cities', count });
    }

    if (mode === 'districts') {
      // Load existing cities to build map
      const offset = body.offset || 0;
      const batchSize = body.batchSize || 50;

      const existingCities = await base44.asServiceRole.entities.City.list('-created_date', 200);
      const cityMap = {};
      for (const c of existingCities) { cityMap[c.name] = c.id; }

      // Build unique districts
      const seenDistricts = new Set();
      const uniqueDistricts = [];
      for (const r of rows) {
        if (!r['District'] || !r['Governorate/city/state']) continue;
        const key = `${r['Governorate/city/state']}|${r['District']}`;
        if (!seenDistricts.has(key)) {
          seenDistricts.add(key);
          uniqueDistricts.push({ city: r['Governorate/city/state'], district: r['District'] });
        }
      }

      const batch = uniqueDistricts.slice(offset, offset + batchSize);
      console.log(`Creating districts ${offset} to ${offset + batch.length} of ${uniqueDistricts.length}`);

      let count = 0;
      for (const { city, district } of batch) {
        const cityId = cityMap[city];
        if (!cityId) { console.log(`No cityId for: ${city}`); continue; }
        await createWithRetry(() => base44.asServiceRole.entities.District.create({
          name: district,
          city_id: cityId,
        }));
        count++;
        await sleep(150);
      }
      return Response.json({
        success: true, mode: 'districts',
        created: count, offset, batchSize,
        total: uniqueDistricts.length,
        nextOffset: offset + batchSize < uniqueDistricts.length ? offset + batchSize : null,
      });
    }

    if (mode === 'areas') {
      const offset = body.offset || 0;
      const batchSize = body.batchSize || 50;

      // Load existing cities and districts
      const existingCities = await base44.asServiceRole.entities.City.list('-created_date', 200);
      const existingDistricts = await base44.asServiceRole.entities.District.list('-created_date', 500);

      const cityMap = {};
      for (const c of existingCities) { cityMap[c.name] = c.id; }
      const districtMap = {};
      for (const d of existingDistricts) { districtMap[`${d.name}`] = d.id; }

      const areaRows = rows.filter(r => r['Area'] && r['District'] && r['Governorate/city/state']);
      const batch = areaRows.slice(offset, offset + batchSize);
      console.log(`Creating areas ${offset} to ${offset + batch.length} of ${areaRows.length}`);

      let count = 0;
      for (const r of batch) {
        const districtId = districtMap[r['District']];
        if (!districtId) { console.log(`No districtId for: ${r['District']}`); continue; }
        await createWithRetry(() => base44.asServiceRole.entities.Area.create({
          name: r['Area'],
          district_id: districtId,
        }));
        count++;
        await sleep(150);
      }
      return Response.json({
        success: true, mode: 'areas',
        created: count, offset, batchSize,
        total: areaRows.length,
        nextOffset: offset + batchSize < areaRows.length ? offset + batchSize : null,
      });
    }

    return Response.json({ error: 'Unknown mode. Use: cities | districts | areas' }, { status: 400 });
  } catch (err) {
    console.error('Import error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
});