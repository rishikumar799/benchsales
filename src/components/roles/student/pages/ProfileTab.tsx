import React, { useState, useEffect } from 'react';
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
  Edit2,
  X,
  Check
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';

export default function ProfileTab() {
  const { userProfile } = useAuth();
  const studentId = userProfile?.uid;
  const organizationId = userProfile?.organizationId;

  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form states
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  
  const [department, setDepartment] = useState('');
  const [branch, setBranch] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');

  const [skillsStr, setSkillsStr] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [portfolio, setPortfolio] = useState('');

  const [expectedSalary, setExpectedSalary] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('');
  const [empType, setEmpType] = useState('Full Time');

  // Load real-time Student Profile
  useEffect(() => {
    if (!organizationId || !studentId) return;
    const docRef = doc(db, 'organizations_universities', organizationId, 'students', studentId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setStudentData(data);
        
        // Populate edit form states
        setFullName(data.fullName || data.name || '');
        setRollNumber(data.rollNumber || '');
        setPhone(data.phoneNumber || data.phone || '');
        setDob(data.dob || '');
        setGender(data.gender || 'Male');
        setDepartment(data.department || data.dept || '');
        setBranch(data.branch || '');
        setCgpa(data.cgpa || '');
        setSemester(data.semester || '');
        setYear(data.year || '');
        setSkillsStr(Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || ''));
        setLinkedin(data.linkedin || '');
        setGithub(data.github || '');
        setPortfolio(data.portfolio || '');
        setExpectedSalary(data.salary || '');
        setNoticePeriod(data.noticePeriod || '');
        setEmpType(data.empType || 'Full Time');
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `organizations_universities/${organizationId}/students/${studentId}`);
    });
    return () => unsubscribe();
  }, [organizationId, studentId]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId || !studentId) return;

    try {
      const docRef = doc(db, 'organizations_universities', organizationId, 'students', studentId);
      const skillsArray = skillsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
      
      await updateDoc(docRef, {
        fullName,
        name: fullName, // Keep name synchronized
        rollNumber,
        phone,
        phoneNumber: phone, // Keep phoneNumber synchronized
        dob,
        gender,
        department,
        dept: department, // Keep dept synchronized
        branch,
        cgpa,
        semester,
        year,
        skills: skillsArray,
        linkedin,
        github,
        portfolio,
        salary: expectedSalary,
        noticePeriod,
        empType,
        updatedAt: new Date().toISOString()
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `organizations_universities/${organizationId}/students/${studentId}`);
      alert(`Failed to save profile: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-app-muted font-bold">
        Loading student profile...
      </div>
    );
  }

  const profile = {
    name: studentData?.fullName || studentData?.name || 'Rohit Kumar',
    rollNumber: studentData?.rollNumber || 'CS2022001',
    email: studentData?.email || userProfile?.email || 'rohit.kumar@email.com',
    phone: studentData?.phoneNumber || studentData?.phone || '+91 98765 43210',
    dob: studentData?.dob || '15 Aug 2004',
    gender: studentData?.gender || 'Male',
    university: studentData?.university || "St. Xavier's University",
    department: studentData?.department || studentData?.dept || 'Computer Science Engineering',
    degree: studentData?.degree || 'B.Tech',
    batch: studentData?.year || studentData?.batch || '2026',
    cgpa: studentData?.cgpa ? `${studentData.cgpa} / 10` : '8.45 / 10',
    semester: studentData?.semester || '6th Semester',
    roles: [studentData?.department || 'Software Engineer'],
    locations: ['Bangalore', 'Hyderabad', 'Pune'],
    salary: studentData?.salary || '6 - 8 LPA',
    empType: studentData?.empType || 'Full Time',
    noticePeriod: studentData?.noticePeriod || '2 Months',
    skills: Array.isArray(studentData?.skills) ? studentData.skills : ['React.js', 'TypeScript', 'Tailwind CSS'],
    linkedin: studentData?.linkedin || 'linkedin.com/in/rohitkumar',
    github: studentData?.github || 'github.com/rohitkumar',
    portfolio: studentData?.portfolio || 'rohitkumar.dev'
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-app-text">Profile</h2>
          <p className="text-app-muted">Manage your personal and academic placement record profile.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 font-bold text-xs rounded-lg border border-emerald-500/10">
            Verified Account
          </span>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSaveChanges} className="glass border-app-border rounded-[28px] p-6 sm:p-8 card-shadow space-y-6">
          <div className="flex justify-between items-center border-b border-app-border/40 pb-4">
            <h3 className="font-display font-bold text-xl text-app-text-active">Edit Placement Profile</h3>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)} 
              className="p-1.5 hover:bg-app-surface border border-app-border rounded-xl text-app-muted hover:text-app-text"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Details Form Section */}
            <div className="space-y-4">
              <h4 className="font-display font-bold text-sm text-brand-blue uppercase tracking-wider">Personal Information</h4>
              
              <div>
                <label className="text-[10px] font-bold text-app-muted uppercase block mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-app-surface/60 border border-app-border rounded-xl px-4 py-2.5 text-sm text-app-text focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-app-muted uppercase block mb-1">Roll Number</label>
                  <input 
                    type="text" 
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full bg-app-surface/60 border border-app-border rounded-xl px-4 py-2.5 text-sm text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-app-muted uppercase block mb-1">Phone</label>
                  <input 
                    type="text" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-app-surface/60 border border-app-border rounded-xl px-4 py-2.5 text-sm text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-app-muted uppercase block mb-1">Date of Birth</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 15 Aug 2004"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-app-surface/60 border border-app-border rounded-xl px-4 py-2.5 text-sm text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-app-muted uppercase block mb-1">Gender</label>
                  <select 
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-app-surface/60 border border-app-border rounded-xl px-4 py-2.5 text-sm text-app-text focus:outline-none focus:border-brand-blue cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Academic Details Form Section */}
            <div className="space-y-4">
              <h4 className="font-display font-bold text-sm text-brand-blue uppercase tracking-wider">Academic Placement Details</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-app-muted uppercase block mb-1">Department</label>
                  <input 
                    type="text" 
                    placeholder="e.g. CSE, ECE"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-app-surface/60 border border-app-border rounded-xl px-4 py-2.5 text-sm text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-app-muted uppercase block mb-1">Branch</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Software, Systems"
                    required
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-app-surface/60 border border-app-border rounded-xl px-4 py-2.5 text-sm text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-app-muted uppercase block mb-1">CGPA</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 8.45"
                    required
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    className="w-full bg-app-surface/60 border border-app-border rounded-xl px-4 py-2.5 text-sm text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-app-muted uppercase block mb-1">Semester</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 6th"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full bg-app-surface/60 border border-app-border rounded-xl px-4 py-2.5 text-sm text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-app-muted uppercase block mb-1">Passout Year</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 2026"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-app-surface/60 border border-app-border rounded-xl px-4 py-2.5 text-sm text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-app-muted uppercase block mb-1">Skills Stack (Comma-separated)</label>
                <input 
                  type="text" 
                  placeholder="Java, React.js, Python, Git"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  className="w-full bg-app-surface/60 border border-app-border rounded-xl px-4 py-2.5 text-sm text-app-text focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>
          </div>

          {/* Preferences & Networks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-app-border/40">
            <div className="space-y-4">
              <h4 className="font-display font-bold text-sm text-brand-blue uppercase tracking-wider">Career Preferences</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-app-muted uppercase block mb-1">Expected CTC package</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 6 - 8 LPA"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    className="w-full bg-app-surface/60 border border-app-border rounded-xl px-4 py-2.5 text-sm text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-app-muted uppercase block mb-1">Notice Period</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Immediate, 1 Month"
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    className="w-full bg-app-surface/60 border border-app-border rounded-xl px-4 py-2.5 text-sm text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-display font-bold text-sm text-brand-blue uppercase tracking-wider">Connected Networks</h4>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-app-muted uppercase block mb-1">LinkedIn Username</label>
                  <input 
                    type="text" 
                    placeholder="linkedin.com/in/rohitkumar"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full bg-app-surface/60 border border-app-border rounded-xl px-3 py-2 text-xs text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-app-muted uppercase block mb-1">GitHub Username</label>
                  <input 
                    type="text" 
                    placeholder="github.com/rohitkumar"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full bg-app-surface/60 border border-app-border rounded-xl px-3 py-2 text-xs text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-app-muted uppercase block mb-1">Portfolio Domain</label>
                  <input 
                    type="text" 
                    placeholder="rohitkumar.dev"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    className="w-full bg-app-surface/60 border border-app-border rounded-xl px-3 py-2 text-xs text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-app-border/40">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 bg-app-surface hover:bg-app-surface/80 border border-app-border text-app-text font-bold rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white font-extrabold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-brand-blue/20"
            >
              <Check className="w-4 h-4" /> Save Placement Record
            </button>
          </div>
        </form>
      ) : (
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
                    src={studentData?.photoURL || `https://picsum.photos/seed/${studentId}/200/200`} 
                    alt={profile.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover border-4 border-app-bg"
                  />
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-app-bg" />
                </div>
                <div>
                  <h4 className="font-display font-black text-base text-app-text">{profile.name}</h4>
                  <p className="text-xs text-app-muted font-bold uppercase tracking-wider">{profile.rollNumber} • {studentData?.branch || "CSE"}</p>
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
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-brand-violet hover:bg-brand-violet-dark text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-brand-violet/20 flex items-center gap-2"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile Details
              </button>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
