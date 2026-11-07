import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Landmark,
  FileCheck2,
  FolderLock,
  Store,
  IndianRupee,
  Mic,
  Volume2,
  ShieldCheck,
  PhoneCall,
  Info,
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

  // Exactly 6 large, clear human-centered actions requested in Phase 2
  const sixMainServices = [
    {
      id: 'srv_schemes',
      title: t('actionFindHelp'),
      description:
        'Discover grants, government subsidies, and low-interest loans for your farm, shop, or rural business.',
      descriptionTa:
        'உங்கள் விவசாயம், கடை அல்லது தொழிலுக்கான அரசு மானியங்கள் மற்றும் குறைந்த வட்டிக் கடன்களை அறியுங்கள்.',
      descriptionHi:
        'अपने काम, दुकान और व्यवसाय के लिए सरकारी अनुदान, सब्सिडी और कम ब्याज वाले ऋण खोजें।',
      icon: Landmark,
      iconColor: 'bg-blue-50 text-[#315D86] border border-blue-100 dark:bg-blue-950/60 dark:text-sky-300 dark:border-blue-800/60',
      buttonLabel: 'Find Help →',
      route: '/schemes',
    },
    {
      id: 'srv_applications',
      title: t('actionCheckApp'),
      description:
        'See if your application has been approved, what stage it is in, or if any papers are missing.',
      descriptionTa:
        'உங்கள் விண்ணப்பம் ஏற்றுக்கொள்ளப்பட்டதா அல்லது ஆவணங்கள் தேவையா என்பதை எளிதாகப் பாருங்கள்.',
      descriptionHi:
        'देखें कि आपका आवेदन किस स्थिति में है या किसी अतिरिक्त कागजात की आवश्यकता है।',
      icon: FileCheck2,
      iconColor: 'bg-slate-100 text-[#202B3C] border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
      buttonLabel: 'Check My Application →',
      route: '/applications',
    },
    {
      id: 'srv_vault',
      title: t('actionDocuments'),
      description:
        'Keep your Aadhaar card, bank passbook, and land papers safe. We automatically fill your forms.',
      descriptionTa:
        'உங்கள் ஆதார் அட்டை, வங்கி கணக்கு புத்தகம் மற்றும் பட்டா சான்றிதழ்களைப் பாதுகாப்பாக வையுங்கள்.',
      descriptionHi:
        'अपना आधार कार्ड, बैंक पासबुक और ज़मीन के कागजात सुरक्षित रखें। हम आपके फॉर्म भरने में मदद करेंगे।',
      icon: FolderLock,
      iconColor: 'bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60',
      buttonLabel: 'Open My Documents →',
      route: '/documents',
    },
    {
      id: 'srv_business',
      title: t('actionFindBuyers'),
      description:
        'Connect directly with verified wholesale buyers who want to purchase crops, milk, and handicrafts.',
      descriptionTa:
        'மஞ்சள், நவதானியங்கள் மற்றும் கைத்தறி ஆடைகளை மொத்தமாக வாங்கும் நல்ல வணிகர்களைத் தொடர்பு கொள்ளுங்கள்.',
      descriptionHi:
        'सीधे सत्यापित खरीदारों से जुड़ें जो फसलें, दूध और हस्तशिल्प उचित मूल्य पर खरीदना चाहते हैं।',
      icon: Store,
      iconColor: 'bg-purple-50 text-purple-700 border border-purple-200/60 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60',
      buttonLabel: 'Find Buyers →',
      route: '/marketplace',
    },
    {
      id: 'srv_financial',
      title: t('actionMoneyLoans'),
      description:
        'See your income, business expenses, bank savings, and loan repayment record in simple words.',
      descriptionTa:
        'உங்கள் தொழிலுக்கு வந்த பணம், செய்யப்பட்ட செலவுகள் மற்றும் வங்கிக் கடன் விவரங்களை எளிய முறையில் பாருங்கள்.',
      descriptionHi:
        'अपने व्यवसाय की कमाई, खर्च, बचत और बैंक ऋण चुकाने का रिकॉर्ड आसान शब्दों में देखें।',
      icon: IndianRupee,
      iconColor: 'bg-emerald-50 text-[#43836F] border border-emerald-200/60 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60',
      buttonLabel: 'View My Money →',
      route: '/financial-readiness',
    },
    {
      id: 'srv_assistant',
      title: t('actionTalkGramavance'),
      description:
        'Ask questions in your own language by typing or speaking through your phone. We answer patiently.',
      descriptionTa:
        'உங்கள் தாய்மொழியில் பேசி அரசு திட்டங்கள் பற்றிய சந்தேகங்களுக்கு உடனடி எளிய பதில் பெறுங்கள்.',
      descriptionHi:
        'अपने फ़ोन से बोलकर या लिखकर अपनी भाषा में सवाल पूछें। हम धैर्यपूर्वक मार्गदर्शन करेंगे।',
      icon: Mic,
      iconColor: 'bg-sky-50 text-[#315D86] border border-sky-200/60 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/60',
      buttonLabel: 'Talk to Assistant 🎤',
      route: '/assistant',
    },
  ];

  const primaryScheme = VERIFIED_SCHEMES[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* 1. Welcoming Hero Banner for Elderly & Rural Users (Question-First) */}
      <div className="bg-white dark:bg-[#0E1A29] rounded-2xl border border-[#E3E7ED] dark:border-slate-800 p-6 sm:p-8 shadow-[0_4px_20px_rgba(32,43,60,0.06),0_1px_3px_rgba(32,43,60,0.04)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-4 max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-[#43836F] dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 font-bold text-xs">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>{t('officialGovtWebsite')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202B3C] dark:text-white leading-tight">
            {t('welcomeHeading')}
          </h1>

          <p className="text-base sm:text-lg font-medium text-[#647184] dark:text-slate-300 leading-relaxed">
            {t('welcomeSubheading')}
          </p>

          {/* Voice Guidance Action (Calm, no pulse animation) */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleVoiceWelcome}
              className={`h-11 px-5 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all cursor-pointer active:scale-95 ${
                isSpeakingWelcome
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-[#43836F] hover:bg-[#366959] text-white shadow-[0_2px_8px_rgba(67,131,111,0.25)]'
              }`}
              title="Click to hear spoken voice guidance"
            >
              <Volume2 className="w-4 h-4 shrink-0" />
              <span>
                {isSpeakingWelcome
                  ? 'Playing Voice Guidance...'
                  : language === 'ta'
                  ? 'தமிழில் குரல் வழிகாட்டலைக் கேட்க'
                  : language === 'hi'
                  ? 'आवाज़ में जानकारी सुनें'
                  : 'Listen to Voice Guidance'}
              </span>
            </button>

            <button
              onClick={() => navigate('/eligibility')}
              className="h-11 px-5 rounded-xl font-bold text-sm sm:text-base bg-white dark:bg-slate-800 text-[#202B3C] dark:text-slate-100 border border-[#E3E7ED] dark:border-slate-700 hover:bg-[#F0F2F5] dark:hover:bg-slate-700 shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              Find Government Financial Help →
            </button>
          </div>
        </div>

        {/* Friendly Hero Photograph */}
        <div className="w-full md:w-80 shrink-0">
          <div className="rounded-2xl overflow-hidden border border-[#E3E7ED] dark:border-slate-700 shadow-sm">
            <img
              src="/gramavance_hero.jpg"
              alt="Elderly rural farmer and woman smiling together"
              className="w-full h-52 object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* 2. Question-First Header & All 6 Core Action Cards */}
      <div>
        <div className="mb-5 text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202B3C] dark:text-white">
            {t('whatHelpToday')}
          </h2>
          <p className="text-sm sm:text-base text-[#647184] dark:text-slate-300 mt-1">
            Choose any option below. We will guide you with patient, step-by-step instructions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sixMainServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                onClick={() => navigate(service.route)}
                className="p-6 rounded-2xl bg-white dark:bg-[#0E1A29] border border-[#E3E7ED] dark:border-slate-800 neu-card-hover cursor-pointer flex flex-col justify-between space-y-4 shadow-[0_4px_20px_rgba(32,43,60,0.06),0_1px_3px_rgba(32,43,60,0.04)]"
              >
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${service.iconColor} shadow-2xs`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-[#647184] bg-[#F0F2F5] dark:bg-slate-800 border border-[#E3E7ED] dark:border-slate-700 px-2.5 py-0.5 rounded-full">
                      Option {index + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#202B3C] dark:text-white leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-sm text-[#647184] dark:text-slate-300 leading-relaxed">
                    {language === 'ta'
                      ? service.descriptionTa
                      : language === 'hi'
                      ? service.descriptionHi
                      : service.description}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(service.route);
                  }}
                  className="w-full min-h-[44px] rounded-xl bg-[#315D86] hover:bg-[#26496B] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_2px_8px_rgba(49,93,134,0.2)] active:scale-[0.985]"
                >
                  <span>{service.buttonLabel}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Plain Language Terminology Helper Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0E1A29] border border-[#E3E7ED] dark:border-slate-800 shadow-[0_4px_20px_rgba(32,43,60,0.06)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#202B3C] dark:text-slate-100 font-bold text-base">
            <Info className="w-5 h-5 text-[#315D86] shrink-0" />
            <span>Understanding Common Government Terms in Everyday Words</span>
          </div>
          <button
            onClick={() => setShowTermHelp(!showTermHelp)}
            className="text-xs sm:text-sm font-bold text-[#315D86] hover:underline cursor-pointer"
          >
            {showTermHelp ? 'Hide Explanations' : 'Show Everyday Explanations'}
          </button>
        </div>

        {showTermHelp && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-sm text-[#202B3C] dark:text-slate-200">
            <div className="p-4 bg-[#F0F2F5] dark:bg-slate-800 rounded-xl border border-[#E3E7ED] dark:border-slate-700 space-y-1 text-left shadow-[inset_0_2px_4px_rgba(32,43,60,0.03)]">
              <strong className="text-[#202B3C] dark:text-white block font-bold">
                What does "Subsidy" mean?
              </strong>
              <p className="text-xs sm:text-sm text-[#647184] dark:text-slate-300 leading-relaxed">
                {t('subsidyTerm')}
              </p>
            </div>
            <div className="p-4 bg-[#F0F2F5] dark:bg-slate-800 rounded-xl border border-[#E3E7ED] dark:border-slate-700 space-y-1 text-left shadow-[inset_0_2px_4px_rgba(32,43,60,0.03)]">
              <strong className="text-[#202B3C] dark:text-white block font-bold">
                What does "Collateral" mean?
              </strong>
              <p className="text-xs sm:text-sm text-[#647184] dark:text-slate-300 leading-relaxed">
                {t('collateralTerm')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Simple Guidance Card: Recommended Next Step (PMEGP) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0E1A29] border border-[#E3E7ED] dark:border-slate-800 shadow-[0_4px_20px_rgba(32,43,60,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl text-left">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#43836F] dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 font-bold text-xs uppercase">
              Recommended for You
            </span>
            <span className="text-xs font-semibold text-[#647184] dark:text-slate-400">
              Verified Public Scheme Data
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-[#202B3C] dark:text-white">
            {primaryScheme.title[language] || primaryScheme.title.en}
          </h3>

          <p className="text-sm sm:text-base text-[#647184] dark:text-slate-300 leading-relaxed">
            Get up to 35% non-repayable subsidy from the government to buy machines or setup your rural enterprise.
            You only need to invest 5% to 10% of your own money.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <Button
            variant="teal"
            size="lg"
            onClick={() => navigate('/eligibility')}
            className="w-full sm:w-auto min-h-[46px] px-6 rounded-xl text-sm sm:text-base font-bold"
          >
            Check If I Qualify →
          </Button>
        </div>
      </div>

      {/* 5. Active Applications Summary (Plain Language) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0E1A29] border border-[#E3E7ED] dark:border-slate-800 shadow-[0_4px_20px_rgba(32,43,60,0.06)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h3 className="text-xl font-bold text-[#202B3C] dark:text-white">
              My Active Applications
            </h3>
            <p className="text-sm text-[#647184] dark:text-slate-400">
              Demonstration progress tracker of your government assistance requests
            </p>
          </div>

          <button
            onClick={() => navigate('/applications')}
            className="text-sm font-bold text-[#315D86] hover:underline cursor-pointer"
          >
            View All Applications →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {MOCK_APPLICATIONS.slice(0, 2).map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-xl bg-[#F0F2F5] dark:bg-slate-800 border border-[#E3E7ED] dark:border-slate-700 space-y-2 text-left shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#647184]">{app.applicationNumber}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950 dark:text-amber-300">
                  {app.status}
                </span>
              </div>
              <h4 className="text-base font-bold text-[#202B3C] dark:text-slate-100">
                {app.schemeTitle}
              </h4>
              <p className="text-xs sm:text-sm text-[#647184] dark:text-slate-300">
                {app.notes}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#E3E7ED] dark:border-slate-700 text-xs font-medium text-[#647184]">
                <span>Requested: ₹{(app.requestedAmount / 100000).toFixed(1)} Lakh</span>
                <span className="text-[#43836F] font-bold">Target Review: {app.targetDeadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Toll-Free Helpline Strip */}
      <div className="rounded-2xl bg-white dark:bg-[#0E1A29] border border-[#E3E7ED] dark:border-slate-800 p-6 shadow-[0_4px_20px_rgba(32,43,60,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#43836F] border border-emerald-200/60 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-2xs">
            <PhoneCall className="w-6 h-6 text-[#43836F]" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#202B3C] dark:text-white">
              Need assistance on phone?
            </h4>
            <p className="text-sm text-[#647184] dark:text-slate-300">
              Call our free government support line: <strong className="text-[#202B3C] dark:text-slate-200">1800-3000-0034</strong> (No charges)
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/help')}
          className="min-h-[44px] px-5 rounded-xl bg-[#315D86] hover:bg-[#26496B] text-white font-bold text-sm shrink-0 cursor-pointer shadow-[0_2px_8px_rgba(49,93,134,0.2)] active:scale-95 transition-all"
        >
          View Phone Directory
        </button>
      </div>
    </div>
  );
};
