import React, { useState } from 'react';
import {
  PlusCircle,
  FileCheck2,
  HelpCircle,
  Shield,
  Building2,
  Wallet,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useLanguage } from '../context/LanguageContext';

export interface IncomeExpenseEntry {
  id: string;
  type: 'Income' | 'Expense';
  title: string;
  category: string;
  amount: number;
  date: string;
}

export interface UserLoanRecord {
  id: string;
  lenderName: string;
  schemeOrType: string;
  sanctionedAmount: number;
  outstandingBalance: number;
  monthlyEmi: number;
  repaymentStatus: 'On-Time' | 'Grace Period' | 'Completed';
  startDate: string;
}

const INITIAL_ENTRIES: IncomeExpenseEntry[] = [
  { id: 'tx_01', type: 'Income', title: 'Salem Turmeric Bulk Order (500 kg)', category: 'Product Sales', amount: 90000, date: '2026-03-24' },
  { id: 'tx_02', type: 'Income', title: 'Local Village Grocery Turmeric Supply', category: 'Retail Sales', amount: 18500, date: '2026-03-20' },
  { id: 'tx_03', type: 'Expense', title: 'Raw Turmeric Rhizomes Procurement', category: 'Raw Materials', amount: 38000, date: '2026-03-15' },
  { id: 'tx_04', type: 'Expense', title: 'Food-grade Vacuum Pouches (2,000 pcs)', category: 'Packaging', amount: 6200, date: '2026-03-12' },
  { id: 'tx_05', type: 'Expense', title: 'Pulverizer Electricity & Transport', category: 'Operations', amount: 4800, date: '2026-03-08' },
];

const INITIAL_LOANS: UserLoanRecord[] = [
  {
    id: 'loan_01',
    lenderName: 'Indian Overseas Bank, Thiruvaiyaru',
    schemeOrType: 'DAY-NRLM Women SHG Bank Linkage',
    sanctionedAmount: 200000,
    outstandingBalance: 64000,
    monthlyEmi: 4200,
    repaymentStatus: 'On-Time',
    startDate: '2024-08-10',
  },
];

