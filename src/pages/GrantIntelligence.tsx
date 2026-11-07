import React, { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  HelpCircle,
  CheckCircle2,
  RotateCcw,
  Calculator,
  AlertCircle,
  AlertTriangle,
  Download,
  Info,
  Check,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const GrantIntelligence: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const schemeParam = searchParams.get('scheme');

  // Guided Assistant Step: 1 to 5
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Work / Business category
  const [workType, setWorkType] = useState<string>(() => {
    if (schemeParam === 'pmfme') return 'Food Processing';
    if (schemeParam === 'mudra-yojana') return 'Small Shop';
    if (schemeParam === 'nrlm-shg-linkage') return 'SHG';
    return 'Food Processing';
  });

  // Step 2: Location
  const [state, setState] = useState<string>('Tamil Nadu');
  const [district, setDistrict] = useState<string>('Thanjavur');

  // Step 3: Total Cost of Your Business (CapEx)
  const [amountNeeded, setAmountNeeded] = useState<number>(500000); // 5 Lakh

  // Step 4: Existing Credit & Prior Subsidies
  const [priorHelp, setPriorHelp] = useState<'yes' | 'no' | 'unsure'>('no');

  // Step 5: Download status
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const workOptions = [
    { id: 'Food Processing', label: '🥫 Food Making & Processing', desc: 'Flour mills, turmeric, spices, dairy products, oil expellers' },
    { id: 'Farming', label: '🌾 Agriculture & Farming', desc: 'Crops, seeds, solar pumps, farm tools, organic millets' },
    { id: 'Handicrafts', label: '🧵 Handicrafts & Weaving', desc: 'Handloom sarees, pottery, bamboo work, tailoring unit' },
    { id: 'Small Shop', label: '🏪 Small Shop or Business', desc: 'Grocery shop, service center, repair unit, local trading' },
    { id: 'SHG', label: '👥 Women Self-Help Group (SHG)', desc: 'Collective group enterprise, women savings and micro-units' },
    { id: 'Other', label: '📦 Other Rural Enterprise', desc: 'Packaging, transport vehicle, agro-tourism, bio-fertilizer' },
  ];

  // Dynamic Rule-Based Matching Engine
  const calculateFundingBreakdown = () => {
    let subsidyPercentage = 35; // Standard rural special category rate (women/rural)
    let maxSubsidyCap = 1750000;
    let ownContributionPercentage = 5; // 5% for special categories

    if (workType === 'Food Processing') {
      subsidyPercentage = 35;
      maxSubsidyCap = 1000000; // PMFME 35% up to 10 Lakh
      ownContributionPercentage = 10;
    } else if (workType === 'Small Shop') {
      subsidyPercentage = 0; // MUDRA loan - 0% capital subsidy, 100% collateral-free loan
      maxSubsidyCap = 0;
      ownContributionPercentage = 15;
    } else if (workType === 'SHG') {
      subsidyPercentage = 35;
      maxSubsidyCap = 1000000;
      ownContributionPercentage = 10;
    }

    const estimatedSubsidy = Math.min(amountNeeded * (subsidyPercentage / 100), maxSubsidyCap);
    const ownContribution = Math.round(amountNeeded * (ownContributionPercentage / 100));
    const bankLoan = Math.max(0, amountNeeded - estimatedSubsidy - ownContribution);

    return {
      subsidyPercentage,
      estimatedSubsidy,
      ownContribution,
      ownContributionPercentage,
      bankLoan,
    };
  };

  const funding = calculateFundingBreakdown();

  const handleDownloadReport = useCallback(() => {
    setDownloadSuccess(true);
    const currentDate = new Date().toLocaleDateString();
    const reportText = `GRAMAVANCE - FUNDING READINESS DOSSIER\nDate: ${currentDate}\n\nBusiness Category: ${workType}\nLocation: ${district}, ${state}\nTotal Cost of Your Business: ${formatCurrency(amountNeeded)}\nPromoter Contribution (Your Share): ${formatCurrency(funding.ownContribution)} (${funding.ownContributionPercentage}%)\nEstimated Government Free Subsidy: ${formatCurrency(funding.estimatedSubsidy)} (${funding.subsidyPercentage}%)\nBank Term Loan Requirement: ${formatCurrency(funding.bankLoan)}\nPrior Government Subsidy Received: ${priorHelp}\n\nNotice: This report is an educational funding estimate based on official guidelines. Official approval requires verification by the financing bank and district task committee.`;
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Gramavance_Funding_Report_${district}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloadSuccess(false), 4000);
  }, [amountNeeded, district, funding, priorHelp, state, workType]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Friendly Title & Header */}
      <div className="bg-white dark:bg-[#0E1A29] p-6 rounded-2xl border border-[#E3E7ED] dark:border-slate-800 shadow-[0_4px_20px_rgba(32,43,60,0.06)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-[#43836F] dark:text-emerald-300 font-bold text-xs mb-2">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Patient Step-by-Step Helper</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202B3C] dark:text-white">
              Find Government Financial Help
            </h1>
            <p className="text-base text-[#647184] dark:text-slate-300 mt-1">
              Answer 4 simple questions. We will check official government rules and show what assistance you can get.
            </p>
          </div>

          {/* Large Step Indicator for Elderly Users */}
          <div className="px-5 py-2.5 rounded-2xl bg-[#EAF4FF] dark:bg-slate-800 text-[#102D46] dark:text-sky-200 font-extrabold text-base border border-[#CDE2FC] dark:border-slate-700 shrink-0">
            Step {currentStep} of 5
          </div>
        </div>

        {/* Calm Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full mt-5 overflow-hidden">
          <div
            className="h-full bg-[#159B68] rounded-full transition-all duration-150"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: What do you need help with? */}
      {currentStep === 1 && (
        <Card className="p-6 sm:p-8 space-y-6 text-left">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#159B68]">Question 1 of 4</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B3A] dark:text-white">
              What kind of work or business do you do?
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Select the option closest to what you are doing or planning to start:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {workOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setWorkType(opt.id)}
                className={`p-5 rounded-2xl border-2 text-left transition-colors cursor-pointer flex flex-col justify-between space-y-2 min-h-[96px] ${
                  workType === opt.id
                    ? 'border-[#159B68] bg-[#F0FDF4] dark:bg-emerald-950/40 shadow-xs'
                    : 'border-[#E1E8EE] dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg sm:text-xl font-bold text-[#172B3A] dark:text-white">
                    {opt.label}
                  </span>
                  {workType === opt.id && (
                    <CheckCircle2 className="w-6 h-6 text-[#159B68] shrink-0" />
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{opt.desc}</p>
              </button>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="min-h-[48px] px-8 rounded-2xl bg-[#159B68] hover:bg-emerald-700 text-white font-bold text-base flex items-center gap-2 shadow-xs cursor-pointer"
            >
              Next Question →
            </button>
          </div>
        </Card>
      )}

      {/* STEP 2: Where is your business located? */}
      {currentStep === 2 && (
        <Card className="p-6 sm:p-8 space-y-6 text-left">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#159B68]">Question 2 of 4</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B3A] dark:text-white">
              Where is your business located?
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Government subsidies and scheme quotas vary by state, district, and rural area:
            </p>
          </div>

          <div className="space-y-5 max-w-xl">
            <div>
              <label className="block text-base font-bold text-[#172B3A] dark:text-white mb-2">
                Your State:
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full min-h-[48px] px-4 text-base font-semibold rounded-2xl bg-[#F4F9F6] dark:bg-slate-800 border-2 border-[#E1E8EE] dark:border-slate-700 text-[#172B3A] dark:text-white focus:border-[#159B68] focus:outline-none"
              >
                <option value="Tamil Nadu">Tamil Nadu (தமிழ்நாடு)</option>
                <option value="Madhya Pradesh">Madhya Pradesh (मध्य प्रदेश)</option>
                <option value="Rajasthan">Rajasthan (राजस्थान)</option>
                <option value="Karnataka">Karnataka (ಕರ್ನಾಟಕ)</option>
                <option value="Maharashtra">Maharashtra (महाराष्ट्र)</option>
                <option value="Uttar Pradesh">Uttar Pradesh (उत्तर प्रदेश)</option>
              </select>
            </div>

            <div>
              <label className="block text-base font-bold text-[#172B3A] dark:text-white mb-2">
                Your District:
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Example: Thanjavur, Madurai, Salem, Jaipur"
                className="w-full min-h-[48px] px-4 text-base font-semibold rounded-2xl bg-[#F4F9F6] dark:bg-slate-800 border-2 border-[#E1E8EE] dark:border-slate-700 text-[#172B3A] dark:text-white focus:border-[#159B68] focus:outline-none"
              />
              <span className="text-xs text-slate-500 mt-1 block">
                Type the name of your nearest town or district collectorate.
              </span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(1)}
              className="min-h-[48px] px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-base hover:bg-slate-200 transition-colors cursor-pointer"
            >
              ← Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="min-h-[48px] px-8 rounded-2xl bg-[#159B68] hover:bg-emerald-700 text-white font-bold text-base flex items-center gap-2 shadow-xs cursor-pointer"
            >
              Next Question →
            </button>
          </div>
        </Card>
      )}

      {/* STEP 3: How Much Money Do You Need? (Total Cost of Your Business) */}
      {currentStep === 3 && (
        <Card className="p-6 sm:p-8 space-y-6 text-left">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#159B68]">Question 3 of 4</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B3A] dark:text-white">
              How Much Money Do You Need?
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Total Cost of Your Business: This includes buying machines, tools, supplies, or building a small work shed.
            </p>
          </div>

          {/* Quick preset buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[100000, 300000, 500000, 1000000].map((preset) => (
              <button
                key={preset}
                onClick={() => setAmountNeeded(preset)}
                className={`min-h-[48px] py-3 px-4 rounded-2xl font-extrabold text-base border-2 transition-colors cursor-pointer ${
                  amountNeeded === preset
                    ? 'border-[#159B68] bg-[#F0FDF4] text-[#159B68]'
                    : 'border-[#E1E8EE] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                ₹{(preset / 100000).toFixed(0)} Lakh
              </button>
            ))}
          </div>

          <div className="max-w-xl space-y-2">
            <label className="block text-base font-bold text-[#172B3A] dark:text-white">
              Or type exact amount (in Rupees):
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-2xl text-slate-400">
                ₹
              </span>
              <input
                type="number"
                value={amountNeeded}
                onChange={(e) => setAmountNeeded(Math.max(10000, Number(e.target.value)))}
                step="25000"
                className="w-full min-h-[56px] pl-10 pr-4 text-2xl font-extrabold rounded-2xl bg-[#F4F9F6] dark:bg-slate-800 border-2 border-[#E1E8EE] dark:border-slate-700 text-[#172B3A] dark:text-white focus:border-[#159B68] focus:outline-none"
              />
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Selected Total Project Cost: <strong>{formatCurrency(amountNeeded)}</strong>
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(2)}
              className="min-h-[48px] px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-base hover:bg-slate-200 transition-colors cursor-pointer"
            >
              ← Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="min-h-[48px] px-8 rounded-2xl bg-[#159B68] hover:bg-emerald-700 text-white font-bold text-base flex items-center gap-2 shadow-xs cursor-pointer"
            >
              Next Question →
            </button>
          </div>
        </Card>
      )}

      {/* STEP 4: Have You Received Financial Help Before? */}
      {currentStep === 4 && (
        <Card className="p-6 sm:p-8 space-y-6 text-left">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#159B68]">Question 4 of 4</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B3A] dark:text-white">
              Have You Received Financial Help Before?
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Government rules prevent claiming capital subsidy twice for the exact same machines or premises:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'yes' as const, label: 'Yes, I have received a government subsidy before' },
              { id: 'no' as const, label: 'No, this is my first time applying' },
              { id: 'unsure' as const, label: 'I am not sure / Have only a small bank loan' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setPriorHelp(opt.id)}
                className={`p-6 rounded-2xl border-2 text-center font-extrabold text-base transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 min-h-[110px] ${
                  priorHelp === opt.id
                    ? 'border-[#159B68] bg-[#F0FDF4] text-[#159B68] shadow-xs'
                    : 'border-[#E1E8EE] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{opt.label}</span>
                {priorHelp === opt.id && <CheckCircle2 className="w-6 h-6 text-[#159B68]" />}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
            💡 <em>Note:</em> Having an existing micro-finance or SHG thrift loan does NOT disqualify you from NRLM or PMFME seed capital.
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(3)}
              className="min-h-[48px] px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-base hover:bg-slate-200 transition-colors cursor-pointer"
            >
              ← Back
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="min-h-[48px] px-8 rounded-2xl bg-[#159B68] hover:bg-emerald-700 text-white font-bold text-base flex items-center gap-2 shadow-xs cursor-pointer"
            >
              See My Suitable Schemes →
            </button>
          </div>
        </Card>
      )}

      {/* STEP 5: Results & Funding Scenario Breakdown */}
      {currentStep === 5 && (
        <div className="space-y-6 text-left">
          {/* Main Assessment Container */}
          <Card className="p-6 sm:p-8 space-y-6 border-2 border-emerald-200 bg-[#F0FDF4] dark:bg-[#0E2437]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#159B68]">
                  Assessment Ready
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102D46] dark:text-white">
                  Funding Assistance Matches
                </h2>
                <p className="text-base text-slate-700 dark:text-slate-200 mt-1">
                  Based on: <strong>{workType}</strong> in <strong>{district}, {state}</strong> (Total Cost: <strong>{formatCurrency(amountNeeded)}</strong>)
                </p>
              </div>

              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 min-h-[40px] rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-200 shadow-2xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Start Again
              </button>
            </div>

            {/* SECTION A: Potentially Suitable Schemes (Phase 5B) */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#102D46] dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#159B68]" />
                Potentially Suitable Schemes:
              </h3>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-[#E1E8EE] dark:border-slate-700 space-y-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-[#159B68]">
                      Top Recommended Scheme
                    </span>
                    <h4 className="text-xl sm:text-2xl font-extrabold text-[#172B3A] dark:text-white mt-1.5">
                      {workType === 'Food Processing'
                        ? 'PM Formalisation of Micro food processing Enterprises (PMFME)'
                        : workType === 'Small Shop'
                        ? 'Pradhan Mantri MUDRA Yojana (PMMY) - Kishore / Tarun'
                        : workType === 'SHG'
                        ? 'DAY-NRLM Women SHG Bank Linkage & Interest Subvention'
                        : "Prime Minister's Employment Generation Programme (PMEGP)"}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {workType === 'Food Processing'
                        ? 'Ministry of Food Processing Industries (MoFPI)'
                        : workType === 'Small Shop'
                        ? 'Ministry of Finance & MUDRA Division'
                        : workType === 'SHG'
                        ? 'Ministry of Rural Development (MoRD)'
                        : 'Ministry of MSME & Khadi and Village Industries Commission'}
                    </p>
                  </div>
                </div>

                {/* Plain-Language 4-Point Explanation */}
                <div className="space-y-3 text-sm sm:text-base text-slate-700 dark:text-slate-200 divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="pt-2">
                    <strong className="text-[#102D46] dark:text-emerald-400 block mb-0.5 font-bold">
                      1. What this scheme gives you:
                    </strong>
                    <span>
                      {funding.subsidyPercentage > 0 ? (
                        <>
                          The government provides <strong>{funding.subsidyPercentage}% free subsidy</strong> ({formatCurrency(funding.estimatedSubsidy)}) which does not need to be repaid. The remaining balance is financed via bank term loan.
                        </>
                      ) : (
                        <>
                          Collateral-free institutional bank loan up to {formatCurrency(amountNeeded)} with subsidized interest and no property mortgage required.
                        </>
                      )}
                    </span>
                  </div>

                  <div className="pt-2">
                    <strong className="text-[#102D46] dark:text-emerald-400 block mb-0.5 font-bold">
                      2. How much money can you pay yourself? (Promoter Contribution):
                    </strong>
                    <span>
                      You only need to contribute <strong>{funding.ownContributionPercentage}%</strong> ({formatCurrency(funding.ownContribution)}) from your own funds or savings.
                    </span>
                  </div>

                  <div className="pt-2">
                    <strong className="text-[#102D46] dark:text-emerald-400 block mb-0.5 font-bold">
                      3. What do you need? (Mandatory Prerequisites):
                    </strong>
                    <span>
                      Aadhaar card, Bank passbook front page scan, quotation bills from your machinery/supplies seller, and local village address proof.
                    </span>
                  </div>

                  <div className="pt-2">
                    <strong className="text-[#102D46] dark:text-emerald-400 block mb-0.5 font-bold">
                      4. What you should do next:
                    </strong>
                    <span>
                      Keep your papers ready in <strong>My Documents</strong>, then submit an application via the official nodal portal.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION B: Information That Needs Official Verification (Phase 5B) */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#102D46] dark:text-sky-300 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Information That Needs Official Verification:
              </h3>

              <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-slate-900 border border-blue-200 dark:border-slate-700 text-sm space-y-2 text-slate-700 dark:text-slate-300">
                <p>
                  • <strong>Category / Caste Verification:</strong> The 35% subsidy rate requires valid community / rural resident certification. General category beneficiaries in urban areas receive 15% to 25%.
                </p>
                <p>
                  • <strong>Machinery Quotation:</strong> The seller must provide a formal GST bill/quotation for the processing machine or setup.
                </p>
                <p>
                  • <strong>Education Record:</strong> For manufacturing projects exceeding ₹10 Lakh, a minimum 8th standard pass certificate is required by government rules.
                </p>
              </div>
            </div>

            {/* SECTION C: Schemes That May Be Incompatible (Phase 5B) */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Compatibility & Incompatibility Rules:
              </h3>

              <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-slate-900 border border-amber-200 dark:border-slate-700 text-sm space-y-2 text-amber-900 dark:text-slate-200">
                {priorHelp === 'yes' ? (
                  <p className="font-semibold text-rose-700 dark:text-rose-400">
                    ⚠️ <strong>Capital Subsidy Incompatibility:</strong> Because you indicated prior government subsidy assistance, official rules state that you cannot claim capital subsidy twice on the exact same plant and machinery unit. However, you remain eligible for working capital loans, interest subvention, or greenfield expansion under Stand-Up India.
                  </p>
                ) : (
                  <p>
                    ✅ <strong>Compatible for New Units:</strong> You are clear to apply for PMEGP or PMFME capital subsidy. However, you cannot combine two central capital subsidy schemes (e.g. PMEGP + PMFME) on the exact same equipment invoice.
                  </p>
                )}
                <p className="text-xs text-slate-500">
                  * Based on Ministry of MSME & MoFPI convergence guidelines.
                </p>
              </div>
            </div>

            {/* SECTION D: How Will Your Business Be Funded? (Scenario Breakdown) */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#102D46] dark:text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#159B68]" />
                How Will Your Business Be Funded? (Project Financing Breakdown)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 block">Total Cost of Your Business</span>
                  <strong className="text-lg text-slate-900 dark:text-white">
                    {formatCurrency(amountNeeded)}
                  </strong>
                  <span className="text-[11px] text-slate-400 block mt-0.5">100% of project</span>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xs text-emerald-800 dark:text-emerald-300 block">
                    Government Free Subsidy ({funding.subsidyPercentage}%)
                  </span>
                  <strong className="text-lg text-[#159B68]">
                    {formatCurrency(funding.estimatedSubsidy)}
                  </strong>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block mt-0.5">
                    No need to repay
                  </span>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/60 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <span className="text-xs text-blue-800 dark:text-blue-300 block">
                    Bank Term Loan
                  </span>
                  <strong className="text-lg text-blue-700 dark:text-blue-300">
                    {formatCurrency(funding.bankLoan)}
                  </strong>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 block mt-0.5">
                    Repay in easy EMIs
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION E: Prominent Disclaimer (Critical Rule) */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>
                <strong>Important Legal Notice:</strong> Gramavance never guarantees eligibility, loan approval, or subsidy sanctions. All calculations reflect verified public government guidelines provided for planning purposes. Sanction is determined solely by the nodal district committee and financing bank.
              </span>
            </div>

            {/* Actions: Download Dossier & Navigate to Applications */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                variant="outline"
                size="md"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={handleDownloadReport}
                className="w-full sm:w-auto min-h-[48px] font-bold"
              >
                {downloadSuccess ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Downloaded Dossier
                  </span>
                ) : (
                  'Download Your Funding Report'
                )}
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="teal"
                  size="md"
                  onClick={() => navigate('/applications')}
                  className="w-full sm:w-auto min-h-[48px] font-bold bg-[#159B68] hover:bg-emerald-700 text-white"
                >
                  Start Application with Guidance →
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
