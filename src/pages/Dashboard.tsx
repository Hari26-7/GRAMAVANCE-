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
import { Button } from '../components/ui/Button';

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
      utterance.rate = 0.85; // Slower, calm, reassuring pace for elderly listeners
      utterance.onstart = () => setIsSpeakingWelcome(true);
      utterance.onend = () => setIsSpeakingWelcome(false);
      utterance.onerror = () => setIsSpeakingWelcome(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Voice assistance demo activated. Web Speech synthesis is not supported on this browser.');
    }
  };

  // 3 Core Action Cards (Glassmorphic Grid)
  const threeMainCards = [
    {
      id: 'srv_schemes',
      title: language === 'ta' ? 'அரசு திட்டங்கள் & மானியங்கள்' : 'Find Government Help',
      description:
        language === 'ta'
          ? 'உங்கள் விவசாயம், கடை அல்லது தொழிலுக்கான அரசு மானியங்கள் மற்றும் குறைந்த வட்டிக் கடன்களை அறியுங்கள்.'
          : 'Discover grants, capital subsidies, and low-interest loans for your farm, shop, or rural business.',
      icon: Landmark,
      route: '/schemes',
    },
    {
      id: 'srv_applications',
      title: language === 'ta' ? 'விண்ணப்ப நிலை சரிபார்ப்பு' : 'Check My Application',
      description:
        language === 'ta'
          ? 'உங்கள் விண்ணப்பம் ஏற்றுக்கொள்ளப்பட்டதா அல்லது கூடுதல் ஆவணங்கள் தேவையா என்பதை எளிதாகப் பாருங்கள்.'
          : 'See if your application has been approved, what stage it is in, or if any papers are missing.',
      icon: FileCheck2,
      route: '/applications',
    },
    {
      id: 'srv_vault',
      title: language === 'ta' ? 'ஆவணங்கள் பாதுகாப்பு பெட்டகம்' : 'Get Help with Documents',
      description:
        language === 'ta'
          ? 'உங்கள் ஆதார் அட்டை, வங்கி கணக்கு புத்தகம் மற்றும் பட்டா சான்றிதழ்களைப் பாதுகாப்பாக வையுங்கள்.'
          : 'Keep your Aadhaar card, bank passbook, and land papers safe. We automatically fill your forms.',
      icon: FolderLock,
      route: '/documents',
    },
  ];

  const primaryScheme = VERIFIED_SCHEMES[0];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-100 dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 min-h-screen -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        {/* 1. The Hero Section (Sleek & Professional — Text Focused, No Images) */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-sm rounded-2xl p-8 mb-8 flex flex-col items-start text-left transition-all duration-300">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50/80 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 font-bold text-xs mb-3">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>{t('officialGovtWebsite')}</span>
          </div>

          <h1 className="text-slate-900 dark:text-white font-bold text-3xl sm:text-4xl tracking-tight leading-tight">
            {language === 'ta'
              ? 'வணக்கம்! கிராமாவான்ஸ் தங்களுக்கு நல்வரவு கூறுகிறது.'
              : 'Vanakkam! Welcome to Gramavance.'}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 mt-2 text-base sm:text-lg max-w-3xl leading-relaxed">
            {language === 'ta'
              ? 'அரசு திட்டங்களை அறிந்து கொள்ளவும், உங்கள் தொழிலை எளிதாக விரிவுபடுத்தவும் நாங்கள் உதவுகிறோம்.'
              : 'We help you find government support and grow your business with simple, transparent, and accessible guidance.'}
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={handleVoiceWelcome}
              className={`h-11 px-5 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all cursor-pointer active:scale-95 ${
                isSpeakingWelcome
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-sm'
              }`}
              title="Click to hear spoken voice guidance"
            >
              <Volume2 className="w-4 h-4 shrink-0" />
              <span>
                {isSpeakingWelcome
                  ? 'Playing Voice Guidance...'
                  : language === 'ta'
                  ? 'தமிழில் வழிகாட்டலைக் கேட்க'
                  : language === 'hi'
                  ? 'आवाज़ में जानकारी सुनें'
                  : 'Listen to Voice Guidance'}
              </span>
            </button>

            <button
              onClick={() => navigate('/eligibility')}
              className="h-11 px-5 rounded-xl font-bold text-sm sm:text-base bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-slate-100 border border-white/90 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              Find Government Financial Help →
            </button>
          </div>
        </div>

        {/* 2. The 3 Action Cards (Glassmorphic Grid) */}
        <div>
          <div className="mb-5 text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('whatHelpToday')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">
              Choose any service below to explore schemes, check status, or manage your papers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {threeMainCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => navigate(card.route)}
                  className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col h-full cursor-pointer text-left group"
                >
                  {/* Icon at the top */}
                  <div className="text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 p-3 rounded-xl w-fit shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-4 leading-snug">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-500 dark:text-slate-300 mt-2 flex-grow leading-relaxed">
                    {card.description}
                  </p>

                  {/* New Link at absolute bottom */}
                  <span className="text-blue-600 dark:text-sky-400 font-semibold text-sm mt-6 flex items-center gap-1 cursor-pointer group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Plain Language Terminology Helper Card (Glassmorphic) */}
        <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-sm space-y-3 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-base">
              <Info className="w-5 h-5 text-blue-600 dark:text-sky-400 shrink-0" />
              <span>Understanding Common Government Terms in Everyday Words</span>
            </div>
            <button
              onClick={() => setShowTermHelp(!showTermHelp)}
              className="text-xs sm:text-sm font-bold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
            >
              {showTermHelp ? 'Hide Explanations' : 'Show Everyday Explanations'}
            </button>
          </div>

          {showTermHelp && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-sm text-slate-800 dark:text-slate-200">
              <div className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/80 dark:border-white/10 space-y-1 text-left shadow-xs">
                <strong className="text-slate-900 dark:text-white block font-bold">
                  What does "Subsidy" mean?
                </strong>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('subsidyTerm')}
                </p>
              </div>
              <div className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/80 dark:border-white/10 space-y-1 text-left shadow-xs">
                <strong className="text-slate-900 dark:text-white block font-bold">
                  What does "Collateral" mean?
                </strong>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('collateralTerm')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 4. Simple Guidance Card: Recommended Next Step (PMEGP) */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 font-bold text-xs uppercase">
                Recommended for You
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Verified Public Scheme Data
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {primaryScheme.title[language] || primaryScheme.title.en}
            </h3>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Get up to 35% non-repayable subsidy from the government to buy machines or setup your rural enterprise.
              You only need to invest 5% to 10% of your own money.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <Button
              variant="teal"
              size="lg"
              onClick={() => navigate('/eligibility')}
              className="w-full sm:w-auto min-h-[46px] px-6 rounded-xl text-sm sm:text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-sm border-0"
            >
              Check If I Qualify →
            </Button>
          </div>
        </div>

        {/* 5. Active Applications Summary */}
        <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-sm space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                My Active Applications
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Progress tracker of your government assistance requests
              </p>
            </div>

            <button
              onClick={() => navigate('/applications')}
              className="text-sm font-bold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
            >
              View All Applications →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {MOCK_APPLICATIONS.slice(0, 2).map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/80 dark:border-white/10 space-y-2 text-left shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">{app.applicationNumber}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950 dark:text-amber-300">
                    {app.status}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {app.schemeTitle}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {app.notes}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-500">
                  <span>Requested: ₹{(app.requestedAmount / 100000).toFixed(1)} Lakh</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Target Review: {app.targetDeadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Toll-Free Helpline Strip */}
        <div className="rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-white/10 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-xs">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Need assistance on phone?
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Call our free government support line: <strong className="text-slate-900 dark:text-slate-100">1800-3000-0034</strong> (No charges)
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/help')}
            className="min-h-[44px] px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shrink-0 cursor-pointer shadow-sm active:scale-95 transition-all"
          >
            View Phone Directory
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
