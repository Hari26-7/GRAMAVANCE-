import React from 'react';
import { Users, Shield, Award, Lightbulb } from 'lucide-react';
import { Card, CardTitle } from '../components/ui/Card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';

const DEMAND_DATA = [
  { category: 'Food Making', count: 420 },
  { category: 'Clothes & Weaving', count: 310 },
  { category: 'Millet Processing', count: 280 },
  { category: 'Dairy & Ghee', count: 195 },
  { category: 'Solar Agro Tools', count: 140 },
];

export const CommunityInsights: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title Header */}
      <div className="bg-white dark:bg-[#0E1A29] text-[#202B3C] dark:text-white p-6 sm:p-7 rounded-2xl shadow-[0_4px_20px_rgba(32,43,60,0.06)] border border-[#E3E7ED] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'ta' ? 'ஊர் தகவல்கள் மற்றும் கதைகள்' : 'Community Insights & Opportunities'}
            </h1>
            <span className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-[#43836F] dark:text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              District Trends
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#647184] dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? 'உங்கள் மாவட்டத்தில் பிற விவசாயிகள் மற்றும் மகளிர் குழுக்கள் என்ன தொழில் செய்கிறார்கள் மற்றும் நல்ல லாபம் தரும் வாய்ப்புகளைப் பாருங்கள்.'
              : 'See what other farmers, women groups, and artisans in your district are doing and discover profitable local opportunities.'}
          </p>
        </div>
      </div>

      {/* Honest Privacy Guarantee */}
      <div className="p-4 rounded-xl bg-[#EAF4FF] dark:bg-slate-900 border border-[#BCE0FD] dark:border-slate-800 text-xs sm:text-sm text-[#102D46] dark:text-slate-300 flex items-center gap-3">
        <Shield className="w-5 h-5 text-[#159B68] shrink-0" />
        <span>
          <strong>Privacy Guaranteed:</strong> No personal names or bank details are ever shared.
          These numbers show overall district enterprise trends across 1,200+ rural entrepreneurs.
        </span>
      </div>

      {/* 3 Practical District Opportunities */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Top Business Opportunities in Your District (Thanjavur & Delta Region):
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="p-6 border-2 border-emerald-300 bg-[#F4F9F6] dark:bg-slate-900 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#159B68] text-white flex items-center justify-center font-bold">
              🌾
            </div>
            <h3 className="text-lg font-bold text-[#172B3A] dark:text-slate-100">
              Organic Turmeric Powder
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Supermarkets in town want packaged pure turmeric powder. Women groups can receive 35% subsidy
              for grinder and packet sealing machines under PMFME.
            </p>
          </Card>

          <Card className="p-6 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              🍲
            </div>
            <h3 className="text-lg font-bold text-[#172B3A] dark:text-slate-100">
              Millet Flour & Healthy Snacks
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              High consumer demand for kodo and barnyard millet flours. Seed capital of ₹40,000 per member
              is available to buy small stone grinders.
            </p>
          </Card>

          <Card className="p-6 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              🧵
            </div>
            <h3 className="text-lg font-bold text-[#172B3A] dark:text-slate-100">
              Handloom Cotton Products
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Wholesale buyers in Chennai and Bangalore are placing recurring bulk orders for handloom
              cotton stoles and sarees at fair prices.
            </p>
          </Card>
        </div>
      </div>

      {/* Grid: Most Popular Businesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-2 border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <CardTitle className="text-base text-[#102D46] dark:text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#159B68]" />
            What Village Businesses Are People Starting?
          </CardTitle>
          <p className="text-xs text-slate-500">
            Number of registered rural entrepreneurs in your district applying for government help:
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEMAND_DATA} layout="vertical" margin={{ left: 20, right: 20 }}>
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 12 }} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#102D46',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="count" name="Applicants" fill="#159B68" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Helpful Advice Card */}
        <Card className="p-6 border-2 border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 bg-[#F4F9F6] dark:bg-slate-900">
          <CardTitle className="text-base text-[#102D46] dark:text-slate-100 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Advice for Starting a Group Business:
          </CardTitle>

          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <div className="flex items-start gap-2.5">
              <Award className="w-5 h-5 text-[#159B68] shrink-0 mt-0.5" />
              <div>
                <strong>Forming an SHG gets higher subsidy:</strong>
                <p className="text-xs text-slate-500 mt-0.5">
                  When 5 to 10 women apply together, the government gives larger grants for shared
                  machinery than applying alone.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Award className="w-5 h-5 text-[#159B68] shrink-0 mt-0.5" />
              <div>
                <strong>Pre-arranged Buyer Agreements:</strong>
                <p className="text-xs text-slate-500 mt-0.5">
                  Show a simple letter from a local shop promising to buy your products. Banks approve
                  loans much faster with buyer proof!
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
