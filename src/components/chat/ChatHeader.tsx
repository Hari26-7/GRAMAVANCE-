import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Plus, Trash2, ShieldCheck, Check, AlertTriangle } from 'lucide-react';

interface ChatHeaderProps {
  isOnline: boolean;
  onNewChat: () => void;
  onClearChat: () => void;
  messageCount: number;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  isOnline,
  onNewChat,
  onClearChat,
  messageCount,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const confirmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (confirmRef.current && !confirmRef.current.contains(e.target as Node)) {
        setShowClearConfirm(false);
      }
    };
    if (showClearConfirm) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showClearConfirm]);

  return (
    <header className="px-4 sm:px-6 py-3.5 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 z-10 transition-colors">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/30 shrink-0">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          {/* Real-time Connection Dot */}
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
              isOnline ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            title={isOnline ? 'Connected to Gemini Generative AI' : 'Offline Mode'}
          >
            {isOnline && (
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
            )}
          </span>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-bold text-slate-900 dark:text-white text-base tracking-tight leading-none truncate">
              Gramavance Copilot
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Verified AI</span>
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}
              ></span>
              <span className="font-medium">{isOnline ? 'Online • Ready' : 'Connecting...'}</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              Gemini 3.8 Flash
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* New Conversation Button */}
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer active:scale-95 shadow-2xs border border-slate-200/60 dark:border-slate-700"
          title="Start fresh conversation"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        {/* Clear Conversation Button with Confirmation */}
        {messageCount > 0 && (
          <div className="relative" ref={confirmRef}>
            <button
              onClick={() => setShowClearConfirm(!showClearConfirm)}
              className="p-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-all cursor-pointer active:scale-95 shadow-2xs border border-slate-200/60 dark:border-slate-700"
              title="Clear chat history"
              aria-label="Clear chat history"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {showClearConfirm && (
              <div className="absolute right-0 mt-2 w-64 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 text-left z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-start gap-2 mb-2 text-slate-800 dark:text-slate-100">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold leading-snug">
                    Clear current conversation history?
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2 mt-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2.5 py-1 text-xs rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onClearChat();
                      setShowClearConfirm(false);
                    }}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Check className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default ChatHeader;
