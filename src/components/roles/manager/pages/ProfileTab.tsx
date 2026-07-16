import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { doc, collection, onSnapshot, query, where, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';
import { 
  User, 
  Mail, 
  Shield, 
  Building2, 
  CheckCircle, 
  Briefcase, 
  Award, 
  Users, 
  Lock, 
  Key,
  Database,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  BookOpen,
  Clock,
  Edit2,
  Check,
  X,
  AlertCircle,
  Camera,
  Bell
} from 'lucide-react';

export default function ProfileTab() {
  const { user } = useAuth();
  const [bdmProfile, setBdmProfile] = useState<any>(null);
  const [requirementsCreated, setRequirementsCreated] = useState(0);
  const [partnersSupervised, setPartnersSupervised] = useState(0);
  const [marketplaceDeals, setMarketplaceDeals] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  // Edit Mode states
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  const [skills, setSkills] = useState('');
  const [languages, setLanguages] = useState('');
  const [timezone, setTimezone] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [availability, setAvailability] = useState('Available');

  // Status and feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    // Fetch BDM document
    const unsubBdm = onSnapshot(doc(db, 'marketplace_bdms', user.uid), (snap) => {
      if (snap.exists()) {
        setBdmProfile(snap.data());
      }
    });

    // Fetch jobs created by BDM to compute requirements count and unique assigned recruiters
    const unsubJobs = onSnapshot(query(collection(db, 'marketplace_jobs'), where('createdBy', '==', user.uid)), (snap) => {
      const activeJobs = snap.docs.map(d => d.data());
      setRequirementsCreated(activeJobs.length);

      const recruiters = new Set<string>();
      activeJobs.forEach(job => {
        if (Array.isArray(job.assignedRecruiters)) {
          job.assignedRecruiters.forEach(id => recruiters.add(id));
        }
      });
      setPartnersSupervised(recruiters.size);
    });

    // Fetch submissions to compute marketplace deals
    const unsubSubs = onSnapshot(query(collection(db, 'marketplace_submissions'), where('bdmUid', '==', user.uid)), (snap) => {
      const bdmSubs = snap.docs.map(d => d.data());
      const dealsCount = bdmSubs.filter(s => s.status === 'Joined' || s.status === 'Selected' || s.status === 'Hired').length;
      setMarketplaceDeals(dealsCount);
    });

    return () => {
      unsubBdm();
      unsubJobs();
      unsubSubs();
    };
  }, [user]);

  // Sync form state when profile first loads or resets
  useEffect(() => {
    if (bdmProfile && !isEditing) {
      setFullName(bdmProfile.fullName || bdmProfile.name || '');
      setProfilePhotoUrl(bdmProfile.profilePhotoUrl || bdmProfile.img || '');
      setPhoneNumber(bdmProfile.phoneNumber || '');
      setDepartment(bdmProfile.department || '');
      setDesignation(bdmProfile.designation || '');
      setLocation(bdmProfile.location || '');
      setBio(bdmProfile.bio || '');
      setExperience(bdmProfile.experience || '');
      setLinkedin(bdmProfile.linkedin || '');
      setWebsite(bdmProfile.website || '');
      setSkills(bdmProfile.skills || '');
      setLanguages(bdmProfile.languages || '');
      setTimezone(bdmProfile.timezone || 'UTC-5 (EST)');
      setNotificationsEnabled(bdmProfile.notificationsEnabled !== false);
      setAvailability(bdmProfile.availability || 'Available');
    }
  }, [bdmProfile, isEditing]);

  const profileName = bdmProfile?.fullName || bdmProfile?.name || user?.displayName || 'Rohit Kumar';
  const profileEmail = user?.email || bdmProfile?.email || 'rohit.kumar@aryx.ai';
  const profileOrg = bdmProfile?.organization || bdmProfile?.organizationId || 'Aryx AI (Ecosystem 1)';
  const bdmId = user?.uid || 'BDM-MGR-879812A';

  const metrics = [
    { label: 'Requirements Created', value: `${requirementsCreated} Active`, icon: Briefcase },
    { label: 'Partners Supervised', value: `${partnersSupervised} Agencies`, icon: Users },
    { label: 'Marketplace Deals', value: `${marketplaceDeals} Placed`, icon: Award },
  ];

  const handleCopyId = () => {
    navigator.clipboard.writeText(bdmId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setValidationError('');
    setSuccessMessage('');

    // Form validation checks
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setValidationError('Full Name is required and cannot be empty.');
      return;
    }

    const trimmedPhone = phoneNumber.trim();
    const phoneRegex = /^[\d\s()+-]{7,20}$/;
    if (trimmedPhone && !phoneRegex.test(trimmedPhone)) {
      setValidationError('Please enter a valid phone number format (at least 7 characters consisting of numbers, spaces, +, -, or braces).');
      return;
    }

    // Verify duplicate writes (no-op check)
    const currentName = bdmProfile?.fullName || bdmProfile?.name || '';
    const currentPhoto = bdmProfile?.profilePhotoUrl || bdmProfile?.img || '';
    const currentPhone = bdmProfile?.phoneNumber || '';
    const currentDept = bdmProfile?.department || '';
    const currentDesig = bdmProfile?.designation || '';
    const currentLoc = bdmProfile?.location || '';
    const currentBio = bdmProfile?.bio || '';
    const currentExp = bdmProfile?.experience || '';
    const currentLinkedin = bdmProfile?.linkedin || '';
    const currentWeb = bdmProfile?.website || '';
    const currentSkills = bdmProfile?.skills || '';
    const currentLang = bdmProfile?.languages || '';
    const currentTimezone = bdmProfile?.timezone || 'UTC-5 (EST)';
    const currentNotifications = bdmProfile?.notificationsEnabled !== false;
    const currentAvailability = bdmProfile?.availability || 'Available';

    const hasChanges = 
      trimmedName !== currentName ||
      profilePhotoUrl.trim() !== currentPhoto ||
      trimmedPhone !== currentPhone ||
      department.trim() !== currentDept ||
      designation.trim() !== currentDesig ||
      location.trim() !== currentLoc ||
      bio.trim() !== currentBio ||
      experience.trim() !== currentExp ||
      linkedin.trim() !== currentLinkedin ||
      website.trim() !== currentWeb ||
      skills.trim() !== currentSkills ||
      languages.trim() !== currentLang ||
      timezone.trim() !== currentTimezone ||
      notificationsEnabled !== currentNotifications ||
      availability.trim() !== currentAvailability;

    if (!hasChanges) {
      setSuccessMessage('No changes detected. Profile up to date!');
      setIsEditing(false);
      return;
    }

    setIsSaving(true);

    try {
      const updateData: any = {
        fullName: trimmedName,
        name: trimmedName, // For complete backward compatibility
        profilePhotoUrl: profilePhotoUrl.trim(),
        img: profilePhotoUrl.trim(), // For complete backward compatibility
        phoneNumber: trimmedPhone,
        department: department.trim(),
        designation: designation.trim(),
        location: location.trim(),
        bio: bio.trim(),
        experience: experience.trim(),
        linkedin: linkedin.trim(),
        website: website.trim(),
        skills: skills.trim(),
        languages: languages.trim(),
        timezone: timezone.trim(),
        notificationsEnabled,
        availability: availability.trim(),
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'marketplace_bdms', user.uid), updateData);
      
      setSuccessMessage('Profile saved and updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error writing BDM profile to Firestore:', err);
      handleFirestoreError(err, OperationType.UPDATE, `marketplace_bdms/${user.uid}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in text-app-text">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text">Profile</h1>
          <p className="text-app-muted mt-1">Review, coordinate, and update your administrator security credentials.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold rounded-2xl flex items-center gap-2 text-xs transition-colors shadow"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile Details
          </button>
        )}
      </div>

      {/* Success and feedback banners */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-3 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center gap-3 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Profile Card & Info Box / Edit Mode Form */}
        <div className="md:col-span-8 p-6 sm:p-8 rounded-[32px] glass border border-app-border card-shadow space-y-6">
          
          {!isEditing ? (
            /* VIEW MODE */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <img 
                  src={profilePhotoUrl || bdmProfile?.img || 'https://picsum.photos/seed/manager/150/150'} 
                  alt={profileName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] object-cover border-2 border-brand-blue/30 p-1 bg-app-surface/50 shadow-md shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="text-center sm:text-left space-y-1.5 flex-1">
                  <span className="text-[10px] font-extrabold text-brand-blue bg-brand-blue/10 border border-brand-blue/15 px-3 py-1 rounded-full uppercase tracking-wider">
                    Verified BDM Administrator
                  </span>
                  <h2 className="text-2xl font-display font-bold text-app-text mt-1.5">{profileName}</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-app-muted font-semibold mt-2">
                    <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{profileOrg}</span>
                    </div>
                    {designation && (
                      <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{designation}</span>
                      </div>
                    )}
                    {department && (
                      <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                        <User className="w-3.5 h-3.5" />
                        <span>{department}</span>
                      </div>
                    )}
                    {location && (
                      <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio block if present */}
              {bio && (
                <div className="p-4 rounded-2xl bg-app-surface/20 border border-app-border/40 text-xs text-app-muted leading-relaxed font-semibold">
                  <p className="text-app-text font-bold mb-1">About Me</p>
                  {bio}
                </div>
              )}

              {/* Core Metrics Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-app-border/40">
                {metrics.map((met, idx) => (
                  <div key={idx} className="p-4 bg-app-surface/50 border border-app-border/50 rounded-2xl flex items-center gap-3">
                    <div className="p-2.5 bg-brand-blue/10 text-brand-blue rounded-xl shrink-0">
                      <met.icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">{met.label}</span>
                      <span className="text-sm font-extrabold text-app-text block mt-0.5">{met.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* More metadata / fields display */}
              <div className="space-y-3 pt-4 border-t border-app-border/40 text-xs font-semibold text-app-muted">
                <div className="flex justify-between items-center py-1.5 border-b border-app-border/30">
                  <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Phone Number</span>
                  <span className="text-app-text">{phoneNumber || 'Not Available'}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-app-border/30">
                  <span className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> Experience</span>
                  <span className="text-app-text">{experience || 'Not Available'}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-app-border/30">
                  <span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Website</span>
                  {website ? (
                    <a href={website} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">{website}</a>
                  ) : (
                    <span className="text-app-muted">Not Available</span>
                  )}
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-app-border/30">
                  <span className="flex items-center gap-2"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</span>
                  {linkedin ? (
                    <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">{linkedin}</a>
                  ) : (
                    <span className="text-app-muted">Not Available</span>
                  )}
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-app-border/30">
                  <span className="flex items-center gap-2"><Award className="w-3.5 h-3.5" /> Professional Skills</span>
                  <span className="text-app-text text-right break-words max-w-xs">{skills || 'Not Available'}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-app-border/30">
                  <span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Languages Spoken</span>
                  <span className="text-app-text">{languages || 'Not Available'}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-app-border/30">
                  <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Preferred Timezone</span>
                  <span className="text-app-text">{timezone || 'Not Available'}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-app-border/30">
                  <span className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" /> Core Availability</span>
                  <span className="text-emerald-500 font-bold">{availability || 'Not Available'}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-app-border/30">
                  <span className="flex items-center gap-2"><Bell className="w-3.5 h-3.5" /> Realtime Notifications</span>
                  <span className={`font-bold ${notificationsEnabled ? 'text-emerald-500' : 'text-app-muted'}`}>
                    {notificationsEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* EDIT MODE */
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-app-border/40">
                <h3 className="font-display font-bold text-lg text-app-text">Edit Administrator Profile</h3>
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setValidationError('');
                  }}
                  className="p-1 text-app-muted hover:text-app-text"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-app-muted font-bold block">Full Name <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rohit Kumar"
                      className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 pl-10 pr-4 text-app-text focus:outline-none focus:border-brand-blue font-semibold outline-none"
                    />
                  </div>
                </div>

                {/* Profile Photo URL */}
                <div className="space-y-1.5">
                  <label className="text-app-muted font-bold block">Profile Photo URL</label>
                  <div className="relative">
                    <Camera className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                    <input 
                      type="url" 
                      value={profilePhotoUrl}
                      onChange={(e) => setProfilePhotoUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 pl-10 pr-4 text-app-text focus:outline-none focus:border-brand-blue font-semibold outline-none"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-app-muted font-bold block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                    <input 
                      type="text" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 pl-10 pr-4 text-app-text focus:outline-none focus:border-brand-blue font-semibold outline-none"
                    />
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-app-muted font-bold block">Department</label>
                  <input 
                    type="text" 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Global Sourcing / Human Resources"
                    className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 px-4 text-app-text focus:outline-none focus:border-brand-blue font-semibold outline-none"
                  />
                </div>

                {/* Designation */}
                <div className="space-y-1.5">
                  <label className="text-app-muted font-bold block">Designation</label>
                  <input 
                    type="text" 
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Lead Sourcing Overseer"
                    className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 px-4 text-app-text focus:outline-none focus:border-brand-blue font-semibold outline-none"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-app-muted font-bold block">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. New Delhi, India"
                      className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 pl-10 pr-4 text-app-text focus:outline-none focus:border-brand-blue font-semibold outline-none"
                    />
                  </div>
                </div>

                {/* Bio (Col-span-2) */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-app-muted font-bold block">Professional Biography / Summary</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="Provide a summary of your professional ecosystem role..."
                    className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 px-4 text-app-text focus:outline-none focus:border-brand-blue font-semibold outline-none resize-none"
                  />
                </div>

                {/* Experience */}
                <div className="space-y-1.5">
                  <label className="text-app-muted font-bold block">Professional Experience</label>
                  <input 
                    type="text" 
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 8+ years"
                    className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 px-4 text-app-text focus:outline-none focus:border-brand-blue font-semibold outline-none"
                  />
                </div>

                {/* LinkedIn */}
                <div className="space-y-1.5">
                  <label className="text-app-muted font-bold block">LinkedIn Profile</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                    <input 
                      type="url" 
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 pl-10 pr-4 text-app-text focus:outline-none focus:border-brand-blue font-semibold outline-none"
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="space-y-1.5">
                  <label className="text-app-muted font-bold block">Personal Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                    <input 
                      type="url" 
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://mywebsite.com"
                      className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 pl-10 pr-4 text-app-text focus:outline-none focus:border-brand-blue font-semibold outline-none"
                    />
                  </div>
                </div>

                {/* Timezone */}
                <div className="space-y-1.5">
                  <label className="text-app-muted font-bold block">Preferred Timezone</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                    <input 
                      type="text" 
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      placeholder="UTC-5 (EST) / UTC+5.30 (IST)"
                      className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 pl-10 pr-4 text-app-text focus:outline-none focus:border-brand-blue font-semibold outline-none"
                    />
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-1.5">
                  <label className="text-app-muted font-bold block">Languages Spoken</label>
                  <input 
                    type="text" 
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    placeholder="e.g. English, Hindi, Spanish"
                    className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 px-4 text-app-text focus:outline-none focus:border-brand-blue font-semibold outline-none"
                  />
                </div>

                {/* Availability */}
                <div className="space-y-1.5">
                  <label className="text-app-muted font-bold block">Core Availability</label>
                  <select 
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 px-4 text-app-text focus:outline-none focus:border-brand-blue font-semibold outline-none cursor-pointer"
                  >
                    <option value="Available">Available / Active</option>
                    <option value="Busy">Busy (Meeting / Reviews)</option>
                    <option value="Away">Away / On Leave</option>
                  </select>
                </div>

                {/* Skills (Col-span-2) */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-app-muted font-bold block">Professional Skills (Comma Separated)</label>
                  <input 
                    type="text" 
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Node.js, AWS Architecture, Recruiting, Strategic Negotiation"
                    className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 px-4 text-app-text focus:outline-none focus:border-brand-blue font-semibold outline-none"
                  />
                </div>

                {/* Notifications toggle */}
                <div className="sm:col-span-2 py-2 flex items-center justify-between border-t border-b border-app-border/40 my-2">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-app-text block">Ecosystem Sync Notifications</span>
                    <span className="text-[10px] text-app-muted font-medium">Receive real-time alerts about recruiters, submissions, and job assignments.</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      notificationsEnabled ? 'bg-brand-blue' : 'bg-app-surface border-app-border'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-app-border/40">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setValidationError('');
                  }}
                  className="px-5 py-2.5 bg-app-surface hover:bg-app-surface/80 border border-app-border text-xs font-extrabold rounded-xl text-app-muted hover:text-app-text transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 text-xs font-extrabold text-white rounded-xl transition-all shadow flex items-center gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Security & System Info Box (4 Columns) - Non-Editable Metadata */}
        <div className="md:col-span-4 space-y-6">
          
          <div className="p-6 rounded-[32px] bg-gradient-to-br from-brand-violet/5 to-brand-blue/5 border border-brand-violet/10 card-shadow space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-violet shrink-0" />
              <h3 className="font-display font-bold text-base text-app-text">Security Metadata</h3>
            </div>
            
            <p className="text-[11px] text-app-muted leading-relaxed font-semibold">
              The following administrative parameters are read-only properties of your authenticated system credential.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Security Email</span>
                <div className="flex items-center gap-2 bg-app-bg/50 border border-app-border/60 p-2.5 rounded-xl text-xs font-mono font-bold text-app-text select-all">
                  <Mail className="w-3.5 h-3.5 text-app-muted shrink-0" />
                  <span className="truncate">{profileEmail}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Firebase UID</span>
                <div className="flex items-center gap-2 bg-app-bg/50 border border-app-border/60 p-2.5 rounded-xl text-xs font-mono font-bold text-app-text select-all">
                  <Key className="w-3.5 h-3.5 text-app-muted shrink-0" />
                  <span className="truncate">{bdmId}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Administrative Role</span>
                <div className="flex items-center gap-2 bg-app-bg/50 border border-app-border/60 p-2.5 rounded-xl text-xs font-mono font-bold text-app-text">
                  <Shield className="w-3.5 h-3.5 text-brand-violet shrink-0" />
                  <span>Marketplace BDM Manager</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Organization ID</span>
                <div className="flex items-center gap-2 bg-app-bg/50 border border-app-border/60 p-2.5 rounded-xl text-xs font-mono font-bold text-app-text">
                  <Building2 className="w-3.5 h-3.5 text-app-muted shrink-0" />
                  <span className="truncate">{bdmProfile?.organizationId || 'org_aryx_system'}</span>
                </div>
              </div>

              {bdmProfile?.createdAt && (
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Created At</span>
                  <div className="flex items-center gap-2 bg-app-bg/50 border border-app-border/60 p-2.5 rounded-xl text-xs font-mono font-bold text-app-muted">
                    <Clock className="w-3.5 h-3.5 text-app-muted shrink-0" />
                    <span>{bdmProfile?.createdAt}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Connected Services Box */}
          <div className="p-6 rounded-[32px] glass border border-app-border card-shadow space-y-4">
            <h3 className="font-display font-bold text-sm text-app-text">Connected Services</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Ecosystem Datastore Online</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Partner Sync Tunnel Active</span>
              </div>
            </div>
            <div className="pt-4 border-t border-app-border/40 text-[10px] font-bold text-app-muted uppercase tracking-wider">
              <span>SYSTEM BUILD</span>
              <span className="font-mono text-[11px] text-app-text block mt-1">v4.1.2-Stable Production</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
