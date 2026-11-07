import React, { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MOCK_NOTIFICATIONS } from '../data/mockData';
import type { NotificationItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const Notifications: React.FC = () => {
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<string>('all');

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'deadlines') return n.category === 'scheme_deadline';
    if (filter === 'applications') return n.category === 'application_update';
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 text-left">
      {/* Title Header */}
      <div className="bg-white dark:bg-[#0E1A29] text-[#202B3C] dark:text-white p-6 sm:p-7 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] border border-[#E3E7ED] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'ta' ? 'முக்கிய அறிவிப்புகள்' : 'Alerts & Reminders'}
            </h1>
            <span className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-[#315D86] dark:text-sky-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Latest Updates
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#647184] dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? 'உங்கள் அரசு விண்ணப்ப நிலவரம் மற்றும் திட்ட அறிவிப்புகளை இங்கே பார்க்கலாம்.'
              : 'Updates on your application status, important deadlines, and buyer inquiries.'}
          </p>
        </div>

        <Button
          variant="teal"
          size="md"
          leftIcon={<CheckCheck className="w-4 h-4" />}
          onClick={markAllRead}
          className="font-bold min-h-[44px] px-5 rounded-xl shadow-xs"
        >
          {language === 'ta' ? 'அனைத்தையும் படித்ததாகக் குறிக்கவும்' : 'Mark All Read'}
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 text-sm font-semibold flex-wrap">
        {[
          { key: 'all', label: 'All Alerts' },
          { key: 'unread', label: 'Unread Only' },
          { key: 'applications', label: 'Application Updates' },
          { key: 'deadlines', label: 'Scheme Deadlines' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer text-xs sm:text-sm active:scale-95 ${
              filter === f.key
                ? 'bg-[#315D86] text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-[#E3E7ED] dark:border-slate-800 text-[#647184] dark:text-slate-300 hover:text-[#202B3C] shadow-2xs'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <Card className="divide-y divide-[#E3E7ED] dark:divide-slate-800 overflow-hidden border border-[#E3E7ED] dark:border-slate-800 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] bg-white dark:bg-[#0E1A29]">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No notifications in this category.
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => toggleRead(n.id)}
              className={`p-5 flex items-start justify-between gap-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                !n.isRead ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
                    !n.isRead
                      ? 'bg-[#159B68] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#172B3A] dark:text-slate-100">
                      {n.title}
                    </h3>
                    {!n.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#159B68]" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-xs text-slate-400 mt-2 block">{n.timestamp}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};
