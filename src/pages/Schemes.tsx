import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Scale,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Calendar,
  Building2,
  Info,
} from 'lucide-react';
import { VERIFIED_SCHEMES } from '../data/mockData';
import type { Scheme } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useNavigate, useSearchParams } from 'react-router-dom';

const BUSINESS_CATEGORIES = [
  { id: 'All', labelEn: 'All Schemes', labelTa: 'அனைத்து திட்டங்கள்', icon: '🌟' },
  { id: 'Agriculture', labelEn: 'Farming', labelTa: 'விவசாயம்', icon: '🌾' },
  { id: 'Food Processing', labelEn: 'Food Making', labelTa: 'உணவு தயாரிப்பு', icon: '🍲' },
  { id: 'Textiles & Handloom', labelEn: 'Weaving & Clothes', labelTa: 'நெசவு & கைத்தறி', icon: '🧵' },
  { id: 'Handicrafts', labelEn: 'Handicrafts & Arts', labelTa: 'கைவினைப் பொருட்கள்', icon: '🎨' },
  { id: 'Retail', labelEn: 'Small Shops', labelTa: 'சிறு கடைகள்', icon: '🏪' },
];

export const Schemes: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFundingType, setSelectedFundingType] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>('All');
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('gramavance_saved_schemes');
    return saved ? JSON.parse(saved) : ['sch_pmfme_02'];
  });
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(() => {
    if (typeof window === 'undefined') return null;
    const query = new URLSearchParams(window.location.search).get('search') || new URLSearchParams(window.location.search).get('scheme');
    if (!query) return null;
    const qLower = query.toLowerCase();
    return (
      VERIFIED_SCHEMES.find(
        (s) =>
          s.slug.toLowerCase() === qLower ||
          s.id.toLowerCase() === qLower ||
          s.slug.toLowerCase().includes(qLower)
      ) ?? null
    );
  });
  const [showAdvancedInModal, setShowAdvancedInModal] = useState(false);
  const [compareSchemeIds, setCompareSchemeIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Auto-detect and open scheme if query param changes dynamically
  useEffect(() => {
    const query = searchParams.get('search') || searchParams.get('scheme');
    if (query) {
      const qLower = query.toLowerCase();
      const matched = VERIFIED_SCHEMES.find(
        (s) =>
          s.slug.toLowerCase() === qLower ||
          s.id.toLowerCase() === qLower ||
          s.slug.toLowerCase().includes(qLower)
      );
      if (matched) {
        // oxlint-disable-next-line react/set-state-in-effect
        setSelectedScheme((prev) => (prev?.id === matched.id ? prev : matched));
      } else {
        setSearchTerm((prev) => (prev === query ? prev : query));
      }
    }
  }, [searchParams]);

  const toggleSaveScheme = (id: string) => {
    setSavedSchemeIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('gramavance_saved_schemes', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleCompare = (id: string) => {
    if (compareSchemeIds.includes(id)) {
      setCompareSchemeIds(compareSchemeIds.filter((item) => item !== id));
    } else {
      if (compareSchemeIds.length >= 3) {
        alert('You can compare up to 3 schemes at a time.');
        return;
      }
      setCompareSchemeIds([...compareSchemeIds, id]);
    }
  };

  const filteredSchemes = useMemo(() => {
    return VERIFIED_SCHEMES.filter((scheme) => {
      const titleText = (scheme.title[language] || scheme.title.en).toLowerCase();
      const descText = (scheme.shortDescription[language] || scheme.shortDescription.en).toLowerCase();
      const query = searchTerm.toLowerCase();

      const matchesSearch =
        titleText.includes(query) ||
        scheme.department.toLowerCase().includes(query) ||
        scheme.ministry.toLowerCase().includes(query) ||
        descText.includes(query);

      const matchesFunding =
        selectedFundingType === 'All' || scheme.fundingType === selectedFundingType;

      const matchesCategory =
        selectedCategory === 'All' || scheme.businessCategories.includes(selectedCategory);

      const matchesLevel =
        selectedLevel === 'All' || scheme.level === selectedLevel;

      const matchesBeneficiary =
        selectedBeneficiary === 'All' ||
        scheme.applicantTypes.includes(selectedBeneficiary as any);

      return matchesSearch && matchesFunding && matchesCategory && matchesLevel && matchesBeneficiary;
    });
  }, [searchTerm, selectedFundingType, selectedCategory, selectedLevel, selectedBeneficiary, language]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const comparedSchemes = VERIFIED_SCHEMES.filter((s) => compareSchemeIds.includes(s.id));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="bg-white dark:bg-[#0E1A29] text-[#202B3C] dark:text-white p-6 sm:p-7 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] border border-[#E3E7ED] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'ta' ? 'அரசு நிதி உதவி திட்டங்கள்' : 'Government Help for Your Business'}
            </h1>
            <span className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-[#43836F] dark:text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Verified Public Schemes
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#647184] dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? 'அரசு மானியங்கள், குறைந்த வட்டி வங்கிக் கடன்கள் மற்றும் இயந்திர உதவிகளை எளிதாகக் கண்டறியுங்கள்.'
              : 'Find non-repayable government subsidies, low-interest bank loans, and equipment support.'}
          </p>
        </div>

        {compareSchemeIds.length > 0 && (
          <Button
            variant="teal"
            size="lg"
            leftIcon={<Scale className="w-4 h-4" />}
            onClick={() => setShowCompareModal(true)}
            className="font-bold min-h-[46px] px-5 rounded-xl shadow-xs"
          >
            Compare ({compareSchemeIds.length}/3)
          </Button>
        )}
      </div>

      {/* Demonstration Data & Educational Notice (Phase 5A) */}
      <div className="p-4 rounded-xl bg-[#F0F2F5] dark:bg-slate-900 border border-[#E3E7ED] dark:border-slate-800 text-xs sm:text-sm text-[#202B3C] dark:text-slate-300 flex items-start gap-3 shadow-2xs">
        <Info className="w-5 h-5 text-[#315D86] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#202B3C] dark:text-white">Demonstration & Educational Notice:</strong> All scheme details, subsidy rates, and required
          documents shown here reflect official government gazettes (MoMSME, MoFPI, MoRD, MoF) as of March 2026.
          Final sanction and loan approvals are decided strictly by the competent government district committees and financing banks.
        </div>
      </div>

      {/* Category Selection Buttons (Large, Tap-Friendly) */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#647184] uppercase tracking-wider block">
          Choose Your Work Type:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {BUSINESS_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between min-h-[76px] transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'border-[#315D86] bg-blue-50/70 dark:bg-blue-950/40 text-[#315D86] dark:text-sky-300 font-bold shadow-xs'
                    : 'border-[#E3E7ED] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#202B3C] dark:text-slate-300 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <span className="text-xl mb-1">{cat.icon}</span>
                <span className="text-xs sm:text-sm font-semibold leading-tight">
                  {language === 'ta' ? cat.labelTa : cat.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Human-Centered 3-Question Guidance Card */}
      <Card className="p-5 border border-[#E3E7ED] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] space-y-3">
        <div className="flex items-center gap-2 font-bold text-[#315D86] dark:text-sky-300 text-sm">
          <Info className="w-4 h-4 text-[#315D86]" />
          <span>
            {language === 'ta' ? 'இப்பக்கத்தின் முக்கிய வழிகாட்டுதல்:' : 'About This Directory:'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm text-[#647184] dark:text-slate-300">
          <div>
            <strong className="block text-[#202B3C] dark:text-white font-semibold mb-0.5">
              {language === 'ta' ? '1. இப்பக்கம் எதற்காக?' : '1. What is this page for?'}
            </strong>
            <span>
              {language === 'ta'
                ? 'விவசாயிகள், மகளிர் குழுக்கள் மற்றும் கிராமப்புறத் தொழில்களுக்கான மத்திய மற்றும் மாநில அரசு உதவித் திட்டங்களை அறியலாம்.'
                : 'Browse verified Central and State government schemes offering capital subsidies, low-interest bank loans, and grants.'}
            </span>
          </div>
          <div>
            <strong className="block text-[#202B3C] dark:text-white font-semibold mb-0.5">
              {language === 'ta' ? '2. இங்கு நீங்கள் என்ன செய்யலாம்?' : '2. What can I do here?'}
            </strong>
            <span>
              {language === 'ta'
                ? 'தொழில் வகை, அரசு நிலை அல்லது பயனாளி அடிப்படையில் தேடலாம்; 3 திட்டங்கள் வரை பக்கவாட்டில் ஒப்பிட்டுப் பார்க்கலாம்.'
                : 'Search by scheme name, filter by Central or State level and applicant category, or select up to 3 schemes to compare side-by-side.'}
            </span>
          </div>
          <div>
            <strong className="block text-[#202B3C] dark:text-white font-semibold mb-0.5">
              {language === 'ta' ? '3. அடுத்த நடவடிக்கை என்ன?' : '3. What should I do next?'}
            </strong>
            <span>
              {language === 'ta'
                ? 'திட்ட விவரங்களைத் திறந்து தேவையான ஆவணங்களைப் பார்க்கவும், அல்லது தகுதி அறிய "என் தகுதியை அறிய" பகுதிக்குச் செல்லவும்.'
                : 'Click "View Details" on any scheme for the official application link, or check your qualification in "Check My Eligibility".'}
            </span>
          </div>
        </div>
      </Card>

      {/* Search and Simple Filter Bar */}
      <Card className="p-4 sm:p-5 border border-[#E3E7ED] dark:border-slate-800 shadow-[0_4px_18px_rgba(32,43,60,0.05)] rounded-2xl">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#647184]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keyword (e.g. PMEGP, PMFME, food, sewing, grinder, dairy, loan)..."
              className="w-full min-h-[46px] pl-11 pr-4 text-sm sm:text-base bg-[#F0F2F5] dark:bg-slate-800 border border-[#E3E7ED] dark:border-slate-700 rounded-xl text-[#202B3C] dark:text-slate-100 placeholder-[#647184] focus:outline-none focus:border-[#315D86] shadow-[inset_0_2px_4px_rgba(32,43,60,0.02)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Level Filter: Central vs State */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="min-h-[46px] px-3.5 text-sm font-medium rounded-xl bg-[#F0F2F5] dark:bg-slate-800 border border-[#E3E7ED] dark:border-slate-700 text-[#202B3C] dark:text-slate-200 focus:outline-none focus:border-[#315D86]"
            >
              <option value="All">All Govt Levels (Central & State)</option>
              <option value="Central">Central Govt Schemes</option>
              <option value="State">State Govt Schemes</option>
            </select>

            {/* Beneficiary Filter */}
            <select
              value={selectedBeneficiary}
              onChange={(e) => setSelectedBeneficiary(e.target.value)}
              className="min-h-[46px] px-3.5 text-sm font-medium rounded-xl bg-[#F0F2F5] dark:bg-slate-800 border border-[#E3E7ED] dark:border-slate-700 text-[#202B3C] dark:text-slate-200 focus:outline-none focus:border-[#315D86]"
            >
              <option value="All">All Beneficiaries</option>
              <option value="shg">Women Self-Help Groups (SHG)</option>
              <option value="farmer_producer">Farmers & Producers</option>
              <option value="individual_entrepreneur">Individual Entrepreneurs</option>
              <option value="artisan">Artisans & Weavers</option>
            </select>

            {/* Funding Type Filter */}
            <select
              value={selectedFundingType}
              onChange={(e) => setSelectedFundingType(e.target.value)}
              className="min-h-[46px] px-3.5 text-sm font-medium rounded-xl bg-[#F0F2F5] dark:bg-slate-800 border border-[#E3E7ED] dark:border-slate-700 text-[#202B3C] dark:text-slate-200 focus:outline-none focus:border-[#315D86]"
            >
              <option value="All">All Types of Help</option>
              <option value="Capital Subsidy">Government Subsidy (Free Grant)</option>
              <option value="Interest Subvention">Low Interest Bank Loan (Subvention)</option>
              <option value="Term Loan">Bank Business Loan (Collateral-Free)</option>
              <option value="Grant">Direct Income Support (Grant)</option>
            </select>

            {(searchTerm || selectedFundingType !== 'All' || selectedCategory !== 'All' || selectedLevel !== 'All' || selectedBeneficiary !== 'All') && (
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFundingType('All');
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                  setSelectedBeneficiary('All');
                }}
                className="text-rose-600 hover:text-rose-700 font-semibold min-h-[44px]"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-[#647184] pt-3 mt-3 border-t border-[#E3E7ED] dark:border-slate-800">
          <span>Found <strong className="text-[#202B3C] dark:text-white">{filteredSchemes.length}</strong> government schemes</span>
          <span>Filtered by Level: <strong className="text-[#202B3C] dark:text-white">{selectedLevel}</strong> • Beneficiary: <strong className="text-[#202B3C] dark:text-white">{selectedBeneficiary}</strong></span>
        </div>
      </Card>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-500">
            <p className="text-lg font-semibold">No schemes match your filters</p>
            <p className="text-sm mt-1">Try adjusting your category or search term</p>
            <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedFundingType('All'); }} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              Clear Filters
            </button>
          </div>
        )}
        {filteredSchemes.map((scheme) => {
          const isSaved = savedSchemeIds.includes(scheme.id);
          const isComparing = compareSchemeIds.includes(scheme.id);

          return (
            <Card
              key={scheme.id}
              className="flex flex-col justify-between hover:border-[#315D86] transition-all p-5 sm:p-6 space-y-4 border border-[#E3E7ED] dark:border-slate-800 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] neu-card-hover bg-white dark:bg-[#0E1A29]"
            >
              <div className="space-y-3.5 text-left">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="teal" size="md">
                    {scheme.fundingType === 'Capital Subsidy'
                      ? 'Government Subsidy (Grant)'
                      : scheme.fundingType === 'Interest Subvention'
                      ? 'Low-Interest Loan'
                      : scheme.fundingType}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleCompare(scheme.id)}
                      className={`p-2 rounded-xl border text-xs transition-all active:scale-95 cursor-pointer ${
                        isComparing
                          ? 'bg-[#315D86] text-white border-[#315D86]'
                          : 'text-[#647184] hover:text-[#315D86] border-[#E3E7ED] dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                      title={isComparing ? 'Remove from comparison' : 'Compare with other schemes'}
                    >
                      <Scale className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleSaveScheme(scheme.id)}
                      className="p-2 rounded-xl border border-[#E3E7ED] dark:border-slate-700 text-[#647184] hover:text-amber-500 bg-white dark:bg-slate-800 transition-all active:scale-95 cursor-pointer"
                      title={isSaved ? 'Scheme saved' : 'Save for later'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#202B3C] dark:text-slate-100 line-clamp-2 leading-snug">
                  {scheme.title[language] || scheme.title.en}
                </h3>

                <p className="text-sm text-[#647184] dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {scheme.shortDescription[language] || scheme.shortDescription.en}
                </p>

                {/* Plain-Language Highlights Box */}
                <div className="p-4 bg-[#F0F2F5] dark:bg-slate-800/80 rounded-xl space-y-2 text-sm border border-[#E3E7ED] dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-[#647184] dark:text-slate-300 font-medium">💰 Government Help:</span>
                    <strong className="text-[#43836F] font-bold text-base">
                      {scheme.subsidyPercentage > 0
                        ? `Up to ${scheme.subsidyPercentage}% (${formatCurrency(scheme.maxSubsidyAmount)})`
                        : 'Low-Interest Loan (No Collateral)'}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Your Share Needed:</span>
                    <strong className="text-slate-700 dark:text-slate-300">
                      Only {scheme.promoterContributionMin}% from you
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Total Business Cost:</span>
                    <strong className="text-slate-700 dark:text-slate-300">
                      Up to {formatCurrency(scheme.maxProjectCost)}
                    </strong>
                  </div>
                </div>

                {/* Verification Date & Department (Phase 5A requirement) */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1 truncate max-w-[65%]">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{scheme.department}</span>
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Verified: {scheme.verificationDate}</span>
                  </span>
                </div>
              </div>

              {/* Large Action Buttons (Min 44-48px touch targets) */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setSelectedScheme(scheme)}
                  className="w-full sm:w-auto flex-1 min-h-[44px] text-sm font-semibold rounded-xl"
                >
                  View Details
                </Button>
                <Button
                  variant="teal"
                  size="md"
                  onClick={() => navigate(`/eligibility?scheme=${scheme.slug}`)}
                  className="w-full sm:w-auto flex-1 min-h-[44px] text-sm font-bold rounded-xl"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Check If I Qualify
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detail Modal with 2-Level Information Hierarchy */}
      {selectedScheme && (
        <Modal
          isOpen={!!selectedScheme}
          onClose={() => {
            setSelectedScheme(null);
            setShowAdvancedInModal(false);
          }}
          title={selectedScheme.title[language] || selectedScheme.title.en}
          description={`${selectedScheme.ministry} • ${selectedScheme.department}`}
          size="lg"
          footer={
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setSelectedScheme(null);
                  setShowAdvancedInModal(false);
                }}
                className="w-full sm:w-auto rounded-xl min-h-[42px] px-5 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Close
              </Button>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                <a
                  href={selectedScheme.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-[#102D46] dark:text-teal-400 font-semibold hover:underline flex items-center gap-1 py-1"
                >
                  Visit Official Portal <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <Button
                  variant="teal"
                  size="md"
                  onClick={() => {
                    const slug = selectedScheme.slug;
                    setSelectedScheme(null);
                    navigate(`/eligibility?scheme=${slug}`);
                  }}
                  className="w-full sm:w-auto bg-[#159B68] hover:bg-emerald-700 text-white font-bold min-h-[42px] px-5 rounded-xl cursor-pointer"
                >
                  Check If I Qualify →
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-5 text-base text-left">
            {/* Quick Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#F4F9F6] dark:bg-slate-800 rounded-xl border border-emerald-100 dark:border-slate-700">
              <div>
                <span className="text-xs text-slate-500 block">Government Subsidy</span>
                <strong className="text-lg text-[#159B68] font-bold">
                  {selectedScheme.subsidyPercentage > 0
                    ? `${selectedScheme.subsidyPercentage}%`
                    : 'Low Interest'}
                </strong>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Max Money Available</span>
                <strong className="text-lg text-[#102D46] dark:text-slate-100 font-bold">
                  {formatCurrency(selectedScheme.maxSubsidyAmount || selectedScheme.maxProjectCost)}
                </strong>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Your Own Contribution</span>
                <strong className="text-lg text-slate-700 dark:text-slate-300 font-bold">
                  {selectedScheme.promoterContributionMin}%
                </strong>
              </div>
            </div>

            {/* Level 1: What this scheme does */}
            <div>
              <h4 className="font-bold text-[#102D46] dark:text-slate-100 mb-1.5 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#159B68]" />
                What this scheme helps with:
              </h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                {selectedScheme.overview[language] || selectedScheme.overview.en}
              </p>
            </div>

            {/* Level 1: Who may qualify */}
            <div>
              <h4 className="font-bold text-[#102D46] dark:text-slate-100 mb-2 text-base">
                Who may qualify:
              </h4>
              <ul className="space-y-1.5 list-disc pl-5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                {selectedScheme.eligibilityCriteria.map((crit, i) => (
                  <li key={i}>{crit}</li>
                ))}
              </ul>
            </div>

            {/* Level 1: Key Benefits in Simple Words */}
            <div>
              <h4 className="font-bold text-[#102D46] dark:text-slate-100 mb-2 text-base">
                Benefits under official rules:
              </h4>
              <ul className="space-y-1.5 list-disc pl-5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                {selectedScheme.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>

            {/* Level 1: Papers you need */}
            <div>
              <h4 className="font-bold text-[#102D46] dark:text-slate-100 mb-2 text-base">
                Required Documents:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedScheme.requiredDocuments.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#159B68] shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Level 2: Advanced Official Rules (Collapsible) */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
              <button
                onClick={() => setShowAdvancedInModal(!showAdvancedInModal)}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#159B68] flex items-center gap-1 cursor-pointer"
              >
                {showAdvancedInModal ? (
                  <>
                    <ChevronUp className="w-4 h-4" /> Hide Advanced Technical Guidelines & Gazette Info
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" /> Show Advanced Technical Guidelines & Gazette Info
                  </>
                )}
              </button>

              {showAdvancedInModal && (
                <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-2 text-slate-600 dark:text-slate-300">
                  <p>
                    <strong>Ministry / Nodal Body:</strong> {selectedScheme.ministry} (
                    {selectedScheme.department})
                  </p>
                  <p>
                    <strong>Funding Mechanism:</strong> {selectedScheme.fundingType} under central/state
                    shared allocation.
                  </p>
                  <p>
                    <strong>Maximum Project Cost:</strong> {formatCurrency(selectedScheme.maxProjectCost)}
                  </p>
                  <p>
                    <strong>Official Verification Date:</strong> {selectedScheme.verificationDate}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Comparison Modal */}
      {showCompareModal && (
        <Modal
          isOpen={showCompareModal}
          onClose={() => setShowCompareModal(false)}
          title="Compare Government Schemes"
          description="Side-by-side comparison of benefits, funding amounts, and required contributions."
          size="xl"
          footer={
            <div className="w-full flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setCompareSchemeIds([]);
                  setShowCompareModal(false);
                }}
                className="cursor-pointer font-semibold rounded-xl text-slate-700 dark:text-slate-200"
              >
                Clear Selection
              </Button>
              <Button
                variant="teal"
                size="md"
                onClick={() => setShowCompareModal(false)}
                className="bg-[#159B68] hover:bg-emerald-700 text-white font-bold cursor-pointer rounded-xl px-6"
              >
                Close Comparison
              </Button>
            </div>
          }
        >
          <div className="overflow-x-auto text-left">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 dark:border-slate-800">
                  <th className="p-3 font-semibold text-slate-500 w-44">Details</th>
                  {comparedSchemes.map((s) => (
                    <th key={s.id} className="p-3 font-bold text-[#102D46] dark:text-slate-100">
                      {s.title[language] || s.title.en}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-3 font-medium text-slate-500">Government Ministry</td>
                  {comparedSchemes.map((s) => (
                    <td key={s.id} className="p-3 text-slate-700 dark:text-slate-300">
                      {s.department}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-500">Government Subsidy</td>
                  {comparedSchemes.map((s) => (
                    <td key={s.id} className="p-3 font-bold text-[#159B68]">
                      {s.subsidyPercentage > 0
                        ? `${s.subsidyPercentage}% (Up to ${formatCurrency(s.maxSubsidyAmount)})`
                        : 'Low-Interest Bank Loan'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-500">Your Share Needed</td>
                  {comparedSchemes.map((s) => (
                    <td key={s.id} className="p-3 font-semibold">
                      Min {s.promoterContributionMin}%
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-500">Maximum Project Cost</td>
                  {comparedSchemes.map((s) => (
                    <td key={s.id} className="p-3 font-semibold">
                      {formatCurrency(s.maxProjectCost)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-500">Official Portal</td>
                  {comparedSchemes.map((s) => (
                    <td key={s.id} className="p-3">
                      <a
                        href={s.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#159B68] font-bold hover:underline inline-flex items-center gap-1"
                      >
                        Visit Portal <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
};
