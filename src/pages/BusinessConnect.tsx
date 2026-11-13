import React, { useState } from 'react';
import {
  Search,
  MapPin,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  Send,
  Check,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { MOCK_BUSINESS_CONNECTIONS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface RuralProduct {
  id: string;
  name: string;
  producerName: string;
  category: string;
  district: string;
  state: string;
  unitPrice: string;
  minOrder: string;
  capacity: string;
  phone: string;
  verifiedFPO: boolean;
  organicCertified: boolean;
}

const PRODUCTS: RuralProduct[] = [
  {
    id: 'prod_01',
    name: 'Salem Curcumin-Rich Whole Turmeric Fingers (மஞ்சள்)',
    producerName: 'Kaveri Women SHG Federation',
    category: 'Spices & Agri',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    unitPrice: '₹180 / kg',
    minOrder: '100 kg',
    capacity: '3,000 kg / month',
    phone: '98421-50291',
    verifiedFPO: true,
    organicCertified: true,
  },
  {
    id: 'prod_02',
    name: 'Chettinad Natural-Dyed Handloom Cotton Sarees (கைத்தறி சேலை)',
    producerName: 'Heritage Cotton Weavers Cooperative',
    category: 'Handloom & Textiles',
    district: 'Sivaganga',
    state: 'Tamil Nadu',
    unitPrice: '₹2,400 / piece',
    minOrder: '20 pieces',
    capacity: '250 pieces / month',
    phone: '94432-81720',
    verifiedFPO: true,
    organicCertified: false,
  },
  {
    id: 'prod_03',
    name: 'Kodo & Barnyard Organic Millets (சிறுதானியங்கள்)',
    producerName: 'Narmada Organic Millets Producer Co.',
    category: 'Millets & Grains',
    district: 'Hoshangabad',
    state: 'Madhya Pradesh',
    unitPrice: '₹95 / kg',
    minOrder: '500 kg',
    capacity: '10,000 kg / month',
    phone: '98270-11234',
    verifiedFPO: true,
    organicCertified: true,
  },
  {
    id: 'prod_04',
    name: 'Pure Desi A2 Cow Ghee (நாட்டுப்பசு நெய்)',
    producerName: 'Vikas Dairy & Agro Rural Cooperative',
    category: 'Dairy Products',
    district: 'Jaipur',
    state: 'Rajasthan',
    unitPrice: '₹1,450 / litre',
    minOrder: '25 litres',
    capacity: '800 litres / month',
    phone: '98291-77654',
    verifiedFPO: true,
    organicCertified: true,
  },
];

interface BuyerRFQ {
  id: string;
  buyerName: string;
  title: string;
  category: string;
  quantityRequired: string;
  targetPrice: string;
  location: string;
  phone: string;
  deadline: string;
  verifiedBuyer: boolean;
}

const BUYER_RFQS: BuyerRFQ[] = [
  {
    id: 'rfq_01',
    buyerName: 'Gramin Naturals Supply Chain Pvt Ltd',
    title: 'Wants to buy Organic Turmeric Fingers every month',
    category: 'Spices & Agri',
    quantityRequired: '2,500 kg / Month',
    targetPrice: '₹175 - ₹190 / kg',
    location: 'Bengaluru / Chennai',
    phone: '080-4921092',
    deadline: 'April 30, 2026',
    verifiedBuyer: true,
  },
  {
    id: 'rfq_02',
    buyerName: 'Khadi & Craft Fair-Trade Exports',
    title: 'Wants to buy Handspun Cotton Sarees & Stoles',
    category: 'Handloom & Textiles',
    quantityRequired: '300 Sets',
    targetPrice: '₹2,200 - ₹2,500 / set',
    location: 'Mumbai / Madurai',
    phone: '022-6819203',
    deadline: 'May 15, 2026',
    verifiedBuyer: true,
  },
  {
    id: 'rfq_03',
    buyerName: 'Arogya Organic Supermarkets',
    title: 'Bulk purchase of Cleaned Barnyard Millets',
    category: 'Millets & Grains',
    quantityRequired: '5,000 kg',
    targetPrice: '₹90 - ₹100 / kg',
    location: 'Coimbatore, Tamil Nadu',
    phone: '0422-2591823',
    deadline: 'April 20, 2026',
    verifiedBuyer: true,
  },
];

export const BusinessConnect: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'rfqs' | 'products' | 'connections'>('rfqs');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerRFQ | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<RuralProduct | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<typeof MOCK_BUSINESS_CONNECTIONS[0] | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New product form fields
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Spices & Agri');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductQuantity, setNewProductQuantity] = useState('');
  const [newProductPhone, setNewProductPhone] = useState('');
  const [productList, setProductList] = useState<RuralProduct[]>(PRODUCTS);

  // Inquiry message modal
  const [inquiryText, setInquiryText] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const filteredProducts = productList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRFQs = BUYER_RFQS.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.buyerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const newP: RuralProduct = {
      id: `prod_${Date.now()}`,
      name: newProductName,
      producerName: 'My Enterprise',
      category: newProductCategory,
      district: 'Thanjavur',
      state: 'Tamil Nadu',
      unitPrice: newProductPrice || '₹100 / unit',
      minOrder: '10 units',
      capacity: newProductQuantity || '100 units / month',
      phone: newProductPhone || '98400-00000',
      verifiedFPO: false,
      organicCertified: false,
    };

    setProductList([newP, ...productList]);
    setShowAddProductModal(false);
    setNewProductName('');
    setNewProductPrice('');
    setNewProductQuantity('');
    setNewProductPhone('');
    setStatusMessage('Your product has been listed! Wholesale buyers can now view and contact you.');
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleSendInquiry = () => {
    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setSelectedBuyer(null);
      setSelectedProduct(null);
      setInquiryText('');
      setStatusMessage('Your contact request was submitted! The buyer will contact you on your registered phone number.');
      setTimeout(() => setStatusMessage(null), 5000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-left">
      {/* Title Header */}
      <div className="bg-white dark:bg-[#0E1A29] text-[#202B3C] dark:text-white p-6 sm:p-7 rounded-2xl shadow-[0_4px_20px_rgba(32,43,60,0.06)] border border-[#E3E7ED] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'ta' ? 'என் பொருட்களுக்கு வாங்குவோர்' : 'Find Buyers for My Products'}
            </h1>
            <span className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-[#43836F] dark:text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Direct Fair-Trade
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#647184] dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? 'உங்கள் கிராமத்துப் பொருட்களை இடைத்தரகர்கள் இன்றி நியாயமான விலையில் வாங்க விரும்பும் மொத்த வியாபாரிகளை நேரடியாகத் தொடர்பு கொள்ளுங்கள்.'
              : 'Connect directly with verified wholesale buyers, supermarkets, and export houses without middlemen.'}
          </p>
        </div>

        {/* Big Add Product Button */}
        <Button
          variant="teal"
          size="lg"
          leftIcon={<PlusCircle className="w-5 h-5" />}
          onClick={() => setShowAddProductModal(true)}
          className="bg-[#159B68] hover:bg-emerald-700 text-white font-bold min-h-[48px] px-5 rounded-xl shadow-xs text-base cursor-pointer"
        >
          {language === 'ta' ? 'என் பொருளை விற்க சேர்க்கவும்' : 'List My Product for Sale'}
        </Button>
      </div>

      {/* Honest Demonstration Data Notice */}
      <div className="p-4 rounded-xl bg-[#EAF4FF] dark:bg-slate-900 border border-[#BCE0FD] dark:border-slate-800 text-xs sm:text-sm text-[#102D46] dark:text-slate-300 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#159B68] shrink-0" />
          <span>
            <strong>Demonstration Data:</strong> The listings below are sample buyer and producer
            profiles to illustrate direct fair-trade discovery without middlemen.
          </span>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#159B68] shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl text-sm font-semibold max-w-xl">
        <button
          onClick={() => setActiveTab('rfqs')}
          className={`flex-1 py-3 px-4 rounded-xl transition-colors cursor-pointer min-h-[44px] ${
            activeTab === 'rfqs'
              ? 'bg-white dark:bg-slate-900 text-[#102D46] dark:text-emerald-400 font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          {language === 'ta' ? 'வாங்குவோர் தேவை' : 'Who Wants to Buy?'} ({BUYER_RFQS.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-3 px-4 rounded-xl transition-colors cursor-pointer min-h-[44px] ${
            activeTab === 'products'
              ? 'bg-white dark:bg-slate-900 text-[#102D46] dark:text-emerald-400 font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          {language === 'ta' ? 'விற்பனை பொருட்கள்' : 'Products on Sale'} ({productList.length})
        </button>
        <button
          onClick={() => setActiveTab('connections')}
          className={`flex-1 py-3 px-4 rounded-xl transition-colors cursor-pointer min-h-[44px] ${
            activeTab === 'connections'
              ? 'bg-white dark:bg-slate-900 text-[#102D46] dark:text-emerald-400 font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          {language === 'ta' ? 'என் தொடர்புகள்' : 'My Inquiries'} ({MOCK_BUSINESS_CONNECTIONS.length})
        </button>
      </div>

      {/* Search Bar */}
      <Card className="p-4 border-2 border-slate-200 dark:border-slate-800">
        <div className="relative w-full">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by crop, product, price, or city..."
            className="w-full min-h-[48px] pl-11 pr-4 text-base bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-[#172B3A] dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#159B68]"
          />
        </div>
      </Card>

      {/* TAB 1: Buyer RFQs */}
      {activeTab === 'rfqs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRFQs.map((rfq) => (
            <Card
              key={rfq.id}
              className="p-6 space-y-4 border-2 border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="teal" size="md">
                    {rfq.category}
                  </Badge>
                  <span className="text-xs text-slate-400">Due: {rfq.deadline}</span>
                </div>

                <h3 className="text-lg font-bold text-[#172B3A] dark:text-white leading-snug">
                  {rfq.title}
                </h3>

                <div className="p-4 bg-[#F4F9F6] dark:bg-slate-800 rounded-xl space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Buyer Company:</span>
                    <strong className="text-slate-900 dark:text-slate-100 font-bold">{rfq.buyerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Quantity Needed:</span>
                    <strong className="text-[#159B68] font-bold">{rfq.quantityRequired}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Price:</span>
                    <strong className="text-slate-900 dark:text-slate-100 font-bold">{rfq.targetPrice}</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {rfq.location}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="teal"
                size="md"
                onClick={() => setSelectedBuyer(rfq)}
                className="w-full min-h-[44px] bg-[#159B68] hover:bg-emerald-700 text-white font-bold rounded-xl"
              >
                Contact Buyer to Sell →
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 2: Products on Sale */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <Card
              key={prod.id}
              className="p-6 space-y-4 border-2 border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="teal" size="md">
                    {prod.category}
                  </Badge>
                  {prod.organicCertified && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      🌱 Organic Certified
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[#172B3A] dark:text-white leading-snug">
                  {prod.name}
                </h3>

                <div className="p-4 bg-[#F4F9F6] dark:bg-slate-800 rounded-xl space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Producer / Group:</span>
                    <strong className="text-slate-900 dark:text-slate-100 font-bold">{prod.producerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Selling Price:</span>
                    <strong className="text-[#159B68] font-bold text-base">{prod.unitPrice}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Production Capacity:</span>
                    <strong className="text-slate-700 dark:text-slate-300 font-semibold">{prod.capacity}</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {prod.district}, {prod.state}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedProduct(prod)}
                className="w-full min-h-[44px] font-bold rounded-xl"
              >
                Inquire About Product
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 3: My Inquiries / Connections */}
      {activeTab === 'connections' && (
        <Card className="divide-y divide-slate-200 dark:divide-slate-800 border-2 border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          {MOCK_BUSINESS_CONNECTIONS.map((conn) => (
            <div key={conn.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={conn.status === 'Active' ? 'success' : 'neutral'} size="sm">
                    {conn.status}
                  </Badge>
                  <span className="text-xs text-slate-400">{conn.date}</span>
                </div>
                <h4 className="text-base font-bold text-[#172B3A] dark:text-white">
                  {conn.productOrTopic}
                </h4>
                <p className="text-xs text-slate-500">
                  Partner: <strong>{conn.partnerName}</strong> ({conn.partnerRole}) • {conn.partnerLocation}
                </p>
                <p className="text-xs text-[#159B68] font-semibold">
                  Terms: {conn.quantityOrBudget}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedConnection(conn)}
                  className="min-h-[40px] text-xs font-semibold"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Modal: List My Product for Sale */}
      {showAddProductModal && (
        <Modal
          isOpen={showAddProductModal}
          onClose={() => setShowAddProductModal(false)}
          title="List My Product for Wholesale Sale"
          description="Enter your product details so verified wholesale buyers can reach you."
          size="md"
          footer={
            <div className="w-full flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setShowAddProductModal(false)}
                className="min-h-[44px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="add-product-listing-form"
                variant="teal"
                size="md"
                className="min-h-[44px] bg-[#159B68] text-white font-bold"
              >
                Publish Listing
              </Button>
            </div>
          }
        >
          <form id="add-product-listing-form" onSubmit={handleAddProduct} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-bold text-[#172B3A] dark:text-white mb-1">
                Product Name:
              </label>
              <input
                type="text"
                required
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="Example: Salem Turmeric, Chettinad Cotton Saree, Kodo Millet"
                className="w-full min-h-[48px] px-4 text-sm rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[#172B3A] dark:text-white focus:outline-none focus:border-[#159B68]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-[#172B3A] dark:text-white mb-1">
                  Category:
                </label>
                <select
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                  className="w-full min-h-[48px] px-3 text-sm rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[#172B3A] dark:text-white focus:outline-none focus:border-[#159B68]"
                >
                  <option value="Spices & Agri">Spices & Farming</option>
                  <option value="Handloom & Textiles">Handloom & Clothes</option>
                  <option value="Millets & Grains">Millets & Grains</option>
                  <option value="Dairy Products">Dairy & Milk</option>
                  <option value="Handicrafts">Handicrafts & Art</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#172B3A] dark:text-white mb-1">
                  Selling Price:
                </label>
                <input
                  type="text"
                  required
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  placeholder="e.g. ₹180 / kg"
                  className="w-full min-h-[48px] px-4 text-sm rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[#172B3A] dark:text-white focus:outline-none focus:border-[#159B68]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-[#172B3A] dark:text-white mb-1">
                  Monthly Supply Capacity:
                </label>
                <input
                  type="text"
                  value={newProductQuantity}
                  onChange={(e) => setNewProductQuantity(e.target.value)}
                  placeholder="e.g. 500 kg / month"
                  className="w-full min-h-[48px] px-4 text-sm rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[#172B3A] dark:text-white focus:outline-none focus:border-[#159B68]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#172B3A] dark:text-white mb-1">
                  Contact Mobile Phone:
                </label>
                <input
                  type="text"
                  required
                  value={newProductPhone}
                  onChange={(e) => setNewProductPhone(e.target.value)}
                  placeholder="e.g. 98450-12345"
                  className="w-full min-h-[48px] px-4 text-sm rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[#172B3A] dark:text-white focus:outline-none focus:border-[#159B68]"
                />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Contact Buyer or Inquire */}
      {(selectedBuyer || selectedProduct) && (
        <Modal
          isOpen={!!(selectedBuyer || selectedProduct)}
          onClose={() => {
            setSelectedBuyer(null);
            setSelectedProduct(null);
          }}
          title={selectedBuyer ? `Contact Buyer: ${selectedBuyer.buyerName}` : `Inquire: ${selectedProduct?.name}`}
          description="Send an inquiry with your available quantity and contact details."
          size="md"
          footer={
            <div className="w-full flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setSelectedBuyer(null);
                  setSelectedProduct(null);
                }}
                className="min-h-[44px]"
              >
                Close
              </Button>
              <Button
                variant="teal"
                size="md"
                onClick={handleSendInquiry}
                className="min-h-[44px] bg-[#159B68] text-white font-bold"
              >
                {inquirySuccess ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4" /> Message Sent!
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Send className="w-4 h-4" /> Send Contact Request
                  </span>
                )}
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-left">
            <div className="p-4 bg-[#F4F9F6] dark:bg-slate-800 rounded-xl space-y-2 text-xs sm:text-sm">
              <p>
                <strong>Requirement:</strong> {selectedBuyer?.title || selectedProduct?.name}
              </p>
              <p>
                <strong>Location:</strong> {selectedBuyer?.location || `${selectedProduct?.district}, ${selectedProduct?.state}`}
              </p>
              <p>
                <strong>Terms:</strong> {selectedBuyer?.targetPrice || selectedProduct?.unitPrice}
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#172B3A] dark:text-white mb-1">
                Your Message / Available Quantity:
              </label>
              <textarea
                rows={3}
                value={inquiryText}
                onChange={(e) => setInquiryText(e.target.value)}
                placeholder="Example: Vanakkam, we have 1,000 kg ready for delivery this week from Thanjavur..."
                className="w-full p-3 text-sm rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[#172B3A] dark:text-white focus:outline-none focus:border-[#159B68]"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: View Details of Inquiry / Connection */}
      {selectedConnection && (
        <Modal
          isOpen={!!selectedConnection}
          onClose={() => setSelectedConnection(null)}
          title={`Connection: ${selectedConnection.partnerName}`}
          description={`${selectedConnection.partnerRole} • ${selectedConnection.partnerLocation}`}
          size="md"
          footer={
            <div className="w-full flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedConnection(null)}
                className="min-h-[44px]"
              >
                Close
              </Button>
              <a
                href={`tel:${selectedConnection.partnerPhone || '9845012345'}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 min-h-[44px] rounded-xl bg-[#159B68] hover:bg-emerald-700 text-white font-bold text-sm"
              >
                Call Partner
              </a>
            </div>
          }
        >
          <div className="space-y-4 text-left">
            <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl space-y-2 border border-emerald-200 dark:border-emerald-800 text-sm">
              <div>
                <span className="text-xs text-slate-500 block">Product / Subject:</span>
                <strong className="text-base text-slate-900 dark:text-white">{selectedConnection.productOrTopic}</strong>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 text-xs">
                <div>
                  <span className="text-slate-500">Agreed Terms:</span>
                  <strong className="block text-[#159B68] font-bold">{selectedConnection.quantityOrBudget}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Initiated Date:</span>
                  <strong className="block text-slate-700 dark:text-slate-300">{selectedConnection.date}</strong>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1 text-xs">
              <span className="text-slate-500 block font-semibold">Verification & KYC Status:</span>
              <p className="text-slate-700 dark:text-slate-300">
                Partner identity and business registration have been cross-verified with registered mobile credentials. All communications are logged for community security.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
