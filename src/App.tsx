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
import { useAuth, dbRoleToAppRole } from './context/AuthContext';
import { useRecruiter } from './context/RecruiterContext';
import { useJobSeeker } from './context/JobSeekerContext';
import ProtectedRoute from './routes/ProtectedRoute';

const isAppMode = import.meta.env.VITE_APP_MODE === 'true';

export default function App() {
  const { userProfile, logout } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  const recruiterContext = useRecruiter();
  const candidateContext = useJobSeeker();
  const location = useLocation();
  const navigate = useNavigate();

  // Synchronize state user role with the logged-in Firebase user profile role
  useEffect(() => {
    if (userProfile) {
      setRole(dbRoleToAppRole(userProfile.role));
    } else {
      setRole(null);
    }
  }, [userProfile]);

  const isRecruiter = role === 'm_recruiter';
  const isCandidate = role === 'm_candidate';
  const activeTheme = isRecruiter 
    ? (recruiterContext?.theme || 'light') 
    : isCandidate 
    ? (candidateContext?.theme || 'light')
    : theme;

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(activeTheme);
    localStorage.setItem('theme', activeTheme);
  }, [activeTheme]);

  const toggleTheme = () => {
    if (isRecruiter && recruiterContext) {
      const nextTheme = recruiterContext.theme === 'light' ? 'dark' : 'light';
      recruiterContext.setTheme(nextTheme);
    } else if (isCandidate && candidateContext) {
      const nextTheme = candidateContext.theme === 'light' ? 'dark' : 'light';
      candidateContext.setTheme(nextTheme);
    } else {
      setTheme(prev => {
        const next = prev === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', next);
        return next;
      });
    }
  };

  const handleLogin = (selectedRole: UserRole, isApproved: boolean) => {
    setRole(selectedRole);
    setActiveTab('dashboard');
  };

  const handleLogout = async () => {
    await logout();
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
                theme={activeTheme}
                toggleTheme={toggleTheme}
              />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout 
                role={role!} 
                onLogout={handleLogout} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                theme={activeTheme}
                toggleTheme={toggleTheme}
              >
                <EcosystemRouter role={role!} activeTab={activeTab} setActiveTab={setActiveTab} />
              </DashboardLayout>
            </ProtectedRoute>
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
        <Route path="/" element={<LandingPage theme={activeTheme} toggleTheme={toggleTheme} />} />
      <Route path="/how-it-works" element={<HowItWorksPage theme={activeTheme} toggleTheme={toggleTheme} />} />
      <Route path="/community" element={<CommunityPage theme={activeTheme} toggleTheme={toggleTheme} />} />
      <Route path="/community/discussions" element={<DiscussionsPage theme={activeTheme} toggleTheme={toggleTheme} />} />
      <Route path="/about" element={<AboutPage theme={activeTheme} toggleTheme={toggleTheme} />} />
      <Route path="/services" element={<ServicesPage theme={activeTheme} toggleTheme={toggleTheme} />} />
      <Route path="/contact" element={<ContactPage theme={activeTheme} toggleTheme={toggleTheme} />} />
      <Route path="/role/:role" element={<RolePage theme={activeTheme} toggleTheme={toggleTheme} />} />
      
      <Route 
        path="/auth" 
        element={
          role ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthPage 
              onBack={() => navigate('/')} 
              onLogin={handleLogin} 
              theme={activeTheme}
              toggleTheme={toggleTheme}
            />
          )
        } 
      />

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout 
              role={role!} 
              onLogout={handleLogout} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              theme={activeTheme}
              toggleTheme={toggleTheme}
            >
              <EcosystemRouter role={role!} activeTab={activeTab} setActiveTab={setActiveTab} />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

