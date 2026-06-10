import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Check, 
  Award,
  Bell,
  Lock,
  Sparkles
} from 'lucide-react';

export default function RecruiterProfileTab() {
  const [name, setName] = useState('Priya Sharma');
  const [email, setEmail] = useState('priya.sharma@aryx.ai');
  const [phone, setPhone] = useState('+91 9876543210');
  const [location, setLocation] = useState('Bangalore, India');
  const [dept, setDept] = useState('Engineering Recruitment Division');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in text-left max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-app-text">Profile</h1>
        <p className="text-app-muted text-sm mt-1">Review and manage your recruitment profile settings.</p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-500 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" /> Your profile preferences have been updated successfully!
        </div>
      )}

      {/* Main Profile container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
        
        {/* Left Card: Summary detail (span 4) */}
        <div className="md:col-span-4 p-6 rounded-[32px] bg-app-surface border border-app-border card-shadow flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-brand-blue/10 border-4 border-brand-blue flex items-center justify-center text-brand-blue font-black text-2xl shadow-lg relative">
            PS
            {/* Online badge */}
            <span className="w-4 h-4 bg-emerald-500 border-2 border-app-surface rounded-full absolute bottom-1 right-1" />
          </div>

          <div>
            <h3 className="font-display font-black text-lg text-app-text">{name}</h3>
            <p className="text-xs font-semibold text-brand-blue mt-0.5">{dept}</p>
            <p className="text-[10px] text-app-muted font-bold tracking-wider uppercase mt-1">ARYX AI Corp</p>
          </div>

          <div className="w-full pt-4 border-t border-app-border/40 text-left space-y-3.5 text-xs font-bold text-app-muted">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-brand-blue shrink-0" />
              <span className="text-app-text select-all">{email}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-brand-blue shrink-0" />
              <span className="text-app-text select-all">{phone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-brand-blue shrink-0" />
              <span className="text-app-text">{location}</span>
            </div>
          </div>
        </div>

        {/* Right card: Profile editable forms (span 8) */}
        <div className="md:col-span-8 p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-app-border/40">
            <User className="text-brand-blue w-5 h-5" />
            <h3 className="text-base font-display font-black text-app-text">Recruiter Details</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-app-muted uppercase">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-app-muted uppercase">Location</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-app-muted uppercase">Phone Number</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-app-muted uppercase">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  disabled
                  className="w-full px-4 py-3 bg-app-bg/50 border border-app-border rounded-xl text-xs font-bold text-app-muted cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-app-muted uppercase">Division</label>
              <input 
                type="text" 
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit"
                className="px-6 py-3 bg-brand-blue text-white hover:bg-opacity-95 text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer"
              >
                Save Changes Profile
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
