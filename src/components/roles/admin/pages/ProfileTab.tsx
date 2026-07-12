import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  ShieldCheck, 
  CheckCircle,
  Settings,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { db } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';
import { 
  doc, 
  onSnapshot, 
  updateDoc 
} from 'firebase/firestore';

export default function ProfileTab() {
  const { userProfile } = useAuth();
  const organizationId = userProfile?.organizationId;

  // University values
  const [univCode, setUnivCode] = useState('SXU2026');
  const [address, setAddress] = useState('5, Mahapalika Marg, Mumbai, Maharashtra 400001');
  const [univEmail, setUnivEmail] = useState('info@sxu.edu.in');
  const [phone, setPhone] = useState('+91 22 1234 5678');
  const [website, setWebsite] = useState('www.sxu.edu.in');

  // Admin info
  const [adminName, setAdminName] = useState('Dr. Sandeep Jain');
  const [designation, setDesignation] = useState('University Administrator');
  const [adminEmail, setAdminEmail] = useState('admin@sxu.edu.in');
  const [adminPhone, setAdminPhone] = useState('+91 98123 45678');
  const [dept, setDept] = useState('Administration');

  // Preferences toggles
  const [deadline, setDeadline] = useState('7 Days');
  const [resumeVisible, setResumeVisible] = useState(true);
  const [multiApply, setMultiApply] = useState(true);
  const [emailNotify, setEmailNotify] = useState(true);

  const [isEditing, setIsEditing] = useState(false);

  // Real-time Firestore Sync
  useEffect(() => {
    if (!organizationId) return;

    const docRef = doc(db, 'organizations_universities', organizationId);
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.univCode !== undefined) setUnivCode(data.univCode);
        if (data.address !== undefined) setAddress(data.address);
        if (data.univEmail !== undefined) setUnivEmail(data.univEmail);
        if (data.phone !== undefined) setPhone(data.phone);
        if (data.website !== undefined) setWebsite(data.website);

        if (data.adminName !== undefined) setAdminName(data.adminName);
        if (data.designation !== undefined) setDesignation(data.designation);
        if (data.adminEmail !== undefined) setAdminEmail(data.adminEmail);
        if (data.adminPhone !== undefined) setAdminPhone(data.adminPhone);
        if (data.dept !== undefined) setDept(data.dept);

        if (data.deadline !== undefined) setDeadline(data.deadline);
        if (data.resumeVisible !== undefined) setResumeVisible(data.resumeVisible);
        if (data.multiApply !== undefined) setMultiApply(data.multiApply);
        if (data.emailNotify !== undefined) setEmailNotify(data.emailNotify);
      }
    });

    return () => unsub();
  }, [organizationId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId) return;

    const docRef = doc(db, 'organizations_universities', organizationId);
    await updateDoc(docRef, {
      univCode,
      address,
      univEmail,
      phone,
      website,
      adminName,
      designation,
      adminEmail,
      adminPhone,
      dept
    });

    setIsEditing(false);
    alert('✓ institutional configuration & administrator credentials updated successfully in Firestore.');
  };

  const handleTogglePreference = async (key: string, value: any) => {
    if (!organizationId) return;
    const docRef = doc(db, 'organizations_universities', organizationId);
    await updateDoc(docRef, { [key]: value });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-black text-app-text tracking-tight h-10 flex items-center">Profile</h2>
        <p className="text-xs text-app-muted font-bold mt-1">Manage institutional credentials, administrator contact cards, and deployment rules.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* University Information (Left Card) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-[32px] bg-app-surface/60 border border-app-border card-shadow space-y-6">
            <h3 className="text-md font-display font-black text-app-text flex items-center gap-2 border-b border-app-border/40 pb-3">
              <Building2 className="w-5 h-5 text-brand-blue" />
              University Information
            </h3>

            {/* University Shield Emblem representation */}
            <div className="flex items-center gap-4 bg-app-bg/50 p-4 rounded-2xl border border-app-border">
              <div className="w-12 h-12 bg-gradient-to-tr from-brand-blue to-brand-violet rounded-xl flex items-center justify-center text-white font-black text-lg">
                {(userProfile?.organizationName || 'SXU').substring(0, 3).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-extrabold text-app-text">{userProfile?.organizationName || "St. Xavier's University"}</div>
                <span className="text-[10px] text-emerald-500 font-bold block mt-0.5">✓ Vetted University Registrar Unit</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Univ Code */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">University Code</span>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={univCode}
                  onChange={(e) => setUnivCode(e.target.value)}
                  className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-brand-blue disabled:opacity-75"
                />
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Postal Address</span>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-app-muted" />
                  <textarea 
                    rows={2}
                    disabled={!isEditing}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 pl-11 pr-3.5 text-xs font-semibold focus:outline-none focus:border-brand-blue disabled:opacity-75 resize-none"
                  />
                </div>
              </div>

              {/* Email / Phone grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase block">E-mail Registry</span>
                  <div className="relative">
                     <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                    <input 
                      type="email" 
                      disabled={!isEditing}
                      value={univEmail}
                      onChange={(e) => setUnivEmail(e.target.value)}
                      className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 pl-11 pr-3.5 text-xs font-semibold focus:outline-none focus:border-brand-blue disabled:opacity-75"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase block">Registrar Phone</span>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 pl-11 pr-3.5 text-xs font-semibold focus:outline-none focus:border-brand-blue disabled:opacity-75"
                    />
                  </div>
                </div>
              </div>

              {/* Website */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold text-app-muted uppercase block">Portal Web Link</span>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 pl-11 pr-3.5 text-xs font-semibold focus:outline-none focus:border-brand-blue disabled:opacity-75"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Administrator Information (Right Card) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-[32px] bg-app-surface/60 border border-app-border card-shadow space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-md font-display font-black text-app-text flex items-center gap-2 border-b border-app-border/40 pb-3">
                <User className="w-5 h-5 text-brand-blue" />
                Administrator Information
              </h3>

              {/* Headshot and status info */}
              <div className="flex items-center gap-4">
                <img 
                  src={`https://picsum.photos/seed/${adminName.replace(/\s+/g, '')}/100/100`}
                  alt={adminName} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-app-border shrink-0 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-sm font-black text-app-text">{adminName}</div>
                  <div className="text-[10px] text-app-muted font-bold block">Placement Super Admin Coordinator</div>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase block">Professional Name</span>
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-brand-blue disabled:opacity-75"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-app-muted uppercase block">Designation</span>
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-brand-blue disabled:opacity-75"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-app-muted uppercase block">Assigned Cell</span>
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={dept}
                      onChange={(e) => setDept(e.target.value)}
                      className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-brand-blue disabled:opacity-75"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-app-muted uppercase block">E-mail contact</span>
                    <input 
                      type="email" 
                      required
                      disabled={!isEditing}
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none disabled:opacity-75"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-app-muted uppercase block">Secure Hotline</span>
                    <input 
                      type="text" 
                      required
                      disabled={!isEditing}
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none disabled:opacity-75"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Editing / Save triggers */}
            <div className="pt-6 border-t border-app-border/40 mt-4 flex justify-end gap-3">
              {isEditing ? (
                <>
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-app-border rounded-xl text-xs font-bold text-app-muted hover:bg-app-bg hover:text-app-text transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-brand-blue/10 transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button 
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-brand-blue/10 transition-all cursor-pointer"
                >
                  Edit Profile Information
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Card Area: Placement Preferences (Rules & Constraints togglers) */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-app-surface/60 border border-app-border card-shadow space-y-6">
          <h3 className="text-md font-display font-black text-app-text flex items-center gap-2 border-b border-app-border/40 pb-3">
            <Settings className="w-5 h-5 text-brand-violet" />
            Placement Preferences & Global Constraints
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Setting 1: Default deadline */}
            <div className="flex justify-between items-center bg-app-bg/40 p-4 rounded-2xl border border-app-border/60 hover:border-brand-violet/20 transition-all">
              <div>
                <div className="text-xs font-extrabold text-app-text">Default Application Deadline</div>
                <div className="text-[10px] text-app-muted font-bold mt-0.5">Sourcing opportunities automatically close after selection</div>
              </div>
              <select 
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  handleTogglePreference('deadline', e.target.value);
                }}
                className="bg-app-bg border border-app-border text-xs font-extrabold py-2 px-3 rounded-lg text-brand-blue focus:outline-none cursor-pointer"
              >
                <option value="3 Days">3 Days</option>
                <option value="5 Days">5 Days</option>
                <option value="7 Days">7 Days</option>
                <option value="10 Days">10 Days</option>
                <option value="14 Days">14 Days</option>
              </select>
            </div>

            {/* Setting 2: Resume Visibility to officers */}
            <div className="flex justify-between items-center bg-app-bg/40 p-4 rounded-2xl border border-app-border/60 hover:border-brand-violet/20 transition-all">
              <div>
                <div className="text-xs font-extrabold text-app-text">Resume Visibility</div>
                <div className="text-[10px] text-app-muted font-bold mt-0.5">Allow corporate evaluators direct verified downloads</div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  const newVal = !resumeVisible;
                  setResumeVisible(newVal);
                  handleTogglePreference('resumeVisible', newVal);
                }}
                className={`relative w-12 h-6 rounded-full transition-all flex items-center cursor-pointer ${
                  resumeVisible ? 'bg-brand-violet' : 'bg-app-surface border border-app-border'
                }`}
              >
                <span className={`w-4 h-4 rounded-full bg-white shadow-sm flex transition-all ${
                  resumeVisible ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Setting 3: Allow Dual applications */}
            <div className="flex justify-between items-center bg-app-bg/40 p-4 rounded-2xl border border-app-border/60 hover:border-brand-violet/20 transition-all">
              <div>
                <div className="text-xs font-extrabold text-app-text">Allow Students to Apply Multiple Opportunities</div>
                <div className="text-[10px] text-app-muted font-bold mt-0.5">Even after final sector drive endorsement</div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  const newVal = !multiApply;
                  setMultiApply(newVal);
                  handleTogglePreference('multiApply', newVal);
                }}
                className={`relative w-12 h-6 rounded-full transition-all flex items-center cursor-pointer ${
                  multiApply ? 'bg-brand-violet' : 'bg-app-surface border border-app-border'
                }`}
              >
                <span className={`w-4 h-4 rounded-full bg-white shadow-sm flex transition-all ${
                  multiApply ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Setting 4: Email triggers notifications */}
            <div className="flex justify-between items-center bg-app-bg/40 p-4 rounded-2xl border border-app-border/60 hover:border-brand-violet/20 transition-all">
              <div>
                <div className="text-xs font-extrabold text-app-text font-display">Auto Email Notifications</div>
                <div className="text-[10px] text-app-muted font-bold mt-0.5">Send alerts automatically for shortlisting logs</div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  const newVal = !emailNotify;
                  setEmailNotify(newVal);
                  handleTogglePreference('emailNotify', newVal);
                }}
                className={`relative w-12 h-6 rounded-full transition-all flex items-center cursor-pointer ${
                  emailNotify ? 'bg-brand-violet' : 'bg-app-surface border border-app-border'
                }`}
              >
                <span className={`w-4 h-4 rounded-full bg-white shadow-sm flex transition-all ${
                  emailNotify ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
