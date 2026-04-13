import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const SYSTEM_PROMPTS = {
  property: `You are a professional real estate copywriter for Kemedar, a global proptech platform. Generate compelling, accurate and SEO-friendly property listing content. Be factual, professional and highlight key selling points. Respond ONLY with valid JSON, no markdown.`,
  project: `You are a real estate development copywriter specializing in off-plan property marketing for Kemedar platform. Create compelling project descriptions that appeal to investors and buyers. Respond ONLY with valid JSON.`,
  service: `You are a professional service listing copywriter for Kemework, a home services marketplace. Create clear, trustworthy service descriptions that help homeowners understand the service value. Respond ONLY with valid JSON.`,
  task: `You are helping a homeowner post a clear task description on Kemework to attract the best professionals. Create a clear, specific task description that gives professionals all the info they need to bid accurately. Respond ONLY with valid JSON.`,
  product: `You are a product listing specialist for Kemetro, a building materials and home products marketplace. Create accurate, SEO-optimized product descriptions that help buyers make informed decisions. Respond ONLY with valid JSON.`,
  buyRequest: `You are helping a property buyer create a clear buying request on Kemedar. Write a clear, specific request that helps sellers and agents find the perfect match. Respond ONLY with valid JSON.`,
};

const USER_PROMPTS = {
  property: {
    title: (d) => `Generate a property listing title (max 80 characters) for:
Category: ${d.category || d.category_name || 'Apartment'}
Purpose: ${d.purpose || 'For Sale'}
Location: ${[d.district_name, d.city_name].filter(Boolean).join(', ') || 'Not specified'}
Bedrooms: ${d.beds || d.bedrooms || 'N/A'}
Key feature: ${d.view_type || (d.amenities || [])[0] || 'Premium'}
Return JSON: { "title": "string" }`,
    shortDescription: (d) => `Generate a short property description (max 200 characters, punchy and highlights key benefits) for:
Category: ${d.category || 'Apartment'}, Purpose: ${d.purpose || 'For Sale'}, Location: ${d.city_name || ''}, Beds: ${d.beds || ''}, Area: ${d.area_size || ''}sqm, Price: ${d.price_amount || ''}
Return JSON: { "shortDescription": "string" }`,
    description: (d) => `Generate a full property listing description (300-500 words) that includes:
1. Opening hook (1-2 sentences)
2. Property highlights (key specs)
3. Location advantages
4. Amenities and features
5. Investment or lifestyle appeal
6. Closing call-to-action
Property data: ${JSON.stringify(d)}
Return JSON: { "description": "string" }`,
  },
  project: {
    title: (d) => `Generate a project listing title (max 80 chars, format: "Project Name — City | Key Feature") for:
Project: ${d.title || d.name || ''}, Developer: ${d.developer_name || ''}, City: ${d.city_name || ''}, Min price: ${d.min_price || ''}, Unit types: ${(d.unit_types || []).join(', ')}
Return JSON: { "title": "string" }`,
    shortDescription: (d) => `Generate a short project description (max 200 chars, investment appeal, delivery date, key USP) for:
${JSON.stringify(d)}
Return JSON: { "shortDescription": "string" }`,
    description: (d) => `Generate a full project description (400-600 words) covering: project vision, location, unit types, payment plan, developer credentials, investment angle, amenities and lifestyle.
Project data: ${JSON.stringify(d)}
Return JSON: { "description": "string" }`,
  },
  service: {
    title: (d) => `Generate a clear service title (max 80 chars, format: "Expert [Service] — [Specialization]") for:
Category: ${d.category || ''}, Tags: ${(d.tags || []).join(', ')}, Experience: ${d.experience_years || 0} years
Return JSON: { "title": "string" }`,
    shortDescription: (d) => `Generate a short service description (max 200 chars: what's included, turnaround, experience highlight) for:
${JSON.stringify(d)}
Return JSON: { "shortDescription": "string" }`,
    description: (d) => `Generate a full service description (250-400 words) covering: service overview, what's included, professional credentials, process/how it works, guarantee/warranty, why choose this professional.
Service data: ${JSON.stringify(d)}
Return JSON: { "description": "string" }`,
  },
  task: {
    title: (d) => `Generate a clear task title (max 60 chars, format: "[Action] [Task Type] — [City], [District]") for:
Category: ${d.category || ''}, City: ${d.city || ''}, Address: ${d.address || ''}
Return JSON: { "title": "string" }`,
    shortDescription: (d) => `Generate a short task overview (max 150 chars: quick task overview, location, urgent if applicable) for:
${JSON.stringify(d)}
Return JSON: { "shortDescription": "string" }`,
    description: (d) => `Generate a detailed task description (150-300 words) covering: detailed requirements, specific location and access info, materials (provided or needed), timeline requirements, budget expectations, special requirements.
Task data: ${JSON.stringify(d)}
Return JSON: { "description": "string" }`,
  },
  product: {
    title: (d) => `Generate a product listing title (max 120 chars, format: "[Spec] [Product Type] — [Key Feature] | [Brand]") for:
Product: ${d.name_en || ''}, Category: ${d.category || ''}, Brand: ${d.brand || ''}, Subcategory: ${d.subcategory || ''}
Return JSON: { "title": "string" }`,
    shortDescription: (d) => `Generate a short product description (max 200 chars: key specs, use case, material, quantity info) for:
${JSON.stringify(d)}
Return JSON: { "shortDescription": "string" }`,
    description: (d) => `Generate a full product description (200-400 words) covering: product overview, technical specifications, material and quality details, applications and use cases, installation notes, package contents, compatibility information.
Product data: ${JSON.stringify(d)}
Return JSON: { "description": "string" }`,
  },
  buyRequest: {
    title: (d) => `Generate a clear buy request title (max 70 chars, format: "Wanted: [Beds]-Bed [Type] in [City] | Budget [Amount]") for:
Categories: ${(d.category_ids || []).join(', ')}, Purpose: ${d.purpose || ''}, Budget: ${d.budget || ''} ${d.currency || ''}, Beds: ${d.beds || ''}
Return JSON: { "title": "string" }`,
    description: (d) => `Generate a clear buy request description (200-350 words) covering: what buyer is looking for, must-have requirements, nice-to-have preferences, budget range and payment method, timeline/urgency, contact preference.
Request data: ${JSON.stringify(d)}
Return JSON: { "description": "string" }`,
  },
};

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { formType, fieldType, formData, language } = await req.json();

  const systemPrompt = SYSTEM_PROMPTS[formType];
  const userPromptFn = USER_PROMPTS[formType]?.[fieldType];

  if (!systemPrompt || !userPromptFn) {
    return Response.json({ error: 'Invalid formType or fieldType' }, { status: 400 });
  }

  let userPrompt = userPromptFn(formData);

  if (language === 'ar') {
    userPrompt += `\n\nGenerate the Arabic version. Use Modern Standard Arabic (MSA). Arabic reads right-to-left. Keep proper real estate/professional terminology. Return the same JSON keys but with Arabic values.`;
  }

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) {
    return Response.json({ error: 'API key not configured' }, { status: 500 });
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return Response.json({ error: `API error: ${err}` }, { status: 500 });
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || '';

  let parsed;
  try {
    // Strip any markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    return Response.json({ error: 'Failed to parse AI response', raw: text }, { status: 500 });
  }

  return Response.json({ result: parsed });
});