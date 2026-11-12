import React, { useState } from 'react';
import {
  User,
  Globe,
  Save,
  CheckCircle2,
  Phone,
  MapPin,
  Building,
  Sparkles,
  Key,
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  getGeminiApiKey,
  setGeminiApiKey,
  getGeminiApiKeySource,
  testGeminiConnection,
} from '../services/geminiService';
import type { LanguageCode } from '../types';

export const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [district, setDistrict] = useState(user.district);
  const [state, setState] = useState(user.state);
  const [orgName, setOrgName] = useState(user.organizationName || '');
  const [isSaved, setIsSaved] = useState(false);

  // Gemini API Key state
  const [geminiKeyInput, setGeminiKeyInput] = useState(getGeminiApiKey());
  const [showKey, setShowKey] = useState(false);
  const [keySource, setKeySource] = useState(getGeminiApiKeySource());
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [keySaveMessage, setKeySaveMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      phone,
      district,
      state,
      organizationName: orgName,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSaveApiKey = () => {
    setGeminiApiKey(geminiKeyInput);
    const newSource = getGeminiApiKeySource();
    setKeySource(newSource);
    setKeySaveMessage(
      geminiKeyInput.trim()
        ? language === 'ta'
          ? 'ஜெமினி API சாவி வெற்றிகரமாகச் சேமிக்கப்பட்டது!'
          : 'Gemini API key saved successfully!'
        : language === 'ta'
        ? 'ஜெமினி API சாவி நீக்கப்பட்டது.'
        : 'Gemini API key removed.'
    );
    setTimeout(() => setKeySaveMessage(null), 3500);
  };

  const handleTestKey = async () => {
    setIsTestingKey(true);
    setTestResult(null);
    const result = await testGeminiConnection(geminiKeyInput);
    setIsTestingKey(false);
    setTestResult(result);
  };

  const handleClearApiKey = () => {
    setGeminiApiKey('');
    setGeminiKeyInput('');
    setKeySource('none');
    setTestResult(null);
    setKeySaveMessage(
      language === 'ta'
        ? 'சாவி நீக்கப்பட்டது. இயல்பான சரிபார்க்கப்பட்ட விதிகள் முறையில் இயங்குகிறது.'
        : 'API key removed. Running in verified local rule-based mode.'
    );
    setTimeout(() => setKeySaveMessage(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 text-left">
      {/* Title Header */}
      <div className="bg-white dark:bg-[#0E1A29] text-[#202B3C] dark:text-white p-6 sm:p-7 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] border border-[#E3E7ED] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'ta' ? 'என் விவரங்கள் மற்றும் அமைப்புகள்' : 'My Profile & Settings'}
            </h1>
            <span className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-[#315D86] dark:text-sky-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Personal Settings
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#647184] dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? 'உங்கள் பெயர், அலைபேசி எண், ஊர் மற்றும் விருப்பமான மொழியை இங்கு எளிதாக மாற்றிக் கொள்ளலாம்.'
              : 'Update your name, mobile phone number, district, and preferred language.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <Card className="p-6 sm:p-7 space-y-5 border border-[#E3E7ED] dark:border-slate-800 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] bg-white dark:bg-[#0E1A29]">
          <CardTitle className="text-lg text-[#202B3C] dark:text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-[#315D86]" />
            Your Personal Information:
          </CardTitle>

          <div className="space-y-4">
            <div>
              <label className="font-bold block mb-1 text-sm text-[#202B3C] dark:text-slate-200">
                Your Full Name (உங்கள் முழுப் பெயர்)
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ananya Devi"
                className="w-full h-11 px-4 rounded-xl border border-[#E3E7ED] dark:border-slate-700 bg-[#F0F2F5] dark:bg-slate-800 text-sm text-[#202B3C] dark:text-slate-100 focus:outline-none focus:border-[#315D86] shadow-[inset_0_2px_4px_rgba(32,43,60,0.02)]"
              />
              <span className="text-xs text-[#647184] mt-1 block">
                As written on your Aadhaar card or bank passbook.
              </span>
            </div>

            <div>
              <label className="font-bold block mb-1 text-sm text-[#202B3C] dark:text-slate-200 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#647184]" />
                Mobile Phone Number (அலைபேசி எண்)
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 98421-50291"
                className="w-full h-11 px-4 rounded-xl border border-[#E3E7ED] dark:border-slate-700 bg-[#F0F2F5] dark:bg-slate-800 text-sm text-[#202B3C] dark:text-slate-100 focus:outline-none focus:border-[#315D86] shadow-[inset_0_2px_4px_rgba(32,43,60,0.02)]"
              />
              <span className="text-xs text-[#647184] mt-1 block">
                Government officers will contact you on this phone number.
              </span>
            </div>

            <div>
              <label className="font-bold block mb-1 text-sm text-[#202B3C] dark:text-slate-200 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#647184]" />
                Self-Help Group or Business Name (குழு அல்லது தொழில் பெயர்)
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. Kaveri Mahalir Suya Udhavi Kuzhu"
                className="w-full h-11 px-4 rounded-xl border border-[#E3E7ED] dark:border-slate-700 bg-[#F0F2F5] dark:bg-slate-800 text-sm text-[#202B3C] dark:text-slate-100 focus:outline-none focus:border-[#315D86] shadow-[inset_0_2px_4px_rgba(32,43,60,0.02)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold block mb-1 text-sm text-[#202B3C] dark:text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#647184]" />
                  District (மாவட்டம்)
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Thanjavur"
                  className="w-full h-11 px-4 rounded-xl border border-[#E3E7ED] dark:border-slate-700 bg-[#F0F2F5] dark:bg-slate-800 text-sm text-[#202B3C] dark:text-slate-100 focus:outline-none focus:border-[#315D86] shadow-[inset_0_2px_4px_rgba(32,43,60,0.02)]"
                />
              </div>

              <div>
                <label className="font-bold block mb-1 text-sm text-[#202B3C] dark:text-slate-200">
                  State (மாநிலம்)
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Tamil Nadu"
                  className="w-full h-11 px-4 rounded-xl border border-[#E3E7ED] dark:border-slate-700 bg-[#F0F2F5] dark:bg-slate-800 text-sm text-[#202B3C] dark:text-slate-100 focus:outline-none focus:border-[#315D86] shadow-[inset_0_2px_4px_rgba(32,43,60,0.02)]"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Language Preference Card */}
        <Card className="p-6 sm:p-7 space-y-4 border border-[#E3E7ED] dark:border-slate-800 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] bg-white dark:bg-[#0E1A29]">
          <CardTitle className="text-lg text-[#202B3C] dark:text-slate-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#315D86]" />
            Choose Your Preferred Language (விருப்பமான மொழி):
          </CardTitle>

          <p className="text-sm text-[#647184] dark:text-slate-300">
            The entire website and voice helper will speak in the language you choose here.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { code: 'ta' as LanguageCode, label: 'தமிழ் (Tamil)', desc: 'தமிழில் தகவல்கள் மற்றும் குரல் உதவி' },
              { code: 'en' as LanguageCode, label: 'English', desc: 'Simple plain English guidance' },
              { code: 'hi' as LanguageCode, label: 'हिन्दी (Hindi)', desc: 'सरल हिन्दी में मार्गदर्शन और सहायता' },
            ].map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  language === l.code
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-[#159B68] text-[#102D46] dark:text-emerald-300 font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-[#172B3A] dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="text-base font-bold">{l.label}</div>
                <div className="text-xs text-slate-500 mt-1">{l.desc}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Google Gemini AI API Configuration Card */}
        <Card className="p-6 sm:p-7 space-y-5 border-2 border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-lg text-[#102D46] dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              {language === 'ta'
                ? 'கூகிள் ஜெமினி AI இணைப்பு (Google Gemini API)'
                : 'Google Gemini Generative AI Connection'}
            </CardTitle>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                geminiKeyInput.trim()
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200 dark:border-emerald-700'
                  : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  geminiKeyInput.trim() ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
              />
              {geminiKeyInput.trim()
                ? 'Live Gemini Flash'
                : 'Offline / Verified Rules'}
            </span>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {language === 'ta'
              ? 'கூகிள் ஜெமினி API சாவியை இணைத்தால் AI சமூக உதவியாளர் மற்றும் ஆவணப் பகுப்பாய்வு நேரடி செயற்கை நுண்ணறிவுடன் தமிழில் பேசும். சாவி இல்லாவிட்டாலும் தளம் முழுமையாக இயங்கும்.'
              : 'Connecting your Google Gemini API key powers the Community Assistant with real-time, patient conversational intelligence and deep scheme explanations. If no key is set, Gramavance runs safely in verified offline rule mode.'}
          </p>

          <div className="space-y-3">
            {/* Quick AI Key Setup info card */}
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>
                For this exam demo, your Gramavance AI assistant uses a secure Vercel serverless backend. No API key entry needed in the app — the key is securely stored server-side.
              </span>
            </div>

            <label className="font-bold block text-sm text-[#172B3A] dark:text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-4 h-4 text-emerald-600" />
                Gemini API Key (API ரகசியச் சாவி)
              </span>
              {keySource === 'env' && (
                <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md">
                  Loaded from .env
                </span>
              )}
              {keySource === 'localStorage' && (
                <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-md">
                  Saved in Browser
                </span>
              )}
            </label>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={geminiKeyInput}
                onChange={(e) => setGeminiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full h-12 pl-4 pr-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base font-mono text-[#172B3A] dark:text-slate-100 focus:outline-none focus:border-[#159B68]"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                aria-label={showKey ? 'Hide key' : 'Show key'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleTestKey}
                disabled={isTestingKey || !geminiKeyInput.trim()}
                leftIcon={
                  <RefreshCw
                    className={`w-4 h-4 ${isTestingKey ? 'animate-spin' : ''}`}
                  />
                }
                className="h-11 px-4 text-sm font-semibold rounded-xl border-slate-300 dark:border-slate-700"
              >
                {isTestingKey
                  ? language === 'ta'
                    ? 'சரிபார்க்கிறது...'
                    : 'Testing Connection...'
                  : language === 'ta'
                  ? 'இணைப்பைச் சோதிக்கவும்'
                  : 'Test Connection'}
              </Button>

              <Button
                type="button"
                variant="teal"
                size="md"
                onClick={handleSaveApiKey}
                leftIcon={<Save className="w-4 h-4" />}
                className="h-11 px-5 text-sm font-semibold bg-[#159B68] hover:bg-emerald-700 text-white rounded-xl"
              >
                {language === 'ta' ? 'API சாவியைச் சேமிக்கவும்' : 'Save API Key'}
              </Button>

              {geminiKeyInput.trim() && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleClearApiKey}
                  leftIcon={<Trash2 className="w-4 h-4 text-rose-500" />}
                  className="h-11 px-3 text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900 rounded-xl"
                >
                  {language === 'ta' ? 'நீக்கு' : 'Remove'}
                </Button>
              )}

              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex items-center gap-1.5 text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
              >
                {language === 'ta'
                  ? 'இலவச API சாவி பெற (Google AI Studio)'
                  : 'Get free key on Google AI Studio'}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Test connection alert message */}
            {testResult && (
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-sm ${
                  testResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-800 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 text-rose-800 dark:text-rose-200'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-semibold">
                    {testResult.success
                      ? language === 'ta'
                        ? 'கூகிள் ஜெமினி API இணைப்பு வெற்றிகரமாக வேலை செய்கிறது!'
                        : 'Google Gemini API connection verified successfully!'
                      : language === 'ta'
                      ? 'இணைப்பில் சிக்கல் ஏற்பட்டது'
                      : 'Connection error'}
                  </div>
                  <div className="text-xs mt-0.5 opacity-90">{testResult.message}</div>
                </div>
              </div>
            )}

            {/* Save notification */}
            {keySaveMessage && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{keySaveMessage}</span>
              </div>
            )}

            {/* Privacy note */}
            <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-2 leading-relaxed">
              <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0">
                🔒 Privacy:
              </span>
              <span>
                Your API key is stored securely in your browser's private local storage.
                It is sent directly to Google's official Gemini API endpoint
                (<code>gemini-2.5-flash</code>) and never stored on any intermediate server.
                You can also configure it in a <code>.env</code> file via <code>VITE_GEMINI_API_KEY</code>.
              </span>
            </div>
          </div>
        </Card>

        {/* Submit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {isSaved ? (
            <span className="text-base font-bold text-emerald-600 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Information successfully saved!
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Your details are kept safe and private.
            </span>
          )}

          <Button
            type="submit"
            variant="teal"
            size="lg"
            leftIcon={<Save className="w-5 h-5" />}
            className="w-full sm:w-auto bg-[#159B68] hover:bg-emerald-700 text-white font-bold h-14 px-8 rounded-2xl shadow-md text-base"
          >
            {language === 'ta' ? 'விவரங்களைச் சேமிக்கவும்' : 'Save My Information'}
          </Button>
        </div>
      </form>
    </div>
  );
};
