import GramavanceChat from '../components/GramavanceChat';

export default function CommunityAssistant() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gramavance Copilot</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Your dedicated Generative AI assistant for grants, subsidies, and community development.
        </p>
      </div>

      {/* Chat Container taking remaining height */}
      <div className="flex-1 min-h-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
        <GramavanceChat />
      </div>
    </div>
  );
}

export { CommunityAssistant };
