import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const FIRST_TIME_BUYER_JOURNEY = {
  journeyType: 'first_time_buyer',
  journeyName: 'First-Time Buyer Journey',
  journeyNameAr: 'رحلة المشتري لأول مرة',
  journeyDescription: 'A complete step-by-step guide from zero knowledge to owning your first home in Egypt.',
  journeyDescriptionAr: 'دليل شامل خطوة بخطوة من الصفر حتى امتلاك منزلك الأول في مصر.',
  estimatedWeeks: 12,
  stages: [
    {
      stageId: 'stage_1_understand',
      stageName: 'Understand',
      stageNameAr: 'افهم السوق',
      stageOrder: 1,
      stageIcon: '📚',
      stageColor: '#6366f1',
      stageDescription: 'Before you search anything — build your knowledge foundation',
      steps: [
        { stepId: 's1_1', stepName: 'Am I ready to buy?', stepNameAr: 'هل أنا مستعد للشراء؟', stepOrder: 1, stepType: 'quiz', isRequired: true, estimatedMinutes: 10, contentKey: 'ftb_readiness_quiz', triggerCondition: 'always_available', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 50, badgeId: null },
        { stepId: 's1_2', stepName: 'How Egyptian property buying works', stepNameAr: 'كيف يعمل شراء العقارات في مصر', stepOrder: 2, stepType: 'article', isRequired: true, estimatedMinutes: 12, contentKey: 'ftb_how_buying_works', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 50, badgeId: null },
        { stepId: 's1_3', stepName: 'Documents you will need', stepNameAr: 'المستندات التي ستحتاجها', stepOrder: 3, stepType: 'checklist', isRequired: true, estimatedMinutes: 8, contentKey: 'ftb_documents_checklist', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 75, badgeId: null },
        { stepId: 's1_4', stepName: 'What can I afford?', stepNameAr: 'ما الذي أستطيع تحمله؟', stepOrder: 4, stepType: 'tool_use', isRequired: true, estimatedMinutes: 10, contentKey: 'ftb_affordability_calc', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: '/kemedar/advisor', rewardPoints: 75, badgeId: null },
        { stepId: 's1_5', stepName: 'Types of properties explained', stepNameAr: 'أنواع العقارات', stepOrder: 5, stepType: 'article', isRequired: false, estimatedMinutes: 8, contentKey: 'ftb_property_types', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 50, badgeId: null },
        { stepId: 's1_6', stepName: 'Knowledge check quiz', stepNameAr: 'اختبار المعرفة', stepOrder: 6, stepType: 'quiz', isRequired: true, estimatedMinutes: 5, contentKey: 'ftb_stage1_quiz', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 100, badgeId: 'quiz_master' }
      ]
    },
    {
      stageId: 'stage_2_research',
      stageName: 'Research',
      stageNameAr: 'ابحث',
      stageOrder: 2,
      stageIcon: '🔍',
      stageColor: '#0ea5e9',
      stageDescription: 'Finding the right property and area',
      steps: [
        { stepId: 's2_1', stepName: 'Complete your Advisor Profile', stepNameAr: 'أكمل ملفك في المستشار', stepOrder: 1, stepType: 'action', isRequired: true, estimatedMinutes: 15, contentKey: 'ftb_advisor_profile', triggerCondition: 'always_available', completionCondition: 'platform_action:advisor_profile_complete', platformLink: '/kemedar/advisor', rewardPoints: 100, badgeId: 'advisor_graduate' },
        { stepId: 's2_2', stepName: 'How to evaluate a property', stepNameAr: 'كيف تقيّم عقاراً', stepOrder: 2, stepType: 'article', isRequired: true, estimatedMinutes: 10, contentKey: 'ftb_evaluate_property', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 50, badgeId: null },
        { stepId: 's2_3', stepName: 'Save 5+ properties to your shortlist', stepNameAr: 'احفظ 5+ عقارات', stepOrder: 3, stepType: 'action', isRequired: true, estimatedMinutes: 20, contentKey: 'ftb_save_properties', triggerCondition: 'previous_step_complete', completionCondition: 'platform_action:properties_saved_5', platformLink: '/kemedar/search-properties', rewardPoints: 50, badgeId: 'property_saved' },
        { stepId: 's2_4', stepName: 'Try Kemedar Match™', stepNameAr: 'جرّب كيميدار ماتش', stepOrder: 4, stepType: 'tool_use', isRequired: false, estimatedMinutes: 10, contentKey: 'ftb_match_tool', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: '/kemedar/match', rewardPoints: 75, badgeId: null },
        { stepId: 's2_5', stepName: 'Understanding Life Scores', stepNameAr: 'فهم درجات الحياة', stepOrder: 5, stepType: 'article', isRequired: true, estimatedMinutes: 8, contentKey: 'ftb_life_scores', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: '/kemedar/life-score', rewardPoints: 50, badgeId: null },
        { stepId: 's2_6', stepName: 'Compare 3 areas', stepNameAr: 'قارن 3 مناطق', stepOrder: 6, stepType: 'action', isRequired: true, estimatedMinutes: 15, contentKey: 'ftb_compare_areas', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: '/kemedar/life-score', rewardPoints: 75, badgeId: null },
        { stepId: 's2_7', stepName: 'Property viewing checklist', stepNameAr: 'قائمة تفتيش العقار', stepOrder: 7, stepType: 'checklist', isRequired: true, estimatedMinutes: 10, contentKey: 'ftb_viewing_checklist', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 75, badgeId: 'checklist_champion' }
      ]
    },
    {
      stageId: 'stage_3_evaluate',
      stageName: 'Evaluate',
      stageNameAr: 'قيّم',
      stageOrder: 3,
      stageIcon: '🔬',
      stageColor: '#f59e0b',
      stageDescription: 'Narrowing down your choice with data',
      steps: [
        { stepId: 's3_1', stepName: 'How to request a viewing', stepNameAr: 'كيف تطلب زيارة', stepOrder: 1, stepType: 'article', isRequired: true, estimatedMinutes: 8, contentKey: 'ftb_request_viewing', triggerCondition: 'always_available', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 50, badgeId: null },
        { stepId: 's3_2', stepName: 'Request your first viewing', stepNameAr: 'اطلب زيارتك الأولى', stepOrder: 2, stepType: 'action', isRequired: true, estimatedMinutes: 5, contentKey: 'ftb_first_viewing', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: '/kemedar/match', rewardPoints: 100, badgeId: null },
        { stepId: 's3_3', stepName: 'Generate Investment Brief', stepNameAr: 'أنشئ ملخص الاستثمار', stepOrder: 3, stepType: 'tool_use', isRequired: true, estimatedMinutes: 5, contentKey: 'ftb_investment_brief', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: '/kemedar/valuation', rewardPoints: 100, badgeId: null },
        { stepId: 's3_4', stepName: 'Is this price fair?', stepNameAr: 'هل السعر عادل؟', stepOrder: 4, stepType: 'article', isRequired: true, estimatedMinutes: 10, contentKey: 'ftb_price_fairness', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: '/kemedar/predict', rewardPoints: 50, badgeId: null },
        { stepId: 's3_5', stepName: 'Before making an offer checklist', stepNameAr: 'قائمة قبل تقديم عرض', stepOrder: 5, stepType: 'checklist', isRequired: true, estimatedMinutes: 10, contentKey: 'ftb_pre_offer_checklist', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 75, badgeId: null },
        { stepId: 's3_6', stepName: 'Hidden costs of buying', stepNameAr: 'التكاليف الخفية للشراء', stepOrder: 6, stepType: 'article', isRequired: true, estimatedMinutes: 8, contentKey: 'ftb_hidden_costs', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 50, badgeId: null }
      ]
    },
    {
      stageId: 'stage_4_negotiate',
      stageName: 'Negotiate',
      stageNameAr: 'تفاوض',
      stageOrder: 4,
      stageIcon: '🤝',
      stageColor: '#8b5cf6',
      stageDescription: 'Getting the best deal with strategy',
      steps: [
        { stepId: 's4_1', stepName: 'How negotiation works in Egypt', stepNameAr: 'كيف يعمل التفاوض في مصر', stepOrder: 1, stepType: 'article', isRequired: true, estimatedMinutes: 10, contentKey: 'ftb_negotiation_culture', triggerCondition: 'always_available', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 50, badgeId: null },
        { stepId: 's4_2', stepName: 'Run AI Negotiate™ strategy', stepNameAr: 'استخدم استراتيجية التفاوض بالذكاء الاصطناعي', stepOrder: 2, stepType: 'tool_use', isRequired: true, estimatedMinutes: 10, contentKey: 'ftb_negotiate_tool', triggerCondition: 'previous_step_complete', completionCondition: 'platform_action:negotiate_strategy_generated', platformLink: '/kemedar/negotiate', rewardPoints: 200, badgeId: 'first_negotiation' },
        { stepId: 's4_3', stepName: 'Making a formal offer', stepNameAr: 'تقديم عرض رسمي', stepOrder: 3, stepType: 'article', isRequired: true, estimatedMinutes: 8, contentKey: 'ftb_formal_offer', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 50, badgeId: null },
        { stepId: 's4_4', stepName: 'Make your offer', stepNameAr: 'قدّم عرضك', stepOrder: 4, stepType: 'action', isRequired: true, estimatedMinutes: 10, contentKey: 'ftb_make_offer', triggerCondition: 'previous_step_complete', completionCondition: 'platform_action:offer_sent', platformLink: '/kemedar/negotiate', rewardPoints: 200, badgeId: null },
        { stepId: 's4_5', stepName: 'Offer accepted checklist', stepNameAr: 'قائمة بعد قبول العرض', stepOrder: 5, stepType: 'checklist', isRequired: true, estimatedMinutes: 8, contentKey: 'ftb_offer_accepted_checklist', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 75, badgeId: null },
        { stepId: 's4_6', stepName: 'Common negotiation mistakes', stepNameAr: 'أخطاء التفاوض الشائعة', stepOrder: 6, stepType: 'warning', isRequired: false, estimatedMinutes: 5, contentKey: 'ftb_negotiation_mistakes', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 25, badgeId: null }
      ]
    },
    {
      stageId: 'stage_5_secure',
      stageName: 'Secure',
      stageNameAr: 'أمّن الصفقة',
      stageOrder: 5,
      stageIcon: '🔒',
      stageColor: '#ef4444',
      stageDescription: 'Making it legally yours',
      steps: [
        { stepId: 's5_1', stepName: 'The legal process simplified', stepNameAr: 'الإجراءات القانونية بشكل مبسط', stepOrder: 1, stepType: 'article', isRequired: true, estimatedMinutes: 12, contentKey: 'ftb_legal_process', triggerCondition: 'always_available', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 50, badgeId: null },
        { stepId: 's5_2', stepName: 'Set up Kemedar Escrow™', stepNameAr: 'أنشئ ضمان الأمانة', stepOrder: 2, stepType: 'tool_use', isRequired: true, estimatedMinutes: 15, contentKey: 'ftb_escrow_setup', triggerCondition: 'previous_step_complete', completionCondition: 'platform_action:escrow_created', platformLink: '/kemedar/escrow/new', rewardPoints: 500, badgeId: 'escrow_protected' },
        { stepId: 's5_3', stepName: 'What is a title deed?', stepNameAr: 'ما هو عقد الملكية؟', stepOrder: 3, stepType: 'article', isRequired: true, estimatedMinutes: 8, contentKey: 'ftb_title_deed', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 50, badgeId: null },
        { stepId: 's5_4', stepName: 'Legal due diligence checklist', stepNameAr: 'قائمة العناية القانونية', stepOrder: 4, stepType: 'checklist', isRequired: true, estimatedMinutes: 15, contentKey: 'ftb_due_diligence_checklist', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 150, badgeId: null },
        { stepId: 's5_5', stepName: 'The sale contract explained', stepNameAr: 'عقد البيع موضّح', stepOrder: 5, stepType: 'article', isRequired: true, estimatedMinutes: 10, contentKey: 'ftb_sale_contract', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 50, badgeId: null },
        { stepId: 's5_6', stepName: 'Sign and complete your deal', stepNameAr: 'وقّع وأكمل الصفقة', stepOrder: 6, stepType: 'action', isRequired: true, estimatedMinutes: 30, contentKey: 'ftb_sign_deal', triggerCondition: 'previous_step_complete', completionCondition: 'platform_action:escrow_completed', platformLink: '/kemedar/escrow/new', rewardPoints: 300, badgeId: null },
        { stepId: 's5_7', stepName: 'Registration process', stepNameAr: 'إجراءات التسجيل', stepOrder: 7, stepType: 'article', isRequired: true, estimatedMinutes: 8, contentKey: 'ftb_registration', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 50, badgeId: null }
      ]
    },
    {
      stageId: 'stage_6_settle',
      stageName: 'Settle In',
      stageNameAr: 'الاستقرار',
      stageOrder: 6,
      stageIcon: '🏠',
      stageColor: '#10b981',
      stageDescription: 'Starting your life in your new home',
      steps: [
        { stepId: 's6_1', stepName: 'Move-in checklist', stepNameAr: 'قائمة الانتقال', stepOrder: 1, stepType: 'checklist', isRequired: true, estimatedMinutes: 10, contentKey: 'ftb_move_in_checklist', triggerCondition: 'always_available', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 75, badgeId: null },
        { stepId: 's6_2', stepName: 'Plan your finishing', stepNameAr: 'خطط للتشطيب', stepOrder: 2, stepType: 'tool_use', isRequired: false, estimatedMinutes: 15, contentKey: 'ftb_finishing', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: '/kemedar/finish', rewardPoints: 50, badgeId: null },
        { stepId: 's6_3', stepName: 'Your rights as a property owner', stepNameAr: 'حقوقك كمالك', stepOrder: 3, stepType: 'article', isRequired: false, estimatedMinutes: 8, contentKey: 'ftb_owner_rights', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 50, badgeId: null },
        { stepId: 's6_4', stepName: 'Join your area community', stepNameAr: 'انضم لمجتمع منطقتك', stepOrder: 4, stepType: 'action', isRequired: false, estimatedMinutes: 5, contentKey: 'ftb_community', triggerCondition: 'previous_step_complete', completionCondition: 'platform_action:community_joined', platformLink: '/kemedar/community', rewardPoints: 75, badgeId: 'community_member' },
        { stepId: 's6_5', stepName: 'Protecting your investment', stepNameAr: 'حماية استثمارك', stepOrder: 5, stepType: 'article', isRequired: false, estimatedMinutes: 8, contentKey: 'ftb_protect_investment', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 50, badgeId: null },
        { stepId: 's6_6', stepName: '🎉 Journey Complete!', stepNameAr: '🎉 اكتملت الرحلة!', stepOrder: 6, stepType: 'celebration', isRequired: true, estimatedMinutes: 3, contentKey: 'ftb_journey_complete', triggerCondition: 'previous_step_complete', completionCondition: 'auto_on_unlock', platformLink: null, rewardPoints: 1000, badgeId: 'journey_complete' }
      ]
    }
  ],
  milestones: [
    { milestoneId: 'ms_1', milestoneAfterStage: 'stage_1_understand', milestoneName: "You're Ready to Research!", milestoneIcon: '🎓', celebrationMessage: "You now know more about Egyptian real estate than most first-time buyers. Let's find your perfect match!", celebrationMessageAr: 'أنت الآن تعرف أكثر عن العقارات المصرية من معظم المشترين للمرة الأولى. لنجد منزلك المثالي!' },
    { milestoneId: 'ms_2', milestoneAfterStage: 'stage_2_research', milestoneName: 'You Found Your Shortlist!', milestoneIcon: '🏠', celebrationMessage: 'Properties researched, areas compared — you are ready to evaluate!', celebrationMessageAr: 'تم بحث العقارات ومقارنة المناطق — أنت جاهز للتقييم!' },
    { milestoneId: 'ms_3', milestoneAfterStage: 'stage_3_evaluate', milestoneName: "You're Making an Informed Decision!", milestoneIcon: '💡', celebrationMessage: "Great work checking everything. Now let's negotiate smartly!", celebrationMessageAr: 'عمل رائع في التحقق من كل شيء. الآن لنتفاوض بذكاء!' },
    { milestoneId: 'ms_4', milestoneAfterStage: 'stage_4_negotiate', milestoneName: "Offer Made! You're Almost There!", milestoneIcon: '🤝', celebrationMessage: "The hard part is done. Now let's secure your deal safely.", celebrationMessageAr: 'الجزء الصعب انتهى. الآن لنؤمن صفقتك بأمان.' },
    { milestoneId: 'ms_5', milestoneAfterStage: 'stage_5_secure', milestoneName: "You're a Homeowner! 🎉", milestoneIcon: '🔑', celebrationMessage: 'Congratulations! This is a huge milestone. Welcome to your new chapter!', celebrationMessageAr: 'تهانينا! هذا إنجاز ضخم. مرحبًا بك في فصلك الجديد!' }
  ]
};

