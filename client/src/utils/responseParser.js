/**
 * Parse the structured AI response text into metrics, actions, tax data, and products.
 * Extracted from App.jsx for maintainability.
 */

/**
 * @typedef {Object} ParsedResponse
 * @property {Object} metrics - { monthlyNeed, targetNestEgg, gapToFill, monthlySavingsTarget }
 * @property {Object} allocation - { stocks, bonds, realEstate, cash }
 * @property {Object} projection - { currentWealth, projectedAtRetirement, targetNestEgg }
 * @property {Array}  actionSteps - [{ title, priority, tag, description }]
 * @property {Object} dutchTax - { box3Strategy, pensionRecommendations, estimatedAnnualTax }
 * @property {Array}  products - [{ name, type, description }]
 * @property {string} strategyText - Remaining non-parsed text
 * @property {boolean} foundMetrics - Whether any structured data was found
 */

/**
 * Parse the raw AI response text into structured data objects.
 * @param {string} responseText - The raw text from Gemini.
 * @returns {ParsedResponse}
 */
export function parseAiResponse(responseText) {
  const metrics = { monthlyNeed: 0, targetNestEgg: 0, gapToFill: 0, monthlySavingsTarget: 0 };
  const allocation = { stocks: 0, bonds: 0, realEstate: 0, cash: 0 };
  const projection = { currentWealth: 0, projectedAtRetirement: 0, targetNestEgg: 0 };
  const actionSteps = [];
  const dutchTax = { box3Strategy: '', pensionRecommendations: '', estimatedAnnualTax: 0 };
  const products = [];

  const lines = responseText.split('\n');
  const strategyLines = [];
  let foundMetrics = false;

  let currentMultiLineField = null;
  let currentMultiLineValue = '';

  /** Save any pending multi-line field */
  function flushMultiLine() {
    if (!currentMultiLineField) return;
    if (currentMultiLineField === 'box3Strategy') {
      dutchTax.box3Strategy = currentMultiLineValue.trim();
    } else if (currentMultiLineField === 'pensionRecommendations') {
      dutchTax.pensionRecommendations = currentMultiLineValue.trim();
    }
    currentMultiLineField = null;
    currentMultiLineValue = '';
  }

  /** Try to parse a number from a matched regex group, stripping currency symbols & commas */
  function parseNum(match) {
    return match ? parseInt(match.replace(/[,\.]/g, '')) : 0;
  }

  for (const line of lines) {
    const trimmed = line.trim();

    // Section separators
    if (trimmed.match(/^-{2,}(ACTIONS|DUTCH_TAX|PRODUCTS)?-{0,}$/)) {
      flushMultiLine();
      continue;
    }

    // Strip markdown bold & leading bullets for key matching
    const clean = trimmed.replace(/\*\*/g, '').replace(/^[-•*]\s*/, '').trim();

    // ── Metrics ──
    let m;
    if ((m = clean.match(/^MONTHLY_NEED:?\s*[€$]?([\d,\.]+)/i))) { metrics.monthlyNeed = parseNum(m[1]); foundMetrics = true; continue; }
    if ((m = clean.match(/^TARGET_NEST_EGG:?\s*[€$]?([\d,\.]+)/i))) { metrics.targetNestEgg = parseNum(m[1]); foundMetrics = true; continue; }
    if ((m = clean.match(/^GAP_TO_FILL:?\s*[€$]?([\d,\.]+)/i))) { metrics.gapToFill = parseNum(m[1]); foundMetrics = true; continue; }
    if ((m = clean.match(/^MONTHLY_SAVINGS_TARGET:?\s*[€$]?([\d,\.]+)/i))) { metrics.monthlySavingsTarget = parseNum(m[1]); foundMetrics = true; continue; }

    // ── Allocation ──
    if ((m = clean.match(/^ALLOCATION_STOCKS:?\s*(\d+)%?/i))) { allocation.stocks = parseInt(m[1]); foundMetrics = true; continue; }
    if ((m = clean.match(/^ALLOCATION_BONDS:?\s*(\d+)%?/i))) { allocation.bonds = parseInt(m[1]); foundMetrics = true; continue; }
    if ((m = clean.match(/^ALLOCATION_REAL_ESTATE:?\s*(\d+)%?/i))) { allocation.realEstate = parseInt(m[1]); foundMetrics = true; continue; }
    if ((m = clean.match(/^ALLOCATION_CASH:?\s*(\d+)%?/i))) { allocation.cash = parseInt(m[1]); foundMetrics = true; continue; }

    // ── Projection ──
    if ((m = clean.match(/^CURRENT_WEALTH:?\s*[€$]?([\d,\.]+)/i))) { projection.currentWealth = parseNum(m[1]); foundMetrics = true; continue; }
    if ((m = clean.match(/^PROJECTED_AT_RETIREMENT:?\s*[€$]?([\d,\.]+)/i))) { projection.projectedAtRetirement = parseNum(m[1]); foundMetrics = true; continue; }

    // ── Action Steps ──
    if (clean.match(/^ACTION_STEP_/i)) {
      const sm = clean.match(/ACTION_STEP_(\d+)_(TITLE|PRIORITY|TAG|DESC):?\s*(.+)/i);
      if (sm) {
        const idx = parseInt(sm[1]) - 1;
        const field = sm[2].toLowerCase();
        if (!actionSteps[idx]) actionSteps[idx] = { title: '', priority: '', tag: '', description: '' };
        if (field === 'title') actionSteps[idx].title = sm[3].trim();
        else if (field === 'priority') actionSteps[idx].priority = sm[3].trim();
        else if (field === 'tag') actionSteps[idx].tag = sm[3].trim();
        else if (field === 'desc') actionSteps[idx].description = sm[3].trim();
      }
      foundMetrics = true;
      continue;
    }

    // ── Dutch Tax (multi-line fields) ──
    if (clean.match(/^BOX3_STRATEGY[:\s]/i)) {
      flushMultiLine();
      const val = clean.match(/BOX3_STRATEGY:?\s*(.+)/i);
      currentMultiLineField = 'box3Strategy';
      currentMultiLineValue = val?.[1]?.trim() || '';
      foundMetrics = true;
      continue;
    }
    if (clean.match(/^PENSION_RECOMMENDATIONS[:\s]/i)) {
      flushMultiLine();
      const val = clean.match(/PENSION_RECOMMENDATIONS:?\s*(.+)/i);
      currentMultiLineField = 'pensionRecommendations';
      currentMultiLineValue = val?.[1]?.trim() || '';
      foundMetrics = true;
      continue;
    }
    if ((m = clean.match(/^ESTIMATED_ANNUAL_BOX3_TAX:?\s*[€$]?([\d,\.]+)/i))) {
      flushMultiLine();
      dutchTax.estimatedAnnualTax = parseNum(m[1]);
      foundMetrics = true;
      continue;
    }

    // ── Products ──
    if (clean.match(/^PRODUCT_/i)) {
      flushMultiLine();
      const pm = clean.match(/PRODUCT_(\d+)_(NAME|TYPE|DESC):?\s*(.+)/i);
      if (pm) {
        const idx = parseInt(pm[1]) - 1;
        const field = pm[2].toLowerCase();
        if (!products[idx]) products[idx] = { name: '', type: '', description: '' };
        if (field === 'name') products[idx].name = pm[3].trim();
        else if (field === 'type') products[idx].type = pm[3].trim();
        else if (field === 'desc') products[idx].description = pm[3].trim();
      }
      foundMetrics = true;
      continue;
    }

    // Collect multi-line value continuation
    if (currentMultiLineField && trimmed) {
      currentMultiLineValue += ' ' + trimmed;
      continue;
    }

    // Everything else → strategy text
    if (trimmed) strategyLines.push(line);
  }

  flushMultiLine();
  projection.targetNestEgg = metrics.targetNestEgg;

  return {
    metrics,
    allocation,
    projection,
    actionSteps: actionSteps.filter(s => s?.title),
    dutchTax,
    products: products.filter(p => p?.name),
    strategyText: strategyLines.join('\n').trim(),
    foundMetrics,
  };
}

