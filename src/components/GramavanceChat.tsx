import { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { sendGeminiChat } from '../services/geminiService';

export default function GramavanceChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Vanakkam! I am Gramavance AI. How can I help your community or business today?' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.text) {
          setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
          return;
        }
      }
      throw new Error('Serverless route returned error status');
    } catch (serverError) {
      console.warn('[Gramavance AI] Serverless /api/chat unavailable, attempting direct fallback...', serverError);
      try {
        const fallback = await sendGeminiChat([{ role: 'user', text: userText }]);
        if (fallback.text) {
          setMessages(prev => [...prev, { role: 'ai', text: fallback.text }]);
          return;
        }
      } catch (clientError) {
        console.error('[Gramavance AI] Fallback failed:', clientError);
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: '⚠️ API Connection Error: Please verify that GEMINI_API_KEY is configured in your Vercel Environment Variables or .env file.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <span className="bg-blue-500 w-2.5 h-2.5 rounded-full animate-pulse"></span>
          Gramavance AI
        </h3>
        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-md">Powered by Gemini</span>
      </div>
      <div className="flex-1 p-6 overflow-y-auto bg-slate-50 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-lg px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white shadow-sm whitespace-pre-wrap'
                  : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
              }`}
            >
              {msg.role === 'ai' ? (
                <MarkdownRenderer text={msg.text} />
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-sm text-slate-500 animate-pulse">Generating response...</div>}
      </div>
      <div className="p-4 bg-white border-t border-slate-200 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about grants..."
          className="flex-1 bg-slate-50 border border-slate-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium disabled:opacity-50 cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
}
