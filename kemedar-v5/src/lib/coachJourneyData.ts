// @ts-nocheck
// Embedded First-Time Buyer journey for offline/fast rendering
export const JOURNEY_META = {
  first_time_buyer: { name: 'First-Time Buyer Journey', nameAr: 'رحلة المشتري لأول مرة', icon: '🏠', color: '#f97316', weeks: 12 },
  property_upgrader: { name: 'Property Upgrader Journey', nameAr: 'رحلة الترقية العقارية', icon: '🔄', color: '#8b5cf6', weeks: 10 },
  investor: { name: 'Real Estate Investor Journey', nameAr: 'رحلة المستثمر العقاري', icon: '💰', color: '#f59e0b', weeks: 16 },
  first_time_renter: { name: 'First-Time Renter Journey', nameAr: 'رحلة المستأجر لأول مرة', icon: '🔑', color: '#0ea5e9', weeks: 4 },
  property_seller: { name: 'Property Seller Journey', nameAr: 'رحلة بائع العقار', icon: '🏡', color: '#10b981', weeks: 8 },
  expat_buyer: { name: 'Expat Buyer Journey', nameAr: 'رحلة المغترب المشتري', icon: '🌍', color: '#6366f1', weeks: 14 },
  kemework_professional: { name: 'Kemework Pro Journey', nameAr: 'رحلة محترف كيميورك', icon: '👷', color: '#84cc16', weeks: 6 },
  kemetro_seller: { name: 'Kemetro Seller Journey', nameAr: 'رحلة بائع كيميترو', icon: '🏭', color: '#06b6d4', weeks: 4 },
};

export const ACHIEVEMENT_DEFS = [
  { id: 'journey_begins', name: 'Journey Begins', nameAr: 'بداية الرحلة', icon: '🌱', points: 50, type: 'stage_complete' },
  { id: 'first_lesson', name: 'First Lesson', nameAr: 'أول درس', icon: '📚', points: 50, type: 'stage_complete' },
  { id: 'quiz_master', name: 'Quiz Master', nameAr: 'سيد الاختبارات', icon: '🧠', points: 100, type: 'quiz_perfect' },
  { id: 'checklist_champion', name: 'Checklist Champion', nameAr: 'بطل قوائم التحقق', icon: '✅', points: 75, type: 'stage_complete' },
  { id: 'stage_complete', name: 'Stage Complete', nameAr: 'مرحلة مكتملة', icon: '🎯', points: 200, type: 'stage_complete' },
  { id: 'halfway_there', name: 'Halfway There', nameAr: 'في المنتصف', icon: '🏁', points: 300, type: 'milestone_reached' },
  { id: 'journey_complete', name: 'Journey Complete!', nameAr: 'الرحلة مكتملة!', icon: '🏆', points: 1000, type: 'journey_complete' },
  { id: 'streak_3', name: '3-Day Streak', nameAr: 'سلسلة 3 أيام', icon: '🔥', points: 100, type: 'streak' },
  { id: 'week_warrior', name: 'Week Warrior', nameAr: 'محارب الأسبوع', icon: '🔥', points: 300, type: 'streak' },
  { id: 'first_question', name: 'First Question', nameAr: 'أول سؤال', icon: '💬', points: 25, type: 'stage_complete' },
  { id: 'speed_learner', name: 'Speed Learner', nameAr: 'المتعلم السريع', icon: '⚡', points: 200, type: 'speed_learner' },
  { id: 'advisor_graduate', name: 'Advisor Graduate', nameAr: 'خريج المستشار', icon: '🤖', points: 100, type: 'stage_complete' },
  { id: 'first_negotiation', name: 'First Negotiation', nameAr: 'أول تفاوض', icon: '🤝', points: 200, type: 'milestone_reached' },
  { id: 'escrow_protected', name: 'Escrow Protected', nameAr: 'محمي بالأمانة', icon: '🔒', points: 500, type: 'milestone_reached' },
  { id: 'community_member', name: 'Community Member', nameAr: 'عضو المجتمع', icon: '🏘', points: 75, type: 'stage_complete' },
  { id: 'comeback', name: 'Comeback', nameAr: 'العودة', icon: '🤝', points: 50, type: 'comeback' },
  { id: 'property_saved', name: 'Property Saved', nameAr: 'عقار محفوظ', icon: '🏠', points: 50, type: 'stage_complete' },
];

