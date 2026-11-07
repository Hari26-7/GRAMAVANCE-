import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Mic,
  Landmark,
  TrendingUp,
  Folder,
  Handshake,
  IndianRupee,
  Users,
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  onCloseMobile,
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const navItems = [
    {
      to: '/dashboard',
      label: t('navDashboard') || 'Home / Dashboard',
      icon: Home,
    },
    {
      to: '/schemes',
      label: t('navFindSchemes') || 'Find Schemes',
      icon: Landmark,
    },
    {
      to: '/eligibility',
      label: t('navCheckEligibility') || 'Check Eligibility',
      icon: TrendingUp,
    },
    {
      to: '/community',
      label: t('navCommunityNetwork') || 'Community Network',
      icon: Users,
    },
    {
      to: '/marketplace',
      label: t('navLocalMarketplace') || 'Local Marketplace',
      icon: Handshake,
    },
    {
      to: '/documents',
      label: t('navMyDocuments') || 'My Documents',
      icon: Folder,
    },
    {
      to: '/financial-readiness',
      label: t('navFinancialReadiness') || 'Financial Readiness',
      icon: IndianRupee,
    },
    {
      to: '/assistant',
      label: t('navAssistant') || 'Community Assistant',
      icon: Mic,
      isAI: true,
    },
    {
      to: '/help',
      label: t('navHelpSupport') || 'Help & Support',
      icon: HelpCircle,
    },
    {
      to: '/profile',
      label: t('navMyProfile') || 'My Profile',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 z-40 h-screen bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out flex flex-col justify-between shrink-0 select-none border-r border-slate-800/80 shadow-lg ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="p-4 flex items-center justify-between border-b border-slate-800/80 h-16">
          <NavLink
            to="/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-3 group focus:outline-none overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
              >
                <path
                  d="M19.5 4.5C14.5 4.5 7.5 7.5 5 13C8.5 13 14 11 17 8M19.5 4.5C19.5 9.5 16.5 16.5 11 19C11 15.5 13 10 16 7M19.5 4.5L10 14"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col text-left">
                <span className="font-bold text-base text-white tracking-tight leading-none">
                  {t('appName')}
                </span>
                <span className="text-[11px] text-blue-400 mt-1 font-medium truncate">
                  {t('tagline')}
                </span>
              </div>
            )}
          </NavLink>

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isHome = item.to === '/dashboard';
            const isActive = isHome
              ? location.pathname === '/' || location.pathname === '/dashboard'
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/10 text-white border-l-4 border-blue-500 rounded-l-none pl-2.5'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-blue-400' : 'text-slate-400'
                  }`}
                />
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1 overflow-hidden">
                    <span className="truncate">{item.label}</span>
                    {item.isAI && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-0.5 shadow-xs">
                        <Sparkles className="w-2.5 h-2.5" /> AI
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}

          {user.role === 'administrator' && (
            <NavLink
              to="/admin"
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                location.pathname.startsWith('/admin')
                  ? 'bg-blue-600/10 text-white border-l-4 border-blue-500 rounded-l-none pl-2.5'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title={isCollapsed ? 'Admin Portal' : undefined}
            >
              <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400" />
              {!isCollapsed && <span>Admin Portal</span>}
            </NavLink>
          )}
        </nav>
      </div>

      {/* Bottom User / Online Indicator */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span className="truncate font-medium text-slate-300">{user.fullName}</span>
          </div>
          <span className="text-[11px] text-blue-400 font-semibold uppercase">{user.district}</span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
