import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/firebase';
import { useAuth } from './AuthContext';

export interface CandidateProfileData {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  headline?: string;
  bio?: string;
  experience?: string;
  education?: string;
  profilePhoto?: string;
  zip?: string;
  languages?: string;
  [key: string]: any;
}

export interface JobSeekerDoc {
  profile: CandidateProfileData;
  resume?: any;
  documents?: any[];
  certificates?: any[];
  saved_jobs?: any[];
  ai_profile?: any;
  preferences?: any;
  activity?: any[];
  settings?: {
    theme?: 'light' | 'dark';
    language?: string;
    emailNotifications?: boolean;
    pushAlerts?: boolean;
    smsAlerts?: boolean;
    recomAlerts?: boolean;
    searchableByRecruiters?: boolean;
    showActiveStatus?: boolean;
    autoHandshake?: boolean;
    [key: string]: any;
  };
  experiences?: any[];
  educations?: any[];
  skillsCategories?: any[];
  skills?: string[];
  links?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    website?: string;
    leetcode?: string;
    hackerrank?: string;
    codeforces?: string;
    behance?: string;
    dribbble?: string;
    medium?: string;
    youtube?: string;
    x?: string;
    [key: string]: any;
  };
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

interface JobSeekerContextType {
  jobSeekerProfile: JobSeekerDoc | null;
  loading: boolean;
  theme: 'light' | 'dark';
  profileCompletion: number;
  resumeCompletion: number;
  setTheme: (theme: 'light' | 'dark') => Promise<void>;
  updateProfile: (profileFields: Partial<CandidateProfileData>) => Promise<void>;
  updateSettings: (settingsFields: Partial<any>) => Promise<void>;
  updatePreferences: (prefFields: Partial<any>) => Promise<void>;
  saveResume: (resumeData: any) => Promise<void>;
  addExperience: (exp: any) => Promise<void>;
  updateExperience: (id: string, exp: any) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  addEducation: (edu: any) => Promise<void>;
  updateEducation: (id: string, edu: any) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
  updateSkills: (skillsCategories: any[]) => Promise<void>;
  updateLinks: (links: any) => Promise<void>;
  addActivity: (action: string, details: string) => Promise<void>;
}

const JobSeekerContext = createContext<JobSeekerContextType | null>(null);

export function useJobSeeker() {
  const context = useContext(JobSeekerContext);
  if (!context) {
    throw new Error('useJobSeeker must be used within a JobSeekerProvider');
  }
  return context;
}

interface JobSeekerProviderProps {
  children: React.ReactNode;
}

