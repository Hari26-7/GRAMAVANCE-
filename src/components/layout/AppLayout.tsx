import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

export const AppLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex transition-colors">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Component */}
      <div className={`lg:block ${mobileOpen ? 'block' : 'hidden'}`}>
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onCloseMobile={() => setMobileOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 dark:bg-zinc-950">
        <TopNavbar onToggleSidebar={() => setMobileOpen(!mobileOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto page-transition">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
