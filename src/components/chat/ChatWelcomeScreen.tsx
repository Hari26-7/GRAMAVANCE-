import React from 'react';
import {
  Sparkles,
  Landmark,
  BadgePercent,
  Users,
  Coins,
  Compass,
  ArrowUpRight,
} from 'lucide-react';

interface ChatWelcomeScreenProps {
  onSelectPrompt: (promptText: string) => void;
}

const SUGGESTED_PROMPTS = [
  {
    id: 'p1',
    title: 'Find government schemes for my business',
    subtitle: 'PMEGP, PMFME, and sector-specific capital subsidies',
    icon: Landmark,
    color: 'from-emerald-500 to-teal-600',
    prompt: 'Can you recommend the best government schemes and capital subsidies for my rural micro-business?',
  },
  {
    id: 'p2',
    title: 'Check my eligibility for government subsidies',
    subtitle: 'Verify qualification criteria, documents, and promoter margin',
    icon: BadgePercent,
    color: 'from-blue-500 to-indigo-600',
    prompt: 'What are the exact eligibility criteria, subsidy percentages, and mandatory documents for PMEGP and PMFME?',
  },
  {
    id: 'p3',
    title: 'How can my SHG obtain funding?',
    subtitle: 'DAY-NRLM revolving fund, 4% interest subvention & seed capital',
    icon: Users,
    color: 'from-purple-500 to-pink-600',
    prompt: 'How can our Women Self-Help Group (SHG) apply for bank credit linkage, 4% interest subvention, and PMFME seed capital?',
  },
  {
    id: 'p4',
    title: 'Explain government loan opportunities',
    subtitle: 'MUDRA Shishu/Kishore/Tarun collateral-free credit',
    icon: Coins,
    color: 'from-amber-500 to-orange-600',
    prompt: 'Explain MUDRA loan categories (Shishu, Kishore, Tarun) and how to apply for collateral-free working capital.',
  },
  {
    id: 'p5',
    title: 'Help me develop my community project',
    subtitle: 'DPR preparation, machinery budgeting & bank appraisal tips',
    icon: Compass,
    color: 'from-cyan-500 to-blue-600',
    prompt: 'Guide me step-by-step to develop a Detailed Project Report (DPR) for a rural food processing and packaging unit.',
  },
];

export const ChatWelcomeScreen: React.FC<ChatWelcomeScreenProps> = ({ onSelectPrompt }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto text-center animate-in fade-in duration-500 overflow-y-auto">
      {/* Hero Welcome Aura */}
      <div className="relative mb-5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/25 ring-4 ring-emerald-500/20">
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full blur-xl -z-10" />
      </div>

      {/* Main Title & Subtitle */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
        Vanakkam! Welcome to <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Gramavance AI</span>
      </h1>

      <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl mt-3 leading-relaxed">
        Your intelligent community development assistant. Ask me about government schemes, subsidies, funding opportunities and community development.
      </p>

      {/* Suggested Prompt Cards Grid */}
      <div className="w-full mt-8">
        <div className="text-left mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Suggested Prompts & Guided Inquiries
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
          {SUGGESTED_PROMPTS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPrompt(item.prompt)}
                className="group relative p-4 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-200 text-left flex flex-col justify-between cursor-pointer active:scale-[0.98]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-xs`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatWelcomeScreen;
