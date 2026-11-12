import { useState } from 'react';

export default function GramavanceChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Vanakkam! I am Gramavance AI. How can I help your community or business today?' }]);
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
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
    } catch (error) {
      console.error('Gramavance AI connection error:', error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Connection error.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
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
            <div className={`max-w-[85%] rounded-lg px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-800 shadow-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-sm text-slate-500 animate-pulse">Generating response...</div>}
      </div>
      <div className="p-4 bg-white border-t border-slate-200 flex gap-3">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask about grants..." className="flex-1 bg-slate-50 border border-slate-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
        <button onClick={handleSend} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium disabled:opacity-50">Send</button>
      </div>
    </div>
  );
}
