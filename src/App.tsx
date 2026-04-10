/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import LandingPage from './components/landing/LandingPage';
import AuthPage from './components/auth/AuthPage';
import DashboardLayout from './components/DashboardLayout';
import StudentDashboard from './components/roles/student/StudentDashboard';
import AgentDashboard from './components/roles/agent/AgentDashboard';
import ManagerDashboard from './components/roles/manager/ManagerDashboard';
import AdminDashboard from './components/roles/admin/AdminDashboard';
import { UserRole } from './types';

export default function App() {
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [role, setRole] = useState<UserRole>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (selectedRole: UserRole, isApproved: boolean) => {
    // For UI purpose, we allow dashboards even if not approved (mocking approval)
    setRole(selectedRole);
    setView('dashboard');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setRole(null);
    setView('landing');
  };

  if (view === 'auth') {
    return (
      <AuthPage 
        onBack={() => setView('landing')} 
        onLogin={handleLogin} 
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  if (view === 'dashboard' && role) {
    return (
      <DashboardLayout 
        role={role} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
      >
        {role === 'student' && activeTab === 'dashboard' && <StudentDashboard />}
        {role === 'agent' && activeTab === 'dashboard' && <AgentDashboard />}
        {role === 'manager' && activeTab === 'dashboard' && <ManagerDashboard />}
        {role === 'admin' && activeTab === 'dashboard' && <AdminDashboard />}
        
        {/* Placeholder for other tabs */}
        {activeTab !== 'dashboard' && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 bg-app-surface rounded-full flex items-center justify-center mb-6 border border-app-border">
              <span className="text-4xl">🚧</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-app-text">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section</h2>
            <p className="text-app-muted">This feature is currently under development.</p>
          </div>
        )}
      </DashboardLayout>
    );
  }

  return (
    <LandingPage 
      onGetStarted={() => setView('auth')} 
      onLogin={() => setView('auth')} 
      theme={theme}
      toggleTheme={toggleTheme}
    />
  );
}

