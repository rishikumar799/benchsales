import ManagerOverview from './pages/Overview';
import ManagerApprovals from './pages/Approvals';
import ManagerAllotment from './pages/Allotment';
import ManagerSettings from './pages/Settings';

interface ManagerDashboardProps {
  activeTab: string;
}

export default function ManagerDashboard({ activeTab }: ManagerDashboardProps) {
  switch (activeTab) {
    case 'dashboard':
      return <ManagerOverview />;
    case 'approvals':
      return <ManagerApprovals />;
    case 'allotment':
      return <ManagerAllotment />;
    case 'settings':
      return <ManagerSettings />;
    default:
      return <ManagerOverview />;
  }
}
