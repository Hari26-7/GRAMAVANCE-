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
      className={`fixed lg:sticky top-0 left-0 z-40 h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 transition-all duration-200 ease-in-out flex flex-col justify-between shrink-0 select-none border-r border-zinc-200 dark:border-zinc-800 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Brand Header */}
      <div>
        <div className="p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 h-14">
          <NavLink
            to="/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 group focus:outline-none overflow-hidden"
          >
            <div className="w-7 h-7 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shrink-0 font-bold text-xs">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-current"
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
                <span className="font-semibold text-sm text-zinc-950 dark:text-zinc-50 tracking-tight leading-none">
                  {t('appName')}
                </span>
                <span className="text-[11px] text-zinc-500 mt-1 font-normal">
                  {t('tagline')}
                </span>
              </div>
            )}
          </NavLink>

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-none">
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
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0 text-current" />
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1 overflow-hidden">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono uppercase bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200">
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
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname.startsWith('/admin')
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
              title={isCollapsed ? 'Admin Portal' : undefined}
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-current" />
              {!isCollapsed && <span>Admin Portal</span>}
            </NavLink>
          )}
        </nav>
      </div>

      {/* Bottom status indicator */}
      {!isCollapsed && (
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
            <span>Platform Online</span>
          </span>
          <span className="font-mono text-[10px] text-zinc-400">v2.4</span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
