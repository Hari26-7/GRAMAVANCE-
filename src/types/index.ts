export type UserRole =
  | 'individual_entrepreneur'
  | 'shg'
  | 'farmer_producer'
  | 'artisan'
  | 'cooperative'
  | 'buyer'
  | 'mentor'
  | 'administrator';

export type LanguageCode = 'en' | 'ta' | 'hi';

export interface UserProfile {
  id: string;
  fullName: string;
  role: UserRole;
  organizationName?: string;
  email: string;
  phone: string;
  state: string;
  district: string;
  villageOrTown: string;
  pincode: string;
  avatarUrl?: string;
  isVerified: boolean;
  profileCompletion: number; // 0 to 100
  preferredLanguage: LanguageCode;
  businessCategory: string;
  annualTurnover?: number;
  memberCount?: number; // for SHGs / Cooperatives
}

export interface Scheme {
  id: string;
  slug: string;
  title: Record<LanguageCode, string>;
  shortDescription: Record<LanguageCode, string>;
  department: string;
  ministry: string;
  level: 'Central' | 'State';
  applicableStates: string[];
  applicantTypes: UserRole[];
  businessCategories: string[];
  fundingType: 'Capital Subsidy' | 'Interest Subvention' | 'Term Loan' | 'Grant' | 'Working Capital';
  maxSubsidyAmount: number; // In INR (₹)
  maxProjectCost: number; // In INR (₹)
  subsidyPercentage: number; // e.g. 35%
  promoterContributionMin: number; // e.g. 5% or 10%
  overview: Record<LanguageCode, string>;
  benefits: string[];
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  applicationProcedure: string[];
  officialPortalUrl: string;
  verificationDate: string; // ISO date
  applicationDeadline?: string; // ISO date or null for rolling
  isRollingDeadline: boolean;
  isPopular?: boolean;
  matchScore?: number; // Calculated match percentage 0-100
}

export type ApplicationStatus =
  | 'Draft'
  | 'Documents Prepared'
  | 'Submitted'
  | 'Under Review'
  | 'Sanctioned'
  | 'Disbursed'
  | 'Needs Clarification'
  | 'Rejected';

export interface GrantApplication {
  id: string;
  schemeId: string;
  schemeTitle: string;
  applicationNumber: string;
  status: ApplicationStatus;
  submissionDate?: string;
  targetDeadline: string;
  requestedAmount: number;
  approvedAmount?: number;
  progressPercent: number;
  nodalOffice: string;
  nodalContactPhone?: string;
  lastUpdated: string;
  documentCount: { completed: number; total: number };
  notes: string;
}

export interface BusinessConnection {
  id: string;
  type: 'Buyer Inquiry' | 'Supplier Match' | 'Mentor Request' | 'Cooperative Linkage';
  partnerName: string;
  partnerRole: string;
  partnerLocation: string;
  productOrTopic: string;
  quantityOrBudget: string;
  status: 'Pending' | 'Active' | 'Delivered' | 'Scheduled';
  date: string;
  verifiedPartner: boolean;
  partnerPhone?: string;
}

export interface FinancialMetric {
  month: string;
  revenue: number;
  operatingExpenses: number;
  debtService: number;
  cashSurplus: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'scheme_deadline' | 'document_expiry' | 'application_update' | 'buyer_request' | 'security';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
  category: 'scheme' | 'document' | 'application' | 'business' | 'profile';
  badgeColor?: string;
}
