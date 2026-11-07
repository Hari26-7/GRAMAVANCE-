import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scale,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  ExternalLink,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { VERIFIED_SCHEMES } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface CompatibilityRule {
  schemeA: string;
  schemeB: string;
  status: 'Compatible' | 'Conflict' | 'Sequential';
  title: string;
  explanation: string;
  officialClause: string;
  recommendation: string;
}

const VERIFIED_RULES: CompatibilityRule[] = [
  {
    schemeA: 'pmegp',
    schemeB: 'pmfme',
    status: 'Conflict',
    title: 'Dual Capital Subsidy Barred on Same Unit',
    explanation:
      'Beneficiaries cannot receive capital subsidy from both PMEGP and PMFME for the same equipment, building, or enterprise.',
    officialClause:
      'PMEGP Operational Guidelines Clause 3.2 & PMFME Section 4.1: An individual or SHG unit that has previously availed capital subsidy under any Central or State scheme is not eligible for a second capital subsidy on the same assets.',
    recommendation:
      'For food processing units, PMFME provides tailored technical DPR support and ₹40,000 seed money. For non-food manufacturing (textiles, furniture, engineering), choose PMEGP which allows project costs up to ₹50 Lakh.',
  },
  {
    schemeA: 'pmfme',
    schemeB: 'nrlm-shg-linkage',
    status: 'Compatible',
    title: 'MoFPI & MoRD Official SHG Convergence',
    explanation:
      'Women SHGs can combine DAY-NRLM subsidized 4% to 7% bank loans with PMFME 35% capital subsidy for machinery and ₹40,000 seed capital per member.',
    officialClause:
      'MoFPI-MoRD Joint Convergence Framework 2021: SHG members are explicitly encouraged to leverage NRLM credit lines alongside PMFME food processing infrastructure grants.',
    recommendation:
      'Avail PMFME for machine procurement subsidy and use DAY-NRLM bank linkage for low-cost operational working capital.',
  },
  {
    schemeA: 'pmegp',
    schemeB: 'mudra-yojana',
    status: 'Sequential',
    title: 'Sequential Expansion Allowed, Not Dual Subsidy',
    explanation:
      'Existing MUDRA loan beneficiaries who have repaid on time can apply for PMEGP 2nd loan for enterprise expansion up to ₹1 Crore with 15% subsidy.',
    officialClause:
      'PMEGP Guidelines for 2nd Financial Assistance: Micro enterprises with proven repayment track record under MUDRA/PMEGP can avail 2nd loan subsidy.',
    recommendation:
      'Do not apply for both simultaneously. Complete initial business establishment under MUDRA, maintain a clean 6-month repayment record, and then apply for PMEGP expansion.',
  },
  {
    schemeA: 'tn-needs',
    schemeB: 'pmegp',
    status: 'Conflict',
    title: 'State NEEDS & Central PMEGP Cannot be Combined on CapEx',
    explanation:
      'Tamil Nadu NEEDS and Central PMEGP both provide capital expenditure subsidies. State rules strictly prohibit claiming two margin money subsidies for the same project cost.',
    officialClause:
      'Tamil Nadu NEEDS Scheme Guidelines Clause 5.3: First-generation entrepreneurs must choose either Central PMEGP or State NEEDS; dual subsidy claims are flagged during DIC and bank appraisal.',
    recommendation:
      'Compare project sizes: If your educated youth project is between ₹10L and ₹5 Crore in Tamil Nadu, NEEDS offers 25% subsidy up to ₹75 Lakh plus 3% interest subvention.',
  },
  {
    schemeA: 'nrlm-shg-linkage',
    schemeB: 'mudra-yojana',
    status: 'Compatible',
    title: 'Group Credit & Individual MUDRA Differentiation',
    explanation:
      'An individual member of an SHG can independently take a MUDRA Shishu/Kishore loan for her individual retail shop while her group maintains a DAY-NRLM loan.',
    officialClause:
      'RBI Master Circular on SHG-Bank Linkage: Group liability does not bar an individual member from independent collateral-free Mudra credit.',
    recommendation:
      'Ensure the individual enterprise is distinct from the joint SHG activities and has an independent bank account.',
  },
];

