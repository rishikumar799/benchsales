import React from 'react';
import { 
  Building, 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Globe, 
  Users,
  Plus,
  Upload
} from 'lucide-react';

interface CompanyAdminProfileProps {
  onNavigate: (tab: string) => void;
  onAddManagerClick: () => void;
  onAddRecruiterClick: () => void;
  companyData: any;
  adminProfileData: any;
}

export default function CompanyAdminProfile({ 
  onNavigate, 
  onAddManagerClick, 
  onAddRecruiterClick,
  companyData,
  adminProfileData
}: CompanyAdminProfileProps) {
  
  // Safe extraction of real-time company fields with defaults
  const orgName = companyData?.organizationName || companyData?.name || 'Tech Solutions Pvt. Ltd.';
  const category = companyData?.category || 'Technology, Information and Internet';
  const segment = companyData?.primarySegment || 'Software Development';
  const website = companyData?.website || 'www.techsolutions.com';
  const hqLocation = companyData?.hqLocation || companyData?.location || 'Bangalore, India';
  const foundedYear = companyData?.foundedYear || 'Year 2015';
  const workforceVolume = companyData?.workforceVolume || '1001 - 5000 Employees';
  const supportEmail = companyData?.supportEmail || companyData?.email || 'contact@techsolutions.com';

  // Safe extraction of real-time admin fields with defaults
  const adminName = adminProfileData?.fullName || adminProfileData?.name || 'Vikram Singh';
  const empId = adminProfileData?.empId || 'ADM10001';
  const designation = adminProfileData?.designation || 'Company Administrator';
  const department = adminProfileData?.department || adminProfileData?.dept || 'Administration';
  const adminEmail = adminProfileData?.email || 'admin@techsolutions.com';
  const adminPhone = adminProfileData?.phoneNumber || adminProfileData?.phone || '+91 98765 43210';
  const adminAvatar = adminProfileData?.avatar || `https://picsum.photos/seed/${adminName.replace(/\s+/g, '')}/120/120`;

  return (
    <div className="space-y-6 animate-fade-in text-app-text" id="company-admin-profile-root">
      
      {/* Title block */}
      <div>
        <h1 className="text-2xl font-display font-black text-app-text tracking-tight flex items-center gap-2">
          Administrator Profiles
        </h1>
        <p className="text-app-muted text-sm font-medium mt-1">Review verified business identity and administrative access privileges.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Card: Company Information */}
        <div className="col-span-1 lg:col-span-7 p-6 md:p-8 rounded-[32px] glass border border-app-border/80 card-shadow space-y-6">
          <div className="flex items-center gap-4.5 border-b border-app-border/40 pb-5">
            <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center border border-brand-blue/20">
              <Building className="w-7 h-7 text-brand-blue" />
            </div>
            <div>
              <h3 className="text-lg font-black font-display text-app-text">Company Information</h3>
              <p className="text-[10px] text-brand-blue font-black uppercase tracking-wider mt-0.5 font-mono">ARYX ACTIVE ORG IDENTITY SECURE</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-semibold">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-app-muted block">Legal Entity Name</span>
              <span className="text-app-text text-sm font-extrabold block">{orgName}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-app-muted block">Category</span>
              <span className="text-app-text text-sm font-extrabold block">{category}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-app-muted block">Primary Segment</span>
              <span className="text-app-text text-sm font-bold block flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-brand-blue" /> {segment}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-app-muted block">Official Url</span>
              <a href={`https://${website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="text-brand-blue text-sm font-bold block hover:underline">
                {website}
              </a>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-app-muted block">Headquarters location</span>
              <span className="text-app-text text-sm font-bold block flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-blue" /> {hqLocation}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-app-muted block">Founded Epoch</span>
              <span className="text-app-text text-sm font-bold block flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-blue" /> {foundedYear.includes('Year') ? foundedYear : `Year ${foundedYear}`}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-app-muted block">Workforce Volume</span>
              <span className="text-app-text text-sm font-bold block flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-blue" /> {workforceVolume}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-app-muted block">Official support line</span>
              <span className="text-app-text text-sm font-bold block flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-brand-blue" /> {supportEmail}
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Admin Personal Information */}
        <div className="col-span-1 lg:col-span-5 p-6 md:p-8 rounded-[32px] glass border border-app-border/80 card-shadow space-y-6">
          <div className="flex items-center gap-4 border-b border-app-border/40 pb-5">
            <div className="w-12 h-12 rounded-full overflow-hidden p-0.5 blue-gradient shrink-0">
              <img 
                src={adminAvatar} 
                alt={adminName} 
                className="w-full h-full rounded-full object-cover border-2 border-app-bg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-lg font-black font-display text-app-text">Admin Information</h3>
              <p className="text-[10px] text-brand-violet font-black uppercase tracking-wider mt-0.5 font-mono">ROOT ADMINISTRATIVE KEYS</p>
            </div>
          </div>

          <div className="space-y-4 font-semibold text-xs">
            <div className="flex justify-between items-center py-2 border-b border-app-border/40">
              <span className="text-app-muted">Personal Administrator</span>
              <span className="text-sm font-black text-app-text">{adminName}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-app-border/40">
              <span className="text-app-muted">Employee ID Index</span>
              <span className="text-sm font-black text-brand-blue font-mono">{empId}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-app-border/40">
              <span className="text-app-muted">System Designation</span>
              <span className="text-sm font-bold text-app-text">{designation}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-app-border/40">
              <span className="text-app-muted">Assigned Department</span>
              <span className="text-sm font-bold text-app-text">{department}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-app-border/40">
              <span className="text-app-muted">Key Registry Email</span>
              <span className="text-sm font-bold text-brand-blue font-mono">{adminEmail}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-app-muted">Verified Support Mobile</span>
              <span className="text-sm font-bold text-app-text font-mono">{adminPhone}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Area: Quick Actions */}
      <div className="p-6 md:p-8 rounded-[32px] glass border border-app-border/80 card-shadow space-y-4">
        <h3 className="text-base font-bold text-app-text font-display">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={onAddManagerClick}
            className="p-4 rounded-2xl bg-app-surface border border-app-border hover:border-brand-blue/30 text-left cursor-pointer group flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-black text-app-text block">Add Manager</span>
              <span className="text-[10px] text-app-muted block font-semibold">Deploy hiring lead</span>
            </div>
            <Plus className="w-5 h-5 text-brand-blue group-hover:scale-110 transition-transform" />
          </button>

          <button 
            onClick={onAddRecruiterClick}
            className="p-4 rounded-2xl bg-app-surface border border-app-border hover:border-brand-blue/30 text-left cursor-pointer group flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-black text-app-text block">Add Recruiter</span>
              <span className="text-[10px] text-app-muted block font-semibold">Assigned recruiter role</span>
            </div>
            <Plus className="w-5 h-5 text-brand-violet group-hover:scale-110 transition-transform" />
          </button>

          <button 
            onClick={() => onNavigate('employees')}
            className="p-4 rounded-2xl bg-app-surface border border-app-border hover:border-brand-blue/30 text-left cursor-pointer group flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-black text-app-text block">Bulk Upload Employees</span>
              <span className="text-[10px] text-app-muted block font-semibold">Bulk roster input</span>
            </div>
            <Upload className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
          </button>

          <button 
            onClick={() => onNavigate('jobs')}
            className="p-4 rounded-2xl bg-app-surface border border-app-border hover:border-brand-blue/30 text-left cursor-pointer group flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-black text-app-text block">Create New Job</span>
              <span className="text-[10px] text-app-muted block font-semibold">Initiate requirements</span>
            </div>
            <Plus className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

    </div>
  );
}
