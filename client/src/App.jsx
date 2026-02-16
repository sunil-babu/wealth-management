import React, { useState, useEffect } from 'react'
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
  
  // Form data
  const [formData, setFormData] = useState({
    // Household
    fullName: '',
    age: 30,
    retirementAge: 67,
    country: 'Netherlands',
    hasSpouse: false,
    hasChildren: false,
    childrenCount: 0,
    // Financials
    grossSalary: 60000,
    has30PercentRuling: false,
    savingsAmount: 90000,
    investmentAmount: 150000,
    debtAmount: 0,
    // Dutch Tax
    jaarruimte: 0,
    factorA: 0,
    // Real Estate
    homeValue: 0,
    mortgageBalance: 0,
    mortgageInterestRate: 0,
    mortgageYearsLeft: 0
  });

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

  // Form handling
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      if (formData.savingsAmount === '' || formData.savingsAmount === null || formData.savingsAmount === undefined) {
        errors.savingsAmount = 'Savings amount is required (can be 0)';
      }
      if (formData.investmentAmount === '' || formData.investmentAmount === null || formData.investmentAmount === undefined) {
        errors.investmentAmount = 'Investment amount is required (can be 0)';
      }
      if (formData.debtAmount === '' || formData.debtAmount === null || formData.debtAmount === undefined) {
        errors.debtAmount = 'Debt amount is required (can be 0)';
      }
    } else if (step === 'dutchTax') {
      if (formData.jaarruimte === '' || formData.jaarruimte === null || formData.jaarruimte === undefined) {
        errors.jaarruimte = 'Jaarruimte is required (can be 0)';
      }
      if (formData.factorA === '' || formData.factorA === null || formData.factorA === undefined) {
        errors.factorA = 'Factor A is required (can be 0)';
      }
    } else if (step === 'realEstate') {
      if (formData.homeValue === '' || formData.homeValue === null || formData.homeValue === undefined) {
        errors.homeValue = 'Home value is required (can be 0)';
      }
      if (formData.mortgageBalance === '' || formData.mortgageBalance === null || formData.mortgageBalance === undefined) {
        errors.mortgageBalance = 'Mortgage balance is required (can be 0)';
      }
      if (formData.mortgageInterestRate === '' || formData.mortgageInterestRate === null || formData.mortgageInterestRate === undefined) {
        errors.mortgageInterestRate = 'Interest rate is required (can be 0)';
      }
      if (formData.mortgageYearsLeft === '' || formData.mortgageYearsLeft === null || formData.mortgageYearsLeft === undefined) {
        errors.mortgageYearsLeft = 'Years left is required (can be 0)';
      }
    }
    
    return errors;
  };

  const handleGetStarted = () => {
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
      setCurrentStep('dutchTax');
    } else if (currentStep === 'dutchTax') {
      setCurrentStep('realEstate');
    } else if (currentStep === 'realEstate') {
      // Submit to Vertex AI
      await submitToVertexAI();
    }
  };

  const handleBack = () => {
    if (currentStep === 'financials') {
      setCurrentStep('household');
    } else if (currentStep === 'dutchTax') {
      setCurrentStep('financials');
    } else if (currentStep === 'realEstate') {
      setCurrentStep('dutchTax');
    }
  };

  const submitToVertexAI = async () => {
    // Calculate total Box 3 assets
    const totalBox3Assets = formData.savingsAmount + formData.investmentAmount - formData.debtAmount;
    const taxFreeAllowance = formData.hasSpouse ? 114000 : 57000; // 2026 allowance
    const taxableBase = Math.max(0, totalBox3Assets - taxFreeAllowance);

    const prompt = `You are a Dutch FIRE expert. Analyze this profile and provide tax-optimized wealth strategy.

PROFILE:
Age: ${formData.age} → Retire: ${formData.retirementAge} | ${formData.hasSpouse ? 'Partnered' : 'Single'}${formData.hasChildren ? `, ${formData.childrenCount} kids` : ''} | Salary: €${formData.grossSalary} | 30% Ruling: ${formData.has30PercentRuling ? 'Yes' : 'No'}
Box 3: Savings €${formData.savingsAmount}, Investments €${formData.investmentAmount}, Debt €${formData.debtAmount} (Net: €${totalBox3Assets}, Taxable: €${taxableBase})
Real Estate: WOZ €${formData.homeValue}, Mortgage €${formData.mortgageBalance} @ ${formData.mortgageInterestRate}%, ${formData.mortgageYearsLeft}yr left
Tax: Jaarruimte €${formData.jaarruimte}, Factor A €${formData.factorA}

OUTPUT (exact format):
MONTHLY_NEED: [number]
TARGET_NEST_EGG: [number]
GAP_TO_FILL: [number]
MONTHLY_SAVINGS_TARGET: [number]
ALLOCATION_STOCKS: [0-100]
ALLOCATION_BONDS: [0-100]
ALLOCATION_REAL_ESTATE: [0-100]
ALLOCATION_CASH: [0-100]
CURRENT_WEALTH: ${formData.savingsAmount + formData.investmentAmount - formData.debtAmount}
PROJECTED_AT_RETIREMENT: [number]
---ACTIONS---
ACTION_STEP_1_TITLE: [title]
ACTION_STEP_1_PRIORITY: [High Priority|Medium Priority|Low Priority]
ACTION_STEP_1_TAG: [NL Tax|Strategy|Tax Hack]
ACTION_STEP_1_DESC: [one sentence]
ACTION_STEP_2_TITLE: [title]
ACTION_STEP_2_PRIORITY: [High Priority|Medium Priority|Low Priority]
ACTION_STEP_2_TAG: [NL Tax|Strategy|Tax Hack]
ACTION_STEP_2_DESC: [one sentence]
ACTION_STEP_3_TITLE: [title]
ACTION_STEP_3_PRIORITY: [High Priority|Medium Priority|Low Priority]
ACTION_STEP_3_TAG: [NL Tax|Strategy|Tax Hack]
ACTION_STEP_3_DESC: [one sentence]
---DUTCH_TAX---
BOX3_STRATEGY: [2-3 sentences on Box 3 optimization with 2026 rates]
PENSION_RECOMMENDATIONS: [2-3 sentences on jaarruimte/lijfrente]
ESTIMATED_ANNUAL_BOX3_TAX: [number]
---PRODUCTS---
PRODUCT_1_NAME: [fund name]
PRODUCT_1_TYPE: [ETF|Fund]
PRODUCT_1_DESC: [one sentence]
PRODUCT_2_NAME: [fund name]
PRODUCT_2_TYPE: [ETF|Fund]
PRODUCT_2_DESC: [one sentence]
---

Then write a brief strategic summary in ONE paragraph (max 150 words):
Focus on the most critical insight - either the biggest opportunity they're missing or the most impactful quick win. Mention specific Dutch tax terms (Box 3, jaarruimte, lijfrente) if relevant. Keep it actionable and motivating.`;

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
        
        // Parse based on current section
        if (currentSection === 'metrics' || currentSection === 'actions' || currentSection === 'dutch_tax' || currentSection === 'products') {
          // Check if this is a metric line
          if (trimmedLine.startsWith('MONTHLY_NEED:')) {
            const match = trimmedLine.match(/MONTHLY_NEED:\s*€?([\d,]+)/i);
            if (match) metricsParsed.monthlyNeed = parseInt(match[1].replace(/,/g, ''));
            foundMetrics = true;
            continue;
          } else if (trimmedLine.startsWith('TARGET_NEST_EGG:')) {
            const match = trimmedLine.match(/TARGET_NEST_EGG:\s*€?([\d,]+)/i);
            if (match) metricsParsed.targetNestEgg = parseInt(match[1].replace(/,/g, ''));
            foundMetrics = true;
            continue;
          } else if (trimmedLine.startsWith('GAP_TO_FILL:')) {
            const match = trimmedLine.match(/GAP_TO_FILL:\s*€?([\d,]+)/i);
            if (match) metricsParsed.gapToFill = parseInt(match[1].replace(/,/g, ''));
            foundMetrics = true;
            continue;
          } else if (trimmedLine.startsWith('MONTHLY_SAVINGS_TARGET:')) {
            const match = trimmedLine.match(/MONTHLY_SAVINGS_TARGET:\s*€?([\d,]+)/i);
            if (match) metricsParsed.monthlySavingsTarget = parseInt(match[1].replace(/,/g, ''));
            foundMetrics = true;
            continue;
          } else if (trimmedLine.startsWith('ALLOCATION_STOCKS:')) {
            const match = trimmedLine.match(/ALLOCATION_STOCKS:\s*(\d+)/i);
            if (match) allocationParsed.stocks = parseInt(match[1]);
            foundMetrics = true;
            continue;
          } else if (trimmedLine.startsWith('ALLOCATION_BONDS:')) {
            const match = trimmedLine.match(/ALLOCATION_BONDS:\s*(\d+)/i);
            if (match) allocationParsed.bonds = parseInt(match[1]);
            foundMetrics = true;
            continue;
          } else if (trimmedLine.startsWith('ALLOCATION_REAL_ESTATE:')) {
            const match = trimmedLine.match(/ALLOCATION_REAL_ESTATE:\s*(\d+)/i);
            if (match) allocationParsed.realEstate = parseInt(match[1]);
            foundMetrics = true;
            continue;
          } else if (trimmedLine.startsWith('ALLOCATION_CASH:')) {
            const match = trimmedLine.match(/ALLOCATION_CASH:\s*(\d+)/i);
            if (match) allocationParsed.cash = parseInt(match[1]);
            foundMetrics = true;
            continue;
          } else if (trimmedLine.startsWith('CURRENT_WEALTH:')) {
            const match = trimmedLine.match(/CURRENT_WEALTH:\s*€?([\d,]+)/i);
            if (match) projectionParsed.currentWealth = parseInt(match[1].replace(/,/g, ''));
            foundMetrics = true;
            continue;
          } else if (trimmedLine.startsWith('PROJECTED_AT_RETIREMENT:')) {
            const match = trimmedLine.match(/PROJECTED_AT_RETIREMENT:\s*€?([\d,]+)/i);
            if (match) projectionParsed.projectedAtRetirement = parseInt(match[1].replace(/,/g, ''));
            foundMetrics = true;
            continue;
          } else if (trimmedLine.startsWith('ACTION_STEP_')) {
            const stepMatch = trimmedLine.match(/ACTION_STEP_(\d+)_(TITLE|PRIORITY|TAG|DESC):\s*(.+)/i);
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
          } else if (trimmedLine.startsWith('BOX3_STRATEGY:')) {
            // Save any pending multi-line field
            if (currentMultiLineField) {
              if (currentMultiLineField === 'box3Strategy') dutchTaxParsed.box3Strategy = currentMultiLineValue.trim();
              else if (currentMultiLineField === 'pensionRecommendations') dutchTaxParsed.pensionRecommendations = currentMultiLineValue.trim();
            }
            
            const match = trimmedLine.match(/BOX3_STRATEGY:\s*(.+)/i);
            currentMultiLineField = 'box3Strategy';
            currentMultiLineValue = match && match[1] ? match[1].trim() : '';
            foundMetrics = true;
            continue;
          } else if (trimmedLine.startsWith('PENSION_RECOMMENDATIONS:')) {
            // Save any pending multi-line field
            if (currentMultiLineField) {
              if (currentMultiLineField === 'box3Strategy') dutchTaxParsed.box3Strategy = currentMultiLineValue.trim();
              else if (currentMultiLineField === 'pensionRecommendations') dutchTaxParsed.pensionRecommendations = currentMultiLineValue.trim();
            }
            
            const match = trimmedLine.match(/PENSION_RECOMMENDATIONS:\s*(.+)/i);
            currentMultiLineField = 'pensionRecommendations';
            currentMultiLineValue = match && match[1] ? match[1].trim() : '';
            foundMetrics = true;
            continue;
          } else if (trimmedLine.startsWith('ESTIMATED_ANNUAL_BOX3_TAX:')) {
            // Save any pending multi-line field
            if (currentMultiLineField) {
              if (currentMultiLineField === 'box3Strategy') dutchTaxParsed.box3Strategy = currentMultiLineValue.trim();
              else if (currentMultiLineField === 'pensionRecommendations') dutchTaxParsed.pensionRecommendations = currentMultiLineValue.trim();
              currentMultiLineField = null;
              currentMultiLineValue = '';
            }
            
            const match = trimmedLine.match(/ESTIMATED_ANNUAL_BOX3_TAX:\s*€?([\d,]+)/i);
            if (match) dutchTaxParsed.estimatedAnnualTax = parseInt(match[1].replace(/,/g, ''));
            foundMetrics = true;
            continue;
          } else if (trimmedLine.startsWith('PRODUCT_')) {
            // Save any pending multi-line field
            if (currentMultiLineField) {
              if (currentMultiLineField === 'box3Strategy') dutchTaxParsed.box3Strategy = currentMultiLineValue.trim();
              else if (currentMultiLineField === 'pensionRecommendations') dutchTaxParsed.pensionRecommendations = currentMultiLineValue.trim();
              currentMultiLineField = null;
              currentMultiLineValue = '';
            }
            
            const prodMatch = trimmedLine.match(/PRODUCT_(\d+)_(NAME|TYPE|DESC):\s*(.+)/i);
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
          } else if (currentMultiLineField && trimmedLine && currentSection === 'dutch_tax') {
            // Continue collecting multi-line value for Dutch Tax fields
            currentMultiLineValue += ' ' + trimmedLine;
            continue;
          }
          
          // If we're in a structured section but this line doesn't match any pattern,
          // save any pending multi-line field and check if we should switch to strategy mode
          if (currentMultiLineField) {
            if (currentMultiLineField === 'box3Strategy') dutchTaxParsed.box3Strategy = currentMultiLineValue.trim();
            else if (currentMultiLineField === 'pensionRecommendations') dutchTaxParsed.pensionRecommendations = currentMultiLineValue.trim();
            currentMultiLineField = null;
            currentMultiLineValue = '';
          }
          
          if (currentSection !== 'strategy' && trimmedLine && 
              !trimmedLine.match(/^(MONTHLY_NEED|TARGET_NEST_EGG|GAP_TO_FILL|MONTHLY_SAVINGS_TARGET|ALLOCATION_|CURRENT_WEALTH|PROJECTED_AT_RETIREMENT|ACTION_STEP_|BOX3_STRATEGY|PENSION_RECOMMENDATIONS|ESTIMATED_ANNUAL_BOX3_TAX|PRODUCT_)/i)) {
            currentSection = 'strategy';
          }
        }
        
        // Add to strategy text if we're in the strategy section
        // Skip lines that look like structured data patterns
        if (currentSection === 'strategy' && trimmedLine) {
          // Don't add lines that are structured data patterns
          if (!trimmedLine.match(/^(MONTHLY_NEED|TARGET_NEST_EGG|GAP_TO_FILL|MONTHLY_SAVINGS_TARGET|ALLOCATION_|CURRENT_WEALTH|PROJECTED_AT_RETIREMENT|ACTION_STEP|BOX3_STRATEGY|PENSION_RECOMMENDATIONS|ESTIMATED_ANNUAL_BOX3_TAX|PRODUCT_)/i)) {
            strategyLines.push(line);
          }
        }
      }
      
      // Save any pending multi-line field at the end
      if (currentMultiLineField) {
        if (currentMultiLineField === 'box3Strategy') dutchTaxParsed.box3Strategy = currentMultiLineValue.trim();
        else if (currentMultiLineField === 'pensionRecommendations') dutchTaxParsed.pensionRecommendations = currentMultiLineValue.trim();
      }
      
      // Join strategy lines and clean up
      let strategyText = strategyLines.join('\n').trim();
      
      // Set target nest egg in projection
      projectionParsed.targetNestEgg = metricsParsed.targetNestEgg;
      
      // Calculate current wealth from form data if not provided by AI
      if (projectionParsed.currentWealth === 0) {
        projectionParsed.currentWealth = formData.savingsAmount + formData.investmentAmount - formData.debtAmount;
      }
      
      // If no metrics were found, use form data for current wealth as fallback
      if (!foundMetrics) {
        projectionParsed.currentWealth = formData.savingsAmount + formData.investmentAmount - formData.debtAmount;
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

  // Comparison Page UI
  if (showComparison) {
    return (
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
                        Money invested in a primary home is not subject to the heavy Box 3 wealth tax, which in 2026 assumes a high fictitious return of <strong className="text-white">7.78%</strong> on investments. Moving "taxable" wealth into a "tax-free" home can save you thousands annually.
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
                        If your actual investment returns in 2026 are lower than the government's assumed 7.78%, the PDF explains how to file for a tax reduction based on your real results.
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
                        Recommends shifting "Other Assets" into "Savings" before the October 1st cut-off to benefit from lower fictitious return rates (~1.44% vs 7.78%).
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
              <button className="bg-white hover:bg-emerald-50 text-emerald-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-lg">
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
    );
  }

  // Results Page UI
  if (showResults) {
    return (
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
                    onClick={() => setShowComparison(true)}
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

          {/* Personalized Strategy Section */}
          <div className="bg-slate-800 rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12 border border-slate-700">
            <div className="flex items-start gap-3 mb-6">
              <span className="text-2xl">💡</span>
              <h2 className="text-white text-xl sm:text-2xl font-bold">Your Personalized Strategy</h2>
            </div>
            
            <div className="prose prose-invert prose-slate max-w-none">
              <div className="text-slate-300 leading-relaxed text-sm sm:text-base space-y-4">
                {aiResponse.split('\n').map((line, index) => {
                  const trimmed = line.trim();
                  
                  // Skip empty lines
                  if (!trimmed) {
                    return <div key={index} className="h-2"></div>;
                  }
                  
                  // Skip any structured data patterns that might have slipped through
                  if (trimmed.match(/^(MONTHLY_NEED|TARGET_NEST_EGG|GAP_TO_FILL|MONTHLY_SAVINGS_TARGET|ALLOCATION_|CURRENT_WEALTH|PROJECTED_AT_RETIREMENT|ACTION_STEP|BOX3_STRATEGY|PENSION_RECOMMENDATIONS|ESTIMATED_ANNUAL_BOX3_TAX|PRODUCT_)/i)) {
                    return null;
                  }
                  
                  // Handle ### markdown headings
                  if (trimmed.startsWith('###')) {
                    const heading = trimmed.replace(/^###\s*/, '').replace(/\*\*/g, '').replace(/:/g, '');
                    return (
                      <h3 key={index} className="text-emerald-400 font-bold text-lg sm:text-xl mt-6 mb-3 first:mt-0">
                        {heading}
                      </h3>
                    );
                  }
                  
                  // Handle ## markdown headings
                  if (trimmed.startsWith('##')) {
                    const heading = trimmed.replace(/^##\s*/, '').replace(/\*\*/g, '').replace(/:/g, '');
                    return (
                      <h2 key={index} className="text-emerald-400 font-bold text-xl sm:text-2xl mt-6 mb-3 first:mt-0">
                        {heading}
                      </h2>
                    );
                  }
                  
                  // Handle bold headings with ** markers
                  if (trimmed.startsWith('**') && (trimmed.includes(':**') || trimmed.endsWith('**'))) {
                    const heading = trimmed.replace(/\*\*/g, '').replace(/:/g, '');
                    return (
                      <h3 key={index} className="text-emerald-400 font-bold text-lg sm:text-xl mt-6 mb-3 first:mt-0">
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
                        <span className="flex-1">{formattedText}</span>
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
                        <span className="text-emerald-400 mt-1">•</span>
                        <span className="flex-1">{formattedText}</span>
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
                    Given your age ({formData.age}) and {formData.retirementAge - formData.age}-year investment horizon, 
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
                onClick={() => setCurrentStep('dutchTax')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentStep === 'dutchTax' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Dutch Tax</span>
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
                  <div className={`w-2 h-2 rounded-full ${currentStep === 'dutchTax' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                  <div className={`w-2 h-2 rounded-full ${currentStep === 'realEstate' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
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
                        className={`w-full bg-slate-800 border ${validationErrors.fullName ? 'border-red-500' : 'border-slate-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                      />
                      {validationErrors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Age</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => updateFormData('age', Number(e.target.value))}
                        className={`w-full bg-slate-800 border ${validationErrors.age ? 'border-red-500' : 'border-slate-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                      />
                      {validationErrors.age && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.age}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Target Retirement Age</label>
                      <input
                        type="number"
                        value={formData.retirementAge}
                        onChange={(e) => updateFormData('retirementAge', Number(e.target.value))}
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
                          type="number"
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
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Financial Overview</h1>
                  <p className="text-slate-400 mb-8 sm:mb-12">Tell us about your income and assets.</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Annual Gross Salary (Box 1)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-slate-400">€</span>
                        <input
                          type="number"
                          value={formData.grossSalary}
                          onChange={(e) => updateFormData('grossSalary', Number(e.target.value))}
                          className={`w-full bg-slate-800 border ${validationErrors.grossSalary ? 'border-red-500' : 'border-slate-700'} text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                        />
                      </div>
                      {validationErrors.grossSalary && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.grossSalary}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between py-4 border-t border-b border-slate-700">
                      <div>
                        <span className="text-white font-medium block">30% Ruling Status</span>
                        <span className="text-slate-400 text-sm">Are you eligible for the 30% ruling?</span>
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

                    <div>
                      <label className="block text-white font-medium mb-2">Savings / Bank Balance (Box 3)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-slate-400">€</span>
                        <input
                          type="number"
                          value={formData.savingsAmount}
                          onChange={(e) => updateFormData('savingsAmount', Number(e.target.value))}
                          className={`w-full bg-slate-800 border ${validationErrors.savingsAmount ? 'border-red-500' : 'border-slate-700'} text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                        />
                      </div>
                      {validationErrors.savingsAmount && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.savingsAmount}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Investments (Stocks, ETFs, Crypto)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-slate-400">€</span>
                        <input
                          type="number"
                          value={formData.investmentAmount}
                          onChange={(e) => updateFormData('investmentAmount', Number(e.target.value))}
                          className={`w-full bg-slate-800 border ${validationErrors.investmentAmount ? 'border-red-500' : 'border-slate-700'} text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                        />
                      </div>
                      {validationErrors.investmentAmount && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.investmentAmount}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Total Debt (Non-Mortgage)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-slate-400">€</span>
                        <input
                          type="number"
                          value={formData.debtAmount}
                          onChange={(e) => updateFormData('debtAmount', Number(e.target.value))}
                          className={`w-full bg-slate-800 border ${validationErrors.debtAmount ? 'border-red-500' : 'border-slate-700'} text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                        />
                      </div>
                      {validationErrors.debtAmount && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.debtAmount}</p>
                      )}
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

              {/* Dutch Tax Step */}
              {currentStep === 'dutchTax' && (
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Dutch Tax Parameters</h1>
                  <p className="text-slate-400 mb-8 sm:mb-12">Help us optimize your tax situation.</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Jaarruimte (Pillar 3 Pension Room)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-slate-400">€</span>
                        <input
                          type="number"
                          value={formData.jaarruimte}
                          onChange={(e) => updateFormData('jaarruimte', Number(e.target.value))}
                          className={`w-full bg-slate-800 border ${validationErrors.jaarruimte ? 'border-red-500' : 'border-slate-700'} text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                        />
                      </div>
                      <p className="text-slate-400 text-sm mt-2">Amount you can contribute to private pension for tax deduction</p>
                      {validationErrors.jaarruimte && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.jaarruimte}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Factor A (Employer Pension)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-slate-400">€</span>
                        <input
                          type="number"
                          value={formData.factorA}
                          onChange={(e) => updateFormData('factorA', Number(e.target.value))}
                          className={`w-full bg-slate-800 border ${validationErrors.factorA ? 'border-red-500' : 'border-slate-700'} text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                        />
                      </div>
                      <p className="text-slate-400 text-sm mt-2">Annual pension accrual from employer (if applicable)</p>
                      {validationErrors.factorA && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.factorA}</p>
                      )}
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

              {/* Real Estate Step */}
              {currentStep === 'realEstate' && (
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Real Estate & Housing</h1>
                  <p className="text-slate-400 mb-8 sm:mb-12">Tell us about your primary residence.</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Primary Residence Value (WOZ-waarde)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-slate-400">€</span>
                        <input
                          type="number"
                          value={formData.homeValue}
                          onChange={(e) => updateFormData('homeValue', Number(e.target.value))}
                          className={`w-full bg-slate-800 border ${validationErrors.homeValue ? 'border-red-500' : 'border-slate-700'} text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                        />
                      </div>
                      {validationErrors.homeValue && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.homeValue}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Current Mortgage Balance</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-slate-400">€</span>
                        <input
                          type="number"
                          value={formData.mortgageBalance}
                          onChange={(e) => updateFormData('mortgageBalance', Number(e.target.value))}
                          className={`w-full bg-slate-800 border ${validationErrors.mortgageBalance ? 'border-red-500' : 'border-slate-700'} text-white pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                        />
                      </div>
                      {validationErrors.mortgageBalance && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.mortgageBalance}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Mortgage Interest Rate (%)</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          value={formData.mortgageInterestRate}
                          onChange={(e) => updateFormData('mortgageInterestRate', Number(e.target.value))}
                          className={`w-full bg-slate-800 border ${validationErrors.mortgageInterestRate ? 'border-red-500' : 'border-slate-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                        />
                        <span className="absolute right-4 top-3 text-slate-400">%</span>
                      </div>
                      {validationErrors.mortgageInterestRate && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.mortgageInterestRate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Remaining Mortgage Term (Years)</label>
                      <input
                        type="number"
                        value={formData.mortgageYearsLeft}
                        onChange={(e) => updateFormData('mortgageYearsLeft', Number(e.target.value))}
                        className={`w-full bg-slate-800 border ${validationErrors.mortgageYearsLeft ? 'border-red-500' : 'border-slate-700'} text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                      />
                      {validationErrors.mortgageYearsLeft && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.mortgageYearsLeft}</p>
                      )}
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
              <span className="text-lg sm:text-xl font-bold text-white hidden sm:inline">ExitWay</span>
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
              <div className="flex gap-1 sm:gap-2 mb-8">
                <button
                  onClick={() => applyPreset('starter')}
                  className={`flex-1 py-2 px-2 sm:py-2.5 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    preset === 'starter'
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-900/50 text-slate-400 hover:bg-slate-700/50'
                  }`}
                >
                  {t.calculator.starter}
                </button>
                <button
                  onClick={() => applyPreset('growing')}
                  className={`flex-1 py-2 px-2 sm:py-2.5 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    preset === 'growing'
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-900/50 text-slate-400 hover:bg-slate-700/50'
                  }`}
                >
                  {t.calculator.growing}
                </button>
                <button
                  onClick={() => applyPreset('established')}
                  className={`flex-1 py-2 px-2 sm:py-2.5 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
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
