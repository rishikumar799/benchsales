import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  BookOpen, 
  TrendingUp, 
  Globe, 
  Linkedin, 
  Github, 
  GraduationCap, 
  MapPin, 
  Briefcase, 
  Calendar,
  Lock,
  Edit2
} from 'lucide-react';

export default function ProfileTab() {
  const [profile, setProfile] = useState({
    name: 'Rohit Kumar',
    rollNumber: 'CS2022001',
    email: 'rohit.kumar@email.com',
    phone: '+91 98765 43210',
    dob: '15 Aug 2004',
    gender: 'Male',
    university: "St. Xavier's University",
    department: 'Computer Science Engineering',
    degree: 'B.Tech',
    batch: '2026',
    cgpa: '8.45 / 10',
    semester: '6th Semester',
    roles: ['Software Engineer', 'Full Stack Developer'],
    locations: ['Bangalore', 'Hyderabad', 'Pune'],
    salary: '6 - 8 LPA',
    empType: 'Full Time',
    noticePeriod: '2 Months',
    skills: [
      'Java', 'JavaScript', 'React.js', 'HTML', 'CSS', 
      'SQL', 'Data Structures', 'Problem Solving', 'Git', 'Node.js', 'MongoDB'
    ],
    linkedin: 'linkedin.com/in/rohitkumar',
    github: 'github.com/rohitkumar',
    portfolio: 'rohitkumar.dev'
  });

  const handleEditProfile = () => {
    alert('Updating profile data has been locked by University Placement Cell to ensure verified credentials index.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-app-text">Profile</h2>
          <p className="text-app-muted">Manage your personal and academic placement record profile.</p>
        </div>
        <button 
          onClick={handleEditProfile}
          className="px-4 py-2.5 bg-brand-violet/10 text-brand-violet hover:bg-brand-violet/15 border border-brand-violet/15 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <Lock className="w-3.5 h-3.5" /> Lock Verification
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Personal Information */}
        <div className="lg:col-span-1 p-6 rounded-[28px] glass border-app-border card-shadow flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-display font-bold text-lg text-app-text-active flex items-center gap-2 border-b border-app-border/40 pb-3">
              <User className="w-5 h-5 text-brand-blue" /> Personal Information
            </h3>
            
            {/* Round Avatar visual matching image exactly */}
            <div className="flex flex-col items-center text-center space-y-3.5 py-4 bg-app-surface/40 rounded-2xl border border-app-border">
              <div className="w-24 h-24 rounded-full blue-gradient p-0.5 shadow-lg relative">
                <img 
                  src="https://picsum.photos/seed/rohit123/200/200" 
                  alt="Rohit Kumar" 
                  className="w-full h-full rounded-full object-cover border-4 border-app-bg"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-app-bg" />
              </div>
              <div>
                <h4 className="font-display font-black text-base text-app-text">{profile.name}</h4>
                <p className="text-xs text-app-muted font-bold uppercase tracking-wider">{profile.rollNumber} • CSE</p>
              </div>
            </div>

            {/* Information Grid fields */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between items-center py-2.5 border-b border-app-border/30">
                <span className="text-app-muted font-bold uppercase tracking-wider">Full Name</span>
                <span className="font-extrabold text-app-text">{profile.name}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-app-border/30">
                <span className="text-app-muted font-bold uppercase tracking-wider">Roll Number</span>
                <span className="font-extrabold text-app-text">{profile.rollNumber}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-app-border/30">
                <span className="text-app-muted font-bold uppercase tracking-wider">Email</span>
                <span className="font-extrabold text-app-text text-brand-blue">{profile.email}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-app-border/30">
                <span className="text-app-muted font-bold uppercase tracking-wider">Phone</span>
                <span className="font-extrabold text-app-text">{profile.phone}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-app-border/30">
                <span className="text-app-muted font-bold uppercase tracking-wider">Date of Birth</span>
                <span className="font-extrabold text-app-text">{profile.dob}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-app-muted font-bold uppercase tracking-wider">Gender</span>
                <span className="font-extrabold text-app-text">{profile.gender}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right Column split for Academic & Career */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Grid of Academic and Career */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Academic Information */}
            <div className="p-6 rounded-[28px] glass border-app-border card-shadow">
              <h3 className="font-display font-bold text-lg text-app-text-active flex items-center gap-2 border-b border-app-border/40 pb-3 mb-4">
                <GraduationCap className="w-5 h-5 text-brand-blue" /> Academic Information
              </h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">University</span>
                  <span className="font-extrabold text-app-text text-sm">{profile.university}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Department</span>
                  <span className="font-extrabold text-app-text">{profile.department}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Degree</span>
                    <span className="font-extrabold text-app-text">{profile.degree}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Batch</span>
                    <span className="font-extrabold text-app-text">{profile.batch}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-app-border/40">
                  <div>
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">CGPA Score</span>
                    <span className="font-black text-brand-blue text-base">{profile.cgpa}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Semester</span>
                    <span className="font-extrabold text-app-text">{profile.semester}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Preferences */}
            <div className="p-6 rounded-[28px] glass border-app-border card-shadow">
              <h3 className="font-display font-bold text-lg text-app-text-active flex items-center gap-2 border-b border-app-border/40 pb-3 mb-4">
                <Briefcase className="w-5 h-5 text-brand-blue" /> Career Preferences
              </h3>
              
              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block mb-1">Preferred Roles</span>
                  <div className="flex flex-wrap gap-1">
                    {profile.roles.map(r => (
                      <span key={r} className="bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded text-[10px] font-extrabold">{r}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block mb-1">Preferred Locations</span>
                  <div className="flex flex-wrap gap-1">
                    {profile.locations.map(loc => (
                      <span key={loc} className="bg-app-surface text-app-text px-2 py-0.5 rounded text-[10px] font-bold border border-app-border">{loc}</span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Expected CTC Package</span>
                    <span className="font-extrabold text-app-text">{profile.salary}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Employment Mode</span>
                    <span className="font-extrabold text-app-text">{profile.empType}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Verified Notice Period</span>
                  <span className="font-extrabold text-app-text">{profile.noticePeriod}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom section: Skills Tag List */}
          <div className="p-6 rounded-[28px] glass border-app-border card-shadow">
            <h3 className="font-display font-bold text-lg text-app-text-active flex items-center gap-2 border-b border-app-border/40 pb-3 mb-4">
              <TrendingUp className="w-5 h-5 text-brand-blue" /> Skills Stack
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {profile.skills.map((sk) => (
                <span key={sk} className="text-xs font-bold bg-app-surface/80 border border-app-border text-app-text px-3 py-1.5 rounded-xl block transition-all hover:border-brand-blue/30 cursor-default">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="p-6 rounded-[28px] glass border-app-border card-shadow">
            <h3 className="font-display font-bold text-lg text-app-text-active flex items-center gap-2 border-b border-app-border/40 pb-3 mb-4">
              <Globe className="w-5 h-5 text-brand-blue" /> Connected Networks
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-3 rounded-xl bg-app-surface border border-app-border flex items-center gap-2.5">
                <Linkedin className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="truncate text-xs">
                  <span className="font-bold text-app-muted block text-[10px] uppercase leading-none mb-0.5">LinkedIn</span>
                  <span className="font-semibold text-app-text truncate">{profile.linkedin}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-app-surface border border-app-border flex items-center gap-2.5">
                <Github className="w-4 h-4 text-app-text shrink-0" />
                <div className="truncate text-xs">
                  <span className="font-bold text-app-muted block text-[10px] uppercase leading-none mb-0.5">GitHub</span>
                  <span className="font-semibold text-app-text truncate">{profile.github}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-app-surface border border-app-border flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-brand-blue shrink-0" />
                <div className="truncate text-xs">
                  <span className="font-bold text-app-muted block text-[10px] uppercase leading-none mb-0.5">Portfolio</span>
                  <span className="font-semibold text-app-text truncate">{profile.portfolio}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Edit Profile verify button */}
          <div className="flex justify-end pt-2">
            <button 
              onClick={handleEditProfile}
              className="px-6 py-3 bg-brand-violet hover:bg-brand-violet-dark text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-brand-violet/20 flex items-center gap-2"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Profile Details
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
