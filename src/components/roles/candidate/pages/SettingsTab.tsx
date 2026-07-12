import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Lock, 
  Bell, 
  ShieldCheck, 
  Trash2, 
  CheckCircle2, 
  ChevronRight,
  User,
  Smartphone,
  Mail,
  HelpCircle,
  MessageSquare,
  AlertTriangle,
  Check
} from 'lucide-react';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';

export default function SettingsTab() {
  const { user, userProfile } = useAuth();
  const uid = user?.uid || userProfile?.uid;
  const [loading, setLoading] = useState(true);

  const [activeSubTab, setActiveSubTab] = useState('AccountSettings');

  // Account settings state
  const [fullName, setFullName] = useState('Rishi Kumar');
  const [email, setEmail] = useState('rishi.kumar@email.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification toggles state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [recomAlerts, setRecomAlerts] = useState(true);

  // Privacy checkboxes state
  const [searchableByRecruiters, setSearchableByRecruiters] = useState(true);
  const [showActiveStatus, setShowActiveStatus] = useState(true);
  const [autoHandshake, setAutoHandshake] = useState(false);

  // Delete account confirmation state
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteCheckbox, setDeleteCheckbox] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const [showSavedMsg, setShowSavedMsg] = useState(false);

  // Real-time Firestore Sync
  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'marketplace_jobseekers', uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const prof = data.profile || {};
        const sets = data.settings || {};

        setFullName(prof.fullName || data.fullName || 'Rishi Kumar');
        setEmail(prof.email || data.email || 'rishi.kumar@email.com');
        setPhone(prof.phone || prof.phoneNumber || data.phone || data.phoneNumber || '+91 98765 43210');

        setEmailAlerts(sets.emailNotifications !== undefined ? sets.emailNotifications : true);
        setPushAlerts(sets.pushAlerts !== undefined ? sets.pushAlerts : true);
        setSmsAlerts(sets.smsAlerts !== undefined ? sets.smsAlerts : false);
        setRecomAlerts(sets.recomAlerts !== undefined ? sets.recomAlerts : true);
        setSearchableByRecruiters(sets.searchableByRecruiters !== undefined ? sets.searchableByRecruiters : true);
        setShowActiveStatus(sets.showActiveStatus !== undefined ? sets.showActiveStatus : true);
        setAutoHandshake(sets.autoHandshake !== undefined ? sets.autoHandshake : false);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error subscribing to settings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  const updateSettingsInFirestore = async (overrideFields: any = {}) => {
    if (!uid) return;

    const currentEmailAlerts = overrideFields.emailNotifications !== undefined ? overrideFields.emailNotifications : emailAlerts;
    const currentPushAlerts = overrideFields.pushAlerts !== undefined ? overrideFields.pushAlerts : pushAlerts;
    const currentSmsAlerts = overrideFields.smsAlerts !== undefined ? overrideFields.smsAlerts : smsAlerts;
    const currentRecomAlerts = overrideFields.recomAlerts !== undefined ? overrideFields.recomAlerts : recomAlerts;
    const currentSearchable = overrideFields.searchableByRecruiters !== undefined ? overrideFields.searchableByRecruiters : searchableByRecruiters;
    const currentShowActive = overrideFields.showActiveStatus !== undefined ? overrideFields.showActiveStatus : showActiveStatus;
    const currentAutoHandshake = overrideFields.autoHandshake !== undefined ? overrideFields.autoHandshake : autoHandshake;

    try {
      const docRef = doc(db, 'marketplace_jobseekers', uid);
      await updateDoc(docRef, {
        settings: {
          emailNotifications: currentEmailAlerts,
          pushAlerts: currentPushAlerts,
          smsAlerts: currentSmsAlerts,
          recomAlerts: currentRecomAlerts,
          searchableByRecruiters: currentSearchable,
          showActiveStatus: currentShowActive,
          autoHandshake: currentAutoHandshake,
          updatedAt: new Date().toISOString()
        },
        activity: arrayUnion({
          id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          action: overrideFields.activityAction || 'Settings Updated',
          timestamp: new Date().toISOString(),
          details: overrideFields.activityDetails || 'Saved settings modifications'
        })
      });
    } catch (err) {
      console.error("Error updating settings:", err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return;

    try {
      const docRef = doc(db, 'marketplace_jobseekers', uid);
      await updateDoc(docRef, {
        fullName: fullName,
        email: email,
        phone: phone,
        'profile.fullName': fullName,
        'profile.email': email,
        'profile.phoneNumber': phone,
        'profile.phone': phone,
        'profile.updatedAt': new Date().toISOString(),
        activity: arrayUnion({
          id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          action: 'Profile Updated',
          timestamp: new Date().toISOString(),
          details: `Updated account primary contact details to ${fullName} (${email})`
        })
      });
      setShowSavedMsg(true);
      setTimeout(() => setShowSavedMsg(false), 2500);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error("Error saving account settings:", err);
    }
  };

  const handleDeleteAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deletePassword && deleteCheckbox) {
      setDeleteSuccess(true);
      setTimeout(() => {
        setDeleteSuccess(false);
        setDeletePassword('');
        setDeleteCheckbox(false);
        alert('Account deletion request queued (Simulated).');
      }, 2000);
    }
  };

  const tabs = [
    { id: 'AccountSettings', label: 'Account Settings', icon: User },
    { id: 'Security', label: 'Security & Password', icon: Lock },
    { id: 'Notifications', label: 'Notification Settings', icon: Bell },
    { id: 'Privacy', label: 'Privacy & Permissions', icon: ShieldCheck },
    { id: 'HelpAndSupport', label: 'Help & Support', icon: HelpCircle },
    { id: 'DeleteAccount', label: 'Delete Account', icon: Trash2, destructive: true }
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-app-muted font-mono">Loading your settings from Firestore...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Heading */}
      <div>
        <h1 className="text-3xl font-display font-bold text-app-text tracking-tight">Settings</h1>
        <p className="text-app-muted text-sm mt-1">Configure your personal preferences, security keys, and alert toggles.</p>
      </div>

      <AnimatePresence>
        {showSavedMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-xs flex items-center gap-2 shadow-sm"
          >
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /> Settings changes saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Settings categories navigation list (Left Column) */}
        <div className="lg:col-span-4 space-y-2">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setActiveSubTab(tb.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl text-left text-xs font-bold border transition-all cursor-pointer ${
                activeSubTab === tb.id
                  ? 'bg-brand-blue border-brand-blue text-white shadow-md shadow-brand-blue/15'
                  : tb.destructive 
                    ? 'bg-red-500/5 hover:bg-red-500/10 border-red-500/10 text-red-500'
                    : 'bg-app-surface border-app-border text-app-muted hover:text-app-text'
              }`}
            >
              <div className="flex items-center gap-3">
                <tb.icon className="w-4.5 h-4.5 shrink-0" />
                <span>{tb.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          ))}
        </div>

        {/* Content detail form configurations (Right Column) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-[28px] bg-app-surface border border-app-border card-shadow h-fit space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              
              {/* CATEGORY 1: Account Settings */}
              {activeSubTab === 'AccountSettings' && (
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-app-text">Account Settings</h2>
                    <p className="text-xs text-app-muted mt-0.5">Primary information used to communicate with hirers.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Full Name</label>
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Phone Number</label>
                      <input 
                        type="text" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-app-border/40">
                    <button type="submit" className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs rounded-xl shadow-md uppercase tracking-wide cursor-pointer transition">
                      Save Account Details
                    </button>
                  </div>
                </form>
              )}

              {/* CATEGORY 2: Security & Credentials */}
              {activeSubTab === 'Security' && (
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-app-text">Security & Credentials</h2>
                    <p className="text-xs text-app-muted mt-0.5">Ensure your account is protected with a secure password.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Current Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">New Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Confirm New Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-app-border/40">
                    <button type="submit" className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs rounded-xl shadow-md uppercase tracking-wide cursor-pointer transition">
                      Update Password
                    </button>
                  </div>
                </form>
              )}

              {/* CATEGORY 3: Notification Settings with interactive toggle switches */}
              {activeSubTab === 'Notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-app-text">Notification Settings</h2>
                    <p className="text-xs text-app-muted mt-0.5">Control how and when you receive matching updates and communication alerts.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Switch 1 */}
                    <div className="p-4 rounded-2xl bg-app-bg border border-app-border flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-black text-app-text">Email Notifications</h4>
                        <p className="text-[10px] text-app-muted mt-0.5">Receive digests of assigned recruiters and application reviews.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          const val = !emailAlerts;
                          setEmailAlerts(val);
                          updateSettingsInFirestore({ emailNotifications: val, activityAction: 'Settings Updated', activityDetails: 'Updated email notifications preference' });
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emailAlerts ? 'bg-brand-blue' : 'bg-neutral-800'}`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emailAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Switch 2 */}
                    <div className="p-4 rounded-2xl bg-app-bg border border-app-border flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-black text-app-text">Push App Alerts</h4>
                        <p className="text-[10px] text-app-muted mt-0.5">Instant popup notifications in the browser for message exchanges.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          const val = !pushAlerts;
                          setPushAlerts(val);
                          updateSettingsInFirestore({ pushAlerts: val, activityAction: 'Settings Updated', activityDetails: 'Updated push notifications preference' });
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${pushAlerts ? 'bg-brand-blue' : 'bg-neutral-800'}`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${pushAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Switch 3 */}
                    <div className="p-4 rounded-2xl bg-app-bg border border-app-border flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-black text-app-text">SMS Text Advisories</h4>
                        <p className="text-[10px] text-app-muted mt-0.5">Important high-urgency notifications directly via text messages.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          const val = !smsAlerts;
                          setSmsAlerts(val);
                          updateSettingsInFirestore({ smsAlerts: val, activityAction: 'Settings Updated', activityDetails: 'Updated SMS alerts preference' });
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${smsAlerts ? 'bg-brand-blue' : 'bg-neutral-800'}`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${smsAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Switch 4 */}
                    <div className="p-4 rounded-2xl bg-app-bg border border-app-border flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-black text-app-text">AI Recommendation Blasts</h4>
                        <p className="text-[10px] text-app-muted mt-0.5">Bi-weekly matching evaluations curated by the AI engine.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          const val = !recomAlerts;
                          setRecomAlerts(val);
                          updateSettingsInFirestore({ recomAlerts: val, activityAction: 'Settings Updated', activityDetails: 'Updated AI recommendation notifications preference' });
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${recomAlerts ? 'bg-brand-blue' : 'bg-neutral-800'}`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${recomAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORY 4: Privacy & Permissions */}
              {activeSubTab === 'Privacy' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-app-text">Privacy & Permissions</h2>
                    <p className="text-xs text-app-muted mt-0.5">Control who can discover your application index details.</p>
                  </div>

                  <div className="space-y-4 text-xs font-bold text-app-muted">
                    
                    <label className="p-4 rounded-2xl bg-app-bg border border-app-border flex items-start gap-3.5 cursor-pointer hover:border-brand-blue/30 transition-all select-none">
                      <input 
                        type="checkbox" 
                        checked={searchableByRecruiters}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setSearchableByRecruiters(val);
                          updateSettingsInFirestore({ searchableByRecruiters: val, activityAction: 'Privacy Updated', activityDetails: `Set discoverability to ${val ? 'public' : 'private'}` });
                        }}
                        className="mt-0.5 rounded border-app-border text-brand-blue focus:ring-brand-blue bg-app-surface w-4 h-4 cursor-pointer" 
                      />
                      <div>
                        <span className="text-app-text font-black block">Discoverable by Recruiter Networks</span>
                        <span className="text-[10px] font-semibold block mt-0.5 leading-relaxed">Let recruiters find your Profile and Resume builder instance directly in their search console.</span>
                      </div>
                    </label>

                    <label className="p-4 rounded-2xl bg-app-bg border border-app-border flex items-start gap-3.5 cursor-pointer hover:border-brand-blue/30 transition-all select-none">
                      <input 
                        type="checkbox" 
                        checked={showActiveStatus}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setShowActiveStatus(val);
                          updateSettingsInFirestore({ showActiveStatus: val, activityAction: 'Privacy Updated', activityDetails: `Set active status broadcast to ${val ? 'enabled' : 'disabled'}` });
                        }}
                        className="mt-0.5 rounded border-app-border text-brand-blue focus:ring-brand-blue bg-app-surface w-4 h-4 cursor-pointer" 
                      />
                      <div>
                        <span className="text-app-text font-black block">Broadcast Active Status</span>
                        <span className="text-[10px] font-semibold block mt-0.5 leading-relaxed">Display a real-time active indicators to BDM and recruiter stakeholders.</span>
                      </div>
                    </label>

                    <label className="p-4 rounded-2xl bg-app-bg border border-app-border flex items-start gap-3.5 cursor-pointer hover:border-brand-blue/30 transition-all select-none">
                      <input 
                        type="checkbox" 
                        checked={autoHandshake}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setAutoHandshake(val);
                          updateSettingsInFirestore({ autoHandshake: val, activityAction: 'Privacy Updated', activityDetails: `Set auto-accept handshakes to ${val ? 'enabled' : 'disabled'}` });
                        }}
                        className="mt-0.5 rounded border-app-border text-brand-blue focus:ring-brand-blue bg-app-surface w-4 h-4 cursor-pointer" 
                      />
                      <div>
                        <span className="text-app-text font-black block">Auto-accept Assigned Handshakes</span>
                        <span className="text-[10px] font-semibold block mt-0.5 leading-relaxed">Automatically accept recommended handshake requests immediately upon match creation.</span>
                      </div>
                    </label>

                  </div>
                </div>
              )}

              {/* CATEGORY 5: Help & Support (Added navigation category) */}
              {activeSubTab === 'HelpAndSupport' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-app-text">Help & Support</h2>
                    <p className="text-xs text-app-muted mt-0.5">Need assistance? Access our quick support portal or chat directly with our response agents.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Live Chat Card */}
                    <div className="p-5 rounded-2xl border border-dashed border-indigo-500/30 bg-indigo-500/5 flex flex-col justify-between h-44 relative overflow-hidden">
                      <div className="absolute right-0 bottom-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                      <div>
                        <div className="flex justify-between items-center">
                          <MessageSquare className="w-6 h-6 text-indigo-400" />
                          <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/15 border border-indigo-500/20 px-2.5 py-0.5 rounded-lg">Coming Soon</span>
                        </div>
                        <h3 className="text-xs font-black text-app-text mt-4">Live Chat Sourcing Assistance</h3>
                        <p className="text-[10px] text-app-muted mt-1 leading-relaxed">Chat directly in real-time with an expert ARYX AI career counselor.</p>
                      </div>
                      <button disabled className="w-full py-2.5 bg-indigo-500/20 text-indigo-400 font-extrabold text-[10px] rounded-xl cursor-not-allowed">
                        Coming Soon
                      </button>
                    </div>

                    {/* Documentation / Help Card */}
                    <div className="p-5 rounded-2xl border border-app-border bg-app-bg flex flex-col justify-between h-44">
                      <div>
                        <HelpCircle className="w-6 h-6 text-brand-blue" />
                        <h3 className="text-xs font-black text-app-text mt-4">Comprehensive Guidebook</h3>
                        <p className="text-[10px] text-app-muted mt-1 leading-relaxed">Read detailed guidelines and FAQs about matchmaking, handshakes, and reviews.</p>
                      </div>
                      <button className="w-full py-2.5 bg-brand-blue text-white font-extrabold text-[10px] rounded-xl hover:bg-brand-blue/90 transition cursor-pointer">
                        Browse Knowledge Base
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* CATEGORY 6: Delete Account (Fleshed out with validation fields) */}
              {activeSubTab === 'DeleteAccount' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-red-500">Delete Account Permanently</h2>
                    <p className="text-xs text-app-muted mt-0.5">Initiate irreversible deletion of your entire candidate database profile.</p>
                  </div>

                  {deleteSuccess ? (
                    <div className="py-8 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto text-red-500">
                        <AlertTriangle className="w-6 h-6 animate-bounce" />
                      </div>
                      <h4 className="text-sm font-bold text-app-text">Permanent Deletion Requested</h4>
                      <p className="text-xs text-app-muted">Your database credentials have been queued for purge cycle.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleDeleteAccountSubmit} className="space-y-6">
                      
                      {/* Warning box */}
                      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-3 text-xs leading-relaxed text-red-500 font-bold">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-400 font-black">WARNING: CRITICAL IRREVERSIBLE OPERATION</p>
                          <p className="text-[10px] font-semibold text-red-400/80 mt-1 leading-relaxed">
                            Deleting your account completely removes your Resume builder documents, active applications history, and handshake approvals from ARYX AI. This action cannot be undone.
                          </p>
                        </div>
                      </div>

                      {/* Password validation input */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Verify Account Password</label>
                        <input 
                          type="password" 
                          placeholder="Type your current password to confirm"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-red-500 focus:outline-none focus:border-red-500 transition-all"
                          required
                        />
                      </div>

                      {/* Confirmation Checkbox */}
                      <label className="p-4 rounded-2xl bg-app-bg border border-app-border flex items-start gap-3 cursor-pointer select-none hover:border-red-500/30 transition-colors">
                        <input 
                          type="checkbox"
                          checked={deleteCheckbox}
                          onChange={(e) => setDeleteCheckbox(e.target.checked)}
                          className="mt-0.5 rounded border-app-border text-red-500 focus:ring-red-500 bg-app-surface w-4 h-4 cursor-pointer"
                        />
                        <div className="text-[10px] font-semibold text-app-muted leading-relaxed">
                          <span className="text-app-text font-black block">I agree to permanent data deletion</span>
                          I understand that this action is absolutely permanent and my matching history, profiles, and verified metrics will be completely unrecoverable.
                        </div>
                      </label>

                      {/* Confirm button */}
                      <div className="flex justify-end pt-4 border-t border-app-border/40">
                        <button
                          type="submit"
                          disabled={!deletePassword || !deleteCheckbox}
                          className={`px-5 py-2.5 font-bold text-xs rounded-xl shadow-md uppercase tracking-wide transition-all ${
                            (deletePassword && deleteCheckbox)
                              ? 'bg-red-500 hover:bg-red-600 text-white cursor-pointer active:scale-95'
                              : 'bg-neutral-800 text-app-muted cursor-not-allowed opacity-60'
                          }`}
                        >
                          Permanently Delete Account
                        </button>
                      </div>

                    </form>
                  )}

                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
