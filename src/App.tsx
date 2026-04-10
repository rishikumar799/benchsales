/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import DashboardLayout from './components/DashboardLayout';
import StudentDashboard from './components/StudentDashboard';
import AgentDashboard from './components/AgentDashboard';
import AdminDashboard from './components/AdminDashboard';
import { UserRole } from './types';

export default function App() {
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [role, setRole] = useState<UserRole>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setView('dashboard');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setRole(null);
    setView('landing');
  };

  if (view === 'auth') {
    return <AuthPage onBack={() => setView('landing')} onLogin={handleLogin} />;
  }

  if (view === 'dashboard' && role) {
    return (
      <DashboardLayout 
        role={role} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      >
        {role === 'student' && activeTab === 'dashboard' && <StudentDashboard />}
        {role === 'agent' && activeTab === 'dashboard' && <AgentDashboard />}
        {role === 'admin' && activeTab === 'dashboard' && <AdminDashboard />}
        
        {/* Placeholder for other tabs */}
        {activeTab !== 'dashboard' && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🚧</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section</h2>
            <p className="text-gray-500">This feature is currently under development.</p>
          </div>
        )}
      </DashboardLayout>
    );
  }

  return (
    <LandingPage 
      onGetStarted={() => setView('auth')} 
      onLogin={() => setView('auth')} 
    />
  );
}