export const FinancialReadiness: React.FC = () => {
  const { language } = useLanguage();

  const [entries, setEntries] = useState<IncomeExpenseEntry[]>(() => {
    const saved = localStorage.getItem('gramavance_fin_entries');
    return saved ? JSON.parse(saved) : INITIAL_ENTRIES;
  });

  const [loans, setLoans] = useState<UserLoanRecord[]>(() => {
    const saved = localStorage.getItem('gramavance_fin_loans');
    return saved ? JSON.parse(saved) : INITIAL_LOANS;
  });

  // Modal: Add Transaction
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [txType, setTxType] = useState<'Income' | 'Expense'>('Income');
  const [txTitle, setTxTitle] = useState('');
  const [txCategory, setTxCategory] = useState('Product Sales');
  const [txAmount, setTxAmount] = useState('');

  // Modal: Add Loan
  const [showAddLoanModal, setShowAddLoanModal] = useState(false);
  const [loanBank, setLoanBank] = useState('');
  const [loanScheme, setLoanScheme] = useState('MUDRA Kishore');
  const [loanSanctioned, setLoanSanctioned] = useState('');
  const [loanBalance, setLoanBalance] = useState('');
  const [loanEmi, setLoanEmi] = useState('');

  // Loan Readiness Checklist State
  const [checklist, setChecklist] = useState({
    bankPassbook: true,
    machineryQuotation: true,
    premiseProof: true,
    kycDocuments: true,
    ownContributionSaved: true,
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalIncome = entries
    .filter((e) => e.type === 'Income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = entries
    .filter((e) => e.type === 'Expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalMonthlyEmi = loans
    .filter((l) => l.repaymentStatus !== 'Completed')
    .reduce((sum, l) => sum + l.monthlyEmi, 0);

  const netCashSurplus = totalIncome - totalExpense - totalMonthlyEmi;

  // Calculate readiness score
  const checklistItems = [
    { key: 'bankPassbook' as const, label: '6-Month Clean Bank Passbook Statement (showing regular cash flow)', ready: checklist.bankPassbook },
    { key: 'machineryQuotation' as const, label: 'Formal Machinery / Equipment Price Quotation with GST', ready: checklist.machineryQuotation },
    { key: 'premiseProof' as const, label: 'Land Ownership Patta or Shop Rent Agreement (Minimum 3 Years)', ready: checklist.premiseProof },
    { key: 'kycDocuments' as const, label: 'Aadhaar Card, PAN Card, and Rural Residence Certificate', ready: checklist.kycDocuments },
    { key: 'ownContributionSaved' as const, label: 'Minimum 5% to 10% Own Contribution Saved in Bank Account', ready: checklist.ownContributionSaved },
  ];

  const readyCount = checklistItems.filter((i) => i.ready).length;
  const readinessPercentage = Math.round((readyCount / checklistItems.length) * 100);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txTitle.trim() || !txAmount) return;

    const newTx: IncomeExpenseEntry = {
      id: `tx_${Date.now()}`,
      type: txType,
      title: txTitle.trim(),
      category: txCategory,
      amount: parseFloat(txAmount) || 0,
      date: new Date().toISOString().split('T')[0],
    };

    const updated = [newTx, ...entries];
    setEntries(updated);
    localStorage.setItem('gramavance_fin_entries', JSON.stringify(updated));
    setShowAddTxModal(false);
    setTxTitle('');
    setTxAmount('');
  };

  const handleAddLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanBank.trim() || !loanSanctioned) return;

    const newLoan: UserLoanRecord = {
      id: `loan_${Date.now()}`,
      lenderName: loanBank.trim(),
      schemeOrType: loanScheme,
      sanctionedAmount: parseFloat(loanSanctioned) || 0,
      outstandingBalance: parseFloat(loanBalance) || 0,
      monthlyEmi: parseFloat(loanEmi) || 0,
      repaymentStatus: 'On-Time',
      startDate: new Date().toISOString().split('T')[0],
    };

    const updated = [newLoan, ...loans];
    setLoans(updated);
    localStorage.setItem('gramavance_fin_loans', JSON.stringify(updated));
    setShowAddLoanModal(false);
    setLoanBank('');
    setLoanSanctioned('');
    setLoanBalance('');
    setLoanEmi('');
  };

  return (
    <div className="min-h-full -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 transition-colors">
      <div className="space-y-6 max-w-6xl mx-auto pb-12 text-left">
        {/* Title Header with Frosted Glass Canvas */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/80 dark:border-white/10 text-slate-800 dark:text-white p-6 sm:p-7 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
                {language === 'ta' ? 'நிதித் தயார்நிலை & கணக்கு வழக்கம்' : 'Financial Readiness Tracker'}
              </h1>
              <span className="bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-[#315D86] dark:text-sky-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Loan Readiness & Bookkeeping
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {language === 'ta'
                ? 'உங்கள் வரவு, செலவு மற்றும் வங்கிக் கடன்களை எளிய முறையில் பதிவு செய்து, வங்கி கடன் மற்றும் அரசு மானியம் பெற தயார்நிலையை அறியுங்கள்.'
                : 'Track income, operating expenses, and existing loan EMIs to verify your repayment capacity before applying to banks.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="teal"
              size="md"
              onClick={() => setShowAddTxModal(true)}
              leftIcon={<PlusCircle className="w-4 h-4" />}
              className="font-bold min-h-[44px] px-4 rounded-xl shadow-sm text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 transition-transform active:scale-95"
            >
              Record Entry
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowAddLoanModal(true)}
              leftIcon={<Building2 className="w-4 h-4" />}
              className="font-bold min-h-[44px] px-4 rounded-xl shadow-sm text-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/90 dark:border-white/10 hover:bg-white text-slate-800 dark:text-slate-100 transition-transform active:scale-95"
            >
              Add Loan
            </Button>
          </div>
        </div>

        {/* Human-Centered 3-Question Guidance Card */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-white/10 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-3">
          <div className="flex items-center gap-2 font-bold text-[#315D86] dark:text-sky-300 text-sm">
            <HelpCircle className="w-4 h-4 text-[#315D86]" />
            <span>About Your Financial Readiness:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
            <div>
              <strong className="block text-slate-800 dark:text-white font-semibold mb-0.5">1. What is this page for?</strong>
              <span>Keep your business income and expense records organized so banks can easily see your repayment capacity.</span>
            </div>
            <div>
              <strong className="block text-slate-800 dark:text-white font-semibold mb-0.5">2. What can I do here?</strong>
              <span>Record monthly sales, track loan balances, and check the 5 essential requirements banks examine before approving loans.</span>
            </div>
            <div>
              <strong className="block text-slate-800 dark:text-white font-semibold mb-0.5">3. What should I do next?</strong>
              <span>Complete any missing papers in the "Bank Loan Readiness Checklist" below so your application is sanctioned without delay.</span>
            </div>
          </div>
        </div>

        {/* Honest Privacy & No-Credit-Bureau Disclaimer */}
        <div className="p-4 rounded-xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/60 dark:border-white/10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-3 shadow-sm">
          <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong>Privacy & Authenticity Notice:</strong> All figures shown are based strictly on records entered by you. Gramavance does not invent fake credit scores or claim unauthorized access to bank accounts or credit rating bureaus (CIBIL/Experian).
          </div>
        </div>

        {/* 2. Financial Metric Cards (Top Row) — Premium Frosted Glass */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Recorded Revenue */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-5 space-y-1.5 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Recorded Revenue:
            </span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 block tracking-tight">
              {formatCurrency(totalIncome)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">From product & retail sales</span>
          </div>

          {/* Metric 2: Operating Expenses */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-5 space-y-1.5 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Operating Expenses:
            </span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 block tracking-tight">
              {formatCurrency(totalExpense)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Raw materials, fuel & packing</span>
          </div>

          {/* Metric 3: Monthly Loan EMIs */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-5 space-y-1.5 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Monthly Loan EMIs:
            </span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 block tracking-tight">
              {formatCurrency(totalMonthlyEmi)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Active bank debt repayments</span>
          </div>

          {/* Metric 4: Net Monthly Cash Surplus */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-5 space-y-1.5 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
              Net Monthly Cash Surplus:
            </span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 block tracking-tight">
              {formatCurrency(netCashSurplus)}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              ✓ Positive repayment capacity
            </span>
          </div>
        </div>

        {/* Financial Summary Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">
            Financial Summary Chart
          </h3>
          {entries.length === 0 ? (
            <div className="flex items-center justify-center h-[260px] text-slate-400 dark:text-slate-500 text-sm">
              No entries yet. Add income or expense records to see your chart.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={[
                  { name: 'Income', value: totalIncome },
                  { name: 'Expenses', value: totalExpense },
                  { name: 'Net Surplus', value: netCashSurplus },
                ]}
                margin={{ top: 8, right: 16, left: 16, bottom: 4 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => [`₹${Number(value ?? 0).toLocaleString('en-IN')}`, ''] as [string, string]}
                  contentStyle={{
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  <Cell fill="#10b981" />
                  <Cell fill="#f43f5e" />
                  <Cell fill="#3b82f6" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 3. Bank Loan Readiness Checklist — Primary Glass Panel */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-sm rounded-3xl p-6 md:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Bank Loan Readiness Checklist (5 Essential Pillars)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Banks verify these 5 items to sanction your PMEGP, PMFME, or MUDRA loan dossier.
              </p>
            </div>

            <div className="text-right sm:shrink-0">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Readiness Score:</span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {readinessPercentage}% Ready
              </span>
            </div>
          </div>

          {/* Glowing Fluid Progress Bar */}
          <div className="w-full h-3 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${readinessPercentage}%` }}
            />
          </div>

          {/* Nested Glass Pills Checklist Items */}
          <div className="space-y-2.5">
            {checklistItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() =>
                  setChecklist((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                }
                className={`bg-white/50 dark:bg-slate-800/50 border border-white/80 dark:border-white/10 shadow-sm rounded-xl p-4 transition-all hover:bg-white/80 dark:hover:bg-slate-800/80 flex items-center justify-between gap-3 cursor-pointer ${
                  item.ready ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-transform active:scale-90 ${
                      item.ready
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-[0_2px_8px_rgba(16,185,129,0.35)]'
                        : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-400'
                    }`}
                  >
                    {item.ready ? '✓' : ''}
                  </div>
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-colors ${
                    item.ready
                      ? 'bg-emerald-100/70 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60'
                      : 'bg-amber-100/70 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/60'
                  }`}
                >
                  {item.ready ? 'Ready in Vault' : 'Action Needed'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Existing Loans Section — Glass Panel */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-sm rounded-3xl p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Your Existing Bank Loans & Repayment Status ({loans.length})
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Entered by user</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loans.map((l) => (
              <div
                key={l.id}
                className="bg-white/50 dark:bg-slate-800/50 border border-white/80 dark:border-white/10 shadow-sm rounded-2xl p-4.5 space-y-3 transition-all hover:bg-white/80 dark:hover:bg-slate-800/80"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                      {l.lenderName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{l.schemeOrType}</p>
                  </div>
                  <Badge variant="teal" size="sm">
                    {l.repaymentStatus}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-xs border-t border-slate-200/60 dark:border-slate-700/60">
                  <div>
                    <span className="text-slate-400 block">Sanctioned:</span>
                    <strong className="text-slate-700 dark:text-slate-300 font-bold">
                      {formatCurrency(l.sanctionedAmount)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Balance:</span>
                    <strong className="text-slate-700 dark:text-slate-300 font-bold">
                      {formatCurrency(l.outstandingBalance)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Monthly EMI:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {formatCurrency(l.monthlyEmi)}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bookkeeping Entries Table — Glass Panel */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-sm rounded-3xl overflow-hidden">
          <div className="p-5 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm border-b border-white/60 dark:border-white/10 flex items-center justify-between">
            <span className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Recent Business Income & Expenses ({entries.length})
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Saved in browser storage</span>
          </div>

          <div className="divide-y divide-white/60 dark:divide-white/10">
            {entries.map((tx) => (
              <div key={tx.id} className="p-4 sm:p-4.5 flex items-center justify-between gap-3 text-sm transition-colors hover:bg-white/40 dark:hover:bg-slate-800/40">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                      tx.type === 'Income'
                        ? 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100/80 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {tx.type === 'Income' ? '↓' : '↑'}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-100">{tx.title}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {tx.category} • {tx.date}
                    </p>
                  </div>
                </div>

                <strong
                  className={`text-base font-extrabold tabular-nums ${
                    tx.type === 'Income'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {tx.type === 'Income' ? '+' : '-'} {formatCurrency(tx.amount)}
                </strong>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Add Transaction */}
        {showAddTxModal && (
          <Modal
            isOpen={true}
            onClose={() => setShowAddTxModal(false)}
            title="Record Business Income or Expense"
            size="md"
          >
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => setTxType('Income')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                    txType === 'Income' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  + Income (வரவு)
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('Expense')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                    txType === 'Expense' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  - Expense (செலவு)
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Entry Description:</label>
                <input
                  type="text"
                  required
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  placeholder="e.g. Turmeric batch sale / Machine maintenance"
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category:</label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full h-11 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  >
                    <option>Product Sales</option>
                    <option>Retail Sales</option>
                    <option>Raw Materials</option>
                    <option>Packaging</option>
                    <option>Operations & Electricity</option>
                    <option>Transport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Amount (₹):</label>
                  <input
                    type="number"
                    required
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="md" onClick={() => setShowAddTxModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="teal" size="md" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  Save Record
                </Button>
              </div>
            </form>
          </Modal>
        )}

        {/* Modal: Add Loan */}
        {showAddLoanModal && (
          <Modal
            isOpen={true}
            onClose={() => setShowAddLoanModal(false)}
            title="Add Existing Bank Loan Record"
            size="md"
          >
            <form onSubmit={handleAddLoan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Bank & Branch Name:</label>
                <input
                  type="text"
                  required
                  value={loanBank}
                  onChange={(e) => setLoanBank(e.target.value)}
                  placeholder="e.g. Canara Bank, Thanjavur Main"
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Loan Scheme / Purpose:</label>
                <select
                  value={loanScheme}
                  onChange={(e) => setLoanScheme(e.target.value)}
                  className="w-full h-11 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                >
                  <option>DAY-NRLM Women SHG Bank Linkage</option>
                  <option>MUDRA Shishu (up to ₹50,000)</option>
                  <option>MUDRA Kishore (₹50,000 to ₹5L)</option>
                  <option>Kisan Credit Card (KCC)</option>
                  <option>General Agricultural Gold Loan</option>
                  <option>PMEGP First Loan</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Sanctioned (₹):</label>
                  <input
                    type="number"
                    required
                    value={loanSanctioned}
                    onChange={(e) => setLoanSanctioned(e.target.value)}
                    placeholder="100000"
                    className="w-full h-11 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Balance (₹):</label>
                  <input
                    type="number"
                    required
                    value={loanBalance}
                    onChange={(e) => setLoanBalance(e.target.value)}
                    placeholder="35000"
                    className="w-full h-11 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Monthly EMI (₹):</label>
                  <input
                    type="number"
                    required
                    value={loanEmi}
                    onChange={(e) => setLoanEmi(e.target.value)}
                    placeholder="2800"
                    className="w-full h-11 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="md" onClick={() => setShowAddLoanModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="teal" size="md" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  Save Loan Record
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default FinancialReadiness;
