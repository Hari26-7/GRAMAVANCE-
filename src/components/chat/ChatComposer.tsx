import React, { useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Square,
  Globe,
  AlertCircle,
  X,
  Volume2,
} from 'lucide-react';
import type { SpeechLanguage } from '../../hooks/useSpeechRecognition';

interface ChatComposerProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  onStop: () => void;
  // Speech recognition props
  isVoiceSupported: boolean;
  isListening: boolean;
  isProcessingSpeech: boolean;
  speechLanguage: SpeechLanguage;
  setSpeechLanguage: (lang: SpeechLanguage) => void;
  onToggleVoice: () => void;
  voiceError: string | null;
  onClearVoiceError: () => void;
  interimTranscript?: string;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  input,
  setInput,
  onSend,
  isLoading,
  onStop,
  isVoiceSupported,
  isListening,
  isProcessingSpeech,
  speechLanguage,
  setSpeechLanguage,
  onToggleVoice,
  voiceError,
  onClearVoiceError,
  interimTranscript = '',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height smoothly as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollH = textareaRef.current.scrollHeight;
      // Max height approx 5 lines (140px)
      textareaRef.current.style.height = `${Math.min(scrollH, 140)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && (input.trim() || interimTranscript.trim())) {
        onSend();
      }
    }
  };

  const languages: { code: SpeechLanguage; label: string; native: string }[] = [
    { code: 'en-IN', label: 'English', native: 'English' },
    { code: 'ta-IN', label: 'Tamil', native: 'தமிழ்' },
    { code: 'hi-IN', label: 'Hindi', native: 'हिन्दी' },
  ];

  return (
    <div className="p-3 sm:p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 transition-colors shrink-0">
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        {/* Voice Error Notice Banner */}
        {voiceError && (
          <div className="flex items-center justify-between gap-2 px-3 py-2 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{voiceError}</span>
            </div>
            <button
              onClick={onClearVoiceError}
              className="p-1 hover:bg-rose-200/60 dark:hover:bg-rose-900/60 rounded-md cursor-pointer transition-colors"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Active Voice Recording Live Waveform Bar */}
        {isListening && (
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-gradient-to-r from-rose-50 via-red-50 to-amber-50 dark:from-rose-950/40 dark:via-red-950/40 dark:to-amber-950/40 border border-rose-200/80 dark:border-rose-900/80 rounded-2xl animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              {/* Pulsing Red Recording Indicator */}
              <div className="relative flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping absolute"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 relative"></span>
              </div>

              {/* Animated Waveform Bars */}
              <div className="flex items-center gap-1 h-7">
                <span className="w-1 bg-rose-600 dark:bg-rose-500 rounded-full animate-wave-1"></span>
                <span className="w-1 bg-rose-600 dark:bg-rose-500 rounded-full animate-wave-2"></span>
                <span className="w-1 bg-rose-600 dark:bg-rose-500 rounded-full animate-wave-3"></span>
                <span className="w-1 bg-rose-600 dark:bg-rose-500 rounded-full animate-wave-4"></span>
                <span className="w-1 bg-rose-600 dark:bg-rose-500 rounded-full animate-wave-5"></span>
                <span className="w-1 bg-rose-600 dark:bg-rose-500 rounded-full animate-wave-6"></span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  <span>Listening...</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-rose-200/70 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200">
                    {languages.find((l) => l.code === speechLanguage)?.native}
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md">
                  {interimTranscript ? `"${interimTranscript}"` : 'Speak into your microphone now...'}
                </span>
              </div>
            </div>

            {/* Stop Voice Recording Button */}
            <button
              onClick={onToggleVoice}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
              title="Stop listening"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Done</span>
            </button>
          </div>
        )}

        {/* Main Floating Input Box */}
        <div className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
          {/* Left Controls: Language Selector Pill */}
          <div className="flex items-center pl-1 pb-1">
            <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5 shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setSpeechLanguage(l.code)}
                  className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                    speechLanguage === l.code
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={`Recognition Language: ${l.label}`}
                >
                  {l.native}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? 'Speech is being transcribed...'
                : speechLanguage === 'ta-IN'
                ? 'அரசு மானியங்கள், திட்டங்கள் பற்றி கேளுங்கள்...'
                : speechLanguage === 'hi-IN'
                ? 'सरकारी योजनाओं और सब्सिडी के बारे में पूछें...'
                : 'Ask about PMEGP, PMFME, subsidies, eligibility, or bank loans...'
            }
            className="flex-1 max-h-36 py-2 px-2.5 text-sm bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 resize-none focus:outline-none leading-relaxed"
          />

          {/* Right Controls: Microphone & Send/Stop Buttons */}
          <div className="flex items-center gap-1.5 pb-0.5 pr-0.5">
            {/* Real Voice Input Button */}
            <button
              type="button"
              onClick={onToggleVoice}
              disabled={isLoading}
              className={`p-2.5 rounded-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/25 ring-2 ring-rose-400 animate-pulse'
                  : isProcessingSpeech
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 shadow-2xs'
              }`}
              title={
                !isVoiceSupported
                  ? 'Voice input not supported on this browser'
                  : isListening
                  ? 'Stop Voice Input'
                  : `Voice Input (${languages.find((l) => l.code === speechLanguage)?.label})`
              }
              aria-label="Toggle voice input"
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-white" />
              ) : (
                <Mic
                  className={`w-4 h-4 ${
                    !isVoiceSupported ? 'opacity-40 text-slate-400' : ''
                  }`}
                />
              )}
            </button>

            {/* Send or Stop Generation Button */}
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/25 transition-all cursor-pointer active:scale-95"
                title="Stop generating response"
                aria-label="Stop generating response"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSend}
                disabled={!input.trim()}
                className={`p-2.5 rounded-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
                  input.trim()
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/25'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'
                }`}
                title="Send Message (Enter)"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Subtle Guidance Caption */}
        <div className="flex items-center justify-between px-1 text-[11px] text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-slate-400" />
            <span>Voice input supported in English (en-IN) & Tamil (ta-IN)</span>
          </span>
          <span className="hidden sm:inline">Press Enter to send, Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
};

export default ChatComposer;
