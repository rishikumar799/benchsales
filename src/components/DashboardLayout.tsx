import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  LayoutDashboard, 
  FileText, 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Users,
  BarChart3,
  ShieldCheck,
  Briefcase,
  Phone
} from 'lucide-react';
import { UserRole } from '../types';
import ThemeToggle from './common/ThemeToggle';

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function DashboardLayout({ children, role, onLogout, activeTab, setActiveTab, theme, toggleTheme }: DashboardLayoutProps) {
  const menuItems = {
    student: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'applications', label: 'Applications', icon: Briefcase },
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    agent: [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'students', label: 'My Students', icon: Users },
      { id: 'reports', label: 'Reports', icon: FileText },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    manager: [
      { id: 'dashboard', label: 'Dashboard', icon: ShieldCheck },
      { id: 'approvals', label: 'Approvals', icon: Phone },
      { id: 'allotment', label: 'Allotment', icon: Users },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    admin: [
      { id: 'dashboard', label: 'Admin Panel', icon: ShieldCheck },
      { id: 'users', label: 'User Management', icon: Users },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'config', label: 'System Config', icon: Settings },
    ]
  };

  const currentMenu = menuItems[role as keyof typeof menuItems] || [];

  return (
    <div className="min-h-screen bg-app-bg flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-app-border flex flex-col glass fixed h-full z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 blue-gradient rounded-xl flex items-center justify-center">
            <Zap className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-display font-bold">Bench Sales</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <div className="px-4 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-app-muted">Main Menu</div>
          {currentMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === item.id 
                  ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
                  : 'text-app-muted hover:text-app-text hover:bg-app-surface'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-app-border space-y-2">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-xs font-bold text-app-muted uppercase tracking-widest">Theme</span>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        {/* Top Bar */}
        <header className="h-20 border-b border-app-border px-8 flex items-center justify-between sticky top-0 bg-app-bg/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
              <input 
                type="text" 
                placeholder="Search anything..."
                className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-app-muted hover:text-app-text transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-blue rounded-full border-2 border-app-bg" />
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-app-border">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-app-text">Rishi Kumar</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-blue">{role}</div>
              </div>
              <div className="w-10 h-10 rounded-full blue-gradient p-0.5">
                <img 
                  src="https://picsum.photos/seed/user123/100/100" 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover border-2 border-app-bg"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
