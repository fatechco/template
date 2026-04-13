export const PROPERTY_TYPES = [
  { label: 'Apartment', icon: '🏢' },
  { label: 'Furnished Apartment', icon: '🏠' },
  { label: 'Villa', icon: '🏡' },
  { label: 'Chalet', icon: '🏖️' },
  { label: 'Land', icon: '🌍' },
  { label: 'Under Construction', icon: '🏗️' },
  { label: 'Commercial', icon: '🏪' },
  { label: 'Medical', icon: '🏥' },
  { label: 'Administrative', icon: '🏢' },
  { label: 'Other', icon: '🏘️' },
];

export const GRADE_CONFIG = {
  'A+': { color: '#10B981', bg: '#D1FAE5', label: 'Excellent Investment Opportunity' },
  'A':  { color: '#34D399', bg: '#D1FAE5', label: 'Very Good Investment' },
  'B+': { color: '#F59E0B', bg: '#FEF3C7', label: 'Good Investment' },
  'B':  { color: '#FBBF24', bg: '#FEF3C7', label: 'Fair Investment' },
  'C':  { color: '#F97316', bg: '#FFEDD5', label: 'Below Average — Consider Carefully' },
  'D':  { color: '#EF4444', bg: '#FEE2E2', label: 'Poor Investment Opportunity' },
};

export const DEMAND_COLORS = {
  'Very High': '#10B981',
  'High': '#34D399',
  'Medium': '#F59E0B',
  'Low': '#F97316',
  'Very Low': '#EF4444',
};

export function formatCurrency(value, currency = 'USD') {
  if (!value) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value) {
  if (!value) return '0';
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}

export function getPriceVsMarketLabel(pct) {
  if (pct > 5) return { icon: '👎', color: '#EF4444', sentiment: 'negative', label: `${Math.abs(pct).toFixed(1)}% more than average` };
  if (pct < -5) return { icon: '👍', color: '#10B981', sentiment: 'positive', label: `${Math.abs(pct).toFixed(1)}% less than average` };
  return { icon: '👌', color: '#3B82F6', sentiment: 'neutral', label: 'At market average' };
}

export function getSizeVsMarketLabel(pct) {
  if (pct > 5) return { icon: '👍', color: '#10B981', sentiment: 'positive', label: `${Math.abs(pct).toFixed(1)}% bigger than average` };
  if (pct < -5) return { icon: '👎', color: '#EF4444', sentiment: 'negative', label: `${Math.abs(pct).toFixed(1)}% smaller than average` };
  return { icon: '👌', color: '#3B82F6', sentiment: 'neutral', label: 'At average size' };
}

export function generatePriceHistory(basePricePerSqm, changes) {
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const monthlyChange = (changes?.priceChange12Months || 3) / 12;
  return months.map((month, i) => ({
    month,
    price: Math.round(basePricePerSqm * (1 + (monthlyChange / 100) * (i - 11))),
  }));
}

export function calculateROI(purchasePrice, downPaymentPct, monthlyRent, appreciationPct) {
  const downPayment = purchasePrice * (downPaymentPct / 100);
  const loanAmount = purchasePrice - downPayment;
  const interestRate = 0.08 / 12;
  const months = 240;
  const mortgagePayment = loanAmount > 0
    ? (loanAmount * interestRate * Math.pow(1 + interestRate, months)) / (Math.pow(1 + interestRate, months) - 1)
    : 0;

  const annualRent = monthlyRent * 12;
  const grossYield = (annualRent / purchasePrice) * 100;
  const expenses = annualRent * 0.2;
  const netAnnualRent = annualRent - expenses;
  const netYield = (netAnnualRent / purchasePrice) * 100;
  const netCashFlow = monthlyRent - mortgagePayment - (expenses / 12);

  const projection = [];
  for (let year = 1; year <= 5; year++) {
    const propValue = purchasePrice * Math.pow(1 + appreciationPct / 100, year);
    const totalRent = netAnnualRent * year;
    const capitalGain = propValue - purchasePrice;
    const totalReturn = totalRent + capitalGain;
    const roi = (totalReturn / downPayment) * 100;
    projection.push({ year, propValue: Math.round(propValue), totalRent: Math.round(totalRent), totalReturn: Math.round(totalReturn), roi: Math.round(roi * 10) / 10 });
  }

  return { downPayment, mortgagePayment: Math.round(mortgagePayment), annualRent, grossYield: Math.round(grossYield * 10) / 10, netYield: Math.round(netYield * 10) / 10, netCashFlow: Math.round(netCashFlow), projection };
}