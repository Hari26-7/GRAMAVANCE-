import React, { createContext, useContext, useState } from 'react';
import type { UserProfile, UserRole } from '../types';

export const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  shg: {
    id: 'usr_shg_01',
    fullName: 'Ananya Devi (President)',
    role: 'shg',
    organizationName: 'Kaveri Women Farmers & Artisans SHG',
    email: 'contact@kaveri-shg.org',
    phone: '+91 98450 12345',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    villageOrTown: 'Thiruvaiyaru',
    pincode: '613204',
    isVerified: true,
    profileCompletion: 88,
    preferredLanguage: 'ta',
    businessCategory: 'Organic Food Processing & Handloom',
    annualTurnover: 450000,
    memberCount: 14,
  },
  individual_entrepreneur: {
    id: 'usr_ind_02',
    fullName: 'Lakshmi Narayanan',
    role: 'individual_entrepreneur',
    organizationName: 'Narayanan Agro Solar Drying Solutions',
    email: 'lakshmi@narayanansolar.in',
    phone: '+91 97890 23456',
    state: 'Tamil Nadu',
    district: 'Madurai',
    villageOrTown: 'Melur',
    pincode: '625106',
    isVerified: true,
    profileCompletion: 75,
    preferredLanguage: 'en',
    businessCategory: 'Agro Renewable Processing',
    annualTurnover: 820000,
  },
  farmer_producer: {
    id: 'usr_fpo_03',
    fullName: 'Rameshwar Patel',
    role: 'farmer_producer',
    organizationName: 'Narmada Organic Millets Producer Co.',
    email: 'rameshwar@narmadamillets.coop',
    phone: '+91 94250 88990',
    state: 'Madhya Pradesh',
    district: 'Hoshangabad',
    villageOrTown: 'Babai',
    pincode: '461661',
    isVerified: true,
    profileCompletion: 92,
    preferredLanguage: 'hi',
    businessCategory: 'Millet Processing & Pulses',
    annualTurnover: 2400000,
    memberCount: 320,
  },
  artisan: {
    id: 'usr_art_04',
    fullName: 'Meenakshi Ammal',
    role: 'artisan',
    organizationName: 'Chettinad Heritage Cotton Weavers',
    email: 'meenakshi.weavers@ruralcrafts.org',
    phone: '+91 94431 55667',
    state: 'Tamil Nadu',
    district: 'Sivaganga',
    villageOrTown: 'Karaikudi',
    pincode: '630001',
    isVerified: true,
    profileCompletion: 80,
    preferredLanguage: 'ta',
    businessCategory: 'Handloom & Handicrafts',
    annualTurnover: 310000,
    memberCount: 8,
  },
  cooperative: {
    id: 'usr_coop_05',
    fullName: 'Suresh Kumar Sharma',
    role: 'cooperative',
    organizationName: 'Vikas Dairy & Agro Rural Cooperative Society',
    email: 'info@vikascooperative.in',
    phone: '+91 98290 11223',
    state: 'Rajasthan',
    district: 'Jaipur',
    villageOrTown: 'Chomu',
    pincode: '303702',
    isVerified: true,
    profileCompletion: 95,
    preferredLanguage: 'hi',
    businessCategory: 'Dairy Value Addition',
    annualTurnover: 5200000,
    memberCount: 180,
  },
  buyer: {
    id: 'usr_byr_06',
    fullName: 'Vikram Mehta',
    role: 'buyer',
    organizationName: 'Gramin Naturals Supply Chain Pvt Ltd',
    email: 'procurement@graminnaturals.com',
    phone: '+91 98100 77889',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    villageOrTown: 'Electronic City',
    pincode: '560100',
    isVerified: true,
    profileCompletion: 90,
    preferredLanguage: 'en',
    businessCategory: 'B2B Retail & Institutional Buyer',
  },
  mentor: {
    id: 'usr_mnt_07',
    fullName: 'Dr. Aruna Sundaram',
    role: 'mentor',
    organizationName: 'Rural Enterprise Development Council',
    email: 'aruna.sundaram@nabard-consult.org',
    phone: '+91 94440 99881',
    state: 'Tamil Nadu',
    district: 'Chennai',
    villageOrTown: 'Guindy',
    pincode: '600032',
    isVerified: true,
    profileCompletion: 100,
    preferredLanguage: 'en',
    businessCategory: 'Fintech & Scheme Advisory',
  },
  administrator: {
    id: 'usr_adm_08',
    fullName: 'District Project Coordinator (Admin)',
    role: 'administrator',
    organizationName: 'District Rural Development Agency (DRDA)',
    email: 'coordinator.drda@tn.gov.in',
    phone: '+91 94420 33445',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    villageOrTown: 'Collectorate Campus',
    pincode: '613001',
    isVerified: true,
    profileCompletion: 100,
    preferredLanguage: 'en',
    businessCategory: 'Government Administration',
  },
};

interface AuthContextType {
  user: UserProfile;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  availableRoles: { role: UserRole; label: string; org: string }[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('gramavance_role') as UserRole;
    if (saved && DEMO_PROFILES[saved]) return saved;
    return 'shg'; // Default to SHG for rural empowerment focus
  });

  const [userProfiles, setUserProfiles] = useState<Record<UserRole, UserProfile>>(DEMO_PROFILES);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem('gramavance_role', role);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfiles(prev => ({
      ...prev,
      [currentRole]: {
        ...prev[currentRole],
        ...updates,
      },
    }));
  };

  const availableRoles: { role: UserRole; label: string; org: string }[] = [
    { role: 'shg', label: 'Self-Help Group (SHG)', org: DEMO_PROFILES.shg.organizationName! },
    { role: 'individual_entrepreneur', label: 'Individual Entrepreneur', org: DEMO_PROFILES.individual_entrepreneur.organizationName! },
    { role: 'farmer_producer', label: 'Farmer / Producer (FPO)', org: DEMO_PROFILES.farmer_producer.organizationName! },
    { role: 'artisan', label: 'Artisan / Weaver', org: DEMO_PROFILES.artisan.organizationName! },
    { role: 'cooperative', label: 'Cooperative Society', org: DEMO_PROFILES.cooperative.organizationName! },
    { role: 'buyer', label: 'B2B Buyer', org: DEMO_PROFILES.buyer.organizationName! },
    { role: 'mentor', label: 'Business Mentor', org: DEMO_PROFILES.mentor.organizationName! },
    { role: 'administrator', label: 'Platform Administrator', org: DEMO_PROFILES.administrator.organizationName! },
  ];

  return (
    <AuthContext.Provider
      value={{
        user: userProfiles[currentRole],
        switchRole,
        updateProfile,
        availableRoles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
