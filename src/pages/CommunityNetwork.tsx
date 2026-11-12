import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Handshake,
  PlusCircle,
  Search,
  MapPin,
  Flag,
  Send,
  HelpCircle,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export interface CommunityProfile {
  id: string;
  name: string;
  type: 'shg' | 'artisan' | 'entrepreneur' | 'cooperative';
  district: string;
  state: string;
  category: string;
  memberCount?: number;
  description: string;
  products: string[];
  isVerified: boolean;
  joinedDate: string;
}

export interface CollaborationPost {
  id: string;
  title: string;
  authorName: string;
  authorType: string;
  district: string;
  description: string;
  requirement: string;
  date: string;
  status: 'Open' | 'Connected';
}

export interface MentorshipItem {
  id: string;
  mentorName: string;
  role: string;
  expertise: string;
  district: string;
  availableSlots: number;
  freeService: boolean;
}

export interface CommunityAnnouncement {
  id: string;
  title: string;
  organizer: string;
  date: string;
  location: string;
  description: string;
  category: 'Camp' | 'Training' | 'Notice';
}

const INITIAL_PROFILES: CommunityProfile[] = [
  {
    id: 'prof_01',
    name: 'Kaveri Mahalir Federation',
    type: 'shg',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    category: 'Food Processing & Spices',
    memberCount: 14,
    description: 'Women collective processing pure Salem turmeric fingers, coriander powder, and cold-pressed sesame oil.',
    products: ['Salem Turmeric Powder', 'Cold-Pressed Sesame Oil', 'Sambar Masala'],
    isVerified: true,
    joinedDate: '2024-06-10',
  },
  {
    id: 'prof_02',
    name: 'Heritage Chettinad Weavers Guild',
    type: 'artisan',
    district: 'Sivaganga',
    state: 'Tamil Nadu',
    category: 'Handloom & Textiles',
    memberCount: 28,
    description: 'Traditional artisan group hand-weaving 60s & 80s count cotton sarees with natural vegetable dyes.',
    products: ['Chettinad Cotton Sarees', 'Handwoven Stoles', 'Natural-dyed Fabric'],
    isVerified: true,
    joinedDate: '2024-09-15',
  },
  {
    id: 'prof_03',
    name: 'Murugan Organic Millets Farm',
    type: 'entrepreneur',
    district: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    category: 'Agriculture & Millets',
    description: 'Solo organic grower cultivating kodo, barnyard, and finger millets across 6 acres of farm.',
    products: ['Unpolished Kodo Millet', 'Barnyard Millet Flour', 'Organic Ragi'],
    isVerified: true,
    joinedDate: '2025-01-20',
  },
  {
    id: 'prof_04',
    name: 'Vikas Dairy & Agro Rural Cooperative',
    type: 'cooperative',
    district: 'Erode',
    state: 'Tamil Nadu',
    category: 'Dairy Products',
    memberCount: 52,
    description: 'Village dairy cooperative collecting 800 litres of desi A2 cow milk daily with common chilling unit.',
    products: ['Pure Desi Cow Ghee', 'Pasteurized Farm Milk', 'Organic Butter'],
    isVerified: true,
    joinedDate: '2024-11-05',
  },
];

const INITIAL_COLLABORATIONS: CollaborationPost[] = [
  {
    id: 'collab_01',
    title: 'Seeking 5 Women SHGs for Turmeric Cleaning & Sorting Tie-up',
    authorName: 'Kaveri Mahalir Federation',
    authorType: 'Women SHG Federation',
    district: 'Thanjavur',
    description: 'We have received a wholesale contract for 3,000 kg cleaned turmeric. We want to partner with local SHGs for sorting and packaging.',
    requirement: '5 SHGs with 8+ members each; fair daily remuneration guaranteed.',
    date: '2026-03-28',
    status: 'Open',
  },
  {
    id: 'collab_02',
    title: 'Shared Machinery: Millet De-stoning & Pulverizing Machine',
    authorName: 'Cauvery Delta FPO',
    authorType: 'Farmer Producer Co.',
    district: 'Kumbakonam',
    description: 'We have installed a 10HP millet destoning and packing line under PMFME grant. Open for neighboring farmers and SHGs on nominal hourly tariff.',
    requirement: 'Farmers bringing raw kodo or barnyard millets.',
    date: '2026-03-25',
    status: 'Open',
  },
];

