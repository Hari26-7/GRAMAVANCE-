import React, { useState } from 'react';
import {
  HelpCircle,
  Phone,
  Mail,
  ChevronDown,
  PhoneCall,
} from 'lucide-react';
import { Card, CardTitle } from '../components/ui/Card';
import { useLanguage } from '../context/LanguageContext';

const FAQS = [
  {
    q: 'Can a Women Self-Help Group (SHG) get a subsidy if members already have a small loan?',
    a: 'Yes! Having prior small loans does not stop your group from getting government help, as long as you pay your regular monthly installments on time.',
  },
  {
    q: 'How long does it take for the government to approve money for a machine or shop?',
    a: 'Usually about 3 to 4 weeks. First, the district office reviews your papers, and then the bank verifies your shop location before disbursing the money.',
  },
  {
    q: 'How much money do I need to pay from my own pocket?',
    a: 'Under schemes like PMEGP, rural women and backward classes only need to pay 5% of the total project cost. For example, for a ₹2,00,000 project, you only need to pay ₹10,000.',
  },
  {
    q: 'Does Gramavance take any fee or cut from my subsidy?',
    a: 'NEVER! Gramavance is completely free. Government subsidy money is sent 100% directly into your own bank account through Direct Benefit Transfer (DBT). Beware of anyone asking for a bribe or commission.',
  },
];

export const HelpSupport: React.FC = () => {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title Header */}
      <div className="bg-white dark:bg-[#0E1A29] text-[#202B3C] dark:text-white p-6 sm:p-7 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] border border-[#E3E7ED] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'ta' ? 'உதவி மற்றும் தொலைபேசி எண்கள்' : 'Help & Phone Numbers'}
            </h1>
            <span className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-[#315D86] dark:text-sky-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Free Assistance
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#647184] dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? 'உங்களுக்கு உதவி தேவையா? எங்கள் இலவச தொலைபேசி எண்களை அழைத்து அதிகாரிகளிடம் நேரடியாகப் பேசுங்கள்.'
              : 'Need help? Call our free government helplines or read answers to common questions.'}
          </p>
        </div>
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-6 border border-[#E3E7ED] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl space-y-3 flex flex-col justify-between shadow-[0_4px_18px_rgba(32,43,60,0.05)] neu-card-hover">
          <div>
            <div className="flex items-center gap-2 text-[#43836F]">
              <PhoneCall className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Free Toll-Free Helpline</span>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-[#202B3C] dark:text-slate-100 mt-2">
              1800-3000-0034
            </p>
            <span className="text-xs text-[#647184] block mt-1">9:30 AM - 6:00 PM (Monday to Saturday)</span>
          </div>
          <a
            href="tel:180030000034"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#43836F] text-white font-bold text-sm shadow-xs hover:bg-[#386253] transition-all active:scale-95"
          >
            <Phone className="w-4 h-4" /> Call Toll-Free
          </a>
        </Card>

        <Card className="p-6 border border-[#E3E7ED] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl space-y-3 flex flex-col justify-between shadow-[0_4px_18px_rgba(32,43,60,0.05)] neu-card-hover">
          <div>
            <div className="flex items-center gap-2 text-[#315D86]">
              <Phone className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Food Subsidy Helpline</span>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-[#202B3C] dark:text-slate-100 mt-2">
              011-2649-7100
            </p>
            <span className="text-xs text-[#647184] block mt-1">PMFME Food Processing Scheme Desk</span>
          </div>
          <a
            href="tel:01126497100"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F0F2F5] dark:bg-slate-800 text-[#202B3C] dark:text-slate-200 border border-[#E3E7ED] dark:border-slate-700 font-bold text-sm hover:bg-white transition-all active:scale-95 shadow-2xs"
          >
            <Phone className="w-4 h-4" /> Call Desk
          </a>
        </Card>

        <Card className="p-6 border border-[#E3E7ED] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl space-y-3 flex flex-col justify-between shadow-[0_4px_18px_rgba(32,43,60,0.05)] neu-card-hover">
          <div>
            <div className="flex items-center gap-2 text-blue-600">
              <Mail className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Write to Us</span>
            </div>
            <p className="text-base font-bold text-[#172B3A] dark:text-slate-100 mt-2">
              help@gramavance.org
            </p>
            <span className="text-xs text-slate-500 block mt-1">Reply within 24 hours</span>
          </div>
          <a
            href="mailto:help@gramavance.org"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-200 transition-colors"
          >
            <Mail className="w-4 h-4" /> Send Email
          </a>
        </Card>
      </div>

      {/* FAQ Accordion */}
      <Card className="p-6 border-2 border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
        <CardTitle className="text-lg text-[#102D46] dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#159B68]" />
          Common Questions Asked by Farmers and Women:
        </CardTitle>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left text-base font-bold text-[#172B3A] dark:text-slate-100 hover:text-[#159B68] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform shrink-0 ml-2 ${
                    openFaq === idx ? 'rotate-180 text-[#159B68]' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <p className="text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed bg-[#F4F9F6] dark:bg-slate-800/60 p-4 rounded-xl border border-emerald-100 dark:border-slate-700">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
