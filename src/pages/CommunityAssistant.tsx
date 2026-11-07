import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Volume2,
  Copy,
  RotateCcw,
  ExternalLink,
  Sparkles,
  Info,
  Send,
  AlertCircle,
  Key,
  Check,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import type { LanguageCode } from '../types';
import {
  sendGeminiChat,
  isGeminiConfigured,
  getGeminiApiKey,
  setGeminiApiKey,
  type GeminiMessage,
} from '../services/geminiService';

interface ChatCitation {
  title: string;
  department: string;
  url: string;
  officialRule: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: ChatCitation[];
  isVoice?: boolean;
  isLiveAI?: boolean;
}

const INITIAL_MESSAGES: Record<LanguageCode, ChatMessage[]> = {
  en: [
    {
      id: 'msg_init_en',
      sender: 'assistant',
      content:
        "Vanakkam! I am your Gramavance assistant.\n\nI can help you find government financial help, understand which papers you need, and guide your business step-by-step.\n\nWhat kind of business or work would you like help with today?",
      timestamp: 'Just now',
      citations: [
        {
          title: 'PMFME & PMEGP Official Rural Assistance Guidelines 2025-26',
          department: 'Ministry of MSME & Ministry of Food Processing Industries',
          url: 'https://pmfme.mofpi.gov.in',
          officialRule:
            'Rural entrepreneurs can receive up to 35% government subsidy on machinery and business setup costs.',
        },
      ],
    },
  ],
  ta: [
    {
      id: 'msg_init_ta',
      sender: 'assistant',
      content:
        "வணக்கம்! நான் கிராமாவான்ஸ் உதவி உதவியாளர்.\n\nஉங்களுக்கு ஏற்ற அரசு நிதி உதவிகள், தேவையான ஆவணங்கள் மற்றும் வங்கிக் கடன்களைப் பெற நான் உங்களுக்கு எளிய முறையில் வழிகாட்டுகிறேன்.\n\nநீங்கள் என்ன தொழில் செய்கிறீர்கள் அல்லது என்ன உதவி தேவை?",
      timestamp: 'இப்போது',
      citations: [
        {
          title: 'PMEGP & PMFME அரசு வழிகாட்டுதல்கள் 2025-26',
          department: 'மத்திய MSME அமைச்சகம் மற்றும் தமிழக அரசு',
          url: 'https://pmfme.mofpi.gov.in',
          officialRule:
            'கிராமப்புற தொழில்முனைவோர் மற்றும் பெண்களுக்கு 35% வரை அரசு மானியம் வழங்கப்படுகிறது.',
        },
      ],
    },
  ],
  hi: [
    {
      id: 'msg_init_hi',
      sender: 'assistant',
      content:
        "नमस्ते! मैं ग्रामावांस का आपका सहायक हूँ।\n\nमैं आपको सरकारी योजनाओं, आवश्यक कागजात और व्यवसाय के लिए वित्तीय सहायता पाने में आसान भाषा में मदद करूँगा।\n\nआज आप किस व्यवसाय या काम के लिए सहायता चाहते हैं?",
      timestamp: 'अभी',
      citations: [
        {
          title: 'पीएमईजीपी एवं पीएमएफएमई सरकारी दिशानिर्देश 2025-26',
          department: 'सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय',
          url: 'https://pmfme.mofpi.gov.in',
          officialRule:
            'ग्रामीण उद्यमियों और महिलाओं को व्यवसाय लगाने के लिए 35% तक सरकारी सब्सिडी मिलती है।',
        },
      ],
    },
  ],
};

const SUGGESTED_QUESTIONS: Record<LanguageCode, string[]> = {
  ta: [
    'எனக்கு அரசு உதவி கிடைக்குமா?',
    'மகளிர் சுயஉதவிக் குழுவிற்கு என்ன மானியம் உண்டு?',
    'இயந்திரம் வாங்க கடன் வாங்குவது எப்படி?',
    'விண்ணப்பிக்க என்னென்ன ஆவணங்கள் தேவை?',
  ],
  en: [
    'Can I get government financial help for my business?',
    'What subsidy is available for Women Self-Help Groups?',
    'How much money can I get for a small grocery shop?',
    'What papers do I need for a bank loan?',
  ],
  hi: [
    'क्या मुझे व्यवसाय के लिए सरकारी सहायता मिल सकती है?',
    'महिला स्वयं सहायता समूह (SHG) के लिए क्या योजना है?',
    'दुकान या मशीनरी के लिए लोन कैसे मिलेगा?',
    'आवेदन करने के लिए कौन-कौन से कागजात चाहिए?',
  ],
};

