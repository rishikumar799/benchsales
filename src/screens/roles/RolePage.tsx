import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/marketing/common/Navbar';
import Footer from '../../components/marketing/common/Footer';
import ApplicantLanding from '../../components/marketing/roles/ApplicantLanding';
import RecruiterLanding from '../../components/marketing/roles/RecruiterLanding';
import BdmLanding from '../../components/marketing/roles/BdmLanding';

interface RolePageProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

export default function RolePage({ theme, toggleTheme }: RolePageProps) {
  const { role } = useParams<{ role: string }>();

  // Map role route parameters (supports legacy user, agent, manager mapping)
  const activeRoleKey = 
    role === 'user' ? 'applicant' : 
    role === 'agent' ? 'recruiter' : 
    role === 'manager' ? 'bdm' : 
    (role || 'applicant').toLowerCase();

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col justify-between">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main className="flex-grow">
        {activeRoleKey === 'recruiter' ? (
          <RecruiterLanding theme={theme} />
        ) : activeRoleKey === 'bdm' ? (
          <BdmLanding theme={theme} />
        ) : (
          <ApplicantLanding theme={theme} />
        )}
      </main>

      <Footer />
    </div>
  );
}
