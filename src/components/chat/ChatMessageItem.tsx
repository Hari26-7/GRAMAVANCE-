import React, { useState } from 'react';
import { Sparkles, User, Copy, Check, RotateCcw, AlertCircle } from 'lucide-react';
import MarkdownRenderer from '../MarkdownRenderer';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
  isError?: boolean;
}

interface ChatMessageItemProps {
  message: ChatMessage;
  isLatestAi: boolean;
  onRegenerate?: () => void;
  onRetry?: () => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  isLatestAi,
  onRegenerate,
  onRetry,
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex items-start gap-3 w-full my-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0 mt-0.5">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-blue-500/20">
            <User className="w-4 h-4" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-emerald-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Bubble Container */}
      <div
        className={`flex flex-col max-w-[88%] sm:max-w-[78%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        {/* Name & Timestamp Header */}
        <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400 dark:text-slate-500">
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            {isUser ? 'You' : 'Gramavance Copilot'}
          </span>
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Message Body */}
        <div
          className={`rounded-2xl px-4 py-3 shadow-xs text-sm leading-relaxed transition-all ${
            isUser
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs whitespace-pre-wrap selection:bg-blue-300 selection:text-slate-900'
              : message.isError
              ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 rounded-tl-xs'
              : 'bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 rounded-tl-xs shadow-sm'
          }`}
        >
          {message.isError && (
            <div className="flex items-center gap-2 mb-2 font-bold text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Service Notice</span>
            </div>
          )}

          {isUser ? (
            <div className="break-words font-medium">{message.text}</div>
          ) : (
            <MarkdownRenderer text={message.text} />
          )}
        </div>

        {/* Action Controls for AI Messages */}
        {!isUser && (
          <div className="flex items-center gap-1.5 mt-1.5 px-1">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Copy message text"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Copied
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Regenerate Button on Latest AI Message */}
            {isLatestAi && onRegenerate && !message.isError && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Regenerate this response"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Regenerate</span>
              </button>
            )}

            {/* Retry Button on Error */}
            {message.isError && onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 px-2 py-0.5 rounded-md hover:bg-rose-100/60 dark:hover:bg-rose-900/30 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry Message</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageItem;