const INITIAL_MENTORSHIP: MentorshipItem[] = [
  {
    id: 'men_01',
    mentorName: 'Dr. Aruna Sundaram',
    role: 'Retired Joint Director of Agriculture / NABARD Advisor',
    expertise: 'PMFME DPR Preparation, FSSAI Lab Certification, Bank DPR scrutiny',
    district: 'Thanjavur & Delta Region',
    availableSlots: 4,
    freeService: true,
  },
  {
    id: 'men_02',
    mentorName: 'K. Rajasekaran',
    role: 'Master Weaver & State Award Artisan',
    expertise: 'Handloom export packaging, natural dye stabilization, fair pricing',
    district: 'Sivaganga / Madurai',
    availableSlots: 2,
    freeService: true,
  },
];

const INITIAL_ANNOUNCEMENTS: CommunityAnnouncement[] = [
  {
    id: 'ann_01',
    title: 'District Level Task Force (DLTFC) PMEGP & PMFME Interview Camp',
    organizer: 'District Industries Centre (DIC), Thanjavur',
    date: 'April 14, 2026 (Wednesday, 10:00 AM)',
    location: 'Collectorate Conference Hall, Thanjavur',
    description: 'Direct scrutiny and bank sponsorship interview for pending PMEGP and PMFME applicants. Bring 3 copies of DPR and Quotations.',
    category: 'Camp',
  },
  {
    id: 'ann_02',
    title: 'Free 3-Day Food Processing & Hygiene Standards Training',
    organizer: 'Tamil Nadu Rural Transformation Project (TNRTP)',
    date: 'April 20-22, 2026',
    location: 'Panchayat Union Training Centre, Thiruvaiyaru',
    description: 'Hands-on practical training on solar dehydration, vacuum packaging, and FSSAI basic compliance. Stipend provided to women SHG members.',
    category: 'Training',
  },
];