/**
 * Apply age-based fallback allocation when AI didn't provide one.
 */
export function fallbackAllocation(age) {
  const stocks = Math.max(20, Math.min(80, 110 - age));
  const bonds = Math.round((100 - stocks) * 0.5);
  const realEstate = Math.round((100 - stocks) * 0.3);
  const cash = 100 - stocks - bonds - realEstate;
  return { stocks, bonds, realEstate, cash };
}

/**
 * Fill in missing metrics using form data as fallback.
 */
export function applyMetricFallbacks(metrics, projection, formData) {
  const m = { ...metrics };
  const p = { ...projection };

  if (m.monthlyNeed === 0 && formData.desiredMonthlyIncome > 0) {
    m.monthlyNeed = parseInt(formData.desiredMonthlyIncome);
  }
  if (m.targetNestEgg === 0 && formData.desiredMonthlyIncome > 0) {
    m.targetNestEgg = Math.round(formData.desiredMonthlyIncome * 12 / 0.04);
    p.targetNestEgg = m.targetNestEgg;
  }
  if (p.currentWealth === 0) {
    p.currentWealth = formData.savingsBalance + formData.cryptoValueDec31 + formData.propertyValue - formData.mortgageBalance;
  }
  if (m.gapToFill === 0 && m.targetNestEgg > 0) {
    m.gapToFill = Math.max(0, m.targetNestEgg - p.currentWealth);
  }
  if (m.monthlySavingsTarget === 0 && m.gapToFill > 0) {
    const yrsLeft = Math.max(1, (formData.targetRetirementAge || 65) - (parseInt(formData.age) || 30));
    m.monthlySavingsTarget = Math.round(m.gapToFill / (yrsLeft * 12));
  }

  return { metrics: m, projection: p };
}
