import AdminOverview from './pages/Overview';
import UserManagement from './pages/UserManagement';
import AdminAnalytics from './pages/Analytics';
import SystemConfig from './pages/SystemConfig';

interface AdminDashboardProps {
  activeTab: string;
}

export default function AdminDashboard({ activeTab }: AdminDashboardProps) {
  switch (activeTab) {
    case 'dashboard':
      return <AdminOverview />;
    case 'users':
      return <UserManagement />;
    case 'analytics':
      return <AdminAnalytics />;
    case 'config':
      return <SystemConfig />;
    default:
      return <AdminOverview />;
  }
}
