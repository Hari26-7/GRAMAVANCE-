import { useState, useEffect, useRef, useCallback } from 'react';
import ChatHeader from './chat/ChatHeader';
import ChatWelcomeScreen from './chat/ChatWelcomeScreen';
import ChatMessageItem, { type ChatMessage } from './chat/ChatMessageItem';
import ChatComposer from './chat/ChatComposer';
import { useSpeechRecognition, type SpeechLanguage } from '../hooks/useSpeechRecognition';
import { sendGeminiChat } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles } from 'lucide-react';

export default function GramavanceChat() {
  const { language } = useLanguage();

  // Convert app language to speech language code
  const initialSpeechLang: SpeechLanguage =
    language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

  const [speechLanguage, setSpeechLanguage] = useState<SpeechLanguage>(initialSpeechLang);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('gramavance_copilot_chat');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // invalid JSON
      }
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Abort controller reference for stopping generation
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice recognition callback
  const handleVoiceTranscript = useCallback((newText: string) => {
    setInput((prev) => {
      const separator = prev && !prev.endsWith(' ') ? ' ' : '';
      return prev + separator + newText;
    });
  }, []);

  // Voice recognition hook
  const {
    isSupported: isVoiceSupported,
    isListening,
    isProcessing: isProcessingSpeech,
    interimTranscript,
    error: voiceError,
    startListening,
    stopListening,
    clearError: clearVoiceError,
  } = useSpeechRecognition({ onTranscript: handleVoiceTranscript });

  // Save messages to localStorage for persistence
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('gramavance_copilot_chat', JSON.stringify(messages));
    } else {
      localStorage.removeItem('gramavance_copilot_chat');
    }
  }, [messages]);

  // Auto-scroll to latest message
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Monitor network online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Format current time
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Toggle voice recognition
  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(speechLanguage);
    }
  };

  // Stop active AI generation
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  // Send message to Gemini LLM
  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    // If microphone was actively recording, stop it
    if (isListening) {
      stopListening();
    }

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: messageText,
      timestamp: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      // 1. Try serverless /api/chat backend endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
        signal: abortController.signal,
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.text) {
          const aiMsg: ChatMessage = {
            id: `ai_${Date.now()}`,
            role: 'ai',
            text: data.text,
            timestamp: getCurrentTime(),
          };
          setMessages((prev) => [...prev, aiMsg]);
          return;
        }
      }
      throw new Error(`Serverless endpoint returned status ${response.status}`);
    } catch (serverError: any) {
      if (serverError?.name === 'AbortError') {
        const abortMsg: ChatMessage = {
          id: `ai_abort_${Date.now()}`,
          role: 'ai',
          text: '_Response generation was stopped by user._',
          timestamp: getCurrentTime(),
        };
        setMessages((prev) => [...prev, abortMsg]);
        return;
      }

      console.warn('[Gramavance Copilot] Serverless route unavailable, executing direct fallback...', serverError);

      try {
        // 2. Direct client SDK fallback
        const appLangCode = speechLanguage === 'ta-IN' ? 'ta' : speechLanguage === 'hi-IN' ? 'hi' : 'en';
        const fallback = await sendGeminiChat([{ role: 'user', text: messageText }], appLangCode);

        if (fallback.text) {
          const aiMsg: ChatMessage = {
            id: `ai_${Date.now()}`,
            role: 'ai',
            text: fallback.text,
            timestamp: getCurrentTime(),
          };
          setMessages((prev) => [...prev, aiMsg]);
          return;
        }
      } catch (clientError: any) {
        if (clientError?.name === 'AbortError') return;
        console.error('[Gramavance Copilot] Fallback failed:', clientError);
      }

      // 3. Clear error presentation if both failed
      const errorMsg: ChatMessage = {
        id: `ai_err_${Date.now()}`,
        role: 'ai',
        text: '⚠️ Unable to connect to Gemini AI services. Please verify your internet connection or ensure your Gemini API key is configured in settings.',
        timestamp: getCurrentTime(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Regenerate last AI response
  const handleRegenerate = () => {
    if (messages.length === 0 || isLoading) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;

    // Remove the latest AI response and re-query
    setMessages((prev) => {
      const copy = [...prev];
      if (copy[copy.length - 1].role === 'ai') {
        copy.pop();
      }
      return copy;
    });

    handleSendMessage(lastUserMsg.text);
  };

  // Retry on error
  const handleRetry = () => {
    handleRegenerate();
  };

  // Clear chat
  const handleClearChat = () => {
    handleStopGeneration();
    setMessages([]);
    setInput('');
    localStorage.removeItem('gramavance_copilot_chat');
  };

  // New Chat
  const handleNewChat = () => {
    handleClearChat();
  };

  // Handle clicking a prompt card from the welcome screen
  const handleSelectPrompt = (promptText: string) => {
    handleSendMessage(promptText);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50/70 dark:bg-slate-950/70 transition-colors overflow-hidden select-text">
      {/* 1. SaaS Chat Header */}
      <ChatHeader
        isOnline={isOnline}
        onNewChat={handleNewChat}
        onClearChat={handleClearChat}
        messageCount={messages.length}
      />

      {/* 2. Conversation Viewport */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 flex flex-col justify-start">
        {messages.length === 0 ? (
          <ChatWelcomeScreen onSelectPrompt={handleSelectPrompt} />
        ) : (
          <div className="max-w-4xl w-full mx-auto flex flex-col gap-1 pb-4">
            {messages.map((msg, idx) => {
              const isLatestAi =
                msg.role === 'ai' &&
                idx === messages.length - 1 &&
                !isLoading;

              return (
                <ChatMessageItem
                  key={msg.id || idx}
                  message={msg}
                  isLatestAi={isLatestAi}
                  onRegenerate={handleRegenerate}
                  onRetry={handleRetry}
                />
              );
            })}

            {/* Live Thinking / Generating Skeleton */}
            {isLoading && (
              <div className="flex items-start gap-3 w-full my-3 animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-emerald-500/20 shrink-0">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                    <span
                      className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></span>
                    <span
                      className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    ></span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">
                      Reasoning with Gemini...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 3. Modern Floating Message Composer & Voice Input */}
      <ChatComposer
        input={input}
        setInput={setInput}
        onSend={() => handleSendMessage()}
        isLoading={isLoading}
        onStop={handleStopGeneration}
        isVoiceSupported={isVoiceSupported}
        isListening={isListening}
        isProcessingSpeech={isProcessingSpeech}
        speechLanguage={speechLanguage}
        setSpeechLanguage={setSpeechLanguage}
        onToggleVoice={handleToggleVoice}
        voiceError={voiceError}
        onClearVoiceError={clearVoiceError}
        interimTranscript={interimTranscript}
      />
    </div>
  );
}
