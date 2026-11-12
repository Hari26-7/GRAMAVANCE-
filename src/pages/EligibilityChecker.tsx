import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  FileText,
  ShieldCheck,
  Check,
  Scale,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { VERIFIED_SCHEMES } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export const EligibilityChecker: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedSchemeSlug = searchParams.get('scheme');

  // Step 1: Location
  const [state, setState] = useState<string>('Tamil Nadu');
  const [district, setDistrict] = useState<string>('Thanjavur');

  // Step 2: Age Group
  const [ageGroup, setAgeGroup] = useState<string>('35-50');

  // Step 3: Beneficiary Type
  const [applicantType, setApplicantType] = useState<string>(() => {
    if (preselectedSchemeSlug === 'nrlm-shg-linkage') return 'shg';
    if (preselectedSchemeSlug === 'pm-kisan') return 'farmer_producer';
    return 'shg';
  });

  // Step 4: Business / Enterprise Activity
  const [businessCategory, setBusinessCategory] = useState<string>(() => {
    if (preselectedSchemeSlug === 'pmfme') return 'Food Processing';
    if (preselectedSchemeSlug === 'mudra-yojana') return 'Small Shop';
    return 'Food Processing';
  });

  // Step 5: Support Needed
  const [supportNeeded, setSupportNeeded] = useState<string>('Capital Subsidy');

  // Active step in the wizard: 1 to 5 (or 6 for full results)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // States list
  const INDIAN_STATES = [
    'Tamil Nadu',
    'Andhra Pradesh',
    'Karnataka',
    'Kerala',
    'Maharashtra',
    'Madhya Pradesh',
    'Rajasthan',
    'Uttar Pradesh',
    'West Bengal',
    'Other State',
  ];

  const BENEFICIARY_TYPES = [
    {
      id: 'shg',
      title: 'Women Self-Help Group (SHG) Member',
      titleTa: 'மகளிர் சுயஉதவிக் குழு (SHG) உறுப்பினர்',
      desc: 'Collective women group savings, food unit, or tailoring micro-enterprise',
    },
    {
      id: 'individual_entrepreneur',
      title: 'Individual Rural Entrepreneur',
      titleTa: 'தனிநபர் கிராமப்புற தொழில்முனைவோர்',
      desc: 'Starting or expanding a solo workshop, processing unit, or service shop',
    },
    {
      id: 'farmer_producer',
      title: 'Farmer / Producer / Cultivator',
      titleTa: 'விவசாயி / உற்பத்தியாளர்',
      desc: 'Own cultivable land, dairy cows, organic farming, or seeds production',
    },
    {
      id: 'artisan',
      title: 'Rural Artisan / Handloom Weaver',
      titleTa: 'கிராமப்புற கைவினைஞர் / நெசவாளர்',
      desc: 'Pottery, weaving, woodcraft, jewelry, or handmade traditional arts',
    },
  ];

  const ACTIVITY_OPTIONS = [
    {
      id: 'Food Processing',
      label: '🥫 Food Making & Processing',
      desc: 'Flour mills, turmeric pulverizing, dairy value addition, oil expelling, spice packing',
    },
    {
      id: 'Farming',
      label: '🌾 Agriculture & Millets',
      desc: 'Cultivation, seeds, solar irrigation, organic farming, cattle and goats',
    },
    {
      id: 'Textiles & Handloom',
      label: '🧵 Weaving & Garments',
      desc: 'Handloom sarees, tailoring units, garment stitching, embroidery',
    },
    {
      id: 'Handicrafts',
      label: '🎨 Traditional Arts & Crafts',
      desc: 'Clay pottery, bamboo craft, wood carving, decorative village artifacts',
    },
    {
      id: 'Small Shop',
      label: '🏪 Grocery, Retail or Service Shop',
      desc: 'Kirana shop, electrical repair, mobile servicing, small transport',
    },
    {
      id: 'Manufacturing',
      label: '⚙️ Light Rural Manufacturing',
      desc: 'Bio-fertilizer, paper bags, fly-ash bricks, hardware fabrication',
    },
  ];

  const SUPPORT_OPTIONS = [
    {
      id: 'Capital Subsidy',
      label: '💰 Government Subsidy (Free Capital Grant)',
      desc: 'Non-repayable 25% to 35% government assistance for buying machinery and equipment',
    },
    {
      id: 'Term Loan',
      label: '🏦 Collateral-Free Bank Business Loan',
      desc: 'Low-interest bank loan up to ₹20 Lakh without having to pledge land or property',
    },
    {
      id: 'Interest Subvention',
      label: '📉 Subsidized Low Interest (3% to 4%)',
      desc: 'Government pays discount on bank interest rate for prompt women group repayments',
    },
    {
      id: 'Grant',
      label: '🌱 Seed Money / Direct Income Support',
      desc: 'Direct account transfer for purchasing initial raw materials or seed capital',
    },
  ];

  // AI Matching Logic comparing user answers against verified criteria
  const evaluatedSchemes = useMemo(() => {
    return VERIFIED_SCHEMES.map((scheme) => {
      let score = 50;
      const reasons: string[] = [];
      const missingInfo: string[] = [];
      const requiredDocs: string[] = [...scheme.requiredDocuments];

      // 1. Beneficiary Match
      if (scheme.applicantTypes.includes(applicantType as any)) {
        score += 25;
        if (applicantType === 'shg') {
          reasons.push(
            'You are an SHG member, eligible for special 35% priority subsidy and group seed funding.'
          );
        } else if (applicantType === 'farmer_producer') {
          reasons.push('As an agricultural producer, you qualify for farmer-targeted DBT and subsidy.');
        } else {
          reasons.push(`Scheme officially supports your applicant category (${applicantType.replace('_', ' ')}).`);
        }
      } else {
        score -= 20;
        missingInfo.push(
          `Scheme primarily serves: ${scheme.applicantTypes.map((t) => t.replace('_', ' ')).join(', ')}`
        );
      }

      // 2. Activity Match
      const matchesActivity =
        scheme.businessCategories.some(
          (c) => c.toLowerCase() === businessCategory.toLowerCase()
        ) ||
        (businessCategory === 'Food Processing' &&
          scheme.businessCategories.includes('Food Processing')) ||
        (businessCategory === 'Small Shop' &&
          (scheme.fundingType === 'Term Loan' || scheme.businessCategories.includes('Retail')));

      if (matchesActivity) {
        score += 20;
        reasons.push(`Your enterprise activity (${businessCategory}) is an approved sector.`);
      } else {
        score -= 10;
        missingInfo.push(`Verify if your specific trade under ${businessCategory} is covered in DPR.`);
      }

      // 3. Support Type Match
      if (
        supportNeeded === 'Capital Subsidy' &&
        scheme.fundingType === 'Capital Subsidy'
      ) {
        score += 15;
        reasons.push(
          `Provides ${scheme.subsidyPercentage}% non-repayable capital subsidy up to ₹${(
            scheme.maxSubsidyAmount / 100000
          ).toFixed(1)} Lakh.`
        );
      } else if (
        supportNeeded === 'Term Loan' &&
        scheme.fundingType === 'Term Loan'
      ) {
        score += 15;
        reasons.push('Offers 100% collateral-free bank term lending.');
      } else if (
        supportNeeded === 'Interest Subvention' &&
        scheme.fundingType === 'Interest Subvention'
      ) {
        score += 15;
        reasons.push('Provides subsidized interest rate reduction down to 4% p.a.');
      }

      // State applicability check
      if (
        !scheme.applicableStates.includes('All') &&
        !scheme.applicableStates.includes(state)
      ) {
        score -= 30;
        missingInfo.push(`Currently available only in: ${scheme.applicableStates.join(', ')}`);
      }

      const normalizedScore = Math.max(15, Math.min(98, score));
      const status: 'Eligible' | 'Potentially Eligible' | 'Not Eligible' =
        normalizedScore >= 75
          ? 'Eligible'
          : normalizedScore >= 45
          ? 'Potentially Eligible'
          : 'Not Eligible';

      return {
        scheme,
        score: normalizedScore,
        status,
        qualifies: normalizedScore >= 70,
        reasons,
        missingInfo,
        requiredDocs,
      };
    }).sort((a, b) => b.score - a.score);
  }, [state, applicantType, businessCategory, supportNeeded]);

  const handleReset = () => {
    setCurrentStep(1);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 text-left">
      {/* Title Header */}
      <div className="bg-white dark:bg-[#0E1A29] text-[#202B3C] dark:text-white p-6 sm:p-7 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] border border-[#E3E7ED] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'ta' ? 'அரசு உதவி தகுதி சரிபார்ப்பான்' : 'AI Eligibility Checker'}
            </h1>
            <span className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-[#315D86] dark:text-sky-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Question-First Guidance
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#647184] dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? '5 எளிய கேள்விகளுக்கு பதிலளியுங்கள். உங்கள் ஊர், தொழில் மற்றும் தேவைக்கேற்ப தகுதியான அரசு திட்டங்களை உடனடியாக அறிந்து கொள்ளுங்கள்.'
              : 'Answer 5 simple questions about your location, enterprise, and financial needs to identify schemes you qualify for.'}
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={handleReset}
          leftIcon={<RotateCcw className="w-4 h-4" />}
          className="text-xs font-bold rounded-xl shadow-2xs"
        >
          Start Over
        </Button>
      </div>

      {/* Human-Centered 3-Question Guidance Card */}
      <Card className="p-5 border border-[#E3E7ED] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] space-y-3">
        <div className="flex items-center gap-2 font-bold text-[#315D86] dark:text-sky-300 text-sm">
          <HelpCircle className="w-4 h-4 text-[#315D86]" />
          <span>Understanding This Eligibility Evaluation:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm text-[#647184] dark:text-slate-300">
          <div>
            <strong className="block text-[#202B3C] dark:text-white font-semibold mb-0.5">1. What is this page for?</strong>
            <span>Discover which government grants, subsidies, or bank loans match your real profile without confusing jargon.</span>
          </div>
          <div>
            <strong className="block text-[#202B3C] dark:text-white font-semibold mb-0.5">2. What can I do here?</strong>
            <span>Answer one question at a time. Review why you qualify, what papers you need, and what information is still missing.</span>
          </div>
          <div>
            <strong className="block text-[#202B3C] dark:text-white font-semibold mb-0.5">3. What should I do next?</strong>
            <span>Upload the required papers in "My Documents" and proceed to the official portal application link.</span>
          </div>
        </div>
      </Card>

      {/* Official Verification Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs sm:text-sm text-[#202B3C] dark:text-amber-200 flex items-start gap-3 shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-amber-900 dark:text-amber-300">Important Eligibility Distinction:</strong> This tool evaluates potential eligibility against published official government criteria (PMEGP, PMFME, MUDRA, DAY-NRLM, NEEDS). It does <em>not</em> constitute a final legal sanction. Official approval is granted solely by the designated District Level Task Force Committee (DLTFC) and financing bank branch upon document verification.
        </div>
      </div>

      {/* Step Progress Indicator */}
      <div className="flex items-center justify-between text-xs font-bold text-[#647184] px-1">
        <span>Step {currentStep} of 5</span>
        <span className="text-[#315D86] font-semibold">
          {currentStep === 1 && 'Where do you live?'}
          {currentStep === 2 && 'What is your age group?'}
          {currentStep === 3 && 'Who are you?'}
          {currentStep === 4 && 'What is your business?'}
          {currentStep === 5 && 'What support do you need?'}
        </span>
      </div>
      <div className="w-full bg-[#E3E7ED] dark:bg-slate-700 h-2 rounded-full overflow-hidden">
        <div
          className="bg-[#315D86] h-full transition-all duration-200"
          style={{ width: `${(currentStep / 5) * 100}%` }}
        />
      </div>

      {/* Interactive Step Card */}
      <Card className="p-6 sm:p-7 border border-[#E3E7ED] dark:border-slate-800 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] bg-white dark:bg-[#0E1A29] space-y-6">
        {/* Step 1: Location */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#172B3A] dark:text-slate-100">
                1. Where is your enterprise or farm located?
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Government subsidy percentages differ between rural, semi-urban, and special hill districts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-bold text-[#202B3C] dark:text-slate-300 mb-1">
                  State (மாநிலம்)
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-[#E3E7ED] dark:border-slate-700 bg-[#F0F2F5] dark:bg-slate-900 text-sm font-semibold text-[#202B3C] dark:text-slate-100 focus:outline-none focus:border-[#315D86]"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#202B3C] dark:text-slate-300 mb-1">
                  District (மாவட்டம்)
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Thanjavur, Madurai, Salem"
                  className="w-full h-11 px-4 rounded-xl border border-[#E3E7ED] dark:border-slate-700 bg-[#F0F2F5] dark:bg-slate-900 text-sm font-semibold text-[#202B3C] dark:text-slate-100 focus:outline-none focus:border-[#315D86] placeholder-[#647184]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Age Group */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#202B3C] dark:text-slate-100">
                2. What is your age group?
              </h2>
              <p className="text-sm text-[#647184] mt-1">
                Schemes like PMEGP and MUDRA require applicant age ≥18; youth entrepreneur programs like NEEDS offer special benefits for ages 21-35.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {[
                { id: '18-35', label: '18 to 35 Years (Youth)', desc: 'Eligible for both youth schemes and all general rural subsidies' },
                { id: '35-50', label: '35 to 50 Years (Adult)', desc: 'Standard rural category with full PMEGP & PMFME eligibility' },
                { id: '50+', label: '50+ Years (Senior / Veteran)', desc: 'Eligible with streamlined verification and joint group options' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAgeGroup(opt.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all active:scale-95 ${
                    ageGroup === opt.id
                      ? 'border-[#315D86] bg-blue-50/70 dark:bg-blue-950/40 text-[#315D86] dark:text-sky-300 font-bold shadow-xs'
                      : 'border-[#E3E7ED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#202B3C] dark:text-slate-300 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="text-sm sm:text-base font-bold">{opt.label}</div>
                  <div className="text-xs text-[#647184] mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Beneficiary Type */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#202B3C] dark:text-slate-100">
                3. Which category best describes you?
              </h2>
              <p className="text-sm text-[#647184] mt-1">
                Special categories (Women, SHGs, SC, ST) receive 35% capital subsidy compared to 25% for general category.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {BENEFICIARY_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setApplicantType(type.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all active:scale-95 ${
                    applicantType === type.id
                      ? 'border-[#315D86] bg-blue-50/70 dark:bg-blue-950/40 text-[#315D86] dark:text-sky-300 font-bold shadow-xs'
                      : 'border-[#E3E7ED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#202B3C] dark:text-slate-300 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="text-sm sm:text-base font-bold">{type.title}</div>
                  <div className="text-xs text-[#647184] mt-1">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Business Category */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#202B3C] dark:text-slate-100">
                4. What business or activity do you undertake?
              </h2>
              <p className="text-sm text-[#647184] mt-1">
                Different ministries fund specific sectors (e.g., Food Processing under MoFPI, Weaving under MoMSME).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {ACTIVITY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBusinessCategory(opt.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all active:scale-95 ${
                    businessCategory === opt.id
                      ? 'border-[#315D86] bg-blue-50/70 dark:bg-blue-950/40 text-[#315D86] dark:text-sky-300 font-bold shadow-xs'
                      : 'border-[#E3E7ED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#202B3C] dark:text-slate-300 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="text-sm sm:text-base font-bold">{opt.label}</div>
                  <div className="text-xs text-[#647184] mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Support Needed */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#202B3C] dark:text-slate-100">
                5. What kind of financial support do you need most?
              </h2>
              <p className="text-sm text-[#647184] mt-1">
                Choose the primary assistance you are seeking for your enterprise.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {SUPPORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSupportNeeded(opt.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all active:scale-95 ${
                    supportNeeded === opt.id
                      ? 'border-[#315D86] bg-blue-50/70 dark:bg-blue-950/40 text-[#315D86] dark:text-sky-300 font-bold shadow-xs'
                      : 'border-[#E3E7ED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#202B3C] dark:text-slate-300 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="text-sm sm:text-base font-bold">{opt.label}</div>
                  <div className="text-xs text-[#647184] mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="pt-4 border-t border-[#E3E7ED] dark:border-slate-800 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="min-h-[44px] rounded-xl font-semibold"
          >
            Back
          </Button>

          {currentStep < 5 ? (
            <Button
              variant="teal"
              size="md"
              onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-bold min-h-[44px] px-6 rounded-xl"
            >
              Continue to Step {currentStep + 1}
            </Button>
          ) : (
            <Button
              variant="teal"
              size="md"
              onClick={() => {
                const el = document.getElementById('evaluation-results');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              rightIcon={<Check className="w-4 h-4" />}
              className="font-bold min-h-[44px] px-6 rounded-xl"
            >
              View My Matching Schemes
            </Button>
          )}
        </div>
      </Card>

      {/* Evaluation Results Section */}
      <div id="evaluation-results" className="space-y-5 pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#202B3C] dark:text-white">
              Potential Scheme Matches for Your Profile ({evaluatedSchemes.filter((s) => s.qualifies).length} High Matches)
            </h2>
            <p className="text-xs sm:text-sm text-[#647184] mt-0.5">
              Based on {applicantType.replace('_', ' ')} • {businessCategory} • {state}
            </p>
          </div>

          <button
            onClick={() => navigate('/compatibility')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#202B3C] dark:text-slate-200 bg-white dark:bg-slate-800 border border-[#E3E7ED] dark:border-slate-700 hover:bg-[#F0F2F5] cursor-pointer shadow-2xs active:scale-95 transition-all"
          >
            <Scale className="w-3.5 h-3.5 text-[#315D86]" />
            <span>Check Multiple Scheme Compatibility →</span>
          </button>
        </div>

        <div className="space-y-5">
          {evaluatedSchemes.map(({ scheme, score, status, reasons, missingInfo, requiredDocs }) => (
            <Card
              key={scheme.id}
              className={`p-6 border rounded-2xl space-y-4 transition-all shadow-[0_4px_18px_rgba(32,43,60,0.05)] ${
                status === 'Eligible'
                  ? 'border-emerald-200 dark:border-emerald-900 bg-white dark:bg-[#0E1A29]'
                  : status === 'Potentially Eligible'
                  ? 'border-amber-200/80 dark:border-amber-900/60 bg-white dark:bg-slate-900/90'
                  : 'border-[#E3E7ED] dark:border-slate-800 bg-[#F0F2F5] dark:bg-slate-900/60 opacity-90'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                        status === 'Eligible'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300'
                          : status === 'Potentially Eligible'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300'
                          : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300'
                      }`}
                    >
                      {status === 'Eligible' && `🟢 Eligible: ${score}% Match`}
                      {status === 'Potentially Eligible' && `🟡 Potentially Eligible: ${score}% Match`}
                      {status === 'Not Eligible' && `🔴 Not Eligible: ${score}% Match`}
                    </span>
                    <Badge variant="teal" size="sm">
                      {scheme.fundingType}
                    </Badge>
                    <span className="text-xs text-[#647184] font-medium">
                      {scheme.level === 'Central' ? '🏛️ Central Govt' : '🏢 State Govt'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#202B3C] dark:text-slate-100">
                    {scheme.title[language] || scheme.title.en}
                  </h3>
                  <p className="text-xs text-[#647184]">{scheme.department} • {scheme.ministry}</p>
                </div>

                <div className="text-right sm:shrink-0">
                  <span className="text-xs text-[#647184] block">Available Assistance:</span>
                  <span className="text-lg font-extrabold text-[#43836F]">
                    {scheme.subsidyPercentage > 0
                      ? `${scheme.subsidyPercentage}% Subsidy (up to ₹${(scheme.maxSubsidyAmount / 100000).toFixed(1)}L)`
                      : 'Collateral-Free Loan'}
                  </span>
                </div>
              </div>

              {/* Why You May Qualify Box */}
              <div className="p-4 rounded-xl bg-[#F0F2F5] dark:bg-slate-800 border border-[#E3E7ED] dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#43836F] dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#43836F]" />
                  Why you may qualify:
                </span>
                <ul className="text-sm text-[#202B3C] dark:text-slate-200 space-y-1">
                  {reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#43836F] font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing Information / Required Documents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/60 border border-[#E3E7ED] dark:border-slate-700 space-y-1.5 shadow-2xs">
                  <strong className="block text-[#202B3C] dark:text-slate-200 font-bold">
                    📋 Mandatory Documents Required:
                  </strong>
                  <ul className="space-y-1 text-[#647184] dark:text-slate-300">
                    {requiredDocs.slice(0, 4).map((doc, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#43836F] shrink-0" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 space-y-1.5 shadow-2xs">
                  <strong className="block text-amber-900 dark:text-amber-200 font-bold">
                    ⚠️ Missing Information to Clarify:
                  </strong>
                  <ul className="space-y-1 text-amber-950 dark:text-amber-300">
                    {missingInfo.length > 0 ? (
                      missingInfo.map((info, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{info}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[#43836F] dark:text-emerald-300 font-medium">
                        ✓ All initial questions match standard profile criteria!
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#E3E7ED] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/documents')}
                    leftIcon={<FileText className="w-4 h-4" />}
                    className="text-xs font-semibold rounded-xl"
                  >
                    Upload Papers to Vault
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/assistant?prompt=Explain ${scheme.slug} requirements for my business`)}
                    leftIcon={<Sparkles className="w-4 h-4 text-[#43836F]" />}
                    className="text-xs font-semibold rounded-xl"
                  >
                    Ask AI Assistant
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/schemes?search=${scheme.slug}`)}
                    className="text-xs font-semibold rounded-xl"
                  >
                    View Full Details
                  </Button>
                  <button
                    onClick={() => window.open(scheme.officialPortalUrl, '_blank')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#315D86] hover:bg-[#26496B] text-white transition-all active:scale-95 shadow-2xs"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EligibilityChecker;
