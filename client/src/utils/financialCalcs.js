/**
 * Shared financial calculation helpers used across basic analysis and PDF generation.
 * Centralises the Dutch FIRE / Box 3 formulas so they stay in sync.
 */

/** Standard Dutch inflation assumption (2.2 %) */
export const INFLATION_RATE = 0.022;

/** Full AOW monthly benefit in EUR */
export const FULL_AOW_MONTHLY = 1637;

/** Safe Withdrawal Rate */
export const SWR = 0.04;

/**
 * Compute commonly-needed FIRE & tax values from raw form data.
 * Returns a flat object of derived values — no mutation.
 */
export function computeDerivedValues(formData) {
  const age = parseInt(formData.age) || 30;
  const aowPct = Math.max(0, Math.min(100, (50 - formData.yearsAbroad) * 2));
  const aowShortfall = Math.round((1 - aowPct / 100) * FULL_AOW_MONTHLY);
  const aowMonthly = Math.round(FULL_AOW_MONTHLY * aowPct / 100);
  const yearsInNL = 50 - formData.yearsAbroad;

  const equity = formData.propertyValue - formData.mortgageBalance;
  const netWealth = formData.savingsBalance + formData.cryptoValueDec31 + formData.propertyValue - formData.mortgageBalance;

  const p3Room = formData.jaarruimte + formData.reserveringsruimte;
  const p3RefundLow = Math.round(p3Room * 0.37);
  const p3RefundHigh = Math.round(p3Room * 0.495);

  const bridgeYrs = Math.max(0, Math.round((67.25 - formData.targetRetirementAge) * 10) / 10);
  const bridgeCost = Math.round(bridgeYrs * 12 * formData.desiredMonthlyIncome);

  const stockValue = formData.cryptoValueDec31 + (formData.investmentAmount || 0);
  const totalBox3 = formData.savingsBalance + formData.cryptoValueDec31;

  const fictitiousTax = Math.max(
    0,
    Math.round(
      0.36 * (stockValue * 0.06 + formData.savingsBalance * 0.0144)
      - (formData.hasSpouse ? 114000 : 57000) * 0.0144 * 0.36,
    ),
  );

  const p2Monthly = Math.round(formData.builtUpPension / 12);
  const p2Coverage = formData.desiredMonthlyIncome > 0
    ? Math.min(100, Math.round((p2Monthly / formData.desiredMonthlyIncome) * 100))
    : 0;

  const yearsToFire = Math.max(0, formData.targetRetirementAge - age);
  const inflationMultiplier = Math.pow(1 + INFLATION_RATE, yearsToFire);
  const futureMonthlyNeed = Math.round(formData.desiredMonthlyIncome * inflationMultiplier);
  const futureBridgeCost = Math.round(bridgeYrs * 12 * futureMonthlyNeed);
  const retirementYears = formData.lifeExpectancy - formData.targetRetirementAge;

  const arrivalAge = formData.arrivalAgeNL || (age - yearsInNL);

  const taxLeakAnnual = fictitiousTax;
  const isWealthLeaking = taxLeakAnnual > 2000;

  return {
    age,
    aowPct,
    aowShortfall,
    aowMonthly,
    yearsInNL,
    equity,
    netWealth,
    p3Room,
    p3RefundLow,
    p3RefundHigh,
    bridgeYrs,
    bridgeCost,
    stockValue,
    totalBox3,
    fictitiousTax,
    p2Monthly,
    p2Coverage,
    yearsToFire,
    inflationMultiplier,
    futureMonthlyNeed,
    futureBridgeCost,
    retirementYears,
    arrivalAge,
    taxLeakAnnual,
    isWealthLeaking,
  };
}
