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
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { VERIFIED_SCHEMES, MOCK_APPLICATIONS } from '../data/mockData';

export const Dashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [isSpeakingWelcome, setIsSpeakingWelcome] = useState(false);
  const [showTermHelp, setShowTermHelp] = useState(false);

  // Spoken voice guidance in selected language
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

  // Three Core Action Cards (Premium Neo-Bank / SaaS Grid)
  const threeMainCards = [
    {
      id: 'srv_schemes',
      title: language === 'ta' ? 'அரசு திட்டங்கள் & மானியங்கள்' : 'Find Government Schemes',
      description:
        language === 'ta'
          ? 'உங்கள் விவசாயம், கடை அல்லது தொழிலுக்கான அரசு மானியங்கள் மற்றும் குறைந்த வட்டிக் கடன்களை அறியுங்கள்.'
          : 'Discover capital subsidies, low-interest bank loans, and machinery support for your rural business.',
      icon: Landmark,
      route: '/schemes',
    },
    {
      id: 'srv_applications',
      title: language === 'ta' ? 'விண்ணப்ப நிலை சரிபார்ப்பு' : 'Track Active Applications',
      description:
        language === 'ta'
          ? 'உங்கள் விண்ணப்பம் ஏற்றுக்கொள்ளப்பட்டதா அல்லது கூடுதல் ஆவணங்கள் தேவையா என்பதை எளிதாகப் பாருங்கள்.'
          : 'Monitor submission milestones, bank review stages, and identify any missing papers immediately.',
      icon: FileCheck2,
      route: '/applications',
    },
    {
      id: 'srv_vault',
      title: language === 'ta' ? 'ஆவணங்கள் பாதுகாப்பு பெட்டகம்' : 'Digital Document Vault',
      description:
        language === 'ta'
          ? 'உங்கள் ஆதார் அட்டை, வங்கி கணக்கு புத்தகம் மற்றும் பட்டா சான்றிதழ்களைப் பாதுகாப்பாக வையுங்கள்.'
          : 'Securely organize your Aadhaar, bank passbook, and land patta for instant, pre-filled scheme forms.',
      icon: FolderLock,
      route: '/documents',
    },
  ];

  const primaryScheme = VERIFIED_SCHEMES[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="space-y-6 max-w-6xl mx-auto pb-12 text-left">
        {/* 1. Welcoming Hero Banner (Clean SaaS White Card with Trust-Blue Focus) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm text-left transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{t('officialGovtWebsite')}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/60 shadow-2xs">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>Generative AI Assisted</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            {language === 'ta'
              ? 'வணக்கம்! கிராமாவான்ஸ் தங்களுக்கு நல்வரவு கூறுகிறது.'
              : 'Vanakkam! Welcome to Gramavance.'}
          </h1>

          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? 'அரசு திட்டங்களை அறிந்து கொள்ளவும், உங்கள் தொழிலை எளிதாக விரிவுபடுத்தவும் நாங்கள் உதவுகிறோம்.'
              : 'Empowering farmers, rural women, artisans, and entrepreneurs to discover schemes, manage documents, and secure funding.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={handleVoiceWelcome}
              className={`h-10 px-5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm ${
                isSpeakingWelcome
                  ? 'bg-rose-600 text-white shadow-rose-500/20'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20'
              }`}
              title="Listen to Spoken Voice Guidance"
            >
              <Volume2 className="w-4 h-4 shrink-0" />
              <span>
                {isSpeakingWelcome
                  ? 'Playing Guidance...'
                  : language === 'ta'
                  ? 'தமிழில் குரல் வழிகாட்டல்'
                  : language === 'hi'
                  ? 'आवाज़ में जानकारी सुनें'
                  : 'Listen to Voice Guidance'}
              </span>
            </button>

            <button
              onClick={() => navigate('/eligibility')}
              className="h-10 px-5 rounded-lg font-semibold text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              Check My Eligibility →
            </button>
          </div>
        </div>

        {/* 2. Three Action Cards (Crisp, Tactile SaaS Grid) */}
        <div>
          <div className="mb-4 text-left">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t('whatHelpToday')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Choose an action below to discover funding, verify your applications, or secure records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {threeMainCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => navigate(card.route)}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-all duration-300 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 hover:-translate-y-0.5 flex flex-col justify-between text-left cursor-pointer group"
                >
                  <div>
                    {/* Soft Rounded App Icon Badge */}
                    <div className="w-fit p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100/60 dark:border-blue-900/60 shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4 tracking-tight">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Gentle Link */}
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore Service <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Plain Language Terminology Helper Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 text-left space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
              <div className="p-1 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600">
                <Info className="w-4 h-4" />
              </div>
              <span>Everyday Language Guide for Complex Scheme Terms</span>
            </div>
            <button
              onClick={() => setShowTermHelp(!showTermHelp)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {showTermHelp ? 'Hide Explanations' : 'Show Everyday Explanations'}
            </button>
          </div>

          {showTermHelp && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  What does "Subsidy" mean?
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t('subsidyTerm')}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
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
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 font-semibold text-xs uppercase tracking-wide">
                Top Recommendation
              </span>
              <span className="text-xs text-slate-400 font-medium">Verified Government Gazette</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {primaryScheme.title[language] || primaryScheme.title.en}
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Receive up to 35% non-repayable government subsidy to purchase processing machines and launch your rural enterprise, requiring only 5% to 10% own equity.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={() => navigate('/eligibility')}
              className="w-full md:w-auto h-10 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
            >
              Check If I Qualify →
            </button>
          </div>
        </div>

        {/* 5. Active Applications Tracker */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                My Active Applications
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live status tracking for submitted government scheme requests
              </p>
            </div>

            <button
              onClick={() => navigate('/applications')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              View All Applications →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {MOCK_APPLICATIONS.slice(0, 2).map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-500 font-medium">{app.applicationNumber}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 dark:bg-blue-950/80 dark:text-blue-300">
                    {app.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {app.schemeTitle}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {app.notes}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 font-medium">
                  <span>Requested: ₹{(app.requestedAmount / 100000).toFixed(1)} Lakh</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">Target: {app.targetDeadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Toll-Free Helpline Strip */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100/60 dark:border-blue-900/60 shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Need Help on the Phone?
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Call our free government support line: <strong className="text-slate-900 dark:text-slate-100">1800-3000-0034</strong> (No airtime charges)
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/help')}
            className="h-10 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-blue-500/20 transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            View Phone Directory
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
