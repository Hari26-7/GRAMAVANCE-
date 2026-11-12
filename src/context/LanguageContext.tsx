import React, { createContext, useContext, useEffect, useState } from 'react';
import type { LanguageCode } from '../types';

interface Translations {
  [key: string]: Record<LanguageCode, string>;
}

export const translations: Translations = {
  appName: {
    en: 'Gramavance AI',
    ta: 'கிராமாவான்ஸ் AI',
    hi: 'ग्रामावांस AI',
  },
  tagline: {
    en: 'Intelligent Community Platform',
    ta: 'அறிவார்ந்த சமூக தளம்',
    hi: 'बुद्धिमान सामुदायिक मंच',
  },
  searchPlaceholder: {
    en: 'Search schemes, products, or solutions...',
    ta: 'அரசு திட்டங்கள், பொருட்கள் அல்லது தீர்வுகளைத் தேடுங்கள்...',
    hi: 'सरकारी योजनाएं, उत्पाद या समाधान खोजें...',
  },
  navDashboard: {
    en: 'Home / Dashboard',
    ta: 'முகப்பு பலகை',
    hi: 'होम / डैशबोर्ड',
  },
  navFindSchemes: {
    en: 'Find Government Schemes',
    ta: 'அரசு திட்டங்கள்',
    hi: 'सरकारी योजनाएं खोजें',
  },
  navCheckEligibility: {
    en: 'Check My Eligibility',
    ta: 'என் தகுதியை அறிய',
    hi: 'मेरी पात्रता जांचें',
  },
  navCommunityNetwork: {
    en: 'Community Network',
    ta: 'சமூக வலையமைப்பு',
    hi: 'सामुदायिक नेटवर्क',
  },
  navLocalMarketplace: {
    en: 'Local Marketplace',
    ta: 'உள்ளூர் சந்தை',
    hi: 'स्थानीय बाज़ार',
  },
  navMyDocuments: {
    en: 'My Documents',
    ta: 'என் ஆவணங்கள்',
    hi: 'मेरे दस्तावेज़',
  },
  navFinancialReadiness: {
    en: 'Financial Readiness',
    ta: 'நிதித் தயார்நிலை',
    hi: 'वित्तीय तैयारी',
  },
  navHelpSupport: {
    en: 'Help & Support',
    ta: 'உதவி மற்றும் வழிகாட்டல்',
    hi: 'सहायता एवं संपर्क',
  },
  navMyProfile: {
    en: 'My Profile',
    ta: 'என் விவரங்கள்',
    hi: 'मेरी प्रोफाइल',
  },
  navAssistant: {
    en: 'Community Assistant',
    ta: 'சமூக உதவியாளர்',
    hi: 'सामुदायिक मार्गदर्शक',
  },
  navSchemes: {
    en: 'Find Government Schemes',
    ta: 'அரசு திட்டங்கள்',
    hi: 'सरकारी योजनाएं खोजें',
  },
  navGrantIntelligence: {
    en: 'Check My Eligibility',
    ta: 'என் தகுதியை அறிய',
    hi: 'मेरी पात्रता जांचें',
  },
  navApplications: {
    en: 'Check My Application',
    ta: 'என் விண்ணப்பம்',
    hi: 'मेरा आवेदन देखें',
  },
  navDocumentVault: {
    en: 'My Documents',
    ta: 'என் ஆவணங்கள்',
    hi: 'मेरे दस्तावेज़',
  },
  navBusinessConnect: {
    en: 'Local Marketplace',
    ta: 'உள்ளூர் சந்தை',
    hi: 'स्थानीय बाज़ार',
  },
  navFinancialHealth: {
    en: 'Financial Readiness',
    ta: 'நிதித் தயார்நிலை',
    hi: 'वित्तीय तैयारी',
  },
  navCommunityInsights: {
    en: 'Community Network',
    ta: 'சமூக வலையமைப்பு',
    hi: 'सामुदायिक नेटवर्क',
  },
  navSettings: {
    en: 'My Profile & Settings',
    ta: 'என் சுயவிவரம்',
    hi: 'मेरी प्रोफ़ाइल और सेटिंग्स',
  },
  navNotifications: {
    en: 'Alerts & Reminders',
    ta: 'முக்கிய அறிவிப்புகள்',
    hi: 'सूचनाएं और रिमाइंडर',
  },
  welcomeHeading: {
    en: 'Vanakkam! Welcome to Gramavance AI.',
    ta: 'வணக்கம்! கிராமாவான்ஸ் AI-க்கு நல்வரவு.',
    hi: 'नमस्ते! ग्रामावांस AI में आपका स्वागत है।',
  },
  welcomeSubheading: {
    en: 'We help you find government support, manage your documents, and grow your business.',
    ta: 'அரசு உதவிகளைக் கண்டறியவும், உங்கள் ஆவணங்களைப் பாதுகாக்கவும், தொழிலை வளர்க்கவும் நாங்கள் உதவுகிறோம்.',
    hi: 'हम आपको सरकारी सहायता खोजने, अपने दस्तावेज़ प्रबंधित करने और अपना व्यवसाय बढ़ाने में मदद करते हैं।',
  },
  speakInTamil: {
    en: 'Speak to Us in English',
    ta: 'தமிழில் எங்களிடம் பேசுங்கள்',
    hi: 'हिन्दी में हमसे बात करें',
  },
  officialGovtWebsite: {
    en: 'Verified Public Development Portal',
    ta: 'சரிபார்க்கப்பட்ட மக்கள் சேவை தளம்',
    hi: 'सत्यापित जन विकास पोर्टल',
  },
  emergencyHelpline: {
    en: 'Toll-Free Helpline: 1800-3000-0034 (Mon-Sat, 9 AM - 6 PM)',
    ta: 'இலவச உதவி எண்: 1800-3000-0034 (திங்கள்-சனி, காலை 9 - மாலை 6)',
    hi: 'निःशुल्क हेल्पलाइन: 1800-3000-0034 (सोम-शनि, सुबह 9 - शाम 6)',
  },
  whatHelpToday: {
    en: 'What would you like help with today?',
    ta: 'இன்று உங்களுக்கு என்ன உதவி தேவை?',
    hi: 'आज आप क्या सहायता चाहते हैं?',
  },
  actionFindHelp: {
    en: 'Find Government Help',
    ta: 'அரசு உதவிகளைக் கண்டறியுங்கள்',
    hi: 'सरकारी सहायता खोजें',
  },
  actionCheckApp: {
    en: 'Check My Application',
    ta: 'என் விண்ணப்ப நிலையை அறிய',
    hi: 'मेरा आवेदन जांचें',
  },
  actionDocuments: {
    en: 'Get Help with Documents',
    ta: 'என் ஆவணங்கள் & சான்றிதழ்கள்',
    hi: 'दस्तावेज़ों में सहायता लें',
  },
  actionFindBuyers: {
    en: 'Find Buyers for My Products',
    ta: 'என் விளைபொருட்களை விற்க',
    hi: 'उत्पाद बेचने के लिए खरीदार खोजें',
  },
  actionMoneyLoans: {
    en: 'Understand My Money and Loans',
    ta: 'என் பணம் மற்றும் கடன்களைப் புரிந்து கொள்ள',
    hi: 'मेरा पैसा और ऋण समझें',
  },
  actionTalkGramavance: {
    en: 'Talk to Gramavance',
    ta: 'கிராமாவான்ஸ் உடன் பேசுங்கள்',
    hi: 'ग्रामावांस से बात करें',
  },
  subsidyTerm: {
    en: 'Subsidy: Money provided under a government scheme to help eligible people pay certain business costs. The amount and eligibility depend on the scheme rules.',
    ta: 'மானிய உதவி (Subsidy): அரசு திட்டத்தின் கீழ் தகுதியான பயனாளிகளுக்கு தொழில் தொடங்க வழங்கப்படும் இலவச பண உதவி. இதை அரசுக்குத் திரும்பச் செலுத்த வேண்டியதில்லை.',
    hi: 'सब्सिडी (Subsidy): सरकारी योजना के तहत पात्र लोगों को व्यवसाय शुरू करने हेतु दी जाने वाली सहायता राशि। इसे वापस नहीं लौटाना पड़ता।',
  },
  collateralTerm: {
    en: 'Collateral: Security or property (like house deeds or land) that banks usually ask for. Many government schemes provide collateral-free loans without needing land or property pledge.',
    ta: 'பிணையம் (Collateral): வங்கிக் கடனுக்கு உத்தரவாதமாக கேட்கப்படும் நிலம் அல்லது நகை. பல அரசு திட்டங்கள் எந்த நிலப் பிணையமும் இன்றி கடன் வழங்குகின்றன.',
    hi: 'संपार्श्विक (Collateral): बैंक ऋण के लिए आवश्यक गारंटी या ज़मीन के कागजात। कई सरकारी योजनाएं बिना किसी गारंटी के ऋण देती हैं।',
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('gramavance_language') as LanguageCode;
    if (saved === 'en' || saved === 'ta' || saved === 'hi') return saved;
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('gramavance_language', language);
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    if (translations[key] && translations[key]['en']) {
      return translations[key]['en'];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
