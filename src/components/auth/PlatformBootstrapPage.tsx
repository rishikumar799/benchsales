import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase';
import { UserRole } from '../../types';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

interface PlatformBootstrapPageProps {
  onBack: () => void;
  onSuccess: (role: UserRole) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function PlatformBootstrapPage({ onBack, onSuccess, theme, toggleTheme }: PlatformBootstrapPageProps) {
  // Check environment variables
  const isEnabled = import.meta.env.VITE_ENABLE_PLATFORM_BOOTSTRAP === 'true';
  const bootstrapSecretKey = import.meta.env.VITE_PLATFORM_BOOTSTRAP_KEY || '';

  const [setupKey, setSetupKey] = useState('');
  const [isKeyVerified, setIsKeyVerified] = useState(false);
  const [checkingDb, setCheckingDb] = useState(true);
  const [adminExists, setAdminExists] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. One-time initialization check
  useEffect(() => {
    if (!isEnabled) {
      setCheckingDb(false);
      return;
    }

    async function checkExistingPlatformAdmin() {
      try {
        const q = query(
          collection(db, 'users'), 
          where('role', '==', 'platform_admin')
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setAdminExists(true);
        }
      } catch (err: any) {
        if (err?.message?.includes('permission') || err?.code === 'permission-denied') {
          console.warn('Unauthenticated check for platform admin was rejected (this is normal when security rules are locked):', err);
        } else {
          console.warn('Non-fatal error checking platform admin existence:', err);
        }
      } finally {
        setCheckingDb(false);
      }
    }

    checkExistingPlatformAdmin();
  }, [isEnabled]);

  // 2. Validate setup key
  const handleVerifyKey = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!bootstrapSecretKey) {
      setError('System environment key VITE_PLATFORM_BOOTSTRAP_KEY is not configured on the server.');
      return;
    }

    if (setupKey === bootstrapSecretKey) {
      setIsKeyVerified(true);
    } else {
      setError('Invalid Setup Key. Please check your environment configuration.');
    }
  };

  // 3. Signup submission
  const handleBootstrapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!fullName.trim() || !email.trim() || !password || !phone.trim()) {
      setError('Please fill in all the required fields.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      // Create user in Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      
      const profileData = {
        uid: user.uid,
        fullName: fullName.trim(),
        displayName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phoneNumber: phone.trim(),
        role: 'platform_admin',
        ecosystem: 'platform',
        accountType: 'individual',
        organizationType: 'platform',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Save user profile to users collection
      await setDoc(userDocRef, profileData);

      setSuccessMsg('Platform Admin successfully bootstrapped!');
      setLoading(false);
      
      // Delay slightly and trigger login / redirect
      setTimeout(() => {
        onSuccess('platform_admin');
      }, 1500);

    } catch (err: any) {
      console.error('Error during platform admin bootstrapping:', err);
      setError(err?.message || 'Bootstrap failed. Please try again.');
      setLoading(false);
    }
  };

  // Production Safety check
  if (!isEnabled) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="text-red-600 dark:text-red-400 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Bootstrap Disabled</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
            The platform admin bootstrap system is disabled for production safety. Set <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">VITE_ENABLE_PLATFORM_BOOTSTRAP=true</code> in your environment to enable.
          </p>
          <button 
            onClick={onBack}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm rounded-xl cursor-pointer transition-all"
          >
            Back to Safety
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection-none relative font-sans overflow-x-hidden">
      
      {/* Top action row */}
      <div className="absolute top-6 right-6 z-40 flex items-center gap-4">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <button 
          onClick={onBack}
          className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm transition-all"
        >
          Back to Safety
        </button>
      </div>

      <div className="flex-1 w-full flex items-center justify-center p-3 sm:p-6 md:p-8 lg:p-12 py-20">
        <div className="w-full max-w-md mx-auto">
          
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mb-3 shadow-lg">
              <Zap className="text-white w-6 h-6 fill-white" />
            </div>
            <div className="flex items-center text-center">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-wider">
                ARYX
              </span>
              <span className="text-2xl font-normal text-indigo-600 dark:text-indigo-400 tracking-wider ml-1">
                AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
              System Bootstrap Configuration
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative">
            {checkingDb ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
                <p className="text-xs text-slate-500 font-semibold animate-pulse">
                  Checking initialization status...
                </p>
              </div>
            ) : adminExists ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="text-amber-600 dark:text-amber-400 w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold mb-2">Platform Admin Already Initialized</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6">
                  One-time platform admin initialization has already been completed. No additional administrators can be created via this route for security.
                </p>
                <button 
                  onClick={onBack}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl cursor-pointer transition-all"
                >
                  Proceed to Login
                </button>
              </div>
            ) : !isKeyVerified ? (
              // STEP 1: VERIFY SETUP KEY
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold">Verify Setup Key</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Please provide the system secret bootstrap key defined in your server configuration to unlock admin registration.
                  </p>
                </div>

                {error && (
                  <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyKey} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider block uppercase">
                      Setup Secret Key
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input 
                        type="password" 
                        required
                        value={setupKey}
                        onChange={(e) => setSetupKey(e.target.value)}
                        placeholder="•••••••••••••••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl cursor-pointer shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Verify Key & Unlock
                  </button>
                </form>
              </motion.div>
            ) : (
              // STEP 2: REGISTRATION FORM
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold">Register Platform Admin</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Complete this one-time secure profile setup. Once registered, this screen will lock forever.
                  </p>
                </div>

                {error && (
                  <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3.5 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleBootstrapSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider block uppercase">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider block uppercase">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@aryxai.com"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider block uppercase">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 019-2834"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider block uppercase">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl cursor-pointer shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Initializing Admin...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Complete Secure Bootstrap
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </div>

        </div>
      </div>

      <div className="py-6 text-center text-[10px] text-slate-400">
        © {new Date().getFullYear()} ARYX AI Technologies. Strictly Confidential.
      </div>
    </div>
  );
}
