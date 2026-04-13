import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Generates the 5 canonical escrow milestones for a deal based on payment structure
// The 5 steps are always: Earnest Deposit → Contract Signing → Legal Due Diligence → Balance Payment → Keys Handover

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { dealTerms, negotiationSessionId } = await req.json();

    const agreedPrice = dealTerms?.agreedPrice || 3500000;
    const earnestPercent = dealTerms?.earnestPercent || 10;
    const paymentStructure = dealTerms?.paymentStructure || "full_cash";
    const propertyTitle = dealTerms?.propertyTitle || "Property";

    const earnestAmount = Math.round(agreedPrice * earnestPercent / 100);
    const balanceAmount = agreedPrice - earnestAmount;

    // The 5 canonical milestones
    const milestones = [
      {
        order: 1,
        name: "Earnest Money Deposit",
        nameAr: "دفع العربون",
        type: "earnest_deposit",
        description: "Buyer deposits earnest money into escrow. Funds are locked. MOU auto-generated for digital signing by both parties.",
        paymentAmount: earnestAmount,
        paymentPercent: earnestPercent,
        autoReleaseDays: null,
        requiredDocs: ["National ID (Buyer)", "National ID (Seller)", "MOU (auto-generated)"]
      },
      {
        order: 2,
        name: "Contract Signing",
        nameAr: "توقيع العقد",
        type: "contract_signing",
        description: "Full sale contract uploaded and signed digitally by both parties. Optional lawyer review available.",
        paymentAmount: 0,
        paymentPercent: 0,
        autoReleaseDays: null,
        requiredDocs: ["Sale Contract", "Power of Attorney (if applicable)"]
      },
      {
        order: 3,
        name: "Legal Due Diligence",
        nameAr: "التحقق القانوني",
        type: "legal_verification",
        description: "Seller uploads title deed. Franchise Owner inspection conducted. AI legal checklist completed. Both parties confirm clean title.",
        paymentAmount: 0,
        paymentPercent: 0,
        autoReleaseDays: null,
        requiredDocs: ["Title Deed (Original)", "Inspection Report", "NOC (if applicable)", "Survey Report"]
      },
      {
        order: 4,
        name: "Balance Payment",
        nameAr: "دفع الرصيد المتبقي",
        type: "balance_payment",
        description: "Buyer pays remaining balance. Funds locked pending handover. Final inspection scheduled by both parties.",
        paymentAmount: balanceAmount,
        paymentPercent: 100 - earnestPercent,
        autoReleaseDays: null,
        requiredDocs: ["Final Payment Receipt", "Final Inspection Report"]
      },
      {
        order: 5,
        name: "Keys Handover",
        nameAr: "تسليم المفاتيح",
        type: "keys_handover",
        description: "Physical handover confirmed by both parties. 24-hour grace period. Full balance auto-released to seller. Fees distributed. Certificate generated.",
        paymentAmount: balanceAmount,
        paymentPercent: 100 - earnestPercent,
        autoReleaseDays: 1, // 24h grace period
        requiredDocs: ["Handover Certificate", "Utility Transfer Documents", "Keys Receipt"]
      }
    ];

    // Mortgage adjustment: add mortgage approval as step 3.5 (shifted)
    if (paymentStructure === "mortgage") {
      milestones.splice(3, 0, {
        order: 3.5,
        name: "Mortgage Approval",
        nameAr: "الموافقة على القرض",
        type: "mortgage_approval",
        description: "Bank mortgage approval obtained by buyer. Loan documents shared with seller.",
        paymentAmount: 0,
        paymentPercent: 0,
        autoReleaseDays: null,
        requiredDocs: ["Mortgage Approval Letter", "Bank Valuation Report"]
      });
      // Re-number
      milestones.forEach((m, i) => { m.order = i + 1; });
    }

    // Build standard conditions
    const conditions = [
      { text: "Title deed verified as free of encumbrances", textAr: "التحقق من خلو سند الملكية من الرهون", required: true },
      { text: "Both parties complete KYC verification", textAr: "إتمام التحقق من الهوية لكلا الطرفين", required: true },
      { text: "Sale contract signed by both parties", textAr: "توقيع عقد البيع من كلا الطرفين", required: true },
      { text: "Property inspection completed satisfactorily", textAr: "إتمام معاينة العقار بشكل مُرضٍ", required: true },
      { text: "All required documents uploaded and verified", textAr: "رفع وتوثيق جميع المستندات المطلوبة", required: true },
      { text: "No outstanding utility bills on the property", textAr: "لا توجد فواتير مرافق متأخرة على العقار", required: false },
    ];

    if (paymentStructure === "mortgage") {
      conditions.push({ text: "Mortgage approval obtained from bank", textAr: "الحصول على موافقة البنك على التمويل", required: true });
    }

    const aiSummary = {
      dealSummaryLetter: `This ${paymentStructure.replace("_", " ")} escrow deal for ${propertyTitle} is structured across ${milestones.length} milestone stages. Total deal value: ${agreedPrice.toLocaleString()} EGP. Earnest money of ${earnestAmount.toLocaleString()} EGP (${earnestPercent}%) secures the deal. Balance of ${balanceAmount.toLocaleString()} EGP released upon keys handover confirmation by both parties.`,
      estimatedTimelineWeeks: paymentStructure === "mortgage" ? 8 : paymentStructure === "full_cash" ? 4 : 6,
      riskLevel: "low",
      aiRecommendations: ["Ensure all documents are uploaded promptly at each stage", "Consider optional FO facilitation for faster resolution"]
    };

    return Response.json({ milestones, conditions, aiSummary });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});