const OTHER_JOURNEYS = [
  {
    journeyType: 'property_seller',
    journeyName: 'Property Seller Journey',
    journeyNameAr: 'رحلة بائع العقار',
    journeyDescription: 'Sell your property at the best price with maximum exposure.',
    journeyDescriptionAr: 'بع عقارك بأفضل سعر مع أقصى قدر من الظهور.',
    estimatedWeeks: 8,
    stages: [
      { stageId: 'sel_1_prepare', stageName: 'Prepare', stageNameAr: 'استعد', stageOrder: 1, stageIcon: '📋', stageColor: '#6366f1', stageDescription: 'Price and document your property', steps: [
        { stepId: 'sel1_1', stepName: 'Price your property correctly', stepNameAr: 'سعّر عقارك بشكل صحيح', stepOrder: 1, stepType: 'tool_use', isRequired: true, estimatedMinutes: 15, contentKey: 'sel_pricing', triggerCondition: 'always_available', completionCondition: 'user_marks_done', platformLink: '/kemedar/valuation', rewardPoints: 100, badgeId: null },
        { stepId: 'sel1_2', stepName: 'Gather required documents', stepNameAr: 'اجمع المستندات المطلوبة', stepOrder: 2, stepType: 'checklist', isRequired: true, estimatedMinutes: 10, contentKey: 'sel_documents', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 75, badgeId: null }
      ]},
      { stageId: 'sel_2_list', stageName: 'List', stageNameAr: 'انشر', stageOrder: 2, stageIcon: '📸', stageColor: '#0ea5e9', stageDescription: 'Create a winning listing', steps: [
        { stepId: 'sel2_1', stepName: 'Create your listing', stepNameAr: 'أنشئ إعلانك', stepOrder: 1, stepType: 'action', isRequired: true, estimatedMinutes: 20, contentKey: 'sel_create_listing', triggerCondition: 'always_available', completionCondition: 'user_marks_done', platformLink: '/kemedar/add/property', rewardPoints: 100, badgeId: null },
        { stepId: 'sel2_2', stepName: 'Set up Virtual Tour', stepNameAr: 'أنشئ جولة افتراضية', stepOrder: 2, stepType: 'tool_use', isRequired: false, estimatedMinutes: 15, contentKey: 'sel_virtual_tour', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 75, badgeId: null }
      ]},
      { stageId: 'sel_3_close', stageName: 'Close', stageNameAr: 'أغلق الصفقة', stageOrder: 3, stageIcon: '🔒', stageColor: '#10b981', stageDescription: 'Secure and complete the sale', steps: [
        { stepId: 'sel3_1', stepName: 'Set up Escrow™ for security', stepNameAr: 'أنشئ ضمان الأمانة', stepOrder: 1, stepType: 'tool_use', isRequired: true, estimatedMinutes: 15, contentKey: 'sel_escrow', triggerCondition: 'always_available', completionCondition: 'platform_action:escrow_created', platformLink: '/kemedar/escrow/new', rewardPoints: 500, badgeId: null }
      ]}
    ],
    milestones: [
      { milestoneId: 'sel_ms_1', milestoneAfterStage: 'sel_2_list', milestoneName: 'Listed & Live!', milestoneIcon: '🎉', celebrationMessage: 'Your property is now visible to thousands of potential buyers!', celebrationMessageAr: 'عقارك الآن مرئي لآلاف المشترين المحتملين!' }
    ]
  },
  {
    journeyType: 'investor',
    journeyName: 'Real Estate Investor Journey',
    journeyNameAr: 'رحلة المستثمر العقاري',
    journeyDescription: 'Build wealth through strategic real estate investment in Egypt.',
    journeyDescriptionAr: 'بناء الثروة من خلال الاستثمار العقاري الاستراتيجي في مصر.',
    estimatedWeeks: 16,
    stages: [
      { stageId: 'inv_1_strategy', stageName: 'Investment Strategy', stageNameAr: 'استراتيجية الاستثمار', stageOrder: 1, stageIcon: '📊', stageColor: '#f59e0b', stageDescription: 'Define your investment goals', steps: [
        { stepId: 'inv1_1', stepName: 'Define your investment goals', stepNameAr: 'حدد أهداف استثمارك', stepOrder: 1, stepType: 'quiz', isRequired: true, estimatedMinutes: 10, contentKey: 'inv_goals', triggerCondition: 'always_available', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 50, badgeId: null },
        { stepId: 'inv1_2', stepName: 'ROI calculation basics', stepNameAr: 'أساسيات حساب العائد', stepOrder: 2, stepType: 'article', isRequired: true, estimatedMinutes: 12, contentKey: 'inv_roi', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 75, badgeId: null }
      ]},
      { stageId: 'inv_2_market', stageName: 'Market Analysis', stageNameAr: 'تحليل السوق', stageOrder: 2, stageIcon: '📈', stageColor: '#8b5cf6', stageDescription: 'Read the market like a pro', steps: [
        { stepId: 'inv2_1', stepName: 'How to read Predict™ data', stepNameAr: 'كيف تقرأ بيانات التنبؤ', stepOrder: 1, stepType: 'tool_use', isRequired: true, estimatedMinutes: 15, contentKey: 'inv_predict', triggerCondition: 'always_available', completionCondition: 'user_marks_done', platformLink: '/kemedar/predict', rewardPoints: 100, badgeId: null }
      ]}
    ],
    milestones: [
      { milestoneId: 'inv_ms_1', milestoneAfterStage: 'inv_1_strategy', milestoneName: 'Investor Mindset Unlocked!', milestoneIcon: '💰', celebrationMessage: 'You think like an investor now. Time to find your first deal!', celebrationMessageAr: 'أنت تفكر الآن كمستثمر. حان وقت إيجاد صفقتك الأولى!' }
    ]
  },
  {
    journeyType: 'expat_buyer',
    journeyName: 'Expat Buyer Journey',
    journeyNameAr: 'رحلة المغترب المشتري',
    journeyDescription: 'Buy property in Egypt remotely with full local support.',
    journeyDescriptionAr: 'اشتر عقاراً في مصر عن بُعد مع دعم محلي كامل.',
    estimatedWeeks: 14,
    stages: [
      { stageId: 'exp_1_remote', stageName: 'Remote Readiness', stageNameAr: 'الاستعداد عن بُعد', stageOrder: 1, stageIcon: '🌍', stageColor: '#0ea5e9', stageDescription: 'Set up for remote buying', steps: [
        { stepId: 'exp1_1', stepName: 'Complete your Expat Profile', stepNameAr: 'أكمل ملفك كمغترب', stepOrder: 1, stepType: 'action', isRequired: true, estimatedMinutes: 15, contentKey: 'exp_profile', triggerCondition: 'always_available', completionCondition: 'user_marks_done', platformLink: '/kemedar/expat/setup', rewardPoints: 100, badgeId: null },
        { stepId: 'exp1_2', stepName: 'Power of Attorney explained', stepNameAr: 'شرح التوكيل الرسمي', stepOrder: 2, stepType: 'article', isRequired: true, estimatedMinutes: 10, contentKey: 'exp_poa', triggerCondition: 'previous_step_complete', completionCondition: 'user_marks_done', platformLink: '/kemedar/expat/legal', rewardPoints: 75, badgeId: null }
      ]},
      { stageId: 'exp_2_fo', stageName: 'FO Partnership', stageNameAr: 'شراكة مالك الامتياز', stageOrder: 2, stageIcon: '🤝', stageColor: '#f59e0b', stageDescription: 'Work with your local Franchise Owner', steps: [
        { stepId: 'exp2_1', stepName: 'Meet your FO', stepNameAr: 'تعرف على مالك الامتياز', stepOrder: 1, stepType: 'action', isRequired: true, estimatedMinutes: 20, contentKey: 'exp_meet_fo', triggerCondition: 'always_available', completionCondition: 'user_marks_done', platformLink: '/kemedar/expat/dashboard', rewardPoints: 100, badgeId: null }
      ]}
    ],
    milestones: [
      { milestoneId: 'exp_ms_1', milestoneAfterStage: 'exp_1_remote', milestoneName: 'Ready to Buy Remotely!', milestoneIcon: '🌍', celebrationMessage: 'Your remote buying setup is complete. Your FO is ready to help!', celebrationMessageAr: 'إعداد الشراء عن بُعد مكتمل. مالك الامتياز جاهز للمساعدة!' }
    ]
  },
  {
    journeyType: 'first_time_renter',
    journeyName: 'First-Time Renter Journey',
    journeyNameAr: 'رحلة المستأجر لأول مرة',
    journeyDescription: 'Find, secure, and enjoy your first rental in Egypt.',
    journeyDescriptionAr: 'ابحث وأمّن واستمتع بأول إيجار لك في مصر.',
    estimatedWeeks: 4,
    stages: [
      { stageId: 'rent_1_rights', stageName: 'Know Your Rights', stageNameAr: 'اعرف حقوقك', stageOrder: 1, stageIcon: '⚖️', stageColor: '#6366f1', stageDescription: "Understanding tenant rights in Egypt", steps: [
        { stepId: 'rent1_1', stepName: 'Tenant rights in Egypt', stepNameAr: 'حقوق المستأجر في مصر', stepOrder: 1, stepType: 'article', isRequired: true, estimatedMinutes: 10, contentKey: 'rent_rights', triggerCondition: 'always_available', completionCondition: 'user_marks_done', platformLink: null, rewardPoints: 50, badgeId: null }
      ]}
    ],
    milestones: []
  }
];

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });

  const allJourneys = [FIRST_TIME_BUYER_JOURNEY, ...OTHER_JOURNEYS];
  const results = [];

  for (const journey of allJourneys) {
    const existing = await base44.entities.CoachJourney.filter({ journeyType: journey.journeyType });
    if (existing.length > 0) {
      await base44.entities.CoachJourney.update(existing[0].id, journey);
      results.push({ journeyType: journey.journeyType, action: 'updated' });
    } else {
      await base44.entities.CoachJourney.create(journey);
      results.push({ journeyType: journey.journeyType, action: 'created' });
    }
  }

  return Response.json({ success: true, results });
});