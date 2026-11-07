import React, { useState } from 'react';
import {
  Download,
  CheckCircle2,
  RefreshCw,
  Info,
  Check,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { MOCK_APPLICATIONS } from '../data/mockData';
import type { GrantApplication, ApplicationStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const Applications: React.FC = () => {
  const { language } = useLanguage();
  const [applications] = useState<GrantApplication[]>(MOCK_APPLICATIONS);
  const [selectedApp, setSelectedApp] = useState<GrantApplication | null>(applications[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const simpleStages = [
    { key: 'Draft', labelEn: '1. Form Filled', labelTa: '1. படிவம் நிரப்பப்பட்டது', icon: '📝' },
    { key: 'Documents Prepared', labelEn: '2. Papers Ready', labelTa: '2. ஆவணங்கள் தயார்', icon: '📄' },
    { key: 'Submitted', labelEn: '3. Sent to Office', labelTa: '3. அலுவலகத்திற்கு சென்றது', icon: '📨' },
    { key: 'Under Review', labelEn: '4. Officer Review', labelTa: '4. அதிகாரி ஆய்வு', icon: '🏛️' },
    { key: 'Sanctioned', labelEn: '5. Money Approved', labelTa: '5. பணம் ஒப்புதல்', icon: '✅' },
  ];

  const getStageIndex = (status: ApplicationStatus) => {
    switch (status) {
      case 'Draft':
        return 0;
      case 'Documents Prepared':
        return 1;
      case 'Submitted':
        return 2;
      case 'Under Review':
        return 3;
      case 'Sanctioned':
      case 'Disbursed':
        return 4;
      default:
        return 0;
    }
  };

  const getNextStepsForStatus = (status: ApplicationStatus) => {
    switch (status) {
      case 'Draft':
        return 'Next Action: Complete all mandatory fields and upload your identity proofs in My Documents.';
      case 'Documents Prepared':
        return 'Next Action: Submit your dossier to the District Industries Centre (DIC) or lead bank branch for review.';
      case 'Submitted':
        return 'Next Action: Application received by nodal office. Task force committee meeting scheduled.';
      case 'Under Review':
        return 'Next Action: Attend the physical interview with the District Level Task Force Committee (DLTFC). Keep original papers ready.';
      case 'Sanctioned':
      case 'Disbursed':
        return 'Next Action: Subsidy margin money released to your bank TDR account. You may proceed with machinery procurement.';
      default:
        return 'Next Action: Verify your papers with the District Resource Person.';
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshMessage(null);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshMessage(
        'Platform-maintained status updated from local cache. Official government confirmation must be checked on the nodal ministry portal.'
      );
      setTimeout(() => setRefreshMessage(null), 6000);
    }, 800);
  };

  const handleDownloadDossier = () => {
    if (!selectedApp) return;
    setDownloadSuccess(true);
    const content = `GRAMAVANCE - APPLICATION ACKNOWLEDGEMENT\nDate: ${new Date().toLocaleDateString()}\n\nScheme: ${selectedApp.schemeTitle}\nApplication Number: ${selectedApp.applicationNumber}\nPlatform Status: ${selectedApp.status}\nRequested Amount: ₹${selectedApp.requestedAmount}\nTarget Deadline: ${selectedApp.targetDeadline}\nNodal Office: ${selectedApp.nodalOffice}\nOfficer Phone: ${selectedApp.nodalContactPhone || '1800-3000-0034'}\nNotes: ${selectedApp.notes}\n\nNotice: Platform-maintained tracking status for educational record. For verified status, contact the nodal office.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Gramavance_Application_${selectedApp.applicationNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-left">
      {/* Title Header */}
      <div className="bg-white dark:bg-[#0E1A29] text-[#202B3C] dark:text-white p-6 sm:p-7 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] border border-[#E3E7ED] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'ta' ? 'என் விண்ணப்பங்கள்' : 'Check My Application'}
            </h1>
            <span className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-[#315D86] dark:text-sky-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Application Tracker
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#647184] dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? 'உங்கள் அரசு உதவி விண்ணப்பம் எந்த நிலையில் உள்ளது என்பதை எளிதாகப் பாருங்கள்.'
              : 'See the exact status of your government help request and what to do next.'}
          </p>
        </div>

        <Button
          variant="teal"
          size="lg"
          leftIcon={<Download className="w-5 h-5" />}
          onClick={handleDownloadDossier}
          className="font-bold min-h-[46px] px-5 rounded-xl shadow-xs cursor-pointer"
        >
          {downloadSuccess ? (
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Downloaded Dossier
            </span>
          ) : language === 'ta' ? (
            'அறிக்கை பதிவிறக்குக'
          ) : (
            'Download Your Funding Report'
          )}
        </Button>
      </div>

      {/* Distinction between Platform vs Verified Govt Status (Phase 5G requirement) */}
      <div className="p-4 rounded-xl bg-[#F0F2F5] dark:bg-slate-900 border border-[#E3E7ED] dark:border-slate-800 text-xs sm:text-sm text-[#202B3C] dark:text-slate-300 flex items-start gap-3 shadow-2xs">
        <Info className="w-5 h-5 text-[#315D86] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#202B3C] dark:text-white">Status Notice:</strong> This tracker displays your platform-maintained milestone progress.
          Official verification and sanction notices are issued directly by the respective government nodal office (such as DIC or KVIC) and financing bank branches.
        </div>
      </div>

      {refreshMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#159B68] shrink-0" />
          <span>{refreshMessage}</span>
        </div>
      )}

      {/* Grid: Left List vs Right Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): List of Applications */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Your Applications ({applications.length})
          </span>

          {applications.map((app) => (
            <Card
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className={`p-5 cursor-pointer transition-colors border-2 rounded-2xl ${
                selectedApp?.id === app.id
                  ? 'border-[#159B68] bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  Application No: {app.applicationNumber}
                </span>
                <Badge
                  variant={
                    app.status === 'Sanctioned'
                      ? 'success'
                      : app.status === 'Under Review'
                      ? 'warning'
                      : 'neutral'
                  }
                  size="md"
                >
                  {app.status === 'Sanctioned'
                    ? 'Money Approved'
                    : app.status === 'Under Review'
                    ? 'Officer Review'
                    : app.status === 'Documents Prepared'
                    ? 'Papers Ready'
                    : app.status}
                </Badge>
              </div>

              <h3 className="text-base font-bold text-[#172B3A] dark:text-slate-100 mt-2">
                {app.schemeTitle}
              </h3>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Requested: <strong>{formatCurrency(app.requestedAmount)}</strong></span>
                <span>Deadline: <strong>{app.targetDeadline}</strong></span>
              </div>
            </Card>
          ))}
        </div>

        {/* Right Column (7 Cols): Application Detail & Step Progress */}
        {selectedApp && (
          <div className="lg:col-span-7 space-y-4">
            <Card className="p-6 sm:p-7 space-y-5 border-2 border-slate-200 dark:border-slate-800 rounded-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-slate-400">
                    Application ID: {selectedApp.applicationNumber}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#172B3A] dark:text-white mt-1">
                    {selectedApp.schemeTitle}
                  </h2>
                </div>

                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Check for status updates"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#159B68]' : ''}`} />
                </button>
              </div>

              {/* Progress Milestones Strip */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>Application Milestones:</span>
                  <span className="text-[#159B68] font-bold">{selectedApp.progressPercent}% Completed</span>
                </div>
                <ProgressBar value={selectedApp.progressPercent} color="emerald" size="lg" />

                {/* 5 Progress Stages */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                  {simpleStages.map((stg, idx) => {
                    const currentIdx = getStageIndex(selectedApp.status);
                    const isDone = idx <= currentIdx;
                    return (
                      <div
                        key={stg.key}
                        className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-colors ${
                          isDone
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-[#159B68] dark:text-emerald-300'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400'
                        }`}
                      >
                        <span className="block text-base mb-1">{stg.icon}</span>
                        <span>{language === 'ta' ? stg.labelTa : stg.labelEn}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next Step Guidance Box (Phase 5G requirement) */}
              <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                <span className="text-xs font-bold text-[#159B68] uppercase tracking-wider block">
                  Next Step to Take:
                </span>
                <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-100">
                  {getNextStepsForStatus(selectedApp.status)}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Officer Note: {selectedApp.notes}
                </p>
              </div>

              {/* Application Details Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-2">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                  <span className="text-xs text-slate-500 block">Nodal Office:</span>
                  <strong className="text-slate-900 dark:text-slate-100 block">
                    {selectedApp.nodalOffice}
                  </strong>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                  <span className="text-xs text-slate-500 block">Officer Contact Phone:</span>
                  <a
                    href={`tel:${selectedApp.nodalContactPhone || '180030000034'}`}
                    className="text-[#159B68] font-bold block hover:underline"
                  >
                    {selectedApp.nodalContactPhone || '1800-3000-0034'}
                  </a>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                  <span className="text-xs text-slate-500 block">Requested Grant Amount:</span>
                  <strong className="text-[#159B68] text-base block font-bold">
                    {formatCurrency(selectedApp.requestedAmount)}
                  </strong>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                  <span className="text-xs text-slate-500 block">Target Review Date:</span>
                  <strong className="text-slate-900 dark:text-slate-100 block">
                    {selectedApp.targetDeadline}
                  </strong>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
