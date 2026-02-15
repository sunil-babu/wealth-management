import React, { useState } from 'react'
import { translations } from './translations'

export default function App() {
  const [language, setLanguage] = useState('en');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [preset, setPreset] = useState('growing');
  
  // Financial inputs
  const [savings, setSavings] = useState(90000);
  const [investments, setInvestments] = useState(150000);
  const [expectedReturn, setExpectedReturn] = useState(9);
  const [realEstate, setRealEstate] = useState(0);
  const [mortgage, setMortgage] = useState(0);

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

  // Calculate net worth
  const totalAssets = savings + investments + realEstate;
  const netWorth = totalAssets - mortgage;

  // Tax-free allowance
  const taxFreeAllowance = 57000;

  // Current System (2024) - Fictional Return
  const calculateCurrentTax = () => {
    const taxableBase = Math.max(0, netWorth - taxFreeAllowance);
    const fictionalReturn = 0.0624; // 6.24%
    const assumedReturn = taxableBase * fictionalReturn;
    const taxDue = assumedReturn * 0.36;
    return taxDue;
  };

  // New System (2028) - Actual Return
  const calculateNewTax = () => {
    const taxableBase = Math.max(0, netWorth - taxFreeAllowance);
    const actualReturn = expectedReturn / 100;
    const netActualReturn = taxableBase * actualReturn;
    
    if (netActualReturn <= 0) {
      return 0;
    }
    
    const taxDue = netActualReturn * 0.36;
    return taxDue;
  };

  const currentTax = calculateCurrentTax();
  const newTax = calculateNewTax();
  const difference = newTax - currentTax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Top Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xl font-bold text-white">ExitWay</span>
            </div>

            {/* Center Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-400 hover:text-white transition-colors">{t.nav.features}</a>
              <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">{t.nav.pricing}</a>
              <a href="#trust" className="text-slate-400 hover:text-white transition-colors">{t.nav.trust}</a>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-slate-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                  <span className="font-medium">{language === 'en' ? 'EN' : 'NL'}</span>
                  <svg className={`w-4 h-4 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-2 rounded-lg transition-colors">
                {t.nav.getStarted}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-12 px-6">
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
          <div className="flex items-center justify-center mb-20">
            <div className="flex items-center gap-10">
              {/* Now - Green */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-500 bg-slate-900 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/30">
                  <span className="text-emerald-500 font-bold text-lg">{t.hero.now}</span>
                </div>
                <span className="text-slate-400 text-sm font-medium">{t.hero.nowLabel}</span>
              </div>

              {/* Progress Line */}
              <div className="w-80 h-1 bg-slate-700 relative">
                <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-emerald-500 to-slate-700"></div>
              </div>

              {/* 2028 - Red */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-4 border-red-500 bg-slate-900 flex items-center justify-center mb-3 shadow-lg shadow-red-500/30">
                  <span className="text-red-500 font-bold text-lg">{t.hero.year2028}</span>
                </div>
                <span className="text-slate-400 text-sm font-medium">{t.hero.year2028Label}</span>
              </div>
            </div>
          </div>

          {/* Calculator Section - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {/* Left Card - Your Situation */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{t.calculator.yourSituation}</h3>
                  <p className="text-xs text-slate-400">{t.calculator.adjustToSee}</p>
                </div>
              </div>

              {/* Preset Tabs */}
              <div className="flex gap-2 mb-8">
                <button
                  onClick={() => applyPreset('starter')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    preset === 'starter'
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-900/50 text-slate-400 hover:bg-slate-700/50'
                  }`}
                >
                  {t.calculator.starter}
                </button>
                <button
                  onClick={() => applyPreset('growing')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    preset === 'growing'
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-900/50 text-slate-400 hover:bg-slate-700/50'
                  }`}
                >
                  {t.calculator.growing}
                </button>
                <button
                  onClick={() => applyPreset('established')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    preset === 'established'
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-900/50 text-slate-400 hover:bg-slate-700/50'
                  }`}
                >
                  {t.calculator.established}
                </button>
              </div>

              {/* Sliders */}
              <div className="space-y-8">
                {/* Savings Slider */}
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-slate-300 font-medium">{t.calculator.savings}</label>
                    <span className="text-white font-semibold">€{savings.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="5000"
                    value={savings}
                    onChange={(e) => setSavings(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-green"
                  />
                </div>

                {/* Investments Slider */}
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-slate-300 font-medium">{t.calculator.investments}</label>
                    <span className="text-white font-semibold">€{investments.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={investments}
                    onChange={(e) => setInvestments(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-green"
                  />
                </div>

                {/* Expected Actual Return Slider */}
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-slate-300 font-medium">{t.calculator.expectedReturn}</label>
                    <span className="text-white font-semibold">{expectedReturn}%</span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="20"
                    step="1"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-green"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>-10%</span>
                    <span>+20%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card - Your Tax Comparison */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">{t.calculator.yourTaxComparison}</h3>

              {/* Current System 2024 */}
              <div className="bg-slate-900/50 rounded-xl p-6 mb-4 border border-slate-700">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-300 font-medium">{t.calculator.currentSystem}</span>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/20 px-3 py-1 rounded-full">
                    {t.calculator.fictionalYield}
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  €{Math.round(currentTax).toLocaleString()}
                  <span className="text-base text-slate-400 font-normal"> {t.calculator.year}</span>
                </div>
                <p className="text-xs text-slate-400">
                  {t.calculator.basedOnFictional}
                </p>
              </div>

              {/* New System 2028 */}
              <div className="bg-slate-900/50 rounded-xl p-6 mb-6 border border-slate-700">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-300 font-medium">{t.calculator.newSystem}</span>
                  <span className="text-xs font-bold text-red-500 bg-red-500/20 px-3 py-1 rounded-full">
                    {t.calculator.actualReturns}
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  €{Math.round(newTax).toLocaleString()}
                  <span className="text-base text-slate-400 font-normal"> {t.calculator.year}</span>
                </div>
                <p className="text-xs text-slate-400">
                  {t.calculator.basedOnActual} {expectedReturn}% {t.calculator.actualReturn}
                </p>
              </div>

              {/* You'll Pay More/Less Box */}
              <div className={`rounded-xl p-6 border-2 ${
                difference > 0 ? 'bg-red-950/30 border-red-800' : 'bg-emerald-950/30 border-emerald-800'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{difference > 0 ? '📈' : '📉'}</span>
                  <span className="text-white font-semibold">{difference > 0 ? t.calculator.youllPayMore : t.calculator.youllPayLess}</span>
                </div>
                <div className={`text-3xl font-bold mb-2 ${difference > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {difference > 0 ? '+' : ''}€{Math.abs(Math.round(difference)).toLocaleString()}
                  <span className="text-base text-slate-400 font-normal"> {t.calculator.year}</span>
                </div>
                
                {/* 10 Year Projection */}
                {difference > 0 && (
                  <div className="mt-4 pt-4 border-t border-red-800/50">
                    <p className="text-sm text-red-300">
                      {t.calculator.over10Years} <span className="font-bold text-red-400">€{Math.abs(Math.round(difference * 10)).toLocaleString()}</span>.
                    </p>
                  </div>
                )}
              </div>

              {/* Info Message */}
              <div className="mt-6 flex gap-3 bg-slate-900/30 rounded-lg p-4 border border-slate-700">
                <span className="text-emerald-500 text-xl">⚡</span>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {difference > 0 ? t.calculator.infoMore : t.calculator.infoLess}
                </p>
              </div>
            </div>
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

              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all">
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

              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/50">
                {t.pricing.btnUnlock}
              </button>
            </div>

            {/* Annual Plan */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-2">{t.pricing.annual}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">{t.pricing.annualPrice}</span>
                <span className="text-slate-400 text-lg ml-2">{t.pricing.annualTime}</span>
              </div>
              <p className="text-slate-400 text-sm mb-8">
                {t.pricing.annualDesc}
              </p>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm">{t.pricing.feature11}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm">{t.pricing.feature12}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm">{t.pricing.feature13}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm">{t.pricing.feature14}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm">{t.pricing.feature15}</span>
                </li>
              </ul>

              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all">
                {t.pricing.btnSubscribe}
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
              <span className="text-lg font-bold text-white">ExitWay</span>
            </div>

            {/* Copyright */}
            <div className="text-slate-400 text-sm text-center">
              {t.footer.copyright}
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
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

    </div>
  )
}
