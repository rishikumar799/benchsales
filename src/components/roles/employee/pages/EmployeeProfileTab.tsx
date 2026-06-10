import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Building2, UserCircle2, Code, FileText, CheckCircle2 } from 'lucide-react';

export default function EmployeeProfileTab() {
  const [successMsg, setSuccessMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // States matching screenshot 6 info
  const [profile, setProfile] = useState({
    name: 'Rohit Kumar',
    employeeId: 'EMP24567',
    department: 'Engineering',
    designation: 'Software Engineer',
    location: 'Hyderabad, India',
    manager: 'Ankit Verma',
    email: 'rohit.kumar@company.com',
    phone: '+91 98765 43210',
    experience: '4.2 Years',
    totalExperience: '4.2 Years',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'Git'],
    languages: ['English', 'Hindi'],
    linkedin: 'linkedin.com/in/rohitkumar',
    github: 'github.com/rohitkumar',
    about: 'Passionate software engineer with experience in building modern web applications and scalable backend APIs. Always eager to learn new technologies and contribute to meaningful architectural projects.'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSuccessMsg('✓ Profile information updated and saved successfully.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-black text-app-text">Profile</h2>
        <p className="text-xs text-app-muted mt-1 font-semibold">View and manage your profile information.</p>
      </div>

      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-xs"
          >
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Employee Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow relative overflow-hidden flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-widest text-app-muted">Employee Information</span>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-1.5 border border-app-border hover:border-brand-blue text-xs font-bold text-app-text rounded-lg hover:text-brand-blue transition-colors cursor-pointer"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4 font-semibold text-xs text-app-text">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-app-muted uppercase">Full Name</label>
                    <input 
                      type="text" 
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-app-bg border border-app-border rounded-xl p-3 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-app-muted uppercase">Phone</label>
                    <input 
                      type="text" 
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full bg-app-bg border border-app-border rounded-xl p-3 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-app-muted uppercase">Email</label>
                    <input 
                      type="email" 
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-app-bg border border-app-border rounded-xl p-3 focus:outline-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold rounded-xl transition-all shadow-sm"
                  >
                    Save Info
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Photo & Identity briefs */}
                  <div className="flex items-center gap-5 pb-6 border-b border-app-border/40">
                    <div className="w-20 h-20 rounded-full blue-gradient p-1 shrink-0">
                      <img 
                        src="https://picsum.photos/seed/rohit123/200/200" 
                        alt="Rohit Kumar" 
                        className="w-full h-full rounded-full object-cover border-4 border-app-surface shadow-md"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-black text-app-text leading-tight">{profile.name}</h3>
                      <div className="text-xs text-app-muted font-bold mt-1">Employee ID: <strong className="text-brand-blue">{profile.employeeId}</strong></div>
                    </div>
                  </div>

                  {/* Professional specifics */}
                  <div className="space-y-4 pt-1 font-semibold text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-app-muted block">Department</span>
                        <span className="text-app-text block font-bold mt-0.5">{profile.department}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-violet/5 border border-brand-violet/10 flex items-center justify-center text-brand-violet shrink-0">
                        <UserCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-app-muted block">Designation</span>
                        <span className="text-app-text block font-bold mt-0.5">{profile.designation}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                        <MapPin className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-app-muted block">Location</span>
                        <span className="text-app-text block font-bold mt-0.5">{profile.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t border-app-border/40">
                      <span className="text-xs text-app-muted font-bold">Manager: <strong className="text-app-text font-black">{profile.manager}</strong></span>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-app-border/40 text-app-muted">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5" /> <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5" /> <span>{profile.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Columns: Career details & bio */}
        <div className="lg:col-span-7 space-y-6">
          {/* Career details */}
          <div className="p-6 sm:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-app-muted">Career Information</span>
              <button 
                onClick={() => alert('Editing career variables... Handled by Talent & HR parameters.')}
                className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 font-semibold text-xs">
              <div className="p-4 bg-app-bg border border-app-border rounded-2xl">
                <span className="text-[9px] uppercase font-extrabold text-app-muted">Current Experience</span>
                <span className="text-sm font-black text-app-text block mt-1">{profile.experience}</span>
              </div>
              <div className="p-4 bg-app-bg border border-app-border rounded-2xl">
                <span className="text-[9px] uppercase font-extrabold text-app-muted">Total Experience</span>
                <span className="text-sm font-black text-app-text block mt-1">{profile.totalExperience}</span>
              </div>
            </div>

            {/* Skills tagging */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-app-muted">Skills</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {profile.skills.map((s, idx) => (
                  <span key={idx} className="text-xs font-semibold text-brand-blue bg-brand-blue/10 border border-brand-blue/20 rounded-xl px-3 py-1">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-app-border/40 font-semibold text-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-app-muted">Languages</span>
                <div className="text-app-text text-xs leading-none font-bold mt-1 max-w-xs">{profile.languages.join(', ')}</div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-app-muted font-mono">Social Sync</span>
                <div className="space-y-1.5 text-xs text-brand-blue">
                  <div className="flex items-center gap-1.5 hover:underline cursor-pointer">🔗 {profile.linkedin}</div>
                  <div className="flex items-center gap-1.5 hover:underline cursor-pointer">🔗 {profile.github}</div>
                </div>
              </div>
            </div>
          </div>

          {/* About Me */}
          <div className="p-6 sm:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-app-muted">About Me</span>
              <button 
                onClick={() => alert('Under system HR maintenance guidelines')}
                className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
            <p className="text-xs text-app-muted leading-relaxed font-semibold">{profile.about}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
