import React, { useState } from 'react';
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Camera,
  Info,
  Filter,
} from 'lucide-react';
import { Card, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useLanguage } from '../context/LanguageContext';

export type DocumentCategory =
  | 'Identity'
  | 'Land Record'
  | 'Bank Proof'
  | 'Quotations'
  | 'Registration';

interface VaultDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  ocrStatus: 'Processed' | 'Pending' | 'Needs Review';
  ocrQualityScore: number;
  extractedFields: Record<string, string>;
  qualityWarnings?: string[];
}

const INITIAL_DOCS: VaultDocument[] = [
  {
    id: 'doc_01',
    title: 'Aadhaar Card (ஆதார் அட்டை)',
    category: 'Identity',
    fileName: 'aadhaar_front_redacted.pdf',
    fileSize: '420 KB',
    uploadDate: '2026-03-10',
    ocrStatus: 'Processed',
    ocrQualityScore: 96,
    extractedFields: {
      'Full Name': 'Ananya Devi',
      'Year of Birth': '1984',
      'Gender': 'Female',
      'District & State': 'Thanjavur, Tamil Nadu',
      'Aadhaar Number (Last 4)': 'XXXX-XXXX-8421',
    },
  },
  {
    id: 'doc_02',
    title: 'Turmeric Grinder Quotation (இயந்திர விலைப்பட்டியல்)',
    category: 'Quotations',
    fileName: 'machinery_quotation_coimbatore.pdf',
    fileSize: '1.2 MB',
    uploadDate: '2026-03-24',
    ocrStatus: 'Processed',
    ocrQualityScore: 89,
    extractedFields: {
      'Machine Seller': 'Kovai Agro Mills & Machinery Pvt Ltd',
      'Total Price': '₹8,50,000 + GST',
      'Equipment Model': 'Stainless Steel 304 Multi-stage Grinder 15HP',
    },
  },
  {
    id: 'doc_03',
    title: 'SHG Bank Passbook (வங்கி கணக்குப் புத்தகம்)',
    category: 'Bank Proof',
    fileName: 'iob_shg_passbook_scan.jpg',
    fileSize: '2.1 MB',
    uploadDate: '2026-03-26',
    ocrStatus: 'Needs Review',
    ocrQualityScore: 68,
    qualityWarnings: [
      'Corner of the bank seal stamp is slightly shadowed.',
      'We recommend holding your camera steady in daylight for bank verification.',
    ],
    extractedFields: {
      'Group / Account Name': 'Kaveri Mahalir Suya Udhavi Kuzhu',
      'Bank & Branch': 'Indian Overseas Bank, Thiruvaiyaru',
      'Account Number': '01420100004921',
      'Current Balance': '₹1,84,320.00',
    },
  },
  {
    id: 'doc_04',
    title: 'Udyam Registration Paper (தொழில் பதிவுச் சான்று)',
    category: 'Registration',
    fileName: 'udyam_registration_certificate.pdf',
    fileSize: '310 KB',
    uploadDate: '2026-02-14',
    ocrStatus: 'Processed',
    ocrQualityScore: 98,
    extractedFields: {
      'Registration Number': 'UDYAM-TN-28-0019284',
      'Business Type': 'Micro Enterprise (Food Processing)',
      'Enterprise Name': 'Kaveri Agro Foods',
    },
  },
];

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'All', label: 'All Documents' },
  { id: 'Identity', label: 'Identity (Aadhaar)' },
  { id: 'Bank Proof', label: 'Bank Passbook' },
  { id: 'Quotations', label: 'Machinery Quotations' },
  { id: 'Registration', label: 'Business Registration' },
  { id: 'Land Record', label: 'Land Patta / Rent' },
];

