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
    <header className="sticky top-0 z-30 flex flex-col bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      {/* Top Accessibility & Helpline Strip */}
      <div className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 py-1 text-xs text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
          <span className="font-medium text-zinc-900 dark:text-zinc-100">{t('emergencyHelpline')}</span>
        </div>

        {/* Text Size & High Contrast controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-500 mr-1 flex items-center gap-0.5">
              <Type className="w-3 h-3" /> Size:
            </span>
            <button
              onClick={decreaseTextSize}
              className={`px-1 text-xs font-semibold rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer ${
                textSize === 'normal' ? 'text-zinc-300 pointer-events-none' : 'text-zinc-900 dark:text-zinc-100'
              }`}
              title="Decrease text size"
            >
              -A
            </button>
            <span className="text-[11px] font-mono text-zinc-900 dark:text-zinc-100 px-1 uppercase">{textSize}</span>
            <button
              onClick={increaseTextSize}
              className={`px-1 text-xs font-semibold rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer ${
                textSize === 'xl' ? 'text-zinc-300 pointer-events-none' : 'text-zinc-900 dark:text-zinc-100'
              }`}
              title="Increase text size"
            >
              +A
            </button>
          </div>

          <button
            onClick={toggleHighContrast}
            className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md border transition-colors cursor-pointer ${
              highContrast
                ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title="Toggle high contrast for easier reading"
          >
            <Eye className="w-3 h-3" />
            <span>Contrast</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile toggle & Search Input */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 rounded-md text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          {/* Minimalist Monochromatic Search Bar */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-900 transition-colors"
            />
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="h-8 flex items-center gap-1.5 px-2.5 text-xs font-medium text-zinc-900 dark:text-zinc-200 bg-white dark:bg-zinc-900 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
              <span>{languages.find((l) => l.code === language)?.native || 'English'}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-zinc-900 rounded-md shadow-sm border border-zinc-200 dark:border-zinc-800 py-1 z-50">
                <div className="px-3 py-1 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                  Select Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      language === l.code
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-semibold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span>{l.native}</span>
                    <span className="text-[11px] text-zinc-400">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Switch: Monochromatic Buttons */}
          <div className="flex items-center p-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                theme === 'light'
                  ? 'bg-white text-zinc-900 font-semibold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Switch to light mode"
            >
              <Sun className="w-3 h-3" />
              <span className="hidden sm:inline">Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Switch to dark mode"
            >
              <Moon className="w-3 h-3" />
              <span className="hidden sm:inline">Dark</span>
            </button>
          </div>

          {/* Notifications */}
          <a
            href="#/notifications"
            className="h-8 w-8 inline-flex items-center justify-center relative text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-md transition-colors"
            title="Alerts and Reminders"
          >
            <Bell className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />
          </a>

          {/* User Profile Avatar with dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="h-8 flex items-center gap-1.5 p-1 pr-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="My Account"
            >
              <div className="w-6 h-6 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
                <span>{user.fullName.charAt(0)}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white dark:bg-zinc-900 rounded-md shadow-sm border border-zinc-200 dark:border-zinc-800 p-2.5 z-50 text-left">
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded border border-zinc-200 dark:border-zinc-800 mb-2">
                  <h4 className="text-xs font-semibold text-zinc-950 dark:text-zinc-50">
                    {user.fullName}
                  </h4>
                  <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                    {user.organizationName || user.role}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                    {user.district}, {user.state}
                  </span>
                </div>

                <div className="px-2 py-1 text-[11px] font-medium text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Switch Role</span>
                  <span className="text-[10px] text-zinc-500">Demo</span>
                </div>

                <div className="max-h-52 overflow-y-auto space-y-0.5">
                  {availableRoles.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => {
                        switchRole(item.role);
                        setShowProfileMenu(false);
                      }}
                      className={`w-full text-left p-2 rounded text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        user.role === item.role
                          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 font-semibold'
                          : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <p className="truncate">{item.label}</p>
                        <p className="text-[10px] text-zinc-400 truncate">{item.org}</p>
                      </div>
                      {user.role === item.role && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100 shrink-0" />
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

export default TopNavbar;
