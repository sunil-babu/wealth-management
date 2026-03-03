import React, { useState, useEffect } from 'react'
import { translations } from './translations'

export default function App() {
  const [language, setLanguage] = useState('en');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [preset, setPreset] = useState('growing');
  
  // Detailed Financial Inputs
  // Bank & Savings
  const [savingsBalance, setSavingsBalance] = useState(30000);
  const [interestEarned, setInterestEarned] = useState(900);
  
  // Stocks & Crypto
  const [cryptoValueJan1, setCryptoValueJan1] = useState(20000);
  const [cryptoValueDec31, setCryptoValueDec31] = useState(50000);
  const [dividendsReceived, setDividendsReceived] = useState(2000);
  
  // Real Estate
  const [propertyValue, setPropertyValue] = useState(500000);
  const [rentalIncome, setRentalIncome] = useState(0);
  const [saleProceeds, setSaleProceeds] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(400000);
  
  // Deductions & Losses
  const [debtInterest, setDebtInterest] = useState(0);
  const [priorYearLoss, setPriorYearLoss] = useState(0);
  
  // Legacy (for compatibility)
  const [savings, setSavings] = useState(30000);
  const [investments, setInvestments] = useState(70000);
  const [expectedReturn, setExpectedReturn] = useState(9);
  const [realEstate, setRealEstate] = useState(500000);
  const [mortgage, setMortgage] = useState(0);

  // Questionnaire state
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState('household');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Results state
  const [showResults, setShowResults] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [metrics, setMetrics] = useState({
    monthlyNeed: 0,
    targetNestEgg: 0,
    gapToFill: 0,
    monthlySavingsTarget: 0
  });
  const [allocation, setAllocation] = useState({
    stocks: 0,
    bonds: 0,
    realEstate: 0,
    cash: 0
  });
  const [wealthProjection, setWealthProjection] = useState({
    currentWealth: 0,
    projectedAtRetirement: 0,
    targetNestEgg: 0
  });
  const [actionSteps, setActionSteps] = useState([]);
  const [dutchTaxOptimization, setDutchTaxOptimization] = useState({
    box3Strategy: '',
    pensionRecommendations: '',
    estimatedAnnualTax: 0
  });
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // Tax comparison expand/collapse state
  const [expandTax2024, setExpandTax2024] = useState(false);
  const [expandTax2028, setExpandTax2028] = useState(false);

  // Disclaimer page state
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Box3 detailed comparison page state
  const [showBox3Comparison, setShowBox3Comparison] = useState(false);
  const [box3SimMode, setBox3SimMode] = useState('deterministic'); // 'deterministic' | 'monteCarlo'
  const [box3PortfolioType, setBox3PortfolioType] = useState('growth'); // 'conservative' | 'balanced' | 'growth' | 'aggressive'
  const [box3MonthlySavings, setBox3MonthlySavings] = useState(2000);
  const [box3StartingCapital, setBox3StartingCapital] = useState(10000);
  const [box3FireAge, setBox3FireAge] = useState(52);
  const [box3LifeExpectancy, setBox3LifeExpectancy] = useState(80);
  const [box3AnnualWithdrawal, setBox3AnnualWithdrawal] = useState(50000);

  // Payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [pdfContent, setPdfContent] = useState(null);

  // Mock Stripe payment handler
  const handlePurchasePDF = () => {
    setShowPaymentModal(true);
    setPaymentProcessing(false);
    setPaymentSuccess(false);
    setPdfGenerating(false);
    setPdfReady(false);
    setPdfContent(null);
    setDisclaimerAccepted(false);
  };

  const handleMockPayment = () => {
    setPaymentProcessing(true);
    // Simulate Stripe processing delay
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentSuccess(true);
      // Auto-trigger PDF generation after payment
      generatePremiumPDF();
    }, 2000);
  };

  const generatePremiumPDF = async () => {
    setPdfGenerating(true);
    setPdfReady(false);

    // Pre-computed values for prompt
    const age = parseInt(formData.age) || 30;
    const aowPct = Math.max(0, Math.min(100, (50 - formData.yearsAbroad) * 2));
    const bridgeYrs = Math.max(0, Math.round((67.25 - formData.targetRetirementAge) * 10) / 10);
    const bridgeCost = Math.round(bridgeYrs * 12 * formData.desiredMonthlyIncome);
    const netWealth = formData.savingsBalance + formData.cryptoValueDec31 + formData.propertyValue - formData.mortgageBalance;
    const equity = formData.propertyValue - formData.mortgageBalance;
    const p3Room = formData.jaarruimte + formData.reserveringsruimte;
    const aowShortfall = Math.round((1 - aowPct / 100) * 1637);
    const arrivalAge = formData.arrivalAgeNL || (age - (50 - formData.yearsAbroad));
    const stockValue = formData.cryptoValueDec31 + (formData.investmentAmount || 0);
    const totalBox3 = formData.savingsBalance + formData.cryptoValueDec31;
    const fictitiousTax2026 = Math.round(0.36 * (stockValue * 0.06 + formData.savingsBalance * 0.0144) - (formData.hasSpouse ? 114000 : 57000) * 0.0144 * 0.36);
    const retirementYears = formData.lifeExpectancy - formData.targetRetirementAge;
    const yearsToFire = Math.max(0, formData.targetRetirementAge - age);
    const inflationRate = 0.022;
    const inflationMultiplier = Math.pow(1 + inflationRate, yearsToFire);
    const futureMonthlyNeed = Math.round(formData.desiredMonthlyIncome * inflationMultiplier);
    const futureBridgeCost = Math.round(bridgeYrs * 12 * futureMonthlyNeed);

    const premiumPrompt = `Role: You are a Senior Dutch & International Wealth Architect specializing in FIRE (Financial Independence, Retire Early).
Goal: Generate a high-stakes, 2026-optimized Wealth Protection & Early Retirement Roadmap.
Tone: Professional, urgent, and advisor-grade. Use psychological loss aversion: highlight "leaking wealth" to motivate action.

Context (2026-2028 Dutch Tax Landscape):
- 2026-2027: Transitional Box 3 system using fictitious returns (Savings 1.44%, Stocks/Other 6.00%, Debt 2.62%).
- 2028: Full "Actual Returns" Capital Accrual Tax on stocks/crypto (36% tax on annual paper gains).
- Mortgage: Interest deduction (HRA) is 37.56% in 2026.
- AOW: Accrual is 2% per year of residency in NL (50 years for 100% benefit).
- Box 3 Exemption: €${formData.hasSpouse ? '114,000' : '57,000'} (${formData.hasSpouse ? 'partnered' : 'single'}).

CLIENT PROFILE:
Age: ${age} | FIRE Target: ${formData.targetRetirementAge} | Need: €${formData.desiredMonthlyIncome}/mo until ${formData.lifeExpectancy}
${formData.hasSpouse ? 'Partnered' : 'Single'}${formData.hasChildren ? ' | Children: ' + formData.childrenCount : ''}
Salary: €${formData.grossSalary}${formData.hasSpouse ? ' | Spouse: €' + formData.spouseGrossSalary : ''} | 30% Ruling: ${formData.has30PercentRuling ? 'Yes' : 'No'}
Savings: €${formData.savingsBalance} (interest €${formData.interestEarned})
Crypto/Stocks: Jan €${formData.cryptoValueJan1} → Dec €${formData.cryptoValueDec31} | Dividends: €${formData.dividendsReceived}
Property: WOZ €${formData.propertyValue} | Mortgage €${formData.mortgageBalance} @${formData.mortgageInterestRate}% (${formData.mortgageYearsLeft}yr left) | Equity: €${equity.toLocaleString()}
${formData.targetPropertyValue > 0 ? 'Upgrade Target: €' + formData.targetPropertyValue.toLocaleString() : ''}
Rental: €${formData.rentalIncome} | Prior Loss: €${formData.priorYearLoss}
Pension P1: AOW ${aowPct}% (abroad ${formData.yearsAbroad}yr, gap €${aowShortfall}/mo) | Arrival age: ${arrivalAge}
Pension P2: €${formData.builtUpPension}/yr | Factor A: €${formData.factorA}${formData.hasSpouse ? ' | Spouse P2: €' + formData.spouseBuiltUpPension + '/yr FA: €' + formData.spouseFactorA : ''}
Pension P3: Jaarruimte €${formData.jaarruimte} | Reserveringsruimte €${formData.reserveringsruimte}
Bridge Phase: ${Math.round(bridgeYrs)} years = €${bridgeCost.toLocaleString()} self-funded
Net Wealth: €${netWealth.toLocaleString()} | SWR Need: €${Math.round(formData.desiredMonthlyIncome * 12 / 0.04).toLocaleString()} @4%

INFLATION LOGIC (CRITICAL — apply throughout ALL sections):
- Standard NL Inflation Assumption: 2.2% annually.
- Years to FIRE: ${yearsToFire}
- Today's Monthly Need: €${formData.desiredMonthlyIncome.toLocaleString()} → Inflation-Adjusted at FIRE: €${futureMonthlyNeed.toLocaleString()}/mo (= €${formData.desiredMonthlyIncome.toLocaleString()} × (1.022)^${yearsToFire}).
- Real Rate of Return: Use (Nominal Return − 2.2%) for ALL growth projections so every € figure is in "Today's Euro" purchasing power.
- Bridge Phase (inflation-adjusted): €${futureBridgeCost.toLocaleString()} (${Math.round(bridgeYrs)} yrs × 12 × €${futureMonthlyNeed.toLocaleString()}).
- SWR Nest-Egg Target (inflation-adjusted): €${Math.round(futureMonthlyNeed * 12 / 0.04).toLocaleString()} @4%.
- All € amounts in sections below MUST reflect inflation-adjusted values. Always show both today's and future euros where relevant.

OUTPUT: Return a comprehensive structured report with these exact sections. Use markdown formatting (## for headings, **bold** for emphasis, - for bullets). Include specific € amounts for every recommendation.

## SECTION 1: THE WEALTH SHIELD (2028 Preparedness)

Analyze the client's Box 3 exposure (total €${totalBox3.toLocaleString()}).
- Current 2026 fictitious tax estimate vs 2028 Capital Accrual Tax on €${stockValue.toLocaleString()} in stocks/crypto.
- Calculate the "Wealth Leak" (annual tax cost of doing nothing).
- Explain the Rebuttal Scheme (Opgaaf werkelijk rendement) for 2026 if real gains < 6%.
- Warn about 36% tax on unrealized paper gains from 2028.
- Specific restructuring steps with € amounts.

## SECTION 2: PILLAR 1 & 2 PENSION AUDIT

- AOW gap: ${aowPct}% coverage (${formData.yearsAbroad} years abroad). Monthly shortfall: €${aowShortfall}.
- Audit Factor A (€${formData.factorA}): calculate remaining Jaarruimte and Reserveringsruimte.
- P2 built-up: €${formData.builtUpPension}/yr = €${Math.round(formData.builtUpPension / 12)}/mo.
- Total pension gap vs €${formData.desiredMonthlyIncome}/mo target.
- Options to fill: voluntary AOW buy-back, Lijfrente, extra P2 contributions.

## SECTION 3: REAL ESTATE OPTIMIZATION

Equity: €${equity.toLocaleString()} locked in primary residence.
- Bigger House Strategy: Moving wealth from Box 3 (taxed) to Box 1 (exempt). Calculate tax savings for a €${(formData.targetPropertyValue || formData.propertyValue + 200000).toLocaleString()} upgrade.
- HRA deduction: 37.56% in 2026. Only for repayment mortgages within 30 years.
- Eigenwoningforfait: 0.35% of WOZ (€${Math.round(formData.propertyValue * 0.0035).toLocaleString()}/yr) vs 2.35% above €1.3M.
- Investment property analysis if applicable (rental €${formData.rentalIncome}).

## SECTION 4: FAMILY WEALTH TRANSFER

${formData.hasChildren ? `Children: ${formData.childrenCount}. Optimize intergenerational wealth:` : 'Even without children, consider:'}
- Tax-free gifting 2026: €6,908 annually per child (€13,816 from both parents).
- One-time enlarged gift: €33,129 per child (age 18-40).
- "Schenken op papier" (Paper Gifting): Keep money but owe child 6% interest. This interest is deductible as Box 3 debt, reducing taxable base.
- Set up notarial deed for paper gifts.
- Impact on Box 3: €${formData.hasChildren ? Math.round(formData.childrenCount * 6908).toLocaleString() : '6,908'} shift per year.

## SECTION 5: PILLAR 3 TAX SHIELD

Room available: €${p3Room.toLocaleString()} (Jaarruimte €${formData.jaarruimte} + Reserveringsruimte €${formData.reserveringsruimte}).
- Immediate tax refund: 37-49.5% = €${Math.round(p3Room * 0.37).toLocaleString()} to €${Math.round(p3Room * 0.495).toLocaleString()}.
- Box 3 shield: Assets move from taxable Box 3 to exempt Lijfrente.
- Recommended providers: Brand New Day, Meesman (low-cost index Lijfrente).
- Spouse optimization if applicable.

## SECTION 6: GLOBAL RETIREMENT (Geo-Arbitrage)

Compare 10 retirement destinations with Dutch tax treaty benefits for someone with €${formData.desiredMonthlyIncome.toLocaleString()}/mo budget:

| Country | Tax on NL Pension | Tax on Investments | Healthcare | Cost of Living | Treaty Benefit |
For each: Portugal (NHR 10%), Italy (7% Southern flat), Malta (OECD treaty), Spain (Madrid 0% wealth tax), Greece (7% flat), Cyprus (0% dividends), Panama (territorial), Costa Rica (territorial), France (social charges), Malaysia (territorial).

## SECTION 7: BRIDGE PHASE STRATEGY

Age ${formData.targetRetirementAge} → 67 = ${Math.round(bridgeYrs)} years, €${bridgeCost.toLocaleString()} needed.
- Drawdown sequence: which accounts to tap first (Box 3 savings → Lijfrente → P2).
- Tax-efficient withdrawal: stay below Box 1 brackets.
- Emergency buffer sizing (6-12 months expenses).

## SECTION 8: THE FINAL VERDICT

Simulation: "Retire at ${formData.targetRetirementAge}" vs "Retire at ${Math.min(formData.targetRetirementAge + 10, 65)}"
- Wealth at retirement, monthly income, tax burden, lifestyle comparison.
- Safe Withdrawal Rate analysis over ${retirementYears} years.
- Break-even point and risk assessment.
- Final recommended retirement date with confidence level.

End with a "CRITICAL ACTIONS" summary: Top 5 things to do THIS MONTH with specific € amounts.

IMPORTANT: Do NOT write any introduction, preamble, or opening paragraph about yourself or your role. Start directly with SECTION 1. Do not introduce yourself or explain what you are doing.`;

    try {
      const response = await fetch('/api/vertex-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: premiumPrompt }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.error('PDF API error:', response.status, errBody);
        throw new Error(`Server error ${response.status}: ${errBody}`);
      }

      const result = await response.json();
      
      let responseText = '';
      if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts) {
        responseText = result.candidates[0].content.parts[0].text;
      } else if (result.text) {
        responseText = result.text;
      } else if (result.response) {
        responseText = result.response;
      } else {
        responseText = JSON.stringify(result, null, 2);
      }

      if (!responseText || responseText.trim().length === 0) {
        throw new Error('Empty response from AI service');
      }

      setPdfContent(responseText);
      setPdfReady(true);
      setPdfGenerating(false);
    } catch (err) {
      console.error('PDF generation error:', err);
      // Fallback: use existing AI response if available
      if (aiResponse && aiResponse.trim().length > 0) {
        setPdfContent(aiResponse);
        setPdfReady(true);
      } else {
        setPdfContent('## Error Generating Report\n\nThe AI service could not generate your premium report at this time. Please try again later or contact support.\n\n**Error:** ' + err.message);
        setPdfReady(true);
      }
      setPdfGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    const content = pdfContent || aiResponse;
    const dateStr = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    const netWealth = formData.savingsBalance + formData.cryptoValueDec31 + formData.propertyValue - formData.mortgageBalance;
    const age = parseInt(formData.age) || 30;
    const aowPct = Math.max(0, Math.min(100, (50 - formData.yearsAbroad) * 2));
    const aowShortfall = Math.round((1 - aowPct / 100) * 1637);
    const aowMonthly = Math.round(1637 * aowPct / 100);
    const yearsInNL = 50 - formData.yearsAbroad;
    const equity = formData.propertyValue - formData.mortgageBalance;
    const p3Room = formData.jaarruimte + formData.reserveringsruimte;
    const p3RefundLow = Math.round(p3Room * 0.37);
    const p3RefundHigh = Math.round(p3Room * 0.495);
    const bridgeYrs = Math.max(0, Math.round((67.25 - formData.targetRetirementAge) * 10) / 10);
    const bridgeCost = Math.round(bridgeYrs * 12 * formData.desiredMonthlyIncome);
    const stockValue = formData.cryptoValueDec31 + (formData.investmentAmount || 0);
    const totalBox3 = formData.savingsBalance + formData.cryptoValueDec31;
    const fictitiousTax = Math.max(0, Math.round(0.36 * (stockValue * 0.06 + formData.savingsBalance * 0.0144) - (formData.hasSpouse ? 114000 : 57000) * 0.0144 * 0.36));
    const p2Monthly = Math.round(formData.builtUpPension / 12);
    const p2Coverage = formData.desiredMonthlyIncome > 0 ? Math.min(100, Math.round((p2Monthly / formData.desiredMonthlyIncome) * 100)) : 0;
    const yearsToFire = Math.max(0, formData.targetRetirementAge - age);
    const inflationMultiplier = Math.pow(1.022, yearsToFire);
    const futureMonthlyNeed = Math.round(formData.desiredMonthlyIncome * inflationMultiplier);
    const taxLeakAnnual = fictitiousTax;
    const isWealthLeaking = taxLeakAnnual > 2000;
    const isAchievable = metrics.gapToFill < netWealth * 0.8;

    // Parse markdown tables into HTML tables 
    const parseMarkdownTable = (lines, startIdx) => {
      let html = '<table><thead><tr>';
      const headers = lines[startIdx].split('|').filter(c => c.trim());
      headers.forEach(h => { html += '<th>' + h.trim() + '</th>'; });
      html += '</tr></thead><tbody>';
      for (let i = startIdx + 2; i < lines.length; i++) {
        if (!lines[i].trim().startsWith('|')) break;
        const cells = lines[i].split('|').filter(c => c.trim());
        html += '<tr>';
        cells.forEach(c => { html += '<td>' + c.trim() + '</td>'; });
        html += '</tr>';
      }
      html += '</tbody></table>';
      return html;
    };

    // Convert markdown content to HTML with enhanced formatting
    const lines = content.split('\n');
    let contentHtml = '';
    let inTable = false;
    let inList = false;
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i].trim();
      if (!t) { if (inList) { contentHtml += '</ul>'; inList = false; } contentHtml += ''; continue; }
      // Table
      if (t.startsWith('|') && !inTable) {
        if (inList) { contentHtml += '</ul>'; inList = false; }
        inTable = true;
        contentHtml += parseMarkdownTable(lines, i);
        while (i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) i++;
        inTable = false;
        continue;
      }
      if (t.startsWith('|')) continue; // skip remaining table rows already handled
      // Headings - map to section dividers
      if (t.startsWith('## SECTION') || t.startsWith('## ')) {
        if (inList) { contentHtml += '</ul>'; inList = false; }
        const title = t.replace(/^#+\s*/, '').replace(/\*\*/g, '');
        contentHtml += '<div class="section-divider"></div><h2>' + title + '</h2>';
        continue;
      }
      if (t.startsWith('### ') || (t.startsWith('**') && t.endsWith('**') && !t.startsWith('- '))) {
        if (inList) { contentHtml += '</ul>'; inList = false; }
        contentHtml += '<h3>' + t.replace(/^###?\s*/, '').replace(/\*\*/g, '') + '</h3>';
        continue;
      }
      // List items
      if (t.startsWith('- ') || t.startsWith('* ')) {
        if (!inList) { contentHtml += '<ul>'; inList = true; }
        contentHtml += '<li>' + t.replace(/^[-*]\s*/, '').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') + '</li>';
        continue;
      } else if (inList) {
        contentHtml += '</ul>'; inList = false;
      }
      // Warning/Critical callouts
      if (t.includes('WARNING') || t.includes('Wealth Leak') || t.includes('CRITICAL') || t.includes('⚠') || t.includes('🚨')) {
        contentHtml += '<div class="callout-warning">' + t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') + '</div>';
        continue;
      }
      // Normal paragraph
      contentHtml += '<p>' + t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') + '</p>';
    }
    if (inList) contentHtml += '</ul>';

    // Country comparison cards data
    const countries = [
      { flag: '🇵🇹', name: 'Portugal', tax: 'NHR 10% flat', benefit: 'Low tax on foreign income' },
      { flag: '🇮🇹', name: 'Italy', tax: '7% flat (South)', benefit: 'Southern Italy incentive' },
      { flag: '🇪🇸', name: 'Spain', tax: 'Progressive', benefit: 'Madrid 0% wealth tax' },
      { flag: '🇲🇹', name: 'Malta', tax: 'Remittance basis', benefit: 'OECD treaty benefits' },
      { flag: '🇬🇷', name: 'Greece', tax: '7% flat', benefit: 'Pension income incentive' },
      { flag: '🇨🇾', name: 'Cyprus', tax: '0% dividends', benefit: 'No capital gains tax' },
      { flag: '🇵🇦', name: 'Panama', tax: 'Territorial', benefit: 'Foreign income exempt' },
      { flag: '🇨🇷', name: 'Costa Rica', tax: 'Territorial', benefit: 'Foreign income exempt' },
      { flag: '🇫🇷', name: 'France', tax: '30% PFU', benefit: 'Social charges apply' },
      { flag: '🇲🇾', name: 'Malaysia', tax: 'Territorial', benefit: 'MM2H visa program' },
    ];

    // Build the full premium HTML template
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>ProsperPath - Premium Wealth Strategy Report</title>
<style>
  /* === GLOBAL === */
  @page { margin: 1.5cm 2cm; size: A4; }
  @media print { .page-break { page-break-before: always; } }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Georgia', 'Times New Roman', serif; color: #e2e8f0; line-height: 1.7; background: #0f172a; }
  .container { max-width: 780px; margin: 0 auto; padding: 0 32px; }

  /* === FRONT PAGE === */
  .front-page { background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%); min-height: 100vh; padding: 60px 0; position: relative; overflow: hidden; }
  .front-page::before { content: ''; position: absolute; top: -50%; right: -30%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%); border-radius: 50%; }
  .fp-badge { display: inline-block; background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 6px 20px; border-radius: 4px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; }
  .fp-title { font-size: 36px; color: #f1f5f9; line-height: 1.2; margin-bottom: 8px; }
  .fp-subtitle { font-size: 18px; color: #10b981; font-weight: 400; font-style: italic; margin-bottom: 40px; }

  /* Memo header */
  .memo-header { background: rgba(30,41,59,0.6); border: 1px solid #334155; border-radius: 8px; padding: 20px 24px; margin-bottom: 36px; font-family: 'Segoe UI', Arial, sans-serif; }
  .memo-row { display: flex; margin-bottom: 6px; font-size: 13px; }
  .memo-label { color: #64748b; width: 80px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; flex-shrink: 0; }
  .memo-value { color: #cbd5e1; }

  /* Six-tile summary */
  .tile-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 36px; }
  .tile { background: rgba(30,41,59,0.7); border: 1px solid #334155; border-radius: 10px; padding: 20px 16px; text-align: center; position: relative; }
  .tile .tile-label { font-family: 'Segoe UI', Arial, sans-serif; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin-bottom: 8px; }
  .tile .tile-value { font-size: 26px; font-weight: 700; color: #10b981; font-family: 'Segoe UI', Arial, sans-serif; }
  .tile .tile-value.allocation { font-size: 16px; }
  .tile .tile-sub { font-size: 11px; color: #64748b; margin-top: 4px; font-family: 'Segoe UI', Arial, sans-serif; }

  /* Status indicators */
  .status-bar { display: flex; gap: 12px; margin-bottom: 40px; }
  .status-pill { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 8px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; font-weight: 600; }
  .status-pill.leak { background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3); color: #fbbf24; }
  .status-pill.ok { background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); color: #34d399; }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; }
  .status-dot.leak { background: #f59e0b; }
  .status-dot.ok { background: #10b981; }

  /* === SECTION STYLES === */
  .section-divider { height: 1px; background: linear-gradient(to right, transparent, #334155, transparent); margin: 48px 0 32px; }
  h2 { font-size: 22px; color: #f1f5f9; border-left: 4px solid #10b981; padding-left: 16px; margin: 40px 0 16px; font-family: 'Georgia', 'Times New Roman', serif; }
  h3 { font-size: 15px; color: #10b981; margin: 20px 0 8px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: 700; }
  p { margin: 8px 0; font-size: 13.5px; color: #cbd5e1; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.75; }
  strong { color: #f1f5f9; }
  ul { padding-left: 0; list-style: none; margin: 8px 0; }
  li { margin: 6px 0; font-size: 13.5px; color: #cbd5e1; padding-left: 20px; position: relative; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.7; }
  li::before { content: "▸"; color: #10b981; font-weight: bold; position: absolute; left: 0; }

  /* Callouts */
  .callout-warning { background: rgba(245,158,11,0.08); border-left: 4px solid #f59e0b; padding: 14px 18px; border-radius: 6px; margin: 16px 0; font-size: 13px; color: #fde68a; font-family: 'Segoe UI', Arial, sans-serif; }

  /* Data cards */
  .data-card { background: rgba(30,41,59,0.5); border: 1px solid #334155; border-radius: 10px; padding: 20px; margin: 16px 0; }
  .data-card-title { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin-bottom: 10px; }
  .data-card .big-number { font-size: 32px; font-weight: 700; color: #10b981; font-family: 'Segoe UI', Arial, sans-serif; }
  .data-card .big-number.warning { color: #f59e0b; }
  .data-card .big-number.danger { color: #ef4444; }
  .data-card .big-number.blue { color: #60a5fa; }

  /* Accrual timeline bar */
  .timeline-bar { display: flex; height: 28px; border-radius: 6px; overflow: hidden; margin: 12px 0 8px; }
  .timeline-filled { background: linear-gradient(90deg, #059669, #10b981); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: white; font-family: 'Segoe UI', Arial, sans-serif; }
  .timeline-gap { background: #334155; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #64748b; font-family: 'Segoe UI', Arial, sans-serif; }

  /* Gauge */
  .gauge-row { display: flex; align-items: center; gap: 24px; margin: 16px 0; }
  .gauge-track { flex: 1; height: 10px; background: #1e293b; border-radius: 5px; overflow: hidden; }
  .gauge-fill { height: 100%; border-radius: 5px; background: linear-gradient(90deg, #10b981, #34d399); }
  .gauge-label { font-family: 'Segoe UI', Arial, sans-serif; font-size: 28px; font-weight: 700; color: #10b981; min-width: 70px; text-align: right; }

  /* Badge */
  .badge-row { display: flex; gap: 10px; margin: 12px 0; flex-wrap: wrap; }
  .badge { display: inline-block; padding: 5px 14px; border-radius: 20px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; font-weight: 700; }
  .badge.red { background: rgba(239,68,68,0.15); color: #fca5a5; border: 1px solid rgba(239,68,68,0.3); }
  .badge.green { background: rgba(16,185,129,0.15); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.3); }
  .badge.amber { background: rgba(245,158,11,0.15); color: #fde68a; border: 1px solid rgba(245,158,11,0.3); }
  .badge.blue { background: rgba(96,165,250,0.15); color: #93c5fd; border: 1px solid rgba(96,165,250,0.3); }

  /* Before-After comparison */
  .comparison-row { display: flex; gap: 16px; margin: 16px 0; }
  .comparison-box { flex: 1; border-radius: 10px; padding: 18px; text-align: center; }
  .comparison-box.before { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); }
  .comparison-box.after { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25); }
  .comparison-box .cb-label { font-family: 'Segoe UI', Arial, sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin-bottom: 8px; }
  .comparison-box.before .cb-label { color: #fca5a5; }
  .comparison-box.after .cb-label { color: #6ee7b7; }
  .comparison-box .cb-value { font-size: 22px; font-weight: 700; font-family: 'Segoe UI', Arial, sans-serif; }
  .comparison-box.before .cb-value { color: #f87171; }
  .comparison-box.after .cb-value { color: #34d399; }
  .comparison-box .cb-desc { font-size: 11px; color: #64748b; margin-top: 4px; font-family: 'Segoe UI', Arial, sans-serif; }

  /* Country cards */
  .country-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0; }
  .country-card { background: rgba(30,41,59,0.5); border: 1px solid #334155; border-radius: 8px; padding: 14px; }
  .country-card .cc-name { font-size: 14px; font-weight: 700; color: #f1f5f9; margin-bottom: 6px; font-family: 'Segoe UI', Arial, sans-serif; }
  .country-card .cc-tax { font-size: 11px; color: #10b981; font-family: 'Segoe UI', Arial, sans-serif; }
  .country-card .cc-benefit { font-size: 11px; color: #64748b; margin-top: 2px; font-family: 'Segoe UI', Arial, sans-serif; }

  /* Bridge Gantt */
  .gantt-bar-container { margin: 16px 0; }
  .gantt-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
  .gantt-label { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #94a3b8; width: 90px; text-align: right; flex-shrink: 0; }
  .gantt-track { flex: 1; height: 22px; background: #1e293b; border-radius: 4px; position: relative; overflow: hidden; }
  .gantt-fill { height: 100%; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: white; font-family: 'Segoe UI', Arial, sans-serif; }
  .gantt-fill.savings { background: linear-gradient(90deg, #10b981, #34d399); }
  .gantt-fill.lijfrente { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
  .gantt-fill.p2 { background: linear-gradient(90deg, #8b5cf6, #a78bfa); }
  .gantt-fill.aow { background: linear-gradient(90deg, #f59e0b, #fbbf24); }

  /* Tables */
  table { width: 100%; border-collapse: collapse; margin: 16px 0; font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; }
  th { background: #1e293b; color: #94a3b8; padding: 10px 14px; text-align: left; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; border-bottom: 2px solid #334155; }
  td { padding: 10px 14px; border-bottom: 1px solid #1e293b; color: #cbd5e1; }
  tr:nth-child(even) td { background: rgba(30,41,59,0.3); }

  /* Seal */
  .verified-seal { display: inline-flex; align-items: center; gap: 6px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); padding: 6px 14px; border-radius: 20px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; font-weight: 600; color: #34d399; margin: 8px 0; }

  /* Footer & Disclaimer */
  .disclaimer { background: rgba(30,41,59,0.5); border: 1px solid #334155; border-radius: 8px; padding: 18px 22px; margin-top: 48px; font-size: 11px; color: #64748b; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.7; }
  .disclaimer strong { color: #94a3b8; }
  .report-footer { text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #1e293b; color: #475569; font-size: 11px; font-family: 'Segoe UI', Arial, sans-serif; }
  .report-footer .brand { color: #10b981; font-weight: 700; }
</style>
</head>
<body>

<!-- ============ FRONT PAGE ============ -->
<div class="front-page">
  <div class="container">
    <div class="fp-badge">WEALTH STRATEGY</div>
    <h1 class="fp-title">Wealth Protection &amp;<br>Early Retirement Roadmap</h1>
    <p class="fp-subtitle">2026 Dutch FIRE &amp; International Tax Strategy</p>

    <!-- Memo Header -->
    <div class="memo-header">
      <div class="memo-row"><span class="memo-label">Date</span><span class="memo-value">${dateStr}</span></div>
      <div class="memo-row"><span class="memo-label">To</span><span class="memo-value">${formData.fullName || 'Client'} — ${formData.hasSpouse ? 'Household' : 'Individual'}, Age ${formData.age}</span></div>
      <div class="memo-row"><span class="memo-label">From</span><span class="memo-value">Senior Dutch &amp; International Wealth Architect</span></div>
      <div class="memo-row"><span class="memo-label">Subject</span><span class="memo-value">Personalized Wealth Protection &amp; FIRE Strategy — Target Age ${formData.targetRetirementAge}</span></div>
    </div>

    <!-- Six-Tile Summary -->
    <div class="tile-grid">
      <div class="tile">
        <div class="tile-label">Monthly Need (Future)</div>
        <div class="tile-value">&euro;${futureMonthlyNeed.toLocaleString()}</div>
        <div class="tile-sub">&euro;${formData.desiredMonthlyIncome.toLocaleString()} today</div>
      </div>
      <div class="tile">
        <div class="tile-label">Target Nest Egg</div>
        <div class="tile-value">&euro;${metrics.targetNestEgg.toLocaleString()}</div>
        <div class="tile-sub">at 4% SWR</div>
      </div>
      <div class="tile">
        <div class="tile-label">Gap to Fill</div>
        <div class="tile-value">&euro;${metrics.gapToFill.toLocaleString()}</div>
        <div class="tile-sub">wealth shortfall</div>
      </div>
      <div class="tile">
        <div class="tile-label">Monthly Savings Target</div>
        <div class="tile-value">&euro;${metrics.monthlySavingsTarget.toLocaleString()}</div>
        <div class="tile-sub">to reach FIRE</div>
      </div>
      <div class="tile">
        <div class="tile-label">Asset Allocation</div>
        <div class="tile-value allocation">${allocation.stocks}% / ${allocation.bonds}% / ${allocation.realEstate}% / ${allocation.cash}%</div>
        <div class="tile-sub">Stocks / Bonds / RE / Cash</div>
      </div>
      <div class="tile">
        <div class="tile-label">Current Net Wealth</div>
        <div class="tile-value">&euro;${netWealth.toLocaleString()}</div>
        <div class="tile-sub">total assets − liabilities</div>
      </div>
    </div>

    <!-- Status Indicators -->
    <div class="status-bar">
      ${isWealthLeaking
        ? '<div class="status-pill leak"><span class="status-dot leak"></span>Wealth Leak Alert — &euro;' + taxLeakAnnual.toLocaleString() + '/yr in Box 3 tax drag</div>'
        : '<div class="status-pill ok"><span class="status-dot ok"></span>Low Tax Exposure — Box 3 drag within threshold</div>'
      }
      ${isAchievable
        ? '<div class="status-pill ok"><span class="status-dot ok"></span>Path to Freedom ✓ Target is achievable</div>'
        : '<div class="status-pill leak"><span class="status-dot leak"></span>Significant Gap — Strategy optimization critical</div>'
      }
    </div>
  </div>
</div>

<!-- ============ PILLAR 1: AOW ============ -->
<div class="page-break"></div>
<div class="container" style="padding-top: 48px;">
  <h2>Pillar 1 — AOW &amp; State Pension: The Safety Floor</h2>
  <p>Your baseline state pension security, accrued at 2% per year of NL residency.</p>

  <div class="data-card">
    <div class="data-card-title">AOW Accrual Timeline (50-Year Horizon)</div>
    <div class="timeline-bar">
      <div class="timeline-filled" style="width: ${aowPct}%">${yearsInNL} yrs in NL</div>
      ${formData.yearsAbroad > 0 ? '<div class="timeline-gap" style="width: ' + (100 - aowPct) + '%">' + formData.yearsAbroad + ' yrs gap</div>' : ''}
    </div>
    <p style="font-size: 11px; color: #64748b;">Accrual: <strong>${aowPct}%</strong> of full AOW benefit. ${formData.yearsAbroad > 0 ? 'Gap of ' + formData.yearsAbroad + ' years abroad reduces your entitlement.' : ''}</p>
  </div>

  <div class="data-card">
    <div class="data-card-title">Projected Monthly AOW at Age 67</div>
    <div class="big-number">&euro;${aowMonthly.toLocaleString()}/mo</div>
    <p style="font-size: 12px; color: #64748b; margin-top: 6px;">${aowPct < 100 ? 'Shortfall: <strong style="color:#fbbf24;">€' + aowShortfall + '/mo</strong> vs full AOW (€1,637).' : 'Full AOW benefit secured.'}</p>
    ${aowPct >= 100 ? '<div class="verified-seal">✓ 100% Accrual Verified</div>' : '<div class="badge-row"><span class="badge amber">⚠ ' + (100 - aowPct) + '% Accrual Gap</span></div>'}
  </div>
</div>

<!-- ============ PILLAR 2: Employer Pension ============ -->
<div class="container" style="padding-top: 16px;">
  <div class="section-divider"></div>
  <h2>Pillar 2 — Employer Pension: The Growth Engine</h2>
  <p>Your workplace pension performance review.</p>

  <div class="data-card">
    <div class="data-card-title">Annual Accrual (Factor A)</div>
    <div class="big-number${formData.factorA === 0 ? ' warning' : ''}">&euro;${formData.factorA.toLocaleString()}</div>
    <div class="badge-row" style="margin-top: 10px;">
      ${formData.factorA === 0
        ? '<span class="badge red">✗ Missed Opportunity — No Employer Accrual</span><span class="badge green">✓ Unlocked: Full Pillar 3 Room</span>'
        : '<span class="badge green">✓ Active Employer Pension</span>'
      }
    </div>
  </div>

  <div class="data-card">
    <div class="data-card-title">Pillar 2 Coverage of Monthly Need</div>
    <div class="gauge-row">
      <div class="gauge-track"><div class="gauge-fill" style="width: ${p2Coverage}%"></div></div>
      <div class="gauge-label">${p2Coverage}%</div>
    </div>
    <p style="font-size: 12px; color: #64748b;">Built-up: <strong>&euro;${formData.builtUpPension.toLocaleString()}/yr</strong> (&euro;${p2Monthly.toLocaleString()}/mo) covers ${p2Coverage}% of your &euro;${formData.desiredMonthlyIncome.toLocaleString()}/mo target.</p>
  </div>
</div>

<!-- ============ PILLAR 3: Tax Shield ============ -->
<div class="page-break"></div>
<div class="container" style="padding-top: 48px;">
  <h2>Pillar 3 — Private Savings: The Tax Shield</h2>
  <p>Your most powerful tool for reducing tax exposure and building tax-sheltered wealth.</p>

  <div class="data-card" style="border-color: #10b981; border-width: 2px;">
    <div class="data-card-title" style="color: #10b981;">Immediate Tax Refund Potential</div>
    <div class="big-number">&euro;${p3RefundLow.toLocaleString()} — &euro;${p3RefundHigh.toLocaleString()}</div>
    <p style="font-size: 12px; color: #94a3b8; margin-top: 6px;">By filling <strong>&euro;${p3Room.toLocaleString()}</strong> of Jaarruimte + Reserveringsruimte this year.</p>
    <div class="badge-row"><span class="badge green">Claim 37–49.5% back</span><span class="badge blue">Box 3 → Tax-Exempt</span></div>
  </div>

  <div class="data-card">
    <div class="data-card-title">Box 3 Transformation Map</div>
    <div class="comparison-row">
      <div class="comparison-box before">
        <div class="cb-label">Before — Taxable Box 3</div>
        <div class="cb-value">&euro;${totalBox3.toLocaleString()}</div>
        <div class="cb-desc">Exposed to 36% fictional/actual returns tax</div>
      </div>
      <div class="comparison-box after">
        <div class="cb-label">After — Optimized</div>
        <div class="cb-value">&euro;${Math.max(0, totalBox3 - p3Room - (formData.hasSpouse ? 114000 : 57000)).toLocaleString()}</div>
        <div class="cb-desc">Below &euro;${formData.hasSpouse ? '114k' : '57k'} exemption + Pillar 3 shield</div>
      </div>
    </div>
  </div>
</div>

<!-- ============ REAL ESTATE & FAMILY ============ -->
<div class="container" style="padding-top: 16px;">
  <div class="section-divider"></div>
  <h2>Real Estate &amp; Family Wealth: The Structural Shelter</h2>

  ${formData.propertyValue > 0 ? '<div class="data-card"><div class="data-card-title">Bigger House Strategy</div><div class="comparison-row"><div class="comparison-box before"><div class="cb-label">Current Setup</div><div class="cb-value">&euro;' + fictitiousTax.toLocaleString() + '/yr</div><div class="cb-desc">Box 3 tax on excess assets</div></div><div class="comparison-box after"><div class="cb-label">After Upgrade</div><div class="cb-value">Reduced</div><div class="cb-desc">Mortgage shifts wealth to Box 1 (exempt)</div></div></div><p style="font-size: 12px; color: #64748b;">HRA deduction: <strong>37.56%</strong> in 2026. Eigenwoningforfait: <strong>&euro;' + Math.round(formData.propertyValue * 0.0035).toLocaleString() + '/yr</strong> (0.35% of WOZ).</p></div>' : ''}

  ${formData.hasChildren ? '<div class="data-card"><div class="data-card-title">Family Wealth Flow — Gifting Strategy</div><p style="font-size: 12px; color: #cbd5e1;">Tax-free gifting 2026: <strong>&euro;6,908/child/year</strong> (&euro;13,816 from partners).<br>One-time enlarged: <strong>&euro;33,129</strong> per child (age 18–40).<br>"Schenken op papier": Keep capital, owe child 6% interest — deductible as Box 3 debt.</p><div class="badge-row"><span class="badge green">Annual shift: &euro;' + (formData.childrenCount * 6908).toLocaleString() + '</span><span class="badge blue">' + formData.childrenCount + ' child' + (formData.childrenCount > 1 ? 'ren' : '') + '</span></div></div>' : ''}
</div>

<!-- ============ GEO-ARBITRAGE ============ -->
<div class="page-break"></div>
<div class="container" style="padding-top: 48px;">
  <h2>Global Retirement: The Geo-Arbitrage Catalog</h2>
  <p>Countries with the most favourable tax treaties for Dutch residents retiring abroad.</p>

  <div class="country-grid">
    ${countries.map(c => '<div class="country-card"><div class="cc-name">' + c.flag + ' ' + c.name + '</div><div class="cc-tax">' + c.tax + '</div><div class="cc-benefit">' + c.benefit + '</div></div>').join('')}
  </div>
</div>

<!-- ============ BRIDGE PHASE ============ -->
<div class="container" style="padding-top: 16px;">
  <div class="section-divider"></div>
  <h2>Bridge Phase Strategy: Age ${formData.targetRetirementAge} → 67</h2>
  <p>${Math.round(bridgeYrs)} years of self-funded retirement before full AOW kicks in. Total cost: <strong>&euro;${bridgeCost.toLocaleString()}</strong>.</p>

  <div class="data-card">
    <div class="data-card-title">Bridge Phase Funding Timeline</div>
    <div class="gantt-bar-container">
      <div class="gantt-row">
        <span class="gantt-label">Box 3 Savings</span>
        <div class="gantt-track"><div class="gantt-fill savings" style="width: ${Math.min(100, Math.round(bridgeYrs * 30))}%">Years 1–${Math.min(Math.round(bridgeYrs * 0.4), Math.round(bridgeYrs))}</div></div>
      </div>
      <div class="gantt-row">
        <span class="gantt-label">Lijfrente (P3)</span>
        <div class="gantt-track"><div class="gantt-fill lijfrente" style="width: ${Math.min(100, Math.round(bridgeYrs * 25))}%">Tax-efficient draw</div></div>
      </div>
      <div class="gantt-row">
        <span class="gantt-label">Pillar 2</span>
        <div class="gantt-track"><div class="gantt-fill p2" style="width: ${Math.min(100, Math.round(bridgeYrs * 20))}%">Workplace pension</div></div>
      </div>
      <div class="gantt-row">
        <span class="gantt-label">AOW (67+)</span>
        <div class="gantt-track"><div class="gantt-fill aow" style="width: 100%">Full state pension from age 67</div></div>
      </div>
    </div>
  </div>
</div>

<!-- ============ AI ANALYSIS (all 8 sections) ============ -->
<div class="page-break"></div>
<div class="container" style="padding-top: 48px;">
  <h2>Detailed Wealth Architect Analysis</h2>
  <p style="color: #64748b; font-style: italic; margin-bottom: 24px;">The following is your personalized, AI-powered analysis covering all pillars of Dutch wealth strategy.</p>
  ${contentHtml}
</div>

<!-- ============ DISCLAIMER & FOOTER ============ -->
<div class="container" style="padding-bottom: 60px;">
  <div class="disclaimer">
    <strong>Disclaimer:</strong> This report is generated by AI based on the information you provided and current Dutch tax law as of 2026.
    It does not constitute personal financial or tax advice. Always consult a qualified Dutch tax advisor (belastingadviseur)
    or financial planner (financieel planner) before making financial decisions. Tax laws, rates, and thresholds may change.
    ProsperPath is not liable for any actions taken based on this report.
  </div>

  <div class="report-footer">
    <span class="brand">ProsperPath</span> &bull; AI-Powered Dutch Wealth Strategy &bull; ${dateStr}<br>
    This is a personalized report. Do not share publicly.
  </div>
</div>

</body>
</html>`;

    // Open in new window for printing as PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      // Auto-trigger print dialog (Save as PDF)
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      // Fallback: download as HTML file if popup blocked
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'VrijWealth-Wealth-Strategy.html';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Loading messages to keep users engaged
  const loadingMessages = [
    "Scanning 2026 Dutch Tax Law... Every day you wait is a day of missed compounding.",
    "Checking for 'wealth leaks'... You might be losing up to 2% of your net worth to inflation right now.",
    "Calculating your 'Tax Drag'... Don't let Box 3 eat your retirement before it even starts.",
    "Analyzing your mortgage... Is your bank getting richer while your freedom date stays the same?",
    "Finding the money you're leaving on the table...",
    "Reviewing your Box 3 assets for optimization opportunities...",
    "Comparing 2026 vs 2028 tax scenarios... The new rules change everything.",
    "Building your personalized wealth exit strategy...",
    "Calculating compound interest on your discovered savings...",
    "Your financial freedom date is about to be revealed..."
  ];

  // Cycle through loading messages every 4 seconds
  useEffect(() => {
    let interval;
    if (isSubmitting) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isSubmitting, loadingMessages.length]);
  
  // Default form data (used for initialization and reset)
  const defaultFormData = {
    // Household
    fullName: '',
    age: 30,
    retirementAge: 67,
    country: 'Netherlands',
    hasSpouse: false,
    spouseGrossSalary: 0,
    hasChildren: false,
    childrenCount: 0,
    // Financials (legacy)
    grossSalary: 60000,
    has30PercentRuling: false,
    savingsAmount: 90000,
    investmentAmount: 150000,
    debtAmount: 0,
    // Bank & Savings (detailed)
    savingsBalance: 30000,
    interestEarned: 900,
    // Stocks & Crypto (detailed)
    cryptoValueJan1: 20000,
    cryptoValueDec31: 50000,
    dividendsReceived: 2000,
    // Real Estate (detailed)
    propertyValue: 500000,
    rentalIncome: 0,
    saleProceeds: 0,
    purchasePrice: 400000,
    // Deductions
    debtInterest: 0,
    // Loss Carry-Forward
    priorYearLoss: 0,
    // Dutch Tax
    jaarruimte: 0,
    factorA: 0,
    spouseFactorA: 0,
    spouseJaarruimte: 0,
    // Pillar 1 - State Pension
    arrivalAgeNL: 0,
    yearsAbroad: 0,
    spouseArrivalAgeNL: 0,
    spouseYearsAbroad: 0,
    // Pillar 2 - Workplace Pension
    builtUpPension: 0,
    spouseBuiltUpPension: 0,
    // Pillar 3 - Private Pension
    reserveringsruimte: 0,
    spouseReserveringsruimte: 0,
    // Real Estate (legacy)
    homeValue: 0,
    mortgageBalance: 0,
    mortgageInterestRate: 0,
    mortgageYearsLeft: 0,
    // Upgrade Scenario
    targetPropertyValue: 0,
    plannedMoveDate: '',
    // Retirement
    targetRetirementAge: 55,
    desiredMonthlyIncome: 3000,
    lifeExpectancy: 90
  };

  // Form data with detailed financial breakdown
  const [formData, setFormData] = useState({ ...defaultFormData });

  const t = translations[language];

  // Presets
  const presets = {
    starter: { savings: 40000, investments: 50000, expectedReturn: 7, realEstate: 0, mortgage: 0 },
    growing: { savings: 90000, investments: 150000, expectedReturn: 9, realEstate: 0, mortgage: 0 },
    established: { savings: 200000, investments: 500000, expectedReturn: 12, realEstate: 0, mortgage: 0 }
  };

  const applyPreset = (presetName) => {
    setPreset(presetName);
    const p = presets[presetName];
    setSavings(p.savings);
    setInvestments(p.investments);
    setExpectedReturn(p.expectedReturn);
    setRealEstate(p.realEstate);
    setMortgage(p.mortgage);
  };

  // Calculate net worth from detailed inputs
  const totalAssets = savingsBalance + cryptoValueDec31 + propertyValue;
  const netWorth = totalAssets;

  // Tax-free allowance (2024/2025)
  const taxFreeAllowance = 57000;

  // ===== 2024 SYSTEM (Fictional/Notional Yield) =====
  const calculate2024TaxDetails = () => {
    // === 2024 FICTIONAL YIELD SYSTEM ===
    // Use Jan 1 asset values to calculate notional returns
    const assetsJan1 = savingsBalance + cryptoValueJan1 + propertyValue;
    
    // Step 1: Calculate total notional return using official 2024 rates
    const savingsNotionalReturn = savingsBalance * 0.0103; // 1.03% for savings
    const investmentAndOtherReturn = (cryptoValueJan1 + propertyValue) * 0.0604; // 6.04% for investments & other
    const totalNotionalReturn = savingsNotionalReturn + investmentAndOtherReturn;
    
    // Step 2: Calculate effective yield rate
    const effectiveYield = assetsJan1 > 0 ? totalNotionalReturn / assetsJan1 : 0;
    
    // Step 3: Determine taxable basis (total assets minus tax-free allowance)
    const taxableBase = Math.max(0, assetsJan1 - 57000); // €57,000 tax-free allowance
    
    // Step 4: Calculate final tax (taxable basis × effective yield × 36%)
    const taxDue = taxableBase * effectiveYield * 0.36;
    
    return {
      assetsJan1,
      savingsBalance,
      cryptoValueJan1,
      propertyValue,
      totalAssets: assetsJan1,
      savingsNotionalReturn,
      investmentAndOtherReturn,
      totalNotionalReturn,
      effectiveYield,
      taxFreeAllowance: 57000,
      taxableBase,
      taxDue: Math.max(0, Math.round(taxDue))
    };
  };

  const calculate2024Tax = () => {
    return calculate2024TaxDetails().taxDue;
  };

  // ===== 2028 SYSTEM (Actual Returns) =====
  const calculate2028TaxDetails = () => {
    // Step 1: Sum total actual profit (direct income + value growth)
    const interestIncome = interestEarned; // Interest is taxed
    const dividendIncome = dividendsReceived; // Dividends are taxed
    const unrealizedCryptoGain = cryptoValueDec31 - cryptoValueJan1; // Unrealized gains are taxed
    const rentalIncomeAmount = rentalIncome; // Rental income is taxed
    // Property value gain NOT taxed annually (only upon sale)
    
    const totalActualProfit = interestIncome + dividendIncome + unrealizedCryptoGain + rentalIncomeAmount;
    
    // Step 2: Apply deductions (interest paid on debts, prior year losses)
    const netProfit = totalActualProfit - debtInterest - priorYearLoss;
    
    // Step 3: Apply €1,800 tax-free income threshold
    const taxFreeThreshold = 1800;
    const taxableProfit = Math.max(0, netProfit - taxFreeThreshold);
    
    // Step 4: Apply 36% tax
    const taxDue = taxableProfit * 0.36;
    
    // Calculate cash income for liquidity ratio
    const directCashIncome = interestIncome + dividendIncome + rentalIncomeAmount;
    const liquidityRatio = directCashIncome > 0 ? (taxDue / directCashIncome) * 100 : 0;
    
    return {
      interestIncome,
      dividendIncome,
      unrealizedCryptoGain,
      rentalIncomeAmount,
      totalActualProfit,
      debtInterest,
      priorYearLoss,
      netProfit,
      taxFreeThreshold,
      taxableProfit,
      directCashIncome,
      liquidityRatio,
      taxDue: Math.max(0, Math.round(taxDue))
    };
  };

  const calculate2028Tax = () => {
    return calculate2028TaxDetails().taxDue;
  };

  // ===== 2024 COUNTER-EVIDENCE OPPORTUNITY =====
  const calculate2024CounterEvidenceTax = () => {
    // If actual return is lower than notional, you can pay tax on actual return (Supreme Court 2024)
    const taxableBase = Math.max(0, netWorth - taxFreeAllowance);
    
    // Calculate actual returns
    const actualSavingsReturn = interestEarned;
    const actualCryptoReturn = cryptoValueDec31 - cryptoValueJan1;
    const actualRealEstateReturn = 0;
    
    const totalActualReturn = actualSavingsReturn + actualCryptoReturn + actualRealEstateReturn + dividendsReceived - debtInterest;
    
    // Proportion attributable to taxable base
    const proportionTaxable = netWorth > 0 ? taxableBase / netWorth : 0;
    const taxableActualReturn = totalActualReturn * proportionTaxable;
    
    const taxDue = Math.max(0, taxableActualReturn * 0.36);
    return Math.round(taxDue);
  };

  const currentTax = calculate2024Tax();
  const newTax = calculate2028Tax();
  const counterEvidenceTax = calculate2024CounterEvidenceTax();
  const potentialRefund = Math.max(0, currentTax - counterEvidenceTax);
  const difference = newTax - currentTax;

  // Form handling
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Auto-select input content on focus (fixes mobile UX — no need to delete "0" first)
  const handleInputFocus = (e) => {
    e.target.select();
  };

  // Sync detailed financial data from form to state variables
  const syncDetailedFinancials = () => {
    setSavingsBalance(formData.savingsBalance || 0);
    setInterestEarned(formData.interestEarned || 0);
    setCryptoValueJan1(formData.cryptoValueJan1 || 0);
    setCryptoValueDec31(formData.cryptoValueDec31 || 0);
    setDividendsReceived(formData.dividendsReceived || 0);
    setPropertyValue(formData.propertyValue || 0);
    setRentalIncome(formData.rentalIncome || 0);
    setSaleProceeds(formData.saleProceeds || 0);
    setPurchasePrice(formData.purchasePrice || 0);
    setDebtInterest(formData.debtInterest || 0);
    setPriorYearLoss(formData.priorYearLoss || 0);
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 'household') {
      if (!formData.fullName.trim()) {
        errors.fullName = 'Full name is required';
      }
      if (!formData.age || formData.age < 18 || formData.age > 100) {
        errors.age = 'Please enter a valid age (18-100)';
      }
      if (!formData.retirementAge || formData.retirementAge < formData.age || formData.retirementAge > 100) {
        errors.retirementAge = 'Retirement age must be greater than current age';
      }
      if (!formData.country.trim()) {
        errors.country = 'Country is required';
      }
      if (formData.hasChildren && (!formData.childrenCount || formData.childrenCount < 1)) {
        errors.childrenCount = 'Please enter number of children';
      }
    } else if (step === 'financials') {
      if (formData.grossSalary === '' || formData.grossSalary === null || formData.grossSalary === undefined) {
        errors.grossSalary = 'Gross salary is required (can be 0)';
      }
      // New detailed fields are optional, just ensure types are correct
      if (formData.savingsBalance === null || formData.savingsBalance === undefined) {
        formData.savingsBalance = 0;
      }
      if (formData.interestEarned === null || formData.interestEarned === undefined) {
        formData.interestEarned = 0;
      }
      if (formData.cryptoValueJan1 === null || formData.cryptoValueJan1 === undefined) {
        formData.cryptoValueJan1 = 0;
      }
      if (formData.cryptoValueDec31 === null || formData.cryptoValueDec31 === undefined) {
        formData.cryptoValueDec31 = 0;
      }
      if (formData.dividendsReceived === null || formData.dividendsReceived === undefined) {
        formData.dividendsReceived = 0;
      }
      if (formData.debtInterest === null || formData.debtInterest === undefined) {
        formData.debtInterest = 0;
      }
    } else if (step === 'pension') {
      if (formData.jaarruimte === '' || formData.jaarruimte === null || formData.jaarruimte === undefined) {
        errors.jaarruimte = 'Jaarruimte is required (can be 0)';
      }
      if (formData.factorA === '' || formData.factorA === null || formData.factorA === undefined) {
        errors.factorA = 'Factor A is required (can be 0)';
      }
    } else if (step === 'realEstate') {
      if (formData.mortgageBalance === '' || formData.mortgageBalance === null || formData.mortgageBalance === undefined) {
        errors.mortgageBalance = 'Mortgage balance is required (can be 0)';
      }
      if (formData.mortgageInterestRate === '' || formData.mortgageInterestRate === null || formData.mortgageInterestRate === undefined) {
        errors.mortgageInterestRate = 'Interest rate is required (can be 0)';
      }
      if (formData.mortgageYearsLeft === '' || formData.mortgageYearsLeft === null || formData.mortgageYearsLeft === undefined) {
        errors.mortgageYearsLeft = 'Years left is required (can be 0)';
      }
      // New detailed fields are optional
      if (formData.propertyValue === null || formData.propertyValue === undefined) {
        formData.propertyValue = 0;
      }
      if (formData.rentalIncome === null || formData.rentalIncome === undefined) {
        formData.rentalIncome = 0;
      }
      if (formData.saleProceeds === null || formData.saleProceeds === undefined) {
        formData.saleProceeds = 0;
      }
      if (formData.purchasePrice === null || formData.purchasePrice === undefined) {
        formData.purchasePrice = 0;
      }
      if (formData.priorYearLoss === null || formData.priorYearLoss === undefined) {
        formData.priorYearLoss = 0;
      }
    } else if (step === 'retirement') {
      if (!formData.targetRetirementAge || formData.targetRetirementAge < 30 || formData.targetRetirementAge > 80) {
        errors.targetRetirementAge = 'Please enter a valid retirement age (30-80)';
      }
      if (!formData.desiredMonthlyIncome || formData.desiredMonthlyIncome < 0) {
        errors.desiredMonthlyIncome = 'Please enter your desired monthly income';
      }
    }
    
    return errors;
  };

  const handleGetStarted = () => {
    setFormData({ ...defaultFormData });
    setShowQuestionnaire(true);
    setCurrentStep('household');
    setValidationErrors({});
  };

  const handleContinue = async () => {
    // Validate current step
    const errors = validateStep(currentStep);
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // Clear errors and proceed
    setValidationErrors({});
    
    if (currentStep === 'household') {
      setCurrentStep('financials');
    } else if (currentStep === 'financials') {
      setCurrentStep('pension');
    } else if (currentStep === 'pension') {
      setCurrentStep('realEstate');
    } else if (currentStep === 'realEstate') {
      setCurrentStep('retirement');
    } else if (currentStep === 'retirement') {
      // Submit to Vertex AI
      await submitToVertexAI();
    }
  };

  const handleBack = () => {
    if (currentStep === 'financials') {
      setCurrentStep('household');
    } else if (currentStep === 'pension') {
      setCurrentStep('financials');
    } else if (currentStep === 'realEstate') {
      setCurrentStep('pension');
    } else if (currentStep === 'retirement') {
      setCurrentStep('realEstate');
    }
  };

  const submitToVertexAI = async () => {
    // Sync detailed financial data from form to state variables
    syncDetailedFinancials();

    // Calculate total Box 3 assets
    const totalBox3Assets = formData.savingsAmount + formData.investmentAmount - formData.debtAmount;
    const taxFreeAllowance = formData.hasSpouse ? 114000 : 57000; // 2026 allowance
    const taxableBase = Math.max(0, totalBox3Assets - taxFreeAllowance);

    const aowPct = Math.max(0, Math.min(100, (50 - formData.yearsAbroad) * 2));
    const bridgeYrs = Math.max(0, Math.round((67.25 - formData.targetRetirementAge) * 10) / 10);
    const bridgeCost = Math.round(bridgeYrs * 12 * formData.desiredMonthlyIncome);
    const netWealth = formData.savingsBalance + formData.cryptoValueDec31 + formData.propertyValue - formData.mortgageBalance;
    const p3Room = formData.jaarruimte + formData.reserveringsruimte;
    const equity = formData.propertyValue - formData.mortgageBalance;
    const aowShortfall = Math.round((1 - aowPct / 100) * 1637);
    const basicAge = parseInt(formData.age) || 30;
    const basicYearsToFire = Math.max(0, formData.targetRetirementAge - basicAge);
    const basicInflationMultiplier = Math.pow(1.022, basicYearsToFire);
    const basicFutureMonthlyNeed = Math.round(formData.desiredMonthlyIncome * basicInflationMultiplier);
    const futureBridgeCostBasic = Math.round(bridgeYrs * 12 * basicFutureMonthlyNeed);

    const prompt = `Dutch FIRE & Tax Architect. Analyze profile, find Wealth Leakage, provide 2026-optimized early retirement roadmap.

2026-27: Fictitious rates (Savings 1.44%, Assets 6%, Debt 2.62%). 2028+: Actual Returns (36% on real gains). Exemption €${formData.hasSpouse ? '114k' : '57k'}.

PROFILE: Age ${formData.age} | FIRE ${formData.targetRetirementAge} | Need €${formData.desiredMonthlyIncome}/mo | Plan to ${formData.lifeExpectancy} | ${formData.hasSpouse ? 'Partnered' : 'Single'}${formData.hasChildren ? ` ${formData.childrenCount}kids` : ''} | Salary €${formData.grossSalary}${formData.hasSpouse ? ` Spouse €${formData.spouseGrossSalary}` : ''} | 30%Rule: ${formData.has30PercentRuling ? 'Y' : 'N'}
ASSETS: Bank €${formData.savingsBalance} (int €${formData.interestEarned}) | Crypto Jan€${formData.cryptoValueJan1}→Dec€${formData.cryptoValueDec31} | Div €${formData.dividendsReceived} | DebtInt €${formData.debtInterest}
PROPERTY: WOZ €${formData.propertyValue} Mortgage €${formData.mortgageBalance}@${formData.mortgageInterestRate}% ${formData.mortgageYearsLeft}yr | Equity €${equity}${formData.targetPropertyValue > 0 ? ` | Upgrade €${formData.targetPropertyValue}` : ''} | Rental €${formData.rentalIncome} Sale €${formData.saleProceeds} Cost €${formData.purchasePrice} | Loss €${formData.priorYearLoss}
PENSION: P1 AOW ${aowPct}% (abroad ${formData.yearsAbroad}yr, gap €${aowShortfall}/mo)${formData.hasSpouse ? ` Spouse ${Math.max(0, Math.min(100, (50 - formData.spouseYearsAbroad) * 2))}%` : ''} | P2 €${formData.builtUpPension}/yr FactorA €${formData.factorA}${formData.hasSpouse ? ` Sp €${formData.spouseBuiltUpPension}/yr FA €${formData.spouseFactorA}` : ''} | P3 Jaar €${formData.jaarruimte} Res €${formData.reserveringsruimte}${formData.hasSpouse ? ` Sp J€${formData.spouseJaarruimte} R€${formData.spouseReserveringsruimte}` : ''}
RETIRE: Bridge ${Math.round(bridgeYrs)}yr = €${futureBridgeCostBasic.toLocaleString()} self-funded (inflation-adj) | Wealth €${netWealth.toLocaleString()} | SWR need €${Math.round(basicFutureMonthlyNeed * 12 / 0.04).toLocaleString()}@4%

INFLATION (CRITICAL — apply throughout):
- NL Inflation: 2.2%/yr. Years to FIRE: ${basicYearsToFire}.
- Today's Need: €${formData.desiredMonthlyIncome}/mo → At FIRE: €${basicFutureMonthlyNeed}/mo (×(1.022)^${basicYearsToFire}).
- Real Return = Nominal − 2.2% for all growth projections (keep values in Today's Euro).
- All € amounts MUST be inflation-adjusted. Show both today's and future euros.

TASKS: (1) Bridge cost age ${formData.targetRetirementAge}→67 (2) AOW gap from ${formData.yearsAbroad}yr abroad (3) 2028 stress test on crypto/stocks (4) Box 3 tax drag (5) House-as-shield from €${equity} equity (6) SWR over ${formData.lifeExpectancy - formData.targetRetirementAge}yr

OUTPUT FORMAT:
MONTHLY_NEED: ${formData.desiredMonthlyIncome}
TARGET_NEST_EGG: [total capital to retire at ${formData.targetRetirementAge} until ${formData.lifeExpectancy}]
GAP_TO_FILL: [shortfall vs target]
MONTHLY_SAVINGS_TARGET: [to close gap]
ALLOCATION_STOCKS: [0-100]
ALLOCATION_BONDS: [0-100]
ALLOCATION_REAL_ESTATE: [0-100]
ALLOCATION_CASH: [0-100]
CURRENT_WEALTH: ${netWealth}
PROJECTED_AT_RETIREMENT: [number]

---ACTIONS---
ACTION_STEP_1_TITLE: Bridge Phase Strategy
ACTION_STEP_1_PRIORITY: Critical
ACTION_STEP_1_TAG: Retirement
ACTION_STEP_1_DESC: Need €${futureBridgeCostBasic.toLocaleString()} (inflation-adjusted) for ${Math.round(bridgeYrs)} bridge years at €${basicFutureMonthlyNeed}/mo before AOW. Recommend specific fund/approach.

ACTION_STEP_2_TITLE: Maximize Pillar 3
ACTION_STEP_2_PRIORITY: High Priority
ACTION_STEP_2_TAG: NL Tax
ACTION_STEP_2_DESC: €${p3Room} combined room. Immediate 37-49.5% refund + Box 3 shield.

ACTION_STEP_3_TITLE: Box 1 vs Box 3 Shelter
ACTION_STEP_3_PRIORITY: Medium Priority
ACTION_STEP_3_TAG: Strategy
ACTION_STEP_3_DESC: €${equity.toLocaleString()} equity. Optimize mortgage vs Box 3 exposure vs HRA.

ACTION_STEP_4_TITLE: 2028 Preparation
ACTION_STEP_4_PRIORITY: High Priority
ACTION_STEP_4_TAG: Tax Hack
ACTION_STEP_4_DESC: Tegenbewijsregeling if real gains <6%. Restructure before regime shift.

ACTION_STEP_5_TITLE: Safe Withdrawal Plan
ACTION_STEP_5_PRIORITY: High Priority
ACTION_STEP_5_TAG: Retirement
ACTION_STEP_5_DESC: €${basicFutureMonthlyNeed}/mo (inflation-adjusted from €${formData.desiredMonthlyIncome} today) over ${formData.lifeExpectancy - formData.targetRetirementAge}yr. Adjust SWR for Dutch tax/inflation using real returns.

---DUTCH_TAX---
BOX3_STRATEGY: Savings vs Assets split. Box 3 total €${formData.savingsBalance + formData.cryptoValueDec31}. Optimize before 2028.
PENSION_RECOMMENDATIONS: AOW ${aowPct}% (gap €${aowShortfall}/mo). Bridge via Lijfrente + P2 €${Math.round(formData.builtUpPension / 12)}/mo.
ESTIMATED_ANNUAL_BOX3_TAX: [Calculate: 36% × (Stocks×0.06 + Savings×0.0144 - Debt×0.0262) minus exemption]

---PRODUCTS---
PRODUCT_1_NAME: Brand New Day (Lijfrente)
PRODUCT_1_TYPE: Pension Fund
PRODUCT_1_DESC: Low-cost index Lijfrente for Jaarruimte/Reserveringsruimte.
PRODUCT_2_NAME: Meesman Indexbeleggen
PRODUCT_2_TYPE: Fund
PRODUCT_2_DESC: Box 3 friendly via fiscal transparency.
---

STRATEGIC SUMMARY (Max 150 words): Bridge funding age ${formData.targetRetirementAge}→AOW (€${futureBridgeCostBasic.toLocaleString()} inflation-adjusted), Box 3 optimization pre-2028, Pillar 3 maximization, AOW gap, SWR sustainability using real returns (nominal − 2.2%). Actionable € amounts in today's euros.

IMPORTANT: Do NOT write any introduction, preamble, or opening paragraph. Start directly with the structured output (MONTHLY_NEED, TARGET_NEST_EGG, etc.) followed by the action steps and strategy sections. Do not introduce yourself or explain what you are doing.`;

    setIsSubmitting(true);
    setLoadingMessageIndex(0);
    
    try {
      // Create abort controller for client-side timeout
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 360000); // 6 minutes client timeout

      // Send to backend which will call Vertex AI
      const response = await fetch('/api/vertex', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Connection': 'keep-alive'
        },
        body: JSON.stringify({ prompt }),
        signal: abortController.signal,
        keepalive: true
      });

      clearTimeout(timeoutId);

      const result = await response.json();
      
      if (!response.ok) {
        const errorMsg = result.error || result.details || `HTTP error! status: ${response.status}`;
        throw new Error(errorMsg);
      }

      // Extract text from Gemini API response structure
      let responseText = '';
      if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts) {
        responseText = result.candidates[0].content.parts[0].text;
      } else if (result.text) {
        responseText = result.text;
      } else if (result.response) {
        responseText = result.response;
      } else {
        responseText = JSON.stringify(result, null, 2);
      }
      
      console.log('=== RAW AI RESPONSE (first 2000 chars) ===');
      console.log(responseText.substring(0, 2000));
      console.log('=== END RAW RESPONSE ===');
      
      // Parse metrics from response
      const metricsParsed = {
        monthlyNeed: 0,
        targetNestEgg: 0,
        gapToFill: 0,
        monthlySavingsTarget: 0
      };
      
      const allocationParsed = {
        stocks: 0,
        bonds: 0,
        realEstate: 0,
        cash: 0
      };
      
      const projectionParsed = {
        currentWealth: 0,
        projectedAtRetirement: 0,
        targetNestEgg: 0
      };
      
      const actionStepsParsed = [];
      const dutchTaxParsed = {
        box3Strategy: '',
        pensionRecommendations: '',
        estimatedAnnualTax: 0
      };
      const productsParsed = [];
      
      // Split response into lines for parsing
      const lines = responseText.split('\n');
      let strategyLines = [];
      let foundMetrics = false;
      
      // Parse each line
      let currentSection = 'metrics'; // Track which section we're in
      let currentMultiLineField = null; // Track if we're collecting multi-line values
      let currentMultiLineValue = '';
      
      for (let line of lines) {
        const trimmedLine = line.trim();
        
        // Check for section separators (both -- and --- format)
        if (trimmedLine.match(/^-{2,}(ACTIONS|DUTCH_TAX|PRODUCTS)?-{0,}$/)) {
          // Save any pending multi-line field
          if (currentMultiLineField) {
            if (currentMultiLineField === 'box3Strategy') dutchTaxParsed.box3Strategy = currentMultiLineValue.trim();
            else if (currentMultiLineField === 'pensionRecommendations') dutchTaxParsed.pensionRecommendations = currentMultiLineValue.trim();
            currentMultiLineField = null;
            currentMultiLineValue = '';
          }
          
          if (trimmedLine.includes('ACTIONS')) currentSection = 'actions';
          else if (trimmedLine.includes('DUTCH_TAX')) currentSection = 'dutch_tax';
          else if (trimmedLine.includes('PRODUCTS')) currentSection = 'products';
          else currentSection = 'strategy';
          continue; // Skip separator lines
        }
        
        // Parse structured data lines — always check regardless of current section
        // This handles AI responses that mix prose with structured output
        // Strip markdown bold markers and leading bullet markers for parsing
        const cleanLine = trimmedLine.replace(/\*\*/g, '').replace(/^[-•*]\s*/, '').trim();
        
        // Debug: log lines that look like they contain metric keys
        if (/MONTHLY_NEED|TARGET_NEST|GAP_TO|MONTHLY_SAVINGS/i.test(cleanLine)) {
          console.log('METRIC LINE FOUND:', JSON.stringify(cleanLine));
        }
        
        if (cleanLine.match(/^MONTHLY_NEED[:\s]/i)) {
          const match = cleanLine.match(/MONTHLY_NEED:?\s*[€$]?([\d,\.]+)/i);
          if (match) metricsParsed.monthlyNeed = parseInt(match[1].replace(/[,\.]/g, ''));
          foundMetrics = true;
          continue;
        } else if (cleanLine.match(/^TARGET_NEST_EGG[:\s]/i)) {
          const match = cleanLine.match(/TARGET_NEST_EGG:?\s*[€$]?([\d,\.]+)/i);
          if (match) metricsParsed.targetNestEgg = parseInt(match[1].replace(/[,\.]/g, ''));
          foundMetrics = true;
          continue;
        } else if (cleanLine.match(/^GAP_TO_FILL[:\s]/i)) {
          const match = cleanLine.match(/GAP_TO_FILL:?\s*[€$]?([\d,\.]+)/i);
          if (match) metricsParsed.gapToFill = parseInt(match[1].replace(/[,\.]/g, ''));
          foundMetrics = true;
          continue;
        } else if (cleanLine.match(/^MONTHLY_SAVINGS_TARGET[:\s]/i)) {
          const match = cleanLine.match(/MONTHLY_SAVINGS_TARGET:?\s*[€$]?([\d,\.]+)/i);
          if (match) metricsParsed.monthlySavingsTarget = parseInt(match[1].replace(/[,\.]/g, ''));
          foundMetrics = true;
          continue;
        } else if (cleanLine.match(/^ALLOCATION_STOCKS[:\s]/i)) {
          const match = cleanLine.match(/ALLOCATION_STOCKS:?\s*(\d+)%?/i);
          if (match) allocationParsed.stocks = parseInt(match[1]);
          foundMetrics = true;
          continue;
        } else if (cleanLine.match(/^ALLOCATION_BONDS[:\s]/i)) {
          const match = cleanLine.match(/ALLOCATION_BONDS:?\s*(\d+)%?/i);
          if (match) allocationParsed.bonds = parseInt(match[1]);
          foundMetrics = true;
          continue;
        } else if (cleanLine.match(/^ALLOCATION_REAL_ESTATE[:\s]/i)) {
          const match = cleanLine.match(/ALLOCATION_REAL_ESTATE:?\s*(\d+)%?/i);
          if (match) allocationParsed.realEstate = parseInt(match[1]);
          foundMetrics = true;
          continue;
        } else if (cleanLine.match(/^ALLOCATION_CASH[:\s]/i)) {
          const match = cleanLine.match(/ALLOCATION_CASH:?\s*(\d+)%?/i);
          if (match) allocationParsed.cash = parseInt(match[1]);
          foundMetrics = true;
          continue;
        } else if (cleanLine.match(/^CURRENT_WEALTH[:\s]/i)) {
          const match = cleanLine.match(/CURRENT_WEALTH:?\s*[€$]?([\d,\.]+)/i);
          if (match) projectionParsed.currentWealth = parseInt(match[1].replace(/[,\.]/g, ''));
          foundMetrics = true;
          continue;
        } else if (cleanLine.match(/^PROJECTED_AT_RETIREMENT[:\s]/i)) {
          const match = cleanLine.match(/PROJECTED_AT_RETIREMENT:?\s*[€$]?([\d,\.]+)/i);
          if (match) projectionParsed.projectedAtRetirement = parseInt(match[1].replace(/[,\.]/g, ''));
          foundMetrics = true;
          continue;
        } else if (cleanLine.match(/^ACTION_STEP_/i)) {
          const stepMatch = cleanLine.match(/ACTION_STEP_(\d+)_(TITLE|PRIORITY|TAG|DESC):?\s*(.+)/i);
          if (stepMatch) {
            const stepNum = parseInt(stepMatch[1]) - 1;
            const field = stepMatch[2].toLowerCase();
            const value = stepMatch[3].trim();
            
            if (!actionStepsParsed[stepNum]) {
              actionStepsParsed[stepNum] = { title: '', priority: '', tag: '', description: '' };
            }
            
            if (field === 'title') actionStepsParsed[stepNum].title = value;
            else if (field === 'priority') actionStepsParsed[stepNum].priority = value;
            else if (field === 'tag') actionStepsParsed[stepNum].tag = value;
            else if (field === 'desc') actionStepsParsed[stepNum].description = value;
          }
          foundMetrics = true;
          continue;
        } else if (cleanLine.match(/^BOX3_STRATEGY[:\s]/i)) {
          // Save any pending multi-line field
          if (currentMultiLineField) {
            if (currentMultiLineField === 'box3Strategy') dutchTaxParsed.box3Strategy = currentMultiLineValue.trim();
            else if (currentMultiLineField === 'pensionRecommendations') dutchTaxParsed.pensionRecommendations = currentMultiLineValue.trim();
          }
          
          const match = cleanLine.match(/BOX3_STRATEGY:?\s*(.+)/i);
          currentMultiLineField = 'box3Strategy';
          currentMultiLineValue = match && match[1] ? match[1].trim() : '';
          foundMetrics = true;
          continue;
        } else if (cleanLine.match(/^PENSION_RECOMMENDATIONS[:\s]/i)) {
          // Save any pending multi-line field
          if (currentMultiLineField) {
            if (currentMultiLineField === 'box3Strategy') dutchTaxParsed.box3Strategy = currentMultiLineValue.trim();
            else if (currentMultiLineField === 'pensionRecommendations') dutchTaxParsed.pensionRecommendations = currentMultiLineValue.trim();
          }
          
          const match = cleanLine.match(/PENSION_RECOMMENDATIONS:?\s*(.+)/i);
          currentMultiLineField = 'pensionRecommendations';
          currentMultiLineValue = match && match[1] ? match[1].trim() : '';
          foundMetrics = true;
          continue;
        } else if (cleanLine.match(/^ESTIMATED_ANNUAL_BOX3_TAX[:\s]/i)) {
          // Save any pending multi-line field
          if (currentMultiLineField) {
            if (currentMultiLineField === 'box3Strategy') dutchTaxParsed.box3Strategy = currentMultiLineValue.trim();
            else if (currentMultiLineField === 'pensionRecommendations') dutchTaxParsed.pensionRecommendations = currentMultiLineValue.trim();
            currentMultiLineField = null;
            currentMultiLineValue = '';
          }
          
          const match = cleanLine.match(/ESTIMATED_ANNUAL_BOX3_TAX:?\s*[€$]?([\d,\.]+)/i);
          if (match) dutchTaxParsed.estimatedAnnualTax = parseInt(match[1].replace(/,/g, ''));
          foundMetrics = true;
          continue;
        } else if (cleanLine.match(/^PRODUCT_/i)) {
          // Save any pending multi-line field
          if (currentMultiLineField) {
            if (currentMultiLineField === 'box3Strategy') dutchTaxParsed.box3Strategy = currentMultiLineValue.trim();
            else if (currentMultiLineField === 'pensionRecommendations') dutchTaxParsed.pensionRecommendations = currentMultiLineValue.trim();
            currentMultiLineField = null;
            currentMultiLineValue = '';
          }
          
          const prodMatch = cleanLine.match(/PRODUCT_(\d+)_(NAME|TYPE|DESC):?\s*(.+)/i);
          if (prodMatch) {
            const prodNum = parseInt(prodMatch[1]) - 1;
            const field = prodMatch[2].toLowerCase();
            const value = prodMatch[3].trim();
            
            if (!productsParsed[prodNum]) {
              productsParsed[prodNum] = { name: '', type: '', description: '' };
            }
            
            if (field === 'name') productsParsed[prodNum].name = value;
            else if (field === 'type') productsParsed[prodNum].type = value;
            else if (field === 'desc') productsParsed[prodNum].description = value;
          }
          foundMetrics = true;
          continue;
        }
        
        // Collect multi-line Dutch Tax field values
        if (currentMultiLineField && trimmedLine) {
          currentMultiLineValue += ' ' + trimmedLine;
          continue;
        }
        
        // Everything else goes to strategy text (skip empty lines and section separators)
        if (trimmedLine) {
          strategyLines.push(line);
        }
      }
      
      // Save any pending multi-line field at the end
      if (currentMultiLineField) {
        if (currentMultiLineField === 'box3Strategy') dutchTaxParsed.box3Strategy = currentMultiLineValue.trim();
        else if (currentMultiLineField === 'pensionRecommendations') dutchTaxParsed.pensionRecommendations = currentMultiLineValue.trim();
      }
      
      // Join strategy lines and clean up
      let strategyText = strategyLines.join('\n').trim();

      console.log('PARSED METRICS:', JSON.stringify(metricsParsed));
      console.log('PARSED ALLOCATION:', JSON.stringify(allocationParsed));
      console.log('PARSED PROJECTION:', JSON.stringify(projectionParsed));
      console.log('FOUND METRICS:', foundMetrics);
      
      // Set target nest egg in projection
      projectionParsed.targetNestEgg = metricsParsed.targetNestEgg;
      
      // Calculate current wealth from form data if not provided by AI
      if (projectionParsed.currentWealth === 0) {
        projectionParsed.currentWealth = formData.savingsBalance + formData.cryptoValueDec31 + formData.propertyValue - formData.mortgageBalance;
      }
      
      // If no metrics were found, use form data for current wealth as fallback
      if (!foundMetrics) {
        projectionParsed.currentWealth = formData.savingsBalance + formData.cryptoValueDec31 + formData.propertyValue - formData.mortgageBalance;
      }
      
      // Fallback allocation based on age if AI didn't provide one
      if (allocationParsed.stocks === 0 && allocationParsed.bonds === 0 && allocationParsed.realEstate === 0 && allocationParsed.cash === 0) {
        const age = parseInt(formData.age) || 30;
        const stockPct = Math.max(20, Math.min(80, 110 - age));
        const bondPct = Math.round((100 - stockPct) * 0.5);
        const rePct = Math.round((100 - stockPct) * 0.3);
        const cashPct = 100 - stockPct - bondPct - rePct;
        allocationParsed.stocks = stockPct;
        allocationParsed.bonds = bondPct;
        allocationParsed.realEstate = rePct;
        allocationParsed.cash = cashPct;
        console.log('USING FALLBACK ALLOCATION (age-based):', JSON.stringify(allocationParsed));
      }
      
      // Fallback metrics from form data if AI didn't parse them
      if (metricsParsed.monthlyNeed === 0 && formData.desiredMonthlyIncome > 0) {
        metricsParsed.monthlyNeed = parseInt(formData.desiredMonthlyIncome);
      }
      if (metricsParsed.targetNestEgg === 0 && formData.desiredMonthlyIncome > 0) {
        metricsParsed.targetNestEgg = Math.round(formData.desiredMonthlyIncome * 12 / 0.04);
        projectionParsed.targetNestEgg = metricsParsed.targetNestEgg;
      }
      if (metricsParsed.gapToFill === 0 && metricsParsed.targetNestEgg > 0) {
        metricsParsed.gapToFill = Math.max(0, metricsParsed.targetNestEgg - projectionParsed.currentWealth);
      }
      if (metricsParsed.monthlySavingsTarget === 0 && metricsParsed.gapToFill > 0) {
        const yrsLeft = Math.max(1, (formData.targetRetirementAge || 65) - (parseInt(formData.age) || 30));
        metricsParsed.monthlySavingsTarget = Math.round(metricsParsed.gapToFill / (yrsLeft * 12));
      }
      
      // Store AI response and show results page
      setMetrics(metricsParsed);
      setAllocation(allocationParsed);
      setWealthProjection(projectionParsed);
      setActionSteps(actionStepsParsed.filter(step => step.title)); // Filter out empty steps
      setDutchTaxOptimization(dutchTaxParsed);
      setRecommendedProducts(productsParsed.filter(product => product.name)); // Filter out empty products
      setAiResponse(strategyText);
      setShowQuestionnaire(false);
      setShowResults(true);
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      
      // Better error messages based on error type
      let errorMessage = 'Error processing your request.\n\n';
      
      if (error.name === 'AbortError') {
        errorMessage += 'Request timed out after 6 minutes. The AI service may be overloaded.\n\nPlease try again in a few moments.';
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage += 'Network connection error. Please check your internet connection and try again.';
      } else {
        errorMessage += `${error.message}\n\nIf this persists, the AI service may be experiencing high demand.`;
      }
      
      alert(errorMessage);
    }
  };

  const handleAdjustParameters = () => {
    setShowResults(false);
    setShowQuestionnaire(true);
    setCurrentStep('household');
  };

  // Payment Modal (rendered across all pages)
  const paymentModal = showPaymentModal ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !paymentProcessing && setShowPaymentModal(false)}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">VrijWealth</h3>
                <p className="text-slate-400 text-xs">Secure checkout</p>
              </div>
            </div>
            {!paymentProcessing && (
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {paymentSuccess ? (
          /* Success State */
          <div className="px-6 py-8 text-center">
            {pdfGenerating ? (
              /* PDF Generation in Progress */
              <>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="animate-spin w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-slate-900 text-xl font-bold mb-2">Generating Your Premium Report...</h3>
                <p className="text-slate-500 text-sm mb-4">Our AI is creating your personalized 8-section wealth strategy with Dutch tax optimization, geo-arbitrage analysis, and retirement simulation.</p>
                <div className="space-y-2 text-left max-w-xs mx-auto">
                  {['Wealth Shield & 2028 Prep', 'Pension Audit (Pillar 1-3)', 'Real Estate Optimization', 'Family Wealth Transfer', 'Global Retirement (10 countries)', 'Bridge Phase Strategy', 'Final Verdict & Simulation'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                      <svg className="animate-pulse w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="4" />
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* PDF Ready */
              <>
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-slate-900 text-xl font-bold mb-2">
                  {pdfReady ? 'Your Premium Report is Ready!' : 'Payment Successful!'}
                </h3>
                <p className="text-slate-500 text-sm mb-5">
                  {pdfReady 
                    ? '8-section wealth strategy with Dutch tax optimization. Click below to view and save as PDF.'
                    : 'Your personalized wealth strategy is ready for download.'
                  }
                </p>

                {/* Disclaimer Checkbox */}
                <label className={`flex items-start gap-3 p-3 rounded-lg border mb-4 cursor-pointer transition-colors ${
                  disclaimerAccepted 
                    ? 'bg-emerald-50 border-emerald-300' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={disclaimerAccepted}
                    onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 flex-shrink-0"
                  />
                  <span className="text-slate-600 text-xs leading-relaxed">
                    I understand that this is an AI-generated strategy for educational purposes and I will verify key actions with a qualified professional.
                  </span>
                </label>
                
                <button
                  onClick={handleDownloadPDF}
                  disabled={!disclaimerAccepted}
                  className={`w-full font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg ${
                    disclaimerAccepted
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF Strategy
                </button>
                
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="mt-3 text-slate-400 hover:text-slate-600 text-sm transition-colors"
                >
                  Close
                </button>
              </>
            )}
          </div>
        ) : (
          /* Payment Form */
          <div className="px-6 py-6">
            {/* Order Summary */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-700 font-medium text-sm">AI Wealth Strategy PDF</span>
                <span className="text-slate-400 line-through text-sm">€99</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-600 text-xs font-medium">Launch discount (80% off)</span>
                <span className="text-slate-900 font-bold text-xl">€19.99</span>
              </div>
            </div>

            {/* Mock Card Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-slate-600 text-xs font-medium mb-1.5">Email</label>
                <input 
                  type="email" 
                  placeholder="you@example.com"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 text-xs font-medium mb-1.5">Card number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="4242 4242 4242 4242"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none pr-16"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <div className="w-8 h-5 bg-blue-600 rounded text-white text-[6px] font-bold flex items-center justify-center">VISA</div>
                    <div className="w-8 h-5 bg-red-500 rounded text-white text-[6px] font-bold flex items-center justify-center">MC</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 text-xs font-medium mb-1.5">Expiry</label>
                  <input 
                    type="text" 
                    placeholder="MM / YY"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-xs font-medium mb-1.5">CVC</label>
                  <input 
                    type="text" 
                    placeholder="123"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handleMockPayment}
              disabled={paymentProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
            >
              {paymentProcessing ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pay €19.99
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 mt-4 text-slate-400 text-xs">
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                SSL Encrypted
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Powered by Stripe
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Secure Payment
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;

  // ===== Disclaimer Page =====
  if (showDisclaimer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        {paymentModal}
        {/* Header */}
        <div className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setShowDisclaimer(false)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              <span className="text-sm font-medium">Back to Home</span>
            </button>
            <span className="text-sm text-slate-500 font-medium tracking-wider uppercase">VrijWealth</span>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">Legal Notice</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4">
              Disclaimer & Important Information
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Please read the following information carefully before using VrijWealth services.
            </p>
          </div>

          {/* Disclaimer Sections */}
          <div className="space-y-6">
            {/* Section 1: Nature of Service */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-lg">1</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">Nature of Service</h2>
                  <p className="text-slate-300 leading-relaxed">
                    VrijAI is an AI-powered informational tool developed by Vrij Wealth. It is designed to provide general financial insights and educational content only. VrijAI does not provide personalised financial advice, investment recommendations, or tax planning services.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Not Financial Advice */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-emerald-400 font-bold text-lg">2</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">Not Financial Advice</h2>
                  <p className="text-slate-300 leading-relaxed">
                    The outputs generated by VrijAI — including projections, scenarios, tax estimates, and commentary — are for informational and illustrative purposes only. They do not constitute financial advice, legal advice, tax advice, or any form of regulated advisory service under Dutch or EU financial regulations (including MiFID II and the Wet op het financieel toezicht, "Wft").
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Accuracy & Risk */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-amber-400 font-bold text-lg">3</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">Accuracy & Risk</h2>
                  <p className="text-slate-300 leading-relaxed">
                    While we strive to maintain accurate and up-to-date models, VrijAI may produce outputs that are incomplete, outdated, or incorrect. AI-generated content should never be used as the sole basis for any financial, investment, or tax-related decision. All financial decisions involve risk, including the risk of loss. Past performance or projected outcomes are not indicative of future results.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Mandatory Verification */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-purple-400 font-bold text-lg">4</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">Mandatory Verification</h2>
                  <p className="text-slate-300 leading-relaxed">
                    Users are strongly encouraged to consult a licensed financial adviser, tax professional, or legal expert before acting on any information provided by VrijAI. By using this tool, you acknowledge and accept that Vrij Wealth and its affiliates bear no liability for decisions made based on VrijAI outputs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700/40 rounded-full px-5 py-2.5">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-xs text-slate-400">
                © {new Date().getFullYear()} Vrij Wealth. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== Box 3 Detailed Comparison Page =====
  if (showBox3Comparison) {
    const portfolioProfiles = {
      conservative: { label: 'Conservative', emoji: '🛡', nominal: 0.05, color: 'red' },
      balanced: { label: 'Balanced', emoji: '⚖️', nominal: 0.07, color: 'orange' },
      growth: { label: 'Growth', emoji: '📈', nominal: 0.09, color: 'indigo' },
      aggressive: { label: 'Aggressive', emoji: '🚀', nominal: 0.12, color: 'purple' },
    };
    const profile = portfolioProfiles[box3PortfolioType];
    const nominalReturn = profile.nominal;
    const inflRate = 0.022;
    const realReturn = nominalReturn - inflRate;
    const currentAge = parseInt(formData.age) || 25;
    const fireAge = box3FireAge;
    const lifeExp = box3LifeExpectancy;
    const annualSavings = box3MonthlySavings * 12;
    const startCap = box3StartingCapital;
    const annualWithdraw = box3AnnualWithdrawal;
    const box3Exempt = formData.hasSpouse ? 114000 : 57000;

    // Run simulation for both tax regimes
    const runSim = (regime) => {
      const data = [];
      let balance = startCap;
      let totalInvested = startCap;
      let totalTax = 0;
      let totalWithdrawn = 0;
      let totalGains = 0;
      let fireReached = false;
      let fireAgeResult = null;
      const targetPortfolio = annualWithdraw / 0.05; // 5% withdrawal rate

      for (let age = currentAge; age <= lifeExp; age++) {
        const isAccumulating = age < fireAge;
        const yearGain = balance * nominalReturn;
        totalGains += Math.max(0, yearGain);

        // Tax calculation
        let yearTax = 0;
        if (regime === '2026') {
          // Fictitious returns: savings 1.44%, investments 6%
          const taxableBase = Math.max(0, balance - box3Exempt);
          const fictitiousReturn = taxableBase * 0.06;
          yearTax = Math.max(0, fictitiousReturn * 0.36);
        } else {
          // 2028 actual returns: 36% on real gains
          yearTax = Math.max(0, yearGain * 0.36);
        }
        totalTax += yearTax;

        if (isAccumulating) {
          balance = balance + yearGain - yearTax + annualSavings;
          totalInvested += annualSavings;
        } else {
          const withdraw = Math.min(annualWithdraw, balance);
          balance = balance + yearGain - yearTax - withdraw;
          totalWithdrawn += withdraw;
        }

        if (!fireReached && balance >= targetPortfolio && isAccumulating) {
          fireReached = true;
          fireAgeResult = age;
        }

        data.push({
          age,
          balance: Math.max(0, balance),
          invested: totalInvested,
          gains: totalGains,
          tax: totalTax,
          withdrawn: totalWithdrawn,
          isAccumulating,
        });
      }

      // If fire never reached during accumulation, find when target is first hit
      if (!fireAgeResult) {
        fireAgeResult = fireAge; // default to user target
      }

      return { data, totalTax, totalGains, fireAge: fireAgeResult, totalInvested, totalWithdrawn };
    };

    const sim2026 = runSim('2026');
    const sim2028 = runSim('2028');
    const fireDelay = sim2028.fireAge - sim2026.fireAge;
    const additionalInvestment = Math.round((fireDelay * annualSavings) / 1000);
    const taxDiff = sim2028.totalTax - sim2026.totalTax;
    const maxBalance2026 = Math.max(...sim2026.data.map(d => d.balance));
    const maxBalance2028 = Math.max(...sim2028.data.map(d => d.balance));

    // Compute annual withdrawal at FIRE (inflation-adjusted)
    const yearsToFire2026 = sim2026.fireAge - currentAge;
    const yearsToFire2028 = sim2028.fireAge - currentAge;
    const withdrawAtFire2026 = Math.round(annualWithdraw * Math.pow(1 + inflRate, yearsToFire2026));
    const withdrawAtFire2028 = Math.round(annualWithdraw * Math.pow(1 + inflRate, yearsToFire2028));

    // Simple bar chart renderer (SVG)
    const renderChart = (simData, maxVal, label) => {
      const chartW = 700;
      const chartH = 250;
      const padL = 65;
      const padR = 10;
      const padT = 15;
      const padB = 40;
      const plotW = chartW - padL - padR;
      const plotH = chartH - padT - padB;
      const n = simData.data.length;
      const xStep = plotW / Math.max(n - 1, 1);
      const yScale = plotH / maxVal;
      const yTicks = [0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal];

      // Build points for each layer
      const pts = simData.data.map((d, i) => {
        const x = padL + i * xStep;
        const invested = Math.min(d.invested, d.balance);
        const gains = Math.max(0, d.balance - d.invested);
        const tax = d.tax * 0.15;
        return { x, invested, gains, tax, age: d.age, balance: d.balance, isAccumulating: d.isAccumulating };
      });

      const baseY = chartH - padB;

      // Helper: build a closed area path from top-points
      const areaPath = (topFn) => {
        let path = `M ${pts[0].x} ${baseY}`;
        pts.forEach((p) => { path += ` L ${p.x} ${Math.max(padT, baseY - topFn(p))}` });
        path += ` L ${pts[pts.length - 1].x} ${baseY} Z`;
        return path;
      };

      // Helper: build a line path from top-points
      const linePath = (topFn) => {
        let path = `M ${pts[0].x} ${Math.max(padT, baseY - topFn(pts[0]))}`;
        for (let i = 1; i < pts.length; i++) {
          path += ` L ${pts[i].x} ${Math.max(padT, baseY - topFn(pts[i]))}`;
        }
        return path;
      };

      const investedTop = (p) => p.invested * yScale;
      const gainsTop = (p) => (p.invested + p.gains) * yScale;
      const taxTop = (p) => (p.invested + p.gains + p.tax) * yScale;

      const uid = `chart-${label}-${Date.now()}`;

      // FIRE age x position
      const fireIdx = simData.data.findIndex(d => d.age === simData.fireAge);
      const fireX = fireIdx >= 0 ? padL + fireIdx * xStep : null;

      return (
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
          <h4 className="text-white font-bold text-sm mb-3">Portfolio Projection</h4>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ maxHeight: 300 }}>
            <defs>
              <linearGradient id={`${uid}-invested`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id={`${uid}-gains`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id={`${uid}-tax`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {yTicks.map((v, i) => (
              <g key={i}>
                <text x={padL - 8} y={baseY - v * yScale + 4} fontSize="10" fill="#64748b" textAnchor="end">
                  {v >= 1000000 ? (v / 1000000).toFixed(1) + 'M' : v >= 1000 ? Math.round(v / 1000) + 'K' : Math.round(v)}
                </text>
                <line x1={padL} y1={baseY - v * yScale} x2={chartW - padR} y2={baseY - v * yScale} stroke="#334155" strokeWidth="0.5" />
              </g>
            ))}

            {/* Stacked area: Tax (top layer) */}
            <path d={areaPath(taxTop)} fill={`url(#${uid}-tax)`} />
            {/* Stacked area: Gains (middle layer) */}
            <path d={areaPath(gainsTop)} fill={`url(#${uid}-gains)`} />
            {/* Stacked area: Invested (bottom layer) */}
            <path d={areaPath(investedTop)} fill={`url(#${uid}-invested)`} />

            {/* Line edges for clarity */}
            <path d={linePath(taxTop)} fill="none" stroke="#c084fc" strokeWidth="1.5" opacity="0.6" />
            <path d={linePath(gainsTop)} fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.7" />
            <path d={linePath(investedTop)} fill="none" stroke="#34d399" strokeWidth="1.5" opacity="0.8" />

            {/* FIRE age vertical line */}
            {fireX && (
              <g>
                <line x1={fireX} y1={padT} x2={fireX} y2={baseY} stroke="#f87171" strokeWidth="1.5" strokeDasharray="6 4" />
                <text x={fireX} y={padT - 3} fontSize="9" fill="#f87171" textAnchor="middle" fontWeight="bold">FIRE</text>
              </g>
            )}

            {/* X-axis labels */}
            {simData.data.filter((_, i) => i % Math.max(1, Math.floor(n / 10)) === 0).map((d, i) => {
              const idx = simData.data.indexOf(d);
              return (
                <text key={i} x={padL + idx * xStep} y={baseY + 15} fontSize="9" fill="#64748b" textAnchor="middle">
                  {d.age}
                </text>
              );
            })}
            <text x={chartW / 2} y={baseY + 30} fontSize="10" fill="#94a3b8" textAnchor="middle">Age</text>
          </svg>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-3 justify-center">
            {[
              { color: '#34d399', label: 'Invested' },
              { color: '#60a5fa', label: 'Gains' },
              { color: '#c084fc', label: 'Cumulative Tax' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color, opacity: 0.8 }}></div>
                {item.label}
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <div className="w-4 border-t-2 border-dashed border-red-400"></div>
              FIRE Age
            </div>
          </div>
        </div>
      );
    };

    const globalMax = Math.max(maxBalance2026, maxBalance2028) * 1.15;

    return (
      <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => setShowBox3Comparison(false)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">NL Box 3 Taxes: current vs proposed</h1>
            <p className="text-slate-400">Compare current NL Box 3 (deemed return) vs proposed 2028 (actual gains) and see impact on total tax and FIRE timeline.</p>
          </div>

          {/* Your Plan Summary — Editable */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📋</span>
              <h3 className="text-lg font-bold text-white">Your plan in this comparison</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-slate-700/40 rounded-xl p-4 border border-slate-600">
                <label className="block text-slate-400 text-xs font-medium mb-1">Monthly Savings</label>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 text-lg">€</span>
                  <input
                    type="number" onFocus={handleInputFocus}
                    min="0" max="50000" step="100"
                    value={box3MonthlySavings}
                    onChange={(e) => setBox3MonthlySavings(Number(e.target.value))}
                    className="w-full bg-transparent text-white font-bold text-xl outline-none"
                  />
                </div>
                <p className="text-slate-500 text-xs mt-1">€{(box3MonthlySavings * 12).toLocaleString()}/year</p>
              </div>
              <div className="bg-slate-700/40 rounded-xl p-4 border border-slate-600">
                <label className="block text-slate-400 text-xs font-medium mb-1">Starting Capital</label>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 text-lg">€</span>
                  <input
                    type="number" onFocus={handleInputFocus}
                    min="0" max="5000000" step="1000"
                    value={box3StartingCapital}
                    onChange={(e) => setBox3StartingCapital(Number(e.target.value))}
                    className="w-full bg-transparent text-white font-bold text-xl outline-none"
                  />
                </div>
                <p className="text-slate-500 text-xs mt-1">Current portfolio value</p>
              </div>
              <div className="bg-slate-700/40 rounded-xl p-4 border border-slate-600">
                <label className="block text-slate-400 text-xs font-medium mb-1">Desired Pension (annual)</label>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 text-lg">€</span>
                  <input
                    type="number" onFocus={handleInputFocus}
                    min="10000" max="300000" step="1000"
                    value={box3AnnualWithdrawal}
                    onChange={(e) => setBox3AnnualWithdrawal(Number(e.target.value))}
                    className="w-full bg-transparent text-white font-bold text-xl outline-none"
                  />
                </div>
                <p className="text-slate-500 text-xs mt-1">€{Math.round(annualWithdraw / 12).toLocaleString()}/month in today's money</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-700/40 rounded-xl p-4 border border-slate-600">
                <label className="block text-slate-400 text-xs font-medium mb-1">FIRE Age</label>
                <input
                  type="number" onFocus={handleInputFocus}
                  min="30" max="70" step="1"
                  value={box3FireAge}
                  onChange={(e) => setBox3FireAge(Number(e.target.value))}
                  className="w-full bg-transparent text-white font-bold text-xl outline-none"
                />
                <p className="text-slate-500 text-xs mt-1">When you want to retire</p>
              </div>
              <div className="bg-slate-700/40 rounded-xl p-4 border border-slate-600">
                <label className="block text-slate-400 text-xs font-medium mb-1">Life Expectancy</label>
                <input
                  type="number" onFocus={handleInputFocus}
                  min="60" max="100" step="1"
                  value={box3LifeExpectancy}
                  onChange={(e) => setBox3LifeExpectancy(Number(e.target.value))}
                  className="w-full bg-transparent text-white font-bold text-xl outline-none"
                />
                <p className="text-slate-500 text-xs mt-1">Plan until this age</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 bg-slate-700/30 rounded-full px-4 py-2 border border-slate-600">
              <span className="text-indigo-400">◎</span>
              <span className="text-slate-300 text-sm">Target portfolio: <strong className="text-white">€{Math.round(annualWithdraw / 0.05).toLocaleString()}</strong> (using a 5% withdrawal rate).</span>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {/* Simulation Mode */}
            <div>
              <label className="block text-slate-300 font-medium text-sm mb-2">Simulation mode</label>
              <div className="flex gap-2">
                {['deterministic', 'monteCarlo'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setBox3SimMode(mode)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      box3SimMode === mode
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    {mode === 'deterministic' ? 'Deterministic' : 'Monte Carlo'}
                  </button>
                ))}
              </div>
            </div>

            {/* Portfolio Type */}
            <div>
              <label className="block text-slate-300 font-medium text-sm mb-2">Portfolio type</label>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(portfolioProfiles).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => setBox3PortfolioType(key)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                      box3PortfolioType === key
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    <span>{p.emoji}</span> {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                <span className="text-slate-300 font-medium text-sm">NL: Box3 Taxes (2026)</span>
              </div>
              {renderChart(sim2026, globalMax, '2026')}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-slate-300 font-medium text-sm">NL: Box3 Taxes (2028 - Proposed)</span>
              </div>
              {renderChart(sim2028, globalMax, '2028')}
            </div>
          </div>

          {/* Impact Summary */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Impact Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* FIRE Delayed */}
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <span className="text-orange-400 text-sm">⏱</span>
                  </div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">FIRE Delayed By</span>
                </div>
                <p className="text-4xl font-black text-orange-400 mb-1">+ {fireDelay.toFixed(1)} <span className="text-lg font-medium text-slate-500">years</span></p>
                <p className="text-slate-400 text-xs mt-2">
                  With nl: box3 taxes (2028 - proposed), you'll need to work <strong className="text-slate-300">{fireDelay.toFixed(1)} years longer</strong> to reach FIRE.
                </p>
              </div>

              {/* Additional Investment */}
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <span className="text-emerald-400 text-sm">◎</span>
                  </div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Additional Investment Needed</span>
                </div>
                <p className="text-4xl font-black text-emerald-400 mb-1">+ €{additionalInvestment.toFixed(1)}K</p>
                <p className="text-slate-400 text-xs mt-2">
                  NL: Box3 Taxes (2028 - Proposed) requires you to save <strong className="text-slate-300">€{additionalInvestment.toFixed(1)}K more</strong> to reach your FIRE target.
                </p>
              </div>

              {/* Additional Years */}
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 text-sm">📅</span>
                  </div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Additional Years Investing</span>
                </div>
                <p className="text-4xl font-black text-blue-400 mb-1">+ {fireDelay.toFixed(1)} <span className="text-lg font-medium text-slate-500">years</span></p>
                <p className="text-slate-400 text-xs mt-2">
                  You'll need to invest for <strong className="text-slate-300">{fireDelay.toFixed(1)} more years</strong> with nl: box3 taxes (2028 - proposed).
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {/* FIRE Age */}
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center">
                  <span className="text-slate-300 text-sm">⏰</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">FIRE Age</h4>
                  <p className="text-slate-500 text-xs">When you can retire</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-700/30 rounded-xl p-3 text-center border border-slate-600">
                  <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">NL: Box3 Taxes (2026)</p>
                  <p className="text-4xl font-black text-blue-400">{sim2026.fireAge}</p>
                  <p className="text-slate-500 text-xs">({2026 + (sim2026.fireAge - currentAge)})</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-3 text-center border border-slate-600">
                  <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">NL: Box3 Taxes (2028 - Proposed)</p>
                  <p className="text-4xl font-black text-red-400">{sim2028.fireAge}</p>
                  <p className="text-slate-500 text-xs">({2026 + (sim2028.fireAge - currentAge)})</p>
                </div>
              </div>
              <div className="mt-3 bg-slate-700/20 rounded-lg p-2 border border-slate-600/50">
                <p className="text-slate-400 text-xs">
                  With <strong className="text-slate-300">nl: box3 taxes (2026)</strong>, you can retire at age {sim2026.fireAge}. With <strong className="text-slate-300">NL: Box3 Taxes (2028 - proposed)</strong>, you'll need to work until age {sim2028.fireAge}.
                </p>
              </div>
            </div>

            {/* Tax Paid */}
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center">
                  <span className="text-slate-300 text-sm">🏛</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Tax Paid</h4>
                  <p className="text-slate-500 text-xs">Total tax over journey and per €100 gained</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-700/30 rounded-xl p-3 text-center border border-slate-600">
                  <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">NL: Box3 Taxes (2026)</p>
                  <p className="text-2xl font-black text-blue-400">€{Math.round(sim2026.totalTax).toLocaleString()}</p>
                  <p className="text-slate-500 text-xs">Tax · {sim2026.totalGains > 0 ? (sim2026.totalTax / sim2026.totalGains * 100).toFixed(1) : '0'} € per €100 gained</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-3 text-center border border-slate-600">
                  <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">NL: Box3 Taxes (2028 - Proposed)</p>
                  <p className="text-2xl font-black text-red-400">€{Math.round(sim2028.totalTax).toLocaleString()}</p>
                  <p className="text-slate-500 text-xs">Tax · {sim2028.totalGains > 0 ? (sim2028.totalTax / sim2028.totalGains * 100).toFixed(1) : '0'} € per €100 gained</p>
                </div>
              </div>
              <div className="mt-3 bg-slate-700/20 rounded-lg p-2 border border-slate-600/50">
                <p className="text-slate-400 text-xs">
                  With <strong className="text-slate-300">NL: Box3 Taxes (2028 - Proposed)</strong> you pay <strong className="text-slate-300">€{Math.round(taxDiff).toLocaleString()} more</strong> in tax over lifetime.
                </p>
              </div>
            </div>

            {/* Annual Withdrawal at FIRE */}
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center">
                  <span className="text-slate-300 text-sm">💲</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Annual Withdrawal at FIRE</h4>
                  <p className="text-slate-500 text-xs">How your current lifestyle translates at retirement</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs mb-3">
                Your current lifestyle of <strong className="text-slate-300">€{annualWithdraw.toLocaleString()}/year</strong> (today's money) will become:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-700/30 rounded-xl p-3 text-center border border-slate-600">
                  <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">NL: Box3 Taxes (2026)</p>
                  <p className="text-2xl font-black text-blue-400">€{withdrawAtFire2026.toLocaleString()}</p>
                  <p className="text-slate-500 text-xs">After {yearsToFire2026} years (current Box 3)</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-3 text-center border border-slate-600">
                  <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">NL: Box3 Taxes (2028 - Proposed)</p>
                  <p className="text-2xl font-black text-red-400">€{withdrawAtFire2028.toLocaleString()}</p>
                  <p className="text-slate-500 text-xs">After {yearsToFire2028} years (proposed 2028)</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">Want a personalized strategy to minimize your 2028 tax impact?</h2>
            <p className="text-indigo-100 mb-6">Get your full AI-powered wealth strategy with Dutch tax optimization</p>
            <button
              onClick={() => { setShowBox3Comparison(false); setShowQuestionnaire(true); setCurrentStep('household'); }}
              className="bg-white hover:bg-indigo-50 text-indigo-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-lg"
            >
              Get Your Strategy →
            </button>
          </div>
        </div>
      </div>
      {paymentModal}
      </>
    );
  }

  // Comparison Page UI
  if (showComparison) {
    return (
      <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Back Button */}
          <button
            onClick={() => setShowComparison(false)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Results
          </button>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Why Choose AI-Powered Strategy?
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Compare the modern approach with traditional financial advisory
            </p>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-600 to-teal-600">
                    <th className="px-6 py-4 text-left text-white font-bold text-lg">Feature</th>
                    <th className="px-6 py-4 text-center text-white font-bold text-lg">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Your AI Strategy PDF
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-white font-bold text-lg">Traditional NL Advisor</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Cost Row */}
                  <tr className="border-b border-slate-200">
                    <td className="px-6 py-5 font-semibold text-slate-700">Cost</td>
                    <td className="px-6 py-5 text-center bg-emerald-50">
                      <div className="text-2xl font-bold text-emerald-600">€29</div>
                      <div className="text-sm text-slate-600">(Launch Price)</div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="text-2xl font-bold text-slate-900">€1,000+</div>
                      <div className="text-sm text-slate-600">Average</div>
                    </td>
                  </tr>

                  {/* Speed Row */}
                  <tr className="border-b border-slate-200">
                    <td className="px-6 py-5 font-semibold text-slate-700">Speed</td>
                    <td className="px-6 py-5 text-center bg-emerald-50">
                      <div className="text-xl font-bold text-emerald-600">⚡ Instant</div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="text-xl font-bold text-slate-900">2-3 Weeks</div>
                      <div className="text-sm text-slate-600">of Meetings</div>
                    </td>
                  </tr>

                  {/* Accuracy Row */}
                  <tr className="border-b border-slate-200">
                    <td className="px-6 py-5 font-semibold text-slate-700">Accuracy</td>
                    <td className="px-6 py-5 text-center bg-emerald-50">
                      <div className="text-base font-bold text-emerald-600">Data-driven</div>
                      <div className="text-sm text-slate-600">2026 Tax Logic</div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="text-base font-bold text-slate-900">Human-manual</div>
                      <div className="text-sm text-slate-600">Calculation</div>
                    </td>
                  </tr>

                  {/* Focus Row */}
                  <tr>
                    <td className="px-6 py-5 font-semibold text-slate-700">Focus</td>
                    <td className="px-6 py-5 text-center bg-emerald-50">
                      <div className="text-base font-bold text-emerald-600">10+ Global</div>
                      <div className="text-sm text-slate-600">Relocation Paths</div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="text-base font-bold text-slate-900">Usually NL-only</div>
                      <div className="text-sm text-slate-600">Focus (if needed)</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* What's Included in the PDF */}
          <div className="space-y-8 my-12">
            {/* Feature 1: Pension Sufficiency Audit */}
            <div className="bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">Pension Sufficiency Audit</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    The AI will analyze if your current built-up capital and state benefits provide a sustainable lifestyle.
                  </p>
                  
                  <div className="space-y-4 mt-6">
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        AOW Projections (2026)
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        For a single person, the net state pension is approximately <strong className="text-white">€1,558.15 per month</strong>; for couples, it is <strong className="text-white">€1,067.70 per person</strong>.
                      </p>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        The "Gap" Analysis
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        The PDF compares your projected monthly expenses against your AOW and employer pension (Pillar 2). If there is a shortfall, the AI calculates exactly how much extra capital you need in your "nest egg" to bridge the gap until you reach the state pension age.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: The "Bigger House" Tax Strategy */}
            <div className="bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">The "Bigger House" Tax Strategy</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Dutch law provides unique advantages for primary residences (Box 1) over other investments (Box 3).
                  </p>
                  
                  <div className="space-y-4 mt-6">
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Asset Shelter
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Money invested in a primary home is not subject to the heavy Box 3 wealth tax, which in 2024 assumes a high fictitious return of <strong className="text-white">6.04%</strong> on investments. Moving "taxable" wealth into a "tax-free" home can save you thousands annually.
                      </p>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Mortgage Interest Deduction (HRA)
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        The PDF calculates your specific tax refund for a larger mortgage, which is currently capped at a deduction rate of <strong className="text-white">37.48%</strong>.
                      </p>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        The "Buying vs. Investing" Verdict
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        AI models whether the HRA refund plus the Box 3 tax savings outweighs the potential 7–8% returns of the stock market.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Additional Tax-Saving Options */}
            <div className="bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">Additional Tax-Saving Options in the PDF</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Include these "Pro" features to justify the advisor-level value:
                  </p>
                  
                  <div className="space-y-4 mt-6">
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Jaarruimte Optimization
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Shows exactly how to use your 2026 private pension room to get an immediate tax refund of up to <strong className="text-white">49.5%</strong> on your contributions.
                      </p>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        The "Rebuttal Scheme" (Tegenbewijsregeling)
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        If your actual investment returns in 2024 are lower than the government's assumed 6.04%, the PDF explains how to file for a tax reduction based on your real results.
                      </p>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Wealth Reallocation
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Recommends shifting "Other Assets" into "Savings" before the October 1st cut-off to benefit from lower fictitious return rates (~1.03% vs 6.04%).
                      </p>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        Green Investment Credit
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Identifies if you should use the <strong className="text-white">€26,715 exemption</strong> for "Groenbeleggen" (Green Investments) before this popular tax break is phased out in 2027/2028.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Strategy Details */}
          <div className="my-12 space-y-8">
            {/* 1. The 2026 Strategy */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 border border-emerald-500/30 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">1</span>
                </div>
                <h3 className="text-2xl font-bold text-white">The 2026 Strategy: "The Choice"</h3>
              </div>
              <p className="text-slate-300 leading-relaxed mb-6">
                Currently, you are in a transition phase. You can often choose the most beneficial calculation:
              </p>
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
                  <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Counter-evidence Scheme (Tegenbewijsregeling)
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    If your actual investment returns are lower than the government's assumed rate (currently ~6%), you can provide evidence of your real gains to pay less tax.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
                  <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Pillar 3 Pension Boost
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    For 2026, the maximum Jaarruimte (tax-deductible pension room) is set at <strong className="text-white">€35,589</strong>. This is a "double win": you get a tax refund of up to <strong className="text-white">49.5%</strong> now and the assets are exempt from Box 3 tax forever.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. The 2028 Revolution */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 border border-emerald-500/30 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">2</span>
                </div>
                <h3 className="text-2xl font-bold text-white">The 2028 Revolution: "Actual Gains"</h3>
              </div>
              <p className="text-slate-300 leading-relaxed mb-6">
                On February 12, 2026, the Dutch Parliament approved the "Wet werkelijk rendement box 3," set to launch on January 1, 2028. This creates two new regimes:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-emerald-500/20 border-b-2 border-emerald-500">
                      <th className="text-left p-4 text-emerald-400 font-semibold">Asset Type</th>
                      <th className="text-left p-4 text-emerald-400 font-semibold">2028 Tax Model</th>
                      <th className="text-left p-4 text-emerald-400 font-semibold">Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 text-white font-medium">Stocks, Crypto, Bonds</td>
                      <td className="p-4 text-slate-300">Capital Growth Tax (Vermogensaanwas)</td>
                      <td className="p-4 text-slate-300">You pay tax annually on unrealized gains (paper profits), even if you don't sell.</td>
                    </tr>
                    <tr className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 text-white font-medium">Real Estate & Startups</td>
                      <td className="p-4 text-slate-300">Capital Gains Tax (Vermogenswinst)</td>
                      <td className="p-4 text-slate-300">You only pay tax on the profit when you sell the property or shares.</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 text-white font-medium">Bank Savings</td>
                      <td className="p-4 text-slate-300">Actual Interest</td>
                      <td className="p-4 text-slate-300">You pay 36% tax only on the interest you actually received.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Critical Life Engineering Options */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 border border-emerald-500/30 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">3</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Critical "Life Engineering" Options for the PDF</h3>
              </div>
              <p className="text-slate-300 leading-relaxed mb-6">
                To protect your wealth during this shift, the PDF should analyze these advanced options:
              </p>
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
                  <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    The "House as a Safe Haven"
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Since primary residences stay in Box 1, they are shielded from the new 2028 Box 3 rules. Moving "excess" investment capital into home equity could prevent the "Capital Growth Tax" from eating your paper profits.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
                  <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Strategic Loss Harvesting
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    From 2028, losses are deductible and can be carried forward to offset future gains. The AI can model when to "lock in" a loss to lower your future tax bills.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
                  <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Wealth Transfer (Gifting)
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    In 2026, you can gift children <strong className="text-white">€6,908 annually</strong> or a one-time tax-free sum of <strong className="text-white">€33,129</strong> (if they are under 40). Doing this before 2028 reduces the total assets subject to the new "unrealized gains" tax.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
                  <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Factor A Audit
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    The PDF will check your Factor A (employer pension growth) to see if you have "Reserveringsruimte"—unused tax-deductible room from the last 10 years (up to <strong className="text-white">€42,753 in 2026</strong>).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Get Your Full Strategy?
            </h2>
            <p className="text-emerald-50 mb-6 text-lg">
              Download your personalized PDF roadmap with detailed action steps
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={handlePurchasePDF}
                className="bg-white hover:bg-emerald-50 text-emerald-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-lg"
              >
                Purchase PDF for €29 →
              </button>
              <button
                onClick={() => setShowComparison(false)}
                className="text-white hover:text-emerald-100 underline font-medium"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
      {paymentModal}
      </>
    );
  }

  // Results Page UI
  if (showResults) {
    return (
      <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Special Offer Banner */}
          <div className="mb-8 sm:mb-10">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 sm:p-8 border-2 border-emerald-400 shadow-2xl relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold mb-3">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                    <span>LIMITED TIME OFFER</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    2026 Strategy Launch Offer
                  </h2>
                  <p className="text-emerald-50 text-sm sm:text-base">
                    Get your full PDF Roadmap for <span className="font-bold text-white text-lg">€19.99</span> <span className="line-through opacity-75">(Normally €99)</span>
                  </p>
                  <p className="text-emerald-100 text-xs sm:text-sm mt-2">
                    ⏰ This <strong>80% discount</strong> expires in 2 weeks
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button 
                    onClick={handlePurchasePDF}
                    className="bg-white hover:bg-emerald-50 text-emerald-600 font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-sm sm:text-base"
                  >
                    Get Full PDF Roadmap →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Header Badge */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-amber-500 font-semibold text-sm">AI-Powered Planning</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Plan Your Path to FIRE
          </h1>
          <p className="text-slate-400 text-center text-base sm:text-lg mb-8 sm:mb-12 max-w-3xl mx-auto">
            Tailored for the Netherlands. Smart strategies considering Dutch tax rules, pension pillars, and wealth-building opportunities.
          </p>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Monthly Need (Future) */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="text-slate-600 text-sm font-medium">Monthly Need (Future)</div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                €{metrics.monthlyNeed.toLocaleString()}
              </div>
            </div>

            {/* Target Nest Egg */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="text-slate-600 text-sm font-medium">Target Nest Egg</div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                €{metrics.targetNestEgg.toLocaleString()}
              </div>
            </div>

            {/* Gap to Fill */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="text-slate-600 text-sm font-medium">Gap to Fill</div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                €{metrics.gapToFill.toLocaleString()}
              </div>
            </div>

            {/* Monthly Savings Target */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="text-slate-600 text-sm font-medium">Monthly Savings Target</div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                €{metrics.monthlySavingsTarget.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Adjust Parameters Link */}
          <div className="mb-6">
            <button
              onClick={handleAdjustParameters}
              className="text-emerald-400 hover:text-emerald-500 flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Adjust Parameters
            </button>
          </div>

          {/* DATA AUDIT Block */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 sm:p-6 mb-8 sm:mb-10">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h3 className="text-white font-bold text-sm sm:text-base tracking-wider uppercase">Data Audit <span className="text-slate-400 font-normal normal-case tracking-normal">(Based on Your Inputs)</span></h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              <div className="flex items-center justify-between py-2 border-b border-slate-700/40">
                <span className="text-slate-400 text-sm">Reporting Date</span>
                <span className="text-white text-sm font-medium">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-700/40">
                <span className="text-slate-400 text-sm">Residency</span>
                <span className="text-white text-sm font-medium">Arrived in NL at Age {formData.arrivalAgeNL || (parseInt(formData.age) - (50 - (formData.yearsAbroad || 0)))}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-700/40">
                <span className="text-slate-400 text-sm">Current Assets</span>
                <span className="text-white text-sm font-medium">€{((formData.savingsBalance || 0) + (formData.cryptoValueDec31 || 0) + (formData.propertyValue || 0)).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-700/40">
                <span className="text-slate-400 text-sm">Primary Residence</span>
                <span className="text-white text-sm font-medium">€{(formData.propertyValue || 0).toLocaleString()} (WOZ)</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-700/40 sm:border-b-0">
                <span className="text-slate-400 text-sm">Retirement Goal</span>
                <span className="text-white text-sm font-medium">€{(formData.desiredMonthlyIncome || 0).toLocaleString()}/mo at Age {formData.targetRetirementAge || formData.retirementAge}</span>
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-4 italic">
              Calculation Note: Projections assume a 2.2% annual inflation rate and 2026–2028 Dutch tax brackets.
            </p>
          </div>

          {/* Personalized Strategy Section */}
          <div className="bg-slate-800 rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12 border border-slate-700">
            <div className="flex items-start gap-3 mb-6">
              <span className="text-2xl">💡</span>
              <h2 className="text-white text-xl sm:text-2xl font-bold">Your Personalized Strategy</h2>
            </div>
            <p className="text-slate-400 text-sm mb-6 italic border-l-2 border-emerald-500/40 pl-4">
              This personalized strategy was engineered by the VrijWealth AI engine based on the unique financial profile and goals you provided. It is designed to provide high-level tax-optimization pathways and a structural roadmap for 2026-2028.
            </p>
            
            <div className="prose prose-invert prose-slate max-w-none">
              <div className="text-slate-300 leading-relaxed text-sm sm:text-base space-y-4">
                {aiResponse.split('\n').map((line, index) => {
                  const trimmed = line.trim();
                  
                  // Skip empty lines
                  if (!trimmed) {
                    return <div key={index} className="h-2"></div>;
                  }
                  
                  // Skip any structured data patterns that might have slipped through (with or without colon)
                  // Strip leading bullet markers, bold markers, whitespace before checking
                  const strippedLine = trimmed.replace(/^[-•*\s]+/, '').replace(/\*\*/g, '');
                  if (strippedLine.match(/^(MONTHLY_NEED|TARGET_NEST_EGG|GAP_TO_FILL|MONTHLY_SAVINGS_TARGET|ALLOCATION_|CURRENT_WEALTH|PROJECTED_AT_RETIREMENT|ACTION_STEP|BOX3_STRATEGY|PENSION_RECOMMENDATIONS|ESTIMATED_ANNUAL_BOX3_TAX|PRODUCT_|---)/i)) {
                    return null;
                  }
                  
                  // Handle ### markdown headings
                  if (trimmed.startsWith('###')) {
                    const heading = trimmed.replace(/^###\s*/, '').replace(/\*\*/g, '').replace(/:/g, '');
                    return (
                      <h3 key={index} className="text-white font-bold text-lg sm:text-xl mt-6 mb-3 first:mt-0">
                        {heading}
                      </h3>
                    );
                  }
                  
                  // Handle ## markdown headings
                  if (trimmed.startsWith('##')) {
                    const heading = trimmed.replace(/^##\s*/, '').replace(/\*\*/g, '').replace(/:/g, '');
                    return (
                      <h2 key={index} className="text-white font-bold text-xl sm:text-2xl mt-6 mb-3 first:mt-0">
                        {heading}
                      </h2>
                    );
                  }
                  
                  // Handle bold headings with ** markers
                  if (trimmed.startsWith('**') && (trimmed.includes(':**') || trimmed.endsWith('**'))) {
                    const heading = trimmed.replace(/\*\*/g, '').replace(/:/g, '');
                    return (
                      <h3 key={index} className="text-white font-bold text-lg sm:text-xl mt-6 mb-3 first:mt-0">
                        {heading}
                      </h3>
                    );
                  }
                  
                  // Handle numbered lists
                  if (/^\d+\.\s/.test(trimmed)) {
                    const text = trimmed.replace(/^\d+\.\s*/, '');
                    // Replace inline bold with span tags
                    const formattedText = text.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    });
                    return (
                      <div key={index} className="flex gap-3 mb-2 ml-4">
                        <span className="text-emerald-400 font-semibold flex-shrink-0">{trimmed.match(/^\d+\./)[0]}</span>
                        <span className="flex-1 text-slate-300">{formattedText}</span>
                      </div>
                    );
                  }
                  
                  // Handle bullet points
                  if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
                    const text = trimmed.replace(/^[-•*]\s*/, '');
                    // Replace inline bold with span tags
                    const formattedText = text.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    });
                    return (
                      <div key={index} className="flex gap-3 mb-2 ml-4">
                        <span className="text-slate-500 mt-1">•</span>
                        <span className="flex-1 text-slate-300">{formattedText}</span>
                      </div>
                    );
                  }
                  
                  // Regular paragraphs with inline bold support
                  const formattedText = line.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  });
                  
                  return (
                    <p key={index} className="text-slate-300 leading-relaxed mb-3">
                      {formattedText}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Wealth Projection and Allocation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Wealth Projection */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h3 className="text-slate-900 text-lg sm:text-xl font-bold">Wealth Projection</h3>
              </div>
              
              {/* Simple Line Chart */}
              <div className="mb-6">
                <svg viewBox="0 0 500 300" className="w-full h-auto">
                  {/* Grid lines */}
                  <line x1="50" y1="250" x2="450" y2="250" stroke="#e2e8f0" strokeWidth="1"/>
                  <line x1="50" y1="200" x2="450" y2="200" stroke="#e2e8f0" strokeWidth="1"/>
                  <line x1="50" y1="150" x2="450" y2="150" stroke="#e2e8f0" strokeWidth="1"/>
                  <line x1="50" y1="100" x2="450" y2="100" stroke="#e2e8f0" strokeWidth="1"/>
                  <line x1="50" y1="50" x2="450" y2="50" stroke="#e2e8f0" strokeWidth="1"/>
                  
                  {/* Axes */}
                  <line x1="50" y1="50" x2="50" y2="250" stroke="#94a3b8" strokeWidth="2"/>
                  <line x1="50" y1="250" x2="450" y2="250" stroke="#94a3b8" strokeWidth="2"/>
                  
                  {/* Y-axis labels */}
                  <text x="35" y="55" fontSize="10" fill="#64748b" textAnchor="end">€{(wealthProjection.targetNestEgg * 1.2 / 1000).toFixed(0)}k</text>
                  <text x="35" y="105" fontSize="10" fill="#64748b" textAnchor="end">€{(wealthProjection.targetNestEgg * 0.9 / 1000).toFixed(0)}k</text>
                  <text x="35" y="155" fontSize="10" fill="#64748b" textAnchor="end">€{(wealthProjection.targetNestEgg * 0.6 / 1000).toFixed(0)}k</text>
                  <text x="35" y="205" fontSize="10" fill="#64748b" textAnchor="end">€{(wealthProjection.targetNestEgg * 0.3 / 1000).toFixed(0)}k</text>
                  <text x="35" y="255" fontSize="10" fill="#64748b" textAnchor="end">€0</text>
                  
                  {/* X-axis labels */}
                  <text x="50" y="270" fontSize="10" fill="#64748b" textAnchor="middle">Year 0</text>
                  <text x="150" y="270" fontSize="10" fill="#64748b" textAnchor="middle">Year 5</text>
                  <text x="250" y="270" fontSize="10" fill="#64748b" textAnchor="middle">Year 10</text>
                  <text x="350" y="270" fontSize="10" fill="#64748b" textAnchor="middle">Year 15</text>
                  <text x="450" y="270" fontSize="10" fill="#64748b" textAnchor="middle">Year {formData.retirementAge - formData.age}</text>
                  
                  {/* X-axis label */}
                  <text x="250" y="290" fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="500">Years</text>
                  
                  {/* Growth curve */}
                  {(() => {
                    const years = formData.retirementAge - formData.age;
                    const maxWealth = Math.max(wealthProjection.targetNestEgg, wealthProjection.projectedAtRetirement);
                    const scale = 200 / maxWealth;
                    
                    // Generate points for a compound growth curve
                    const points = [];
                    for (let year = 0; year <= years; year++) {
                      const x = 50 + (year / years) * 400;
                      // Exponential growth simulation
                      const growthFactor = Math.pow(1 + 0.09, year); // 9% annual growth assumption
                      const wealth = wealthProjection.currentWealth * growthFactor;
                      const y = 250 - (wealth * scale);
                      points.push(`${x},${Math.max(50, Math.min(250, y))}`);
                    }
                    
                    return (
                      <polyline
                        points={points.join(' ')}
                        stroke="#3b82f6"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    );
                  })()}
                  
                  {/* Data points */}
                  <circle cx="50" cy={Math.min(250, Math.max(50, 250 - (wealthProjection.currentWealth / Math.max(wealthProjection.targetNestEgg, wealthProjection.projectedAtRetirement) * 200)))} r="5" fill="#3b82f6" stroke="white" strokeWidth="2"/>
                  <circle cx="450" cy={Math.min(250, Math.max(50, 250 - (wealthProjection.projectedAtRetirement / Math.max(wealthProjection.targetNestEgg, wealthProjection.projectedAtRetirement) * 200)))} r="5" fill="#3b82f6" stroke="white" strokeWidth="2"/>
                  
                  {/* Target line */}
                  <line x1="50" y1={Math.max(50, 250 - (wealthProjection.targetNestEgg / Math.max(wealthProjection.targetNestEgg, wealthProjection.projectedAtRetirement) * 200))} x2="450" y2={Math.max(50, 250 - (wealthProjection.targetNestEgg / Math.max(wealthProjection.targetNestEgg, wealthProjection.projectedAtRetirement) * 200))} stroke="#10b981" strokeWidth="2" strokeDasharray="5,5"/>
                  <text x="455" y={Math.max(55, 255 - (wealthProjection.targetNestEgg / Math.max(wealthProjection.targetNestEgg, wealthProjection.projectedAtRetirement) * 200))} fontSize="11" fill="#10b981" fontWeight="bold">Target: €{(wealthProjection.targetNestEgg / 1000000).toFixed(2)}M</text>
                </svg>
              </div>
              
              {/* Wealth Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-slate-600 mb-1">Current Wealth</div>
                  <div className="text-lg font-bold text-slate-900">€{(wealthProjection.currentWealth / 1000).toFixed(0)}k</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-600 mb-1">Projected at Retirement</div>
                  <div className="text-lg font-bold text-slate-900">€{(wealthProjection.projectedAtRetirement / 1000000).toFixed(2)}M</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3">
                  <div className="text-xs text-slate-600 mb-1">Target Nest Egg</div>
                  <div className="text-lg font-bold text-emerald-600">€{(wealthProjection.targetNestEgg / 1000000).toFixed(2)}M</div>
                </div>
              </div>
            </div>

            {/* Recommended Allocation */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
              <h3 className="text-slate-900 text-lg sm:text-xl font-bold mb-6">Recommended Allocation</h3>
              
              <div className="space-y-5">
                {/* Stocks & ETFs */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700 font-medium text-sm">Stocks & ETFs</span>
                    <span className="text-slate-900 font-bold">{allocation.stocks}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-slate-800 h-full rounded-full transition-all duration-500"
                      style={{ width: `${allocation.stocks}%` }}
                    ></div>
                  </div>
                </div>

                {/* Bonds */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700 font-medium text-sm">Bonds</span>
                    <span className="text-slate-900 font-bold">{allocation.bonds}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${allocation.bonds}%` }}
                    ></div>
                  </div>
                </div>

                {/* Real Estate */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700 font-medium text-sm">Real Estate</span>
                    <span className="text-slate-900 font-bold">{allocation.realEstate}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-slate-300 h-full rounded-full transition-all duration-500"
                      style={{ width: `${allocation.realEstate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Cash Reserve */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700 font-medium text-sm">Cash Reserve</span>
                    <span className="text-slate-900 font-bold">{allocation.cash}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-slate-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${allocation.cash}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Allocation Rationale */}
              {allocation.stocks > 0 && (
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <h4 className="text-slate-900 font-semibold text-sm mb-2">Allocation Rationale:</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Given your age ({formData.age}) and {(formData.targetRetirementAge || 65) - (parseInt(formData.age) || 30)}-year investment horizon, 
                    a {allocation.stocks}% allocation to stocks maximizes compounding growth. 
                    {allocation.bonds > 0 && ` ${allocation.bonds}% in bonds provides stability, while `}
                    {allocation.cash > 0 && ` ${allocation.cash}% cash reserve ensures liquidity for emergencies`}
                    {allocation.realEstate > 0 && ` and ${allocation.realEstate}% real estate offers diversification`}.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Key Action Steps */}
          {actionSteps.length > 0 && (
            <div className="mb-8 sm:mb-12">
              <h2 className="text-white text-2xl sm:text-3xl font-bold mb-6">Key Action Steps</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {actionSteps.map((step, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        step.priority === 'High Priority' ? 'bg-red-100 text-red-700' :
                        step.priority === 'Medium Priority' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {step.priority}
                      </span>
                      <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-700 rounded">
                        {step.tag}
                      </span>
                    </div>
                    <h3 className="text-slate-900 text-lg font-bold mb-2">{step.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personalized Recommendations */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h2 className="text-white text-2xl sm:text-3xl font-bold">Recommendations</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Recommendation 1 — Box 3 Tax Shield */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-emerald-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-slate-900 font-bold text-base">Box 3 Tax Shield</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                  Move savings into Lijfrente (Pillar 3) to reduce Box 3 taxable wealth. 
                  Combined Jaarruimte + Reserveringsruimte of <span className="font-semibold text-emerald-700">€{(parseInt(formData.jaarruimte || 0) + parseInt(formData.reserveringsruimte || 0)).toLocaleString()}</span> available.
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  37–49.5% immediate tax refund
                </div>
              </div>

              {/* Recommendation 2 — Bridge Phase Funding */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-blue-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-slate-900 font-bold text-base">Bridge Phase Plan</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                  {(() => {
                    const bridgeYrs = Math.max(0, Math.round((67.25 - (formData.targetRetirementAge || 65)) * 10) / 10);
                    const bridgeCost = Math.round(bridgeYrs * 12 * (formData.desiredMonthlyIncome || 3000));
                    return bridgeYrs > 0 
                      ? <>Fund <span className="font-semibold text-blue-700">€{bridgeCost.toLocaleString()}</span> for {Math.round(bridgeYrs)} bridge years (age {formData.targetRetirementAge}→67) before AOW kicks in. Use index funds + dividend ETFs for steady drawdown.</>
                      : <>Your retirement age aligns with AOW. Focus on maximizing pension pot and reducing Box 3 exposure before retirement.</>;
                  })()}
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Self-funded early retirement buffer
                </div>
              </div>

              {/* Recommendation 3 — 2028 Regime Preparation */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-amber-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-slate-900 font-bold text-base">2028 Tax Shift</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                  From 2028, Box 3 switches to actual returns (36% on real gains). 
                  {parseInt(formData.cryptoValueDec31 || 0) > 0 
                    ? <> Your crypto portfolio of <span className="font-semibold text-amber-700">€{parseInt(formData.cryptoValueDec31).toLocaleString()}</span> needs restructuring — volatile assets hit harder under real-return taxation.</>
                    : <> Restructure investments before the regime shift. Use Tegenbewijsregeling if actual returns are below the fictitious 6% rate.</>
                  }
                </p>
                <div className="flex items-center gap-2 text-xs text-amber-600 font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Prepare now to minimize future tax drag
                </div>
              </div>
            </div>
          </div>

          {/* Dutch Tax Optimization */}
          {(dutchTaxOptimization.box3Strategy || dutchTaxOptimization.pensionRecommendations || dutchTaxOptimization.estimatedAnnualTax > 0) && (
            <div className="mb-8 sm:mb-12">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-l-4 border-emerald-500 rounded-xl p-6 sm:p-8">
                <div className="flex items-start gap-3 mb-6">
                  <svg className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h2 className="text-slate-900 text-xl sm:text-2xl font-bold">Dutch Tax Optimization</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Box 3 Strategy */}
                  {dutchTaxOptimization.box3Strategy && (
                    <div>
                      <h3 className="text-slate-900 font-bold text-base mb-3">Box 3 Strategy</h3>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        {dutchTaxOptimization.box3Strategy}
                      </p>
                    </div>
                  )}
                  
                  {/* Pension Recommendations */}
                  {dutchTaxOptimization.pensionRecommendations && (
                    <div>
                      <h3 className="text-slate-900 font-bold text-base mb-3">Pension Recommendations</h3>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        {dutchTaxOptimization.pensionRecommendations}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Estimated Annual Tax */}
                {dutchTaxOptimization.estimatedAnnualTax > 0 && (
                  <div className="mt-6 pt-6 border-t border-emerald-200">
                    <div className="bg-white rounded-lg p-4 inline-block">
                      <span className="text-emerald-600 font-bold text-2xl">
                        Estimated Annual Box 3 Tax: €{dutchTaxOptimization.estimatedAnnualTax.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recommended Dutch Products */}
          {recommendedProducts.length > 0 && (
            <div className="mb-8 sm:mb-12">
              <div className="flex items-start gap-3 mb-6">
                <svg className="w-8 h-8 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h2 className="text-white text-2xl sm:text-3xl font-bold">Recommended Dutch Products</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendedProducts.map((product, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-slate-900 text-lg font-bold flex-1">{product.name}</h3>
                      <span className="text-xs font-medium px-3 py-1 bg-emerald-100 text-emerald-700 rounded ml-2 flex-shrink-0">
                        {product.type}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Your Wealth Journey */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-8">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h2 className="text-white text-2xl sm:text-3xl font-bold">Your Wealth Journey</h2>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="space-y-8">
                {(() => {
                  // Calculate milestone years and amounts
                  const currentYear = new Date().getFullYear();
                  const yearsToRetirement = formData.retirementAge - formData.age;
                  const currentWealth = wealthProjection.currentWealth;
                  const targetWealth = wealthProjection.targetNestEgg || wealthProjection.projectedAtRetirement;
                  const monthlyContribution = metrics.monthlySavingsTarget || 0;
                  const annualReturn = 0.09; // 9% default

                  // Calculate wealth at various milestones years
                  const milestoneYears = [
                    Math.min(0, yearsToRetirement),
                    Math.floor(yearsToRetirement * 0.15),
                    Math.floor(yearsToRetirement * 0.4),
                    Math.floor(yearsToRetirement * 0.65),
                    yearsToRetirement
                  ].filter((value, index, self) => self.indexOf(value) === index).sort((a, b) => a - b);

                  const calculateWealthAtYear = (years) => {
                    if (years === 0) return currentWealth;
                    
                    // Future value of current wealth
                    const fvCurrentWealth = currentWealth * Math.pow(1 + annualReturn, years);
                    
                    // Future value of monthly contributions
                    const monthlyRate = annualReturn / 12;
                    const months = years * 12;
                    const fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
                    
                    return Math.round(fvCurrentWealth + fvContributions);
                  };

                  const getMilestoneDescription = (wealth, targetWealth, isLast) => {
                    if (isLast) {
                      return "Achieve your target nest egg of €" + (targetWealth / 1000).toFixed(0) + "k. Congratulations, you are financially independent!";
                    }
                    
                    if (wealth >= 1000000) {
                      return "Approach the €1,000,000 mark. Your wealth is growing substantially, with investment returns contributing significantly.";
                    } else if (wealth >= 500000) {
                      return "Surpass €500,000 in total wealth. You're now well on your way, having crossed a major psychological barrier.";
                    } else if (wealth >= 250000) {
                      return "Reach €250,000 in total wealth. This demonstrates significant momentum and the power of compounding.";
                    } else if (wealth >= 100000) {
                      return "Surpass €100,000 in total wealth. This early milestone confirms your savings discipline and initial investment growth.";
                    } else {
                      return "Building your foundation with consistent savings and smart investment strategies.";
                    }
                  };

                  return milestoneYears.map((yearsFromNow, index) => {
                    const year = currentYear + yearsFromNow;
                    const wealth = calculateWealthAtYear(yearsFromNow);
                    const isLast = index === milestoneYears.length - 1;
                    const description = getMilestoneDescription(wealth, targetWealth, isLast);

                    return (
                      <div key={index} className="flex gap-4 relative">
                        {/* Timeline dot and line */}
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                            <div className="w-6 h-6 rounded-full bg-white"></div>
                          </div>
                          {index < milestoneYears.length - 1 && (
                            <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-8">
                          <h3 className="text-slate-900 text-xl font-bold mb-1">Year {year}</h3>
                          <div className="text-emerald-600 text-2xl font-bold mb-3">
                            €{wealth.toLocaleString()}
                          </div>
                          <p className="text-slate-600 leading-relaxed">
                            {description}
                          </p>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-slate-500 text-center text-sm">
                  Designed for the Netherlands • Considers Dutch tax regulations & pension pillars
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                setShowResults(false);
                setShowQuestionnaire(false);
              }}
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all shadow-md text-sm sm:text-base"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      </div>
      {paymentModal}
      </>
    );
  }

  // Questionnaire UI
  if (showQuestionnaire) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center">
              <div className="flex justify-center mb-4">
                <svg className="animate-spin h-10 w-10 sm:h-12 sm:w-12 text-emerald-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Analyzing Your Financial Future</h3>
              <div className="min-h-[4rem] flex items-center justify-center px-2">
                <p className="text-slate-400 text-base sm:text-lg transition-opacity duration-500">
                  {loadingMessages[loadingMessageIndex]}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex min-h-screen md:h-screen">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden md:flex md:w-64 bg-slate-900/60 border-r border-slate-800 p-6 flex-col">
            <div className="flex items-center gap-2 mb-12">
              <svg className="w-6 h-6 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-lg font-bold text-white">ProsperPath</span>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setCurrentStep('household')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentStep === 'household' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-medium">Household</span>
              </button>

              <button
                onClick={() => setCurrentStep('financials')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentStep === 'financials' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Financials</span>
              </button>

              <button
                onClick={() => setCurrentStep('pension')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentStep === 'pension' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-medium">Pension</span>
              </button>

              <button
                onClick={() => setCurrentStep('realEstate')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentStep === 'realEstate' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">Real Estate</span>
              </button>

              <button
                onClick={() => setCurrentStep('retirement')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentStep === 'retirement' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Retirement</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
              {/* Mobile Progress Indicator */}
              <div className="md:hidden mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-white font-bold">ProsperPath</span>
                </div>
                <div className="flex gap-1">
                  <div className={`w-2 h-2 rounded-full ${currentStep === 'household' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                  <div className={`w-2 h-2 rounded-full ${currentStep === 'financials' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                  <div className={`w-2 h-2 rounded-full ${currentStep === 'pension' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                  <div className={`w-2 h-2 rounded-full ${currentStep === 'realEstate' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                  <div className={`w-2 h-2 rounded-full ${currentStep === 'retirement' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                </div>
              </div>
              {/* Household Step */}
              {currentStep === 'household' && (
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Tell us about your household</h1>
                  <p className="text-slate-400 mb-8 sm:mb-12">We'll personalize your wealth plan based on your situation.</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Country of Residence</label>
                      <select
                        value={formData.country}
                        onChange={(e) => updateFormData('country', e.target.value)}
                        autoComplete="off"
                        className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Netherlands">🇳🇱 Netherlands</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateFormData('fullName', e.target.value)}
                        placeholder="Your name"
                        autoComplete="off"
                        className={`w-full bg-slate-800 border ${validationErrors.fullName ? 'border-red-500' : 'border-slate-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                      />
                      {validationErrors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Age</label>
                      <input
                        type="number" onFocus={handleInputFocus}
                        value={formData.age}
                        onChange={(e) => updateFormData('age', Number(e.target.value))}
                        autoComplete="off"
                        className={`w-full bg-slate-800 border ${validationErrors.age ? 'border-red-500' : 'border-slate-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                      />
                      {validationErrors.age && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.age}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Target Retirement Age</label>
                      <input
                        type="number" onFocus={handleInputFocus}
                        value={formData.retirementAge}
                        onChange={(e) => updateFormData('retirementAge', Number(e.target.value))}
                        autoComplete="off"
                        className={`w-full bg-slate-800 border ${validationErrors.retirementAge ? 'border-red-500' : 'border-slate-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                      />
                      {validationErrors.retirementAge && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.retirementAge}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between py-4 border-t border-b border-slate-700">
                      <span className="text-white font-medium">Add Spouse</span>
                      <button
                        onClick={() => updateFormData('hasSpouse', !formData.hasSpouse)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.hasSpouse ? 'bg-emerald-500' : 'bg-slate-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.hasSpouse ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-slate-700">
                      <span className="text-white font-medium">Have Children</span>
                      <button
                        onClick={() => updateFormData('hasChildren', !formData.hasChildren)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.hasChildren ? 'bg-emerald-500' : 'bg-slate-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.hasChildren ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {formData.hasChildren && (
                      <div>
                        <label className="block text-white font-medium mb-2">Number of Children</label>
                        <input
                          type="number" onFocus={handleInputFocus}
                          value={formData.childrenCount}
                          onChange={(e) => updateFormData('childrenCount', Number(e.target.value))}
                          className={`w-full bg-slate-800 border ${validationErrors.childrenCount ? 'border-red-500' : 'border-slate-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                        />
                        {validationErrors.childrenCount && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.childrenCount}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-8 sm:mt-12">
                    <button
                      onClick={() => setShowQuestionnaire(false)}
                      className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Home
                    </button>
                    <button
                      onClick={handleContinue}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base"
                    >
                      Continue
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Financials Step */}
              {currentStep === 'financials' && (
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Financial Details</h1>
                  <p className="text-slate-400 mb-8 sm:mb-12">Break down your income and assets by category.</p>

                  <div className="space-y-8">
                    {/* Income */}
                    <div>
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <span className="text-lg">💼</span> Income
                      </h3>
                      <div className="bg-slate-900/20 rounded-lg p-4 space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">{formData.hasSpouse ? 'Your Annual Gross Salary (Box 1)' : 'Annual Gross Salary (Box 1)'}</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">€</span>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.grossSalary}
                              onChange={(e) => updateFormData('grossSalary', Number(e.target.value))}
                              className={`w-full bg-slate-800 border ${validationErrors.grossSalary ? 'border-red-500' : 'border-slate-700'} text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                            />
                          </div>
                          {validationErrors.grossSalary && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.grossSalary}</p>
                          )}
                        </div>

                        {formData.hasSpouse && (
                          <div>
                            <label className="block text-white font-medium mb-2 text-sm">Spouse Annual Gross Salary (Box 1)</label>
                            <div className="relative">
                              <span className="absolute left-4 top-3 text-slate-400">€</span>
                              <input
                                type="number" onFocus={handleInputFocus}
                                value={formData.spouseGrossSalary}
                                onChange={(e) => updateFormData('spouseGrossSalary', Number(e.target.value))}
                                className="w-full bg-slate-800 border border-slate-700 text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-white font-medium block text-sm">30% Ruling Status</span>
                            <span className="text-slate-400 text-xs">Tax-advantaged expat status</span>
                          </div>
                          <button
                            onClick={() => updateFormData('has30PercentRuling', !formData.has30PercentRuling)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              formData.has30PercentRuling ? 'bg-emerald-500' : 'bg-slate-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                formData.has30PercentRuling ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bank & Savings */}
                    <div>
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <span className="text-lg">🏦</span> Bank & Savings
                      </h3>
                      <div className="bg-slate-900/20 rounded-lg p-4 space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Savings Balance</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">€</span>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.savingsBalance}
                              onChange={(e) => updateFormData('savingsBalance', Number(e.target.value))}
                              className="w-full bg-slate-800 border border-slate-700 text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Interest Earned (Annual)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">€</span>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.interestEarned}
                              onChange={(e) => updateFormData('interestEarned', Number(e.target.value))}
                              className="w-full bg-slate-800 border border-slate-700 text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stocks & Crypto */}
                    <div>
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <span className="text-lg">📈</span> Stocks & Crypto
                      </h3>
                      <div className="bg-slate-900/20 rounded-lg p-4 space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Value on Jan 1</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">€</span>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.cryptoValueJan1}
                              onChange={(e) => updateFormData('cryptoValueJan1', Number(e.target.value))}
                              className="w-full bg-slate-800 border border-slate-700 text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Value on Dec 31</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">€</span>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.cryptoValueDec31}
                              onChange={(e) => updateFormData('cryptoValueDec31', Number(e.target.value))}
                              className="w-full bg-slate-800 border border-slate-700 text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Dividends Received (Annual)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">€</span>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.dividendsReceived}
                              onChange={(e) => updateFormData('dividendsReceived', Number(e.target.value))}
                              className="w-full bg-slate-800 border border-slate-700 text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div>
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <span className="text-lg">📉</span> Deductions
                      </h3>
                      <div className="bg-slate-900/20 rounded-lg p-4 space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Interest on Debt (Annual)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">€</span>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.debtInterest}
                              onChange={(e) => updateFormData('debtInterest', Number(e.target.value))}
                              className="w-full bg-slate-800 border border-slate-700 text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <p className="text-slate-400 text-xs mt-2">Mortgage interest, personal loan interest, etc.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-8 sm:mt-12">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back
                    </button>
                    <button
                      onClick={handleContinue}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base"
                    >
                      Continue
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Pension Step */}
              {currentStep === 'pension' && (
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Pension Details</h1>
                  <p className="text-slate-400 mb-8 sm:mb-12">Help us optimize your pension and retirement plan.</p>

                  <div className="space-y-8">
                    {/* Pillar 1 - State Pension */}
                    <div>
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <span className="text-lg">🏥</span> Pillar 1 — State Pension (The Safety Net)
                        <div className="relative group ml-1">
                          <svg className="w-4 h-4 text-slate-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 bg-slate-700 text-white text-xs rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            <p>In 2026, you accrue <strong className="text-emerald-400">2%</strong> of the AOW for every year you are insured in NL. 50 years are needed for a 100% payout (<strong className="text-emerald-400">€1,637.57 gross/mo</strong> for singles).</p>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700"></div>
                          </div>
                        </div>
                      </h3>
                      <p className="text-slate-400 text-sm mb-4">This determines your basic "floor" income provided by the government.</p>
                      <div className="bg-slate-900/20 rounded-lg p-4 space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">{formData.hasSpouse ? 'Your Arrival Age in the Netherlands' : 'Arrival Age in the Netherlands'}</label>
                          <input
                            type="number" onFocus={handleInputFocus}
                            value={formData.arrivalAgeNL}
                            onChange={(e) => updateFormData('arrivalAgeNL', Number(e.target.value))}
                            placeholder="e.g. 0 if born here, 25 if moved at 25"
                            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <p className="text-slate-400 text-xs mt-1">At what age did you first start living/working in the Netherlands?</p>
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Years Spent Abroad (Post-Arrival)</label>
                          <input
                            type="number" onFocus={handleInputFocus}
                            value={formData.yearsAbroad}
                            onChange={(e) => updateFormData('yearsAbroad', Number(e.target.value))}
                            placeholder="0"
                            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <p className="text-slate-400 text-xs mt-1">Any years you lived outside NL after arrival (stops the 2% annual accrual)</p>
                        </div>

                        {/* AOW Preview */}
                        {(() => {
                          const yearsInNL = Math.max(0, Math.min(67, 67 - formData.arrivalAgeNL) - formData.yearsAbroad);
                          const accrualPct = Math.min(100, yearsInNL * 2);
                          return (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                              <p className="text-emerald-400 text-sm font-medium">
                                📊 Based on your arrival at age {formData.arrivalAgeNL}{formData.yearsAbroad > 0 ? ` and ${formData.yearsAbroad} year(s) abroad` : ''}, you will accrue <strong className="text-white">{accrualPct}%</strong> of the full state pension by age 67.
                              </p>
                              <p className="text-slate-400 text-xs mt-2">
                                Estimated gross AOW: <strong className="text-white">€{Math.round(1637.57 * accrualPct / 100).toLocaleString()}/mo</strong> (based on €1,637.57 full single rate)
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Spouse Pillar 1 */}
                    {formData.hasSpouse && (
                      <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                          <span className="text-lg">👥</span> Spouse — State Pension
                        </h3>
                        <div className="bg-slate-900/20 rounded-lg p-4 space-y-4">
                          <div>
                            <label className="block text-white font-medium mb-2 text-sm">Spouse Arrival Age in the Netherlands</label>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.spouseArrivalAgeNL}
                              onChange={(e) => updateFormData('spouseArrivalAgeNL', Number(e.target.value))}
                              placeholder="e.g. 0 if born here, 25 if moved at 25"
                              className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <p className="text-slate-400 text-xs mt-1">At what age did your spouse first start living/working in the Netherlands?</p>
                          </div>

                          <div>
                            <label className="block text-white font-medium mb-2 text-sm">Spouse Years Spent Abroad (Post-Arrival)</label>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.spouseYearsAbroad}
                              onChange={(e) => updateFormData('spouseYearsAbroad', Number(e.target.value))}
                              placeholder="0"
                              className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <p className="text-slate-400 text-xs mt-1">Any years spouse lived outside NL after arrival</p>
                          </div>

                          {/* Spouse AOW Preview */}
                          {(() => {
                            const yearsInNL = Math.max(0, Math.min(67, 67 - formData.spouseArrivalAgeNL) - formData.spouseYearsAbroad);
                            const accrualPct = Math.min(100, yearsInNL * 2);
                            return (
                              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                                <p className="text-emerald-400 text-sm font-medium">
                                  📊 Based on spouse's arrival at age {formData.spouseArrivalAgeNL}{formData.spouseYearsAbroad > 0 ? ` and ${formData.spouseYearsAbroad} year(s) abroad` : ''}, they will accrue <strong className="text-white">{accrualPct}%</strong> of the full state pension by age 67.
                                </p>
                                <p className="text-slate-400 text-xs mt-2">
                                  Estimated gross AOW: <strong className="text-white">€{Math.round(1637.57 * accrualPct / 100).toLocaleString()}/mo</strong> (based on €1,637.57 full single rate)
                                </p>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Pillar 2 - Workplace Pension */}
                    <div>
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <span className="text-lg">🏢</span> Pillar 2 — Workplace Pension (The Employer Pot)
                      </h3>
                      <p className="text-slate-400 text-sm mb-4">This captures the money built up through your current and past jobs.</p>
                      <div className="bg-slate-900/20 rounded-lg p-4 space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">{formData.hasSpouse ? 'Your Total Built-up Pension' : 'Total Built-up Pension'}</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">€</span>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.builtUpPension}
                              onChange={(e) => updateFormData('builtUpPension', Number(e.target.value))}
                              placeholder="e.g. 150000"
                              className="w-full bg-slate-800 border border-slate-700 text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <p className="text-slate-400 text-xs mt-1">Total value accrued across all employer pensions</p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <label className="block text-white font-medium text-sm">Factor A (from your UPO)</label>
                            <div className="relative group">
                              <svg className="w-4 h-4 text-slate-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-700 text-white text-xs rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                <p className="font-semibold text-emerald-400 mb-1">📍 Where is my Factor A?</p>
                                <p>Check your most recent Uniform Pension Overview (UPO) from your employer's pension fund. It is typically found on the last page. If you have no employer pension, enter 0.</p>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700"></div>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">€</span>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.factorA}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                updateFormData('factorA', val);
                                const cappedSalary = Math.min(formData.grossSalary, 137800);
                                const calc = Math.max(0, Math.round(0.30 * (cappedSalary - 19172) - 6.27 * val));
                                updateFormData('jaarruimte', calc);
                              }}
                              className={`w-full bg-slate-800 border ${validationErrors.factorA ? 'border-red-500' : 'border-slate-700'} text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                            />
                          </div>
                          <p className="text-slate-400 text-xs mt-1">Annual pension accrual from employer</p>
                          {validationErrors.factorA && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.factorA}</p>
                          )}
                        </div>

                        {/* Info Link */}
                        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                          <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <p className="text-blue-300 text-xs">
                            Find this at <a href="https://www.mijnpensioenoverzicht.nl" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-semibold hover:text-blue-300">mijnpensioenoverzicht.nl</a> or on your last Uniform Pension Overview (UPO), last page.
                          </p>
                        </div>

                        {/* Visual Status - Coverage Progress */}
                        {(() => {
                          const desiredMonthly = Math.round(formData.grossSalary * 0.7 / 12);
                          const pensionMonthly = formData.builtUpPension > 0 ? Math.round(formData.builtUpPension / (12 * (85 - formData.retirementAge))) : 0;
                          const coveragePct = desiredMonthly > 0 ? Math.min(100, Math.round((pensionMonthly / desiredMonthly) * 100)) : 0;
                          return (
                            <div className="bg-slate-800/50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-slate-300 text-sm font-medium">Retirement lifestyle coverage</p>
                                <span className={`text-sm font-bold ${coveragePct >= 70 ? 'text-emerald-400' : coveragePct >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{coveragePct}%</span>
                              </div>
                              <div className="w-full bg-slate-700 rounded-full h-3">
                                <div
                                  className={`h-3 rounded-full transition-all ${coveragePct >= 70 ? 'bg-emerald-500' : coveragePct >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${coveragePct}%` }}
                                ></div>
                              </div>
                              <p className="text-slate-400 text-xs mt-2">
                                Your workplace pension currently covers <strong className="text-white">{coveragePct}%</strong> of your desired retirement lifestyle (~€{desiredMonthly.toLocaleString()}/mo based on 70% of gross salary)
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Spouse Pillar 2 */}
                    {formData.hasSpouse && (
                      <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                          <span className="text-lg">👥</span> Spouse — Workplace Pension
                        </h3>
                        <div className="bg-slate-900/20 rounded-lg p-4 space-y-4">
                          <div>
                            <label className="block text-white font-medium mb-2 text-sm">Spouse Total Built-up Pension</label>
                            <div className="relative">
                              <span className="absolute left-4 top-3 text-slate-400">€</span>
                              <input
                                type="number" onFocus={handleInputFocus}
                                value={formData.spouseBuiltUpPension}
                                onChange={(e) => updateFormData('spouseBuiltUpPension', Number(e.target.value))}
                                placeholder="e.g. 80000"
                                className="w-full bg-slate-800 border border-slate-700 text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                            <p className="text-slate-400 text-xs mt-1">Total value accrued across spouse's employer pensions</p>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <label className="block text-white font-medium text-sm">Spouse Factor A (from UPO)</label>
                              <div className="relative group">
                                <svg className="w-4 h-4 text-slate-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-700 text-white text-xs rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                  <p className="font-semibold text-emerald-400 mb-1">📍 Where is my Factor A?</p>
                                  <p>Check your most recent Uniform Pension Overview (UPO) from your employer's pension fund. It is typically found on the last page. If you have no employer pension, enter 0.</p>
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700"></div>
                                </div>
                              </div>
                            </div>
                            <div className="relative">
                              <span className="absolute left-4 top-3 text-slate-400">€</span>
                              <input
                                type="number" onFocus={handleInputFocus}
                                value={formData.spouseFactorA}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  updateFormData('spouseFactorA', val);
                                  const cappedSpouseSalary = Math.min(formData.spouseGrossSalary, 137800);
                                  const calc = Math.max(0, Math.round(0.30 * (cappedSpouseSalary - 19172) - 6.27 * val));
                                  updateFormData('spouseJaarruimte', calc);
                                }}
                                className="w-full bg-slate-800 border border-slate-700 text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                            <p className="text-slate-400 text-xs mt-1">Annual pension accrual from spouse's employer</p>
                          </div>

                          {/* Spouse Coverage Progress */}
                          {(() => {
                            const desiredMonthly = Math.round(formData.spouseGrossSalary * 0.7 / 12);
                            const pensionMonthly = formData.spouseBuiltUpPension > 0 ? Math.round(formData.spouseBuiltUpPension / (12 * (85 - formData.retirementAge))) : 0;
                            const coveragePct = desiredMonthly > 0 ? Math.min(100, Math.round((pensionMonthly / desiredMonthly) * 100)) : 0;
                            return (
                              <div className="bg-slate-800/50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-slate-300 text-sm font-medium">Spouse retirement coverage</p>
                                  <span className={`text-sm font-bold ${coveragePct >= 70 ? 'text-emerald-400' : coveragePct >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{coveragePct}%</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-3">
                                  <div
                                    className={`h-3 rounded-full transition-all ${coveragePct >= 70 ? 'bg-emerald-500' : coveragePct >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${coveragePct}%` }}
                                  ></div>
                                </div>
                                <p className="text-slate-400 text-xs mt-2">
                                  Spouse workplace pension covers <strong className="text-white">{coveragePct}%</strong> of desired retirement (~€{desiredMonthly.toLocaleString()}/mo)
                                </p>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Pillar 3 - Private Savings (The Tax Shield) */}
                    <div>
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <span className="text-lg">🛡️</span> {formData.hasSpouse ? 'Your Pillar 3 — Private Savings (The Tax Shield)' : 'Pillar 3 — Private Savings (The Tax Shield)'}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4">See how you can "beat the system" using tax-deductible accounts.</p>
                      <div className="bg-slate-900/20 rounded-lg p-4 space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Jaarruimte (Tax-Deductible Pension Room)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">€</span>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.jaarruimte}
                              readOnly
                              className="w-full bg-slate-800/50 border border-slate-700 text-emerald-400 font-semibold pl-8 pr-4 py-3 rounded-lg cursor-not-allowed"
                            />
                          </div>
                          <p className="text-slate-400 text-xs mt-1">
                            Auto-calculated: 30% × (€{Math.min(formData.grossSalary, 137800).toLocaleString()} - €19,172) - (6.27 × €{formData.factorA.toLocaleString()})
                          </p>
                          {validationErrors.jaarruimte && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.jaarruimte}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Unused Reserveringsruimte (Catch-up Room)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">€</span>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.reserveringsruimte}
                              onChange={(e) => updateFormData('reserveringsruimte', Number(e.target.value))}
                              placeholder="0"
                              className="w-full bg-slate-800 border border-slate-700 text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <p className="text-slate-400 text-xs mt-1">Unused tax-deductible pension room from the previous 10 years (max €42,753 in 2026)</p>
                        </div>

                        {/* Tax Refund Alert */}
                        {(formData.jaarruimte > 0 || formData.reserveringsruimte > 0) && (
                          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <span className="text-amber-400 text-lg">⚡</span>
                              <div>
                                <p className="text-amber-400 text-sm font-semibold mb-1">Immediate Tax Refund Opportunity</p>
                                <p className="text-slate-300 text-xs leading-relaxed">
                                  Using this room today could trigger an immediate tax refund of up to <strong className="text-white">49.5%</strong>. On €{(formData.jaarruimte + formData.reserveringsruimte).toLocaleString()} total room, that’s up to <strong className="text-white">€{Math.round((formData.jaarruimte + formData.reserveringsruimte) * 0.495).toLocaleString()}</strong> back.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Box 3 Shielding */}
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <span className="text-emerald-400 text-lg">🛡️</span>
                            <div>
                              <p className="text-emerald-400 text-sm font-semibold mb-1">Box 3 Shielding</p>
                              <p className="text-slate-300 text-xs leading-relaxed">
                                Assets in Pillar 3 accounts are <strong className="text-white">100% exempt</strong> from the 2026 Box 3 wealth tax. Every euro you move here is shielded from the 7.78% fictitious return tax.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Spouse Pillar 3 */}
                    {formData.hasSpouse && (
                      <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                          <span className="text-lg">👥</span> Spouse Pillar 3 — Private Savings (The Tax Shield)
                        </h3>
                        <div className="bg-slate-900/20 rounded-lg p-4 space-y-4">
                          <div>
                            <label className="block text-white font-medium mb-2 text-sm">Spouse Jaarruimte (Tax-Deductible Pension Room)</label>
                            <div className="relative">
                              <span className="absolute left-4 top-3 text-slate-400">€</span>
                              <input
                                type="number" onFocus={handleInputFocus}
                                value={formData.spouseJaarruimte}
                                readOnly
                                className="w-full bg-slate-800/50 border border-slate-700 text-emerald-400 font-semibold pl-8 pr-4 py-3 rounded-lg cursor-not-allowed"
                              />
                            </div>
                            <p className="text-slate-400 text-xs mt-1">
                              Auto-calculated: 30% × (€{Math.min(formData.spouseGrossSalary, 137800).toLocaleString()} - €19,172) - (6.27 × €{formData.spouseFactorA.toLocaleString()})
                            </p>
                          </div>

                          <div>
                            <label className="block text-white font-medium mb-2 text-sm">Spouse Unused Reserveringsruimte</label>
                            <div className="relative">
                              <span className="absolute left-4 top-3 text-slate-400">€</span>
                              <input
                                type="number" onFocus={handleInputFocus}
                                value={formData.spouseReserveringsruimte}
                                onChange={(e) => updateFormData('spouseReserveringsruimte', Number(e.target.value))}
                                placeholder="0"
                                className="w-full bg-slate-800 border border-slate-700 text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                            <p className="text-slate-400 text-xs mt-1">Spouse's unused catch-up room from the previous 10 years</p>
                          </div>

                          {(formData.spouseJaarruimte > 0 || formData.spouseReserveringsruimte > 0) && (
                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <span className="text-amber-400 text-lg">⚡</span>
                                <div>
                                  <p className="text-amber-400 text-sm font-semibold mb-1">Spouse Tax Refund Opportunity</p>
                                  <p className="text-slate-300 text-xs leading-relaxed">
                                    Using this room could trigger a refund of up to <strong className="text-white">€{Math.round((formData.spouseJaarruimte + formData.spouseReserveringsruimte) * 0.495).toLocaleString()}</strong>.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Pension Gap Summary */}
                    {(() => {
                      const desiredMonthly = Math.round(formData.grossSalary * 0.7 / 12);
                      const yearsInNL = Math.max(0, Math.min(67, 67 - formData.arrivalAgeNL) - formData.yearsAbroad);
                      const aowPct = Math.min(100, yearsInNL * 2);
                      const aowMonthly = Math.round(1637.57 * aowPct / 100);
                      const pillar2Monthly = formData.builtUpPension > 0 ? Math.round(formData.builtUpPension / (12 * Math.max(1, 85 - formData.retirementAge))) : 0;
                      const totalCovered = aowMonthly + pillar2Monthly;
                      const gap = Math.max(0, desiredMonthly - totalCovered);
                      return gap > 0 ? (
                        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-500/40 rounded-xl p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-red-400 font-bold text-lg mb-1">
                                Current Pension Gap: €{gap.toLocaleString()} per month
                              </h4>
                              <p className="text-slate-300 text-sm leading-relaxed">
                                Your Pillars 1 and 2 currently fall short of your <strong className="text-white">€{desiredMonthly.toLocaleString()}/mo</strong> lifestyle (AOW: €{aowMonthly.toLocaleString()} + Workplace: €{pillar2Monthly.toLocaleString()} = €{totalCovered.toLocaleString()}/mo). The <strong className="text-emerald-400">AI Strategy PDF</strong> will show you exactly how to fill this gap using Pillar 3 and Real Estate.
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-emerald-400 font-bold text-lg mb-1">No Pension Gap — Well Done!</h4>
                              <p className="text-slate-300 text-sm leading-relaxed">
                                Your Pillars 1 and 2 cover your <strong className="text-white">€{desiredMonthly.toLocaleString()}/mo</strong> target. The AI Strategy PDF can still optimize your tax position and grow your wealth further.
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex items-center justify-between mt-8 sm:mt-12">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back
                    </button>
                    <button
                      onClick={handleContinue}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base"
                    >
                      Continue
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Real Estate Step */}
              {currentStep === 'realEstate' && (
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Property & Mortgage</h1>
                  <p className="text-slate-400 mb-8 sm:mb-12">Identify hidden wealth and tax-saving opportunities in your real estate.</p>

                  <div className="space-y-8">
                    {/* Current Primary Residence (Box 1) */}
                    <div>
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <span className="text-lg">🏠</span> Current Primary Residence (Box 1)
                      </h3>
                      <div className="bg-slate-900/20 rounded-lg p-4 space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <label className="block text-white font-medium text-sm">Current Market / WOZ Value</label>
                            <div className="relative group">
                              <svg className="w-4 h-4 text-slate-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-700 text-white text-xs rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                <p>Check <a href="https://www.wozwaardeloket.nl" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">wozwaardeloket.nl</a> for the most recent official valuation.</p>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700"></div>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">€</span>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.propertyValue}
                              onChange={(e) => updateFormData('propertyValue', Number(e.target.value))}
                              className="w-full bg-slate-800 border border-slate-700 text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Mortgage Balance</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">€</span>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.mortgageBalance}
                              onChange={(e) => updateFormData('mortgageBalance', Number(e.target.value))}
                              placeholder="Remaining principal on your loan"
                              className={`w-full bg-slate-800 border ${validationErrors.mortgageBalance ? 'border-red-500' : 'border-slate-700'} text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                            />
                          </div>
                          {validationErrors.mortgageBalance && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.mortgageBalance}</p>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <label className="block text-white font-medium text-sm">Interest Rate (%)</label>
                            <div className="relative group">
                              <svg className="w-4 h-4 text-slate-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-700 text-white text-xs rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                <p>Log in to your bank portal (e.g., ING, Rabo) under "Hypotheek" details. Check if it's Annuity, Linear, or Interest-only on your annual bank statement.</p>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700"></div>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <input
                              type="number" onFocus={handleInputFocus}
                              step="0.1"
                              value={formData.mortgageInterestRate}
                              onChange={(e) => updateFormData('mortgageInterestRate', Number(e.target.value))}
                              placeholder="e.g. 4.2"
                              className={`w-full bg-slate-800 border ${validationErrors.mortgageInterestRate ? 'border-red-500' : 'border-slate-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                            />
                            <span className="absolute right-4 top-3 text-slate-400">%</span>
                          </div>
                          <p className="text-slate-400 text-xs mt-1">Crucial for comparing debt costs vs. investment returns</p>
                          {validationErrors.mortgageInterestRate && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.mortgageInterestRate}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Remaining Term (Years)</label>
                          <input
                            type="number" onFocus={handleInputFocus}
                            value={formData.mortgageYearsLeft}
                            onChange={(e) => updateFormData('mortgageYearsLeft', Number(e.target.value))}
                            placeholder="When will the monthly burn rate drop to zero?"
                            className={`w-full bg-slate-800 border ${validationErrors.mortgageYearsLeft ? 'border-red-500' : 'border-slate-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                          />
                          {validationErrors.mortgageYearsLeft && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.mortgageYearsLeft}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* The "Upgrade" Scenario */}
                    <div>
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <span className="text-lg">🎯</span> The "Upgrade" Scenario (Strategy Hook)
                      </h3>
                      <p className="text-slate-400 text-sm mb-4">Planning a property upgrade? Tell us your dream home.</p>
                      <div className="bg-slate-900/20 rounded-lg p-4 space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Target Property Value</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">€</span>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.targetPropertyValue}
                              onChange={(e) => updateFormData('targetPropertyValue', Number(e.target.value))}
                              placeholder="Value of your dream/upgraded home"
                              className="w-full bg-slate-800 border border-slate-700 text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Planned Move Date</label>
                          <input
                            type="date"
                            value={formData.plannedMoveDate}
                            onChange={(e) => updateFormData('plannedMoveDate', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <p className="text-slate-400 text-xs mt-1">When do you intend to switch properties?</p>
                        </div>
                      </div>
                    </div>

                    {/* Investment Real Estate */}
                    <div>
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <span className="text-lg">🏢</span> Investment Real Estate (if any)
                      </h3>
                      <div className="bg-slate-900/20 rounded-lg p-4 space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Rental Income (Annual)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">€</span>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.rentalIncome}
                              onChange={(e) => updateFormData('rentalIncome', Number(e.target.value))}
                              className="w-full bg-slate-800 border border-slate-700 text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Property Sale Proceeds (2025)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">€</span>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.saleProceeds}
                              onChange={(e) => updateFormData('saleProceeds', Number(e.target.value))}
                              className="w-full bg-slate-800 border border-slate-700 text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <p className="text-slate-400 text-xs mt-2">If you sold investment property in the tax year</p>
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Original Purchase Price</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">€</span>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.purchasePrice}
                              onChange={(e) => updateFormData('purchasePrice', Number(e.target.value))}
                              className="w-full bg-slate-800 border border-slate-700 text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Loss Carry-Forward */}
                    <div>
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <span className="text-lg">📋</span> Loss Carry-Forward
                      </h3>
                      <div className="bg-slate-900/20 rounded-lg p-4 space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Prior Year Loss (Box 3)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">€</span>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.priorYearLoss}
                              onChange={(e) => updateFormData('priorYearLoss', Number(e.target.value))}
                              className="w-full bg-slate-800 border border-slate-700 text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <p className="text-slate-400 text-xs mt-2">Loss from 2024 or earlier that can be deducted</p>
                        </div>
                      </div>
                    </div>

                    {/* Calculations & Tax Analysis */}
                    {formData.propertyValue > 0 && formData.mortgageBalance > 0 && (
                      <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                          <span className="text-lg">📈</span> Your Tax Analysis
                        </h3>
                        {(() => {
                          const equity = formData.propertyValue - formData.mortgageBalance;
                          const annualInterest = formData.mortgageBalance * (formData.mortgageInterestRate / 100);
                          const hraDeduction = 0.3748;
                          const hraRefund = Math.round(annualInterest * hraDeduction);
                          const effectiveRate = formData.mortgageInterestRate * (1 - hraDeduction);
                          const eigenwoningforfait = formData.propertyValue <= 1310000 ? Math.round(formData.propertyValue * 0.0035) : Math.round(formData.propertyValue * 0.0235);
                          const netTaxBenefit = hraRefund - Math.round(eigenwoningforfait * 0.3748);
                          const box3TaxOnEquity = Math.round(Math.max(0, equity - 57000) * 0.0778 * 0.36);
                          const totalNonHousingAssets = formData.savingsBalance + formData.cryptoValueDec31;
                          const box3TaxSavings = Math.round(Math.min(totalNonHousingAssets, equity) * 0.0778 * 0.36);

                          return (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                                  <p className="text-slate-400 text-xs mb-1">Box 3 Tax Savings</p>
                                  <p className="text-emerald-400 text-xl font-bold">€{box3TaxSavings.toLocaleString()}/yr</p>
                                  <p className="text-slate-500 text-xs mt-1">By moving cash to home equity</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                                  <p className="text-slate-400 text-xs mb-1">HRA Tax Refund</p>
                                  <p className="text-emerald-400 text-xl font-bold">€{hraRefund.toLocaleString()}/yr</p>
                                  <p className="text-slate-500 text-xs mt-1">Effective rate: {effectiveRate.toFixed(2)}%</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                                  <p className="text-slate-400 text-xs mb-1">Net Tax Benefit</p>
                                  <p className={`text-xl font-bold ${netTaxBenefit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>€{netTaxBenefit.toLocaleString()}/yr</p>
                                  <p className="text-slate-500 text-xs mt-1">HRA refund minus eigenwoningforfait</p>
                                </div>
                              </div>

                              {/* Eigenwoningforfait breakdown */}
                              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700">
                                <p className="text-slate-400 text-xs">
                                  <strong className="text-slate-300">Eigenwoningforfait:</strong> €{eigenwoningforfait.toLocaleString()}/yr (imputed rent, {formData.propertyValue <= 1310000 ? '0.35%' : '2.35%'} of WOZ) • <strong className="text-slate-300">Net:</strong> HRA €{hraRefund.toLocaleString()} - EWF tax €{Math.round(eigenwoningforfait * 0.3748).toLocaleString()} = <strong className={netTaxBenefit >= 0 ? 'text-emerald-400' : 'text-red-400'}>€{netTaxBenefit.toLocaleString()}</strong>
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Teaser Alerts */}
                    {formData.propertyValue > 0 && (
                      <div className="space-y-4">
                        {/* House as a Shield Alert */}
                        {(() => {
                          const equity = formData.propertyValue - formData.mortgageBalance;
                          const totalBox3Assets = formData.savingsBalance + formData.cryptoValueDec31;
                          const exposedWealth = Math.max(0, totalBox3Assets - 57000);
                          return exposedWealth > 0 ? (
                            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/40 rounded-xl p-5">
                              <div className="flex items-start gap-3">
                                <span className="text-2xl">🛡️</span>
                                <div>
                                  <h4 className="text-amber-400 font-bold mb-1">The "House as a Shield" Alert</h4>
                                  <p className="text-slate-300 text-sm leading-relaxed">
                                    Your current setup leaves <strong className="text-white">€{exposedWealth.toLocaleString()}</strong> in assets exposed to the 2028 Box 3 'Actual Return' tax. Moving this to a primary residence could <strong className="text-emerald-400">shield this wealth entirely</strong>.
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : null;
                        })()}

                        {/* Buy vs Invest Verdict */}
                        {formData.mortgageInterestRate > 0 && (
                          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/40 rounded-xl p-5">
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">⚖️</span>
                              <div>
                                <h4 className="text-blue-400 font-bold mb-1">The "Buy vs. Invest" Verdict</h4>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                  Should you pay off your <strong className="text-white">{formData.mortgageInterestRate}%</strong> mortgage or keep the money in the AEX? Our AI found a <strong className="text-white">€{Math.round(formData.mortgageBalance * Math.abs(0.08 - formData.mortgageInterestRate / 100) * 10).toLocaleString()}</strong> difference in your 10-year outlook. <strong className="text-emerald-400">Get the full verdict in your PDF</strong>.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Legacy note */}
                    {formData.homeValue > 0 && (
                      <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
                        <p className="text-yellow-300 text-xs">
                          <strong>Note:</strong> Update Property Value above to sync primary residence details.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-8 sm:mt-12">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back
                    </button>
                    <button
                      onClick={handleContinue}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base"
                    >
                      Continue
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Retirement Step */}
              {currentStep === 'retirement' && (
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Retirement — The Finish Line</h1>
                  <p className="text-slate-400 mb-8 sm:mb-12">Define your freedom date and uncover the hidden risks of early retirement in the Netherlands.</p>

                  <div className="space-y-8">
                    {/* Core Retirement Inputs */}
                    <div>
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <span className="text-lg">🎯</span> Your Retirement Target
                      </h3>
                      <div className="bg-slate-900/20 rounded-lg p-4 space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Target Retirement Age</label>
                          <input
                            type="number" onFocus={handleInputFocus}
                            value={formData.targetRetirementAge}
                            onChange={(e) => updateFormData('targetRetirementAge', Number(e.target.value))}
                            min="30"
                            max="80"
                            className={`w-full bg-slate-800 border ${validationErrors.targetRetirementAge ? 'border-red-500' : 'border-slate-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                          />
                          <p className="text-slate-400 text-xs mt-1">The age you want to stop working — your "Freedom Date"</p>
                          {validationErrors.targetRetirementAge && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.targetRetirementAge}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Desired Monthly Net Income</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400">€</span>
                            <input
                              type="number" onFocus={handleInputFocus}
                              value={formData.desiredMonthlyIncome}
                              onChange={(e) => updateFormData('desiredMonthlyIncome', Number(e.target.value))}
                              placeholder="How much do you need to live comfortably?"
                              className={`w-full bg-slate-800 border ${validationErrors.desiredMonthlyIncome ? 'border-red-500' : 'border-slate-700'} text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                            />
                          </div>
                          {validationErrors.desiredMonthlyIncome && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.desiredMonthlyIncome}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm">Life Expectancy (for modelling)</label>
                          <input
                            type="number" onFocus={handleInputFocus}
                            value={formData.lifeExpectancy}
                            onChange={(e) => updateFormData('lifeExpectancy', Number(e.target.value))}
                            min="65"
                            max="110"
                            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <p className="text-slate-400 text-xs mt-1">Default: 90. How long your nest egg must last.</p>
                        </div>
                      </div>
                    </div>

                    {/* AOW Start Date (Auto-Calculated) */}
                    <div>
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <span className="text-lg">🏛️</span> AOW Start Date (Auto-Calculated)
                      </h3>
                      {(() => {
                        const birthYear = new Date().getFullYear() - formData.age;
                        const aowYear = birthYear + 67;
                        let aowAgeLabel = '67 years';
                        let aowMonths = 0;
                        if (aowYear >= 2028 && aowYear <= 2031) {
                          aowAgeLabel = '67 years and 3 months';
                          aowMonths = 3;
                        } else if (aowYear >= 2032) {
                          aowAgeLabel = '67 years and 3 months+';
                          aowMonths = 3;
                        }
                        const aowStartAge = 67 + aowMonths / 12;
                        const bridgeYears = Math.max(0, Math.round((aowStartAge - formData.targetRetirementAge) * 10) / 10);
                        const monthlyNeed = formData.desiredMonthlyIncome;
                        const aowMonthlyGross = formData.hasSpouse ? 1187 : 1637;
                        const employerPensionMonthly = Math.round(formData.builtUpPension / 12);
                        const totalPensionIncome = aowMonthlyGross + employerPensionMonthly;
                        const bridgeGap = Math.round(bridgeYears * 12 * monthlyNeed);
                        const postAowMonthlyGap = Math.max(0, monthlyNeed - totalPensionIncome);
                        const postAowYears = Math.max(0, formData.lifeExpectancy - aowStartAge);
                        const postAowGap = Math.round(postAowMonthlyGap * 12 * postAowYears);
                        const totalCapitalNeeded = bridgeGap + postAowGap;
                        const currentWealth = formData.savingsBalance + formData.cryptoValueDec31 + (formData.propertyValue - formData.mortgageBalance);
                        const wealthDelta = currentWealth - totalCapitalNeeded;

                        return (
                          <div className="space-y-6">
                            {/* AOW info box */}
                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-slate-400 text-sm">Your projected AOW age</p>
                                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-bold">{aowAgeLabel}</span>
                              </div>
                              <p className="text-slate-500 text-xs">Based on birth year ~{birthYear}. 2026–2027: 67 yrs • 2028–2031: 67 yrs 3 mo</p>
                            </div>

                            {/* The Bridge Phase Visual */}
                            {bridgeYears > 0 && (
                              <div>
                                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                  <span className="text-lg">🌉</span> The Bridge Phase
                                </h3>
                                <div className="bg-slate-900/30 rounded-xl p-5 border border-slate-700">
                                  {/* Timeline bar */}
                                  <div className="mb-6">
                                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                                      <span>Age {formData.targetRetirementAge}</span>
                                      <span>Age {Math.ceil(aowStartAge)}</span>
                                      <span>Age {formData.lifeExpectancy}</span>
                                    </div>
                                    <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex">
                                      {(() => {
                                        const totalYears = formData.lifeExpectancy - formData.targetRetirementAge;
                                        const bridgePct = totalYears > 0 ? (bridgeYears / totalYears) * 100 : 0;
                                        const aowPct = 100 - bridgePct;
                                        return (
                                          <>
                                            <div
                                              className="h-full bg-gradient-to-r from-red-500 to-amber-500 relative"
                                              style={{ width: `${bridgePct}%` }}
                                            >
                                              <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-white drop-shadow">{Math.round(bridgeYears)}yr</span>
                                              </div>
                                            </div>
                                            <div
                                              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 relative"
                                              style={{ width: `${aowPct}%` }}
                                            >
                                              <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-white drop-shadow">{Math.round(postAowYears)}yr</span>
                                              </div>
                                            </div>
                                          </>
                                        );
                                      })()}
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                      <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gradient-to-r from-red-500 to-amber-500"></div><span className="text-xs text-slate-400">Bridge (self-funded)</span></div>
                                      <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald-500"></div><span className="text-xs text-slate-400">AOW + Pension active</span></div>
                                    </div>
                                  </div>

                                  {/* Warning */}
                                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-5">
                                    <div className="flex items-start gap-3">
                                      <span className="text-xl">⚠️</span>
                                      <p className="text-red-300 text-sm leading-relaxed">
                                        <strong className="text-red-200">Warning:</strong> You must independently finance the next <strong className="text-white">{Math.round(bridgeYears)} years</strong> before the government provides any support. That's <strong className="text-white">{Math.round(bridgeYears) * 12} months</strong> of living expenses from your own pocket.
                                      </p>
                                    </div>
                                  </div>

                                  {/* Wealth Burn-Rate Visual */}
                                  <div className="mb-5">
                                    <h4 className="text-white font-medium text-sm mb-3">Wealth Burn-Rate Projection</h4>
                                    <div className="relative h-32 bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden p-3">
                                      <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
                                        {/* Grid lines */}
                                        <line x1="0" y1="25" x2="400" y2="25" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
                                        <line x1="0" y1="50" x2="400" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
                                        <line x1="0" y1="75" x2="400" y2="75" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
                                        {(() => {
                                          const totalYears = formData.lifeExpectancy - formData.targetRetirementAge;
                                          if (totalYears <= 0) return null;
                                          const bridgeFraction = bridgeYears / totalYears;
                                          const bridgeX = bridgeFraction * 400;
                                          const startY = 10;
                                          const bridgeEndY = totalCapitalNeeded > 0 ? Math.min(90, startY + (bridgeGap / totalCapitalNeeded) * 70) : startY;
                                          const endY = Math.min(95, bridgeEndY + (postAowGap > 0 ? 20 : 5));
                                          return (
                                            <>
                                              {/* Bridge phase line (steep decline) */}
                                              <line x1={bridgeX} y1="0" x2={bridgeX} y2="100" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3" />
                                              <path
                                                d={`M 0 ${startY} C ${bridgeX * 0.5} ${startY + 10}, ${bridgeX * 0.8} ${bridgeEndY - 15}, ${bridgeX} ${bridgeEndY} C ${bridgeX + (400 - bridgeX) * 0.3} ${bridgeEndY + 5}, ${bridgeX + (400 - bridgeX) * 0.6} ${endY - 5}, 400 ${endY}`}
                                                fill="none"
                                                stroke="url(#burnGradient)"
                                                strokeWidth="2.5"
                                              />
                                              <defs>
                                                <linearGradient id="burnGradient" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
                                                  <stop offset="0%" stopColor="#ef4444" />
                                                  <stop offset={`${bridgeFraction * 100}%`} stopColor="#f59e0b" />
                                                  <stop offset="100%" stopColor="#10b981" />
                                                </linearGradient>
                                              </defs>
                                              <text x={bridgeX + 4} y="12" fill="#f59e0b" fontSize="8" fontWeight="bold">AOW starts</text>
                                            </>
                                          );
                                        })()}
                                      </svg>
                                      <div className="absolute bottom-1 left-3 text-[10px] text-slate-500">Capital over time →</div>
                                    </div>
                                  </div>

                                  {/* The "Gap to Fill" Counter */}
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                                      <p className="text-slate-400 text-xs mb-1">Bridge Phase Cost</p>
                                      <p className="text-red-400 text-2xl font-black">€{bridgeGap.toLocaleString()}</p>
                                      <p className="text-slate-500 text-xs mt-1">{Math.round(bridgeYears)} yrs × €{monthlyNeed.toLocaleString()}/mo</p>
                                    </div>
                                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-center">
                                      <p className="text-slate-400 text-xs mb-1">Post-AOW Shortfall</p>
                                      <p className="text-amber-400 text-2xl font-black">€{postAowGap.toLocaleString()}</p>
                                      <p className="text-slate-500 text-xs mt-1">€{postAowMonthlyGap.toLocaleString()}/mo gap × {Math.round(postAowYears)}yr</p>
                                    </div>
                                    <div className={`${wealthDelta >= 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'} border rounded-lg p-4 text-center`}>
                                      <p className="text-slate-400 text-xs mb-1">Total Capital Needed</p>
                                      <p className={`${wealthDelta >= 0 ? 'text-emerald-400' : 'text-red-400'} text-2xl font-black`}>€{totalCapitalNeeded.toLocaleString()}</p>
                                      <p className="text-slate-500 text-xs mt-1">Current wealth: €{currentWealth.toLocaleString()}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Surplus / Deficit indicator */}
                            <div className={`rounded-xl p-5 border ${wealthDelta >= 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-slate-400 text-sm">{wealthDelta >= 0 ? 'Estimated Surplus' : 'Estimated Shortfall'}</p>
                                  <p className={`text-3xl font-black ${wealthDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {wealthDelta >= 0 ? '+' : ''}€{wealthDelta.toLocaleString()}
                                  </p>
                                </div>
                                <span className="text-4xl">{wealthDelta >= 0 ? '✅' : '🚨'}</span>
                              </div>
                            </div>

                            {/* Loss Aversion Psychological Teaser */}
                            <div className="bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/40 rounded-xl p-5">
                              <div className="flex items-start gap-3">
                                <span className="text-2xl">🏛️</span>
                                <div>
                                  <h4 className="text-red-400 font-bold mb-2">"The government just moved the goalposts."</h4>
                                  <p className="text-slate-300 text-sm leading-relaxed">
                                    Your AOW age is projected to be <strong className="text-white">{aowAgeLabel}</strong>, but inflation is rising faster than state benefits. A <strong className="text-white">€{Math.round(postAowMonthlyGap > 0 ? postAowMonthlyGap : 1500).toLocaleString()}/month</strong> shortfall during your bridge years could cost you <strong className="text-red-300">€{Math.round((postAowMonthlyGap > 0 ? postAowMonthlyGap : 1500) * 12 * bridgeYears).toLocaleString()}</strong> in extra savings. <strong className="text-emerald-400">Get the full 'Safe Withdrawal' roadmap in your PDF</strong> to ensure you never run out of money.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-8 sm:mt-12">
                    <button
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back
                    </button>
                    <button
                      onClick={handleContinue}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing (up to 5 min)...
                        </>
                      ) : (
                        <>
                          Submit & Analyze
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Top Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-lg sm:text-xl font-bold text-white hidden sm:inline">VrijWealth</span>
            </div>

            {/* Center Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-400 hover:text-white transition-colors">{t.nav.features}</a>
              <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">{t.nav.pricing}</a>
              <a href="#trust" className="text-slate-400 hover:text-white transition-colors">{t.nav.trust}</a>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="flex items-center gap-1 sm:gap-2 text-slate-400 hover:text-white transition-colors px-2 sm:px-3 py-2 rounded-lg hover:bg-slate-800"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                  <span className="font-medium text-sm sm:text-base">{language === 'en' ? 'EN' : 'NL'}</span>
                  <svg className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showLangDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden z-50">
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setShowLangDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors flex items-center justify-between ${
                        language === 'en' ? 'bg-slate-700 text-white' : 'text-slate-300'
                      }`}
                    >
                      <span>English</span>
                      <span className="text-sm text-slate-400">EN</span>
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('nl');
                        setShowLangDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors flex items-center justify-between ${
                        language === 'nl' ? 'bg-slate-700 text-white' : 'text-slate-300'
                      }`}
                    >
                      <span>Nederlands</span>
                      <span className="text-sm text-slate-400">NL</span>
                    </button>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleGetStarted}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-3 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                <span className="hidden sm:inline">{t.nav.getStarted}</span>
                <span className="sm:hidden">Start</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Coming Soon Badge */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-red-950/30 border border-red-800/50 rounded-full px-5 py-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path strokeWidth="2" strokeLinecap="round" d="M12 6v6l4 2"/>
              </svg>
              <span className="text-red-400 font-medium">{t.hero.badge}</span>
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
              {t.hero.title} <span className="text-emerald-400">{t.hero.titleHighlight}</span>
            </h1>
            <p className="text-slate-400 text-base max-w-4xl mx-auto leading-relaxed">
              {t.hero.subtitle} <span className="text-white font-semibold">{t.hero.subtitleBold}</span> {t.hero.subtitleEnd} <span className="italic">{t.hero.subtitleItalic}</span> {t.hero.subtitleFinal}
            </p>
          </div>

          {/* Timeline Indicator */}
          <div className="flex items-center justify-center mb-12 sm:mb-20">
            <div className="flex items-center gap-3 sm:gap-6 md:gap-8">
              {/* Now - Green */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 sm:border-3 border-emerald-500 bg-slate-900 flex items-center justify-center mb-2 shadow-lg shadow-emerald-500/30">
                  <span className="text-emerald-500 font-bold text-sm sm:text-base">{t.hero.now}</span>
                </div>
                <span className="text-slate-400 text-xs sm:text-sm font-medium">{t.hero.nowLabel}</span>
              </div>

              {/* Progress Line */}
              <div className="w-24 sm:w-48 md:w-64 h-1 bg-slate-700 relative">
                <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-emerald-500 to-slate-700"></div>
              </div>

              {/* 2028 - Red */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 sm:border-3 border-red-500 bg-slate-900 flex items-center justify-center mb-2 shadow-lg shadow-red-500/30">
                  <span className="text-red-500 font-bold text-sm sm:text-base">{t.hero.year2028}</span>
                </div>
                <span className="text-slate-400 text-xs sm:text-sm font-medium">{t.hero.year2028Label}</span>
              </div>
            </div>
          </div>

          {/* Calculator Section - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {/* Left Card - Your Situation */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Your Situation</h3>
                <button className="text-xs font-medium bg-slate-700 text-slate-300 px-3 py-1 rounded">Single</button>
              </div>

              {/* Bank & Savings */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-emerald-400 text-lg">💰</span>
                  <h4 className="font-bold text-white">Bank & Savings</h4>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-white font-medium text-sm">Savings Balance</label>
                      <span className="text-emerald-400 font-semibold text-sm">€{savingsBalance.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="1000"
                      value={savingsBalance}
                      onChange={(e) => setSavingsBalance(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-white font-medium text-sm">Interest Earned</label>
                      <span className="text-emerald-400 font-semibold text-sm">€{interestEarned.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="50"
                      value={interestEarned}
                      onChange={(e) => setInterestEarned(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Stocks & Crypto */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-blue-400 text-lg">📈</span>
                  <h4 className="font-bold text-white">Stocks & Crypto</h4>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-white font-medium text-sm">Value Jan 1</label>
                      <span className="text-emerald-400 font-semibold text-sm">€{cryptoValueJan1.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="5000"
                      value={cryptoValueJan1}
                      onChange={(e) => setCryptoValueJan1(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-white font-medium text-sm">Value Dec 31</label>
                      <span className="text-emerald-400 font-semibold text-sm">€{cryptoValueDec31.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="5000"
                      value={cryptoValueDec31}
                      onChange={(e) => setCryptoValueDec31(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-white font-medium text-sm">Dividends Received</label>
                      <span className="text-emerald-400 font-semibold text-sm">€{dividendsReceived.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={dividendsReceived}
                      onChange={(e) => setDividendsReceived(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Real Estate */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-orange-400 text-lg">🏠</span>
                  <h4 className="font-bold text-white">Real Estate (excl. primary home)</h4>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-white font-medium text-sm">Property Value</label>
                      <span className="text-emerald-400 font-semibold text-sm">€{propertyValue.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={propertyValue}
                      onChange={(e) => setPropertyValue(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-white font-medium text-sm">Rental Income</label>
                      <span className="text-emerald-400 font-semibold text-sm">€{rentalIncome.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="500"
                      value={rentalIncome}
                      onChange={(e) => setRentalIncome(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-white font-medium text-sm">Sale Proceeds (if not sold)</label>
                      <span className="text-emerald-400 font-semibold text-sm">€{saleProceeds.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="5000"
                      value={saleProceeds}
                      onChange={(e) => setSaleProceeds(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-white font-medium text-sm">Purchase Price</label>
                      <span className="text-emerald-400 font-semibold text-sm">€{purchasePrice.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="5000"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-red-400 text-lg">🔴</span>
                  <h4 className="font-bold text-white">Deductions</h4>
                </div>
                <div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-white font-medium text-sm">Costs (debt interest, etc.)</label>
                      <span className="text-emerald-400 font-semibold text-sm">€{debtInterest.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="500"
                      value={debtInterest}
                      onChange={(e) => setDebtInterest(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Loss Carry-Forward */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-purple-400 text-lg">📊</span>
                  <h4 className="font-bold text-white">Loss Carry-Forward</h4>
                </div>
                <div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-white font-medium text-sm">Prior Year Loss</label>
                      <span className="text-emerald-400 font-semibold text-sm">€{priorYearLoss.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priorYearLoss}
                      onChange={(e) => setPriorYearLoss(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card - Your Tax Comparison */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Tax Comparison</h3>

              {/* Old System 2024 - Collapsible Breakdown */}
              <div className="bg-slate-700/30 rounded-xl p-5 mb-6 border border-slate-700">
                <button 
                  onClick={() => setExpandTax2024(!expandTax2024)}
                  className="w-full flex justify-between items-center hover:bg-slate-700/20 rounded-lg p-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-300 font-medium text-sm">Old System — Fictional Yield (2024)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-white">€{Math.round(currentTax).toLocaleString()}/yr</span>
                    <svg 
                      className={`w-5 h-5 text-slate-400 transition-transform ${expandTax2024 ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </button>
                
                {/* Breakdown Details - Collapsible */}
                {expandTax2024 && (
                  <div className="bg-slate-800/50 rounded-lg p-4 mt-4 space-y-3 text-xs border-t border-slate-600">
                    <div className="border-b border-slate-600 pb-3">
                      <p className="text-slate-400 mb-2">📊 Asset Base (January 1):</p>
                      <div className="grid grid-cols-2 gap-2 ml-2 text-slate-300">
                        <span>• Savings: €{savingsBalance.toLocaleString()}</span>
                        <span>• Stocks/Crypto: €{cryptoValueJan1.toLocaleString()}</span>
                        <span>• Real Estate: €{propertyValue.toLocaleString()}</span>
                        <span className="font-semibold text-white">Total Assets: €{(savingsBalance + cryptoValueJan1 + propertyValue).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="border-b border-slate-600 pb-3">
                      <p className="text-slate-400 mb-2">📈 Notional Returns (2024 Official Rates):</p>
                      <div className="grid grid-cols-2 gap-2 ml-2 text-slate-300">
                        <span>• Savings (1.03%): €{Math.round(savingsBalance * 0.0103).toLocaleString()}</span>
                        <span>• Investments & Other (6.04%): €{Math.round((cryptoValueJan1 + propertyValue) * 0.0604).toLocaleString()}</span>
                        <span className="font-semibold text-white col-span-2">Total Notional Return: €{Math.round(savingsBalance * 0.0103 + (cryptoValueJan1 + propertyValue) * 0.0604).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="border-b border-slate-600 pb-3">
                      <p className="text-slate-400 mb-2">⚖️ Effective Yield & Taxable Base:</p>
                      <div className="grid grid-cols-2 gap-2 ml-2 text-slate-300">
                        <span>• Effective Yield: {((savingsBalance * 0.0103 + (cryptoValueJan1 + propertyValue) * 0.0604) / (savingsBalance + cryptoValueJan1 + propertyValue) * 100).toFixed(3)}%</span>
                        <span>• Tax-Free Allowance: €57,000</span>
                        <span className="font-semibold text-white col-span-2">Taxable Base: €{Math.max(0, (savingsBalance + cryptoValueJan1 + propertyValue) - 57000).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-slate-400 mb-2">✖️ Final Calculation (Taxable Base × Effective Yield × 36%):</p>
                      <div className="ml-2 text-white font-semibold">
                        € {Math.round(currentTax).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* New System 2028 - Collapsible Breakdown */}
              <div className="bg-emerald-900/20 rounded-xl p-5 mb-6 border border-emerald-800">
                <button 
                  onClick={() => setExpandTax2028(!expandTax2028)}
                  className="w-full flex justify-between items-center hover:bg-emerald-900/30 rounded-lg p-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-300 font-medium text-sm">New System — Actual Returns (2028)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-white">€{Math.round(newTax).toLocaleString()}/yr</span>
                    <svg 
                      className={`w-5 h-5 text-emerald-400 transition-transform ${expandTax2028 ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </button>
                
                {/* Breakdown Details - Collapsible */}
                {expandTax2028 && (
                  <div className="bg-emerald-950/30 rounded-lg p-4 mt-4 space-y-3 text-xs border-t border-emerald-700">
                    <div className="border-b border-emerald-700 pb-3">
                      <p className="text-emerald-300 mb-2">💰 Income Sources:</p>
                      <div className="grid grid-cols-2 gap-2 ml-2 text-slate-300">
                        <span>• Savings Interest: €{interestEarned.toLocaleString()}</span>
                        <span>• Stock/Crypto Gain: €{Math.max(0, cryptoValueDec31 - cryptoValueJan1).toLocaleString()}</span>
                        <span>• Dividends: €{dividendsReceived.toLocaleString()}</span>
                        <span>• Rental Income: €{rentalIncome.toLocaleString()}</span>
                        <span className="font-semibold text-white col-span-2">Total Income: €{(interestEarned + Math.max(0, cryptoValueDec31 - cryptoValueJan1) + dividendsReceived + rentalIncome).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="border-b border-emerald-700 pb-3">
                      <p className="text-emerald-300 mb-2">📌 Deductions & Credits:</p>
                      <div className="grid grid-cols-2 gap-2 ml-2 text-slate-300">
                        <span>• Interest Costs: -€{debtInterest.toLocaleString()}</span>
                        <span>• Prior Year Loss: -€{priorYearLoss.toLocaleString()}</span>
                        <span className="font-semibold text-white col-span-2">Net Income: €{Math.max(0, interestEarned + Math.max(0, cryptoValueDec31 - cryptoValueJan1) + dividendsReceived + rentalIncome - debtInterest - priorYearLoss).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="border-b border-emerald-700 pb-3">
                      <p className="text-emerald-300 mb-2">🎯 Tax-Free Threshold & Final Tax:</p>
                      <div className="grid grid-cols-2 gap-2 ml-2 text-slate-300">
                        <span>• Taxable Profit: €{Math.max(0, Math.max(0, interestEarned + Math.max(0, cryptoValueDec31 - cryptoValueJan1) + dividendsReceived + rentalIncome - debtInterest - priorYearLoss) - 1800).toLocaleString()}</span>
                        <span>• Tax Rate: 36%</span>
                        <span className="font-semibold text-white col-span-2">Tax Due: €{Math.round(newTax).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-700">
                      <p className="text-emerald-200 mb-2 text-xs font-semibold">💧 Liquidity Note:</p>
                      <div className="text-xs text-emerald-300">
                        {(() => {
                          const directCash = interestEarned + dividendsReceived + rentalIncome;
                          const liquidityPercent = directCash > 0 ? Math.round((newTax / directCash) * 100) : 0;
                          return (
                            <span>
                              {directCash > 0 
                                ? `Your tax bill consumes ${liquidityPercent}% of direct cash income (Interest + Dividends + Rent).` 
                                : 'No direct cash income to assess liquidity.'}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* You'll Pay More/Less Box */}
              <div className={`rounded-xl p-5 border-2 mb-6 ${
                difference < 0 ? 'bg-emerald-950/30 border-emerald-700' : 'bg-red-950/30 border-red-800'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{difference < 0 ? '📉' : '📈'}</span>
                  <span className="text-white font-semibold text-sm">{difference < 0 ? 'You\'ll Pay Less' : 'You\'ll Pay More'}</span>
                </div>
                <div className={`text-3xl font-bold mb-3 ${difference < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {difference < 0 ? '-' : '+'}€{Math.abs(Math.round(difference)).toLocaleString()}
                  <span className="text-sm text-slate-400 font-normal ml-2">/ year</span>
                </div>
                <p className={`text-xs leading-relaxed ${difference < 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                  {difference < 0 
                    ? '✓ The new system benefits you because your actual returns are lower than the fictional yield assumption.' 
                    : '⚠️ The new system increases your tax burden because you have unrealized gains (especially from investments) that are now directly taxed.'}
                </p>
              </div>

              {/* Portfolio vs Tax Liability Chart */}
              <div className="bg-slate-900/20 rounded-lg p-6 mb-4 border border-slate-800">
                <p className="text-xs text-slate-400 text-center mb-6 font-semibold">Portfolio vs Tax Liability</p>
                <div className="flex items-end justify-around gap-6" style={{ minHeight: '160px' }}>
                  {/* Portfolio Bar */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="text-xs text-slate-400 mb-2 font-medium">€{Math.round(netWorth / 1000)}k</div>
                    <div className="w-16 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg border border-emerald-400" 
                         style={{ height: `${Math.min(120, (netWorth / 1000000) * 120)}px` }}>
                    </div>
                    <span className="text-xs text-slate-400 mt-3 font-medium">Portfolio</span>
                  </div>
                  {/* Old Tax Bar */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="text-xs text-slate-400 mb-2 font-medium">€{Math.round(currentTax / 1000)}k</div>
                    <div className="w-16 bg-gradient-to-t from-slate-500 to-slate-400 rounded-t-lg border border-slate-400" 
                         style={{ height: `${Math.min(120, (currentTax / 5000) * 120)}px` }}>
                    </div>
                    <span className="text-xs text-slate-400 mt-3 font-medium">2024 Tax</span>
                  </div>
                  {/* New Tax Bar */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="text-xs text-slate-400 mb-2 font-medium">€{Math.round(newTax / 1000)}k</div>
                    <div className="w-16 bg-gradient-to-t from-emerald-600 to-emerald-500 rounded-t-lg border border-emerald-500" 
                         style={{ height: `${Math.min(120, (newTax / 5000) * 120)}px` }}>
                    </div>
                    <span className="text-xs text-slate-400 mt-3 font-medium">2028 Tax</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-700 text-center">
                  <p className="text-xs text-slate-400">
                    <span className="font-medium">Your tax efficiency:</span> {newTax === currentTax ? 'Neutral' : newTax < currentTax ? '✓ Better in 2028' : '⚠️ Worse in 2028'}
                  </p>
                </div>
              </div>

              {/* Info Message */}
              <div className="bg-slate-900/30 rounded-lg p-3 border border-slate-700">
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">ℹ️ Notice:</strong> This is an estimation tool based on the 2028 Box 3 proposal. Actual legislation may differ. Consult a tax advisor for personalized advice.
                </p>
              </div>

              {/* Counter-Evidence Opportunity */}
              {potentialRefund > 0 && (
                <div className="bg-yellow-950/30 border border-yellow-700/50 rounded-lg p-4 mt-4">
                  <p className="text-xs text-yellow-300 leading-relaxed">
                    <strong className="text-yellow-200">💡 2024 Opportunity:</strong> You could potentially save €{Math.round(potentialRefund).toLocaleString()} by using the counter-evidence scheme if your actual returns are lower than the fictional rate.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Detailed 2028 Comparison CTA */}
          <div className="flex justify-center mb-12">
            <button
              onClick={() => setShowBox3Comparison(true)}
              className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-left">
                <span className="block text-lg">Detailed Comparison of 2028 Changes</span>
                <span className="block text-indigo-200 text-xs font-normal">See portfolio projections, FIRE impact & tax simulation side-by-side</span>
              </div>
              <svg className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          {/* Information Cards - 3 Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Box 1 - Red - The Risk */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-3">{t.infoCards.unrealizedTitle}</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                {t.infoCards.unrealizedText}
              </p>
              <div className="pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-500 italic">
                  {t.infoCards.unrealizedFooter}
                </p>
              </div>
            </div>

            {/* Box 2 - Green - The Opportunity */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-3">{t.infoCards.structureTitle}</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                {t.infoCards.structureText}
              </p>
              <div className="pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-500 italic">
                  {t.infoCards.structureFooter}
                </p>
              </div>
            </div>

            {/* Box 3 - Yellow - Smart Optimization */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-3">{t.infoCards.optimizeTitle}</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                {t.infoCards.optimizeText}
              </p>
              <div className="pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-500 italic">
                  {t.infoCards.optimizeFooter}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mb-20">
            <p className="text-slate-400 text-sm mb-6">
              {t.infoCards.ctaText}
            </p>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base px-10 py-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/50">
              {t.infoCards.ctaButton}
            </button>
          </div>

        </div>
      </div>

      {/* Different Shade Section - Navigate Your Wealth */}
      <div id="features" className="bg-slate-950/80 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-20">
          {/* New Hero Section - Navigate Your Wealth */}
          <div className="mb-12">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-5 py-2">
                <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-emerald-400 font-medium">{t.features.badge}</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {t.features.title} <span className="text-emerald-400">{t.features.titleHighlight}</span>
              </h2>
              <p className="text-slate-400 text-base max-w-4xl mx-auto leading-relaxed">
                {t.features.subtitle}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mb-16">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/50">
                {t.features.startPlan}
              </button>
              <button className="bg-transparent border-2 border-slate-600 hover:border-slate-500 text-white font-semibold text-base px-8 py-4 rounded-xl transition-all">
                {t.features.seeHow}
              </button>
            </div>

            {/* Feature Cards - 3 Column */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tax Optimization */}
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{t.features.taxOptTitle}</h4>
                <p className="text-slate-400 text-sm">
                  {t.features.taxOptText}
                </p>
              </div>

              {/* Global Portability */}
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{t.features.globalTitle}</h4>
                <p className="text-slate-400 text-sm">
                  {t.features.globalText}
                </p>
              </div>

              {/* Wealth Forecasting */}
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{t.features.forecastTitle}</h4>
                <p className="text-slate-400 text-sm">
                  {t.features.forecastText}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Features Section - Everything You Need to Engineer Freedom */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-20">
          {/* Features Badge */}
          <div className="text-center mb-6">
            <span className="text-emerald-400 text-sm font-semibold tracking-wider">{t.featuresDetail.badge}</span>
          </div>

          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {t.featuresDetail.title}
            </h2>
            <p className="text-slate-400 text-base max-w-4xl mx-auto leading-relaxed">
              {t.featuresDetail.subtitle}
            </p>
          </div>

          {/* Feature Grid - 2 Rows x 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Box 1 - Real Estate & Mortgage Strategy */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{t.featuresDetail.realEstateTitle}</h4>
              <p className="text-sm font-semibold text-emerald-400 mb-3">{t.featuresDetail.realEstateSub}</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t.featuresDetail.realEstateText}
              </p>
            </div>

            {/* Box 2 - Tax-Free Wealth Transfer */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{t.featuresDetail.wealthTransferTitle}</h4>
              <p className="text-sm font-semibold text-emerald-400 mb-3">{t.featuresDetail.wealthTransferSub}</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t.featuresDetail.wealthTransferText}
              </p>
            </div>

            {/* Box 3 - International Tax Treaties */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{t.featuresDetail.treatiesTitle}</h4>
              <p className="text-sm font-semibold text-emerald-400 mb-3">{t.featuresDetail.treatiesSub}</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t.featuresDetail.treatiesText}
              </p>
            </div>

            {/* Box 4 - Box 3 Tax Revolution */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{t.featuresDetail.box3Title}</h4>
              <p className="text-sm font-semibold text-emerald-400 mb-3">{t.featuresDetail.box3Sub}</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t.featuresDetail.box3Text}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section - Invest in Your Financial Freedom */}
      <div id="pricing" className="bg-slate-950/90">
        <div className="max-w-7xl mx-auto px-6 py-20">
          {/* Pricing Badge */}
          <div className="text-center mb-6">
            <span className="text-emerald-400 text-sm font-semibold tracking-wider">{t.pricing.badge}</span>
          </div>

          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {t.pricing.title}
            </h2>
            <p className="text-slate-400 text-base max-w-4xl mx-auto leading-relaxed">
              {t.pricing.subtitle}
            </p>
          </div>

          {/* Pricing Cards - 3 Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-2">{t.pricing.free}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">{t.pricing.freePrice}</span>
                <span className="text-slate-400 text-lg ml-2">{t.pricing.freeForever}</span>
              </div>
              <p className="text-slate-400 text-sm mb-8">
                {t.pricing.freeDesc}
              </p>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm">{t.pricing.feature1}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm">{t.pricing.feature2}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm">{t.pricing.feature3}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm">{t.pricing.feature4}</span>
                </li>
              </ul>

              <button 
                onClick={handleGetStarted}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
              >
                {t.pricing.btnGetStarted}
              </button>
            </div>

            {/* Premium Plan - Most Popular */}
            <div className="bg-slate-800/40 backdrop-blur-sm border-2 border-emerald-500 rounded-2xl p-8 relative">
              {/* Most Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-emerald-500 text-white text-sm font-semibold px-4 py-1 rounded-full flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {t.pricing.premiumBadge}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 mt-4">{t.pricing.premium}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">{t.pricing.premiumPrice}</span>
                <span className="text-slate-400 text-lg ml-2">{t.pricing.premiumTime}</span>
              </div>
              <p className="text-slate-400 text-sm mb-8">
                {t.pricing.premiumDesc}
              </p>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm">{t.pricing.feature5}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm">{t.pricing.feature6}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm">{t.pricing.feature7}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm">{t.pricing.feature8}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm">{t.pricing.feature9}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm">{t.pricing.feature10}</span>
                </li>
              </ul>

              <button 
                onClick={handleGetStarted}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/50"
              >
                {t.pricing.btnUnlock}
              </button>
            </div>

            {/* Annual Plan - Coming Soon */}
            <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 relative opacity-60">
              {/* Coming Soon Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-slate-600 text-slate-300 text-sm font-semibold px-4 py-1 rounded-full flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path strokeWidth="2" strokeLinecap="round" d="M12 6v6l4 2"/>
                  </svg>
                  {language === 'en' ? 'Coming Soon' : 'Binnenkort'}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-400 mb-2 mt-4">{t.pricing.annual}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-slate-400">{t.pricing.annualPrice}</span>
                <span className="text-slate-500 text-lg ml-2">{t.pricing.annualTime}</span>
              </div>
              <p className="text-slate-500 text-sm mb-8">
                {t.pricing.annualDesc}
              </p>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-500 text-sm">{t.pricing.feature11}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-500 text-sm">{t.pricing.feature12}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-500 text-sm">{t.pricing.feature13}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-500 text-sm">{t.pricing.feature14}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-500 text-sm">{t.pricing.feature15}</span>
                </li>
              </ul>

              <button disabled className="w-full bg-slate-700/50 text-slate-400 font-semibold py-3 px-6 rounded-xl cursor-not-allowed">
                {language === 'en' ? 'Coming Soon' : 'Binnenkort'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Privacy Section */}
      <div id="trust" className="bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-6 py-20">
          {/* Trust Badge */}
          <div className="text-center mb-6">
            <span className="text-emerald-400 text-sm font-semibold tracking-wider">{t.trust.badge}</span>
          </div>

          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {t.trust.title}
            </h2>
            <p className="text-slate-400 text-base max-w-4xl mx-auto leading-relaxed">
              {t.trust.subtitle}
            </p>
          </div>

          {/* Trust Features Grid - 2x2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* End-to-End Encryption */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{t.trust.encryptionTitle}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t.trust.encryptionText}
              </p>
            </div>

            {/* Privacy-First Architecture */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{t.trust.privacyTitle}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t.trust.privacyText}
              </p>
            </div>

            {/* GDPR Compliant */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{t.trust.gdprTitle}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t.trust.gdprText}
              </p>
            </div>

            {/* No Third-Party Sharing */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{t.trust.noShareTitle}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t.trust.noShareText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <svg className="w-7 h-7 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-lg font-bold text-white">VrijWealth</span>
            </div>

            {/* Copyright */}
            <div className="text-slate-400 text-sm text-center">
              {t.footer.copyright}
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              <button onClick={() => setShowDisclaimer(true)} className="text-slate-400 hover:text-white text-sm transition-colors">
                Disclaimer
              </button>
              <a href="#privacy" className="text-slate-400 hover:text-white text-sm transition-colors">
                {t.footer.privacy}
              </a>
              <a href="#terms" className="text-slate-400 hover:text-white text-sm transition-colors">
                {t.footer.terms}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {paymentModal}

    </div>
  )
}