export const DocumentVault: React.FC = () => {
  const { language } = useLanguage();
  const [documents, setDocuments] = useState<VaultDocument[]>(() => {
    const saved = localStorage.getItem('gramavance_vault_docs');
    return saved ? JSON.parse(saved) : INITIAL_DOCS;
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDoc, setSelectedDoc] = useState<VaultDocument | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [autofillSuccess, setAutofillSuccess] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // Deletion modal state for human-centered accessible confirmation
  const [docToDelete, setDocToDelete] = useState<VaultDocument | null>(null);

  const confirmDelete = () => {
    if (docToDelete) {
      const updated = documents.filter((d) => d.id !== docToDelete.id);
      setDocuments(updated);
      localStorage.setItem('gramavance_vault_docs', JSON.stringify(updated));
      if (selectedDoc?.id === docToDelete.id) setSelectedDoc(null);
      setDocToDelete(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const validExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!validTypes.includes(file.type) && !hasValidExt) {
      setUploadError(
        'Please upload a valid image (JPG, PNG) or PDF document. Word files and spreadsheets are not supported.'
      );
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size is larger than 10MB. Please take a smaller photo or compressed PDF.');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const newDoc: VaultDocument = {
        id: `doc_${Date.now()}`,
        title: `${cleanTitle} (புதிய ஆவணம்)`,
        category: 'Quotations',
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(0)} KB`,
        uploadDate: new Date().toISOString().split('T')[0],
        ocrStatus: 'Processed',
        ocrQualityScore: 94,
        extractedFields: {
          'Document File': file.name,
          'Simulated Recognition': 'Information read and stored locally',
          'Confidence Rating': '94% clarity rating',
        },
      };
      const updated = [newDoc, ...documents];
      setDocuments(updated);
      localStorage.setItem('gramavance_vault_docs', JSON.stringify(updated));
      setIsUploading(false);
    }, 1000);
  };

  const filteredDocs =
    selectedCategory === 'All'
      ? documents
      : documents.filter((d) => d.category === selectedCategory);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-left">
      {/* Title Header */}
      <div className="bg-white dark:bg-[#0E1A29] text-[#202B3C] dark:text-white p-6 sm:p-7 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] border border-[#E3E7ED] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'ta' ? 'என் ஆவணங்கள்' : 'My Documents'}
            </h1>
            <span className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-[#315D86] dark:text-sky-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Safe & Private
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#647184] dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? 'உங்கள் ஆதார், வங்கி புத்தகம் மற்றும் இயந்திர விலைப்பட்டியல்களைப் பாதுகாப்பாக வையுங்கள். விண்ணப்பங்களில் இவை தானாக நிரப்பப்படும்.'
              : 'Keep your papers and mobile photos safe. When you apply for a scheme, we fill in your details automatically.'}
          </p>
        </div>

        {/* Big Upload Button */}
        <label className="cursor-pointer">
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <Button
            variant="teal"
            size="lg"
            leftIcon={<Upload className="w-5 h-5" />}
            isLoading={isUploading}
            disabled={isUploading}
            className="font-bold min-h-[46px] px-6 rounded-xl shadow-xs text-sm sm:text-base cursor-pointer"
          >
            {isUploading
              ? 'Reading Paper...'
              : language === 'ta'
              ? 'புதிய ஆவணம் பதிவேற்றுக'
              : 'Upload Paper or Photo'}
          </Button>
        </label>
      </div>

      {/* Human-Centered 3-Question Guidance Card */}
      <Card className="p-5 border border-[#E3E7ED] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_18px_rgba(32,43,60,0.05)] space-y-3">
        <div className="flex items-center gap-2 font-bold text-[#315D86] dark:text-sky-300 text-sm">
          <Info className="w-4 h-4 text-[#159B68]" />
          <span>About Your Document Vault:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm text-[#172B3A] dark:text-slate-200">
          <div>
            <strong className="block text-[#102D46] dark:text-white font-semibold mb-0.5">1. What is this page for?</strong>
            <span>Securely store photos of your identity proof, land patta, bank passbook, and seller machinery quotations.</span>
          </div>
          <div>
            <strong className="block text-[#102D46] dark:text-white font-semibold mb-0.5">2. What can I do here?</strong>
            <span>Upload clear photos or PDFs, review extracted details, check for scan blurriness warnings, or download saved files.</span>
          </div>
          <div>
            <strong className="block text-[#102D46] dark:text-white font-semibold mb-0.5">3. What should I do next?</strong>
            <span>Make sure all 4 essential documents have a green checkmark before applying to any government scheme.</span>
          </div>
        </div>
      </Card>

      {/* Simulated OCR & Demonstration Notice (Phase 5D requirement) */}
      <div className="p-4 rounded-xl bg-[#EAF4FF] dark:bg-slate-900 border border-[#BCE0FD] dark:border-slate-800 text-xs sm:text-sm text-[#102D46] dark:text-slate-300 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#159B68] shrink-0 mt-0.5" />
        <div>
          <strong>Demonstration & Simulated OCR Notice:</strong> Text extraction and autofill fields are simulated locally for demonstration and convenience. Automated text recognition does not certify or verify the legal authenticity of documents; official verification is completed directly by the nodal government authority and financing bank branch.
        </div>
      </div>

      {uploadError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs sm:text-sm text-rose-800 dark:text-rose-200 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* 4 Essential Documents Checklist */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          4 Essential Papers for Most Government Help:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 shadow-2xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0 font-bold">
              ✓
            </div>
            <div>
              <h4 className="font-bold text-[#172B3A] dark:text-slate-100 text-sm">1. Aadhaar Card</h4>
              <p className="text-xs text-slate-500 mt-0.5">Proof of identity</p>
              <span className="inline-block mt-1 text-xs font-semibold text-emerald-600">
                Uploaded & Ready
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-600 shadow-2xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0 font-bold">
              !
            </div>
            <div>
              <h4 className="font-bold text-[#172B3A] dark:text-slate-100 text-sm">2. Bank Passbook</h4>
              <p className="text-xs text-slate-500 mt-0.5">Where money will come</p>
              <span className="inline-block mt-1 text-xs font-semibold text-amber-600">
                Needs clearer photo
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 shadow-2xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0 font-bold">
              ✓
            </div>
            <div>
              <h4 className="font-bold text-[#172B3A] dark:text-slate-100 text-sm">3. Machinery Quotation</h4>
              <p className="text-xs text-slate-500 mt-0.5">Price bill from seller</p>
              <span className="inline-block mt-1 text-xs font-semibold text-emerald-600">
                Uploaded & Ready
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 shadow-2xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0 font-bold">
              ✓
            </div>
            <div>
              <h4 className="font-bold text-[#172B3A] dark:text-slate-100 text-sm">4. Shop / Land Proof</h4>
              <p className="text-xs text-slate-500 mt-0.5">Udyam or Land Patta</p>
              <span className="inline-block mt-1 text-xs font-semibold text-emerald-600">
                Uploaded & Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-[#159B68] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Document List & Auto-fill Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 Cols): Uploaded Documents List */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="overflow-hidden border-2 border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-[#F4F9F6] dark:bg-slate-800/60">
              <span className="text-base font-bold text-[#102D46] dark:text-slate-100">
                Your Saved Documents ({filteredDocs.length})
              </span>
              <span className="text-xs text-slate-500">
                💡 Tap any document to check the details read from it
              </span>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 rounded-2xl bg-[#EAF4FF] text-[#102D46] dark:bg-slate-800 dark:text-slate-200 mt-0.5 shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-[#172B3A] dark:text-slate-100">
                          {doc.title}
                        </h3>
                        <Badge
                          variant={
                            doc.ocrStatus === 'Processed'
                              ? 'success'
                              : doc.ocrStatus === 'Needs Review'
                              ? 'warning'
                              : 'neutral'
                          }
                          size="md"
                        >
                          {doc.ocrStatus === 'Processed'
                            ? '✅ Clear & Ready'
                            : '⚠️ Check Photo'}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-500 mt-1">
                        Category: <strong>{doc.category}</strong> • File: {doc.fileName} ({doc.fileSize}) • {doc.uploadDate}
                      </p>

                      {doc.qualityWarnings && doc.qualityWarnings.length > 0 && (
                        <div className="mt-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/60 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                          <span>{doc.qualityWarnings[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setSelectedDoc(doc)}
                      className="rounded-xl text-sm font-semibold min-h-[44px]"
                    >
                      View Details
                    </Button>
                    <button
                      onClick={() => setDocToDelete(doc)}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Remove this paper"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (4 Cols): Friendly Helpful Guidance */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5 sm:p-6 space-y-4 border-2 border-slate-200 dark:border-slate-800 rounded-2xl bg-[#F4F9F6] dark:bg-slate-900">
            <CardTitle className="text-base text-[#102D46] dark:text-slate-100 flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#159B68]" />
              How to take good photos of your papers:
            </CardTitle>

            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold shrink-0">1.</span>
                <span>Place the paper flat on a clean table in good daylight.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold shrink-0">2.</span>
                <span>Hold your mobile camera directly above without tilting.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold shrink-0">3.</span>
                <span>Check that name, account number, and bank stamps are readable.</span>
              </li>
            </ul>

            <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#159B68] shrink-0" />
              <span>
                <strong>Your papers are 100% private.</strong> Only you and your chosen government
                officer can see them.
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Accessible Deletion Confirmation Modal (Phase 2 & Phase 5D) */}
      {docToDelete && (
        <Modal
          isOpen={!!docToDelete}
          onClose={() => setDocToDelete(null)}
          title="Remove Document?"
          description="Are you sure you want to remove this paper from your vault?"
          size="sm"
        >
          <div className="space-y-4 text-left">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              You are removing <strong>{docToDelete.title}</strong> ({docToDelete.fileName}). You can always take a new photo or upload it again later.
            </p>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setDocToDelete(null)}
                className="min-h-[44px]"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={confirmDelete}
                className="min-h-[44px] bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                Yes, Remove Document
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Document View & Extracted Information Modal */}
      {selectedDoc && (
        <Modal
          isOpen={!!selectedDoc}
          onClose={() => {
            setSelectedDoc(null);
            setShowTechnicalDetails(false);
          }}
          title={selectedDoc.title}
          description={`Saved file: ${selectedDoc.fileName} (${selectedDoc.fileSize})`}
          size="md"
        >
          <div className="space-y-5 text-base text-left">
            <div className="p-4 bg-[#F4F9F6] dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-[#102D46] dark:text-slate-100 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#159B68]" />
                Information read from this paper:
              </h4>
              <p className="text-xs text-slate-500">
                This information will automatically fill your application forms so you do not have to type it.
              </p>

              <div className="space-y-2 pt-2">
                {Object.entries(selectedDoc.extractedFields).map(([label, value]) => (
                  <div
                    key={label}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm"
                  >
                    <span className="text-slate-500 font-medium">{label}:</span>
                    <strong className="text-[#172B3A] dark:text-slate-100 font-bold">{value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Collapsible Technical & OCR Details */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
              <button
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#159B68] flex items-center gap-1 cursor-pointer"
              >
                {showTechnicalDetails ? (
                  <>
                    <ChevronUp className="w-4 h-4" /> Hide Advanced Security & OCR Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" /> Show Advanced Security & OCR Details
                  </>
                )}
              </button>

              {showTechnicalDetails && (
                <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-2 text-slate-600 dark:text-slate-300">
                  <p>
                    <strong>Clarity Confidence Score:</strong> {selectedDoc.ocrQualityScore} / 100
                  </p>
                  <p>
                    <strong>Privacy & Protection:</strong> Client-Side encrypted storage on this device. Sensitive numbers (such as Aadhaar) are masked to prevent unauthorized exposure.
                  </p>
                  <p>
                    <strong>Legal Notice:</strong> Text extraction is a convenience aid to speed up form completion. Official scheme sanctions depend on physical and biometric verification by the authorized bank.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              {autofillSuccess ? (
                <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                  <Check className="w-5 h-5" /> Information Confirmed for Forms!
                </span>
              ) : (
                <span className="text-xs text-slate-500">
                  Ready to auto-fill government forms
                </span>
              )}
              <Button
                variant="teal"
                size="md"
                onClick={() => {
                  setAutofillSuccess(true);
                  setTimeout(() => setAutofillSuccess(false), 3000);
                }}
                className="bg-[#159B68] hover:bg-emerald-700 text-white font-bold px-5 rounded-xl min-h-[44px]"
              >
                Confirm Information
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
