import React, { useState } from 'react';
import {
  TrendingUp,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { MOCK_FINANCIAL_METRICS } from '../data/mockData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';

export const FinancialHealth: React.FC = () => {
  const { language } = useLanguage();
  const [metrics] = useState(MOCK_FINANCIAL_METRICS);
  const [showAdvancedCharts, setShowAdvancedCharts] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalRevenue = metrics.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalExpenses = metrics.reduce((acc, curr) => acc + curr.operatingExpenses, 0);
  const totalDebtPaid = metrics.reduce((acc, curr) => acc + curr.debtService, 0);
  const totalSurplus = metrics.reduce((acc, curr) => acc + curr.cashSurplus, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-left">
      {/* Title Header */}
      <div className="bg-white dark:bg-[#0E1A29] text-[#202B3C] dark:text-white p-6 sm:p-7 rounded-2xl shadow-[0_4px_20px_rgba(32,43,60,0.06)] border border-[#E3E7ED] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'ta' ? 'என் பணம் மற்றும் கடன்கள்' : 'My Money and Loans'}
            </h1>
            <span className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-[#43836F] dark:text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Plain-Language Overview
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#647184] dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? 'உங்கள் தொழிலுக்கு வந்த மொத்த பணம், செய்யப்பட்ட செலவுகள் மற்றும் வங்கிக் கடன் திருப்பிச் செலுத்திய விவரங்களை எளிய முறையில் பாருங்கள்.'
              : 'See how much money came into your business, how much was spent, and your loan repayment record.'}
          </p>
        </div>

        <Button
          variant="teal"
          size="lg"
          onClick={() => setShowAdvancedCharts(!showAdvancedCharts)}
          className="bg-[#159B68] hover:bg-emerald-700 text-white font-bold min-h-[48px] px-5 rounded-xl shadow-xs cursor-pointer"
        >
          {showAdvancedCharts ? 'Show Simple View' : 'Show Advanced Bank Charts'}
        </Button>
      </div>

      {/* Honest Plain-Language Notice (Phase 5F) */}
      <div className="p-4 rounded-xl bg-[#EAF4FF] dark:bg-slate-900 border border-[#BCE0FD] dark:border-slate-800 text-xs sm:text-sm text-[#102D46] dark:text-slate-300 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#159B68] shrink-0 mt-0.5" />
        <div>
          <strong>Plain-Language Explanation & Notice:</strong> This section displays your self-maintained farm or enterprise bookkeeping records to demonstrate credit readiness. Gramavance does not fabricate official credit scores (such as CIBIL) or guarantee loan sanction; formal credit decisions remain with the lending bank.
        </div>
      </div>

      {/* 4 Overview Plain-Language Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-6 space-y-2 border-2 border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            💰 Total Money Received (Sales)
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#172B3A] dark:text-slate-100">
            {formatCurrency(totalRevenue)}
          </h3>
          <span className="text-xs font-semibold text-emerald-600 block">
            ↑ Good sales growth in last 6 months
          </span>
        </Card>

        <Card className="p-6 space-y-2 border-2 border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            🛒 Money Spent on Business
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-700 dark:text-slate-300">
            {formatCurrency(totalExpenses)}
          </h3>
          <span className="text-xs text-slate-500 block">Raw materials, labor, packing</span>
        </Card>

        <Card className="p-6 space-y-2 border-2 border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            🏦 Loan EMIs Paid
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#159B68]">
            {formatCurrency(totalDebtPaid)}
          </h3>
          <span className="text-xs font-semibold text-emerald-600 block">
            ✅ 100% on time! No delays
          </span>
        </Card>

        <Card className="p-6 space-y-2 border-2 border-slate-200 dark:border-slate-800 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            🌟 Savings / Money Left
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-300">
            {formatCurrency(totalSurplus)}
          </h3>
          <span className="text-xs font-semibold text-emerald-600 block">
            In bank account / hand
          </span>
        </Card>
      </div>

      {/* Simple Bank Trust Rating */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 sm:p-7 border-2 border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#172B3A] dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#159B68]" />
              Bank Trust Readiness:
            </h3>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              Very Good 👍
            </span>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Because you have saved <strong>{formatCurrency(totalSurplus)}</strong> and have paid all loan
            installments on time, government banks consider your business trustworthy and low-risk.
          </p>

          <div className="space-y-3 pt-2 text-sm">
            <div>
              <div className="flex justify-between mb-1 text-xs">
                <span>Timely Loan Repayments:</span>
                <strong className="text-emerald-600 font-bold">100% On-Time</strong>
              </div>
              <ProgressBar value={100} color="emerald" size="md" />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-xs">
                <span>Savings Compared to Loan Need:</span>
                <strong className="text-teal-600 font-bold">Strong Reserve</strong>
              </div>
              <ProgressBar value={85} color="teal" size="md" />
            </div>
          </div>
        </Card>

        {/* Current Active Loan Card */}
        <Card className="p-6 sm:p-7 border-2 border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#172B3A] dark:text-slate-100 flex items-center gap-2">
              <Building className="w-6 h-6 text-[#102D46]" />
              Current Bank Loan:
            </h3>
            <Badge variant="success" size="md">
              4% Interest Subvention
            </Badge>
          </div>

          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <p><strong>Bank:</strong> Indian Overseas Bank, Thiruvaiyaru Branch</p>
            <p><strong>Loan Type:</strong> Women Self-Help Group (SHG) Business Loan</p>
            <div className="p-3 bg-[#F4F9F6] dark:bg-slate-800 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Monthly Installment (EMI):</span>
                <strong className="text-slate-900 dark:text-slate-100">₹9,000 / month</strong>
              </div>
              <div className="flex justify-between">
                <span>Remaining Loan Balance:</span>
                <strong className="text-slate-900 dark:text-slate-100">₹4,20,000</strong>
              </div>
            </div>
            <p className="text-xs text-emerald-600 font-semibold pt-1">
              ✨ Prompt Repayment Rebate: You are saving interest every month by paying on time!
            </p>
          </div>
        </Card>
      </div>

      {/* Advanced Financial Details & Charts (Collapsible for Accountants/Bank Officers) */}
      <Card className="p-6 border-2 border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#172B3A] dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              Advanced Financial Records (For Bank Officers & Accountants)
            </h3>
            <p className="text-xs text-slate-500">
              Technical cash-flow graphs and Debt Service Coverage Ratio (DSCR) calculations.
            </p>
          </div>
          <button
            onClick={() => setShowAdvancedCharts(!showAdvancedCharts)}
            className="text-xs font-semibold text-[#159B68] hover:underline flex items-center gap-1 cursor-pointer min-h-[44px]"
          >
            {showAdvancedCharts ? (
              <>
                <ChevronUp className="w-4 h-4" /> Hide Advanced Charts
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" /> Show Advanced Charts
              </>
            )}
          </button>
        </div>

        {showAdvancedCharts && (
          <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#159B68" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#159B68" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSurplus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#102D46" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#102D46" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val)), '']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#fff',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Gross Sales"
                    stroke="#159B68"
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                  <Area
                    type="monotone"
                    dataKey="cashSurplus"
                    name="Net Surplus"
                    stroke="#102D46"
                    fillOpacity={1}
                    fill="url(#colorSurplus)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-2 text-slate-600 dark:text-slate-300">
              <p>
                <strong>DSCR (Debt Service Coverage Ratio): 2.4x:</strong> This means you generate ₹2.40 of
                operating cash flow for every ₹1.00 of bank loan EMI obligation. Banks require at least 1.5x.
              </p>
              <p>
                <strong>Audited Ledger Status:</strong> Reconciled with Indian Overseas Bank statement for FY 2025-26.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
