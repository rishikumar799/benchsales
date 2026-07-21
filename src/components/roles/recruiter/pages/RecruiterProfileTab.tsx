import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Check, 
  Mail as MailIcon
} from 'lucide-react';
import { useRecruiter } from '../../../../context/RecruiterContext';
import { useAuth } from '../../../../context/AuthContext';

export default function RecruiterProfileTab() {
  const { user } = useAuth();
  const { recruiterProfile, updateProfile, loading } = useRecruiter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [dept, setDept] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const [success, setSuccess] = useState(false);

  // Sync internal fields with RecruiterContext once it loads
  useEffect(() => {
    if (recruiterProfile) {
      const prof: any = recruiterProfile.profile || {};
      const rec: any = recruiterProfile;
      setName(prof.fullName || rec.fullName || '');
      setEmail(prof.email || rec.email || '');
      setPhone(prof.phone || prof.phoneNumber || rec.phone || '');
      setLocation(prof.location || prof.address || rec.location || '');
      setDept(prof.dept || prof.department || rec.dept || '');
      setBio(prof.bio || rec.bio || '');
      setSkills(prof.skills || rec.skills || '');
      setExperience(prof.experience || rec.experience || '');
      setPortfolio(prof.portfolio || rec.portfolio || '');
      setLinkedin(prof.linkedin || rec.linkedin || '');
      setPhotoUrl(prof.photoUrl || prof.profilePhotoUrl || rec.photoUrl || '');
    }
  }, [recruiterProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        fullName: name,
        email,
        phone,
        location,
        dept,
        bio,
        skills,
        experience,
        portfolio,
        linkedin,
        photoUrl
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving recruiter profile:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-app-muted text-sm font-semibold">Loading profile information...</p>
      </div>
    );
  }

  const marketplaceId = recruiterProfile?.marketplaceId || `REC-${user?.uid?.slice(0, 6).toUpperCase()}`;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in text-left max-w-5xl">
      
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        
        {/* Left Column: Profile Card & System Metadata */}
        <div className="lg:col-span-4 space-y-6">
          {/* Summary Card */}
          <div className="p-6 rounded-[32px] bg-app-surface border border-app-border card-shadow flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-brand-blue/10 border-4 border-brand-blue flex items-center justify-center overflow-hidden shadow-lg relative">
              {photoUrl ? (
                <img 
                  src={photoUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-brand-blue font-black text-2xl">
                  {name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'PS'}
                </span>
              )}
              {/* Online badge */}
              <span className="w-4 h-4 bg-emerald-500 border-2 border-app-surface rounded-full absolute bottom-1 right-1" />
            </div>

            <div>
              <h3 className="font-display font-black text-lg text-app-text">{name || 'Recruiter Partner'}</h3>
              <p className="text-xs font-semibold text-brand-blue mt-0.5">{dept || 'Engineering Recruitment Division'}</p>
              <p className="text-[10px] text-app-muted font-bold tracking-wider uppercase mt-1">ARYX AI Corp</p>
            </div>

            <div className="w-full pt-4 border-t border-app-border/40 text-left space-y-3.5 text-xs font-bold text-app-muted">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-blue shrink-0" />
                <span className="text-app-text select-all truncate">{email || user?.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-blue shrink-0" />
                <span className="text-app-text select-all">{phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-brand-blue shrink-0" />
                <span className="text-app-text">{location || 'Bangalore, India'}</span>
              </div>
            </div>
          </div>

          {/* System Metadata Card (Read Only) */}
          <div className="p-6 rounded-[32px] bg-app-surface border border-app-border card-shadow space-y-4 text-left">
            <h3 className="text-sm font-display font-black text-app-text uppercase tracking-wider border-b border-app-border/40 pb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-blue" />
              Security & System Info
            </h3>
            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="text-[10px] text-app-muted uppercase block">Firebase UID</label>
                <span className="text-app-text font-mono text-[10px] select-all break-all">{user?.uid}</span>
              </div>
              <div>
                <label className="text-[10px] text-app-muted uppercase block">Ecosystem Role</label>
                <span className="text-app-text">Marketplace Recruiter</span>
              </div>
              <div>
                <label className="text-[10px] text-app-muted uppercase block">Marketplace ID</label>
                <span className="text-brand-blue font-mono">{marketplaceId}</span>
              </div>
              <div>
                <label className="text-[10px] text-app-muted uppercase block">Organization</label>
                <span className="text-app-text">ARYX AI Corp</span>
              </div>
              {recruiterProfile?.createdAt && (
                <div>
                  <label className="text-[10px] text-app-muted uppercase block">Created Date</label>
                  <span className="text-app-text font-normal">{new Date(recruiterProfile.createdAt).toLocaleString()}</span>
                </div>
              )}
              {recruiterProfile?.lastLogin && (
                <div>
                  <label className="text-[10px] text-app-muted uppercase block">Last Login</label>
                  <span className="text-app-text font-normal">{new Date(recruiterProfile.lastLogin).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Editable Profile Forms */}
        <div className="lg:col-span-8 p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-b-app-border/40">
            <User className="text-brand-blue w-5 h-5" />
            <h3 className="text-base font-display font-black text-app-text">Recruiter Profile Details</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section A: Contact & Personal */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-brand-blue">Contact Information</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-app-muted uppercase">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-app-muted uppercase">Phone Number</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-app-muted uppercase">Address / Location</label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-app-muted uppercase">Profile Photo URL</label>
                  <input 
                    type="url" 
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-app-muted uppercase">LinkedIn Profile</label>
                  <input 
                    type="url" 
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-app-muted uppercase">Portfolio Link</label>
                  <input 
                    type="url" 
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="https://portfolio.me"
                    className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-app-muted uppercase">Biography / Summary</label>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Tell potential candidates and teammates about your recruitment philosophy and background..."
                  className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue resize-none"
                />
              </div>
            </div>

            {/* Section B: Professional Profile */}
            <div className="space-y-4 pt-4 border-t border-app-border/40">
              <h4 className="text-xs font-black uppercase tracking-wider text-brand-blue">Professional Attributes</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-app-muted uppercase">Division / Department</label>
                  <input 
                    type="text" 
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-app-muted uppercase">Years of Experience</label>
                  <input 
                    type="text" 
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 8+ Years"
                    className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-app-muted uppercase">Core Skills / Domains (Comma Separated)</label>
                <input 
                  type="text" 
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Technical Sourcing, Executive Search, Talent Pipeline, React, Node.js"
                  className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            {/* Save Button */}
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