export const STEP_TYPE_STYLES = {
  article: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', icon: '📖', label: 'Article' },
  checklist: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', icon: '✅', label: 'Checklist' },
  quiz: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', icon: '🧠', label: 'Quiz' },
  tool_use: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', icon: '🛠️', label: 'Tool Use' },
  action: { bg: 'bg-teal-50', border: 'border-teal-200', badge: 'bg-teal-100 text-teal-700', icon: '⚡', label: 'Action' },
  celebration: { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700', icon: '🎉', label: 'Milestone' },
  warning: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', icon: '⚠️', label: 'Warning' },
  decision: { bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700', icon: '🤔', label: 'Decision' },
};

export const INLINE_CONTENT = {
  ftb_documents_checklist: {
    checklistItems: [
      { itemId: 'doc1', text: 'National ID / Passport (valid copy)', textAr: 'بطاقة الهوية الوطنية / جواز السفر', isRequired: true, helpText: 'You need at least 2 copies. Both sides.' },
      { itemId: 'doc2', text: 'Proof of income (salary slip or bank certificate)', textAr: 'إثبات الدخل', isRequired: true, helpText: 'Last 3 months if employed, or tax return if self-employed.' },
      { itemId: 'doc3', text: 'Bank statements (last 3 months)', textAr: 'كشف حساب (آخر 3 شهور)', isRequired: true, helpText: 'All accounts you plan to use for payment.' },
      { itemId: 'doc4', text: 'Pre-approval letter from bank (if using mortgage)', textAr: 'خطاب الموافقة المبدئية من البنك', isRequired: false, helpText: 'Strongly recommended — sellers take you more seriously.' },
      { itemId: 'doc5', text: 'Family book (Daftar El-3aela)', textAr: 'دفتر العائلة', isRequired: false, helpText: 'Required in some transactions, especially resale.' },
      { itemId: 'doc6', text: 'Tax clearance certificate (from seller)', textAr: 'شهادة براءة الذمة الضريبية', isRequired: true, helpText: 'The seller must provide this — do not skip.' },
    ]
  },
  ftb_viewing_checklist: {
    checklistItems: [
      { itemId: 'view1', text: 'Check natural light at different times of day', textAr: 'تحقق من الإضاءة الطبيعية', isRequired: false, helpText: 'Visit morning AND afternoon if possible.' },
      { itemId: 'view2', text: 'Test water pressure in all taps and shower', textAr: 'اختبر ضغط المياه', isRequired: true, helpText: 'Low pressure = plumbing problems. Turn on multiple taps at once.' },
      { itemId: 'view3', text: 'Check all light switches and power sockets', textAr: 'تحقق من جميع المفاتيح والمقابس الكهربائية', isRequired: true, helpText: 'Test every socket with your phone charger.' },
      { itemId: 'view4', text: 'Look for water stains on ceilings and walls', textAr: 'ابحث عن آثار المياه في الأسقف', isRequired: true, helpText: 'Yellow/brown stains = water damage = expensive repair.' },
      { itemId: 'view5', text: 'Check building entrance and lobby condition', textAr: 'تحقق من مدخل البناية', isRequired: false, helpText: 'Reflects the building management quality.' },
      { itemId: 'view6', text: 'Ask about monthly service charges', textAr: 'اسأل عن رسوم الخدمة الشهرية', isRequired: true, helpText: 'Can range from 200 to 2000+ EGP per month.' },
      { itemId: 'view7', text: 'Verify parking space is included', textAr: 'تحقق من موقف السيارة', isRequired: false, helpText: 'Ask to see the actual parking space, not just a promise.' },
      { itemId: 'view8', text: 'Check mobile signal inside the unit', textAr: 'تحقق من إشارة الموبايل داخل الوحدة', isRequired: false, helpText: 'Check all carriers if possible. Thick concrete can block signal.' },
      { itemId: 'view9', text: 'Talk to a neighbor if possible', textAr: 'تحدث مع أحد الجيران', isRequired: false, helpText: 'Neighbors reveal what sellers hide — management issues, noise, etc.' },
      { itemId: 'view10', text: 'Check for cracks in walls or ceilings', textAr: 'ابحث عن شقوق في الجدران', isRequired: true, helpText: 'Hairline cracks OK. Wide cracks = structural issue.' },
      { itemId: 'view11', text: 'Open and close all doors and windows', textAr: 'افتح وأغلق جميع الأبواب والنوافذ', isRequired: true, helpText: 'Sticking = humidity damage or poor installation.' },
      { itemId: 'view12', text: 'Check storage and closet space', textAr: 'تحقق من مساحة التخزين', isRequired: false, helpText: 'Many Egyptian apartments lack storage. Plan ahead.' },
    ]
  },
  ftb_pre_offer_checklist: {
    checklistItems: [
      { itemId: 'pre1', text: 'Viewed the property (physical or virtual)', textAr: 'شاهدت العقار', isRequired: true },
      { itemId: 'pre2', text: 'Checked Life Score of the area', textAr: 'تحققت من درجة الحياة للمنطقة', isRequired: true },
      { itemId: 'pre3', text: 'Compared with at least 2 similar properties', textAr: 'قارنت مع عقارين مماثلين على الأقل', isRequired: true },
      { itemId: 'pre4', text: 'Understood all fees: registration (2.5%), notary (~1%), agent (2-3%)', textAr: 'فهمت جميع الرسوم', isRequired: true },
      { itemId: 'pre5', text: 'Confirmed property legal status', textAr: 'تأكدت من الوضع القانوني للعقار', isRequired: true },
      { itemId: 'pre6', text: 'Decided on your maximum price', textAr: 'حددت الحد الأقصى لسعرك', isRequired: true, helpText: 'Never share this number with the seller!' },
      { itemId: 'pre7', text: 'Prepared your opening offer (10-15% below asking)', textAr: 'جهّزت عرضك الافتتاحي', isRequired: true },
    ]
  },
  ftb_due_diligence_checklist: {
    checklistItems: [
      { itemId: 'dd1', text: 'Request original title deed (not a copy)', textAr: 'اطلب عقد الملكية الأصلي', isRequired: true, helpText: 'Insist on seeing the original. Photocopies can be faked.' },
      { itemId: 'dd2', text: 'Verify no mortgages or liens on property', textAr: 'تحقق من عدم وجود رهن على العقار', isRequired: true, helpText: 'Ask at the Real Estate Registry office.' },
      { itemId: 'dd3', text: 'Check no outstanding service charges', textAr: 'تحقق من عدم وجود رسوم خدمات متأخرة', isRequired: true },
      { itemId: 'dd4', text: "Verify seller's ID matches the deed name exactly", textAr: 'تحقق من تطابق هوية البائع مع عقد الملكية', isRequired: true },
      { itemId: 'dd5', text: 'Confirm building permits are valid', textAr: 'تحقق من صحة تراخيص البناء', isRequired: true },
      { itemId: 'dd6', text: 'Check for any legal disputes on the property', textAr: 'تحقق من أي نزاعات قانونية', isRequired: true, helpText: 'Ask a lawyer to run a title search.' },
      { itemId: 'dd7', text: 'Review sale contract clause by clause', textAr: 'راجع بنود عقد البيع واحداً بواحد', isRequired: true },
      { itemId: 'dd8', text: 'Consult a licensed lawyer (strongly recommended)', textAr: 'استشر محامياً مرخصاً', isRequired: false, helpText: 'Costs 2,000-5,000 EGP but can save you 100x that.' },
    ]
  },
  ftb_offer_accepted_checklist: {
    checklistItems: [
      { itemId: 'oa1', text: 'Confirm agreed price in writing', textAr: 'تأكيد السعر المتفق عليه كتابياً', isRequired: true },
      { itemId: 'oa2', text: 'Agree on timeline for contract signing', textAr: 'الاتفاق على الجدول الزمني لتوقيع العقد', isRequired: true },
      { itemId: 'oa3', text: 'Agree on deposit amount and conditions', textAr: 'الاتفاق على مبلغ العربون والشروط', isRequired: true, helpText: 'Typically 10% of purchase price. Protected by Escrow™.' },
      { itemId: 'oa4', text: 'Agree on payment schedule', textAr: 'الاتفاق على جدول السداد', isRequired: true },
      { itemId: 'oa5', text: 'List all items included (ACs, fixtures, etc.)', textAr: 'قائمة بجميع العناصر المشمولة', isRequired: true, helpText: 'Get it in writing. Sellers sometimes remove fixtures.' },
      { itemId: 'oa6', text: 'Confirm handover date', textAr: 'تأكيد تاريخ التسليم', isRequired: true },
    ]
  },
  ftb_move_in_checklist: {
    checklistItems: [
      { itemId: 'mi1', text: 'Record all utility meter readings on day 1', textAr: 'سجّل قراءات العداد في اليوم الأول', isRequired: true },
      { itemId: 'mi2', text: 'Transfer utilities to your name', textAr: 'حوّل المرافق لاسمك', isRequired: true },
      { itemId: 'mi3', text: 'Register with building management', textAr: 'سجّل في إدارة البناية', isRequired: true },
      { itemId: 'mi4', text: 'Change the locks (strongly recommended)', textAr: 'غيّر الأقفال', isRequired: false, helpText: 'You never know who has a spare key.' },
      { itemId: 'mi5', text: 'Test all appliances included in sale', textAr: 'اختبر جميع الأجهزة المشمولة', isRequired: true },
      { itemId: 'mi6', text: 'Document any existing damage with photos', textAr: 'وثّق أي ضرر موجود بالصور', isRequired: true, helpText: 'Protect yourself from future disputes.' },
      { itemId: 'mi7', text: 'Introduce yourself to the building manager', textAr: 'عرّف نفسك على مدير البناية', isRequired: false },
    ]
  }
};