export function JobSeekerProvider({ children }: JobSeekerProviderProps) {
  const { user, userProfile } = useAuth();
  const [jobSeekerProfile, setJobSeekerProfile] = useState<JobSeekerDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  const uid = user?.uid || userProfile?.uid;
  const isCandidate = userProfile?.role === 'marketplace_jobseeker' || userProfile?.role === 'm_candidate' || userProfile?.role === 'marketplace_student';

  // Helper to calculate Profile Completion Score (0-100%) dynamically
  const calculateProfileCompletion = (data: any) => {
    if (!data) return 0;
    let score = 0;
    
    const prof = data.profile || {};
    const experiences = data.experiences || prof.experiences || [];
    const educations = data.educations || prof.educations || [];
    const skillsCategories = data.skillsCategories || [];
    const hasSkills = (data.skills && data.skills.length > 0) || (skillsCategories.some((c: any) => c.skills && c.skills.length > 0));
    
    const prefs = data.preferences || {};
    const hasPrefs = (prefs.prefRoles && prefs.prefRoles.length > 0) || (prefs.preferredRoles && prefs.preferredRoles.length > 0);
    
    const hasResume = !!data.resume;
    
    const links = data.links || {};
    const hasLinks = Object.values(links).some(val => !!val) || !!data.linkedin || !!data.github || !!data.portfolio;

    // 1. Personal info complete (+15%)
    const hasPersonalInfo = !!(prof.fullName || data.fullName) && 
                            !!(prof.email || data.email) && 
                            !!(prof.phone || prof.phoneNumber || data.phone || data.phoneNumber);
    if (hasPersonalInfo) score += 15;

    // 2. Experience added (+15%)
    if (experiences.length > 0) score += 15;

    // 3. Education added (+15%)
    if (educations.length > 0) score += 15;

    // 4. Skills categorized (+15%)
    if (hasSkills) score += 15;

    // 5. Matching preferences complete (+15%)
    if (hasPrefs) score += 15;

    // 6. Resume uploaded (+15%)
    if (hasResume) score += 15;

    // 7. Any social links added (+10%)
    if (hasLinks) score += 10;

    return score;
  };

  // Helper to calculate Resume Completion Score (0-100%) dynamically
  const calculateResumeCompletion = (resume: any) => {
    if (!resume) return 0;
    let score = 0;
    
    if (typeof resume === 'string') {
      const text = resume.trim();
      if (!text) return 0;

      // 1. Word count (up to 40 points)
      const words = text.split(/\s+/).filter(Boolean).length;
      if (words > 250) score += 40;
      else if (words > 150) score += 30;
      else if (words > 80) score += 20;
      else if (words > 30) score += 10;
      else if (words > 0) score += 5;

      // 2. Section Headings (up to 40 points)
      const sectionKeywords = [
        'experience', 'work', 'history', 'employment',
        'education', 'academic', 'university', 'college', 'school',
        'skills', 'technologies', 'tools', 'languages',
        'projects', 'portfolio', 'achievements', 'certifications', 'awards',
        'summary', 'about', 'profile'
      ];
      const lowerText = text.toLowerCase();
      let detectedSectionsCount = 0;
      sectionKeywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          detectedSectionsCount++;
        }
      });
      score += Math.min(40, detectedSectionsCount * 8);

      // 3. Contact Info (up to 20 points)
      const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
      const hasPhone = /(\+?\d{1,4}[\s-])?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/.test(text);
      if (hasEmail) score += 10;
      if (hasPhone) score += 10;
      
    } else if (typeof resume === 'object') {
      // If structured object
      if (resume.summary || resume.objective || resume.careerSummary) score += 10;
      
      const hasExp = (resume.experience && (typeof resume.experience === 'string' ? resume.experience.trim().length > 10 : resume.experience.length > 0)) || 
                     (resume.experiences && resume.experiences.length > 0);
      if (hasExp) score += 15;

      const hasEdu = (resume.education && (typeof resume.education === 'string' ? resume.education.trim().length > 10 : resume.education.length > 0)) || 
                     (resume.educations && resume.educations.length > 0);
      if (hasEdu) score += 15;

      const hasSk = (resume.skills && (typeof resume.skills === 'string' ? resume.skills.trim().length > 2 : resume.skills.length > 0));
      if (hasSk) score += 10;

      const emailVal = resume.email || resume.contact?.email || resume.personalInfo?.email;
      const phoneVal = resume.phone || resume.phoneNumber || resume.contact?.phone || resume.contact?.phoneNumber || resume.personalInfo?.phone;
      const locVal = resume.location || resume.address || resume.contact?.location || resume.contact?.address || resume.personalInfo?.location;

      if (emailVal) score += 10;
      if (phoneVal) score += 10;
      if (locVal) score += 10;

      const hasProj = (resume.projects && (typeof resume.projects === 'string' ? resume.projects.trim().length > 10 : resume.projects.length > 0));
      if (hasProj) score += 10;

      const hasCert = (resume.certifications && (typeof resume.certifications === 'string' ? resume.certifications.trim().length > 10 : resume.certifications.length > 0));
      if (hasCert) score += 10;
    }

    return Math.min(100, score);
  };

  const profileCompletion = calculateProfileCompletion(jobSeekerProfile);
  const resumeCompletion = calculateResumeCompletion(jobSeekerProfile?.resume);

  // Establish Exactly ONE Real-time listener for marketplace_jobseekers/{uid}
  useEffect(() => {
    if (!uid || !isCandidate) {
      setJobSeekerProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const docRef = doc(db, 'marketplace_jobseekers', uid);

    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as JobSeekerDoc;
        setJobSeekerProfile(data);

        // Sync and apply theme configuration
        const storedTheme = data.settings?.theme || 'light';
        setThemeState(storedTheme);
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(storedTheme);
        localStorage.setItem('theme', storedTheme);
      } else {
        // Initialize profile doc if missing
        const initialDoc: JobSeekerDoc = {
          profile: {
            uid,
            fullName: userProfile?.fullName || user?.displayName || 'Job Seeker',
            email: userProfile?.email || user?.email || '',
            phoneNumber: userProfile?.phoneNumber || '',
            status: 'approved',
            createdAt: new Date().toISOString()
          },
          resume: '',
          documents: [],
          certificates: [],
          saved_jobs: [],
          ai_profile: {
            resumeScore: 85,
            profileScore: 50,
            skillScore: 40,
            matchScore: 45,
            missingSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
            strengths: ['Frontend Development', 'State Management'],
            recommendations: ['Complete all profile details', 'Add certifications for cloud services']
          },
          preferences: {
            prefSalary: '₹12 - 18 LPA',
            prefNoticePeriod: 'Immediate',
            prefRoles: ['Frontend Developer', 'Full Stack Developer'],
            prefLocations: ['Hyderabad', 'Bangalore'],
            prefRemote: true,
            prefHybrid: true,
            prefOnsite: false,
            prefRelocation: true,
            prefInternational: false,
            prefEmploymentType: ['Full-Time'],
            prefIndustries: ['SaaS', 'AI/Deep Tech'],
            jobAlerts: true,
            aiRecommendation: true,
            recruiterVisibility: true,
            availabilityStatus: 'Actively Looking'
          },
          activity: [
            {
              id: `act-init-${Date.now()}`,
              action: 'Account Provisioned',
              timestamp: new Date().toISOString(),
              details: 'Marketplace job seeker profile created successfully.'
            }
          ],
          settings: {
            theme: 'light',
            language: 'English',
            emailNotifications: true,
            pushAlerts: true,
            smsAlerts: false,
            recomAlerts: true,
            searchableByRecruiters: true,
            showActiveStatus: true,
            autoHandshake: false
          },
          experiences: [
            {
              id: 'exp-1',
              role: 'Frontend Engineering Intern',
              company: 'Google',
              employmentType: 'Internship',
              startDate: 'Jan 2025',
              endDate: 'Present',
              current: true,
              description: 'Engineering unified cross-platform layouts, optimizing Google Cloud console dashboard components, and integrating design tokens with Core UX.',
              skillsUsed: ['React', 'TypeScript', 'Tailwind CSS']
            }
          ],
          educations: [
            {
              id: 'edu-1',
              institute: 'Aryx University',
              degree: 'B.Tech',
              specialization: 'Computer Science & Engineering',
              cgpa: '9.2/10',
              startYear: '2022',
              endYear: '2026'
            }
          ],
          skillsCategories: [
            { id: 'prog', label: 'Programming', icon: 'Code', skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'] },
            { id: 'front', label: 'Frontend', icon: 'Terminal', skills: ['React', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS'] },
            { id: 'back', label: 'Backend', icon: 'Server', skills: ['Node.js', 'Express.js', 'Django', 'FastAPI'] },
            { id: 'db', label: 'Database', icon: 'Database', skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis'] },
            { id: 'cloud', label: 'Cloud', icon: 'Cloud', skills: ['Google Cloud', 'AWS', 'Vercel', 'Docker'] },
            { id: 'ai', label: 'AI', icon: 'Cpu', skills: ['Gemini SDK', 'OpenAI API', 'LangChain'] },
            { id: 'tools', label: 'Tools', icon: 'Wrench', skills: ['Git', 'GitHub', 'VS Code', 'Figma', 'Postman'] },
            { id: 'soft', label: 'Soft Skills', icon: 'BookOpen', skills: ['Communication', 'Teamwork', 'Problem Solving', 'Adaptability'] }
          ],
          skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express.js', 'Tailwind CSS'],
          links: {
            github: 'https://github.com/rishikumar',
            linkedin: 'https://linkedin.com/in/rishikumar',
            portfolio: 'https://rishi.dev',
            website: 'https://rishidev.vercel.app',
            leetcode: 'https://leetcode.com/rishikumar',
            hackerrank: 'https://hackerrank.com/rishikumar',
            codeforces: 'https://codeforces.com/profile/rishikumar',
            behance: '',
            dribbble: '',
            medium: 'https://medium.com/@rishikumar',
            youtube: '',
            x: 'https://x.com/rishidev'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setDoc(docRef, initialDoc)
          .then(() => setJobSeekerProfile(initialDoc))
          .catch(err => handleFirestoreError(err, OperationType.WRITE, `marketplace_jobseekers/${uid}`));
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `marketplace_jobseekers/${uid}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid, isCandidate]);

  // Firestore update helper
  const updateProfile = async (profileFields: Partial<CandidateProfileData>) => {
    if (!uid) return;
    const docRef = doc(db, 'marketplace_jobseekers', uid);
    
    const payload: any = {
      updatedAt: new Date().toISOString()
    };

    Object.entries(profileFields).forEach(([key, val]) => {
      if (val !== undefined) {
        payload[`profile.${key}`] = val;
        payload[key] = val;
      }
    });

    try {
      await updateDoc(docRef, payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
    }
  };

  const updateSettings = async (settingsFields: Partial<any>) => {
    if (!uid) return;
    const docRef = doc(db, 'marketplace_jobseekers', uid);
    
    const payload: any = {
      updatedAt: new Date().toISOString()
    };

    Object.entries(settingsFields).forEach(([key, val]) => {
      if (val !== undefined) {
        payload[`settings.${key}`] = val;
      }
    });

    try {
      await updateDoc(docRef, payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
    }
  };

  const updatePreferences = async (prefFields: Partial<any>) => {
    if (!uid) return;
    const docRef = doc(db, 'marketplace_jobseekers', uid);

    const payload: any = {
      updatedAt: new Date().toISOString()
    };

    Object.entries(prefFields).forEach(([key, val]) => {
      if (val !== undefined) {
        payload[`preferences.${key}`] = val;
      }
    });

    try {
      await updateDoc(docRef, payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
    }
  };

  const saveResume = async (resumeData: any) => {
    if (!uid) return;
    const docRef = doc(db, 'marketplace_jobseekers', uid);

    try {
      await updateDoc(docRef, {
        resume: resumeData,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
    }
  };

  const addExperience = async (exp: any) => {
    if (!uid || !jobSeekerProfile) return;
    const docRef = doc(db, 'marketplace_jobseekers', uid);
    const currentExps = jobSeekerProfile.experiences || [];
    const newExps = [...currentExps, exp];

    try {
      await updateDoc(docRef, {
        experiences: newExps,
        'profile.experiences': newExps,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
    }
  };

  const updateExperience = async (id: string, exp: any) => {
    if (!uid || !jobSeekerProfile) return;
    const docRef = doc(db, 'marketplace_jobseekers', uid);
    const currentExps = jobSeekerProfile.experiences || [];
    const newExps = currentExps.map(e => e.id === id ? { ...e, ...exp } : e);

    try {
      await updateDoc(docRef, {
        experiences: newExps,
        'profile.experiences': newExps,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
    }
  };

  const deleteExperience = async (id: string) => {
    if (!uid || !jobSeekerProfile) return;
    const docRef = doc(db, 'marketplace_jobseekers', uid);
    const currentExps = jobSeekerProfile.experiences || [];
    const newExps = currentExps.filter(e => e.id !== id);

    try {
      await updateDoc(docRef, {
        experiences: newExps,
        'profile.experiences': newExps,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
    }
  };

  const addEducation = async (edu: any) => {
    if (!uid || !jobSeekerProfile) return;
    const docRef = doc(db, 'marketplace_jobseekers', uid);
    const currentEdus = jobSeekerProfile.educations || [];
    const newEdus = [...currentEdus, edu];

    try {
      await updateDoc(docRef, {
        educations: newEdus,
        'profile.educations': newEdus,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
    }
  };

  const updateEducation = async (id: string, edu: any) => {
    if (!uid || !jobSeekerProfile) return;
    const docRef = doc(db, 'marketplace_jobseekers', uid);
    const currentEdus = jobSeekerProfile.educations || [];
    const newEdus = currentEdus.map(e => e.id === id ? { ...e, ...edu } : e);

    try {
      await updateDoc(docRef, {
        educations: newEdus,
        'profile.educations': newEdus,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
    }
  };

  const deleteEducation = async (id: string) => {
    if (!uid || !jobSeekerProfile) return;
    const docRef = doc(db, 'marketplace_jobseekers', uid);
    const currentEdus = jobSeekerProfile.educations || [];
    const newEdus = currentEdus.filter(e => e.id !== id);

    try {
      await updateDoc(docRef, {
        educations: newEdus,
        'profile.educations': newEdus,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
    }
  };

  const updateSkills = async (skillsCategories: any[]) => {
    if (!uid) return;
    const docRef = doc(db, 'marketplace_jobseekers', uid);
    const flatSkills = skillsCategories.reduce((acc: string[], cat: any) => [...acc, ...(cat.skills || [])], []);

    try {
      await updateDoc(docRef, {
        skillsCategories,
        skills: flatSkills,
        'profile.skills': flatSkills,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
    }
  };

  const updateLinks = async (linksFields: any) => {
    if (!uid || !jobSeekerProfile) return;
    const docRef = doc(db, 'marketplace_jobseekers', uid);
    const currentLinks = jobSeekerProfile.links || {};
    const updatedLinks = { ...currentLinks, ...linksFields };

    try {
      await updateDoc(docRef, {
        links: updatedLinks,
        linkedin: updatedLinks.linkedin || '',
        github: updatedLinks.github || '',
        portfolio: updatedLinks.portfolio || '',
        'profile.linkedin': updatedLinks.linkedin || '',
        'profile.github': updatedLinks.github || '',
        'profile.portfolio': updatedLinks.portfolio || '',
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
    }
  };

  const addActivity = async (action: string, details: string) => {
    if (!uid) return;
    const docRef = doc(db, 'marketplace_jobseekers', uid);

    try {
      await updateDoc(docRef, {
        activity: arrayUnion({
          id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          action,
          timestamp: new Date().toISOString(),
          details
        })
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
    }
  };

  const setTheme = async (newTheme: 'light' | 'dark') => {
    await updateSettings({ theme: newTheme });
  };

  return (
    <JobSeekerContext.Provider value={{
      jobSeekerProfile,
      loading,
      theme,
      profileCompletion,
      resumeCompletion,
      setTheme,
      updateProfile,
      updateSettings,
      updatePreferences,
      saveResume,
      addExperience,
      updateExperience,
      deleteExperience,
      addEducation,
      updateEducation,
      deleteEducation,
      updateSkills,
      updateLinks,
      addActivity
    }}>
      {children}
    </JobSeekerContext.Provider>
  );
}
