import React, { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Lock, 
  CheckCircle, 
  Info,
  ChevronRight
} from 'lucide-react';

interface AddOfficerTabProps {
  onBack: () => void;
  onSubmit: (newOfficer: any) => void;
}

export default function AddOfficerTab({ onBack, onSubmit }: AddOfficerTabProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dept, setDept] = useState('CSE');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !designation || !password || !confirmPassword) {
      alert('Please fill in all the required fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const newOfficer = {
      id: String(Date.now()),
      name,
      dept,
      email,
      phone,
      opportunities: 0,
      placements: 0,
      status: 'Active',
      avatar: `https://picsum.photos/seed/${name.replace(/\s+/g, '')}/100/100`,
    };

    onSubmit(newOfficer);
  };

  const permissions = [
    'Create and publish opportunities',
    'View student resumes & academic sheets',
    'Track candidate applications dynamically',
    'Confirm or reject student placements',
    'Access specific analytics & reports'
  ];

  return (
    <div className="space-y-6">
      {/* Header breadcrumb view */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="p-2 border border-app-border rounded-xl hover:bg-app-surface text-app-muted hover:text-app-text transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="text-xs font-bold text-app-muted flex items-center gap-2">
            <span>Placement Officers</span>
            <ChevronRight className="w-3 h-3 text-app-muted" />
            <span className="text-brand-blue font-extrabold">Add Placement Officer</span>
          </div>
          <h2 className="text-xl font-display font-black text-app-text tracking-tight mt-0.5">Add Placement Officer</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form container */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-[32px] bg-app-surface/60 border border-app-border card-shadow">
          <h3 className="text-lg font-display font-black text-app-text mb-6">Officer Information</h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-app-muted uppercase tracking-wider flex items-center justify-between">
                <span>Full Name <span className="text-red-500">*</span></span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                <input 
                  type="text" 
                  required
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-app-bg border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-colors font-semibold"
                />
              </div>
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-app-muted uppercase tracking-wider">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                  <input 
                    type="email" 
                    required
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-app-bg border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-colors font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-app-muted uppercase tracking-wider">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                  <input 
                    type="tel" 
                    required
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-app-bg border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-colors font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Department and Designation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-app-muted uppercase tracking-wider">
                  Designation <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                  <input 
                    type="text" 
                    required
                    placeholder="Enter designation (e.g., Placement Officer)"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full bg-app-bg border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-colors font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-app-muted uppercase tracking-wider font-sans">
                  Assigned Department / Cell <span className="text-red-500">*</span>
                </label>
                <select 
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full bg-app-bg border border-app-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-blue transition-colors font-semibold"
                >
                  <option value="CSE">Information Technology / Computer Science Group (CSE)</option>
                  <option value="ECE">Electronics and Communication Department (ECE)</option>
                  <option value="IT">General Information Tech (IT)</option>
                  <option value="MBA">Management & Marketing Group (MBA)</option>
                  <option value="Mechanical">Mechanical Engineering Cell</option>
                  <option value="General">General Training & Placement Cell</option>
                </select>
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-app-muted uppercase tracking-wider">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                  <input 
                    type="password" 
                    required
                    placeholder="Create secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-app-bg border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-colors font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-app-muted uppercase tracking-wider">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                  <input 
                    type="password" 
                    required
                    placeholder="Confirm secure password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-app-bg border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-colors font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex justify-end items-center gap-4 border-t border-app-border/40 pt-6 mt-4">
              <button 
                type="button"
                onClick={onBack}
                className="px-5 py-2.5 border border-app-border rounded-xl text-xs font-semibold text-app-muted hover:bg-app-bg hover:text-app-text transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-brand-blue/15 transition-all cursor-pointer"
              >
                Create Officer
              </button>
            </div>
          </form>
        </div>

        {/* Right Info Box listing guidelines & permissions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-[32px] bg-app-surface/60 border border-app-border card-shadow space-y-5">
            <h3 className="text-md font-display font-black text-app-text flex items-center gap-2">
              <Info className="w-5 h-5 text-brand-blue" />
              Role & Permissions
            </h3>
            <p className="text-xs text-app-muted leading-relaxed font-semibold">
              Placement Officers are delegated administrators with credentials verified by our Central IT Registry. Once created, they will be granted live access with the following permissions:
            </p>

            <div className="space-y-3 pt-2">
              {permissions.map((p, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="font-bold text-app-text">{p}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-brand-blue/5 border border-brand-blue/10 text-[11px] text-brand-blue leading-relaxed font-bold">
              Notice: They will NOT be allowed to access general university administration systems, budget registries, or configure overall ecosystem visibility restrictions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