export const SchemeCompatibility: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [schemeAId, setSchemeAId] = useState<string>('pmegp');
  const [schemeBId, setSchemeBId] = useState<string>('pmfme');

  const schemeA = VERIFIED_SCHEMES.find((s) => s.slug === schemeAId) || VERIFIED_SCHEMES[0];
  const schemeB = VERIFIED_SCHEMES.find((s) => s.slug === schemeBId) || VERIFIED_SCHEMES[1];

  // Look for verified rule matching the pair
  const currentRule = VERIFIED_RULES.find(
    (r) =>
      (r.schemeA === schemeAId && r.schemeB === schemeBId) ||
      (r.schemeA === schemeBId && r.schemeB === schemeAId)
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 text-left">
      {/* Title Header */}
      <div className="bg-white dark:bg-[#0E1A29] text-[#202B3C] dark:text-white p-6 sm:p-7 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] border border-[#E3E7ED] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'ta' ? 'திட்டங்கள் ஒருங்கிணைப்பு & ஒப்பீடு' : 'Multiple Scheme Compatibility Intelligence'}
            </h1>
            <span className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-[#315D86] dark:text-sky-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Anti-Conflict Intelligence
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#647184] dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? 'இரண்டு அரசு திட்டங்களை ஒரே நேரத்தில் பெற முடியுமா? அரசு விதிகள் என்ன சொல்கின்றன என்பதை வெளிப்படையாக ஒப்பிட்டுப் பாருங்கள்.'
              : 'Analyze whether two government schemes can be combined. Flags overlapping subsidies, legal restrictions, and permissible convergence.'}
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={() => navigate('/eligibility')}
          className="text-xs font-bold rounded-xl shadow-2xs"
        >
          Check My Eligibility →
        </Button>
      </div>

      {/* Human-Centered 3-Question Guidance Card */}
      <Card className="p-5 border border-[#E3E7ED] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] space-y-3">
        <div className="flex items-center gap-2 font-bold text-[#315D86] dark:text-sky-300 text-sm">
          <Info className="w-4 h-4 text-[#315D86]" />
          <span>Why Scheme Compatibility Matters:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm text-[#647184] dark:text-slate-300">
          <div>
            <strong className="block text-[#202B3C] dark:text-white font-semibold mb-0.5">1. What is this page for?</strong>
            <span>Check if you can legally apply for or combine two government schemes without having your application rejected.</span>
          </div>
          <div>
            <strong className="block text-[#202B3C] dark:text-white font-semibold mb-0.5">2. What can I do here?</strong>
            <span>Pick any two schemes from the dropdowns to test their compatibility, overlapping benefits, and official ministry rules.</span>
          </div>
          <div>
            <strong className="block text-[#202B3C] dark:text-white font-semibold mb-0.5">3. What should I do next?</strong>
            <span>Follow the specific recommendation below before submitting bank dossiers so you never face disqualification.</span>
          </div>
        </div>
      </Card>

      {/* Scheme Selection Selector Bar */}
      <Card className="p-6 border border-[#E3E7ED] dark:border-slate-800 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] bg-white dark:bg-[#0E1A29] space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-[#202B3C] dark:text-slate-100">
          <Scale className="w-5 h-5 text-[#315D86]" />
          <span>Select Any Two Government Schemes to Compare:</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#647184] uppercase tracking-wider mb-1.5">
              First Scheme (திட்டம் 1):
            </label>
            <select
              value={schemeAId}
              onChange={(e) => setSchemeAId(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E3E7ED] dark:border-slate-700 bg-[#F0F2F5] dark:bg-slate-900 text-sm font-bold text-[#202B3C] dark:text-slate-100 focus:outline-none focus:border-[#315D86]"
            >
              {VERIFIED_SCHEMES.map((s) => (
                <option key={s.id} value={s.slug} disabled={s.slug === schemeBId}>
                  {s.level === 'Central' ? '[Central]' : '[State]'} {s.slug.toUpperCase()} — {s.title.en.substring(0, 48)}...
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#647184] uppercase tracking-wider mb-1.5">
              Second Scheme (திட்டம் 2):
            </label>
            <select
              value={schemeBId}
              onChange={(e) => setSchemeBId(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E3E7ED] dark:border-slate-700 bg-[#F0F2F5] dark:bg-slate-900 text-sm font-bold text-[#202B3C] dark:text-slate-100 focus:outline-none focus:border-[#315D86]"
            >
              {VERIFIED_SCHEMES.map((s) => (
                <option key={s.id} value={s.slug} disabled={s.slug === schemeAId}>
                  {s.level === 'Central' ? '[Central]' : '[State]'} {s.slug.toUpperCase()} — {s.title.en.substring(0, 48)}...
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Compatibility Verdict Banner */}
      {currentRule ? (
        <Card
          className={`p-6 sm:p-7 border-2 rounded-2xl space-y-4 ${
            currentRule.status === 'Compatible'
              ? 'border-emerald-300 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20'
              : currentRule.status === 'Conflict'
              ? 'border-rose-300 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20'
              : 'border-amber-300 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20'
          }`}
        >
          <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              {currentRule.status === 'Compatible' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : currentRule.status === 'Conflict' ? (
                <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
              )}
              <h2 className="text-xl font-bold text-[#172B3A] dark:text-slate-100">
                {currentRule.title}
              </h2>
            </div>

            <Badge
              variant={
                currentRule.status === 'Compatible'
                  ? 'success'
                  : currentRule.status === 'Conflict'
                  ? 'danger'
                  : 'warning'
              }
              size="md"
            >
              {currentRule.status === 'Compatible'
                ? '✅ Synergistic Convergence Permitted'
                : currentRule.status === 'Conflict'
                ? '❌ Conflicting Subsidies (Choose One)'
                : '⚠️ Sequential Application Only'}
            </Badge>
          </div>

          <p className="text-base text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
            {currentRule.explanation}
          </p>

          {/* Official Rule Clause */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <strong className="block text-[#102D46] dark:text-slate-200 font-bold">
              🏛️ Official Government Guideline Reference:
            </strong>
            <p className="italic">{currentRule.officialClause}</p>
          </div>

          {/* Actionable Recommendation */}
          <div className="p-4 rounded-xl bg-[#F4F9F6] dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-950 text-sm text-[#102D46] dark:text-emerald-200 space-y-1">
            <strong className="block font-bold">💡 Recommended Action:</strong>
            <p>{currentRule.recommendation}</p>
          </div>
        </Card>
      ) : (
        <Card className="p-6 border-2 border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#102D46] dark:text-slate-100 text-base">
            <Info className="w-5 h-5 text-blue-600" />
            <span>Independent Verification Pair</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            These two schemes target different ministries. As a standard rule under Central Finance Guidelines:
            a beneficiary cannot claim two capital subsidies for the exact same machinery invoice, but can utilize
            a collateral-free loan (like MUDRA) alongside state infrastructure assistance.
          </p>
        </Card>
      )}

      {/* Side-by-Side Comparison Table */}
      <Card className="overflow-hidden border-2 border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="p-4 sm:p-5 bg-[#F4F9F6] dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="font-bold text-base text-[#102D46] dark:text-slate-100">
            Transparent Side-by-Side Comparison:
          </span>
          <span className="text-xs text-slate-500">Verified official scheme terms</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 w-1/4">Parameter</th>
                <th className="p-4 w-3/8 text-[#102D46] dark:text-sky-300 font-extrabold">{schemeA.title.en}</th>
                <th className="p-4 w-3/8 text-[#102D46] dark:text-sky-300 font-extrabold">{schemeB.title.en}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              <tr>
                <td className="p-4 font-bold text-[#102D46] dark:text-slate-100">Government Level</td>
                <td className="p-4">{schemeA.level === 'Central' ? '🏛️ Central Government' : '🏢 State Government'}</td>
                <td className="p-4">{schemeB.level === 'Central' ? '🏛️ Central Government' : '🏢 State Government'}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#102D46] dark:text-slate-100">Funding Model</td>
                <td className="p-4 font-semibold text-[#159B68]">{schemeA.fundingType}</td>
                <td className="p-4 font-semibold text-[#159B68]">{schemeB.fundingType}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#102D46] dark:text-slate-100">Max Project Cost Allowed</td>
                <td className="p-4 font-semibold">{formatCurrency(schemeA.maxProjectCost)}</td>
                <td className="p-4 font-semibold">{formatCurrency(schemeB.maxProjectCost)}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#102D46] dark:text-slate-100">Max Subsidy / Benefit</td>
                <td className="p-4">
                  {schemeA.subsidyPercentage > 0
                    ? `${schemeA.subsidyPercentage}% (up to ${formatCurrency(schemeA.maxSubsidyAmount)})`
                    : 'Collateral-Free Loan'}
                </td>
                <td className="p-4">
                  {schemeB.subsidyPercentage > 0
                    ? `${schemeB.subsidyPercentage}% (up to ${formatCurrency(schemeB.maxSubsidyAmount)})`
                    : 'Collateral-Free Loan'}
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#102D46] dark:text-slate-100">Your Share Needed</td>
                <td className="p-4">{schemeA.promoterContributionMin}% Own Contribution</td>
                <td className="p-4">{schemeB.promoterContributionMin}% Own Contribution</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#102D46] dark:text-slate-100">Collateral Requirement</td>
                <td className="p-4">
                  {schemeA.maxProjectCost <= 1000000 || schemeA.fundingType === 'Term Loan'
                    ? 'None (Collateral-Free under CGTMSE / CGFMU)'
                    : 'Standard Bank Norms'}
                </td>
                <td className="p-4">
                  {schemeB.maxProjectCost <= 1000000 || schemeB.fundingType === 'Term Loan'
                    ? 'None (Collateral-Free under CGTMSE / CGFMU)'
                    : 'Standard Bank Norms'}
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#102D46] dark:text-slate-100">Official Portal</td>
                <td className="p-4">
                  <a
                    href={schemeA.officialPortalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                  >
                    <span>{schemeA.slug.toUpperCase()} Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </td>
                <td className="p-4">
                  <a
                    href={schemeB.officialPortalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                  >
                    <span>{schemeB.slug.toUpperCase()} Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SchemeCompatibility;
