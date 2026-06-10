import React, { useState, FormEvent } from 'react';
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
  Building2 
} from 'lucide-react';

export default function ProfileTab() {
  const [profile, setProfile] = useState({
    name: 'Priya Sharma',
    employeeId: 'PLAC23001',
    designation: 'Placement Officer',
    department: 'Training & Placement',
    university: "St. Xavier's University",
    email: 'priya.sharma@xavier.edu',
    phone: '+91 918765 43211',
    officeLocation: 'Placement Office, Block A',
    officePhone: '+91 80 1234 5678',
    workingHours: '9:00 AM - 6:00 PM',
  });

  const [notifications, setNotifications] = useState({
    newApps: true,
    appUpdates: true,
    placementUpdates: true,
    opportunityAlerts: false,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    alert('Vetting Officer settings and contact registry updated successfully with Central IT Admin!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-display font-bold text-app-text">Profile</h2>
        <p className="text-app-muted">Manage your personal and office contact preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
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
                  src="https://picsum.photos/seed/priyasharma/200/200" 
                  alt={profile.name} 
                  className="w-full h-full rounded-full object-cover border-4 border-app-bg"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-app-bg" />
              </div>
              <div>
                <h4 className="font-display font-black text-base text-app-text">{profile.name}</h4>
                <p className="text-xs text-app-muted font-bold uppercase tracking-wider">{profile.designation} • PLA</p>
              </div>
            </div>

            {/* Information Grid fields */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between items-center py-2.5 border-b border-app-border/30">
                <span className="text-app-muted font-bold uppercase tracking-wider">Employee ID</span>
                <span className="font-extrabold text-app-text">{profile.employeeId}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-app-border/30">
                <span className="text-app-muted font-bold uppercase tracking-wider">Designation</span>
                <span className="font-extrabold text-app-text">{profile.designation}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-app-border/30">
                <span className="text-app-muted font-bold uppercase tracking-wider">Department</span>
                <span className="font-extrabold text-app-text">{profile.department}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-app-border/30">
                <span className="text-app-muted font-bold uppercase tracking-wider">University</span>
                <span className="font-extrabold text-app-text text-brand-blue">{profile.university}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-app-border/30">
                <span className="text-app-muted font-bold uppercase tracking-wider">Email</span>
                <span className="font-extrabold text-app-text truncate text-right max-w-[200px]">{profile.email}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-app-muted font-bold uppercase tracking-wider">Phone</span>
                <span className="font-extrabold text-app-text">{profile.phone}</span>
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
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block mb-0.5">Office Location</span>
                    <span className="text-app-text">{profile.officeLocation}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block mb-0.5">Office Phone Line</span>
                    <span className="text-app-text">{profile.officePhone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block mb-0.5">Working Hours</span>
                    <span className="text-app-text">{profile.workingHours}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-app-border/40">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block leading-none mb-1">Status</span>
                <span className="text-xs font-bold text-app-muted">System Active & Securely Sync\'d</span>
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
                  onClick={() => alert('Opening Secure Identity Verification to reset placing credentials...')}
                  className="w-full py-2.5 bg-brand-blue/15 text-brand-blue text-xs font-black rounded-xl hover:bg-brand-blue/20 transition-all border border-brand-blue/10"
                >
                  Change Password
                </button>
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
              onClick={handleSave}
              className="px-6 py-3 bg-brand-blue hover:bg-brand-blue-dark text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-brand-blue/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
