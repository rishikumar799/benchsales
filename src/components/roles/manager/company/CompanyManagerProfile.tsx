import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  ShieldAlert, 
  Save, 
  CheckCircle,
  Briefcase,
  Users
} from 'lucide-react';

export default function CompanyManagerProfile() {
  const [name, setName] = useState('Amit Verma');
  const [email, setEmail] = useState('amit.verma@aryx.ai');
  const [phone, setPhone] = useState('+91 99887 76655');
  const [location, setLocation] = useState('Bangalore Executive Office');
  const [dept, setDept] = useState('Engineering');
  const [bio, setBio] = useState(
    'Hiring Manager for Engineering and Tech positions at Aryx AI. Focused on matching world-class senior infrastructure specialists and product designers to scalable development pools.'
  );

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      alert('Profile updates synchronized with directory services successfully.');
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-app-text tracking-tight animate-fade-in">Profile</h1>
          <p className="text-app-muted text-sm font-medium mt-1">Manage your administrator account credentials and lineage parameters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column Profile Editor */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-[32px] glass border border-app-border card-shadow">
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className="font-display font-black text-lg text-app-text tracking-tight border-b border-app-border/40 pb-4">Personal Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-app-muted">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              {/* Email address */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-app-muted">Work Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Phone number */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-app-muted">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              {/* Office Location */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-app-muted">Office Designation</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-app-muted">Associated Operations Wing</label>
              <div className="relative font-semibold">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                <input 
                  type="text" 
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-app-text focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-2 font-semibold">
              <label className="text-xs font-bold uppercase tracking-wider text-app-muted">Professional Biography</label>
              <textarea 
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-blue resize-none leading-relaxed"
              />
            </div>

            <button 
              type="submit"
              disabled={isSaved}
              className="px-6 py-3 bg-brand-blue hover:bg-brand-blue/90 disabled:bg-brand-blue/70 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-brand-blue/15 cursor-pointer ml-auto"
            >
              <Save className="w-4 h-4" /> Save General Details
            </button>

          </form>
        </div>

        {/* Right Column Organizational Context and Details */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Org details */}
          <div className="p-6 rounded-[32px] glass border border-app-border card-shadow space-y-4">
            <h3 className="font-display font-black text-base text-app-text tracking-tight border-b border-app-border/40 pb-3">
              Lineage Details
            </h3>
            
            <div className="space-y-4">
              
              <div className="flex items-start gap-3 text-xs">
                <Briefcase className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-app-text block">Title</span>
                  <span className="text-app-muted block font-medium mt-0.5">Hiring Manager (Engineering)</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <Users className="w-5 h-5 text-brand-violet shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-app-text block">Direct Lineage</span>
                  <span className="text-app-muted block font-medium mt-0.5">Manages 8 Talent Sourcing Specialists</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <Building className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-app-text block">Direct Report</span>
                  <span className="text-app-muted block font-medium mt-0.5">Reports to VP of Global Talent Sourcing</span>
                </div>
              </div>

            </div>
          </div>

          {/* Card 2: Security context */}
          <div className="p-6 rounded-[32px] glass border border-app-border card-shadow bg-amber-500/5 border-amber-500/10">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <h4 className="font-display font-black text-xs text-amber-500 uppercase tracking-widest">Workspace Clearance</h4>
            </div>
            <p className="text-[11px] text-app-muted leading-relaxed font-semibold">
              Your account has full administrative permission and edit clearance to publish job requirements, reallocate assigned recruitment specialists, and confirm hire pipelines.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
