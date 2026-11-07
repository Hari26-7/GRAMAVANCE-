import React, { useState } from 'react';
import {
  Store,
  PlusCircle,
  Search,
  MapPin,
  Send,
  CheckCircle2,
  HelpCircle,
  Info,
  Clock,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export interface MarketplaceProduct {
  id: string;
  name: string;
  category: string;
  producerName: string;
  producerType: string;
  district: string;
  state: string;
  unitPrice: string;
  minOrder: string;
  availableQuantity: string;
  description: string;
  photoEmoji: string;
  phone: string;
  isVerified: boolean;
  isOrganic?: boolean;
}

export interface BuyerEnquiry {
  id: string;
  productId: string;
  productName: string;
  sellerName: string;
  buyerName: string;
  quantityRequested: string;
  contactPhone: string;
  deliveryLocation: string;
  notes: string;
  date: string;
  status: 'Enquiry Sent' | 'Seller In Contact' | 'Completed';
}

const INITIAL_PRODUCTS: MarketplaceProduct[] = [
  {
    id: 'prod_01',
    name: 'Salem Curcumin-Rich Whole Turmeric Fingers (மஞ்சள்)',
    category: 'Spices & Agri',
    producerName: 'Kaveri Women SHG Federation',
    producerType: 'Women SHG Federation',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    unitPrice: '₹180 / kg',
    minOrder: '50 kg',
    availableQuantity: '3,000 kg / month',
    description: 'Directly harvested, steam-boiled and sun-dried organic turmeric with lab-tested >4.2% natural curcumin content.',
    photoEmoji: '🌾',
    phone: '98421-50291',
    isVerified: true,
    isOrganic: true,
  },
  {
    id: 'prod_02',
    name: 'Chettinad Natural-Dyed Handloom Cotton Sarees (கைத்தறி சேலை)',
    category: 'Handloom & Textiles',
    producerName: 'Heritage Cotton Weavers Guild',
    producerType: 'Artisan Cooperative',
    district: 'Sivaganga',
    state: 'Tamil Nadu',
    unitPrice: '₹2,400 / piece',
    minOrder: '10 pieces',
    availableQuantity: '250 pieces / month',
    description: 'Woven on traditional pit-looms using 80s count combed cotton and natural indigo and madder root dyes.',
    photoEmoji: '🧵',
    phone: '94432-81720',
    isVerified: true,
    isOrganic: false,
  },
  {
    id: 'prod_03',
    name: 'Unpolished Kodo & Barnyard Organic Millets (சிறுதானியங்கள்)',
    category: 'Millets & Grains',
    producerName: 'Murugan Organic Millets Farm',
    producerType: 'Farmer Producer',
    district: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    unitPrice: '₹95 / kg',
    minOrder: '100 kg',
    availableQuantity: '8,000 kg / month',
    description: 'High-fibre unpolished millets grown without synthetic fertilizers. De-stoned and vacuum-sealed.',
    photoEmoji: '🌾',
    phone: '98270-11234',
    isVerified: true,
    isOrganic: true,
  },
  {
    id: 'prod_04',
    name: 'Pure Desi A2 Cow Ghee (நாட்டுப்பசு நெய்)',
    category: 'Dairy Products',
    producerName: 'Vikas Dairy & Agro Rural Cooperative',
    producerType: 'Dairy Cooperative',
    district: 'Erode',
    state: 'Tamil Nadu',
    unitPrice: '₹1,450 / litre',
    minOrder: '12 litres',
    availableQuantity: '800 litres / month',
    description: 'Crafted from curd of free-grazing indigenous Hallikar and Kangayam cows using traditional Bilona churning.',
    photoEmoji: '🥛',
    phone: '98291-77654',
    isVerified: true,
    isOrganic: true,
  },
  {
    id: 'prod_05',
    name: 'Handcrafted Terracotta Cooking Pots & Jugs (மண் பாண்டங்கள்)',
    category: 'Handicrafts',
    producerName: 'Manamadurai Clay Artisans Society',
    producerType: 'Artisan Society',
    district: 'Sivaganga',
    state: 'Tamil Nadu',
    unitPrice: '₹280 / piece',
    minOrder: '25 pieces',
    availableQuantity: '600 pieces / month',
    description: 'Lead-free riverbed clay cookware fired in wood kilns for traditional nutritious cooking.',
    photoEmoji: '🏺',
    phone: '94881-33219',
    isVerified: true,
    isOrganic: false,
  },
];

const INITIAL_ENQUIRIES: BuyerEnquiry[] = [
  {
    id: 'enq_01',
    productId: 'prod_01',
    productName: 'Salem Curcumin-Rich Whole Turmeric Fingers',
    sellerName: 'Kaveri Women SHG Federation',
    buyerName: 'Organic Harvest Wholesale Co.',
    quantityRequested: '500 kg',
    contactPhone: '98400-11223',
    deliveryLocation: 'Chennai Wholesale Market, Koyambedu',
    notes: 'Need sample batch of 25 kg first to test curcumin percentage in laboratory.',
    date: '2026-03-27',
    status: 'Seller In Contact',
  },
];

export const LocalMarketplace: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'catalog' | 'enquiries'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [products, setProducts] = useState<MarketplaceProduct[]>(() => {
    const saved = localStorage.getItem('gramavance_marketplace_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [enquiries, setEnquiries] = useState<BuyerEnquiry[]>(() => {
    const saved = localStorage.getItem('gramavance_buyer_enquiries');
    return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
  });

  // Modal: Add Product
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Spices & Agri');
  const [newPrice, setNewPrice] = useState('');
  const [newMinOrder, setNewMinOrder] = useState('20 kg');
  const [newCapacity, setNewCapacity] = useState('500 kg / month');
  const [newDesc, setNewDesc] = useState('');

  // Modal: Send Buyer Enquiry
  const [enquiringProduct, setEnquiringProduct] = useState<MarketplaceProduct | null>(null);
  const [enquiryQty, setEnquiryQty] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState(user.phone || '');
  const [enquiryLocation, setEnquiryLocation] = useState(user.district || '');
  const [enquiryNotes, setEnquiryNotes] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const categories = [
    'All',
    'Spices & Agri',
    'Handloom & Textiles',
    'Millets & Grains',
    'Dairy Products',
    'Handicrafts',
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.producerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice.trim()) return;

    const newProd: MarketplaceProduct = {
      id: `prod_${Date.now()}`,
      name: newTitle.trim(),
      category: newCategory,
      producerName: user.organizationName || user.fullName,
      producerType: user.role === 'shg' ? 'Women SHG' : 'Rural Producer',
      district: user.district || 'Thanjavur',
      state: user.state || 'Tamil Nadu',
      unitPrice: newPrice.includes('₹') ? newPrice : `₹${newPrice}`,
      minOrder: newMinOrder,
      availableQuantity: newCapacity,
      description: newDesc || 'Freshly made rural goods adhering to natural production methods.',
      photoEmoji: newCategory === 'Spices & Agri' ? '🌾' : newCategory === 'Handloom & Textiles' ? '🧵' : '📦',
      phone: user.phone || '98421-50291',
      isVerified: false,
    };

    const updated = [newProd, ...products];
    setProducts(updated);
    localStorage.setItem('gramavance_marketplace_products', JSON.stringify(updated));
    setShowAddProductModal(false);
    setNewTitle('');
    setNewPrice('');
    setNewDesc('');
  };

  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiringProduct) return;

    const newEnq: BuyerEnquiry = {
      id: `enq_${Date.now()}`,
      productId: enquiringProduct.id,
      productName: enquiringProduct.name,
      sellerName: enquiringProduct.producerName,
      buyerName: user.fullName,
      quantityRequested: enquiryQty || enquiringProduct.minOrder,
      contactPhone: enquiryPhone,
      deliveryLocation: enquiryLocation,
      notes: enquiryNotes,
      date: new Date().toISOString().split('T')[0],
      status: 'Enquiry Sent',
    };

    const updated = [newEnq, ...enquiries];
    setEnquiries(updated);
    localStorage.setItem('gramavance_buyer_enquiries', JSON.stringify(updated));
    setEnquirySuccess(true);
    setTimeout(() => {
      setEnquirySuccess(false);
      setEnquiringProduct(null);
      setEnquiryQty('');
      setEnquiryNotes('');
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 text-left">
      {/* Title Header */}
      <div className="bg-white dark:bg-[#0E1A29] text-[#202B3C] dark:text-white p-6 sm:p-7 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] border border-[#E3E7ED] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'ta' ? 'உள்ளூர் சந்தை & விளைபொருட்கள்' : 'Local Community Marketplace'}
            </h1>
            <span className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-[#315D86] dark:text-sky-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Direct Producer Linkage
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#647184] dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? 'மகளிர் குழுக்கள் மற்றும் விவசாயிகளின் விளைபொருட்களை மொத்தமாக வாங்கவும் விற்கவும் நேரடி இணைப்பு.'
              : 'Direct wholesale connection between rural producers, SHG federations, and verified regional buyers.'}
          </p>
        </div>

        <Button
          variant="teal"
          size="md"
          onClick={() => setShowAddProductModal(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
          className="font-bold min-h-[46px] px-5 rounded-xl shadow-xs"
        >
          Add My Product
        </Button>
      </div>

      {/* Human-Centered 3-Question Guidance Card */}
      <Card className="p-5 border border-[#E3E7ED] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] space-y-3">
        <div className="flex items-center gap-2 font-bold text-[#315D86] dark:text-sky-300 text-sm">
          <HelpCircle className="w-4 h-4 text-[#315D86]" />
          <span>About This Marketplace:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm text-[#647184] dark:text-slate-300">
          <div>
            <strong className="block text-[#202B3C] dark:text-white font-semibold mb-0.5">1. What is this page for?</strong>
            <span>Buy or sell authentic village products, organic crops, and handlooms directly without middlemen.</span>
          </div>
          <div>
            <strong className="block text-[#202B3C] dark:text-white font-semibold mb-0.5">2. What can I do here?</strong>
            <span>Browse product catalogs, check available bulk quantity, submit purchase enquiries, or list your own goods.</span>
          </div>
          <div>
            <strong className="block text-[#202B3C] dark:text-white font-semibold mb-0.5">3. What should I do next?</strong>
            <span>Click <em>"Send Purchase Enquiry"</em> to contact the producer directly regarding batch delivery and pricing.</span>
          </div>
        </div>
      </Card>

      {/* Honest Payment Notice (Phase 4 requirement) */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#159B68] shrink-0 mt-0.5" />
        <div>
          <strong>Informational Marketplace Notice:</strong> Gramavance connects wholesale buyers directly with rural producers and SHGs. Online card/wallet payment processing is not simulated or claimed on this website. Commercial invoicing and transport are arranged directly between buyer and seller.
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`min-h-[44px] px-4 py-2 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'border-[#159B68] text-[#102D46] dark:text-emerald-300'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`min-h-[44px] px-4 py-2 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'enquiries'
              ? 'border-[#159B68] text-[#102D46] dark:text-emerald-300'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>My Enquiries Tracker ({enquiries.length})</span>
        </button>
      </div>

      {/* Tab 1: Product Catalog */}
      {activeTab === 'catalog' && (
        <div className="space-y-5">
          {/* Filter & Search Bar */}
          <Card className="p-4 sm:p-5 border-2 border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products, crops, fabrics, or district..."
                  className="w-full h-11 pl-10 pr-4 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#159B68]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-11 px-3.5 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#159B68]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'All Categories' : c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <Card
                key={p.id}
                className="p-5 sm:p-6 border-2 border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 bg-white dark:bg-slate-900 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-3xl p-2.5 rounded-xl bg-[#F4F9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {p.photoEmoji}
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {p.isOrganic && (
                        <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                          🌱 Organic
                        </span>
                      )}
                      <Badge variant="teal" size="sm">
                        {p.category}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#172B3A] dark:text-slate-100 line-clamp-2">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      By: <strong>{p.producerName}</strong> ({p.producerType})
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="p-3 bg-[#F4F9F6] dark:bg-slate-800/80 rounded-xl space-y-1.5 text-xs border border-emerald-100 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Wholesale Price:</span>
                      <strong className="text-base font-bold text-[#159B68]">{p.unitPrice}</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Minimum Order:</span>
                      <strong className="text-slate-700 dark:text-slate-300">{p.minOrder}</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Supply Capacity:</span>
                      <strong className="text-slate-700 dark:text-slate-300">{p.availableQuantity}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{p.district}, {p.state}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="teal"
                    size="md"
                    onClick={() => setEnquiringProduct(p)}
                    leftIcon={<Send className="w-4 h-4" />}
                    className="w-full bg-[#159B68] hover:bg-emerald-700 text-white font-bold rounded-xl min-h-[44px]"
                  >
                    Send Purchase Enquiry
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Enquiries Tracker */}
      {activeTab === 'enquiries' && (
        <Card className="overflow-hidden border-2 border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="p-5 bg-[#F4F9F6] dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="font-bold text-[#102D46] dark:text-slate-100 text-base">
              Your Sent Purchase Enquiries ({enquiries.length})
            </span>
            <span className="text-xs text-slate-500">Updated in real-time</span>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {enquiries.map((enq) => (
              <div key={enq.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-bold text-[#172B3A] dark:text-slate-100">
                      {enq.productName}
                    </h4>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                        enq.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : enq.status === 'Seller In Contact'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Producer: <strong>{enq.sellerName}</strong> • Date: {enq.date} • Quantity: <strong>{enq.quantityRequested}</strong>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                    "{enq.notes}"
                  </p>
                </div>

                <div className="text-xs text-slate-500 sm:text-right shrink-0">
                  <span className="block">Delivery: {enq.deliveryLocation}</span>
                  <span className="block">Contact: {enq.contactPhone}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Modal: Add Product */}
      {showAddProductModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowAddProductModal(false)}
          title="List a Product on Local Marketplace"
          size="md"
        >
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Product Title (பொருளின் பெயர்):
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Pure Wood-Pressed Groundnut Oil"
                className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#159B68]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full h-11 px-3 text-sm rounded-xl border border-slate-200"
                >
                  <option>Spices & Agri</option>
                  <option>Handloom & Textiles</option>
                  <option>Millets & Grains</option>
                  <option>Dairy Products</option>
                  <option>Handicrafts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Price per Unit:</label>
                <input
                  type="text"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="e.g. ₹280 / litre"
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#159B68]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Order Quantity:</label>
                <input
                  type="text"
                  value={newMinOrder}
                  onChange={(e) => setNewMinOrder(e.target.value)}
                  placeholder="e.g. 25 litres"
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Supply Capacity:</label>
                <input
                  type="text"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  placeholder="e.g. 500 litres / month"
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Description:</label>
              <textarea
                rows={3}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Describe quality, ingredients, processing method, and packaging..."
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#159B68]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="md" onClick={() => setShowAddProductModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="teal" size="md" className="bg-[#159B68] text-white font-bold">
                Publish Product
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Send Buyer Enquiry */}
      {enquiringProduct && (
        <Modal
          isOpen={true}
          onClose={() => setEnquiringProduct(null)}
          title={`Enquire for: ${enquiringProduct.name}`}
          size="md"
        >
          {enquirySuccess ? (
            <div className="p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-[#102D46]">Enquiry Sent to {enquiringProduct.producerName}!</h3>
              <p className="text-sm text-slate-600">
                The seller has received your inquiry details and will contact you directly on {enquiryPhone}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendEnquiry} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                Producer: <strong>{enquiringProduct.producerName}</strong> • Price: <strong>{enquiringProduct.unitPrice}</strong> • Min Order: {enquiringProduct.minOrder}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Desired Quantity:</label>
                  <input
                    type="text"
                    required
                    value={enquiryQty}
                    onChange={(e) => setEnquiryQty(e.target.value)}
                    placeholder={enquiringProduct.minOrder}
                    className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#159B68]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Mobile Phone:</label>
                  <input
                    type="text"
                    required
                    value={enquiryPhone}
                    onChange={(e) => setEnquiryPhone(e.target.value)}
                    className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#159B68]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Destination / District:</label>
                <input
                  type="text"
                  required
                  value={enquiryLocation}
                  onChange={(e) => setEnquiryLocation(e.target.value)}
                  placeholder="e.g. Koyambedu Wholesale Market, Chennai"
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#159B68]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Specifications:</label>
                <textarea
                  rows={2}
                  value={enquiryNotes}
                  onChange={(e) => setEnquiryNotes(e.target.value)}
                  placeholder="Any packaging or sample requirements..."
                  className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#159B68]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="md" onClick={() => setEnquiringProduct(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="teal" size="md" className="bg-[#159B68] text-white font-bold">
                  Send Enquiry
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default LocalMarketplace;
