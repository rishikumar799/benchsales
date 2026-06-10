import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle,
  Briefcase,
  Sliders,
  Sparkles
} from 'lucide-react';

export default function ProfileTab() {
  
  // High fidelity states matching user info from image #7
  const [fullName, setFullName] = useState('Rohit Kumar');
  const [email, setEmail] = useState('rohit.kumar@aryaxai.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [location, setLocation] = useState('Bangalore, India');
  
  const [recruiterId, setRecruiterId] = useState('REC-2026-045');
  const [reportingManager, setReportingManager] = useState('John Mathew (BDM)');
  const [team, setTeam] = useState('Frontend Recruitment');
  const [experience, setExperience] = useState('3 Years');
  
  const [preferredRoles, setPreferredRoles] = useState('Frontend, Full Stack, Backend');
  const [preferredLocations, setPreferredLocations] = useState('Bangalore, Remote');
  const [notificationEmail, setNotificationEmail] = useState('rohit.kumar@aryaxai.com');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-app-text">My Profile</h1>
        <p className="text-app-muted mt-1">Manage your recruiter information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Avatar Profile Card */}
        <div className="lg:col-span-4">
          <div className="p-6 rounded-[32px] glass border border-app-border card-shadow relative overflow-hidden text-center flex flex-col justify-between h-full">
            {/* Header background gradient overlay */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-r from-brand-blue/30 via-brand-purple/20 to-brand-violet/30" />
            
            <div className="relative pt-12 space-y-4">
              <div className="w-28 h-28 rounded-full border-4 border-app-bg bg-brand-blue/10 p-1 mx-auto shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/rohit/150/150" 
                  alt="Rohit Kumar" 
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-2xl text-app-text">{fullName}</h3>
                <p className="text-brand-blue text-sm font-bold uppercase tracking-wider mt-1">Marketplace Recruiter</p>
                <div className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-1 bg-brand-blue/10 border border-brand-blue/20 text-brand-blue rounded-full text-xs font-mono font-bold">
                  ID: {recruiterId}
                </div>
              </div>
              <p className="text-xs text-app-muted mt-1">Member since May 2006</p>
            </div>

            <div className="mt-8 pt-8 border-t border-app-border/40 text-left space-y-4 text-xs font-semibold text-app-text">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-app-muted shrink-0" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-app-muted shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-app-muted shrink-0" />
                <span>{location}</span>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-brand-blue/5 border border-brand-blue/10 text-xs font-semibold text-app-muted leading-relaxed">
              Security Containment Zone active. Your account data stays within Aryx Recruiter Network.
            </div>
          </div>
        </div>

        {/* Right Column: Information Tabs Forms */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-[32px] glass border border-app-border card-shadow">
          <form onSubmit={handleSaveChanges} className="space-y-8">
            
            {/* Section 1: Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-app-border/60 pb-2">
                <User className="w-4 h-4 text-brand-blue" />
                <h3 className="font-display font-bold text-base text-app-text">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-app-muted uppercase mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-brand-blue text-app-text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-app-muted uppercase mb-1.5">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-brand-blue text-app-text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-app-muted uppercase mb-1.5">Phone</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-brand-blue text-app-text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-app-muted uppercase mb-1.5">Location</label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-brand-blue text-app-text"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Work Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-app-border/60 pb-2">
                <Briefcase className="w-4 h-4 text-brand-blue" />
                <h3 className="font-display font-bold text-base text-app-text">Work Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-app-muted uppercase mb-1.5">Recruiter ID</label>
                  <input 
                    type="text" 
                    value={recruiterId}
                    onChange={(e) => setRecruiterId(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-brand-blue text-app-text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-app-muted uppercase mb-1.5">Reporting Manager</label>
                  <input 
                    type="text" 
                    value={reportingManager}
                    onChange={(e) => setReportingManager(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-brand-blue text-app-text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-app-muted uppercase mb-1.5">Team</label>
                  <input 
                    type="text" 
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-brand-blue text-app-text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-app-muted uppercase mb-1.5">Experience in Recruitment</label>
                  <input 
                    type="text" 
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-brand-blue text-app-text"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Preferences */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-app-border/60 pb-2">
                <Sliders className="w-4 h-4 text-brand-blue" />
                <h3 className="font-display font-bold text-base text-app-text">Preferences</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-app-muted uppercase mb-1.5">Preferred Roles</label>
                  <input 
                    type="text" 
                    value={preferredRoles}
                    onChange={(e) => setPreferredRoles(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-brand-blue text-app-text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-app-muted uppercase mb-1.5">Preferred Locations</label>
                  <input 
                    type="text" 
                    value={preferredLocations}
                    onChange={(e) => setPreferredLocations(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-brand-blue text-app-text"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-app-muted uppercase mb-1.5">Notification Email</label>
                  <input 
                    type="email" 
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-brand-blue text-app-text"
                  />
                </div>
              </div>
            </div>

            {/* Save Buttons & Feedback */}
            <div className="flex items-center gap-4 pt-4 border-t border-app-border/60">
              <button 
                type="submit" 
                disabled={saving}
                className="px-8 py-3.5 bg-brand-violet text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-brand-violet/15 hover:scale-[1.02] active:scale-95 transition-all shrink-0"
              >
                {saving ? 'Saving changes...' : 'Save Changes'}
              </button>

              {savedSuccess && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 animate-bounce">
                  <CheckCircle className="w-4 h-4" /> Changes saved successfully!
                </div>
              )}
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}