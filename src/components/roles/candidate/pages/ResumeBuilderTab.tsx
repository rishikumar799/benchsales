import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Eye, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  FileText,
  Upload,
  X,
  Plus,
  Trash2,
  Save,
  Languages,
  BookOpen,
  Briefcase,
  Layers,
  GraduationCap,
  Award,
  Users
} from 'lucide-react';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';

export default function ResumeBuilderTab() {
  const { user, userProfile } = useAuth();
  const uid = user?.uid || userProfile?.uid;

  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(true);

  // Resume builder states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [headline, setHeadline] = useState('');
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [projects, setProjects] = useState('');
  const [education, setEducation] = useState('');
  const [certifications, setCertifications] = useState('');
  const [languages, setLanguages] = useState('');
  const [references, setReferences] = useState('');
  
  const [uploadedResume, setUploadedResume] = useState<{name: string, date: string} | null>(null);
  
  const [isUploadingModalOpen, setIsUploadingModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const steps = [
    { id: 1, label: 'Personal Details', icon: FileText },
    { id: 2, label: 'Professional Summary', icon: Sparkles },
    { id: 3, label: 'Skills & Tech Stack', icon: Layers },
    { id: 4, label: 'Professional History', icon: Briefcase },
    { id: 5, label: 'Key Projects', icon: BookOpen },
    { id: 6, label: 'Education', icon: GraduationCap },
    { id: 7, label: 'Certifications', icon: Award },
    { id: 8, label: 'Languages', icon: Languages },
    { id: 9, label: 'References', icon: Users }
  ];

  // Real-time Firestore Sync
  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'marketplace_jobseekers', uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const resData = data.resume || {};

        // Populate fields from Firestore resume or fallback to profile data or defaults
        setFullName(resData.fullName ?? data.profile?.fullName ?? data.fullName ?? 'Rishi Kumar');
        setEmail(resData.email ?? data.profile?.email ?? data.email ?? 'rishi.kumar@email.com');
        setPhone(resData.phone ?? data.profile?.phoneNumber ?? data.phone ?? '+91 98765 43210');
        setLocation(resData.location ?? data.profile?.location ?? data.location ?? 'Hyderabad, India');
        setLinkedin(resData.linkedin ?? data.profile?.linkedin ?? data.linkedin ?? 'linkedin.com/in/rishi-kumar');
        setPortfolio(resData.portfolio ?? data.profile?.portfolio ?? data.portfolio ?? 'rishikumar.dev');
        setHeadline(resData.headline ?? data.profile?.headline ?? data.headline ?? 'Senior Software Engineer');
        setSummary(resData.summary ?? data.profile?.bio ?? data.bio ?? 'Passionate full stack developer with experience building modern web applications. Always eager to learn new technologies and solve real-world problems.');

        // Convert skills list or string
        let dbSkills = '';
        if (typeof resData.skills === 'string') {
          dbSkills = resData.skills;
        } else if (Array.isArray(resData.skills)) {
          dbSkills = resData.skills.join(', ');
        } else if (Array.isArray(data.profile?.skills)) {
          dbSkills = data.profile.skills.join(', ');
        } else if (typeof data.profile?.skills === 'string') {
          dbSkills = data.profile.skills;
        }
        setSkills(dbSkills || 'React, TypeScript, Tailwind CSS, Node.js, Firebase, PostgreSQL');

        setExperience(resData.experience ?? 'Frontend Engineering Intern at Google (Jan 2025 - Present)\nFull Stack Developer at Aryx Labs (May 2024 - Dec 2024)');
        setProjects(resData.projects ?? 'ARYX AI - Smart candidate matching portal using Gemini SDK.\nZenCode - A collaborative browser-based visual programming playground.');
        setEducation(resData.education ?? 'B.Tech in Computer Science & Engineering, Aryx University (2022 - 2026) - CGPA 9.2/10');
        setCertifications(resData.certifications ?? 'Google Cloud Certified Professional Cloud Developer (2025)\nReact Advanced Core Architecture - Meta (2024)');
        setLanguages(resData.languages ?? data.profile?.languages ?? 'English, Telugu, Hindi');
        setReferences(resData.references ?? 'John Mathew (BDM at ARYX Labs) - john.mathew@aryx.dev');
        setUploadedResume(resData.uploadedResume ?? null);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `marketplace_jobseekers/${uid}`);
    });

    return () => unsubscribe();
  }, [uid]);

  // Dynamically calculate Resume Completion Score & Details
  const getResumeScoreAndDetails = () => {
    let score = 0;
    const details = [
      { name: 'Personal Details', status: 'Incomplete', complete: false },
      { name: 'Professional Summary', status: 'Incomplete', complete: false },
      { name: 'Skills & Tech Stack', status: 'Incomplete', complete: false },
      { name: 'Work & Experience', status: 'Incomplete', complete: false }
    ];

    // Personal Details (max 25%)
    if (fullName && email && phone && location) {
      score += 25;
      details[0].status = 'Excellent';
      details[0].complete = true;
    } else if (fullName || email || phone || location) {
      score += 12;
      details[0].status = 'Good';
      details[0].complete = true;
    }

    // Professional Summary (max 25%)
    if (headline && summary) {
      score += 25;
      details[1].status = 'Excellent';
      details[1].complete = true;
    } else if (headline || summary) {
      score += 12;
      details[1].status = 'Good';
      details[1].complete = true;
    }

    // Skills (max 20%)
    if (skills && skills.trim().length > 5) {
      score += 20;
      details[2].status = 'Excellent';
      details[2].complete = true;
    }

    // Core content completion (max 30%)
    let extraPoints = 0;
    if (experience && experience.trim().length > 10) extraPoints += 5;
    if (projects && projects.trim().length > 10) extraPoints += 5;
    if (education && education.trim().length > 10) extraPoints += 5;
    if (certifications && certifications.trim().length > 10) extraPoints += 5;
    if (languages && languages.trim().length > 3) extraPoints += 5;
    if (references && references.trim().length > 10) extraPoints += 5;

    score += extraPoints;

    if (extraPoints >= 25) {
      details[3].status = 'Excellent';
      details[3].complete = true;
    } else if (extraPoints >= 15) {
      details[3].status = 'Good';
      details[3].complete = true;
    }

    return { score, details };
  };

  const { score: resumeScore, details: criteriaChecks } = getResumeScoreAndDetails();

  // Save changes to Firestore
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!uid) return;

    try {
      const updatedResume = {
        fullName,
        email,
        phone,
        location,
        linkedin,
        portfolio,
        headline,
        summary,
        skills,
        experience,
        projects,
        education,
        certifications,
        languages,
        references,
        resumeCompletion: resumeScore,
        uploadedResume,
        updatedAt: new Date().toISOString()
      };

      const docRef = doc(db, 'marketplace_jobseekers', uid);
      await updateDoc(docRef, {
        resume: updatedResume,
        'ai_profile.resumeScore': resumeScore,
        activity: arrayUnion({
          id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          action: 'Resume Updated',
          timestamp: new Date().toISOString(),
          details: `Saved changes to step ${activeStep} of the resume builder. Progress is at ${resumeScore}%.`
        })
      });

      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        // Advance to next step if possible
        if (activeStep < steps.length) {
          setActiveStep(prev => prev + 1);
        }
      }, 1200);

    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!uid) return;
    setUploadSuccess(true);
    const newResume = {
      name: file.name,
      date: new Date().toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    try {
      const docRef = doc(db, 'marketplace_jobseekers', uid);
      await updateDoc(docRef, {
        'resume.uploadedResume': newResume,
        'resume.updatedAt': new Date().toISOString(),
        'ai_profile.resumeScore': 100,
        activity: arrayUnion({
          id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          action: 'Resume Document Uploaded',
          timestamp: new Date().toISOString(),
          details: `Uploaded custom resume file: ${file.name}`
        })
      });

      setTimeout(() => {
        setUploadedResume(newResume);
        setUploadSuccess(false);
        setIsUploadingModalOpen(false);
      }, 1200);

    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
    }
  };

  const triggerDownloadPDF = () => {
    // Beautiful dynamic print styling or alert alternative
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-app-muted font-bold">Synchronizing with Firestore secure node...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Upper header action items */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text tracking-tight">Resume Builder</h1>
          <p className="text-xs text-app-muted font-bold mt-1">
            {uploadedResume 
              ? `Active: ${uploadedResume.name} • Uploaded ${uploadedResume.date}` 
              : 'My Active Resume • Fully synchronized with Firestore Cloud Database'}
          </p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <button 
            id="btn-upload-resume"
            onClick={() => setIsUploadingModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-xs font-bold text-indigo-400 rounded-xl flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" /> Upload Existing Resume
          </button>

          <button 
            id="btn-preview-resume"
            onClick={() => setShowPreviewModal(true)}
            className="px-4 py-2.5 bg-app-surface hover:bg-app-surface/80 border border-app-border text-xs font-bold text-app-text rounded-xl flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-brand-blue" /> Preview
          </button>
          
          <button 
            id="btn-download-pdf"
            onClick={triggerDownloadPDF}
            className="px-4 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-xs font-bold text-white rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-brand-blue/20 cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" /> Print / PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step checklist sidebar (Left Column) */}
        <div className="lg:col-span-3 space-y-2">
          {steps.map((st) => {
            const StepIcon = st.icon;
            return (
              <button
                key={st.id}
                id={`step-btn-${st.id}`}
                onClick={() => setActiveStep(st.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left text-xs font-bold border transition-all cursor-pointer ${
                  activeStep === st.id
                    ? 'bg-brand-blue border-brand-blue text-white shadow-md shadow-brand-blue/15'
                    : activeStep > st.id 
                      ? 'bg-brand-blue/5 border-brand-blue/15 text-brand-blue hover:bg-brand-blue/10'
                      : 'bg-app-surface border-app-border text-app-muted hover:text-app-text'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    activeStep === st.id 
                      ? 'bg-white text-brand-blue'
                      : activeStep > st.id
                        ? 'bg-brand-blue text-white'
                        : 'bg-app-bg text-app-muted'
                  }`}>
                    {st.id}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <StepIcon className="w-3.5 h-3.5 opacity-80" />
                    {st.label}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            );
          })}
        </div>

        {/* Interactive Form panel (Middle Column) */}
        <div className="lg:col-span-6 p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow h-fit space-y-6">
          <div className="flex justify-between items-center border-b border-app-border/40 pb-4">
            <h2 className="text-base font-bold text-app-text">{steps.find(s => s.id === activeStep)?.label}</h2>
            <span className="text-[10px] font-bold text-app-muted uppercase">Step {activeStep} of 9</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              <form onSubmit={handleSave} className="space-y-4">
                {activeStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Full Name</label>
                        <input 
                          id="input-fullname"
                          type="text" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Email Address</label>
                        <input 
                          id="input-email"
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                          placeholder="Your email address"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Phone Number</label>
                        <input 
                          id="input-phone"
                          type="text" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                          placeholder="Your contact number"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Physical Location</label>
                        <input 
                          id="input-location"
                          type="text" 
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                          placeholder="City, Country"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">LinkedIn Profile</label>
                        <input 
                          id="input-linkedin"
                          type="text" 
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                          placeholder="linkedin.com/in/username"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Portfolio URL / Github</label>
                        <input 
                          id="input-portfolio"
                          type="text" 
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                          className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                          placeholder="portfolio.dev / github.com"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Professional Headline</label>
                      <input 
                        id="input-headline"
                        type="text" 
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                        placeholder="e.g. Senior Full Stack Engineer | React & Cloud Architect"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Professional Summary</label>
                      <textarea 
                        id="textarea-summary"
                        rows={5}
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Write a brief professional overview summarizing your expertise, career accomplishments, and primary focus..."
                        className="w-full bg-app-bg border border-app-border rounded-xl p-4 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Core Skills & Tech Stack</label>
                      <textarea 
                        id="textarea-skills"
                        rows={4}
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="Enter your skills separated by commas (e.g. React, TypeScript, Node.js, Cloud)"
                        className="w-full bg-app-bg border border-app-border rounded-xl p-4 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                    {skills && (
                      <div className="p-4 bg-app-bg border border-app-border/60 rounded-xl space-y-2">
                        <label className="text-[9px] font-bold text-app-muted uppercase tracking-widest block">Live Visual Tags</label>
                        <div className="flex flex-wrap gap-1.5">
                          {skills.split(',').map((s, i) => {
                            const trimmed = s.trim();
                            if (!trimmed) return null;
                            return (
                              <span key={i} className="px-2 py-1 bg-brand-blue/10 border border-brand-blue/20 text-brand-blue rounded-lg text-[10px] font-bold">
                                {trimmed}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeStep === 4 && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Professional History / Experience</label>
                      <textarea 
                        id="textarea-experience"
                        rows={6}
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="Format: Role at Company Name (Duration)&#10;- Key responsibility or achievement&#10;- Technologies used"
                        className="w-full bg-app-bg border border-app-border rounded-xl p-4 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                    <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                      <p className="text-[10px] text-indigo-400 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Recommendation
                      </p>
                      <p className="text-[10px] text-app-muted mt-1">
                        List positions in reverse chronological order. Begin statements with strong action verbs (e.g., Designed, Spearheaded, Optimized).
                      </p>
                    </div>
                  </div>
                )}

                {activeStep === 5 && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Key Projects</label>
                      <textarea 
                        id="textarea-projects"
                        rows={6}
                        value={projects}
                        onChange={(e) => setProjects(e.target.value)}
                        placeholder="Format: Project Name - Description of what was built and major tech stack involved."
                        className="w-full bg-app-bg border border-app-border rounded-xl p-4 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                  </div>
                )}

                {activeStep === 6 && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Education</label>
                      <textarea 
                        id="textarea-education"
                        rows={5}
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        placeholder="Format: Degree in Specialization, Institution Name (Graduation Year)"
                        className="w-full bg-app-bg border border-app-border rounded-xl p-4 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                  </div>
                )}

                {activeStep === 7 && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Certifications</label>
                      <textarea 
                        id="textarea-certifications"
                        rows={5}
                        value={certifications}
                        onChange={(e) => setCertifications(e.target.value)}
                        placeholder="Format: Certificate Name, Issuing Institution (Year)"
                        className="w-full bg-app-bg border border-app-border rounded-xl p-4 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                  </div>
                )}

                {activeStep === 8 && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Spoken Languages</label>
                      <textarea 
                        id="textarea-languages"
                        rows={4}
                        value={languages}
                        onChange={(e) => setLanguages(e.target.value)}
                        placeholder="Format: English (Fluent), Spanish (Conversational), Telugu (Native)"
                        className="w-full bg-app-bg border border-app-border rounded-xl p-4 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                  </div>
                )}

                {activeStep === 9 && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Professional References</label>
                      <textarea 
                        id="textarea-references"
                        rows={5}
                        value={references}
                        onChange={(e) => setReferences(e.target.value)}
                        placeholder="Format: Name (Position, Company) - Contact Email or Phone"
                        className="w-full bg-app-bg border border-app-border rounded-xl p-4 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-app-border/40">
                  <span className="text-[10px] text-app-muted font-bold">
                    * Saved directly to Cloud Firestore
                  </span>
                  <button 
                    id="submit-save-button"
                    type="submit" 
                    className="px-5 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs rounded-xl shadow-md uppercase tracking-wide flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {showMessage ? 'Synchronized!' : activeStep === 9 ? 'Complete & Save' : 'Save & Continue'}
                  </button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Resume Health Index (Right Column) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow flex flex-col items-center">
            <h3 className="text-base font-bold text-app-text mb-4 w-full text-left">Resume Score</h3>
            
            {/* Visual Circular Progress */}
            <div className="relative w-32 h-32 flex items-center justify-center my-1.5">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-app-border" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="56" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="351" 
                  strokeDashoffset={351 - (351 * resumeScore) / 100} 
                  className="text-brand-blue transition-all duration-500" 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-display font-black text-app-text">{resumeScore}%</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${resumeScore >= 80 ? 'text-emerald-500' : resumeScore >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                  {resumeScore >= 80 ? 'Excellent' : resumeScore >= 50 ? 'Good' : 'Needs Work'}
                </span>
              </div>
            </div>

            {/* Criteria checks list */}
            <div className="w-full text-left space-y-3.5 mt-6 border-t border-app-border/40 pt-4">
              {criteriaChecks.map((criteria, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${criteria.complete ? 'text-emerald-500' : 'text-app-muted'}`} />
                    <span className="text-app-text font-semibold">{criteria.name}</span>
                  </div>
                  <span className={`text-[10px] font-mono ${criteria.complete ? 'text-emerald-500' : 'text-app-muted'}`}>
                    {criteria.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Hint alert card at bottom */}
            <div className="p-4 rounded-xl bg-brand-blue/5 border border-brand-blue/10 flex gap-3 mt-6">
              <AlertCircle className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-app-muted font-medium">
                <strong className="text-app-text">ATS Tip:</strong> Avoid complicated multicolumn designs or image files. A cleanly structured text layout is read perfectly by ATS software.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Existing Resume Modal */}
      <AnimatePresence>
        {isUploadingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-app-bg border border-app-border rounded-[28px] overflow-hidden card-shadow p-6 space-y-6"
            >
              <div className="flex justify-between items-center border-b border-app-border/40 pb-4">
                <div>
                  <h3 className="text-base font-bold text-app-text">Upload Existing Resume</h3>
                  <p className="text-xs text-app-muted mt-0.5">Support PDF, DOCX formats up to 10MB</p>
                </div>
                <button 
                  onClick={() => setIsUploadingModalOpen(false)}
                  className="p-1.5 rounded-full bg-app-surface hover:bg-app-surface/80 border border-app-border text-app-muted hover:text-app-text transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {uploadSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500">
                    <CheckCircle2 className="w-6 h-6 animate-bounce" />
                  </div>
                  <h4 className="text-sm font-bold text-app-text">Resume Received!</h4>
                  <p className="text-xs text-app-muted">Storing your document securely in Firestore database...</p>
                </div>
              ) : (
                <div 
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center space-y-3 transition-colors ${
                    dragActive 
                      ? 'border-brand-blue bg-brand-blue/5' 
                      : 'border-app-border bg-app-surface/50 hover:bg-app-surface'
                  }`}
                >
                  <Upload className="w-8 h-8 text-app-muted mx-auto" />
                  <div>
                    <p className="text-xs font-bold text-app-text">Drag and drop your file here</p>
                    <p className="text-[10px] text-app-muted font-medium mt-1">or click below to browse local storage</p>
                  </div>
                  
                  <label className="inline-block px-4 py-2 bg-app-bg border border-app-border hover:bg-app-surface text-xs font-bold text-app-text rounded-xl cursor-pointer select-none transition-all">
                    Browse File
                    <input 
                      type="file" 
                      accept=".pdf,.docx,.doc" 
                      onChange={handleFileSelect} 
                      className="hidden" 
                    />
                  </label>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setIsUploadingModalOpen(false)}
                  className="w-full py-2.5 bg-app-surface border border-app-border text-app-text rounded-xl text-xs font-bold cursor-pointer hover:bg-neutral-800 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Visual Resume Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="w-full max-w-4xl bg-white text-slate-900 rounded-[28px] overflow-hidden card-shadow p-8 my-8 relative flex flex-col"
            >
              {/* Close Button & Actions */}
              <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Dynamic Resume Preview</h3>
                  <p className="text-xs text-slate-500">Structured template rendered from Cloud Firestore data</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={triggerDownloadPDF}
                    className="px-4 py-2 bg-brand-blue hover:bg-brand-blue/90 text-xs font-bold text-white rounded-xl flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Print or PDF
                  </button>
                  <button 
                    onClick={() => setShowPreviewModal(false)}
                    className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Printable Area */}
              <div className="flex-1 bg-white font-sans p-6 rounded-xl border border-slate-200 space-y-6">
                <div className="border-b-2 border-slate-800 pb-4 text-center">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 uppercase">{fullName}</h1>
                  <p className="text-sm font-semibold text-brand-blue tracking-wide mt-1 uppercase">{headline}</p>
                  
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-3 font-medium">
                    {email && <span>{email}</span>}
                    {phone && <span>• {phone}</span>}
                    {location && <span>• {location}</span>}
                    {linkedin && <span>• {linkedin}</span>}
                    {portfolio && <span>• {portfolio}</span>}
                  </div>
                </div>

                {summary && (
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">Professional Summary</h3>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{summary}</p>
                  </div>
                )}

                {skills && (
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">Core Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.split(',').map((skill, index) => {
                        const s = skill.trim();
                        if (!s) return null;
                        return (
                          <span key={index} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-[10px] font-bold font-mono">
                            {s}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {experience && (
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">Professional History</h3>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{experience}</p>
                  </div>
                )}

                {projects && (
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">Key Projects</h3>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{projects}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {education && (
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">Education</h3>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{education}</p>
                    </div>
                  )}

                  {certifications && (
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">Certifications</h3>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{certifications}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {languages && (
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">Languages</h3>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{languages}</p>
                    </div>
                  )}

                  {references && (
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">References</h3>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{references}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-all"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
