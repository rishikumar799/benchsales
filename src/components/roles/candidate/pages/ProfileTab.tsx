import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  MapPin, 
  Calendar, 
  Edit, 
  CheckCircle,
  Mail,
  Phone,
  Briefcase,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function ProfileTab() {
  const [activeSubTab, setActiveSubTab] = useState('PersonalInfo');
  const [fullName, setFullName] = useState('Rishi Kumar');
  const [email, setEmail] = useState('rishi.kumar@email.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [location, setLocation] = useState('Hyderabad, India');
  const [aboutMe, setAboutMe] = useState(
    'Passionate full stack developer with experience in building modern web applications. Always eager to learn new technologies and solve real-world problems.'
  );

  const [dob, setDob] = useState('12 May 1999');
  const [gender, setGender] = useState('Male');

  const [editing, setEditing] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(false);
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 2500);
  };

  const menuTabs = [
    { id: 'PersonalInfo', label: 'Personal Info' },
    { id: 'CareerInfo', label: 'Career Info' },
    { id: 'Skills', label: 'Skills' },
    { id: 'SocialLinks', label: 'Social Links' },
    { id: 'Preferences', label: 'Preferences' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Welcoming Heading */}
      <div>
        <h1 className="text-3xl font-display font-bold text-app-text tracking-tight">Profile Seeker Overview</h1>
        <p className="text-app-muted text-sm mt-1">Manage your personal details and preferences exposed to recruiters on Aryx AI.</p>
      </div>

      <AnimatePresence>
        {showSavedMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-xs flex items-center gap-2"
          >
            <CheckCircle2 className="w-4.5 h-4.5" /> Your Profile updates have been saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Seeker Card & General Stats (Left Column) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Main info brief */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full blue-gradient p-1">
              <img 
                src="https://picsum.photos/seed/user123/200/200" 
                alt="Rishi Kumar Seeker profile view" 
                className="w-full h-full rounded-full object-cover border-4 border-app-surface shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <h2 className="text-xl font-display font-black text-app-text">{fullName}</h2>
              <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest block mt-1">Student / Job Seeker</span>
            </div>

            <button 
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-app-bg hover:bg-app-surface border border-app-border rounded-xl text-xs font-bold text-app-text hover:text-brand-blue flex items-center gap-2 transition-all"
            >
              <Edit className="w-3.5 h-3.5" /> Edit Profile
            </button>
          </div>

          {/* Profile Strength brief */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow flex flex-col items-center">
            <h3 className="text-xs font-bold text-app-muted uppercase tracking-wider mb-4 w-full">Profile Strength</h3>
            
            <div className="relative w-28 h-28 flex items-center justify-center my-1.5">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-app-border" />
                <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="301" strokeDashoffset="54" className="text-brand-blue" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-display font-extrabold text-app-text">82%</span>
                <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-500">Good</span>
              </div>
            </div>
          </div>

          {/* Metadata Seeker sidebar items */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-4">
            <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest block leading-none">Personal Info brief</span>
            
            <div className="space-y-3 pt-2 text-xs font-semibold">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-app-muted shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-app-muted block">Location</span>
                  <span className="text-app-text font-bold mt-0.5 block">{location}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-app-muted shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-app-muted block">Date of Birth</span>
                  <span className="text-app-text font-bold mt-0.5 block">{dob}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-app-muted shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-app-muted block">Gender</span>
                  <span className="text-app-text font-bold mt-0.5 block">{gender}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Form and inner tabs (Right Column) */}
        <div className="lg:col-span-8 p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow h-fit space-y-6">
          {/* Sub menu tabs */}
          <div className="border-b border-app-border/40 pb-px flex gap-4 overflow-x-auto">
            {menuTabs.map((tb) => (
              <button
                key={tb.id}
                onClick={() => setActiveSubTab(tb.id)}
                className={`pb-4 text-xs font-bold uppercase tracking-wider relative transition-all whitespace-nowrap ${
                  activeSubTab === tb.id ? 'text-brand-blue' : 'text-app-muted hover:text-app-text'
                }`}
              >
                {tb.label}
                {activeSubTab === tb.id && (
                  <motion.div 
                    layoutId="activeProfileSubTabUnderline" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" 
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              {activeSubTab === 'PersonalInfo' && (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Full Name</label>
                      <input 
                        type="text" 
                        value={fullName}
                        disabled={!editing}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-app-bg disabled:bg-app-surface border border-app-border disabled:opacity-85 rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        disabled={!editing}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-app-bg disabled:bg-app-surface border border-app-border disabled:opacity-85 rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Phone Number</label>
                      <input 
                        type="text" 
                        value={phone}
                        disabled={!editing}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-app-bg disabled:bg-app-surface border border-app-border disabled:opacity-85 rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">DOB / Location Combination</label>
                      <input 
                        type="text" 
                        value={location}
                        disabled={!editing}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-app-bg disabled:bg-app-surface border border-app-border disabled:opacity-85 rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">About Me</label>
                      {!editing && (
                        <button 
                          type="button" 
                          onClick={() => setEditing(true)}
                          className="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" /> Edit
                        </button>
                      )}
                    </div>
                    <textarea 
                      rows={5}
                      value={aboutMe}
                      disabled={!editing}
                      onChange={(e) => setAboutMe(e.target.value)}
                      className="w-full bg-app-bg disabled:bg-app-surface border border-app-border disabled:opacity-85 rounded-xl p-4 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                    />
                  </div>

                  {editing && (
                    <div className="flex justify-end pt-4 border-t border-app-border/40 gap-3">
                      <button 
                        type="button" 
                        onClick={() => setEditing(false)}
                        className="px-4 py-2.5 bg-app-bg hover:bg-app-surface border border-app-border rounded-xl text-xs font-bold text-app-text"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs rounded-xl shadow-md uppercase tracking-wide"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              )}

              {activeSubTab !== 'PersonalInfo' && (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto text-brand-blue">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-app-text">{menuTabs.find(s => s.id === activeSubTab)?.label} Settings</h3>
                    <p className="text-xs text-app-muted mt-1 max-w-xs mx-auto">Configure your comprehensive integration parameters for matching open roles.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
