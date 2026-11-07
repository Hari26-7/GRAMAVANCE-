import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';

import { Dashboard } from './pages/Dashboard';
import { Schemes } from './pages/Schemes';
import { EligibilityChecker } from './pages/EligibilityChecker';
import { SchemeCompatibility } from './pages/SchemeCompatibility';
import { CommunityNetwork } from './pages/CommunityNetwork';
import { LocalMarketplace } from './pages/LocalMarketplace';
import { DocumentVault } from './pages/DocumentVault';
import { FinancialReadiness } from './pages/FinancialReadiness';
import { CommunityAssistant } from './pages/CommunityAssistant';
import { Applications } from './pages/Applications';
import { Notifications } from './pages/Notifications';
import { HelpSupport } from './pages/HelpSupport';
import { Settings } from './pages/Settings';
import { AdminPortal } from './pages/AdminPortal';

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <HashRouter>
            <Routes>
              {/* Main Application Shell */}
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />

                {/* 9 Core Information Architecture Routes */}
                <Route path="schemes" element={<Schemes />} />
                <Route path="eligibility" element={<EligibilityChecker />} />
                <Route path="community" element={<CommunityNetwork />} />
                <Route path="marketplace" element={<LocalMarketplace />} />
                <Route path="documents" element={<DocumentVault />} />
                <Route path="financial-readiness" element={<FinancialReadiness />} />
                <Route path="help" element={<HelpSupport />} />
                <Route path="profile" element={<Settings />} />

                {/* Auxiliary Specialized Modules */}
                <Route path="assistant" element={<CommunityAssistant />} />
                <Route path="compatibility" element={<SchemeCompatibility />} />
                <Route path="applications" element={<Applications />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="admin" element={<AdminPortal />} />

                {/* Legacy Backward Compatibility Aliases */}
                <Route path="grant-intelligence" element={<Navigate to="/eligibility" replace />} />
                <Route path="vault" element={<Navigate to="/documents" replace />} />
                <Route path="business-connect" element={<Navigate to="/marketplace" replace />} />
                <Route path="financial-health" element={<Navigate to="/financial-readiness" replace />} />
                <Route path="community-insights" element={<Navigate to="/community" replace />} />
                <Route path="settings" element={<Navigate to="/profile" replace />} />

                {/* Catch-All */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </HashRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
