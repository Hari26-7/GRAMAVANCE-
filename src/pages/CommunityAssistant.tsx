import GramavanceChat from '../components/GramavanceChat';

export default function CommunityAssistant() {
  return (
    <div className="w-full h-[calc(100vh-7rem)] sm:h-[calc(100vh-7.5rem)] lg:h-[calc(100vh-8rem)] flex flex-col -my-2 sm:-my-3">
      {/* SaaS Chat Shell with Glassmorphic Backdrop */}
      <div className="flex-1 min-h-0 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-lg rounded-2xl overflow-hidden flex flex-col transition-colors">
        <GramavanceChat />
      </div>
    </div>
  );
}

export { CommunityAssistant };
