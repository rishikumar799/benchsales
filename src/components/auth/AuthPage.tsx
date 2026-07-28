import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ShieldCheck, 
  Key, 
  Check, 
  Eye, 
  EyeOff,
  GraduationCap,
  Building2,
  Users,
  Briefcase
} from 'lucide-react';
import { UserRole } from '../../types';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth, dbRoleToAppRole } from '../../context/AuthContext';

interface AuthPageProps {
  onBack: () => void;
  onLogin: (role: UserRole, isApproved: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function AuthPage({ onBack, onLogin, theme, toggleTheme }: AuthPageProps) {
  const { login, signupIndividual, signupOrganization, bypassLogin } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [signupStep, setSignupStep] = useState<1 | '2A_applicant' | '2A_recruiter' | '2A_bdm' | '2B'>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Account/Role state
  const [accountType, setAccountType] = useState<'individual' | 'organization'>('individual');
  const [orgType, setOrgType] = useState<'university' | 'company'>('university');
  const [individualRole, setIndividualRole] = useState<'candidate' | 'recruiter' | 'manager'>('candidate');
  
  // Login Profile selection to allow the user to check all 11 ecosystems easily!
  const [loginEcosystem, setLoginEcosystem] = useState<'marketplace' | 'university' | 'company' | 'platform'>('marketplace');
  const [loginRole, setLoginRole] = useState<UserRole>('m_candidate');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [orgName, setOrgName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showTester, setShowTester] = useState(true);

  const SECRET_SUBADMIN_CODE = "ARYX_ADMIN_2024"; 
  const ADMIN_EMAIL = "admin@AryxAI.com";
  const ADMIN_PASS = "admin123";

  const getRolesForEcosystem = (eco: string) => {
    switch (eco) {
      case 'marketplace':
        return [
          { id: 'm_candidate', label: 'Candidate' },
          { id: 'm_recruiter', label: 'Recruiter' },
          { id: 'm_manager', label: 'Manager / BDM' }
        ];
      case 'university':
        return [
          { id: 'u_student', label: 'Student' },
          { id: 'u_officer', label: 'Placement Officer' },
          { id: 'u_admin', label: 'University Admin' }
        ];
      case 'company':
        return [
          { id: 'c_employee', label: 'Employee' },
          { id: 'c_recruiter', label: 'Internal Recruiter' },
          { id: 'c_manager', label: 'Internal Manager' },
          { id: 'c_admin', label: 'Company Admin' }
        ];
      case 'platform':
        return [
          { id: 'platform_admin', label: 'Platform Admin' }
        ];
      default:
        return [];
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (loginRole === 'platform_admin' && email === ADMIN_EMAIL && password === ADMIN_PASS) {
      bypassLogin('platform_admin');
      onLogin('platform_admin', true);
      return;
    }
    
    try {
      const profile = await login(email, password);
      const targetRole = dbRoleToAppRole(profile.role);
      onLogin(targetRole, true);
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials. Please try again.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (signupStep === '2A_applicant' || signupStep === '2A_recruiter' || signupStep === '2A_bdm') {
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify your password entry.');
        return;
      }
      if (!agreeTerms) {
        setError('Please accept the Terms of Service and Privacy Policy to create your account.');
        return;
      }
    }
    
    try {
      if (signupStep === '2A_applicant') {
        const profile = await signupIndividual(fullName, email, phone, password, 'candidate');
        const targetRole = dbRoleToAppRole(profile.role);
        onLogin(targetRole, true);
      } else if (signupStep === '2A_recruiter') {
        const profile = await signupIndividual(fullName, email, phone, password, 'recruiter');
        const targetRole = dbRoleToAppRole(profile.role);
        onLogin(targetRole, true);
      } else if (signupStep === '2A_bdm') {
        const profile = await signupIndividual(fullName, email, phone, password, 'manager');
        const targetRole = dbRoleToAppRole(profile.role);
        onLogin(targetRole, true);
      } else if (signupStep === '2B') {
        const profile = await signupOrganization(orgName, adminName, email, phone, password, orgType);
        const targetRole = dbRoleToAppRole(profile.role);
        onLogin(targetRole, true);
      }
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection-none relative font-sans overflow-x-hidden">
      
      {/* Top action row */}
      <div className="absolute top-6 right-6 z-40 flex items-center gap-4">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <button 
          onClick={onBack}
          className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm transition-all"
        >
          Back to Home
        </button>
      </div>

      {/* Main container wrapper */}
      <div className="flex-1 w-full flex items-center justify-center p-3 sm:p-6 md:p-8 lg:p-12 py-20 sm:py-24">
        <div className="w-full max-w-6xl mx-auto">
          
          <AnimatePresence mode="wait">
            {isLogin ? (
              // ===============================================
              // LOGIN WINDOW (DUAL COLUMN - BLUE LEFT, WHITE RIGHT)
              // ===============================================
              <motion.div 
                key="login-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 min-h-[600px]"
              >
                {/* Left side panel (Modern dynamic blue-indigo brand dashboard) */}
                <div className="md:col-span-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden select-none shadow-xl">
                  
                  {/* Abstract elements */}
                  <div className="absolute -top-12 -right-12 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
                  <div className="absolute -bottom-24 -left-12 w-80 h-80 bg-blue-500/25 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
                  <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                  {/* Header identity */}
                  <div className="flex items-center gap-4.5 z-10">
                    <div className="w-[52px] h-[52px] rounded-[18px] bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md shadow-inner transition-transform hover:scale-105 duration-300">
                      <Zap className="text-white w-6 h-6 fill-white" strokeWidth={1.5} />
                    </div>
                    <div className="flex items-center font-sans">
                      <span className="text-[26px] font-extrabold text-white leading-none tracking-wider antialiased">
                        ARYX
                      </span>
                      <span className="text-[26px] font-normal text-sky-400 leading-none tracking-wider ml-2.5 antialiased">
                        AI
                      </span>
                    </div>
                  </div>

                  {/* Pitch description */}
                  <div className="z-10 my-8 space-y-4">
                    <h1 className="text-3.5xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white font-display">
                      AI-Powered <br />
                      Career & Workforce <br />
                      Platform
                    </h1>
                    <p className="text-slate-200 text-sm max-w-sm font-medium leading-relaxed font-sans">
                      Find opportunities, build your career, and grow with AI.
                    </p>
                  </div>

                  {/* Highly polished robot & browser illustration vector artwork representation */}
                  <div className="relative z-10 w-full flex items-center justify-center overflow-hidden rounded-2xl p-1 bg-slate-950/20 border border-white/10 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800" className="w-full h-auto object-contain max-h-[300px]">
                      <defs>
                        {/* Soft Glow Filter for eyes */}
                        <filter id="eyeGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="5" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>

                        {/* Intense glow filter representing stars and lighting */}
                        <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="8" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>

                        {/* Browser Window Gradient */}
                        <linearGradient id="browserBg" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.95} />
                          <stop offset="100%" stopColor="#EEF2F6" stopOpacity={0.90} />
                        </linearGradient>

                        {/* Web Mockup Profile Photo Gradient */}
                        <linearGradient id="profileImgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1E40AF" />
                          <stop offset="100%" stopColor="#3B82F6" />
                        </linearGradient>

                        {/* Robot Face Screen Gradient */}
                        <linearGradient id="robotScreen" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#0B132B" />
                          <stop offset="100%" stopColor="#1C2541" />
                        </linearGradient>

                        {/* Sparkle/Star shape template */}
                        <g id="sparkleStar">
                          <path d="M 0,-24 Q 0,0 24,0 Q 0,0 0,24 Q 0,0 -24,0 Q 0,0 0,-24 Z" fill="#FFFFFF" filter="url(#starGlow)" />
                        </g>
                      </defs>

                      {/* ==================== BACKGROUND GRAPHICS ==================== */}
                      {/* Left Side Crescent Wave (Soft Accent) */}
                      <path d="M 60,350 C 60,250 140,200 240,200 C 200,300 130,420 180,500 C 130,500 60,450 60,350 Z" fill="#2563EB" opacity={0.15} />

                      {/* Main Dark Blue Backing Plate Wave (Matches second image's curved swoosh) */}
                      <path d="M 400,640 C 580,640 940,650 940,490 C 940,320 740,200 640,240 C 540,280 350,480 400,640 Z" fill="#061B6D" opacity={0.9} />
                      <path d="M 420,620 C 560,620 910,630 910,480 C 910,340 730,220 630,250 C 530,280 370,480 420,620 Z" fill="#0035D0" opacity={0.85} />

                      {/* Stars / Sparkles over/around the illustration */}
                      {/* Sparkle Top-Right of Robot */}
                      <use href="#sparkleStar" x="815" y="325" transform="scale(1.1)" />
                      {/* Sparkle Mid-Right of Robot */}
                      <use href="#sparkleStar" x="925" y="630" transform="scale(0.85)" />
                      {/* Sparkle Far-Left of Mockup */}
                      <use href="#sparkleStar" x="115" y="650" transform="scale(0.9)" />
                      
                      {/* Tiny glowing dot on the bottom-left */}
                      <circle cx={140} cy={800} r={6} fill="#60A5FA" filter="url(#eyeGlow)" />

                      {/* ==================== WEB SYSTEM WINDOW (LEFT SIDE) ==================== */}
                      <g transform="translate(196, 240)">
                        {/* High-end 3D drop shadow for window container */}
                        <rect x={5} y={15} width={510} height={440} rx={28} fill="#020922" opacity={0.32} />
                        
                        {/* Main Window Plate */}
                        <rect width={518} height={448} rx={28} fill="url(#browserBg)" stroke="#FFFFFF" strokeWidth={5} />
                        
                        {/* Header Separation Bar */}
                        <path d="M 2,48 L 516,48" stroke="#E2E8F0" strokeWidth={2.5} />
                        
                        {/* Window Controls (Grey/Blue metallic circles) */}
                        <circle cx={48} cy={24} r={8.5} fill="#CBD5E1" />
                        <circle cx={78} cy={24} r={8.5} fill="#CBD5E1" />
                        <circle cx={108} cy={24} r={8.5} fill="#CBD5E1" />

                        {/* Mock search placeholder bar on the right */}
                        <rect x={410} y={14} width={70} height={20} rx={10} fill="#E2E8F0" />

                        {/* Content Row 1: Profile image & placeholder lines */}
                        {/* Profile avatar box in modern bright blue */}
                        <rect x={48} y={85} width={100} height={100} rx={22} fill="url(#profileImgGrad)" />
                        
                        {/* Soft accent inner shape inside avatar box to simulate design */}
                        <circle cx={98} cy={135} r={30} fill="#FFFFFF" fillOpacity={0.15} />
                        <rect x={73} y={105} width={50} height={15} rx={5} fill="#FFFFFF" fillOpacity={0.2} />

                        {/* Dynamic text placeholder bars */}
                        <rect x={180} y={100} width={260} height={18} rx={9} fill="#94A3B8" opacity={0.5} />
                        <rect x={180} y={140} width={180} height={14} rx={7} fill="#CBD5E1" />

                        {/* Content Row 2: Selected Item Row / Checked Block */}
                        <rect x={48} y={240} width={422} height={120} rx={24} fill="#60A5FA" fillOpacity={0.12} stroke="#60A5FA" strokeWidth={2.5} />
                        
                        {/* Check Circle Badge */}
                        <circle cx={98} cy={300} r={26} fill="#3B82F6" />
                        <path d="M 86,300 L 94,308 L 110,290" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />

                        {/* Text line placements next to the checkbox */}
                        <rect x={156} y={275} width={200} height={18} rx={9} fill="#3B82F6" opacity={0.85} />
                        <rect x={156} y={312} width={130} height={14} rx={7} fill="#94A3B8" opacity={0.45} />
                      </g>

                      {/* ==================== CUTE ROBOT MASCOT (RIGHT SIDE) ==================== */}
                      <g transform="translate(565, 400)">
                        {/* Shadow beneath robot */}
                        <ellipse cx={150} cy={285} rx={120} ry={20} fill="#01071A" opacity={0.5} />

                        {/* Robot Left Arm (Waving towards screen in picture - Robot's right) */}
                        {/* White hand joint with smooth bezier curve */}
                        <path d="M 40,160 C -15,150 -45,110 -20,80 C -8,65 14,75 24,92 C 38,114 42,140 40,160 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth={2.5} />
                        {/* Blue glove waving friendly */}
                        <rect x="-38" y={65} width={46} height={46} rx={23} fill="#1D4ED8" stroke="#1E40AF" strokeWidth={2} />
                        <circle cx="-15" cy={88} r={8} fill="#FFFFFF" fillOpacity={0.1} />

                        {/* Robot Right Arm (Resting downwards) */}
                        <path d="M 245,170 C 290,185 315,225 310,260 C 305,295 265,305 245,275 C 235,255 235,200 245,170 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth={2.5} />

                        {/* Robot Body (Polished white gradient with soft lighting) */}
                        <rect x={60} y={145} width={180} height={145} rx={72.5} fill="#FFFFFF" stroke="#E2E8F0" strokeWidth={4} />
                        <rect x={60} y={145} width={180} height={145} rx={72.5} fill="none" stroke="#FFFFFF" strokeWidth={1.5} strokeDasharray="100 200" />

                        {/* Cute blue lightning badge on chest (Aryx brand reference!) */}
                        <path d="M 152,175 L 132,212 L 150,212 L 144,248 L 170,205 L 152,205 Z" fill="#2563EB" filter="url(#eyeGlow)" />

                        {/* Neck connector */}
                        <rect x={125} y={125} width={50} height={25} rx={10} fill="#D1D5DB" />

                        {/* Blue Earpieces / Headset attachments */}
                        <ellipse cx={46} cy={65} rx={14} ry={26} fill="#1D4ED8" />
                        <ellipse cx={254} cy={65} rx={14} ry={26} fill="#1D4ED8" />

                        {/* Head Core (Friendly rounded rectangle) */}
                        <rect x={50} y={-20} width={200} height={160} rx={80} fill="#FFFFFF" stroke="#E2E8F0" strokeWidth={4.5} />
                        <rect x={52} y={-18} width={196} height={156} rx={78} fill="none" stroke="#FFFFFF" strokeWidth={1.5} />

                        {/* Dark face visor screen */}
                        <rect x={68} y={2} width={164} height={116} rx={58} fill="url(#robotScreen)" />

                        {/* Friendly bright cyan glowing eyes (pill shapes) */}
                        <rect x={98} y={44} width={28} height={20} rx={10} fill="#00E5FF" filter="url(#eyeGlow)" />
                        <rect x={174} y={44} width={28} height={20} rx={10} fill="#00E5FF" filter="url(#eyeGlow)" />

                        {/* Visa highlight reflex spark */}
                        <path d="M 85,12 C 125,-2 175,-2 215,12" stroke="#FFFFFF" strokeOpacity={0.15} strokeWidth={7} fill="none" strokeLinecap="round" />

                        {/* Antenna stem */}
                        <rect x={146} y={-55} width={8} height={40} fill="#94A3B8" />
                        
                        {/* Blue glowing receiver bead on the top */}
                        <circle cx={150} cy={-60} r={11} fill="#1D4ED8" filter="url(#eyeGlow)" />
                        <circle cx={150} cy={-60} r={5} fill="#FFFFFF" />
                      </g>
                    </svg>
                  </div>

                </div>

                {/* Right Input details column */}
                <div className="md:col-span-7 p-6 sm:p-10 md:p-14 flex flex-col justify-center bg-white dark:bg-[#0f172a]">
                  <div className="max-w-md mx-auto w-full space-y-7">
                    
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-blue-400 uppercase tracking-widest pl-0.5">
                        secured access gateway
                      </span>
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-display">
                        Welcome Back
                      </h2>
                      <p className="text-xs text-slate-450 dark:text-slate-400 font-sans">
                        Please enter your platform credentials to log in to Aryx AI.
                      </p>
                    </div>

                    {/* Login form fields */}
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      
                      {/* Email Address */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-0.5 uppercase tracking-wider">Email Address</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                          <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. administrator@domain.com"
                            className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 rounded-xl py-3.5 pl-11 pr-4 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 dark:focus:ring-blue-500/10 focus:border-indigo-600 dark:focus:border-blue-500 transition-all duration-200 font-sans"
                          />
                        </div>
                      </div>

                      {/* Password input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-0.5 uppercase tracking-wider">Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                          <input 
                            type={showPassword ? "text" : "password"} 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 rounded-xl py-3.5 pl-11 pr-11 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 dark:focus:ring-blue-500/10 focus:border-indigo-600 dark:focus:border-blue-500 transition-all duration-200 font-sans"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 dark:hover:text-slate-200 transition-colors cursor-pointer border-0 bg-transparent"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Remember & Forgot row */}
                      <div className="flex items-center justify-between text-xs py-1.5">
                        <label className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 cursor-pointer pl-0.5 font-medium transition-colors hover:text-slate-700 dark:hover:text-slate-200">
                          <input 
                            type="checkbox" 
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded border-slate-350 dark:border-slate-850 text-indigo-600 focus:ring-indigo-500/20 w-4 h-4 cursor-pointer transition-all" 
                          />
                          <span className="select-none font-semibold text-slate-500 dark:text-slate-400">Keep me signed in</span>
                        </label>
                        <button 
                          type="button" 
                          className="text-indigo-600 dark:text-blue-400 font-extrabold hover:underline bg-transparent border-0 cursor-pointer text-xs"
                          onClick={() => {
                            setSuccessMsg("Simulated routing password reset guide to mailbox.");
                            setTimeout(() => setSuccessMsg(''), 4500);
                          }}
                        >
                          Forgot Password?
                        </button>
                      </div>

                      {error && (
                        <p className="text-red-500 text-xs font-bold bg-red-400/10 p-3 rounded-xl border border-red-500/20 shadow-sm animate-fadeIn">
                          {error}
                        </p>
                      )}

                      <button 
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl dark:shadow-indigo-950/25 hover:-translate-y-0.5 transition-all duration-200 text-xs uppercase tracking-widest cursor-pointer mt-4"
                      >
                        Sign In Securely
                      </button>

                    </form>

                    {/* Horizontal division or label */}
                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-slate-150 dark:border-slate-800"></div>
                      <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-[9px] font-black tracking-widest uppercase">new to the platform?</span>
                      <div className="flex-grow border-t border-slate-150 dark:border-slate-800"></div>
                    </div>

                    {/* Don't have an account create trigger */}
                    <div className="text-center font-sans">
                      <p className="text-xs text-slate-550 dark:text-slate-455">
                        Don't have an account?{' '}
                        <button 
                          onClick={() => { setIsLogin(false); setSignupStep(1); setError(''); }}
                          className="text-indigo-600 dark:text-blue-400 font-extrabold hover:underline bg-transparent border-0 cursor-pointer"
                        >
                          Create Account
                        </button>
                      </p>
                    </div>

                    {/* Terms policy statement */}
                    <p className="text-[10px] text-center text-slate-400 leading-relaxed max-w-xs mx-auto pt-4 pl-1 select-none font-sans">
                      By continuing, you agree to our <a href="#" className="underline hover:text-slate-600 dark:hover:text-blue-400">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600 dark:hover:text-blue-400">Privacy Policy</a>
                    </p>

                  </div>
                </div>
              </motion.div>
            ) : (
              // ===============================================
              // SIGNUP FLOOW DIAGRAM
              // ===============================================
              <div className="w-full">
                {/* STEP 1: CHOOSE MARKETPLACE ROLE (3 CARDS) */}
                {signupStep === 1 && (
                  <motion.div 
                    key="signup-select-3cards"
                    initial={{ opacity: 0, y: 30, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.99 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    className="max-w-5xl mx-auto bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-12 shadow-2xl relative"
                  >
                    {/* Header */}
                    <div className="text-center space-y-2 mb-10">
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-sky-400 uppercase tracking-widest bg-indigo-50 dark:bg-sky-500/10 px-3.5 py-1.5 rounded-full border border-indigo-100 dark:border-sky-500/10 inline-block font-sans select-none">
                        Get started with Aryx AI Marketplace
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-display">
                        Create Your Account
                      </h2>
                      <p className="text-xs text-slate-450 dark:text-slate-400 max-w-md mx-auto font-medium font-sans">
                        Choose your role to get started with Aryx AI Marketplace
                      </p>
                    </div>

                    {/* 3 Role Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
                      
                      {/* CARD 1: APPLICANT */}
                      <div className="border border-slate-150 dark:border-slate-800 hover:border-purple-500 rounded-2xl p-6 flex flex-col justify-between space-y-6 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-white dark:hover:bg-[#0A0E1A] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="space-y-4">
                          <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                            <User className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              Applicant
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-sans">
                              Find opportunities, build your profile, and apply to the best jobs.
                            </p>
                          </div>
                          <div className="space-y-2 pt-3 border-t border-slate-150 dark:border-slate-800">
                            {['Build Professional Profile', 'AI Job Matching', 'Apply to Top Jobs'].map((item, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                                <div className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setIndividualRole('candidate');
                            setSignupStep('2A_applicant');
                            setError('');
                          }}
                          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all"
                        >
                          Continue as Applicant →
                        </button>
                      </div>

                      {/* CARD 2: RECRUITER */}
                      <div className="border border-slate-150 dark:border-slate-800 hover:border-blue-500 rounded-2xl p-6 flex flex-col justify-between space-y-6 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-white dark:hover:bg-[#0A0E1A] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="space-y-4">
                          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            <Briefcase className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              Recruiter
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-sans">
                              Discover talent, manage candidates, and make successful placements.
                            </p>
                          </div>
                          <div className="space-y-2 pt-3 border-t border-slate-150 dark:border-slate-800">
                            {['Access Verified Candidates', 'Manage Submissions', 'Advanced Search & Filters'].map((item, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                                <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setIndividualRole('recruiter');
                            setSignupStep('2A_recruiter');
                            setError('');
                          }}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all"
                        >
                          Continue as Recruiter →
                        </button>
                      </div>

                      {/* CARD 3: BDM */}
                      <div className="border border-slate-150 dark:border-slate-800 hover:border-emerald-500 rounded-2xl p-6 flex flex-col justify-between space-y-6 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-white dark:hover:bg-[#0A0E1A] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="space-y-4">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                            <Building2 className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              BDM
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-sans">
                              Manage client relationships, job requirements, and drive growth.
                            </p>
                          </div>
                          <div className="space-y-2 pt-3 border-t border-slate-150 dark:border-slate-800">
                            {['Manage Client Companies', 'Post & Manage Jobs', 'Reports & Analytics'].map((item, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                                <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setIndividualRole('manager');
                            setSignupStep('2A_bdm');
                            setError('');
                          }}
                          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all"
                        >
                          Continue as BDM →
                        </button>
                      </div>

                    </div>

                    {/* Back to login footer */}
                    <div className="text-center pt-8 border-t border-slate-150 dark:border-slate-800 mt-6">
                      <p className="text-xs text-slate-500 font-medium">
                        Already have an account?{' '}
                        <button 
                          onClick={() => setIsLogin(true)}
                          className="text-blue-600 dark:text-blue-400 font-extrabold hover:underline bg-transparent border-0 cursor-pointer text-xs"
                        >
                          Sign In
                        </button>
                      </p>
                    </div>

                  </motion.div>
                )}

                {/* DEDICATED REGISTRATION PAGES FOR APPLICANT, RECRUITER & BDM */}
                {(signupStep === '2A_applicant' || signupStep === '2A_recruiter' || signupStep === '2A_bdm') && (
                  <motion.div 
                    key={`step-${signupStep}`}
                    initial={{ opacity: 0, y: 30, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.99 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    className="max-w-5xl mx-auto space-y-4"
                  >
                    {/* Back handle */}
                    <button 
                      onClick={() => setSignupStep(1)}
                      className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 bg-transparent border-0 cursor-pointer group transition-colors select-none pl-1"
                    >
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Role Selection
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white dark:bg-[#0f172a] border border-slate-150 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative">
                      
                      {/* Left Panel - Illustration & Role Hero */}
                      <div className={`lg:col-span-5 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border ${
                        signupStep === '2A_applicant' 
                          ? 'bg-gradient-to-br from-purple-50 via-purple-50/50 to-indigo-50/30 dark:from-purple-950/30 dark:to-indigo-950/20 border-purple-200/50 dark:border-purple-900/30 text-purple-950 dark:text-purple-100'
                          : signupStep === '2A_recruiter'
                          ? 'bg-gradient-to-br from-blue-50 via-blue-50/50 to-indigo-50/30 dark:from-blue-950/30 dark:to-indigo-950/20 border-blue-200/50 dark:border-blue-900/30 text-blue-950 dark:text-blue-100'
                          : 'bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-teal-50/30 dark:from-emerald-950/30 dark:to-teal-950/20 border-emerald-200/50 dark:border-emerald-900/30 text-emerald-950 dark:text-emerald-100'
                      }`}>
                        
                        <div className="space-y-3 z-10">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block ${
                            signupStep === '2A_applicant' ? 'bg-purple-600/10 text-purple-600 dark:text-purple-300' :
                            signupStep === '2A_recruiter' ? 'bg-blue-600/10 text-blue-600 dark:text-blue-300' :
                            'bg-emerald-600/10 text-emerald-600 dark:text-emerald-300'
                          }`}>
                            {signupStep === '2A_applicant' ? 'Candidate Portal' : signupStep === '2A_recruiter' ? 'Recruiter Hub' : 'BDM Workspace'}
                          </span>
                          <h3 className="text-2xl font-black font-display tracking-tight">
                            {signupStep === '2A_applicant' ? 'Join as Applicant' : signupStep === '2A_recruiter' ? 'Join as Recruiter' : 'Join as BDM'}
                          </h3>
                          <p className="text-xs font-medium leading-relaxed opacity-80">
                            {signupStep === '2A_applicant'
                              ? 'Create your profile and start applying to the best jobs that match your skills.'
                              : signupStep === '2A_recruiter'
                              ? 'Find the right talent and build successful teams for your clients.'
                              : 'Manage client relationships and drive business growth with powerful insights.'}
                          </p>
                        </div>

                        {/* High-quality SVG Vector Illustration */}
                        <div className="my-6 py-4 flex items-center justify-center">
                          {signupStep === '2A_applicant' && (
                            <svg viewBox="0 0 240 180" className="w-full max-w-[200px] h-auto drop-shadow-md">
                              <rect x="20" y="20" width="140" height="130" rx="16" fill="#8B5CF6" fillOpacity="0.1" stroke="#8B5CF6" strokeWidth="2" />
                              <rect x="35" y="35" width="110" height="15" rx="4" fill="#8B5CF6" />
                              <circle cx="50" cy="70" r="14" fill="#8B5CF6" fillOpacity="0.3" />
                              <rect x="72" y="62" width="60" height="8" rx="4" fill="#6D28D9" />
                              <rect x="72" y="74" width="45" height="6" rx="3" fill="#9333EA" fillOpacity="0.5" />
                              <rect x="35" y="98" width="110" height="35" rx="8" fill="#FFFFFF" stroke="#C4B5FD" strokeWidth="1.5" />
                              <circle cx="52" cy="115" r="8" fill="#10B981" />
                              <path d="M48 115l3 3 5-5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                              <rect x="68" y="111" width="65" height="8" rx="4" fill="#4C1D95" />
                              <g transform="translate(140, 60)">
                                <circle cx="40" cy="40" r="35" fill="#7C3AED" />
                                <circle cx="40" cy="30" r="12" fill="#F3E8FF" />
                                <path d="M20 62c0-11 9-20 20-20s20 9 20 20" fill="#F3E8FF" />
                              </g>
                            </svg>
                          )}
                          {signupStep === '2A_recruiter' && (
                            <svg viewBox="0 0 240 180" className="w-full max-w-[200px] h-auto drop-shadow-md">
                              <rect x="30" y="30" width="180" height="120" rx="16" fill="#3B82F6" fillOpacity="0.1" stroke="#3B82F6" strokeWidth="2" />
                              <rect x="50" y="50" width="65" height="80" rx="12" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
                              <circle cx="82.5" cy="75" r="12" fill="#2563EB" />
                              <rect x="62" y="95" width="41" height="6" rx="3" fill="#1E40AF" />
                              <rect x="67" y="105" width="31" height="5" rx="2.5" fill="#93C5FD" />
                              <rect x="125" y="50" width="65" height="80" rx="12" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
                              <circle cx="157.5" cy="75" r="12" fill="#3B82F6" />
                              <rect x="137" y="95" width="41" height="6" rx="3" fill="#1D4ED8" />
                              <rect x="142" y="105" width="31" height="5" rx="2.5" fill="#93C5FD" />
                              <path d="M95 100 Q 120 70 145 100" fill="none" stroke="#2563EB" strokeWidth="3" strokeDasharray="4 4" />
                            </svg>
                          )}
                          {signupStep === '2A_bdm' && (
                            <svg viewBox="0 0 240 180" className="w-full max-w-[200px] h-auto drop-shadow-md">
                              <rect x="25" y="25" width="190" height="130" rx="16" fill="#10B981" fillOpacity="0.1" stroke="#10B981" strokeWidth="2" />
                              <rect x="45" y="105" width="22" height="35" rx="4" fill="#059669" />
                              <rect x="75" y="85" width="22" height="55" rx="4" fill="#10B981" />
                              <rect x="105" y="65" width="22" height="75" rx="4" fill="#34D399" />
                              <rect x="135" y="45" width="22" height="95" rx="4" fill="#059669" />
                              <path d="M45 95 L 75 75 L 105 55 L 145 35 L 175 25" fill="none" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
                              <polygon points="175,25 165,25 175,35" fill="#047857" />
                            </svg>
                          )}
                        </div>

                        <div className="space-y-2 pt-4 border-t border-black/10 dark:border-white/10 text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span>Enterprise-Grade Security & Encryption</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span>Instant Access to Platform Tools</span>
                          </div>
                        </div>

                      </div>

                      {/* Right Panel - Form */}
                      <div className="lg:col-span-7 flex flex-col justify-center space-y-5 py-2">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                            {signupStep === '2A_applicant' ? 'Applicant Registration' : signupStep === '2A_recruiter' ? 'Recruiter Registration' : 'BDM Registration'}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium font-sans">
                            Fill in your details to create your account
                          </p>
                        </div>

                        <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                          {/* Full Name */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Full Name</label>
                            <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                              <input 
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-600 transition-all"
                              />
                            </div>
                          </div>

                          {/* Email Address */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</label>
                            <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                              <input 
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-600 transition-all"
                              />
                            </div>
                          </div>

                          {/* Phone Number */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Phone Number</label>
                            <div className="relative group">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                              <input 
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+1 (555) 000-0000"
                                className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-600 transition-all"
                              />
                            </div>
                          </div>

                          {/* Company Name for Recruiter / BDM */}
                          {(signupStep === '2A_recruiter' || signupStep === '2A_bdm') && (
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                {signupStep === '2A_recruiter' ? 'Company / Agency Name (Optional)' : 'Company Name'}
                              </label>
                              <div className="relative group">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                                <input 
                                  type="text"
                                  required={signupStep === '2A_bdm'}
                                  value={companyName}
                                  onChange={(e) => setCompanyName(e.target.value)}
                                  placeholder="e.g. Acme Corp"
                                  className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-600 transition-all"
                                />
                              </div>
                            </div>
                          )}

                          {/* Password */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Password</label>
                            <div className="relative group">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                              <input 
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-10 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-600 transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Confirm Password */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Confirm Password</label>
                            <div className="relative group">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
                              <input 
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-10 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-600 transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer"
                              >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Terms & Conditions Checkbox */}
                          <div className="flex items-center gap-2.5 pt-1">
                            <input 
                              type="checkbox"
                              id="terms-check"
                              checked={agreeTerms}
                              onChange={(e) => setAgreeTerms(e.target.checked)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 w-4 h-4 cursor-pointer"
                            />
                            <label htmlFor="terms-check" className="text-xs text-slate-500 dark:text-slate-400 font-medium cursor-pointer">
                              I agree to the <a href="#" className="text-blue-600 underline">Terms of Service</a> and <a href="#" className="text-blue-600 underline">Privacy Policy</a>
                            </label>
                          </div>

                          {error && (
                            <p className="text-red-500 text-xs font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                              {error}
                            </p>
                          )}

                          <button 
                            type="submit"
                            className={`w-full py-3.5 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all cursor-pointer mt-2 ${
                              signupStep === '2A_applicant' ? 'bg-purple-600 hover:bg-purple-700' :
                              signupStep === '2A_recruiter' ? 'bg-blue-600 hover:bg-blue-700' :
                              'bg-emerald-600 hover:bg-emerald-700'
                            }`}
                          >
                            {signupStep === '2A_applicant' ? 'Create Applicant Account' : signupStep === '2A_recruiter' ? 'Create Recruiter Account' : 'Create BDM Account'}
                          </button>
                        </form>

                        <div className="text-center pt-4 border-t border-slate-150 dark:border-slate-800">
                          <p className="text-xs text-slate-500 font-medium">
                            Already have an account?{' '}
                            <button 
                              onClick={() => setIsLogin(true)}
                              className="text-blue-600 dark:text-blue-400 font-bold hover:underline bg-transparent border-0 cursor-pointer"
                            >
                              Sign In
                            </button>
                          </p>
                        </div>

                      </div>

                    </div>
                  </motion.div>
                )}

                {/* STEP 2B: ORGANIZATION (UNIVERSITY AND COMPANY CO-SPONSORSHIPS) WITH RIGHT LEGEND SIDE PANEL */}
                {signupStep === '2B' && (
                  <motion.div 
                    key="step-2b"
                    initial={{ opacity: 0, y: 30, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.99 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                  >
                    
                    {/* Main Signup Form Column */}
                    <div className="lg:col-span-7 bg-white dark:bg-[#0f172a] border border-slate-150 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative">
                      
                      {/* Back handle */}
                      <button 
                        onClick={() => setSignupStep(1)}
                        className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-indigo-600 dark:hover:text-sky-400 bg-transparent border-0 mb-6 cursor-pointer group transition-colors select-none"
                      >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> BACK TO ROLE CHOICE
                      </button>

                      {/* Headline header with steps progress */}
                      <div className="flex justify-between items-center mb-6">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-indigo-600 dark:text-sky-455 uppercase tracking-widest pl-0.5 block">organizational setup</span>
                          <h2 className="text-2.5xl font-black text-slate-900 dark:text-white tracking-tight font-display text-left leading-none">
                            Organization Register
                          </h2>
                          <p className="text-xs text-slate-450 dark:text-slate-400 font-sans">
                            Create workspace for your {orgType === 'university' ? 'university or college' : 'company or enterprise'}.
                          </p>
                        </div>

                        {/* Pagination indicator badges matching design */}
                        <div className="flex items-center gap-2 select-none shrink-0">
                          <span className={`w-7 h-7 text-white flex items-center justify-center rounded-xl text-xs font-bold transition-all duration-300 ${
                            orgType === 'university' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-indigo-500/10' : 'bg-[#10B981] shadow-md shadow-emerald-500/10'
                          }`}>1</span>
                          <span className="w-4 h-[1px] bg-slate-200 dark:bg-slate-800" />
                          <span className="w-7 h-7 bg-slate-50 dark:bg-slate-950 text-slate-400 border border-slate-200 dark:border-slate-800 flex items-center justify-center rounded-xl text-xs font-bold">2</span>
                        </div>
                      </div>

                      {/* Tab pillars between university and company with identical look in design */}
                      <div className="grid grid-cols-2 gap-3.5 mb-6">
                        
                        {/* University tab pill button */}
                        <button
                          type="button"
                          onClick={() => setOrgType('university')}
                          className={`py-3 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                            orgType === 'university'
                              ? 'border-indigo-600 bg-indigo-50/10 dark:bg-sky-950/20 text-indigo-600 dark:text-sky-400 shadow-md shadow-indigo-500/5'
                              : 'border-slate-205 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 hover:text-slate-700 hover:bg-white dark:hover:bg-[#0f172a]'
                          }`}
                        >
                          <GraduationCap className="w-4.5 h-4.5" />
                          <span className="font-bold">University / College</span>
                        </button>

                        {/* Company tab pill button */}
                        <button
                          type="button"
                          onClick={() => setOrgType('company')}
                          className={`py-3 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                            orgType === 'company'
                              ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 text-[#10B981] shadow-md shadow-emerald-500/5'
                              : 'border-slate-205 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-905/45 text-slate-400 hover:text-slate-700 hover:bg-white dark:hover:bg-[#0f172a]'
                          }`}
                        >
                          <Building2 className="w-4.5 h-4.5" />
                          <span className="font-bold">Company / Enterprise</span>
                        </button>

                      </div>

                      {/* Form action */}
                      <form onSubmit={handleSignupSubmit} className="space-y-4">
                        
                        {/* Title input depending on Org mode selected */}
                        <div className="space-y-1 font-sans">
                          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-0.5 uppercase tracking-wider">
                            {orgType === 'university' ? 'University Official Name' : 'Company Brand Name'}
                          </label>
                          <div className="relative group">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-[10B981] transition-colors pointer-events-none" />
                            <input 
                              type="text" 
                              required
                              value={orgName}
                              onChange={(e) => setOrgName(e.target.value)}
                              placeholder={orgType === 'university' ? "e.g. Stanford University" : "e.g. Starfleet Logistics Inc."}
                              className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 rounded-xl py-3.5 pl-11 pr-4 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-emerald-500/10 focus:border-indigo-600 dark:focus:border-[#10B981] transition-all duration-200"
                            />
                          </div>
                        </div>

                        {/* Admin Name */}
                        <div className="space-y-1 font-sans">
                          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-0.5 uppercase tracking-wider">Workspace Administrator Full Name</label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-[#10B981] transition-colors pointer-events-none" />
                            <input 
                              type="text" 
                              required
                              value={adminName}
                              onChange={(e) => setAdminName(e.target.value)}
                              placeholder="e.g. Dr. Kathleen Vance"
                              className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-205 dark:border-slate-850 rounded-xl py-3.5 pl-11 pr-4 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-emerald-500/10 focus:border-indigo-600 dark:focus:border-[#10B981] transition-all duration-200"
                            />
                          </div>
                        </div>

                        {/* Official Email */}
                        <div className="space-y-1 font-sans">
                          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-0.5 uppercase tracking-wider">Official Corporate / Edu Address</label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-[#10B981] transition-colors pointer-events-none" />
                            <input 
                              type="email" 
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="e.g. administrator@stanford.edu"
                              className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-205 dark:border-slate-850 rounded-xl py-3.5 pl-11 pr-4 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-emerald-500/10 focus:border-indigo-600 dark:focus:border-[#10B981] transition-all duration-200"
                            />
                          </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-1 font-sans">
                          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-0.5 uppercase tracking-wider">Official Contact Line</label>
                          <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-[#10B981] transition-colors pointer-events-none" />
                            <input 
                              type="tel" 
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="e.g. +1 (650) 723-2300"
                              className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-205 dark:border-slate-850 rounded-xl py-3.5 pl-11 pr-4 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-emerald-500/10 focus:border-indigo-600 dark:focus:border-[#10B981] transition-all duration-200"
                            />
                          </div>
                        </div>

                        {/* Password Key */}
                        <div className="space-y-1 font-sans">
                          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-0.5 uppercase tracking-wider">Workspace Secret Password</label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-[#10B981] transition-colors pointer-events-none" />
                            <input 
                              type={showPassword ? "text" : "password"} 
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••••••"
                              className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-205 dark:border-slate-850 rounded-xl py-3.5 pl-11 pr-11 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-emerald-500/10 focus:border-indigo-600 dark:focus:border-[#10B981] transition-all duration-200"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 dark:hover:text-slate-200 transition-colors cursor-pointer border-0 bg-transparent"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Register submit triggers depending on colors selection */}
                        <button 
                          type="submit"
                          className={`w-full py-4 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-250 mt-6 cursor-pointer ${
                            orgType === 'university'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-indigo-505/20 shadow-indigo-550/5'
                              : 'bg-[#10B981] hover:bg-emerald-600 focus:ring-emerald-500/20 shadow-emerald-500/5'
                          }`}
                        >
                          Register Workspace Platform
                        </button>

                      </form>

                      {/* Bottom row link to go back */}
                      <p className="text-[10px] text-center text-slate-450 dark:text-slate-550 leading-relaxed max-w-sm mx-auto pt-5 select-none font-sans">
                        By continuing, you agree to our <a href="#" className="underline hover:text-indigo-600 dark:hover:text-[#10B981]">Terms of Service</a> and <a href="#" className="underline hover:text-indigo-600 dark:hover:text-[#10B981]">Privacy Policy</a>
                      </p>

                    </div>

                    {/* Right Explainer Panel Column on Organization Signup View (Direct Match with Mockup) */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      {/* Explainer wrapper card */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6.5 shadow-xl space-y-5">
                        
                        <h3 className="font-extrabold text-[11px] tracking-widest text-slate-450 dark:text-slate-500 uppercase">
                          After Registration
                        </h3>

                        <div className="space-y-5">
                          
                          {/* Item 1: University privileges */}
                          <div className="flex items-start gap-3.5">
                            <div className="w-9 h-9 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/30">
                              <GraduationCap className="w-4.5 h-4.5" />
                            </div>
                            <div className="text-[11.5px] space-y-0.5 leading-relaxed">
                              <h4 className="font-bold text-slate-900 dark:text-white">University Admin</h4>
                              <p className="text-slate-500 dark:text-slate-400 font-medium">
                                Can add Placement Officers, bulk upload students, manage jobs and analytics.
                              </p>
                            </div>
                          </div>

                          {/* Item 2: Company privileges */}
                          <div className="flex items-start gap-3.5">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/30">
                              <Building2 className="w-4.5 h-4.5" />
                            </div>
                            <div className="text-[11.5px] space-y-0.5 leading-relaxed">
                              <h4 className="font-bold text-slate-900 dark:text-white">Company Admin</h4>
                              <p className="text-slate-500 dark:text-slate-400 font-medium">
                                Can add Managers, Recruiters, bulk upload employees and manage jobs and analytics.
                              </p>
                            </div>
                          </div>

                          {/* Item 3: Individual privileges */}
                          <div className="flex items-start gap-3.5">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/30">
                              <Users className="w-4.5 h-4.5" />
                            </div>
                            <div className="text-[11.5px] space-y-0.5 leading-relaxed">
                              <h4 className="font-bold text-slate-900 dark:text-white">Individual Users</h4>
                              <p className="text-slate-500 dark:text-slate-400 font-medium font-medium">
                                Start using ARYX AI platform redirects you to the right dashboard after login.
                              </p>
                            </div>
                          </div>

                        </div>

                      </div>

                      {/* Shield verification disclaimer card */}
                      <div className="bg-blue-50/50 dark:bg-slate-900 border border-blue-100/40 dark:border-slate-800 rounded-2xl p-5 flex gap-3 text-xs leading-relaxed text-slate-500 select-none">
                        <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div className="text-[11px] leading-relaxed">
                          <span className="font-extrabold text-slate-900 dark:text-white block">Secure. Simple. Smart.</span>
                          ARYX AI automatically redirects you to the right dashboard after login.
                        </div>
                      </div>

                    </div>

                  </motion.div>
                )}

              </div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* FIXED FLOATING ECOSYSTEM DEMO QUICK ACCESS CONTROLLERS AT BOTTOM CORNER FOR DEV SANDBOX TESTING */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 pr-2">
        
        {showTester ? (
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-sm w-80 animate-fadeIn space-y-3 font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-sky-400 flex items-center gap-1">
                🧪 Ecosystem Tester Profile
              </span>
              <button 
                onClick={() => setShowTester(false)}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-650 dark:hover:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded"
              >
                Hide
              </button>
            </div>

            {/* Selector tabs */}
            <div className="grid grid-cols-4 gap-1">
              {(['marketplace', 'university', 'company', 'platform'] as const).map((eco) => (
                <button
                  key={eco}
                  onClick={() => {
                    setLoginEcosystem(eco);
                    const defaults: Record<string, UserRole> = {
                      marketplace: 'm_candidate',
                      university: 'u_student',
                      company: 'c_employee',
                      platform: 'platform_admin'
                    };
                    setLoginRole(defaults[eco]);
                  }}
                  className={`py-1 rounded text-[9px] font-bold uppercase tracking-wider ${
                    loginEcosystem === eco 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow' 
                      : 'text-slate-505 bg-slate-50 dark:bg-slate-950 text-slate-400 hover:text-slate-800'
                  }`}
                >
                  {eco.substring(0, 4)}
                </button>
              ))}
            </div>

            {/* List of sub-roles to trigger instantly */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {getRolesForEcosystem(loginEcosystem).map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setLoginRole(role.id as UserRole);
                    bypassLogin(role.id as UserRole);
                    onLogin(role.id as UserRole, true);
                    setSuccessMsg(`Bypassed login directly on ${role.label} profile!`);
                    setTimeout(() => setSuccessMsg(''), 4000);
                  }}
                  className="px-2 py-1 text-[10px] font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 hover:border-slate-300 dark:border-slate-800 border rounded text-indigo-600"
                >
                  {role.label} →
                </button>
              ))}
            </div>
            
            <p className="text-[9px] text-center text-slate-400 font-medium">
              Click any role to bypass authorization and instantly access its dashboard workspace.
            </p>
          </div>
        ) : (
          <button
            onClick={() => setShowTester(true)}
            className="px-3.5 py-2 bg-slate-900 border border-slate-750 text-white rounded-xl text-[10px] font-extrabold uppercase tracking-widest shadow-xl flex items-center gap-1 hover:scale-102 transition-transform cursor-pointer"
          >
            🧪 Option tester
          </button>
        )}
      </div>

      {/* Floating alert banner for quick notices */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-6 left-6 z-50 p-3.5 bg-emerald-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 max-w-sm text-xs"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
