/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Platform } from 'react-native';

// Marketing Screens
import LandingPage from './screens/marketing/LandingPage';
import HowItWorksPage from './screens/marketing/HowItWorksPage';
import CommunityPage from './screens/marketing/CommunityPage';
import DiscussionsPage from './screens/marketing/DiscussionsPage';
import AboutPage from './screens/marketing/AboutPage';
import ServicesPage from './screens/marketing/ServicesPage';
import ContactPage from './screens/marketing/ContactPage';
import RolePage from './screens/roles/RolePage';

// App Screens
import AuthPage from './components/auth/AuthPage';
import DashboardLayout from './components/DashboardLayout';
import ScrollToTop from './components/marketing/common/ScrollToTop';
import StudentDashboard from './components/roles/student/StudentDashboard';
import AgentDashboard from './components/roles/agent/AgentDashboard';
import ManagerDashboard from './components/roles/manager/ManagerDashboard';
import AdminDashboard from './components/roles/admin/AdminDashboard';
import { UserRole } from './types';

const isAppMode = import.meta.env.VITE_APP_MODE === 'true';

export default function App() {
  const [role, setRole] = useState<UserRole>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (selectedRole: UserRole, isApproved: boolean) => {
    setRole(selectedRole);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setRole(null);
  };

  // If in Native App Mode, we skip marketing and go straight to Auth/Dashboard
  if (isAppMode) {
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route 
            path="/" 
          element={<Navigate to={role ? "/dashboard" : "/auth"} replace />} 
        />
        <Route 
          path="/auth" 
          element={
            role ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage 
                onBack={() => {}} 
                onLogin={handleLogin} 
                theme={theme}
                toggleTheme={toggleTheme}
              />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            role ? (
              <DashboardLayout 
                role={role} 
                onLogout={handleLogout} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                theme={theme}
                toggleTheme={toggleTheme}
              >
                {role === 'student' && <StudentDashboard activeTab={activeTab} />}
                {role === 'agent' && <AgentDashboard activeTab={activeTab} />}
                {role === 'manager' && <ManagerDashboard activeTab={activeTab} />}
                {role === 'admin' && <AdminDashboard activeTab={activeTab} />}
              </DashboardLayout>
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
    );
  }

  // Standard Web Logic (Default): Marketing Pages + Auth + Dashboard
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/how-it-works" element={<HowItWorksPage theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/community" element={<CommunityPage theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/community/discussions" element={<DiscussionsPage theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/about" element={<AboutPage theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/services" element={<ServicesPage theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/contact" element={<ContactPage theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/role/:role" element={<RolePage theme={theme} toggleTheme={toggleTheme} />} />
      
      <Route 
        path="/auth" 
        element={
          role ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthPage 
              onBack={() => navigate('/')} 
              onLogin={handleLogin} 
              theme={theme}
              toggleTheme={toggleTheme}
            />
          )
        } 
      />

      <Route 
        path="/dashboard" 
        element={
          role ? (
            <DashboardLayout 
              role={role} 
              onLogout={handleLogout} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              theme={theme}
              toggleTheme={toggleTheme}
            >
            {role === 'student' && <StudentDashboard activeTab={activeTab} />}
            {role === 'agent' && <AgentDashboard activeTab={activeTab} />}
            {role === 'manager' && <ManagerDashboard activeTab={activeTab} />}
            {role === 'admin' && <AdminDashboard activeTab={activeTab} />}
          </DashboardLayout>
        ) : (
            <Navigate to="/auth" replace />
          )
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

