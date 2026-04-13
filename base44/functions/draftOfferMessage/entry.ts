import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const CLAUDE_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { sessionId, offerAmount, direction, language, tone, paymentMethod, paymentTimeline, conditions, keyArguments } = await req.json();

  const sessions = await base44.asServiceRole.entities.NegotiationSession.filter({ id: sessionId });
  const session = sessions[0];
  if (!session) return Response.json({ error: 'Session not found' }, { status: 404 });

  const property = session.propertySnapshot || {};
  const listedPrice = session.listedPrice || 0;
  const pct = listedPrice ? Math.round((offerAmount / listedPrice) * 100) : 100;

  const systemPrompt = `You are drafting a professional real estate ${direction} offer message.
Tone: Respectful, confident, professional but warm.
Arabic: Use formal but approachable Modern Standard Arabic.
Include all necessary details. Do NOT reveal the buyer's maximum budget. Do NOT sound desperate.
Respond ONLY with valid JSON.`;

  const userMessage = `Draft a ${direction === 'buy' ? 'purchase' : 'counter'} offer message.

Context:
- Offer amount: ${Number(offerAmount).toLocaleString()} EGP (${pct}% of asking)
- Property: ${property.title || 'the property'} in ${property.district || property.city || 'the area'}
- Payment method: ${paymentMethod}
- Timeline: ${paymentTimeline || 'flexible'}
- Conditions: ${conditions || 'none'}
- Language: ${language}
- Tone: ${tone || 'professional'}
- Key arguments to include: ${(keyArguments || []).join('; ')}

Return this exact JSON:
{
  "subject": string,
  "fullMessage": string,
  "shortVersion": string,
  "keyPoints": [string],
  "warningIfAny": string or null
}`;

  let result;
  if (!CLAUDE_API_KEY) {
    const isArabic = language === 'ar';
    if (isArabic) {
      result = {
        subject: `عرض شراء - ${property.title || 'العقار'}`,
        fullMessage: `السيد/ة البائع الكريم،\n\nيسعدني تقديم عرض رسمي لشراء عقاركم الكريم.\n\nالسعر المقدَّم: ${Number(offerAmount).toLocaleString()} جنيه مصري\nطريقة الدفع: ${paymentMethod === 'cash' ? 'دفع كامل فوري' : 'تمويل بنكي'}\nالجدول الزمني: ${paymentTimeline || 'حسب الاتفاق'}\n\nهذا العرض صادر عن اهتمام جدي بالعقار، ونحن مستعدون للمضي قدمًا بسرعة عند الموافقة.\n\nنتطلع لردكم الكريم.\n\nمع التحية والتقدير`,
        shortVersion: `عرض شراء: ${Number(offerAmount).toLocaleString()} جنيه - ${paymentMethod === 'cash' ? 'دفع فوري' : 'تمويل'} - نرجو ردكم`,
        keyPoints: ["العرض جدي وعاجل", "استعداد للإتمام الفوري", "الدفع مضمون"],
        warningIfAny: null
      };
    } else {
      result = {
        subject: `Formal Purchase Offer — ${property.title || 'Property'}`,
        fullMessage: `Dear Property Owner,\n\nI am pleased to submit a formal offer for your property.\n\nOffer Amount: ${Number(offerAmount).toLocaleString()} EGP\nPayment Method: ${paymentMethod === 'cash' ? 'Full immediate cash payment' : paymentMethod}\nTimeline: ${paymentTimeline || 'As agreed'}\n${conditions ? `Conditions: ${conditions}\n` : ''}\nI have thoroughly reviewed the property and am confident in moving forward quickly upon acceptance.\n\nI look forward to your response and hope we can finalize this deal.\n\nKind regards`,
        shortVersion: `Formal offer: ${Number(offerAmount).toLocaleString()} EGP | ${paymentMethod === 'cash' ? 'Immediate cash' : paymentMethod} | Ready to proceed`,
        keyPoints: [
          "Serious buyer with confirmed funds",
          paymentMethod === 'cash' ? "Immediate full cash payment — no waiting" : "Financing pre-approved and ready",
          "Ready to move quickly upon acceptance"
        ],
        warningIfAny: null
      };
    }
  } else {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      })
    });
    const data = await response.json();
    const text = data.content?.[0]?.text || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    result = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
  }

  return Response.json({ draft: result });
});