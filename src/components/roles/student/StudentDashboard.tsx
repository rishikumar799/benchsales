import StudentOverview from './pages/Overview';
import StudentApplications from './pages/Applications';
import StudentProfile from './pages/Profile';
import StudentSettings from './pages/Settings';

interface StudentDashboardProps {
  activeTab: string;
}

export default function StudentDashboard({ activeTab }: StudentDashboardProps) {
  switch (activeTab) {
    case 'dashboard':
      return <StudentOverview />;
    case 'applications':
      return <StudentApplications />;
    case 'profile':
      return <StudentProfile />;
    case 'settings':
      return <StudentSettings />;
    default:
      return <StudentOverview />;
  }
}
