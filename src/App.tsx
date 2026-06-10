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
import EcosystemRouter from './components/roles/EcosystemRouter';
import { UserRole } from './types';

const isAppMode = import.meta.env.VITE_APP_MODE === 'true';

export default function App() {
  const [role, setRole] = useState<UserRole>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return next;
    });
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
                <EcosystemRouter role={role} activeTab={activeTab} setActiveTab={setActiveTab} />
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
              <EcosystemRouter role={role} activeTab={activeTab} setActiveTab={setActiveTab} />
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

