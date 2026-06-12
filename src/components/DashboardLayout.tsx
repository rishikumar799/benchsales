import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Phone,
  Menu,
  X,
  CheckSquare,
  Sparkles,
  ClipboardList,
  FolderClosed,
  GitPullRequest,
  GraduationCap,
  Building2,
  Activity
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = {
    // MARKETPLACE ECOSYSTEM
    m_candidate: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'jobs', label: 'Jobs', icon: Briefcase },
      { id: 'ai_matching', label: 'AI Matching', icon: Zap },
      { id: 'resume_builder', label: 'Resume Builder', icon: FileText },
      { id: 'applications', label: 'Applications', icon: Briefcase },
      { id: 'documents', label: 'Documents', icon: FileText },
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    m_recruiter: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'jobs', label: 'Available Jobs', icon: Briefcase },
      { id: 'candidates', label: 'Candidate Pool', icon: Users },
      { id: 'selections', label: 'My Selections', icon: CheckSquare },
      { id: 'submissions', label: 'Submissions', icon: FileText },
      { id: 'profile', label: 'Profile', icon: User },
    ],
    m_manager: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'jobs', label: 'Jobs', icon: Briefcase },
      { id: 'recruiters', label: 'Recruiters', icon: Users },
      { id: 'submissions', label: 'Candidates', icon: Users },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'profile', label: 'Profile', icon: User },
    ],

    // UNIVERSITY ECOSYSTEM
    u_admin: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'placement_officers', label: 'Placement Officers', icon: Users },
      { id: 'students', label: 'Students', icon: Users },
      { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
      { id: 'placements', label: 'Placements', icon: ShieldCheck },
      { id: 'reports', label: 'Reports', icon: FileText },
      { id: 'profile', label: 'Profile', icon: User },
    ],
    u_officer: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'students', label: 'Students', icon: Users },
      { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
      { id: 'applications', label: 'Applications', icon: FileText },
      { id: 'placements', label: 'Placements', icon: ShieldCheck },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'profile', label: 'Profile', icon: User },
    ],
    u_student: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
      { id: 'ai_matching', label: 'AI Matching', icon: Sparkles },
      { id: 'resume_builder', label: 'Resume Builder', icon: FileText },
      { id: 'applications', label: 'Applications', icon: ClipboardList },
      { id: 'documents', label: 'Documents', icon: FolderClosed },
      { id: 'profile', label: 'Profile', icon: User },
    ],

    // COMPANY ECOSYSTEM
    c_admin: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'managers', label: 'Managers', icon: Users },
      { id: 'recruiters', label: 'Recruiters', icon: Users },
      { id: 'employees', label: 'Employees', icon: Users },
      { id: 'jobs', label: 'Jobs', icon: Briefcase },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
      { id: 'profile', label: 'Profile', icon: User },
    ],
    c_manager: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'requirements', label: 'Jobs', icon: Briefcase },
      { id: 'recruiters', label: 'Recruiters', icon: Users },
      { id: 'placements', label: 'Applications', icon: FileText },
      { id: 'pipeline', label: 'Hiring Pipeline', icon: GitPullRequest },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'profile', label: 'Profile', icon: User },
    ],
    c_recruiter: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'jobs', label: 'Jobs', icon: Briefcase },
      { id: 'candidates', label: 'Candidates', icon: Users },
      { id: 'applications', label: 'Applications', icon: FileText },
      { id: 'pipeline', label: 'Pipeline', icon: GitPullRequest },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'profile', label: 'Profile', icon: User },
    ],
    c_employee: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
      { id: 'resume_builder', label: 'Resume Builder', icon: FileText },
      { id: 'applications', label: 'Applications', icon: FileText },
      { id: 'documents', label: 'Documents', icon: FileText },
      { id: 'profile', label: 'Profile', icon: User },
    ],

    // PLATFORM ADMIN
    platform_admin: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'organizations', label: 'Organizations', icon: Building2 },
      { id: 'users', label: 'Users', icon: Users },
      { id: 'marketplace', label: 'Marketplace', icon: Zap },
      { id: 'universities', label: 'Universities', icon: GraduationCap },
      { id: 'companies', label: 'Companies', icon: Building2 },
      { id: 'billing', label: 'Billing', icon: FileText },
      { id: 'system', label: 'System', icon: Activity },
      { id: 'profile', label: 'Profile', icon: User },
    ]
  };

  const getRoleLabel = (r: UserRole) => {
    switch (r) {
      case 'm_candidate': return 'Candidate';
      case 'm_recruiter': return 'Marketplace Recruiter';
      case 'm_manager': return 'Marketplace Manager / BDM';
      case 'u_admin': return 'University Admin';
      case 'u_officer': return 'Placement Officer';
      case 'u_student': return 'University Student';
      case 'c_admin': return 'Company Admin';
      case 'c_manager': return 'Internal Manager';
      case 'c_recruiter': return 'Internal Recruiter';
      case 'c_employee': return 'Employee';
      case 'platform_admin': return 'Platform Admin';
      default: return r || 'User';
    }
  };

  const currentMenu = menuItems[role as keyof typeof menuItems] || [];

  return (
    <div className="min-h-screen bg-app-bg flex overflow-hidden">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`w-72 border-r border-app-border flex flex-col glass fixed h-full z-30 transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 blue-gradient rounded-xl flex items-center justify-center">
              <Zap className="text-white w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-display font-extrabold uppercase tracking-wide">Aryx <span className="text-gradient">AI</span></span>
              {role === 'c_admin' && <div className="text-[10px] font-bold text-app-muted -mt-1 leading-none">Company Admin</div>}
            </div>
          </div>
          <button 
            className="lg:hidden p-2 text-app-muted hover:text-app-text"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <div className="px-4 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-app-muted">Main Menu</div>
          {currentMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
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

        {role === 'c_employee' && (
          <div className="mx-4 p-4 rounded-3xl bg-app-surface/60 border border-app-border flex flex-col gap-3 font-semibold pb-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full blue-gradient p-0.5 shrink-0">
                <img 
                  src="https://picsum.photos/seed/rohit123/100/100" 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover border-2 border-app-bg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="truncate">
                <div className="text-sm font-extrabold text-app-text leading-tight">Rohit Kumar</div>
                <div className="text-[10px] font-bold text-app-muted truncate">Software Engineer</div>
                <div className="text-[9px] font-bold text-brand-blue truncate font-mono">ID: EMP24567</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-app-muted uppercase tracking-wider">
                <span>Profile Completion</span>
                <span className="text-brand-violet">92%</span>
              </div>
              <div className="w-full h-1.5 bg-app-bg border border-app-border rounded-full overflow-hidden">
                <div className="h-full bg-brand-violet rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>
        )}

        {role === 'c_recruiter' && (
          <div className="mx-4 p-4 rounded-3xl bg-app-surface/60 border border-app-border flex flex-col gap-3 font-semibold pb-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full blue-gradient p-0.5 shrink-0">
                <img 
                  src="https://picsum.photos/seed/priyasharma/100/100" 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover border-2 border-app-bg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="truncate">
                <div className="text-sm font-extrabold text-app-text leading-tight">Priya Sharma</div>
                <div className="text-[10px] font-bold text-app-muted truncate">Senior Recruiter</div>
                <div className="text-[9px] font-bold text-brand-blue truncate font-mono">priya.sharma@aryx.ai</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-app-muted uppercase tracking-wider">
                <span>Recruiter Metrics</span>
                <span className="text-emerald-500">System Live</span>
              </div>
              <div className="w-full h-1.5 bg-app-bg border border-app-border rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        )}

        {role === 'c_admin' && (
          <div className="mx-4 p-4 rounded-3xl bg-app-surface/60 border border-app-border flex flex-col gap-3 font-semibold pb-4 mb-2 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full blue-gradient p-0.5 shrink-0">
                <img 
                  src="https://picsum.photos/seed/vikramsingh/100/100" 
                  alt="Vikram Singh" 
                  className="w-full h-full rounded-full object-cover border-2 border-app-bg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="truncate">
                <div className="text-sm font-extrabold text-app-text leading-tight">Vikram Singh</div>
                <div className="text-[10px] font-bold text-app-muted truncate">Company Admin</div>
                <div className="text-[9px] font-bold text-brand-blue truncate">admin@techsolutions.com</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-app-muted uppercase tracking-wider">
                <span>Ecosystem Status</span>
                <span className="text-emerald-500">Live & Secure</span>
              </div>
              <div className="w-full h-1.5 bg-app-bg border border-app-border rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        )}

        {role === 'c_manager' && (
          <div className="mx-4 p-4 rounded-3xl bg-app-surface/60 border border-app-border flex flex-col gap-3 font-semibold pb-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full blue-gradient p-0.5 shrink-0">
                <img 
                  src="https://picsum.photos/seed/amitverma/100/100" 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover border-2 border-app-bg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="truncate">
                <div className="text-sm font-extrabold text-app-text leading-tight">Amit Verma</div>
                <div className="text-[10px] font-bold text-app-muted truncate">Hiring Manager</div>
                <div className="text-[9px] font-bold text-brand-blue truncate">Engineering</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-app-muted uppercase tracking-wider">
                <span>Hiring Summary</span>
                <span className="text-brand-violet">94% Fill Rate</span>
              </div>
              <div className="w-full h-1.5 bg-app-bg border border-app-border rounded-full overflow-hidden">
                <div className="h-full bg-brand-violet rounded-full" style={{ width: '94%' }} />
              </div>
            </div>
          </div>
        )}

        {role === 'u_student' && (
          <div className="mx-4 p-4 rounded-3xl bg-app-surface/60 border border-app-border flex flex-col gap-3 font-semibold pb-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full blue-gradient p-0.5 shrink-0">
                <img 
                  src="https://picsum.photos/seed/rohit123/100/100" 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover border-2 border-app-bg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="truncate">
                <div className="text-sm font-extrabold text-app-text leading-tight">Rohit Kumar</div>
                <div className="text-[10px] font-bold text-app-muted truncate">B.Tech CSE - 2026</div>
                <div className="text-[9px] font-bold text-brand-blue truncate">St. Xavier's University</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-app-muted uppercase tracking-wider">
                <span>Profile Strength</span>
                <span className="text-brand-violet">86%</span>
              </div>
              <div className="w-full h-1.5 bg-app-bg border border-app-border rounded-full overflow-hidden">
                <div className="h-full bg-brand-violet rounded-full" style={{ width: '86%' }} />
              </div>
            </div>
          </div>
        )}

        {role === 'u_officer' && (
          <div className="mx-4 p-4 rounded-3xl bg-app-surface/60 border border-app-border flex flex-col gap-3 font-semibold pb-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full blue-gradient p-0.5 shrink-0">
                <img 
                  src="https://picsum.photos/seed/priyasharma/100/100" 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover border-2 border-app-bg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="truncate">
                <div className="text-sm font-extrabold text-app-text leading-tight">Priya Sharma</div>
                <div className="text-[10px] font-bold text-app-muted truncate">Placement Officer</div>
                <div className="text-[9px] font-bold text-brand-blue truncate">St. Xavier's University</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-app-muted uppercase tracking-wider">
                <span>Directives Status</span>
                <span className="text-brand-violet">System Online</span>
              </div>
              <div className="w-full h-1.5 bg-app-bg border border-app-border rounded-full overflow-hidden">
                <div className="h-full bg-brand-violet rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        )}

        {role === 'u_admin' && (
          <div className="mx-4 p-4 rounded-3xl bg-app-surface/60 border border-app-border flex flex-col gap-3 font-semibold pb-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full blue-gradient p-0.5 shrink-0">
                <img 
                  src="https://picsum.photos/seed/sandeepjain/100/100" 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover border-2 border-app-bg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="truncate">
                <div className="text-sm font-extrabold text-app-text leading-tight">Dr. Sandeep Jain</div>
                <div className="text-[10px] font-bold text-app-muted truncate">University Administrator</div>
                <div className="text-[9px] font-bold text-brand-blue truncate">St. Xavier's University</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-app-muted uppercase tracking-wider">
                <span>Ecosystem Status</span>
                <span className="text-emerald-500">Live & Secure</span>
              </div>
              <div className="w-full h-1.5 bg-app-bg border border-app-border rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        )}

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
      <main className="flex-1 lg:ml-72 w-full flex flex-col max-w-[100vw] lg:max-w-[calc(100vw-18rem)] transition-all duration-300 min-h-screen">
        {/* Top Bar */}
        <header className="h-20 border-b border-app-border px-4 lg:px-8 flex items-center justify-between sticky top-0 bg-app-bg/80 backdrop-blur-md z-10 gap-4">
          <div className="flex items-center gap-3 flex-1">
            <button 
              className="lg:hidden p-2 -ml-2 text-app-muted hover:text-app-text transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative w-full max-w-xl hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
              <input 
                type="text" 
                placeholder="Search anything..."
                className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-colors"
              />
            </div>
            <button className="sm:hidden p-2 text-app-muted hover:text-app-text">
              <Search className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <button className="relative p-2 text-app-muted hover:text-app-text transition-colors">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-blue rounded-full border-2 border-app-bg" />
            </button>
            
            <div className="flex items-center gap-3 pl-2 sm:pl-6 border-l border-app-border">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-app-text">
                  {role === 'u_admin' ? 'Dr. Sandeep Jain' : role === 'u_officer' ? 'Priya Sharma' : role === 'c_admin' ? 'Vikram Singh' : role === 'c_manager' ? 'Amit Verma' : role === 'm_manager' || role === 'u_student' || role === 'c_employee' ? 'Rohit Kumar' : 'Rishi Kumar'}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-blue">{getRoleLabel(role)}</div>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full blue-gradient p-0.5">
                <img 
                  src={role === 'u_admin' ? 'https://picsum.photos/seed/sandeepjain/100/100' : role === 'u_officer' ? 'https://picsum.photos/seed/priyasharma/100/100' : role === 'c_admin' ? 'https://picsum.photos/seed/vikramsingh/100/100' : role === 'c_manager' ? 'https://picsum.photos/seed/amitverma/100/100' : 'https://picsum.photos/seed/user123/100/100'} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover border-2 border-app-bg"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
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
