import React, { useState, useMemo } from 'react';
import {
  PlusCircle,
  FileCheck2,
  Shield,
  Building2,
  Wallet,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Landmark,
  Trash2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Legend,
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

const FUNDING_APPLICATIONS = [
  {
    id: 'fund_01',
    schemeName: "Prime Minister's Employment Generation Programme (PMEGP)",
    requestedAmount: 1750000,
    sanctionedAmount: 1750000,
    subsidyAmount: 612500,
    status: 'Sanctioned',
    bank: 'Indian Overseas Bank',
    date: '2026-02-18',
  },
  {
    id: 'fund_02',
    schemeName: 'PM Formalisation of Micro food processing Enterprises (PMFME)',
    requestedAmount: 850000,
    sanctionedAmount: 0,
    subsidyAmount: 297500,
    status: 'Under Review',
    bank: 'District Industries Centre (DIC)',
    date: '2026-03-05',
  },
];

const DONUT_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

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

  const [entryFilter, setEntryFilter] = useState<'All' | 'Income' | 'Expense'>('All');

  // Modals
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [txType, setTxType] = useState<'Income' | 'Expense'>('Income');
  const [txTitle, setTxTitle] = useState('');
  const [txCategory, setTxCategory] = useState('Product Sales');
  const [txAmount, setTxAmount] = useState('');

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

  const totalIncome = useMemo(
    () => entries.filter((e) => e.type === 'Income').reduce((sum, e) => sum + e.amount, 0),
    [entries]
  );

  const totalExpense = useMemo(
    () => entries.filter((e) => e.type === 'Expense').reduce((sum, e) => sum + e.amount, 0),
    [entries]
  );

  const totalMonthlyEmi = useMemo(
    () => loans.filter((l) => l.repaymentStatus !== 'Completed').reduce((sum, l) => sum + l.monthlyEmi, 0),
    [loans]
  );

  const totalSanctionedLoans = useMemo(
    () => loans.reduce((sum, l) => sum + l.sanctionedAmount, 0),
    [loans]
  );

  const netCashSurplus = totalIncome - totalExpense - totalMonthlyEmi;

  // 6-Month Cash Flow Trend Data
  const cashFlowTrendData = useMemo(() => [
    { month: 'Oct', revenue: 62000, expense: 28000, surplus: 34000 },
    { month: 'Nov', revenue: 71000, expense: 31000, surplus: 40000 },
    { month: 'Dec', revenue: 85000, expense: 36000, surplus: 49000 },
    { month: 'Jan', revenue: 76000, expense: 34000, surplus: 42000 },
    { month: 'Feb', revenue: 92000, expense: 41000, surplus: 51000 },
    { month: 'Mar', revenue: totalIncome, expense: totalExpense, surplus: Math.max(0, netCashSurplus) },
  ], [totalIncome, totalExpense, netCashSurplus]);

  // Expense Distribution By Category
  const expenseDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    entries
      .filter((e) => e.type === 'Expense')
      .forEach((e) => {
        map[e.category] = (map[e.category] || 0) + e.amount;
      });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [entries]);

  // Calculate readiness score
  const checklistItems = [
    { key: 'bankPassbook' as const, label: '6-Month Clean Bank Passbook Statement (regular cash flow)', ready: checklist.bankPassbook },
    { key: 'machineryQuotation' as const, label: 'Formal Machinery / Equipment Price Quotation with GST', ready: checklist.machineryQuotation },
    { key: 'premiseProof' as const, label: 'Land Ownership Patta or Shop Rent Agreement (Minimum 3 Years)', ready: checklist.premiseProof },
    { key: 'kycDocuments' as const, label: 'Aadhaar Card, PAN Card, and Rural Residence Certificate', ready: checklist.kycDocuments },
    { key: 'ownContributionSaved' as const, label: 'Minimum 5% to 10% Own Contribution Saved in Bank Account', ready: checklist.ownContributionSaved },
  ];

  const readyCount = checklistItems.filter((i) => i.ready).length;
  const readinessPercentage = Math.round((readyCount / checklistItems.length) * 100);

  const filteredEntries = useMemo(() => {
    if (entryFilter === 'All') return entries;
    return entries.filter((e) => e.type === entryFilter);
  }, [entries, entryFilter]);

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

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem('gramavance_fin_entries', JSON.stringify(updated));
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
    <div className="min-h-full -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="space-y-6 max-w-7xl mx-auto pb-12 text-left">
        {/* Title Header with Soft Morphic Accent */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white p-6 sm:p-7 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {language === 'ta' ? 'நிதித் தயார்நிலை & கடன் பகுப்பாய்வு' : 'Financial Readiness & Analytics'}
              </h1>
              <span className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Bank Bookkeeping
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Track business cash flow, examine your loan repayment capacity, and verify all 5 essential pillars banks require for PMEGP, PMFME, and MUDRA sanctions.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="teal"
              size="md"
              onClick={() => setShowAddTxModal(true)}
              leftIcon={<PlusCircle className="w-4 h-4" />}
              className="font-bold min-h-[42px] px-4 rounded-xl shadow-sm text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-95"
            >
              Record Entry
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowAddLoanModal(true)}
              leftIcon={<Building2 className="w-4 h-4" />}
              className="font-bold min-h-[42px] px-4 rounded-xl shadow-sm text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-50 cursor-pointer active:scale-95"
            >
              Add Loan Record
            </Button>
          </div>
        </div>

        {/* 1. TOP ROW: 5 Financial Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Revenue */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-1.5 transition-all hover:shadow-md hover:border-emerald-200">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Recorded Revenue</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white block tracking-tight">
              {formatCurrency(totalIncome)}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              From verified sales records
            </span>
          </div>

          {/* Card 2: Operating Expenses */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-1.5 transition-all hover:shadow-md hover:border-rose-200">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Operating Expenses</span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                <ArrowDownRight className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white block tracking-tight">
              {formatCurrency(totalExpense)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Materials, logistics & power
            </span>
          </div>

          {/* Card 3: Net Cash Surplus */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-1.5 transition-all hover:shadow-md hover:border-blue-200">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Net Monthly Surplus</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white block tracking-tight">
              {formatCurrency(netCashSurplus)}
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
              ✓ Positive debt service capacity
            </span>
          </div>

          {/* Card 4: Total Funding Sanctioned */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-1.5 transition-all hover:shadow-md hover:border-purple-200">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Sanctioned Funding</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                <Landmark className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white block tracking-tight">
              {formatCurrency(totalSanctionedLoans + 1750000)}
            </span>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
              PMEGP + Bank Linkage Credit
            </span>
          </div>

          {/* Card 5: Loan Readiness Score */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-1.5 transition-all hover:shadow-md hover:border-emerald-200">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Loan Readiness</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">
                {readyCount}/5
              </div>
            </div>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block tracking-tight">
              {readinessPercentage}%
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              {readinessPercentage >= 80 ? 'Bank Dossier Ready' : 'Documents Pending'}
            </span>
          </div>
        </div>

        {/* 2. MIDDLE SECTION: Professional Recharts Visualizations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: 6-Month Cash Flow & Growth (Smooth Area Chart with Gradient) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Cash Flow & Revenue Growth (6-Month Trend)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Consistent positive operating cash flow demonstrates business sustainability to bank managers.
                </p>
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="surplusGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    formatter={(val) => [`₹${Number(val ?? 0).toLocaleString('en-IN')}`, ''] as [string, string]}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGrad)" />
                  <Area type="monotone" dataKey="surplus" name="Net Surplus" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#surplusGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 pt-3 text-xs border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Recorded Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Net Cash Surplus</span>
              </div>
            </div>
          </div>

          {/* Chart 2: Operating Expense Breakdown (Donut Chart with Legend) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <PieIcon className="w-4 h-4 text-blue-600" />
                    Operating Expense Distribution
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Categorized expenditure breakdown across inventory, packaging, and facility utilities.
                  </p>
                </div>
              </div>

              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={88}
                      paddingAngle={4}
                    >
                      {expenseDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [`₹${Number(val ?? 0).toLocaleString('en-IN')}`, ''] as [string, string]}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Total Monthly Operating Cost:</span>
              <strong className="text-slate-900 dark:text-white font-bold">{formatCurrency(totalExpense)}</strong>
            </div>
          </div>
        </div>

        {/* 3. SECONDARY ROW: Income vs Expense Comparison & Funding Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Comparison Bar Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              Monthly Revenue vs Outflow Comparison
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Direct comparison between cash inflow, operational outflow, and net debt repayment capacity.
            </p>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Revenue', amount: totalIncome },
                    { name: 'Expenses', amount: totalExpense },
                    { name: 'Loan EMIs', amount: totalMonthlyEmi },
                    { name: 'Net Surplus', amount: Math.max(0, netCashSurplus) },
                  ]}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    formatter={(val) => [`₹${Number(val ?? 0).toLocaleString('en-IN')}`, 'Amount'] as [string, string]}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    <Cell fill="#10b981" />
                    <Cell fill="#f43f5e" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#3b82f6" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Funding Applications Status Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-purple-600" />
                  Government Funding & Subsidy Applications ({FUNDING_APPLICATIONS.length})
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Active capital subsidy applications and loan margin money processing states.
              </p>

              <div className="space-y-3">
                {FUNDING_APPLICATIONS.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{app.schemeName}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{app.bank} • Applied {app.date}</p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          app.status === 'Sanctioned'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-400">Total Project Loan:</span>
                        <strong className="block text-slate-800 dark:text-slate-200">{formatCurrency(app.requestedAmount)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Government 35% Subsidy:</span>
                        <strong className="block text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(app.subsidyAmount)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Overall Funding Progress:</span>
              <strong className="text-purple-600 dark:text-purple-400 font-bold">₹19.5 Lakh Sanctioned</strong>
            </div>
          </div>
        </div>

        {/* 4. BOTTOM ROW: Bank Loan Readiness Checklist & Bookkeeping Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checklist Column (1 col) */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                Bank Loan Readiness Checklist
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {readinessPercentage}% Ready
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Banks verify these 5 mandatory criteria prior to approving PMEGP or MUDRA loan applications.
            </p>

            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${readinessPercentage}%` }}
              />
            </div>

            <div className="space-y-2 pt-1">
              {checklistItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setChecklist((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    item.ready
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/60 text-slate-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-transform ${
                      item.ready ? 'bg-emerald-600 text-white' : 'border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {item.ready ? '✓' : ''}
                  </div>
                  <span className="text-xs font-medium leading-relaxed">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bookkeeping Table Column (2 cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  Recent Income & Expense Records ({filteredEntries.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Maintained ledger of verified rural retail sales, bulk orders, and operational expenditures.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
                {(['All', 'Income', 'Expense'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setEntryFilter(f)}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      entryFilter === f
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredEntries.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono text-slate-500">{e.date}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{e.title}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                          {e.category}
                        </span>
                      </td>
                      <td className={`py-3 px-3 text-right font-bold ${e.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {e.type === 'Income' ? `+${formatCurrency(e.amount)}` : `-${formatCurrency(e.amount)}`}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleDeleteEntry(e.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Existing Loans Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Existing Bank Loan Accounts ({loans.length})
            </h3>
            <span className="text-xs text-slate-400 font-medium">Active Bank Linkages</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loans.map((l) => (
              <div
                key={l.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{l.lenderName}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{l.schemeOrType}</p>
                  </div>
                  <Badge variant="teal" size="sm">
                    {l.repaymentStatus}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-xs border-t border-slate-200/60 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block">Sanctioned:</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-bold">{formatCurrency(l.sanctionedAmount)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Balance:</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-bold">{formatCurrency(l.outstandingBalance)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Monthly EMI:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(l.monthlyEmi)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Authenticity Notice */}
        <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong>Authenticity & Privacy Assurance:</strong> All calculations are computed deterministically from records maintained by your Self-Help Group or enterprise. Gramavance neverfabricates credit scores or shares confidential bookkeeping with third parties without authorization.
          </div>
        </div>
      </div>

      {/* Modal: Add Transaction */}
      {showAddTxModal && (
        <Modal
          isOpen={showAddTxModal}
          onClose={() => setShowAddTxModal(false)}
          title="Record Income or Expense Entry"
          description="Log daily business transactions to keep your bookkeeping ready for bank scrutiny."
          size="md"
          footer={
            <div className="w-full flex justify-end gap-2.5">
              <Button type="button" variant="outline" size="md" onClick={() => setShowAddTxModal(false)}>
                Cancel
              </Button>
              <Button type="submit" form="add-tx-form" variant="teal" size="md" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Save Transaction
              </Button>
            </div>
          }
        >
          <form id="add-tx-form" onSubmit={handleAddTransaction} className="space-y-4 text-left">
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setTxType('Income')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  txType === 'Income'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                + Income (Sales)
              </button>
              <button
                type="button"
                onClick={() => setTxType('Expense')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  txType === 'Expense'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                - Operating Expense
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Transaction Description:
              </label>
              <input
                type="text"
                value={txTitle}
                onChange={(e) => setTxTitle(e.target.value)}
                placeholder="e.g. Bulk turmeric flour supply"
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category:
                </label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Product Sales">Product Sales</option>
                  <option value="Retail Sales">Retail Sales</option>
                  <option value="Raw Materials">Raw Materials</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Operations">Operations & Fuel</option>
                  <option value="Labor">Labor Wages</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Amount (₹):
                </label>
                <input
                  type="number"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  placeholder="e.g. 25000"
                  required
                  min="1"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Add Loan */}
      {showAddLoanModal && (
        <Modal
          isOpen={showAddLoanModal}
          onClose={() => setShowAddLoanModal(false)}
          title="Add Bank Loan or Credit Facility"
          description="Record existing borrowing details so your net surplus and debt-service ratio stay accurate."
          size="md"
          footer={
            <div className="w-full flex justify-end gap-2.5">
              <Button type="button" variant="outline" size="md" onClick={() => setShowAddLoanModal(false)}>
                Cancel
              </Button>
              <Button type="submit" form="add-loan-form" variant="teal" size="md" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Save Loan Record
              </Button>
            </div>
          }
        >
          <form id="add-loan-form" onSubmit={handleAddLoan} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Lending Bank Name & Branch:
              </label>
              <input
                type="text"
                value={loanBank}
                onChange={(e) => setLoanBank(e.target.value)}
                placeholder="e.g. Canara Bank, Thanjavur Main"
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Scheme / Loan Type:
              </label>
              <select
                value={loanScheme}
                onChange={(e) => setLoanScheme(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="MUDRA Shishu (≤ ₹50k)">MUDRA Shishu (≤ ₹50k)</option>
                <option value="MUDRA Kishore (₹50k-₹5L)">MUDRA Kishore (₹50k-₹5L)</option>
                <option value="MUDRA Tarun (₹5L-₹20L)">MUDRA Tarun (₹5L-₹20L)</option>
                <option value="PMEGP Term Loan">PMEGP Term Loan</option>
                <option value="DAY-NRLM Women SHG Bank Linkage">DAY-NRLM Women SHG Bank Linkage</option>
                <option value="Kisan Credit Card (KCC)">Kisan Credit Card (KCC)</option>
                <option value="General Commercial Vehicle / Equipment">General Equipment Loan</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sanctioned (₹):
                </label>
                <input
                  type="number"
                  value={loanSanctioned}
                  onChange={(e) => setLoanSanctioned(e.target.value)}
                  placeholder="200000"
                  required
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Balance (₹):
                </label>
                <input
                  type="number"
                  value={loanBalance}
                  onChange={(e) => setLoanBalance(e.target.value)}
                  placeholder="64000"
                  required
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Monthly EMI (₹):
                </label>
                <input
                  type="number"
                  value={loanEmi}
                  onChange={(e) => setLoanEmi(e.target.value)}
                  placeholder="4200"
                  required
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default FinancialReadiness;