export const CommunityNetwork: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'directory' | 'collabs' | 'mentors' | 'announcements'>('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');

  // Modals state
  const [connectingProfile, setConnectingProfile] = useState<CommunityProfile | null>(null);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [connectionSuccess, setConnectionSuccess] = useState(false);

  const [reportingItem, setReportingItem] = useState<{ id: string; name: string } | null>(null);
  const [reportReason, setReportReason] = useState('Inappropriate Content');
  const [reportSuccess, setReportSuccess] = useState(false);

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newCategory, setNewCategory] = useState('Food Processing');
  const [newDesc, setNewDesc] = useState('');
  const [profiles, setProfiles] = useState<CommunityProfile[]>(() => {
    const saved = localStorage.getItem('gramavance_community_profiles');
    return saved ? JSON.parse(saved) : INITIAL_PROFILES;
  });

  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || p.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleSendConnection = (e: React.FormEvent) => {
    e.preventDefault();
    setConnectionSuccess(true);
    setTimeout(() => {
      setConnectionSuccess(false);
      setConnectingProfile(null);
      setConnectionMessage('');
    }, 2500);
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setReportingItem(null);
    }, 2500);
  };

  const handleJoinDirectory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    const newProf: CommunityProfile = {
      id: `prof_${Date.now()}`,
      name: newOrgName,
      type: user.role === 'shg' ? 'shg' : user.role === 'artisan' ? 'artisan' : 'entrepreneur',
      district: user.district || 'Thanjavur',
      state: user.state || 'Tamil Nadu',
      category: newCategory,
      description: newDesc || 'Community enterprise dedicated to local sustainable production.',
      products: [newCategory],
      isVerified: false,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setProfiles((prev) => {
      const updated = [newProf, ...prev];
      localStorage.setItem('gramavance_community_profiles', JSON.stringify(updated));
      return updated;
    });
    setShowJoinModal(false);
    setNewOrgName('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 text-left">
      {/* Title Header */}
      <div className="bg-white dark:bg-[#0E1A29] text-[#202B3C] dark:text-white p-6 sm:p-7 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] border border-[#E3E7ED] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'ta' ? 'ஊர் சமூகம் & கூட்டுறவு வலையமைப்பு' : 'Community Network'}
            </h1>
            <span className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-[#315D86] dark:text-sky-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Local Collaboration
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#647184] dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? 'உங்கள் மாவட்டத்தின் மகளிர் சுயஉதவிக் குழுக்கள், கைவினைஞர்கள் மற்றும் விவசாயிகளுடன் இணைந்து தொழில் வாய்ப்புகளையும் அரசு உதவிகளையும் பெற்றிடுங்கள்.'
              : 'Connect with local SHGs, artisans, farmers, and experienced community mentors to collaborate and grow together.'}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowJoinModal(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
          className="font-bold min-h-[46px] px-5 rounded-xl shadow-xs"
        >
          Join Community Directory
        </Button>
      </div>

      {/* Human-Centered 3-Question Guidance Card */}
      <Card className="p-5 border border-[#E3E7ED] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] space-y-3">
        <div className="flex items-center gap-2 font-bold text-[#315D86] dark:text-sky-300 text-sm">
          <HelpCircle className="w-4 h-4 text-[#315D86]" />
          <span>About This Community Network:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm text-[#647184] dark:text-slate-300">
          <div>
            <strong className="block text-[#202B3C] dark:text-white font-semibold mb-0.5">1. What is this page for?</strong>
            <span>Discover verified village enterprises, women collectives, and artisans in your district.</span>
          </div>
          <div>
            <strong className="block text-[#202B3C] dark:text-white font-semibold mb-0.5">2. What can I do here?</strong>
            <span>Send connection requests, view shared machinery partnerships, request expert mentorship, and see official district camps.</span>
          </div>
          <div>
            <strong className="block text-[#202B3C] dark:text-white font-semibold mb-0.5">3. What should I do next?</strong>
            <span>Tap "Connect" on any profile to send a polite business message. Your personal mobile number remains protected.</span>
          </div>
        </div>
      </Card>

      {/* Privacy & Safety Guarantee */}
      <div className="p-4 rounded-xl bg-[#F0F2F5] dark:bg-slate-900 border border-[#E3E7ED] dark:border-slate-800 text-xs sm:text-sm text-[#202B3C] dark:text-slate-300 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#43836F] shrink-0" />
          <span>
            <strong className="text-[#202B3C] dark:text-white">Privacy Protected:</strong> Direct phone numbers and bank records are never displayed publicly. Communication occurs via safe connection requests.
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E3E7ED] dark:border-slate-800">
        {[
          { id: 'directory', label: '👥 Member Directory', count: profiles.length },
          { id: 'collabs', label: '🤝 Collaborations', count: INITIAL_COLLABORATIONS.length },
          { id: 'mentors', label: '🎓 Free Mentorship', count: INITIAL_MENTORSHIP.length },
          { id: 'announcements', label: '📢 District Camps & Notice', count: INITIAL_ANNOUNCEMENTS.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`min-h-[44px] px-4 py-2 text-sm font-bold border-b-2 transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'border-[#315D86] text-[#315D86] dark:text-sky-300'
                : 'border-transparent text-[#647184] hover:text-[#202B3C] dark:hover:text-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-xs bg-[#F0F2F5] dark:bg-slate-800 text-[#647184] dark:text-slate-300 px-2 py-0.5 rounded-full font-semibold border border-[#E3E7ED] dark:border-slate-700">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab 1: Member Directory */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <Card className="p-4 border-2 border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by group name, trade, or district..."
                  className="w-full h-11 pl-10 pr-4 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#159B68]"
                />
              </div>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-11 px-3.5 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#159B68]"
              >
                <option value="All">All Member Types</option>
                <option value="shg">Women Self-Help Groups (SHG)</option>
                <option value="artisan">Artisans & Weavers</option>
                <option value="entrepreneur">Solo Rural Entrepreneurs</option>
                <option value="cooperative">Rural Cooperatives</option>
              </select>
            </div>
          </Card>

          {/* Profiles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProfiles.map((prof) => (
              <Card
                key={prof.id}
                className="p-5 sm:p-6 border-2 border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 bg-white dark:bg-slate-900 hover:border-slate-300"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold text-[#172B3A] dark:text-slate-100">
                          {prof.name}
                        </h3>
                        {prof.isVerified && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Verified Group
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {prof.district}, {prof.state}
                        </span>
                        {prof.memberCount && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {prof.memberCount} Members
                          </span>
                        )}
                      </div>
                    </div>

                    <Badge variant="teal" size="sm">
                      {prof.type.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {prof.description}
                  </p>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Key Products / Offerings:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {prof.products.map((p, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-[#F4F9F6] dark:bg-slate-800 text-[#102D46] dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setReportingItem({ id: prof.id, name: prof.name })}
                    className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                    title="Report profile for verification check"
                  >
                    <Flag className="w-3.5 h-3.5" /> Report
                  </button>

                  <Button
                    variant="teal"
                    size="sm"
                    onClick={() => setConnectingProfile(prof)}
                    leftIcon={<Handshake className="w-4 h-4" />}
                    className="bg-[#159B68] hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs px-4 min-h-[38px]"
                  >
                    Connect
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Collaboration Opportunities */}
      {activeTab === 'collabs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {INITIAL_COLLABORATIONS.map((c) => (
              <Card key={c.id} className="p-6 border-2 border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="teal" size="sm">
                    {c.status} Partnership
                  </Badge>
                  <span className="text-xs text-slate-400">{c.date}</span>
                </div>
                <h3 className="text-base font-bold text-[#172B3A] dark:text-slate-100">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Posted by: <strong>{c.authorName}</strong> ({c.authorType}) • {c.district}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {c.description}
                </p>
                <div className="p-3 rounded-xl bg-[#F4F9F6] dark:bg-slate-800 text-xs text-[#102D46] dark:text-slate-200 border border-emerald-100 dark:border-slate-700">
                  <strong>Requirement:</strong> {c.requirement}
                </div>
                <div className="pt-2">
                  <Button
                    variant="teal"
                    size="sm"
                    onClick={() =>
                      setConnectingProfile({
                        id: c.id,
                        name: c.authorName,
                        type: 'shg',
                        district: c.district,
                        state: 'Tamil Nadu',
                        category: 'Collaboration Partner',
                        description: c.requirement,
                        products: [],
                        isVerified: true,
                        joinedDate: c.date,
                      })
                    }
                    className="w-full bg-[#159B68] hover:bg-emerald-700 text-white font-semibold rounded-xl"
                  >
                    Respond to Opportunity
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Free Mentorship */}
      {activeTab === 'mentors' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {INITIAL_MENTORSHIP.map((m) => (
              <Card key={m.id} className="p-6 border-2 border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="teal" size="sm">
                    {m.freeService ? 'Free Voluntary Mentorship' : 'Advisory'}
                  </Badge>
                  <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold">
                    {m.availableSlots} Advisory Slots Open
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#172B3A] dark:text-slate-100">{m.mentorName}</h3>
                  <p className="text-xs text-slate-500">{m.role} • {m.district}</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <strong className="block text-[#102D46] dark:text-slate-100 mb-1">Expertise & Guidance:</strong>
                  <span>{m.expertise}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setConnectingProfile({
                      id: m.id,
                      name: m.mentorName,
                      type: 'artisan',
                      district: m.district,
                      state: 'Tamil Nadu',
                      category: 'Mentorship',
                      description: m.expertise,
                      products: [],
                      isVerified: true,
                      joinedDate: '2024-01-01',
                    })
                  }
                  className="w-full font-bold rounded-xl"
                >
                  Request Advisory Session
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Community Announcements */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="space-y-4">
            {INITIAL_ANNOUNCEMENTS.map((a) => (
              <Card key={a.id} className="p-6 border-2 border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant={a.category === 'Camp' ? 'teal' : 'info'} size="sm">
                    {a.category} Notice
                  </Badge>
                  <span className="text-xs text-slate-500 font-semibold">{a.date}</span>
                </div>
                <h3 className="text-lg font-bold text-[#172B3A] dark:text-slate-100">{a.title}</h3>
                <p className="text-xs text-slate-500">
                  Organized by: <strong>{a.organizer}</strong> • Location: <strong>{a.location}</strong>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                  {a.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Connection Request Modal */}
      {connectingProfile && (
        <Modal
          isOpen={true}
          onClose={() => setConnectingProfile(null)}
          title={`Connect with ${connectingProfile.name}`}
          size="md"
        >
          {connectionSuccess ? (
            <div className="p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-[#102D46]">Connection Request Sent!</h3>
              <p className="text-sm text-slate-600">
                Your enquiry has been securely forwarded to {connectingProfile.name}. They will be able to review your message and reply via verified SMS/phone.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendConnection} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                You are connecting as: <strong>{user.fullName}</strong> ({user.organizationName || 'Individual'}) • {user.district}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Purpose of Connection:
                </label>
                <select className="w-full h-11 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold">
                  <option>Raw Material Supply Partnership</option>
                  <option>Shared Machinery or Processing Inquiry</option>
                  <option>Bulk Wholesale Purchase</option>
                  <option>Mentorship & Advice Request</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Message:
                </label>
                <textarea
                  rows={3}
                  required
                  value={connectionMessage}
                  onChange={(e) => setConnectionMessage(e.target.value)}
                  placeholder="Introduce yourself and describe how you would like to collaborate..."
                  className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-[#159B68]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" size="md" onClick={() => setConnectingProfile(null)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="teal"
                  size="md"
                  leftIcon={<Send className="w-4 h-4" />}
                  className="bg-[#159B68] hover:bg-emerald-700 text-white font-bold"
                >
                  Send Request
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}

      {/* Report Modal */}
      {reportingItem && (
        <Modal
          isOpen={true}
          onClose={() => setReportingItem(null)}
          title={`Report: ${reportingItem.name}`}
          size="sm"
        >
          {reportSuccess ? (
            <div className="p-4 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm">Report Submitted for Verification</h4>
              <p className="text-xs text-slate-500">
                Thank you for keeping our community directory authentic and safe.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendReport} className="space-y-4">
              <p className="text-xs text-slate-600">
                Please let us know why this profile requires verification check:
              </p>
              <div>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full h-11 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <option>Misleading or inaccurate enterprise details</option>
                  <option>Unresponsive / outdated contact</option>
                  <option>Duplicate listing</option>
                  <option>Commercial spam</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setReportingItem(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="outline" size="sm" className="text-rose-600 border-rose-300">
                  Submit Report
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}

      {/* Join Community Directory Modal */}
      {showJoinModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowJoinModal(false)}
          title="Join Community Directory"
          size="md"
        >
          <form onSubmit={handleJoinDirectory} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                SHG / Group / Business Name:
              </label>
              <input
                type="text"
                required
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                placeholder="e.g. Annai Theresa Mahalir Suya Udhavi Kuzhu"
                className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#159B68]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Trade / Category:
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200"
              >
                <option>Food Processing & Spices</option>
                <option>Agriculture & Millets</option>
                <option>Handloom & Garments</option>
                <option>Handicrafts & Pottery</option>
                <option>Dairy & Cattle Products</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Short Description of Your Enterprise:
              </label>
              <textarea
                rows={3}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="What does your group produce? e.g. We make cold-pressed groundnut oil using traditional wooden expellers..."
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#159B68]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="md" onClick={() => setShowJoinModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="teal" size="md" className="bg-[#159B68] text-white font-bold">
                Publish My Profile
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CommunityNetwork;
