import React, { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Bell, 
  ShieldAlert, 
  Save, 
  Lock, 
  Building2,
  AlertCircle,
  Briefcase,
  Wrench,
  FileText
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

export default function ProfileTab() {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    designation: '',
    department: '',
    photoURL: '',
    bio: '',
    experience: '',
    skills: '',
    officeLocation: '',
    workingHours: '',
    officePhone: '',
    employeeId: 'PLAC23001',
    university: "St. Xavier's University",
  });

  const [notifications, setNotifications] = useState({
    newApps: true,
    appUpdates: true,
    placementUpdates: true,
    opportunityAlerts: false,
  });

  // Listen in real-time to the Placement Officer document
  useEffect(() => {
    if (!userProfile?.organizationId || !user?.uid) {
      setLoading(false);
      return;
    }

    const docPath = `organizations_universities/${userProfile.organizationId}/placement_officers/${user.uid}`;
    const docRef = doc(db, 'organizations_universities', userProfile.organizationId, 'placement_officers', user.uid);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      setLoading(false);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData(prev => ({
          ...prev,
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          designation: data.designation || '',
          department: data.department || '',
          photoURL: data.photoURL || '',
          bio: data.bio || '',
          experience: data.experience || '',
          skills: data.skills || '',
          officeLocation: data.officeLocation || '',
          workingHours: data.workingHours || '',
          officePhone: data.officePhone || '',
          employeeId: data.employeeId || prev.employeeId,
          university: data.university || prev.university,
        }));
        
        if (data.notificationPreferences) {
          setNotifications({
            newApps: data.notificationPreferences.newApps ?? true,
            appUpdates: data.notificationPreferences.appUpdates ?? true,
            placementUpdates: data.notificationPreferences.placementUpdates ?? true,
            opportunityAlerts: data.notificationPreferences.opportunityAlerts ?? false,
          });
        }
      } else {
        // Doc doesn't exist, fall back to initial registration values from userProfile
        setFormData(prev => ({
          ...prev,
          fullName: userProfile.fullName || '',
          email: userProfile.email || '',
          phone: userProfile.phoneNumber || '',
          designation: 'Placement Officer',
          department: 'Training & Placement',
        }));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, docPath);
    });

    return () => unsubscribe();
  }, [userProfile, user]);

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!userProfile?.organizationId || !user?.uid) {
      setErrorMsg('User identity or organization ID is missing.');
      return;
    }

    setSaveLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const docPath = `organizations_universities/${userProfile.organizationId}/placement_officers/${user.uid}`;
    const docRef = doc(db, 'organizations_universities', userProfile.organizationId, 'placement_officers', user.uid);

    try {
      await updateDoc(docRef, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        designation: formData.designation,
        department: formData.department,
        photoURL: formData.photoURL,
        bio: formData.bio,
        experience: formData.experience,
        skills: formData.skills,
        officeLocation: formData.officeLocation,
        workingHours: formData.workingHours,
        officePhone: formData.officePhone,
        notificationPreferences: notifications,
        updatedAt: new Date().toISOString()
      });
      
      setSuccessMsg('Profile and preferences updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error) {
      setErrorMsg('Failed to update profile settings.');
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  const currentAvatarUrl = formData.photoURL || `https://picsum.photos/seed/${(formData.fullName || 'priyasharma').replace(/\s+/g, '')}/200/200`;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-app-text">Profile</h2>
          <p className="text-app-muted">Manage your personal and office contact preferences.</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Personal Information Card */}
        <div className="lg:col-span-1 p-6 rounded-[28px] glass border-app-border card-shadow flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-display font-bold text-lg text-app-text-active flex items-center gap-2 border-b border-app-border/40 pb-3">
              <User className="w-5 h-5 text-brand-blue" /> Personal Information
            </h3>
            
            {/* Round Avatar visual matching image exactly */}
            <div className="flex flex-col items-center text-center space-y-3.5 py-4 bg-app-surface/40 rounded-2xl border border-app-border">
              <div className="w-24 h-24 rounded-full blue-gradient p-0.5 shadow-lg relative">
                <img 
                  src={currentAvatarUrl} 
                  alt={formData.fullName} 
                  className="w-full h-full rounded-full object-cover border-4 border-app-bg"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-app-bg" />
              </div>
              <div>
                <h4 className="font-display font-black text-base text-app-text">{formData.fullName || 'Unset Name'}</h4>
                <p className="text-xs text-app-muted font-bold uppercase tracking-wider">{formData.designation || 'Officer'} • PLA</p>
              </div>
            </div>

            {/* Information Grid fields */}
            <div className="space-y-4 pt-2 text-xs">
              <div className="flex justify-between items-center py-2.5 border-b border-app-border/30">
                <span className="text-app-muted font-bold uppercase tracking-wider">Employee ID</span>
                <span className="font-extrabold text-app-text">{formData.employeeId}</span>
              </div>
              
              <div className="space-y-1">
                <label className="text-app-muted font-bold uppercase tracking-wider">Full Name</label>
                <input 
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text text-xs focus:outline-none focus:border-brand-blue font-semibold"
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-app-muted font-bold uppercase tracking-wider">Email Address</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text text-xs focus:outline-none focus:border-brand-blue font-semibold"
                  placeholder="email@university.edu"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-app-muted font-bold uppercase tracking-wider">Phone</label>
                <input 
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text text-xs focus:outline-none focus:border-brand-blue font-semibold"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div className="space-y-1">
                <label className="text-app-muted font-bold uppercase tracking-wider">Designation</label>
                <input 
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text text-xs focus:outline-none focus:border-brand-blue font-semibold"
                  placeholder="e.g. Placement Officer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-app-muted font-bold uppercase tracking-wider">Department</label>
                <input 
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text text-xs focus:outline-none focus:border-brand-blue font-semibold"
                  placeholder="e.g. Training & Placement"
                />
              </div>

              <div className="space-y-1">
                <label className="text-app-muted font-bold uppercase tracking-wider">Avatar Photo URL</label>
                <input 
                  type="text"
                  value={formData.photoURL}
                  onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
                  className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text text-xs focus:outline-none focus:border-brand-blue font-semibold"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="flex justify-between items-center py-2.5 border-t border-app-border/30">
                <span className="text-app-muted font-bold uppercase tracking-wider">University</span>
                <span className="font-extrabold text-app-text text-brand-blue">{formData.university}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right Column split for Workspace Details & Security Preferences */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Workspace Office Information */}
            <div className="p-6 rounded-[28px] glass border-app-border card-shadow flex flex-col justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-app-text-active flex items-center gap-2 border-b border-app-border/40 pb-3 mb-4">
                  <Building2 className="w-5 h-5 text-brand-blue" /> Professional Information
                </h3>
                
                <div className="space-y-4 text-xs font-semibold">
                  <div>
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block mb-1">Office Location</span>
                    <input 
                      type="text"
                      value={formData.officeLocation}
                      onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text text-xs focus:outline-none focus:border-brand-blue font-semibold"
                      placeholder="e.g. Placement Office, Block A"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block mb-1">Office Phone Line</span>
                    <input 
                      type="text"
                      value={formData.officePhone}
                      onChange={(e) => setFormData({ ...formData, officePhone: e.target.value })}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text text-xs focus:outline-none focus:border-brand-blue font-semibold"
                      placeholder="e.g. +91 80 1234 5678"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block mb-1">Working Hours</span>
                    <input 
                      type="text"
                      value={formData.workingHours}
                      onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text text-xs focus:outline-none focus:border-brand-blue font-semibold"
                      placeholder="e.g. 9:00 AM - 6:00 PM"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-app-border/40">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block leading-none mb-1">Status</span>
                <span className="text-xs font-bold text-app-muted">System Active & Securely Sync'd</span>
              </div>
            </div>

            {/* Account Settings & Verification security */}
            <div className="p-6 rounded-[28px] glass border-app-border card-shadow space-y-4">
              <h3 className="font-display font-bold text-lg text-app-text-active flex items-center gap-2 border-b border-app-border/40 pb-3 mb-4">
                <Lock className="w-5 h-5 text-brand-blue" /> Account Information
              </h3>
              
              <div className="space-y-3.5 text-xs font-semibold">
                <div>
                  <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block mb-1">Password</span>
                  <input 
                    type="password" 
                    value="••••••••••••••" 
                    disabled 
                    className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-muted cursor-not-allowed text-xs focus:outline-none"
                  />
                  <div className="text-right mt-1.5 flex justify-end">
                    <span className="text-[10px] text-app-muted font-bold">Last changed: 10 Apr 2026</span>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => alert('Opening Secure Identity Verification to reset placing credentials...')}
                  className="w-full py-2.5 bg-brand-blue/15 text-brand-blue text-xs font-black rounded-xl hover:bg-brand-blue/20 transition-all border border-brand-blue/10"
                >
                  Change Password
                </button>
              </div>
            </div>

          </div>

          {/* Bio & Credentials */}
          <div className="p-6 rounded-[28px] glass border-app-border card-shadow space-y-4">
            <h3 className="font-display font-bold text-lg text-app-text-active flex items-center gap-2 border-b border-app-border/40 pb-3 mb-4">
              <Briefcase className="w-5 h-5 text-brand-blue" /> Bio & Credentials
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
              <div>
                <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block mb-1">Experience (Background)</label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g. 8+ years in Corporate Relations & Counseling"
                  className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text text-xs focus:outline-none focus:border-brand-blue h-28 resize-none font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block mb-1">Skills & Specializations</label>
                <textarea
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g. Sourcing, Partner Relations, Resume Vetting"
                  className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text text-xs focus:outline-none focus:border-brand-blue h-28 resize-none font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block mb-1">Short Biography</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief summary about your professional path..."
                  className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text text-xs focus:outline-none focus:border-brand-blue h-28 resize-none font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Connected Preferences Notification Toggles */}
          <div className="p-6 rounded-[28px] glass border-app-border card-shadow">
            <h3 className="font-display font-bold text-lg text-app-text-active flex items-center gap-2 border-b border-app-border/40 pb-3 mb-4">
              <Bell className="w-5 h-5 text-brand-blue" /> Notification Preferences
            </h3>
            
            <div className="space-y-4 pt-1">
              {[
                { key: 'newApps', title: 'New Applications', desc: 'Trigger alerts immediately when a student submits a new application.' },
                { key: 'appUpdates', title: 'Application Updates', desc: 'Receive instant notifications when candidate selection stages advance.' },
                { key: 'placementUpdates', title: 'Placement Updates', desc: 'Alert placement cells immediately when corporate offers are confirmed.' },
                { key: 'opportunityAlerts', title: 'Opportunity Alerts', desc: 'Notify regarding critical corporate sourcing updates or deadlines.' },
              ].map((notif, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-2 border-b last:border-b-0 border-app-border/30">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-extrabold text-app-text">{notif.title}</h4>
                    <p className="text-[11px] text-app-muted font-semibold leading-relaxed">{notif.desc}</p>
                  </div>
                  
                  {/* Custom Toggle Switch */}
                  <button 
                    type="button"
                    onClick={() => toggleNotification(notif.key as keyof typeof notifications)}
                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 shrink-0 ${
                      notifications[notif.key as keyof typeof notifications] 
                        ? 'bg-brand-blue' 
                        : 'bg-app-surface border border-app-border'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-all transform duration-200 shadow-md ${
                      notifications[notif.key as keyof typeof notifications] 
                        ? 'translate-x-5' 
                        : 'translate-x-0 bg-app-muted'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              disabled={saveLoading}
              className="px-6 py-3 bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-brand-blue/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> 
              {saveLoading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}
