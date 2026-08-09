import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, CheckCircle2, Download, Eye, ChevronRight, TrendingUp, AlertCircle, 
  FileText, Upload, X, Plus, Trash2, Save, Languages, BookOpen, Briefcase, 
  Layers, GraduationCap, Award, Users, Edit2, Globe, Linkedin, Github, ExternalLink 
} from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';
import { useJobSeeker } from '../../../../context/JobSeekerContext';
import { uploadCandidateDocument } from '../../../../services/documentStorageService';

export default function ResumeBuilderTab() {
  const { user, userProfile } = useAuth();
  const uid = user?.uid || userProfile?.uid;
  const { jobSeekerProfile, loading: profileLoading, resumeCompletion } = useJobSeeker();

  const [activeStep, setActiveStep] = useState(1);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isUploadingModalOpen, setIsUploadingModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Local draft states for single-field steps
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [website, setWebsite] = useState('');
  
  const [headline, setHeadline] = useState('');
  const [summary, setSummary] = useState('');

  // Local state lists for array-based steps
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [experiencesList, setExperiencesList] = useState<any[]>([]);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [educationsList, setEducationsList] = useState<any[]>([]);
  const [certificationsList, setCertificationsList] = useState<any[]>([]);
  const [achievementsList, setAchievementsList] = useState<any[]>([]);
  const [languagesList, setLanguagesList] = useState<any[]>([]);
  const [referencesList, setReferencesList] = useState<any[]>([]);
  
  const [uploadedResume, setUploadedResume] = useState<any | null>(null);

  // Controls adding/editing individual items in lists
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const steps = [
    { id: 1, label: 'Personal & Social', icon: FileText },
    { id: 2, label: 'Headline & Summary', icon: Sparkles },
    { id: 3, label: 'Skills & Tech Stack', icon: Layers },
    { id: 4, label: 'Work Experience', icon: Briefcase },
    { id: 5, label: 'Key Projects', icon: BookOpen },
    { id: 6, label: 'Education', icon: GraduationCap },
    { id: 7, label: 'Certifications', icon: Award },
    { id: 8, label: 'Achievements', icon: TrendingUp },
    { id: 9, label: 'Languages', icon: Languages },
    { id: 10, label: 'References', icon: Users }
  ];

  // Initialize draft states from the job seeker context profile
  useEffect(() => {
    if (!profileLoading && jobSeekerProfile) {
      const data = jobSeekerProfile;
      const resData = data.resume || {};

      setFullName(resData.fullName || resData.personalInfo?.fullName || data.profile?.fullName || data.fullName || '');
      setEmail(resData.email || resData.personalInfo?.email || data.profile?.email || data.email || '');
      setPhone(resData.phone || resData.personalInfo?.phone || data.profile?.phoneNumber || data.profile?.phone || data.phone || '');
      setLocation(resData.location || resData.personalInfo?.location || data.profile?.location || data.location || '');
      
      setLinkedin(resData.linkedin || resData.socialLinks?.linkedin || data.profile?.linkedin || data.links?.linkedin || '');
      setGithub(resData.github || resData.socialLinks?.github || data.links?.github || '');
      setPortfolio(resData.portfolio || resData.socialLinks?.portfolio || data.links?.portfolio || '');
      setWebsite(resData.website || resData.socialLinks?.website || data.links?.website || '');

      setHeadline(resData.headline || data.profile?.headline || data.headline || '');
      setSummary(resData.summary || resData.careerSummary || data.profile?.bio || data.bio || '');

      // Skills fallback
      let skillsArray: string[] = [];
      if (Array.isArray(resData.skills)) {
        skillsArray = resData.skills;
      } else if (typeof resData.skills === 'string') {
        skillsArray = resData.skills.split(',').map(s => s.trim()).filter(Boolean);
      } else if (Array.isArray(data.skills)) {
        skillsArray = data.skills;
      } else if (Array.isArray(data.profile?.skills)) {
        skillsArray = data.profile.skills;
      }
      setSkillsList(skillsArray);

      // Experiences, Educations, etc. fallbacks
      setExperiencesList(resData.experiences || data.experiences || data.profile?.experiences || []);
      setEducationsList(resData.educations || data.educations || data.profile?.educations || []);
      setProjectsList(resData.projectsList || resData.projectsArray || data.projects || []);
      setCertificationsList(resData.certificationsList || resData.certificationsArray || data.certifications || []);
      setAchievementsList(resData.achievementsList || resData.achievementsArray || data.achievements || []);
      
      // Languages list helper
      let langsArray: any[] = [];
      if (Array.isArray(resData.languagesList)) {
        langsArray = resData.languagesList;
      } else if (Array.isArray(resData.languages)) {
        langsArray = resData.languages.map((l: any) => typeof l === 'string' ? { id: `lang-${Math.random().toString(36).substr(2, 4)}`, name: l, proficiency: 'Fluent' } : l);
      } else if (typeof resData.languages === 'string') {
        langsArray = resData.languages.split(',').map((l: string) => ({ id: `lang-${Math.random().toString(36).substr(2, 4)}`, name: l.trim(), proficiency: 'Fluent' })).filter(x => x.name);
      }
      setLanguagesList(langsArray);

      // References list helper
      setReferencesList(resData.referencesList || resData.referencesArray || []);
      setUploadedResume(resData.uploadedResume || null);
    }
  }, [jobSeekerProfile, profileLoading]);

  // Backward compatible text string formatters
  const formatExperiencesToString = (exps: any[]) => {
    return exps.map(e => `${e.role} at ${e.company} (${e.startDate} - ${e.endDate || 'Present'})\n${e.description || ''}`).join('\n\n');
  };

  const formatEducationsToString = (edus: any[]) => {
    return edus.map(e => `${e.degree} in ${e.specialization || ''}, ${e.institute} (${e.startYear || ''} - ${e.endYear || ''})${e.cgpa ? ` - CGPA: ${e.cgpa}` : ''}`).join('\n\n');
  };

  const formatProjectsToString = (projs: any[]) => {
    return projs.map(p => `${p.name} - ${p.description || ''}${p.technologies ? ` [Tech: ${p.technologies}]` : ''}${p.link ? ` [Link: ${p.link}]` : ''}`).join('\n\n');
  };

  const formatCertificationsToString = (certs: any[]) => {
    return certs.map(c => `${c.name}, ${c.issuer} (${c.year || ''})`).join('\n\n');
  };

  const formatAchievementsToString = (ach: any[]) => {
    return ach.map(a => `${a.title} (${a.year || ''}) - ${a.description || ''}`).join('\n\n');
  };

  const formatLanguagesToString = (langs: any[]) => {
    return langs.map(l => `${l.name} (${l.proficiency || 'Fluent'})`).join(', ');
  };

  const formatReferencesToString = (refs: any[]) => {
    return refs.map(r => `${r.name} (${r.title || ''} at ${r.company || ''}) - Contact: ${r.contact || ''}`).join('\n\n');
  };

  const triggerSavedMessage = () => {
    setShowSavedMsg(true);
    setTimeout(() => {
      setShowSavedMsg(false);
      if (activeStep < steps.length) {
        setActiveStep(prev => prev + 1);
      }
    }, 1200);
  };

  // Unified Section Save
  const handleSaveStep = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!uid) return;

    try {
      const docRef = doc(db, 'marketplace_jobseekers', uid);
      let updatePayload: any = {};

      if (activeStep === 1) {
        updatePayload = {
          'resume.fullName': fullName,
          'resume.email': email,
          'resume.phone': phone,
          'resume.location': location,
          'resume.linkedin': linkedin,
          'resume.github': github,
          'resume.portfolio': portfolio,
          'resume.website': website,
          
          'profile.fullName': fullName,
          'profile.email': email,
          'profile.phone': phone,
          'profile.phoneNumber': phone,
          'profile.location': location,
          
          'links.linkedin': linkedin,
          'links.github': github,
          'links.portfolio': portfolio,
          'links.website': website,
          'links.githubUrl': github,
          'links.linkedinUrl': linkedin,
          
          'fullName': fullName,
          'email': email,
          'phone': phone
        };
      } else if (activeStep === 2) {
        updatePayload = {
          'resume.headline': headline,
          'resume.summary': summary,
          'resume.careerSummary': summary,
          'profile.headline': headline,
          'profile.bio': summary,
          'bio': summary,
          'headline': headline
        };
      } else if (activeStep === 3) {
        const skillsString = skillsList.join(', ');
        updatePayload = {
          'resume.skills': skillsString,
          'skills': skillsList,
          'profile.skills': skillsList
        };
      }

      updatePayload['resume.updatedAt'] = new Date().toISOString();
      await updateDoc(docRef, updatePayload);
      triggerSavedMessage();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
    }
  };

  // List Item save and deletions
  const handleSaveListItem = async (itemValues: any) => {
    if (!uid) return;
    try {
      const docRef = doc(db, 'marketplace_jobseekers', uid);
      let updatedPayload: any = {};

      if (activeStep === 4) {
        let updatedList = [...experiencesList];
        if (itemValues.id) {
          updatedList = updatedList.map(e => e.id === itemValues.id ? itemValues : e);
        } else {
          updatedList.push({ ...itemValues, id: `exp-${Date.now()}` });
        }
        updatedPayload = {
          'resume.experiences': updatedList,
          'resume.experience': formatExperiencesToString(updatedList),
          'experiences': updatedList,
          'profile.experiences': updatedList
        };
      } else if (activeStep === 5) {
        let updatedList = [...projectsList];
        if (itemValues.id) {
          updatedList = updatedList.map(p => p.id === itemValues.id ? itemValues : p);
        } else {
          updatedList.push({ ...itemValues, id: `proj-${Date.now()}` });
        }
        updatedPayload = {
          'resume.projectsList': updatedList,
          'resume.projects': formatProjectsToString(updatedList),
          'projects': updatedList
        };
      } else if (activeStep === 6) {
        let updatedList = [...educationsList];
        if (itemValues.id) {
          updatedList = updatedList.map(e => e.id === itemValues.id ? itemValues : e);
        } else {
          updatedList.push({ ...itemValues, id: `edu-${Date.now()}` });
        }
        updatedPayload = {
          'resume.educations': updatedList,
          'resume.education': formatEducationsToString(updatedList),
          'educations': updatedList,
          'profile.educations': updatedList
        };
      } else if (activeStep === 7) {
        let updatedList = [...certificationsList];
        if (itemValues.id) {
          updatedList = updatedList.map(c => c.id === itemValues.id ? itemValues : c);
        } else {
          updatedList.push({ ...itemValues, id: `cert-${Date.now()}` });
        }
        updatedPayload = {
          'resume.certificationsList': updatedList,
          'resume.certifications': formatCertificationsToString(updatedList),
          'certifications': updatedList
        };
      } else if (activeStep === 8) {
        let updatedList = [...achievementsList];
        if (itemValues.id) {
          updatedList = updatedList.map(a => a.id === itemValues.id ? itemValues : a);
        } else {
          updatedList.push({ ...itemValues, id: `ach-${Date.now()}` });
        }
        updatedPayload = {
          'resume.achievementsList': updatedList,
          'resume.achievements': formatAchievementsToString(updatedList),
          'achievements': updatedList
        };
      } else if (activeStep === 9) {
        let updatedList = [...languagesList];
        if (itemValues.id) {
          updatedList = updatedList.map(l => l.id === itemValues.id ? itemValues : l);
        } else {
          updatedList.push({ ...itemValues, id: `lang-${Date.now()}` });
        }
        updatedPayload = {
          'resume.languagesList': updatedList,
          'resume.languages': formatLanguagesToString(updatedList)
        };
      } else if (activeStep === 10) {
        let updatedList = [...referencesList];
        if (itemValues.id) {
          updatedList = updatedList.map(r => r.id === itemValues.id ? itemValues : r);
        } else {
          updatedList.push({ ...itemValues, id: `ref-${Date.now()}` });
        }
        updatedPayload = {
          'resume.referencesList': updatedList,
          'resume.references': formatReferencesToString(updatedList)
        };
      }

      updatedPayload['resume.updatedAt'] = new Date().toISOString();
      await updateDoc(docRef, updatedPayload);
      setEditingItem(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
    }
  };

  const handleDeleteListItem = async (itemId: string) => {
    if (!uid) return;
    try {
      const docRef = doc(db, 'marketplace_jobseekers', uid);
      let updatedPayload: any = {};

      if (activeStep === 4) {
        const filtered = experiencesList.filter(e => e.id !== itemId);
        updatedPayload = {
          'resume.experiences': filtered,
          'resume.experience': formatExperiencesToString(filtered),
          'experiences': filtered,
          'profile.experiences': filtered
        };
      } else if (activeStep === 5) {
        const filtered = projectsList.filter(p => p.id !== itemId);
        updatedPayload = {
          'resume.projectsList': filtered,
          'resume.projects': formatProjectsToString(filtered),
          'projects': filtered
        };
      } else if (activeStep === 6) {
        const filtered = educationsList.filter(e => e.id !== itemId);
        updatedPayload = {
          'resume.educations': filtered,
          'resume.education': formatEducationsToString(filtered),
          'educations': filtered,
          'profile.educations': filtered
        };
      } else if (activeStep === 7) {
        const filtered = certificationsList.filter(c => c.id !== itemId);
        updatedPayload = {
          'resume.certificationsList': filtered,
          'resume.certifications': formatCertificationsToString(filtered),
          'certifications': filtered
        };
      } else if (activeStep === 8) {
        const filtered = achievementsList.filter(a => a.id !== itemId);
        updatedPayload = {
          'resume.achievementsList': filtered,
          'resume.achievements': formatAchievementsToString(filtered),
          'achievements': filtered
        };
      } else if (activeStep === 9) {
        const filtered = languagesList.filter(l => l.id !== itemId);
        updatedPayload = {
          'resume.languagesList': filtered,
          'resume.languages': formatLanguagesToString(filtered)
        };
      } else if (activeStep === 10) {
        const filtered = referencesList.filter(r => r.id !== itemId);
        updatedPayload = {
          'resume.referencesList': filtered,
          'resume.references': formatReferencesToString(filtered)
        };
      }

      updatedPayload['resume.updatedAt'] = new Date().toISOString();
      await updateDoc(docRef, updatedPayload);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
    }
  };

  // Skill tag modifiers
  const handleAddSkill = (skillText: string) => {
    const trimmed = skillText.trim();
    if (trimmed && !skillsList.includes(trimmed)) {
      setSkillsList([...skillsList, trimmed]);
    }
  };

  const handleRemoveSkill = (skillText: string) => {
    setSkillsList(skillsList.filter(s => s !== skillText));
  };

  // File drop handler for uploaded resume documents
  const parseResumeDocument = async (file: File) => {
    let text = '';
    try {
      if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        text = await file.text();
      } else {
        const buffer = await file.arrayBuffer();
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const rawText = decoder.decode(buffer);
        text = rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
      }
    } catch (err) {
      console.warn("Could not extract text from document:", err);
    }

    const result: {
      fullName?: string;
      email?: string;
      phone?: string;
      summary?: string;
      skills?: string[];
    } = {};

    if (!text) return result;

    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) result.email = emailMatch[0];

    const phoneMatch = text.match(/(\+?\d{1,4}[\s\.-]?)?\(?\d{3,5}\)?[\s\.-]?\d{3,5}[\s\.-]?\d{3,5}/);
    if (phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 10) {
      result.phone = phoneMatch[0].trim();
    }

    const commonSkills = [
      'React', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'Python', 'Java', 'C++', 'C#',
      'HTML', 'CSS', 'Tailwind', 'PostgreSQL', 'MongoDB', 'MySQL', 'Docker', 'AWS', 'GCP',
      'Firebase', 'Git', 'GraphQL', 'REST API', 'Figma', 'Redux', 'Linux'
    ];
    const detectedSkills = commonSkills.filter(s => new RegExp(`\\b${s.replace('.', '\\.')}\\b`, 'i').test(text));
    if (detectedSkills.length > 0) {
      result.skills = detectedSkills;
    }

    const lower = text.toLowerCase();
    const summaryIdx = Math.max(lower.indexOf('summary'), lower.indexOf('objective'), lower.indexOf('about me'));
    if (summaryIdx !== -1) {
      const chunk = text.substring(summaryIdx, summaryIdx + 250).replace(/^(summary|objective|about me)[:\s]*/i, '').trim();
      if (chunk.length > 15) {
        result.summary = chunk.split('\n')[0] || chunk.slice(0, 180);
      }
    }

    return result;
  };

  const processFile = async (file: File) => {
    if (!uid) return;
    setUploadSuccess(true);

    try {
      // Upload to Firebase Storage and get metadata
      const docMeta = await uploadCandidateDocument(file, 'Resume', {
        uid,
        fullName: userProfile?.fullName || user?.displayName || 'Job Seeker',
        email: userProfile?.email || user?.email || '',
        role: userProfile?.role || 'marketplace_jobseeker'
      });

      const newResume = {
        documentId: docMeta.documentId,
        name: docMeta.fileName,
        storagePath: docMeta.storagePath,
        downloadURL: docMeta.downloadURL,
        url: docMeta.downloadURL,
        fileSize: docMeta.fileSize,
        date: new Date().toLocaleDateString('en-GB', { 
          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
        })
      };

      // Parse document text and populate fields
      const parsedData = await parseResumeDocument(file);

      const updatePayload: any = {
        'resume.uploadedResume': newResume,
        'resume.updatedAt': new Date().toISOString()
      };

      if (parsedData.fullName) {
        setFullName(parsedData.fullName);
        updatePayload['resume.fullName'] = parsedData.fullName;
        updatePayload['profile.fullName'] = parsedData.fullName;
      }
      if (parsedData.email) {
        setEmail(parsedData.email);
        updatePayload['resume.email'] = parsedData.email;
        updatePayload['profile.email'] = parsedData.email;
      }
      if (parsedData.phone) {
        setPhone(parsedData.phone);
        updatePayload['resume.phone'] = parsedData.phone;
        updatePayload['profile.phone'] = parsedData.phone;
      }
      if (parsedData.summary) {
        setSummary(parsedData.summary);
        updatePayload['resume.summary'] = parsedData.summary;
        updatePayload['profile.bio'] = parsedData.summary;
      }
      if (parsedData.skills && parsedData.skills.length > 0) {
        const mergedSkills = Array.from(new Set([...skillsList, ...parsedData.skills]));
        setSkillsList(mergedSkills);
        updatePayload['resume.skills'] = mergedSkills;
        updatePayload['profile.skills'] = mergedSkills;
      }

      const docRef = doc(db, 'marketplace_jobseekers', uid);
      await updateDoc(docRef, updatePayload);

      setTimeout(() => {
        setUploadedResume(newResume);
        setUploadSuccess(false);
        setIsUploadingModalOpen(false);
      }, 1200);
    } catch (error: any) {
      console.error("Resume file upload error:", error);
      handleFirestoreError(error, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
      setUploadSuccess(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-app-muted font-bold">Synchronizing with Firestore secure node...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Upper action header */}
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
            className="px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-xs font-bold text-indigo-400 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" /> Upload Existing
          </button>
          <button 
            id="btn-preview-resume"
            onClick={() => setShowPreviewModal(true)}
            className="px-4 py-2.5 bg-app-surface hover:bg-app-surface/80 border border-app-border text-xs font-bold text-app-text rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-brand-blue" /> Preview
          </button>
          <button 
            id="btn-download-pdf"
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-xs font-bold text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Print / PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Steps Menu */}
        <div className="lg:col-span-3 space-y-2">
          {steps.map((st) => {
            const StepIcon = st.icon;
            return (
              <button
                key={st.id}
                id={`step-btn-${st.id}`}
                onClick={() => { setActiveStep(st.id); setEditingItem(null); }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left text-xs font-bold border transition-all cursor-pointer ${
                  activeStep === st.id
                    ? 'bg-brand-blue border-brand-blue text-white'
                    : 'bg-app-surface border-app-border text-app-muted hover:text-app-text'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    activeStep === st.id ? 'bg-white text-brand-blue' : 'bg-app-bg text-app-muted'
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

        {/* Middle Column - Dynamic Forms & Lists */}
        <div className="lg:col-span-6 p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow h-fit space-y-6">
          <div className="flex justify-between items-center border-b border-app-border/40 pb-4">
            <h2 className="text-base font-bold text-app-text">{steps.find(s => s.id === activeStep)?.label}</h2>
            <span className="text-[10px] font-bold text-app-muted uppercase">Step {activeStep} of 10</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              {/* STEP 1: Personal Details & Socials */}
              {activeStep === 1 && (
                <form onSubmit={handleSaveStep} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Full Name</label>
                      <input 
                        type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:outline-none focus:border-brand-blue" required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Email Address</label>
                      <input 
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:outline-none focus:border-brand-blue" required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Phone Number</label>
                      <input 
                        type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Location</label>
                      <input 
                        type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>
                  <div className="border-t border-app-border/40 pt-4 mt-2">
                    <h4 className="text-xs font-bold text-app-text mb-3">Social & Portfolio Links</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">LinkedIn Profile</label>
                        <input 
                          type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/username"
                          className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">GitHub Profile</label>
                        <input 
                          type="text" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/username"
                          className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Portfolio Link</label>
                        <input 
                          type="text" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="https://myportfolio.dev"
                          className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Website URL</label>
                        <input 
                          type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://website.com"
                          className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-app-border/40">
                    <span className="text-[10px] text-app-muted font-bold">* Real-time Cloud Save</span>
                    <button type="submit" className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs rounded-xl flex items-center gap-2">
                      <Save className="w-3.5 h-3.5" /> {showSavedMsg ? 'Synchronized!' : 'Save & Continue'}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: Headline & Summary */}
              {activeStep === 2 && (
                <form onSubmit={handleSaveStep} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Professional Headline</label>
                    <input 
                      type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g. Senior Full Stack Engineer"
                      className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:outline-none" required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Professional Career Summary</label>
                    <textarea 
                      rows={6} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Briefly describe your goals, core skill sets, and highlights of your experience..."
                      className="w-full bg-app-bg border border-app-border rounded-xl p-3.5 text-xs text-app-text focus:outline-none" required
                    />
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-app-border/40">
                    <span className="text-[10px] text-app-muted font-bold">* Real-time Cloud Save</span>
                    <button type="submit" className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs rounded-xl flex items-center gap-2">
                      <Save className="w-3.5 h-3.5" /> {showSavedMsg ? 'Synchronized!' : 'Save & Continue'}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: Skills list */}
              {activeStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Add Skill Badge</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" id="input-new-skill" placeholder="e.g. React, Docker, Python"
                        className="flex-1 bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddSkill((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <button 
                        onClick={() => {
                          const el = document.getElementById('input-new-skill') as HTMLInputElement;
                          if (el) {
                            handleAddSkill(el.value);
                            el.value = '';
                          }
                        }}
                        className="px-4 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-bold rounded-xl"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-app-bg border border-app-border/60 rounded-xl space-y-2">
                    <label className="text-[9px] font-bold text-app-muted uppercase tracking-widest block">Core Skills Inventory</label>
                    {skillsList.length === 0 ? (
                      <p className="text-xs text-app-muted py-2">No skill badges added yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {skillsList.map((sk) => (
                          <span key={sk} className="px-2.5 py-1 bg-brand-blue/15 border border-brand-blue/20 text-brand-blue rounded-lg text-[10px] font-bold flex items-center gap-1">
                            {sk}
                            <X className="w-3 h-3 cursor-pointer text-brand-blue hover:text-rose-500" onClick={() => handleRemoveSkill(sk)} />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-app-border/40">
                    <span className="text-[10px] text-app-muted font-bold">* Click below to synchronize your skills tags</span>
                    <button onClick={() => handleSaveStep()} className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs rounded-xl flex items-center gap-2">
                      <Save className="w-3.5 h-3.5" /> {showSavedMsg ? 'Synchronized!' : 'Save & Continue'}
                    </button>
                  </div>
                </div>
              )}

              {/* LIST-BASED STEPS (4 to 10) */}
              {activeStep >= 4 && (
                <div className="space-y-4">
                  {editingItem ? (
                    /* RENDER ADD / EDIT FORM FOR THE CURRENT STEP */
                    <div className="p-4 bg-app-bg border border-app-border rounded-2xl space-y-4">
                      <h4 className="text-xs font-bold text-app-text">{editingItem.id ? 'Edit Entry' : 'Create New Entry'}</h4>
                      
                      {activeStep === 4 && (
                        /* Experience Form */
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="Job Title / Role" defaultValue={editingItem.role || ''} id="form-exp-role" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" required />
                            <input type="text" placeholder="Company Name" defaultValue={editingItem.company || ''} id="form-exp-company" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" required />
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <select id="form-exp-type" defaultValue={editingItem.employmentType || 'Full-Time'} className="bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none">
                              <option value="Full-Time">Full-Time</option>
                              <option value="Part-Time">Part-Time</option>
                              <option value="Internship">Internship</option>
                              <option value="Contract">Contract</option>
                              <option value="Freelance">Freelance</option>
                            </select>
                            <input type="text" placeholder="Start (e.g. Jan 2024)" defaultValue={editingItem.startDate || ''} id="form-exp-start" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" />
                            <input type="text" placeholder="End (e.g. Present)" defaultValue={editingItem.endDate || ''} id="form-exp-end" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" />
                          </div>
                          <textarea rows={4} placeholder="Key Responsibilities, Achievements, and Tech stack used..." defaultValue={editingItem.description || ''} id="form-exp-desc" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" />
                        </div>
                      )}

                      {activeStep === 5 && (
                        /* Project Form */
                        <div className="space-y-3">
                          <input type="text" placeholder="Project Name" defaultValue={editingItem.name || ''} id="form-proj-name" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" required />
                          <input type="text" placeholder="Core Technologies (e.g. React, Node.js)" defaultValue={editingItem.technologies || ''} id="form-proj-tech" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" />
                          <input type="text" placeholder="Project Link / GitHub URL" defaultValue={editingItem.link || ''} id="form-proj-link" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" />
                          <textarea rows={3} placeholder="Project description and your main contributions..." defaultValue={editingItem.description || ''} id="form-proj-desc" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" />
                        </div>
                      )}

                      {activeStep === 6 && (
                        /* Education Form */
                        <div className="space-y-3">
                          <input type="text" placeholder="Institution / University" defaultValue={editingItem.institute || ''} id="form-edu-inst" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" required />
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="Degree (e.g. B.Tech, MS)" defaultValue={editingItem.degree || ''} id="form-edu-deg" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" required />
                            <input type="text" placeholder="Specialization (e.g. Computer Science)" defaultValue={editingItem.specialization || ''} id="form-edu-spec" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" />
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <input type="text" placeholder="Grade / CGPA" defaultValue={editingItem.cgpa || ''} id="form-edu-grade" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" />
                            <input type="text" placeholder="Start Year" defaultValue={editingItem.startYear || ''} id="form-edu-start" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" />
                            <input type="text" placeholder="End Year" defaultValue={editingItem.endYear || ''} id="form-edu-end" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" />
                          </div>
                        </div>
                      )}

                      {activeStep === 7 && (
                        /* Certification Form */
                        <div className="space-y-3">
                          <input type="text" placeholder="Certificate Name" defaultValue={editingItem.name || ''} id="form-cert-name" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" required />
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="Issuing Organization" defaultValue={editingItem.issuer || ''} id="form-cert-issuer" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" required />
                            <input type="text" placeholder="Year / Date" defaultValue={editingItem.year || ''} id="form-cert-year" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" />
                          </div>
                          <input type="text" placeholder="Certificate Credential URL" defaultValue={editingItem.link || ''} id="form-cert-link" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" />
                        </div>
                      )}

                      {activeStep === 8 && (
                        /* Achievement Form */
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-3">
                            <input type="text" placeholder="Achievement Title" defaultValue={editingItem.title || ''} id="form-ach-title" className="col-span-2 w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" required />
                            <input type="text" placeholder="Year" defaultValue={editingItem.year || ''} id="form-ach-year" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" />
                          </div>
                          <textarea rows={3} placeholder="Brief details about the award, competition, or recognition..." defaultValue={editingItem.description || ''} id="form-ach-desc" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" />
                        </div>
                      )}

                      {activeStep === 9 && (
                        /* Language Form */
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="Language Name (e.g. English)" defaultValue={editingItem.name || ''} id="form-lang-name" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" required />
                            <select id="form-lang-prof" defaultValue={editingItem.proficiency || 'Fluent'} className="bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none">
                              <option value="Native">Native</option>
                              <option value="Fluent">Fluent</option>
                              <option value="Professional">Professional</option>
                              <option value="Conversational">Conversational</option>
                              <option value="Beginner">Beginner</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {activeStep === 10 && (
                        /* Reference Form */
                        <div className="space-y-3">
                          <input type="text" placeholder="Reference Name" defaultValue={editingItem.name || ''} id="form-ref-name" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" required />
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="Title / Role" defaultValue={editingItem.title || ''} id="form-ref-title" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" />
                            <input type="text" placeholder="Company Name" defaultValue={editingItem.company || ''} id="form-ref-company" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" />
                          </div>
                          <input type="text" placeholder="Contact Info (Email or Phone)" defaultValue={editingItem.contact || ''} id="form-ref-contact" className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text focus:outline-none" required />
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-2 border-t border-app-border/40">
                        <button 
                          onClick={() => setEditingItem(null)}
                          className="px-4 py-2 bg-app-surface border border-app-border hover:bg-neutral-800 text-xs text-app-text font-bold rounded-xl"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => {
                            let val: any = { id: editingItem.id };
                            if (activeStep === 4) {
                              val.role = (document.getElementById('form-exp-role') as HTMLInputElement).value;
                              val.company = (document.getElementById('form-exp-company') as HTMLInputElement).value;
                              val.employmentType = (document.getElementById('form-exp-type') as HTMLSelectElement).value;
                              val.startDate = (document.getElementById('form-exp-start') as HTMLInputElement).value;
                              val.endDate = (document.getElementById('form-exp-end') as HTMLInputElement).value;
                              val.description = (document.getElementById('form-exp-desc') as HTMLTextAreaElement).value;
                            } else if (activeStep === 5) {
                              val.name = (document.getElementById('form-proj-name') as HTMLInputElement).value;
                              val.technologies = (document.getElementById('form-proj-tech') as HTMLInputElement).value;
                              val.link = (document.getElementById('form-proj-link') as HTMLInputElement).value;
                              val.description = (document.getElementById('form-proj-desc') as HTMLTextAreaElement).value;
                            } else if (activeStep === 6) {
                              val.institute = (document.getElementById('form-edu-inst') as HTMLInputElement).value;
                              val.degree = (document.getElementById('form-edu-deg') as HTMLInputElement).value;
                              val.specialization = (document.getElementById('form-edu-spec') as HTMLInputElement).value;
                              val.cgpa = (document.getElementById('form-edu-grade') as HTMLInputElement).value;
                              val.startYear = (document.getElementById('form-edu-start') as HTMLInputElement).value;
                              val.endYear = (document.getElementById('form-edu-end') as HTMLInputElement).value;
                            } else if (activeStep === 7) {
                              val.name = (document.getElementById('form-cert-name') as HTMLInputElement).value;
                              val.issuer = (document.getElementById('form-cert-issuer') as HTMLInputElement).value;
                              val.year = (document.getElementById('form-cert-year') as HTMLInputElement).value;
                              val.link = (document.getElementById('form-cert-link') as HTMLInputElement).value;
                            } else if (activeStep === 8) {
                              val.title = (document.getElementById('form-ach-title') as HTMLInputElement).value;
                              val.year = (document.getElementById('form-ach-year') as HTMLInputElement).value;
                              val.description = (document.getElementById('form-ach-desc') as HTMLTextAreaElement).value;
                            } else if (activeStep === 9) {
                              val.name = (document.getElementById('form-lang-name') as HTMLInputElement).value;
                              val.proficiency = (document.getElementById('form-lang-prof') as HTMLSelectElement).value;
                            } else if (activeStep === 10) {
                              val.name = (document.getElementById('form-ref-name') as HTMLInputElement).value;
                              val.title = (document.getElementById('form-ref-title') as HTMLInputElement).value;
                              val.company = (document.getElementById('form-ref-company') as HTMLInputElement).value;
                              val.contact = (document.getElementById('form-ref-contact') as HTMLInputElement).value;
                            }
                            handleSaveListItem(val);
                          }}
                          className="px-4 py-2 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-bold rounded-xl"
                        >
                          Save Entry
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* RENDER LIST OF ITEMS + ADD NEW BUTTON */
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-app-bg border border-app-border/40 rounded-xl p-3.5">
                        <span className="text-[10px] text-app-muted font-bold">List items are synced automatically in cloud</span>
                        <button 
                          onClick={() => setEditingItem({})}
                          className="px-3.5 py-1.5 bg-brand-blue/15 border border-brand-blue/20 text-brand-blue hover:bg-brand-blue/20 text-[11px] font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Plus className="w-3 h-3" /> Add Entry
                        </button>
                      </div>

                      {/* Render Step-Specific lists */}
                      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                        {activeStep === 4 && experiencesList.length === 0 && <p className="text-xs text-app-muted text-center py-8">No work experience entries added.</p>}
                        {activeStep === 4 && experiencesList.map((e) => (
                          <div key={e.id} className="p-4 bg-app-bg border border-app-border/40 rounded-xl flex justify-between items-start gap-4">
                            <div>
                              <h4 className="text-xs font-bold text-app-text">{e.role}</h4>
                              <p className="text-[10px] text-app-muted font-medium">{e.company} • {e.employmentType} • {e.startDate} - {e.endDate || 'Present'}</p>
                              {e.description && <p className="text-[10px] text-app-muted mt-1 whitespace-pre-line leading-relaxed">{e.description}</p>}
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              <button onClick={() => setEditingItem(e)} className="p-1.5 bg-app-surface border border-app-border/60 hover:text-brand-blue rounded-lg text-app-muted transition cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDeleteListItem(e.id)} className="p-1.5 bg-app-surface border border-app-border/60 hover:text-rose-500 rounded-lg text-app-muted transition cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))}

                        {activeStep === 5 && projectsList.length === 0 && <p className="text-xs text-app-muted text-center py-8">No project entries added.</p>}
                        {activeStep === 5 && projectsList.map((p) => (
                          <div key={p.id} className="p-4 bg-app-bg border border-app-border/40 rounded-xl flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-bold text-app-text">{p.name}</h4>
                                {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline text-[10px]"><ExternalLink className="w-3 h-3" /></a>}
                              </div>
                              {p.technologies && <p className="text-[9px] font-mono font-bold bg-brand-blue/10 text-brand-blue px-1.5 py-0.5 rounded-md mt-1 w-fit">{p.technologies}</p>}
                              {p.description && <p className="text-[10px] text-app-muted mt-1 whitespace-pre-line leading-relaxed">{p.description}</p>}
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              <button onClick={() => setEditingItem(p)} className="p-1.5 bg-app-surface border border-app-border/60 hover:text-brand-blue rounded-lg text-app-muted transition cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDeleteListItem(p.id)} className="p-1.5 bg-app-surface border border-app-border/60 hover:text-rose-500 rounded-lg text-app-muted transition cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))}

                        {activeStep === 6 && educationsList.length === 0 && <p className="text-xs text-app-muted text-center py-8">No education entries added.</p>}
                        {activeStep === 6 && educationsList.map((e) => (
                          <div key={e.id} className="p-4 bg-app-bg border border-app-border/40 rounded-xl flex justify-between items-start gap-4">
                            <div>
                              <h4 className="text-xs font-bold text-app-text">{e.degree} {e.specialization && `in ${e.specialization}`}</h4>
                              <p className="text-[10px] text-app-muted font-medium">{e.institute} • {e.startYear} - {e.endYear || 'Present'}</p>
                              {e.cgpa && <p className="text-[9px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md mt-1 w-fit">CGPA/Grade: {e.cgpa}</p>}
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              <button onClick={() => setEditingItem(e)} className="p-1.5 bg-app-surface border border-app-border/60 hover:text-brand-blue rounded-lg text-app-muted transition cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDeleteListItem(e.id)} className="p-1.5 bg-app-surface border border-app-border/60 hover:text-rose-500 rounded-lg text-app-muted transition cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))}

                        {activeStep === 7 && certificationsList.length === 0 && <p className="text-xs text-app-muted text-center py-8">No certification entries added.</p>}
                        {activeStep === 7 && certificationsList.map((c) => (
                          <div key={c.id} className="p-4 bg-app-bg border border-app-border/40 rounded-xl flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-bold text-app-text">{c.name}</h4>
                                {c.link && <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline text-[10px]"><ExternalLink className="w-3 h-3" /></a>}
                              </div>
                              <p className="text-[10px] text-app-muted font-medium">{c.issuer} {c.year && `• ${c.year}`}</p>
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              <button onClick={() => setEditingItem(c)} className="p-1.5 bg-app-surface border border-app-border/60 hover:text-brand-blue rounded-lg text-app-muted transition cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDeleteListItem(c.id)} className="p-1.5 bg-app-surface border border-app-border/60 hover:text-rose-500 rounded-lg text-app-muted transition cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))}

                        {activeStep === 8 && achievementsList.length === 0 && <p className="text-xs text-app-muted text-center py-8">No achievements added.</p>}
                        {activeStep === 8 && achievementsList.map((a) => (
                          <div key={a.id} className="p-4 bg-app-bg border border-app-border/40 rounded-xl flex justify-between items-start gap-4">
                            <div>
                              <h4 className="text-xs font-bold text-app-text">{a.title} {a.year && <span className="text-app-muted text-[10px]">({a.year})</span>}</h4>
                              {a.description && <p className="text-[10px] text-app-muted mt-1 whitespace-pre-line leading-relaxed">{a.description}</p>}
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              <button onClick={() => setEditingItem(a)} className="p-1.5 bg-app-surface border border-app-border/60 hover:text-brand-blue rounded-lg text-app-muted transition cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDeleteListItem(a.id)} className="p-1.5 bg-app-surface border border-app-border/60 hover:text-rose-500 rounded-lg text-app-muted transition cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))}

                        {activeStep === 9 && languagesList.length === 0 && <p className="text-xs text-app-muted text-center py-8">No spoken languages added.</p>}
                        {activeStep === 9 && languagesList.map((l) => (
                          <div key={l.id} className="p-4 bg-app-bg border border-app-border/40 rounded-xl flex justify-between items-center gap-4">
                            <div>
                              <h4 className="text-xs font-bold text-app-text">{l.name}</h4>
                              <p className="text-[10px] font-mono text-brand-blue font-bold bg-brand-blue/10 px-1.5 py-0.5 rounded-md mt-1 w-fit">{l.proficiency}</p>
                            </div>
                            <div className="flex gap-1.5">
                              <button onClick={() => setEditingItem(l)} className="p-1.5 bg-app-surface border border-app-border/60 hover:text-brand-blue rounded-lg text-app-muted transition cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDeleteListItem(l.id)} className="p-1.5 bg-app-surface border border-app-border/60 hover:text-rose-500 rounded-lg text-app-muted transition cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))}

                        {activeStep === 10 && referencesList.length === 0 && <p className="text-xs text-app-muted text-center py-8">No references added.</p>}
                        {activeStep === 10 && referencesList.map((r) => (
                          <div key={r.id} className="p-4 bg-app-bg border border-app-border/40 rounded-xl flex justify-between items-start gap-4">
                            <div>
                              <h4 className="text-xs font-bold text-app-text">{r.name}</h4>
                              <p className="text-[10px] text-app-muted font-medium">{r.title} {r.company && `at ${r.company}`}</p>
                              <p className="text-[10px] text-brand-blue font-semibold mt-1">Contact: {r.contact}</p>
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              <button onClick={() => setEditingItem(r)} className="p-1.5 bg-app-surface border border-app-border/60 hover:text-brand-blue rounded-lg text-app-muted transition cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDeleteListItem(r.id)} className="p-1.5 bg-app-surface border border-app-border/60 hover:text-rose-500 rounded-lg text-app-muted transition cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-app-border/40">
                        <span className="text-[10px] text-app-muted font-bold">List edits persist instantly</span>
                        <button 
                          onClick={() => {
                            if (activeStep < steps.length) {
                              setActiveStep(prev => prev + 1);
                            }
                          }}
                          className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                        >
                          Continue <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column - Score Circle Widget */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow flex flex-col items-center">
            <h3 className="text-base font-bold text-app-text mb-4 w-full text-left">Resume Health</h3>
            
            <div className="relative w-32 h-32 flex items-center justify-center my-1.5">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-app-border" />
                <circle 
                  cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray="351" strokeDashoffset={351 - (351 * resumeCompletion) / 100} 
                  className="text-brand-blue transition-all duration-500" strokeLinecap="round" 
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-display font-black text-app-text">{resumeCompletion}%</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${resumeCompletion >= 80 ? 'text-emerald-500' : resumeCompletion >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                  {resumeCompletion >= 80 ? 'Excellent' : resumeCompletion >= 50 ? 'Good' : 'Incomplete'}
                </span>
              </div>
            </div>

            <div className="w-full text-left space-y-3.5 mt-6 border-t border-app-border/40 pt-4">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-app-text">Personal & Social Details</span>
                <CheckCircle2 className={`w-4 h-4 ${fullName && email ? 'text-emerald-500' : 'text-app-muted'}`} />
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-app-text">Summary & Headline</span>
                <CheckCircle2 className={`w-4 h-4 ${summary && headline ? 'text-emerald-500' : 'text-app-muted'}`} />
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-app-text">Core Skills Badges</span>
                <CheckCircle2 className={`w-4 h-4 ${skillsList.length > 0 ? 'text-emerald-500' : 'text-app-muted'}`} />
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-app-text">Work History Added</span>
                <CheckCircle2 className={`w-4 h-4 ${experiencesList.length > 0 ? 'text-emerald-500' : 'text-app-muted'}`} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-brand-blue/5 border border-brand-blue/10 flex gap-3 mt-6">
              <AlertCircle className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-app-muted font-medium">
                <strong className="text-app-text">ATS Pro:</strong> A standardized structured layout parses flawlessly through applicant tracking systems.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-app-bg border border-app-border rounded-[28px] p-6 space-y-6 card-shadow">
              <div className="flex justify-between items-center border-b border-app-border/40 pb-4">
                <div>
                  <h3 className="text-base font-bold text-app-text">Upload Custom Resume</h3>
                  <p className="text-xs text-app-muted mt-0.5">PDF or DOCX documents up to 10MB</p>
                </div>
                <button onClick={() => setIsUploadingModalOpen(false)} className="p-1.5 rounded-full bg-app-surface hover:bg-app-surface/80 border border-app-border text-app-muted cursor-pointer"><X className="w-4 h-4" /></button>
              </div>

              {uploadSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500"><CheckCircle2 className="w-6 h-6 animate-bounce" /></div>
                  <h4 className="text-sm font-bold text-app-text">Document Synced!</h4>
                  <p className="text-xs text-app-muted">Storing securely in your Cloud profile...</p>
                </div>
              ) : (
                <div 
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]); }}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center space-y-3 transition-colors ${
                    dragActive ? 'border-brand-blue bg-brand-blue/5' : 'border-app-border bg-app-surface/50 hover:bg-app-surface'
                  }`}
                >
                  <Upload className="w-8 h-8 text-app-muted mx-auto" />
                  <div>
                    <p className="text-xs font-bold text-app-text">Drag and drop your file here</p>
                    <p className="text-[10px] text-app-muted font-medium mt-1">or browse local disk files</p>
                  </div>
                  <label className="inline-block px-4 py-2 bg-app-bg border border-app-border hover:bg-app-surface text-xs font-bold text-app-text rounded-xl cursor-pointer select-none transition-all">
                    Browse File
                    <input type="file" accept=".pdf,.docx,.doc" onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]); }} className="hidden" />
                  </label>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Visual Resume Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} className="w-full max-w-4xl bg-white text-slate-900 rounded-[28px] p-8 my-8 relative flex flex-col">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Dynamic Resume Preview</h3>
                  <p className="text-xs text-slate-500">Live preview of standardized Firestore data fields</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => window.print()} className="px-4 py-2 bg-brand-blue hover:bg-brand-blue/90 text-xs font-bold text-white rounded-xl flex items-center gap-2 cursor-pointer transition-all"><Download className="w-3.5 h-3.5" /> Print / PDF</button>
                  <button onClick={() => setShowPreviewModal(false)} className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
              </div>

              {/* PDF printable sheet area */}
              <div className="flex-1 bg-white font-sans p-8 rounded-xl border border-slate-200 space-y-6 text-left">
                <div className="border-b-2 border-slate-800 pb-4 text-center">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 uppercase">{fullName || 'Job Seeker'}</h1>
                  <p className="text-sm font-semibold text-brand-blue tracking-wide mt-1 uppercase">{headline || 'Professional Headline'}</p>
                  
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-3 font-medium">
                    {email && <span>{email}</span>}
                    {phone && <span>• {phone}</span>}
                    {location && <span>• {location}</span>}
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-brand-blue mt-2 font-mono">
                    {linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" /> {linkedin}</span>}
                    {github && <span className="flex items-center gap-1"><Github className="w-3 h-3" /> {github}</span>}
                    {portfolio && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {portfolio}</span>}
                    {website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {website}</span>}
                  </div>
                </div>

                {summary && (
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">Professional Summary</h3>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{summary}</p>
                  </div>
                )}

                {skillsList.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">Core Expertise & Skills</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {skillsList.map((s, idx) => <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md text-[10px] font-mono font-bold border border-slate-200">{s}</span>)}
                    </div>
                  </div>
                )}

                {experiencesList.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">Work Experience</h3>
                    <div className="space-y-4">
                      {experiencesList.map((e, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-900">
                            <span>{e.role} — {e.company}</span>
                            <span className="font-medium text-slate-500">{e.startDate} - {e.endDate || 'Present'}</span>
                          </div>
                          {e.employmentType && <p className="text-[10px] text-brand-blue font-bold font-mono">{e.employmentType}</p>}
                          {e.description && <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{e.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {projectsList.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">Key Projects</h3>
                    <div className="space-y-3">
                      {projectsList.map((p, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="flex justify-between text-xs font-bold text-slate-900">
                            <span>{p.name}</span>
                            {p.link && <span className="text-[10px] font-mono font-medium text-brand-blue">{p.link}</span>}
                          </div>
                          {p.technologies && <p className="text-[10px] text-slate-500 font-mono">Tech Stack: {p.technologies}</p>}
                          {p.description && <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {educationsList.length > 0 && (
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">Education</h3>
                      <div className="space-y-2">
                        {educationsList.map((e, idx) => (
                          <div key={idx} className="text-xs">
                            <div className="flex justify-between font-bold text-slate-900">
                              <span>{e.degree} {e.specialization && `in ${e.specialization}`}</span>
                              <span className="font-normal text-slate-500">{e.startYear} - {e.endYear || 'Present'}</span>
                            </div>
                            <p className="text-slate-600 text-[11px]">{e.institute}</p>
                            {e.cgpa && <p className="text-[10px] text-emerald-600 font-bold font-mono">CGPA/Grade: {e.cgpa}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {certificationsList.length > 0 && (
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">Certifications</h3>
                      <div className="space-y-2">
                        {certificationsList.map((c, idx) => (
                          <div key={idx} className="text-xs">
                            <div className="flex justify-between font-bold text-slate-900">
                              <span>{c.name}</span>
                              <span className="font-normal text-slate-500">{c.year}</span>
                            </div>
                            <p className="text-slate-600 text-[11px]">{c.issuer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {languagesList.length > 0 && (
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">Spoken Languages</h3>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {languagesList.map((l, idx) => <span key={idx} className="font-semibold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-[11px]">{l.name} ({l.proficiency})</span>)}
                      </div>
                    </div>
                  )}

                  {referencesList.length > 0 && (
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">Professional References</h3>
                      <div className="space-y-2">
                        {referencesList.map((r, idx) => (
                          <div key={idx} className="text-xs">
                            <p className="font-bold text-slate-900">{r.name}</p>
                            <p className="text-slate-500 text-[11px]">{r.title} {r.company && `at ${r.company}`}</p>
                            <p className="text-brand-blue font-mono text-[10px]">{r.contact}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {achievementsList.length > 0 && (
                  <div className="pt-2">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">Achievements & Honors</h3>
                    <div className="space-y-2">
                      {achievementsList.map((a, idx) => (
                        <div key={idx} className="text-xs text-slate-700">
                          <p className="font-bold text-slate-900">{a.title} {a.year && <span className="font-normal text-slate-500">({a.year})</span>}</p>
                          {a.description && <p className="text-slate-600 text-[11px]">{a.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={() => setShowPreviewModal(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer">Close Preview</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
