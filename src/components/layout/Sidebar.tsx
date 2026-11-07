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
      label: t('navFindSchemes') || 'Find Government Schemes',
      icon: Landmark,
    },
    {
      to: '/eligibility',
      label: t('navCheckEligibility') || 'Check My Eligibility',
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
      badge: 'AI',
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
      className={`fixed lg:sticky top-0 left-0 z-40 h-screen bg-white dark:bg-[#0E1A29] text-[#202B3C] dark:text-slate-100 transition-all duration-300 ease-in-out flex flex-col justify-between shrink-0 select-none border-r border-[#E3E7ED] dark:border-slate-800/80 shadow-[4px_0_24px_rgba(32,43,60,0.03)] ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Top Brand Header */}
      <div>
        <div className="p-4 pt-5 pb-4 flex items-center justify-between border-b border-[#E3E7ED] dark:border-slate-800/80">
          <NavLink
            to="/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-3 group focus:outline-none overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#315D86] to-[#203D57] flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(49,93,134,0.25)] transition-transform group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-white"
              >
                <path
                  d="M19.5 4.5C14.5 4.5 7.5 7.5 5 13C8.5 13 14 11 17 8M19.5 4.5C19.5 9.5 16.5 16.5 11 19C11 15.5 13 10 16 7M19.5 4.5L10 14"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="8" cy="8" r="1.5" fill="white" />
                <circle cx="14" cy="16" r="1.5" fill="white" />
              </svg>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-[#202B3C] dark:text-white tracking-tight leading-none">
                  {t('appName')}
                </span>
                <span className="text-xs text-[#43836F] dark:text-emerald-400 font-semibold mt-1">
                  {t('tagline')}
                </span>
              </div>
            )}
          </NavLink>

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 rounded-xl text-[#647184] hover:text-[#202B3C] dark:hover:text-white hover:bg-[#F0F2F5] dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-[#E3E7ED] dark:hover:border-slate-700"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list with friendly large touch targets */}
        <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)] scrollbar-none">
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
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-bold transition-all duration-180 active:scale-[0.985] ${
                  isActive
                    ? 'bg-[#315D86] text-white shadow-[0_4px_14px_rgba(49,93,134,0.25)]'
                    : 'text-[#647184] dark:text-slate-300 hover:text-[#202B3C] dark:hover:text-white hover:bg-[#F0F2F5] dark:hover:bg-slate-800/70'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-[#647184] dark:text-slate-400'
                  }`}
                />
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1 overflow-hidden">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {item.badge}
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
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
                location.pathname.startsWith('/admin')
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40'
              }`}
              title={isCollapsed ? 'Admin Portal' : undefined}
            >
              <ShieldAlert className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Admin Portal</span>}
            </NavLink>
          )}
        </nav>
      </div>

      {/* Bottom village landscape illustration */}
      {!isCollapsed && (
        <div className="p-3 pt-0 overflow-hidden shrink-0">
          <div className="rounded-2xl overflow-hidden border border-[#E3E7ED] dark:border-slate-800 bg-[#F0F2F5] dark:bg-slate-900 shadow-2xs relative group">
            <img
              src="/gramavance_community_banner.jpg"
              alt="Rural village community"
              className="w-full h-18 object-cover object-bottom opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-[#0E1A29]/90 via-transparent to-transparent flex items-end p-2.5">
              <span className="text-xs text-[#43836F] dark:text-emerald-400 font-bold tracking-wide">
                Village Community Support 🌱
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
