import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Menu,
  CheckCircle2,
  Phone,
  Eye,
  Type,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import type { LanguageCode } from '../../types';

interface TopNavbarProps {
  onToggleSidebar?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar }) => {
  const {
    theme,
    setTheme,
    textSize,
    increaseTextSize,
    decreaseTextSize,
    highContrast,
    toggleHighContrast,
  } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, switchRole, availableRoles } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  ];

  return (
    <header className="sticky top-0 z-30 flex flex-col bg-white dark:bg-[#0E1A29] border-b border-[#E3E7ED] dark:border-slate-800/80 transition-colors shadow-[0_2px_12px_rgba(32,43,60,0.03)]">
      {/* Top Accessibility & Helpline Strip */}
      <div className="bg-[#F0F2F5] dark:bg-[#09121D] border-b border-[#E3E7ED] dark:border-slate-800/80 px-4 py-1.5 text-xs text-[#647184] dark:text-slate-300 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-[#43836F]" />
          <span className="font-semibold text-[#202B3C] dark:text-slate-200">{t('emergencyHelpline')}</span>
        </div>

        {/* Text Size & High Contrast controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-[#E3E7ED] dark:border-slate-700 shadow-2xs">
            <span className="text-[11px] font-bold text-[#647184] dark:text-slate-400 mr-1 flex items-center gap-0.5">
              <Type className="w-3 h-3" /> Text Size:
            </span>
            <button
              onClick={decreaseTextSize}
              className={`px-1.5 py-0.5 text-xs font-bold rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer ${
                textSize === 'normal' ? 'text-slate-300 pointer-events-none' : 'text-[#202B3C] dark:text-white'
              }`}
              title="Decrease text size"
            >
              - A
            </button>
            <span className="text-[11px] font-bold text-[#315D86] dark:text-sky-400 px-1 uppercase">{textSize}</span>
            <button
              onClick={increaseTextSize}
              className={`px-1.5 py-0.5 text-xs font-bold rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer ${
                textSize === 'xl' ? 'text-slate-300 pointer-events-none' : 'text-[#202B3C] dark:text-white'
              }`}
              title="Increase text size"
            >
              + A
            </button>
          </div>

          <button
            onClick={toggleHighContrast}
            className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all active:scale-95 shadow-2xs cursor-pointer ${
              highContrast
                ? 'bg-[#315D86] text-white border-[#315D86]'
                : 'bg-white dark:bg-slate-800 text-[#202B3C] dark:text-slate-200 border-[#E3E7ED] dark:border-slate-700 hover:bg-[#F5F6F8]'
            }`}
            title="Toggle high contrast for easier reading"
          >
            <Eye className="w-3 h-3" />
            <span>High Contrast</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile toggle & Search Input */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-[#202B3C] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#E3E7ED] dark:border-slate-700 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Search Bar with friendly soft recessed styling */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#647184]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 text-sm sm:text-base bg-[#F0F2F5] dark:bg-slate-900 border border-[#E3E7ED] dark:border-slate-700 rounded-xl text-[#202B3C] dark:text-slate-100 placeholder-[#647184] focus:outline-none focus:ring-2 focus:ring-[#315D86] focus:bg-white dark:focus:bg-slate-900 transition-all shadow-[inset_0_2px_4px_rgba(32,43,60,0.04)]"
            />
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-[#202B3C] dark:text-slate-200 bg-white dark:bg-slate-800 rounded-xl hover:bg-[#F5F6F8] dark:hover:bg-slate-700 border border-[#E3E7ED] dark:border-slate-700 shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <Globe className="w-4 h-4 text-[#315D86]" />
              <span>{languages.find((l) => l.code === language)?.native || 'English'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_10px_28px_rgba(32,43,60,0.1)] border border-[#E3E7ED] dark:border-slate-800 py-1.5 z-50">
                <div className="px-3 py-1.5 text-xs font-bold text-[#647184] uppercase tracking-wider">
                  Select Language / மொழி
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full min-h-[40px] text-left px-4 py-2 text-sm flex items-center justify-between transition-colors cursor-pointer ${
                      language === l.code
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-[#315D86] font-bold'
                        : 'text-[#202B3C] dark:text-slate-300 hover:bg-[#F0F2F5] dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{l.native}</span>
                    <span className="text-xs text-[#647184]">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Switch: Explicit Sun (Light) and Moon (Dark) Buttons */}
          <div className="flex items-center p-1 bg-[#F0F2F5] dark:bg-slate-800/80 border border-[#E3E7ED] dark:border-slate-700 rounded-xl shadow-2xs">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-white text-amber-600 shadow-[0_2px_6px_rgba(32,43,60,0.08)]'
                  : 'text-[#647184] hover:text-[#202B3C]'
              }`}
              title="Switch to light mode"
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#315D86] text-white shadow-[0_2px_6px_rgba(49,93,134,0.3)]'
                  : 'text-[#647184] hover:text-[#202B3C] dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Switch to dark mode"
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dark</span>
            </button>
          </div>

          {/* Notifications */}
          <a
            href="#/notifications"
            className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center relative p-2 text-[#202B3C] dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-[#F0F2F5] dark:hover:bg-slate-700 border border-[#E3E7ED] dark:border-slate-700 rounded-xl shadow-2xs transition-all active:scale-95"
            title="Alerts and Reminders"
          >
            <Bell className="w-4 h-4 text-[#202B3C] dark:text-slate-100" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              3
            </span>
          </a>

          {/* User Profile Avatar with dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="min-h-[40px] flex items-center gap-1.5 p-1 pr-2 bg-white dark:bg-slate-800 border border-[#E3E7ED] dark:border-slate-700 rounded-xl shadow-2xs hover:bg-[#F0F2F5] transition-all cursor-pointer active:scale-95"
              title="My Account & Persona"
            >
              <div className="w-7 h-7 rounded-lg bg-[#315D86] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <span>{user.fullName.charAt(0)}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#647184]" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_10px_28px_rgba(32,43,60,0.1)] border border-[#E3E7ED] dark:border-slate-800 p-3 z-50">
                <div className="p-3 bg-[#F0F2F5] dark:bg-slate-800/60 rounded-xl mb-2 border border-[#E3E7ED] dark:border-slate-700">
                  <h4 className="text-sm font-bold text-[#202B3C] dark:text-slate-100">
                    {user.fullName}
                  </h4>
                  <p className="text-xs text-[#647184] truncate mt-0.5">
                    {user.organizationName || user.role}
                  </p>
                  <span className="inline-block mt-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#43836F] border border-emerald-200/60">
                    {user.district}, {user.state}
                  </span>
                </div>

                <div className="px-2 py-1 text-xs font-bold text-[#647184] uppercase tracking-wider flex items-center justify-between">
                  <span>Switch Rural Persona</span>
                  <span className="text-[10px] font-bold text-[#43836F] bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                    Demo Mode
                  </span>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1">
                  {availableRoles.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => {
                        switchRole(item.role);
                        setShowProfileMenu(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-between transition-colors ${
                        user.role === item.role
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-[#315D86] font-bold'
                          : 'hover:bg-[#F0F2F5] dark:hover:bg-slate-800 text-[#202B3C] dark:text-slate-300'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <p className="font-semibold truncate">{item.label}</p>
                        <p className="text-xs text-[#647184] truncate">{item.org}</p>
                      </div>
                      {user.role === item.role && (
                        <CheckCircle2 className="w-4 h-4 text-[#315D86] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
