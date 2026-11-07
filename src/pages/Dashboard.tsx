import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Landmark,
  FileCheck2,
  FolderLock,
  Volume2,
  ShieldCheck,
  PhoneCall,
  Info,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { VERIFIED_SCHEMES, MOCK_APPLICATIONS } from '../data/mockData';

export const Dashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [isSpeakingWelcome, setIsSpeakingWelcome] = useState(false);
  const [showTermHelp, setShowTermHelp] = useState(false);

  // Play audio greeting in selected language at a slow, clear pace
  const handleVoiceWelcome = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      let text = '';
      let langCode = 'en-IN';

      if (language === 'ta') {
        text =
          'வணக்கம்! கிராமாவான்ஸ் தங்களுக்கு நல்வரவு கூறுகிறது. அரசு உதவிகளைப் பெறவும், உங்கள் ஆவணங்களைச் சரிபார்க்கவும் நாங்கள் உதவுகிறோம். உங்களுக்கு என்ன உதவி தேவை என்பதை கீழே உள்ள விருப்பங்களில் ஒன்றைத் தேர்வு செய்யுங்கள்.';
        langCode = 'ta-IN';
      } else if (language === 'hi') {
        text =
          'नमस्ते! ग्रामावांस में आपका स्वागत है। हम सरकारी सहायता खोजने, दस्तावेज़ सुरक्षित रखने और आपका व्यवसाय बढ़ाने में मदद करते हैं। कृपया नीचे दिए गए विकल्पों में से चुनें।';
        langCode = 'hi-IN';
      } else {
        text =
          'Vanakkam! Welcome to Gramavance. We help you find government support and grow your business. What would you like help with today? Please select any option below.';
        langCode = 'en-IN';
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.85;
      utterance.onstart = () => setIsSpeakingWelcome(true);
      utterance.onend = () => setIsSpeakingWelcome(false);
      utterance.onerror = () => setIsSpeakingWelcome(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Voice assistance demo activated. Web Speech synthesis is not supported on this browser.');
    }
  };

  // 3 Core Action Cards (shadcn/ui Minimal Grid)
  const threeMainCards = [
    {
      id: 'srv_schemes',
      title: language === 'ta' ? 'அரசு திட்டங்கள் & மானியங்கள்' : 'Find Government Help',
      description:
        language === 'ta'
          ? 'உங்கள் விவசாயம், கடை அல்லது தொழிலுக்கான அரசு மானியங்கள் மற்றும் குறைந்த வட்டிக் கடன்களை அறியுங்கள்.'
          : 'Discover grants, capital subsidies, and low-interest loans for your farm, shop, or rural enterprise.',
      icon: Landmark,
      route: '/schemes',
    },
    {
      id: 'srv_applications',
      title: language === 'ta' ? 'விண்ணப்ப நிலை சரிபார்ப்பு' : 'Check My Application',
      description:
        language === 'ta'
          ? 'உங்கள் விண்ணப்பம் ஏற்றுக்கொள்ளப்பட்டதா அல்லது கூடுதல் ஆவணங்கள் தேவையா என்பதை எளிதாகப் பாருங்கள்.'
          : 'Track submission stage, verify approval milestones, and see if any required papers are missing.',
      icon: FileCheck2,
      route: '/applications',
    },
    {
      id: 'srv_vault',
      title: language === 'ta' ? 'ஆவணங்கள் பாதுகாப்பு பெட்டகம்' : 'Get Help with Documents',
      description:
        language === 'ta'
          ? 'உங்கள் ஆதார் அட்டை, வங்கி கணக்கு புத்தகம் மற்றும் பட்டா சான்றிதழ்களைப் பாதுகாப்பாக வையுங்கள்.'
          : 'Securely manage your Aadhaar, bank passbooks, and land papers for fast, pre-filled applications.',
      icon: FolderLock,
      route: '/documents',
    },
  ];

  const primaryScheme = VERIFIED_SCHEMES[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* 1. Hero Section (shadcn / Vercel Monochromatic Surface) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 shadow-sm flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>{t('officialGovtWebsite')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
            {language === 'ta'
              ? 'வணக்கம்! கிராமாவான்ஸ் தங்களுக்கு நல்வரவு கூறுகிறது.'
              : 'Vanakkam! Welcome to Gramavance.'}
          </h1>

          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? 'அரசு திட்டங்களை அறிந்து கொள்ளவும், உங்கள் தொழிலை எளிதாக விரிவுபடுத்தவும் நாங்கள் உதவுகிறோம்.'
              : 'We help you find government support and grow your business with structured, transparent, and accessible guidance.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={handleVoiceWelcome}
              className={`h-9 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors shadow-sm cursor-pointer ${
                isSpeakingWelcome
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-slate-900 text-slate-50 hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200'
              }`}
              title="Click to hear spoken voice guidance"
            >
              <Volume2 className="w-4 h-4 shrink-0" />
              <span>
                {isSpeakingWelcome
                  ? 'Playing Guidance...'
                  : language === 'ta'
                  ? 'தமிழில் வழிகாட்டலைக் கேட்க'
                  : language === 'hi'
                  ? 'आवाज़ में जानकारी सुनें'
                  : 'Listen to Voice Guidance'}
              </span>
            </button>

            <button
              onClick={() => navigate('/eligibility')}
              className="h-9 px-4 py-2 rounded-md font-medium text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            >
              Find Government Financial Help →
            </button>
          </div>
        </div>

        {/* 2. Three Action Cards (Minimalist 1px Border Grid) */}
        <div>
          <div className="mb-4 text-left">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
              {t('whatHelpToday')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Select an action below to discover schemes, review submissions, or organize papers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {threeMainCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => navigate(card.route)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between text-left cursor-pointer group"
                >
                  <div>
                    {/* Minimal Icon */}
                    <div className="p-2.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 w-fit border border-slate-200/60 dark:border-slate-700/60">
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mt-4 tracking-tight">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Clean text link */}
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-900 dark:text-slate-200 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    <span>Explore Service</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Plain Language Terminology Helper */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-sm text-left space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
              <Info className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
              <span>Understanding Common Government Terms</span>
            </div>
            <button
              onClick={() => setShowTermHelp(!showTermHelp)}
              className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 cursor-pointer transition-colors"
            >
              {showTermHelp ? 'Hide Explanations' : 'Show Everyday Explanations'}
            </button>
          </div>

          {showTermHelp && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-1">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-50 block">
                  What does "Subsidy" mean?
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t('subsidyTerm')}
                </p>
              </div>
              <div className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-1">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-50 block">
                  What does "Collateral" mean?
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t('collateralTerm')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 4. Recommended Scheme (PMEGP Spotlight) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-7 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 text-left">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase tracking-wide">
                Recommended
              </span>
              <span className="text-xs text-slate-400">Official Public Gazette</span>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
              {primaryScheme.title[language] || primaryScheme.title.en}
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Up to 35% non-repayable government capital subsidy for machinery and rural enterprise setup, requiring only 5% to 10% own equity contribution.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={() => navigate('/eligibility')}
              className="w-full md:w-auto h-9 px-4 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 font-medium text-sm transition-colors shadow-sm cursor-pointer"
            >
              Check If I Qualify →
            </button>
          </div>
        </div>

        {/* 5. Active Applications Tracker */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                My Active Applications
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live verification tracker for pending government submissions
              </p>
            </div>

            <button
              onClick={() => navigate('/applications')}
              className="text-xs font-medium text-slate-900 dark:text-slate-200 hover:underline cursor-pointer"
            >
              View All Applications →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {MOCK_APPLICATIONS.slice(0, 2).map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-500">{app.applicationNumber}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                    {app.status}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {app.schemeTitle}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {app.notes}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 font-medium">
                  <span>Requested: ₹{(app.requestedAmount / 100000).toFixed(1)} Lakh</span>
                  <span className="text-slate-700 dark:text-slate-300">Target: {app.targetDeadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Toll-Free Helpline Strip */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 border border-slate-200/60 dark:border-slate-700/60 shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Toll-Free Government Support Desk
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Dial <strong className="text-slate-900 dark:text-slate-100">1800-3000-0034</strong> for toll-free voice assistance across all districts.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/help')}
            className="h-9 px-4 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs sm:text-sm transition-colors shadow-sm shrink-0 cursor-pointer"
          >
            View Directory
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
