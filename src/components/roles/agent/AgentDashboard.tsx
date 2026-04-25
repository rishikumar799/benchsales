import AgentOverview from './pages/Overview';
import MyStudents from './pages/MyStudents';
import AgentReports from './pages/Reports';
import AgentSettings from './pages/Settings';

interface AgentDashboardProps {
  activeTab: string;
}

export default function AgentDashboard({ activeTab }: AgentDashboardProps) {
  switch (activeTab) {
    case 'dashboard':
      return <AgentOverview />;
    case 'students':
      return <MyStudents />;
    case 'reports':
      return <AgentReports />;
    case 'settings':
      return <AgentSettings />;
    default:
      return <AgentOverview />;
  }
}