export const CommunityAssistant: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';
  const { language } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    ...(INITIAL_MESSAGES[language] || INITIAL_MESSAGES.en),
  ]);
  const [inputText, setInputText] = useState(initialPrompt);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(() => isGeminiConfigured());
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState(() => getGeminiApiKey());
  const [keySaveMessage, setKeySaveMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(keyInput);
    const configured = isGeminiConfigured();
    setHasGeminiKey(configured);
    setKeySaveMessage(
      configured
        ? 'Gemini API Key saved successfully! Live Generative AI is now active.'
        : 'API key cleared. Assistant will use verified local rule knowledge.'
    );
    setTimeout(() => {
      setKeySaveMessage(null);
      if (configured) setShowKeyModal(false);
    }, 2000);
  };

  const handleSendMessage = useCallback(
    async (textToSend?: string) => {
      const text = textToSend || inputText;
      if (!text.trim() || isThinking) return;

      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const userMsgId = `usr_${now.getTime()}_${Math.random().toString(36).substring(2, 6)}`;

      const userMsg: ChatMessage = {
        id: userMsgId,
        sender: 'user',
        content: text,
        timestamp: timeString,
      };

      setMessages((prev) => [...prev, userMsg]);
      if (!textToSend) setInputText('');

      // 1. Try Live Generative AI with Google Gemini if configured
      if (isGeminiConfigured()) {
        setIsThinking(true);
        try {
          const geminiHistory: GeminiMessage[] = messages.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.content,
          }));
          geminiHistory.push({ role: 'user', text });

          const geminiResp = await sendGeminiChat(geminiHistory, language);
          setIsThinking(false);

          if (geminiResp.isLiveAI && geminiResp.text) {
            const respTime = new Date();
            const assistantMsg: ChatMessage = {
              id: `asst_gemini_${respTime.getTime()}`,
              sender: 'assistant',
              content: geminiResp.text,
              timestamp: respTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isLiveAI: true,
            };
            setMessages((prev) => [...prev, assistantMsg]);
            return;
          } else if (geminiResp.error) {
            setVoiceError(
              `Notice: Gemini API reported (${geminiResp.error}). Switched to verified local rules.`
            );
          }
        } catch {
          setIsThinking(false);
        }
      }

      // 2. Verified Rule-Based Fallback Engine
      setIsThinking(true);
      setTimeout(() => {
        let replyContent = '';
        let citations: ChatCitation[] | undefined = undefined;
        const lower = text.toLowerCase();

        if (text.includes('எனக்கு அரசு உதவி கிடைக்குமா?') || lower.includes('can i get government')) {
          if (language === 'ta') {
            replyContent =
              'உங்களுக்கு பொருத்தமான அரசு திட்டங்களைத் தேட உதவுகிறேன். முதலில், நீங்கள் என்ன தொழில் செய்கிறீர்கள்? (உதாரணம்: விவசாயம், ஆடை தயாரிப்பு, மளிகைக் கடை, அல்லது உணவு பதப்படுத்துதல்?)';
          } else if (language === 'hi') {
            replyContent =
              'मैं आपको उपयुक्त सरकारी योजना ढूँढने में मदद करूँगा। पहले यह बताइए, आप क्या काम या व्यवसाय करते हैं? (जैसे: खेती, सिलाई, किराना दुकान या खाद्य प्रसंस्करण?)';
          } else {
            replyContent =
              'Yes, there are several government assistance schemes available! To find the exact match for you, what kind of work or business do you do? (For example: Farming, Food processing, Tailoring, or Small shop?)';
          }
          citations = [
            {
              title: 'PMEGP & State Rural Livelihood Mission',
              department: 'Ministry of MSME / Tamil Nadu Rural Development',
              url: 'https://www.kviconline.gov.in/pmegpeportal/',
              officialRule: 'Assistance available for new micro enterprises across rural India.',
            },
          ];
        } else if (text.includes('சுயஉதவிக் குழு') || lower.includes('shg') || lower.includes('women')) {
          if (language === 'ta') {
            replyContent =
              'மகளிர் சுயஉதவிக் குழுக்களுக்கு (SHG) இரண்டு முக்கிய உதவிகள் கிடைக்கின்றன:\n\n' +
              '1. **PMFME திட்டத்தில்:** உணவு தயாரிப்பு இயந்திரங்கள் வாங்க ஒவ்வொரு உறுப்பினருக்கும் ஆரம்ப மூலதனமாக ₹40,000 வரை உதவி மற்றும் 35% மானியம்.\n' +
              '2. **குறைந்த வட்டி வங்கிக் கடன்:** சரியான நேரத்தில் திருப்பிச் செலுத்தினால் வெறும் 4% வட்டியில் கடன் பெறலாம்.\n\n' +
              'உங்கள் குழு என்ன தொழில் செய்ய திட்டமிட்டுள்ளது?';
          } else if (language === 'hi') {
            replyContent =
              'महिला स्वयं सहायता समूह (SHG) के लिए दो मुख्य लाभ उपलब्ध हैं:\n\n' +
              '1. **पीएमएफएमई योजना:** खाद्य प्रसंस्करण उपकरण खरीदने के लिए प्रति सदस्य ₹40,000 बीज पूँजी और 35% तक सब्सिडी।\n' +
              '2. **सस्ता बैंक लोन:** समय पर चुकाने पर केवल 4% से 7% ब्याज दर पर बैंक ऋण।\n\n' +
              'आपका समूह क्या काम शुरू करना चाहता है?';
          } else {
            replyContent =
              'For Women Self-Help Groups (SHGs), two major supports are available under verified rules:\n\n' +
              '1. **Machinery & Seed Money (PMFME):** Up to ₹40,000 seed money per member and 35% grant for food processing equipment.\n' +
              '2. **Low-Interest Bank Loan (NRLM):** Bank loans with interest reduced down to 4% per year if repaid on time.\n\n' +
              'What activity is your group planning to undertake?';
          }
          citations = [
            {
              title: 'PMFME & NRLM Convergence Guidelines 2025-26',
              department: 'Ministry of Food Processing Industries & MoRD',
              url: 'https://pmfme.mofpi.gov.in',
              officialRule:
                'Seed capital of ₹40,000 per SHG member for working capital and small tools, plus 35% capital subsidy for group machinery.',
            },
          ];
        } else if (text.includes('இயந்திரம்') || lower.includes('machinery') || lower.includes('equipment')) {
          if (language === 'ta') {
            replyContent =
              'இயந்திரம் வாங்க PMEGP திட்டம் மிகவும் சிறந்தது.\n\n' +
              '• கிராமப்புற பெண்களுக்கு மற்றும் பிற்படுத்தப்பட்டோருக்கு இயந்திர விலையில் 35% அரசு மானியமாகத் தருகிறது.\n' +
              '• நீங்கள் உங்கள் கையில் இருந்து 5% மட்டுமே செலுத்தினால் போதும். மீதி 60% வங்கி கடனாகத் தரும்.\n\n' +
              'இயந்திரத்தின் உத்தேச விலை எவ்வளவு இருக்கும்? (உதாரணம்: ₹3 லட்சம் அல்லது ₹10 லட்சம்?)';
          } else {
            replyContent =
              'For buying machinery, the government PMEGP scheme is very helpful:\n\n' +
              '• In rural areas, women and backward classes receive 35% of the machinery cost as a free government subsidy.\n' +
              '• You only need to pay 5% from your own pocket. The bank finances the remaining 60% as a term loan.\n\n' +
              'Roughly how much will the machinery cost? (For example: ₹3 Lakh or ₹10 Lakh?)';
          }
          citations = [
            {
              title: 'PMEGP Official Subsidy Norms',
              department: 'Khadi & Village Industries Commission (KVIC)',
              url: 'https://www.kviconline.gov.in/pmegpeportal/',
              officialRule:
                'Rural special category beneficiaries receive 35% subsidy and contribute only 5% own funds.',
            },
          ];
        } else if (text.includes('ஆவணங்கள்') || lower.includes('document') || lower.includes('paper')) {
          if (language === 'ta') {
            replyContent =
              'விண்ணப்பிக்க முக்கியமாக 4 ஆவணங்கள் இருந்தால் போதும்:\n\n' +
              '1. உங்கள் ஆதார் அட்டை\n' +
              '2. வங்கி கணக்குப் புத்தகம் (முதல் பக்க நகல்)\n' +
              '3. கடை அல்லது நிலத்திற்கான வாடகை ஒப்பந்தம் / பட்டா\n' +
              '4. வாங்க விரும்பும் இயந்திரத்தின் விலைப்பட்டியல் (Quotation)\n\n' +
              'இவை உங்களிடம் தயாராக உள்ளதா? "என் ஆவணங்கள்" பக்கத்தில் இவற்றை நீங்கள் எளிதாகப் பதிவேற்றலாம்.';
          } else {
            replyContent =
              'You only need 4 simple documents to begin:\n\n' +
              '1. Aadhaar Card\n' +
              '2. Bank Passbook copy (front page showing account number)\n' +
              '3. Business premise proof (Rent agreement or Land Patta)\n' +
              '4. Price quotation from the machinery or equipment seller\n\n' +
              'Do you have these ready? You can keep them safe in the "My Documents" section.';
          }
          citations = [
            {
              title: 'Standard MSME Lending Checklist',
              department: 'Reserve Bank of India & MoMSME Guidelines',
              url: 'https://www.mudra.org.in/',
              officialRule:
                'No collateral is required for loans up to ₹10 Lakh. Only standard KYC and quotation papers are mandatory.',
            },
          ];
        } else {
          if (language === 'ta') {
            replyContent =
              `உங்கள் கேள்விக்கு நன்றி. "${text}" பற்றி அரசு உதவி பெற:\n\n` +
              '1. எங்கள் "அரசு நிதி உதவி தேடுக" வழிகாட்டியைப் பயன்படுத்தி 4 எளிய கேள்விகளில் தகுதியான திட்டத்தை அறிந்து கொள்ளலாம்.\n' +
              '2. உங்களுக்கு ஏதேனும் சந்தேகம் இருந்தால் எங்கள் கட்டணமில்லா உதவி எண் 1800-3000-0034-க்கு இலவசமாக அழைக்கலாம்.\n\n' +
              'நீங்கள் எந்த ஊரில் அல்லது மாவட்டத்தில் தொழில் செய்ய விரும்புகிறீர்கள்?';
          } else {
            replyContent =
              `Thank you for asking about "${text}". Here is the clearest way forward:\n\n` +
              '1. You can use our "Find Government Financial Help" guided assistant to see exact schemes in 4 simple questions.\n' +
              '2. You can also call our free government helpline at 1800-3000-0034.\n\n' +
              'Which district or town is your business located in?';
          }
        }

        const respTime = new Date();
        const assistantMsg: ChatMessage = {
          id: `asst_${respTime.getTime()}_${Math.random().toString(36).substring(2, 6)}`,
          sender: 'assistant',
          content: replyContent,
          timestamp: respTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations,
        };

        setIsThinking(false);
        setMessages((prev) => [...prev, assistantMsg]);
      }, 500);
    },
    [inputText, language, messages, isThinking]
  );

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(id);
    setTimeout(() => setIsCopied(null), 2000);
  };

  const speakText = (text: string, id: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking === id) {
        window.speechSynthesis.cancel();
        setIsSpeaking(null);
      } else {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[*#•]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
        utterance.rate = 0.85; // Slower, calm, reassuring
        utterance.onend = () => setIsSpeaking(null);
        utterance.onerror = () => setIsSpeaking(null);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(id);
      }
    } else {
      alert('Speech synthesis is not supported on this browser.');
    }
  };

  // Web Speech API with Graceful Text-Based Fallback
  const toggleMicrophone = () => {
    setVoiceError(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(
        'Voice input is not supported in this browser. Please type your message below or tap one of the suggested questions.'
      );
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        const spokenText = event.results[0][0].transcript;
        setIsListening(false);
        if (spokenText && spokenText.trim()) {
          handleSendMessage(spokenText);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        setVoiceError(
          `Voice input error (${event.error || 'permission denied'}). Please type your question below.`
        );
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceError(
        'Could not access microphone. Please type your question or tap one of the suggested questions.'
      );
    }
  };

  const handleResetChat = () => {
    setMessages([...(INITIAL_MESSAGES[language] || INITIAL_MESSAGES.en)]);
    setVoiceError(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 text-left">
      {/* Friendly Assistant Header Banner */}
      <div className="bg-white dark:bg-[#0E1A29] text-[#202B3C] dark:text-white p-5 sm:p-6 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] border border-[#E3E7ED] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#315D86] border border-blue-200/60 flex items-center justify-center shadow-xs shrink-0">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {language === 'ta' ? 'கிராமாவான்ஸ் வழிகாட்டி' : 'Talk to Gramavance Helper'}
              </h1>
              {hasGeminiKey ? (
                <span className="bg-emerald-50 border border-emerald-200/80 text-[#43836F] dark:bg-emerald-950 dark:text-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#43836F]" /> Live Gemini AI
                </span>
              ) : (
                <span className="bg-blue-50 border border-blue-200/60 text-[#315D86] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Verified Local Rules
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#647184] dark:text-slate-300 mt-1">
              Ask any question in Tamil, English, or Hindi. We explain official rules step-by-step.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowKeyModal(true)}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border ${
              hasGeminiKey
                ? 'bg-emerald-50 border-emerald-200 text-[#43836F] hover:bg-emerald-100 shadow-2xs'
                : 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600 shadow-xs'
            }`}
            title="Configure Google Gemini API Key"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{hasGeminiKey ? 'Gemini API Connected' : 'Connect Gemini API'}</span>
          </button>

          <button
            onClick={handleResetChat}
            className="min-h-[40px] text-xs font-bold text-[#647184] hover:text-[#202B3C] dark:text-slate-300 dark:hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-[#E3E7ED] dark:border-slate-700 hover:bg-[#F0F2F5] shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Start Over
          </button>
        </div>
      </div>

      {/* Honest Local Knowledge & Fallback Notice */}
      <div className="p-4 rounded-xl bg-[#F0F2F5] dark:bg-slate-900 border border-[#E3E7ED] dark:border-slate-800 text-xs sm:text-sm text-[#202B3C] dark:text-slate-300 flex items-start gap-3 shadow-2xs">
        <Info className="w-5 h-5 text-[#315D86] shrink-0 mt-0.5" />
        <div>
          {hasGeminiKey ? (
            <span>
              <strong className="text-[#202B3C] dark:text-white">Generative AI Enabled:</strong> Connected to Google Gemini Flash for natural conversational understanding in Tamil, Hindi, and English.
            </span>
          ) : (
            <span>
              <strong className="text-[#202B3C] dark:text-white">Offline Knowledge Mode:</strong> Running with verified public scheme guidelines for PMEGP, PMFME, MUDRA, and DAY-NRLM. Tap <em>"Connect Gemini API"</em> to enable live generative AI responses.
            </span>
          )}
        </div>
      </div>

      {voiceError && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>{voiceError}</span>
        </div>
      )}

      {/* Quick Question Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#647184] uppercase tracking-wider block">
          Frequently Asked Questions (Click to Ask):
        </span>
        <div className="flex flex-wrap gap-2">
          {(SUGGESTED_QUESTIONS[language] || SUGGESTED_QUESTIONS.en).map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-[#E3E7ED] dark:border-slate-700 hover:border-[#315D86] text-[#202B3C] dark:text-slate-200 transition-all active:scale-95 cursor-pointer text-left shadow-2xs min-h-[42px]"
            >
              💬 {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <Card className="p-4 sm:p-6 min-h-[380px] max-h-[550px] overflow-y-auto space-y-4 border border-[#E3E7ED] dark:border-slate-800 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] bg-white dark:bg-[#0E1A29]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#315D86] text-white rounded-br-xs shadow-xs'
                  : 'bg-[#F0F2F5] dark:bg-slate-800 text-[#202B3C] dark:text-slate-100 border border-[#E3E7ED] dark:border-slate-700 rounded-bl-xs shadow-2xs'
              }`}
            >
              {msg.isLiveAI && (
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#43836F] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full mb-2 border border-emerald-200/60">
                  <Sparkles className="w-3 h-3" /> Live Gemini AI
                </div>
              )}

              <div className="whitespace-pre-line">{msg.content}</div>

              {/* Citations Box */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#E3E7ED] dark:border-slate-700 text-xs text-[#647184] dark:text-slate-300">
                  <div className="flex items-center gap-1.5 font-bold text-[#315D86]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Official Rule Source:</span>
                  </div>
                  <p className="mt-1 font-semibold text-[#202B3C] dark:text-white">{msg.citations[0].title}</p>
                  <p className="text-[#647184]">{msg.citations[0].department}</p>
                  <a
                    href={msg.citations[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#315D86] hover:underline mt-1 font-bold"
                  >
                    View Official Guidelines <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Message Footer Controls */}
              <div className="flex items-center justify-between gap-3 mt-3 pt-2 text-[11px] text-[#647184] border-t border-[#E3E7ED] dark:border-slate-700/50">
                <span>{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => speakText(msg.content, msg.id)}
                      className="hover:text-[#315D86] flex items-center gap-1 transition-colors cursor-pointer min-h-[36px]"
                      title="Listen to this reply aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isSpeaking === msg.id ? 'Stop Voice' : 'Listen'}</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="hover:text-[#315D86] flex items-center gap-1 transition-colors cursor-pointer min-h-[36px]"
                      title="Copy text"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isCopied === msg.id ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex flex-col items-start">
            <div className="rounded-2xl p-4 bg-[#F0F2F5] dark:bg-slate-800 text-sm text-[#315D86] flex items-center gap-2 border border-[#E3E7ED] dark:border-slate-700 shadow-2xs">
              <Sparkles className="w-4 h-4 animate-spin text-[#315D86]" />
              <span>Gramavance Assistant is thinking with Gemini AI...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </Card>

      {/* Input Bar with Large Touch Targets */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isThinking}
            placeholder={
              language === 'ta'
                ? 'உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யுங்கள்...'
                : language === 'hi'
                ? 'अपना सवाल यहाँ टाइप करें...'
                : 'Type your question here (or click voice button)...'
            }
            className="w-full min-h-[48px] pl-4 pr-12 text-sm sm:text-base bg-[#F0F2F5] dark:bg-slate-800 border border-[#E3E7ED] dark:border-slate-700 rounded-xl text-[#202B3C] dark:text-white placeholder-[#647184] focus:outline-none focus:border-[#315D86] shadow-[inset_0_2px_4px_rgba(32,43,60,0.02)] disabled:opacity-60"
          />
        </div>

        {/* Microphone Button with browser speech integration & fallback */}
        <button
          type="button"
          onClick={toggleMicrophone}
          disabled={isThinking}
          className={`min-h-[48px] min-w-[48px] rounded-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer border ${
            isListening
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-white dark:bg-slate-800 text-[#43836F] border-[#E3E7ED] dark:border-slate-700 hover:bg-[#F0F2F5] shadow-2xs'
          }`}
          title={isListening ? 'Stop listening' : 'Speak your question'}
          aria-label="Toggle voice input"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-[#43836F]" />}
        </button>

        {/* Send Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isThinking || !inputText.trim()}
          className="min-h-[48px] px-5 rounded-xl font-bold text-sm sm:text-base shadow-xs"
        >
          <Send className="w-4 h-4 mr-1.5" />
          <span>Send</span>
        </Button>
      </form>

      {/* Gemini API Key Configuration Modal */}
      {showKeyModal && (
        <Modal
          isOpen={showKeyModal}
          onClose={() => setShowKeyModal(false)}
          title="Connect Google Gemini API"
          description="Enter your Google Gemini API key to activate live Generative AI responses."
          size="md"
        >
          <form onSubmit={handleSaveApiKey} className="space-y-4 text-left">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5">
              <p>
                <strong>How to get a free Gemini API key:</strong>
              </p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>
                  Visit Google AI Studio:{' '}
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#159B68] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    aistudio.google.com/apikey <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Sign in with your Google Account and click <strong>Create API Key</strong>.</li>
                <li>Paste the key below. It will be stored securely in your browser's private storage.</li>
              </ol>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#172B3A] dark:text-white mb-1">
                Gemini API Key:
              </label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full min-h-[48px] px-4 text-sm font-mono rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#172B3A] dark:text-white focus:outline-none focus:border-[#159B68]"
              />
              <span className="text-xs text-slate-400 mt-1 block">
                You can also configure this permanently in a <code>.env</code> file via <code>VITE_GEMINI_API_KEY</code>.
              </span>
            </div>

            {keySaveMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-[#159B68]" />
                <span>{keySaveMessage}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setShowKeyModal(false)}
                className="min-h-[44px]"
              >
                Close
              </Button>
              <Button
                type="submit"
                variant="teal"
                size="md"
                className="min-h-[44px] bg-[#159B68] text-white font-bold"
              >
                Save & Connect API
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
