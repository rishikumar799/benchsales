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
  Briefcase
} from 'lucide-react';
import { UserRole } from '../types';

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function DashboardLayout({ children, role, onLogout, activeTab, setActiveTab }: DashboardLayoutProps) {
  const menuItems = {
    student: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'applications', label: 'Applications', icon: Briefcase },
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    agent: [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'students', label: 'Students', icon: Users },
      { id: 'reports', label: 'Reports', icon: FileText },
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
    <div className="min-h-screen bg-dark-bg flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col glass fixed h-full z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 blue-gradient rounded-xl flex items-center justify-center">
            <Zap className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-display font-bold">Bench Sales</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <div className="px-4 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Main Menu</div>
          {currentMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === item.id 
                  ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        {/* Top Bar */}
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-dark-bg/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search anything..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-blue rounded-full border-2 border-dark-bg" />
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-white/5">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-white">Rishi Kumar</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-blue">{role}</div>
              </div>
              <div className="w-10 h-10 rounded-full blue-gradient p-0.5">
                <img 
                  src="https://picsum.photos/seed/user123/100/100" 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover border-2 border-dark-bg"
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
