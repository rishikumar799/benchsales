import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { uploadCandidateProfilePhoto } from '../../../../services/documentStorageService';
import { 
  User, 
  MapPin, 
  Calendar, 
  Edit, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Briefcase, 
  Layers, 
  Sparkles, 
  Github, 
  Linkedin, 
  Globe, 
  GraduationCap, 
  Check, 
  Sliders,
  Plus,
  Trash2,
  X,
  ExternalLink,
  Code,
  Terminal,
  Database,
  Server,
  Cloud,
  Cpu,
  Wrench,
  BookOpen,
  Info,
  ChevronDown,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';
import { useJobSeeker } from '../../../../context/JobSeekerContext';

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  skillsUsed: string[];
}

interface EducationItem {
  id: string;
  institute: string;
  degree: string;
  specialization: string;
  cgpa: string;
  startYear: string;
  endYear: string;
}

interface SkillCategory {
  id: string;
  label: string;
  icon: any;
  skills: string[];
}

interface SocialLinks {
  github: string;
  linkedin: string;
  portfolio: string;
  website: string;
  leetcode: string;
  hackerrank: string;
  codeforces: string;
  behance: string;
  dribbble: string;
  medium: string;
  youtube: string;
  x: string;
}

export default function ProfileTab() {
  const { user, userProfile } = useAuth();
  const { jobSeekerProfile, loading: profileLoading } = useJobSeeker();
  const uid = user?.uid || userProfile?.uid;
  const [loading, setLoading] = useState(true);

  const [activeSubTab, setActiveSubTab] = useState('INFO');
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [savedMsgText, setSavedMsgText] = useState('Your profile changes have been saved successfully!');

  // Info Tab State
  const [fullName, setFullName] = useState('Rishi Kumar');
  const [email, setEmail] = useState('rishi.kumar@email.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [dob, setDob] = useState('12 May 1999');
  const [gender, setGender] = useState('Male');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [country, setCountry] = useState('India');
  const [address, setAddress] = useState('Madhapur, Hitech City, Sector 2');
  const [aboutMe, setAboutMe] = useState(
    'Passionate Full Stack Developer with 2+ years of hands-on experience in engineering high-fidelity React applications, Express REST APIs, and responsive UI frameworks. Enthusiastic about design systems, cloud architecture, and building user-centric digital platforms.'
  );

  // New fields to persist
  const [dbResumeScore, setDbResumeScore] = useState(85);
  const [dbCreatedAt, setDbCreatedAt] = useState('');
  const [headline, setHeadline] = useState('Marketplace Applicant');
  const [languages, setLanguages] = useState('English, Telugu, Hindi');
  const [experienceStr, setExperienceStr] = useState('Entry Level');
  const [educationStr, setEducationStr] = useState('B.Tech in Computer Science & Engineering');
  const [profilePhoto, setProfilePhoto] = useState('https://picsum.photos/seed/user123/200/200');
  const [zip, setZip] = useState('500081');
  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handleProfilePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && uid) {
      const file = e.target.files[0];
      setIsUploadingPhoto(true);
      try {
        const newPhotoUrl = await uploadCandidateProfilePhoto(file, uid, fullName);
        setProfilePhoto(newPhotoUrl);
        triggerToast("Profile photo uploaded and updated in real time!");
      } catch (err: any) {
        console.error("Failed to upload profile photo:", err);
        triggerToast(`Photo upload error: ${err?.message || err?.code || String(err)}`);
      } finally {
        setIsUploadingPhoto(false);
        e.target.value = '';
      }
    }
  };

  // Experience Tab State
  const [experiences, setExperiences] = useState<ExperienceItem[]>([
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
    },
    {
      id: 'exp-2',
      role: 'Full Stack Developer',
      company: 'Aryx Labs',
      employmentType: 'Full-time',
      startDate: 'May 2024',
      endDate: 'Dec 2024',
      current: false,
      description: 'Coordinated backend APIs, serverless Google Cloud Functions, and built premium real-time status tracking applications.',
      skillsUsed: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL']
    }
  ]);

  // Experience Dialog State
  const [showExpModal, setShowExpModal] = useState(false);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expRole, setExpRole] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expType, setExpType] = useState('Full-time');
  const [expStart, setExpStart] = useState('');
  const [expEnd, setExpEnd] = useState('');
  const [expCurrent, setExpCurrent] = useState(false);
  const [expDesc, setExpDesc] = useState('');
  const [expSkillsInput, setExpSkillsInput] = useState('');

  // Education Tab State
  const [educations, setEducations] = useState<EducationItem[]>([
    {
      id: 'edu-1',
      institute: 'Aryx University',
      degree: 'B.Tech',
      specialization: 'Computer Science & Engineering',
      cgpa: '9.2/10',
      startYear: '2022',
      endYear: '2026'
    }
  ]);

  // Education Dialog State
  const [showEduModal, setShowEduModal] = useState(false);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [eduInstitute, setEduInstitute] = useState('');
  const [eduDegree, setEduDegree] = useState('');
  const [eduSpecialization, setEduSpecialization] = useState('');
  const [eduCgpa, setEduCgpa] = useState('');
  const [eduStart, setEduStart] = useState('');
  const [eduEnd, setEduEnd] = useState('');

  // Skills Categories State
  const [skillsCategories, setSkillsCategories] = useState<SkillCategory[]>([
    { id: 'prog', label: 'Programming', icon: Code, skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'] },
    { id: 'front', label: 'Frontend', icon: Terminal, skills: ['React', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS'] },
    { id: 'back', label: 'Backend', icon: Server, skills: ['Node.js', 'Express.js', 'Django', 'FastAPI'] },
    { id: 'db', label: 'Database', icon: Database, skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis'] },
    { id: 'cloud', label: 'Cloud', icon: Cloud, skills: ['Google Cloud', 'AWS', 'Vercel', 'Docker'] },
    { id: 'ai', label: 'AI', icon: Cpu, skills: ['Gemini SDK', 'OpenAI API', 'LangChain'] },
    { id: 'tools', label: 'Tools', icon: Wrench, skills: ['Git', 'GitHub', 'VS Code', 'Figma', 'Postman'] },
    { id: 'soft', label: 'Soft Skills', icon: BookOpen, skills: ['Communication', 'Teamwork', 'Problem Solving', 'Adaptability'] }
  ]);

  const [newSkillText, setNewSkillText] = useState('');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('prog');

  // Social Links State
  const [links, setLinks] = useState<SocialLinks>({
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
  });

  // Link Edit Mode State
  const [editingLinks, setEditingLinks] = useState(false);

  // Preferences State
  const [prefSalary, setPrefSalary] = useState('₹12 - 18 LPA');
  const [prefRoles, setPrefRoles] = useState<string[]>(['Frontend Developer', 'Full Stack Developer', 'Software Engineer']);
  const [newPrefRole, setNewPrefRole] = useState('');
  const [prefLocations, setPrefLocations] = useState<string[]>(['Hyderabad', 'Bangalore', 'Remote']);
  const [newPrefLocation, setNewPrefLocation] = useState('');
  const [prefRemote, setPrefRemote] = useState(true);
  const [prefHybrid, setPrefHybrid] = useState(true);
  const [prefOnsite, setPrefOnsite] = useState(false);
  const [prefRelocation, setPrefRelocation] = useState(true);
  const [prefInternational, setPrefInternational] = useState(false);
  const [prefNoticePeriod, setPrefNoticePeriod] = useState('Immediate');
  const [prefEmploymentType, setPrefEmploymentType] = useState<string[]>(['Full-Time', 'Internship']);
  const [prefIndustries, setPrefIndustries] = useState<string[]>(['Fintech', 'SaaS', 'E-commerce', 'AI/Deep Tech']);
  const [newPrefIndustry, setNewPrefIndustry] = useState('');
  
  // Preference Alerts / Flags
  const [jobAlerts, setJobAlerts] = useState(true);
  const [aiRecommendation, setAiRecommendation] = useState(true);
  const [recruiterVisibility, setRecruiterVisibility] = useState(true);
  const [availabilityStatus, setAvailabilityStatus] = useState('Actively Looking');

  // Submitting guards to prevent duplicate Firestore writes on rapid clicks
  const [isSubmittingExp, setIsSubmittingExp] = useState(false);
  const [isSubmittingEdu, setIsSubmittingEdu] = useState(false);
  const [isSubmittingInfo, setIsSubmittingInfo] = useState(false);
  const [isSubmittingLinks, setIsSubmittingLinks] = useState(false);
  const [isSubmittingPref, setIsSubmittingPref] = useState(false);

  const triggerToast = (msg: string) => {
    setSavedMsgText(msg);
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  // Real-time Firestore Sync from JobSeekerContext
  useEffect(() => {
    if (profileLoading) {
      setLoading(true);
      return;
    }
    if (!uid) {
      setLoading(false);
      return;
    }

    if (jobSeekerProfile) {
      const data = jobSeekerProfile;
      const prof: any = data.profile || {};
      const resData: any = data.resume || {};
      
      setDbResumeScore(resData.resumeCompletion || resData.completion || 85);
      setDbCreatedAt(data.createdAt || prof.createdAt || '');

      setFullName(prof.fullName || data.fullName || '');
      setEmail(prof.email || data.email || '');
      setPhone(prof.phone || prof.phoneNumber || data.phone || data.phoneNumber || '');
      setDob(prof.dateOfBirth || data.dateOfBirth || '');
      setGender(prof.gender || data.gender || 'Male');
      setCity(data.city || '');
      setState(data.state || '');
      setCountry(data.country || '');
      setAddress(prof.address || data.address || '');
      setAboutMe(prof.bio || data.bio || prof.aboutMe || data.aboutMe || '');
      setHeadline(prof.headline || data.headline || 'Marketplace Applicant');
      setLanguages(prof.languages || data.languages || 'English, Telugu, Hindi');
      setExperienceStr(prof.experience || data.experience || 'Entry Level');
      setEducationStr(prof.education || data.education || 'B.Tech in Computer Science & Engineering');
      setProfilePhoto(prof.profilePhoto || data.profilePhoto || 'https://picsum.photos/seed/user123/200/200');
      setZip(data.zip || '500081');

      setExperiences(data.experiences || prof.experiences || []);
      setEducations(data.educations || prof.educations || []);
      if (data.skillsCategories) {
        setSkillsCategories(data.skillsCategories);
      }

      const currentLinks = data.links || {};
      setLinks({
        github: currentLinks.github || data.github || '',
        linkedin: currentLinks.linkedin || data.linkedin || '',
        portfolio: currentLinks.portfolio || data.portfolio || '',
        website: currentLinks.website || data.website || '',
        leetcode: currentLinks.leetcode || data.leetcode || '',
        hackerrank: currentLinks.hackerrank || data.hackerrank || '',
        codeforces: currentLinks.codeforces || data.codeforces || '',
        behance: currentLinks.behance || data.behance || '',
        dribbble: currentLinks.dribbble || data.dribbble || '',
        medium: currentLinks.medium || data.medium || '',
        youtube: currentLinks.youtube || data.youtube || '',
        x: currentLinks.x || data.x || ''
      });

      const prefs = data.preferences || {};
      setPrefSalary(prefs.prefSalary || data.expectedSalary || '₹12 - 18 LPA');
      setPrefNoticePeriod(prefs.prefNoticePeriod || data.noticePeriod || 'Immediate');
      setPrefRoles(prefs.prefRoles || data.prefRoles || ['Frontend Developer', 'Full Stack Developer']);
      setPrefLocations(prefs.prefLocations || data.preferredLocation || data.prefLocations || ['Hyderabad', 'Bangalore']);
      setPrefRemote(prefs.prefRemote !== undefined ? prefs.prefRemote : true);
      setPrefHybrid(prefs.prefHybrid !== undefined ? prefs.prefHybrid : true);
      setPrefOnsite(prefs.prefOnsite !== undefined ? prefs.prefOnsite : false);
      setPrefRelocation(prefs.prefRelocation !== undefined ? prefs.prefRelocation : true);
      setPrefInternational(prefs.prefInternational !== undefined ? prefs.prefInternational : false);
      setPrefEmploymentType(prefs.prefEmploymentType || ['Full-Time']);
      setPrefIndustries(prefs.prefIndustries || ['SaaS', 'AI/Deep Tech']);
      setJobAlerts(prefs.jobAlerts !== undefined ? prefs.jobAlerts : true);
      setAiRecommendation(prefs.aiRecommendation !== undefined ? prefs.aiRecommendation : true);
      setRecruiterVisibility(prefs.recruiterVisibility !== undefined ? prefs.recruiterVisibility : true);
      setAvailabilityStatus(prefs.availabilityStatus || data.availability || 'Actively Looking');
    }
    setLoading(false);
  }, [uid, jobSeekerProfile, profileLoading]);

  // Unified Update Helper
  const updateProfileInFirestore = async (overrideFields: any = {}) => {
    if (!uid) return;
    
    // Construct current state snapshots
    const currentFullName = overrideFields.fullName !== undefined ? overrideFields.fullName : fullName;
    const currentEmail = overrideFields.email !== undefined ? overrideFields.email : email;
    const currentPhone = overrideFields.phone !== undefined ? overrideFields.phone : phone;
    const currentDob = overrideFields.dateOfBirth !== undefined ? overrideFields.dateOfBirth : dob;
    const currentGender = overrideFields.gender !== undefined ? overrideFields.gender : gender;
    const currentCity = overrideFields.city !== undefined ? overrideFields.city : city;
    const currentState = overrideFields.state !== undefined ? overrideFields.state : state;
    const currentCountry = overrideFields.country !== undefined ? overrideFields.country : country;
    const currentAddress = overrideFields.address !== undefined ? overrideFields.address : address;
    const currentAboutMe = overrideFields.bio !== undefined ? overrideFields.bio : aboutMe;
    const currentHeadline = overrideFields.headline !== undefined ? overrideFields.headline : headline;
    const currentLanguages = overrideFields.languages !== undefined ? overrideFields.languages : languages;
    const currentExperienceStr = overrideFields.experience !== undefined ? overrideFields.experience : experienceStr;
    const currentEducationStr = overrideFields.education !== undefined ? overrideFields.education : educationStr;
    const currentProfilePhoto = overrideFields.profilePhoto !== undefined ? overrideFields.profilePhoto : profilePhoto;
    const currentZip = overrideFields.zip !== undefined ? overrideFields.zip : zip;
    
    const currentExperiences = overrideFields.experiences !== undefined ? overrideFields.experiences : experiences;
    const currentEducations = overrideFields.educations !== undefined ? overrideFields.educations : educations;
    const currentSkillsCategories = overrideFields.skillsCategories !== undefined ? overrideFields.skillsCategories : skillsCategories;
    const flatSkills = currentSkillsCategories.reduce((acc: string[], cat: any) => [...acc, ...cat.skills], []);
    
    const currentLinks = overrideFields.links !== undefined ? overrideFields.links : links;
    
    const currentPrefSalary = overrideFields.prefSalary !== undefined ? overrideFields.prefSalary : prefSalary;
    const currentPrefNoticePeriod = overrideFields.prefNoticePeriod !== undefined ? overrideFields.prefNoticePeriod : prefNoticePeriod;
    const currentPrefRoles = overrideFields.prefRoles !== undefined ? overrideFields.prefRoles : prefRoles;
    const currentPrefLocations = overrideFields.prefLocations !== undefined ? overrideFields.prefLocations : prefLocations;
    const currentPrefRemote = overrideFields.prefRemote !== undefined ? overrideFields.prefRemote : prefRemote;
    const currentPrefHybrid = overrideFields.prefHybrid !== undefined ? overrideFields.prefHybrid : prefHybrid;
    const currentPrefOnsite = overrideFields.prefOnsite !== undefined ? overrideFields.prefOnsite : prefOnsite;
    const currentPrefRelocation = overrideFields.prefRelocation !== undefined ? overrideFields.prefRelocation : prefRelocation;
    const currentPrefInternational = overrideFields.prefInternational !== undefined ? overrideFields.prefInternational : prefInternational;
    const currentPrefEmploymentType = overrideFields.prefEmploymentType !== undefined ? overrideFields.prefEmploymentType : prefEmploymentType;
    const currentPrefIndustries = overrideFields.prefIndustries !== undefined ? overrideFields.prefIndustries : prefIndustries;
    const currentJobAlerts = overrideFields.jobAlerts !== undefined ? overrideFields.jobAlerts : jobAlerts;
    const currentAiRecommendation = overrideFields.aiRecommendation !== undefined ? overrideFields.aiRecommendation : aiRecommendation;
    const currentRecruiterVisibility = overrideFields.recruiterVisibility !== undefined ? overrideFields.recruiterVisibility : recruiterVisibility;
    const currentAvailabilityStatus = overrideFields.availabilityStatus !== undefined ? overrideFields.availabilityStatus : availabilityStatus;

    const locationStr = `${currentCity}, ${currentState}, ${currentCountry}`;
    const timestamp = new Date().toISOString();

    const activityAction = overrideFields.activityAction || 'Profile Updated';
    const activityDetails = overrideFields.activityDetails || 'Saved personal profile details and information';

    const calculatedProfileScore = Math.min(100, (
      (currentFullName ? 15 : 0) +
      (currentEmail ? 15 : 0) +
      (currentPhone ? 15 : 0) +
      (currentAboutMe ? 15 : 0) +
      (currentExperiences.length > 0 ? 15 : 0) +
      (currentEducations.length > 0 ? 15 : 0) +
      (flatSkills.length > 0 ? 10 : 0)
    ));
    const calculatedSkillScore = Math.min(100, flatSkills.length * 6 + 40);

    const updatePayload: any = {
      fullName: currentFullName,
      email: currentEmail,
      phone: currentPhone,
      dateOfBirth: currentDob,
      gender: currentGender,
      location: locationStr,
      city: currentCity,
      state: currentState,
      country: currentCountry,
      address: currentAddress,
      headline: currentHeadline,
      bio: currentAboutMe,
      experience: currentExperienceStr,
      experiences: currentExperiences,
      education: currentEducationStr,
      educations: currentEducations,
      skills: flatSkills,
      skillsCategories: currentSkillsCategories,
      languages: currentLanguages,
      linkedin: currentLinks.linkedin || '',
      github: currentLinks.github || '',
      portfolio: currentLinks.portfolio || '',
      website: currentLinks.website || '',
      leetcode: currentLinks.leetcode || '',
      hackerrank: currentLinks.hackerrank || '',
      codeforces: currentLinks.codeforces || '',
      behance: currentLinks.behance || '',
      dribbble: currentLinks.dribbble || '',
      medium: currentLinks.medium || '',
      youtube: currentLinks.youtube || '',
      x: currentLinks.x || '',
      profilePhoto: currentProfilePhoto,
      availability: currentAvailabilityStatus,
      preferredLocation: currentPrefLocations,
      expectedSalary: currentPrefSalary,
      noticePeriod: currentPrefNoticePeriod,
      zip: currentZip,
      updatedAt: timestamp,

      profile: {
        uid,
        fullName: currentFullName,
        email: currentEmail,
        phoneNumber: currentPhone,
        phone: currentPhone,
        dateOfBirth: currentDob,
        gender: currentGender,
        location: locationStr,
        address: currentAddress,
        headline: currentHeadline,
        bio: currentAboutMe,
        experience: currentExperienceStr,
        education: currentEducationStr,
        skills: flatSkills,
        languages: currentLanguages.split(',').map((l: string) => l.trim()).filter(Boolean),
        linkedin: currentLinks.linkedin || '',
        github: currentLinks.github || '',
        portfolio: currentLinks.portfolio || '',
        availability: currentAvailabilityStatus,
        preferredLocation: currentPrefLocations,
        photoURL: currentProfilePhoto,
        status: 'approved',
        createdAt: dbCreatedAt || timestamp,
        updatedAt: timestamp
      },
      preferences: {
        prefSalary: currentPrefSalary,
        prefNoticePeriod: currentPrefNoticePeriod,
        prefRoles: currentPrefRoles,
        prefLocations: currentPrefLocations,
        prefRemote: currentPrefRemote,
        prefHybrid: currentPrefHybrid,
        prefOnsite: currentPrefOnsite,
        prefRelocation: currentPrefRelocation,
        prefInternational: currentPrefInternational,
        prefEmploymentType: currentPrefEmploymentType,
        prefIndustries: currentPrefIndustries,
        jobAlerts: currentJobAlerts,
        aiRecommendation: currentAiRecommendation,
        recruiterVisibility: currentRecruiterVisibility,
        availabilityStatus: currentAvailabilityStatus,

        preferredRoles: currentPrefRoles,
        preferredLocations: currentPrefLocations,
        expectedSalary: currentPrefSalary,
        employmentTypes: currentPrefEmploymentType,
        workMode: currentPrefRemote ? 'Remote' : currentPrefHybrid ? 'Hybrid' : 'Onsite',
        noticePeriod: currentPrefNoticePeriod
      },
      ai_profile: {
        resumeScore: dbResumeScore,
        profileScore: calculatedProfileScore,
        skillScore: calculatedSkillScore,
        matchScore: Math.round((calculatedProfileScore + calculatedSkillScore) / 2),
        missingSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
        strengths: ['Frontend Development', 'State Management', 'React Architecture'],
        recommendations: ['Complete all profile details', 'Add certifications for cloud services']
      },
      activity: arrayUnion({
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        action: activityAction,
        timestamp: timestamp,
        details: activityDetails
      })
    };

    try {
      const docRef = doc(db, 'marketplace_jobseekers', uid);
      await updateDoc(docRef, updatePayload);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
      triggerToast("Failed to save changes to Firestore.");
    }
  };

  // Profile Completion list trigger action
  const handleCompleteMissingDetails = () => {
    setActiveSubTab('EDUCATION, SKILLS & LINKS');
    triggerToast("Let's complete your Skills, Academic and Social links!");
  };

  // INFO Save
  const handleInfoSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingInfo) return;
    setIsSubmittingInfo(true);
    try {
      await updateProfileInFirestore({
        fullName,
        email,
        phone,
        dateOfBirth: dob,
        gender,
        city,
        state,
        country,
        address,
        bio: aboutMe,
        headline,
        languages,
        experience: experienceStr,
        education: educationStr,
        profilePhoto,
        zip
      });
      triggerToast("Personal Information updated successfully!");
    } finally {
      setIsSubmittingInfo(false);
    }
  };

  // EXPERIENCE Actions
  const handleOpenExpAdd = () => {
    setEditingExpId(null);
    setExpRole('');
    setExpCompany('');
    setExpType('Full-time');
    setExpStart('');
    setExpEnd('');
    setExpCurrent(false);
    setExpDesc('');
    setExpSkillsInput('');
    setShowExpModal(true);
  };

  const handleOpenExpEdit = (item: ExperienceItem) => {
    setEditingExpId(item.id);
    setExpRole(item.role);
    setExpCompany(item.company);
    setExpType(item.employmentType);
    setExpStart(item.startDate);
    setExpEnd(item.endDate);
    setExpCurrent(item.current);
    setExpDesc(item.description);
    setExpSkillsInput(item.skillsUsed.join(', '));
    setShowExpModal(true);
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingExp) return;
    setIsSubmittingExp(true);

    try {
      const skillsArr = expSkillsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      let updatedExperiences: ExperienceItem[];
      if (editingExpId) {
        updatedExperiences = experiences.map((exp) =>
          exp.id === editingExpId
            ? {
                ...exp,
                role: expRole,
                company: expCompany,
                employmentType: expType,
                startDate: expStart,
                endDate: expCurrent ? 'Present' : expEnd,
                current: expCurrent,
                description: expDesc,
                skillsUsed: skillsArr
              }
            : exp
        );
      } else {
        const newExp: ExperienceItem = {
          id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          role: expRole,
          company: expCompany,
          employmentType: expType,
          startDate: expStart,
          endDate: expCurrent ? 'Present' : expEnd,
          current: expCurrent,
          description: expDesc,
          skillsUsed: skillsArr
        };
        updatedExperiences = [...experiences, newExp];
      }

      setExperiences(updatedExperiences);
      await updateProfileInFirestore({ 
        experiences: updatedExperiences,
        activityAction: editingExpId ? 'Experience Updated' : 'Experience Added',
        activityDetails: `${editingExpId ? 'Updated' : 'Added'} ${expRole} position at ${expCompany}`
      });
      setShowExpModal(false);
      triggerToast(editingExpId ? 'Experience details updated successfully!' : 'Professional experience card added!');
    } catch (err) {
      console.error("Save experience error:", err);
    } finally {
      setIsSubmittingExp(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    const updatedExperiences = experiences.filter((exp) => exp.id !== id);
    setExperiences(updatedExperiences);
    await updateProfileInFirestore({ experiences: updatedExperiences });
    triggerToast('Experience card deleted.');
  };

  // EDUCATION Actions
  const handleOpenEduAdd = () => {
    setEditingEduId(null);
    setEduInstitute('');
    setEduDegree('');
    setEduSpecialization('');
    setEduCgpa('');
    setEduStart('');
    setEduEnd('');
    setShowEduModal(true);
  };

  const handleOpenEduEdit = (item: EducationItem) => {
    setEditingEduId(item.id);
    setEduInstitute(item.institute);
    setEduDegree(item.degree);
    setEduSpecialization(item.specialization);
    setEduCgpa(item.cgpa);
    setEduStart(item.startYear);
    setEduEnd(item.endYear);
    setShowEduModal(true);
  };

  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingEdu) return;
    setIsSubmittingEdu(true);

    try {
      let updatedEducations: EducationItem[];
      if (editingEduId) {
        updatedEducations = educations.map((edu) =>
          edu.id === editingEduId
            ? {
                ...edu,
                institute: eduInstitute,
                degree: eduDegree,
                specialization: eduSpecialization,
                cgpa: eduCgpa,
                startYear: eduStart,
                endYear: eduEnd
              }
            : edu
        );
      } else {
        const newEdu: EducationItem = {
          id: `edu-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          institute: eduInstitute,
          degree: eduDegree,
          specialization: eduSpecialization,
          cgpa: eduCgpa,
          startYear: eduStart,
          endYear: eduEnd
        };
        updatedEducations = [...educations, newEdu];
      }

      setEducations(updatedEducations);
      await updateProfileInFirestore({ 
        educations: updatedEducations,
        activityAction: editingEduId ? 'Education Updated' : 'Education Added',
        activityDetails: `${editingEduId ? 'Updated' : 'Added'} ${eduDegree} from ${eduInstitute}`
      });
      setShowEduModal(false);
      triggerToast(editingEduId ? 'Education credentials saved!' : 'Education card created!');
    } catch (err) {
      console.error("Save education error:", err);
    } finally {
      setIsSubmittingEdu(false);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    const updatedEducations = educations.filter((edu) => edu.id !== id);
    setEducations(updatedEducations);
    await updateProfileInFirestore({ educations: updatedEducations });
    triggerToast('Education card deleted.');
  };

  // SKILLS Actions
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillText.trim()) return;

    const updatedSkillsCategories = skillsCategories.map((cat) => {
      if (cat.id === selectedSkillCategory) {
        if (cat.skills.includes(newSkillText.trim())) return cat;
        return {
          ...cat,
          skills: [...cat.skills, newSkillText.trim()]
        };
      }
      return cat;
    });

    setSkillsCategories(updatedSkillsCategories);
    setNewSkillText('');
    await updateProfileInFirestore({ skillsCategories: updatedSkillsCategories });
    triggerToast(`Added skill into ${skillsCategories.find(c => c.id === selectedSkillCategory)?.label}`);
  };

  const handleRemoveSkill = async (categoryId: string, skillName: string) => {
    const updatedSkillsCategories = skillsCategories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          skills: cat.skills.filter((s) => s !== skillName)
        };
      }
      return cat;
    });

    setSkillsCategories(updatedSkillsCategories);
    await updateProfileInFirestore({ skillsCategories: updatedSkillsCategories });
    triggerToast(`Removed ${skillName}`);
  };

  // SOCIAL LINKS Actions
  const handleSaveLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingLinks) return;
    setIsSubmittingLinks(true);
    try {
      setEditingLinks(false);
      await updateProfileInFirestore({ links });
      triggerToast('Social links saved successfully!');
    } finally {
      setIsSubmittingLinks(false);
    }
  };

  // PREFERENCES Save
  const handlePreferencesSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingPref) return;
    setIsSubmittingPref(true);
    try {
      await updateProfileInFirestore({
        prefSalary,
        prefNoticePeriod,
        prefRoles,
        prefLocations,
        prefRemote,
        prefHybrid,
        prefOnsite,
        prefRelocation,
        prefInternational,
        prefEmploymentType,
        prefIndustries,
        jobAlerts,
        aiRecommendation,
        recruiterVisibility,
        availabilityStatus
      });
      triggerToast('Matching preferences updated successfully!');
    } finally {
      setIsSubmittingPref(false);
    }
  };

  const handleAddPrefRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPrefRole.trim() && !prefRoles.includes(newPrefRole.trim())) {
      setPrefRoles([...prefRoles, newPrefRole.trim()]);
      setNewPrefRole('');
    }
  };

  const handleRemovePrefRole = (role: string) => {
    setPrefRoles(prefRoles.filter((r) => r !== role));
  };

  const handleAddPrefLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPrefLocation.trim() && !prefLocations.includes(newPrefLocation.trim())) {
      setPrefLocations([...prefLocations, newPrefLocation.trim()]);
      setNewPrefLocation('');
    }
  };

  const handleRemovePrefLocation = (loc: string) => {
    setPrefLocations(prefLocations.filter((l) => l !== loc));
  };

  const handleAddPrefIndustry = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPrefIndustry.trim() && !prefIndustries.includes(newPrefIndustry.trim())) {
      setPrefIndustries([...prefIndustries, newPrefIndustry.trim()]);
      setNewPrefIndustry('');
    }
  };

  const handleRemovePrefIndustry = (ind: string) => {
    setPrefIndustries(prefIndustries.filter((i) => i !== ind));
  };

  const handleTogglePrefEmploymentType = (type: string) => {
    if (prefEmploymentType.includes(type)) {
      setPrefEmploymentType(prefEmploymentType.filter((t) => t !== type));
    } else {
      setPrefEmploymentType([...prefEmploymentType, type]);
    }
  };

  const menuTabs = [
    { id: 'INFO', label: 'Info' },
    { id: 'EXPERIENCE', label: 'Experience' },
    { id: 'EDUCATION, SKILLS & LINKS', label: 'Education, Skills & Links' },
    { id: 'PREFERENCES', label: 'Preferences' }
  ];

  const getProfileCompletion = () => {
    let score = 0;
    const total = 6;
    if (fullName && email && phone && dob && city && address && aboutMe) score += 1;
    if (experiences.length > 0) score += 1;
    if (educations.length > 0) score += 1;
    const totalSkills = skillsCategories.reduce((sum, cat) => sum + cat.skills.length, 0);
    if (totalSkills > 0) score += 1;
    const hasLinks = Object.values(links).some(val => !!val);
    if (hasLinks) score += 1;
    if (prefRoles.length > 0 && prefLocations.length > 0) score += 1;
    return Math.round((score / total) * 100);
  };
  const completionPercentage = getProfileCompletion();

  if (!uid) {
    return (
      <div className="p-8 text-center bg-app-bg border border-app-border rounded-2xl">
        <p className="text-sm text-app-muted font-bold">Please log in to view and manage your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-app-muted font-mono">Loading your profile from Firestore...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-app-text tracking-tight">Profile Overview</h1>
        <p className="text-app-muted text-sm mt-1">Manage your complete job-seeking portfolio and preferences exposed to premium networks on Aryx AI.</p>
      </div>

      <AnimatePresence>
        {showSavedMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-xs flex items-center gap-2 shadow-sm"
          >
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" /> {savedMsgText}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PROFILE COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Left Premium Profile Summary Card */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow flex flex-col items-center text-center space-y-5">
            
            {/* Hidden Photo File Input */}
            <input 
              type="file" 
              ref={photoFileInputRef} 
              accept="image/*" 
              onChange={handleProfilePhotoFileChange} 
              className="hidden" 
            />

            {/* User Avatar Frame */}
            <div 
              onClick={() => {
                if (!isUploadingPhoto && photoFileInputRef.current) {
                  photoFileInputRef.current.click();
                }
              }}
              className="w-28 h-28 rounded-full blue-gradient p-1 shadow-xl relative group cursor-pointer"
              title="Click to upload profile photo"
            >
              <img 
                src={profilePhoto} 
                alt={`${fullName} profile avatar`} 
                className="w-full h-full rounded-full object-cover border-4 border-app-surface shadow-md"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                {isUploadingPhoto ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Edit className="w-5 h-5 text-white" />
                    <span className="text-[9px] font-extrabold text-white mt-1">Upload</span>
                  </>
                )}
              </div>
            </div>

            {/* Profile Core Information */}
            <div>
              <h2 className="text-2xl font-display font-black text-app-text">{fullName}</h2>
              <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest block mt-1 bg-brand-blue/10 border border-brand-blue/20 rounded-full px-3 py-1 w-fit mx-auto">
                {headline}
              </span>
              <p className="text-xs text-app-muted mt-3 max-w-xs font-medium leading-relaxed italic">
                "{aboutMe.length > 120 ? `${aboutMe.slice(0, 117)}...` : aboutMe}"
              </p>
            </div>

            {/* Quick action button to trigger tab editing */}
            <button 
              onClick={() => {
                setActiveSubTab('INFO');
                triggerToast("Ready to update your personal details below!");
              }}
              className="w-full py-3 bg-app-bg hover:bg-app-surface border border-app-border rounded-xl text-xs font-bold text-app-text hover:text-brand-blue flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Edit className="w-3.5 h-3.5" /> Edit Personal Info
            </button>

            {/* PROFILE COMPLETION SLAT */}
            <div className="w-full border-t border-app-border/40 pt-5 text-left space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-app-muted uppercase tracking-widest">Profile Completion</span>
                <span className="text-sm font-black text-brand-blue">{completionPercentage}%</span>
              </div>
              
              {/* Premium Slim Progress Slat */}
              <div className="h-2 w-full bg-app-bg rounded-full overflow-hidden border border-app-border/30">
                <div 
                  className="h-full bg-brand-blue rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              <p className="text-[11px] text-app-muted font-medium leading-relaxed">
                Complete your profile data to improve search indexing and visibility across recruiter channels.
              </p>

              {/* Missing Details checklist */}
              <div className="bg-app-bg border border-app-border/40 rounded-2xl p-4 space-y-2.5">
                <span className="text-[9px] font-black text-brand-blue uppercase tracking-wider block">Profile Status Checklist</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-app-muted font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${experiences.length > 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className={experiences.length > 0 ? 'text-app-text font-bold' : 'text-app-muted'}>Experience</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${skillsCategories.some(c => c.skills.length > 0) ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className={skillsCategories.some(c => c.skills.length > 0) ? 'text-app-text font-bold' : 'text-app-muted'}>Skills</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${links.portfolio || links.website ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className={links.portfolio || links.website ? 'text-app-text font-bold' : 'text-app-muted'}>Portfolio</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${educations.length > 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className={educations.length > 0 ? 'text-app-text font-bold' : 'text-app-muted'}>Education</span>
                  </div>
                </div>
              </div>

              {/* Complete Missing Details Button */}
              <button 
                onClick={handleCompleteMissingDetails}
                className="w-full py-3 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-brand-blue/15"
              >
                <span>Complete Missing Details</span>
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE DETAILED TAB CONFIGURATIONS */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-[28px] bg-app-surface border border-app-border card-shadow h-fit space-y-6">
          
          {/* Navigation Tab selection row */}
          <div className="border-b border-app-border/40 pb-px flex gap-6 overflow-x-auto scrollbar-none">
            {menuTabs.map((tb) => (
              <button
                key={tb.id}
                onClick={() => {
                  setActiveSubTab(tb.id);
                  setEditingLinks(false);
                }}
                className={`pb-4 text-xs font-black uppercase tracking-wider relative transition-all whitespace-nowrap cursor-pointer ${
                  activeSubTab === tb.id ? 'text-brand-blue font-black' : 'text-app-muted hover:text-app-text'
                }`}
              >
                {tb.label}
                {activeSubTab === tb.id && (
                  <motion.div 
                    layoutId="activeProfileRedesignSubTabUnderline" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" 
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              
              {/* TAB 1: INFO */}
              {activeSubTab === 'INFO' && (
                <form onSubmit={handleInfoSave} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-app-text">Personal Information</h3>
                    <p className="text-xs text-app-muted mt-0.5">Control details visible on recruiter candidate lookup tables.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Full Name</label>
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Phone Number</label>
                      <input 
                        type="text" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Date of Birth</label>
                      <input 
                        type="text" 
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        placeholder="e.g. 12 May 1999"
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Gender</label>
                      <select 
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all font-bold"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">City</label>
                      <input 
                        type="text" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-bold">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">State</label>
                      <input 
                        type="text" 
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Country</label>
                      <input 
                        type="text" 
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-1">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Postal ZIP / Code</label>
                      <input 
                        type="text" 
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-bold">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Headline / Professional Title</label>
                      <input 
                        type="text" 
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="e.g. Senior React Engineer"
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Spoken Languages</label>
                      <input 
                        type="text" 
                        value={languages}
                        onChange={(e) => setLanguages(e.target.value)}
                        placeholder="e.g. English, Telugu, Spanish"
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-bold">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Overall Experience Level</label>
                      <input 
                        type="text" 
                        value={experienceStr}
                        onChange={(e) => setExperienceStr(e.target.value)}
                        placeholder="e.g. Entry Level / 3+ Years"
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Education Summary Brief</label>
                      <input 
                        type="text" 
                        value={educationStr}
                        onChange={(e) => setEducationStr(e.target.value)}
                        placeholder="e.g. B.Tech in CSE"
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 font-bold">
                    <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Complete Address</label>
                    <input 
                      type="text" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 font-bold">
                    <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Bio / About Me</label>
                    <textarea 
                      rows={4}
                      value={aboutMe}
                      onChange={(e) => setAboutMe(e.target.value)}
                      className="w-full bg-app-bg border border-app-border rounded-xl p-4 text-xs text-app-text leading-relaxed focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-app-border/40 gap-3">
                    <button 
                      type="submit" 
                      className="px-6 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-brand-blue/15 uppercase tracking-wide cursor-pointer transition-all active:scale-95"
                    >
                      Save Info Changes
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: EXPERIENCE */}
              {activeSubTab === 'EXPERIENCE' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-app-text">Professional Experience Timeline</h3>
                      <p className="text-xs text-app-muted mt-0.5">Maintain standard timelines to establish job application relevance.</p>
                    </div>
                    <button 
                      onClick={handleOpenExpAdd}
                      className="px-4 py-2 bg-brand-blue/10 hover:bg-brand-blue/20 border border-brand-blue/20 rounded-xl text-xs font-black text-brand-blue flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Experience
                    </button>
                  </div>

                  <div className="relative border-l border-app-border pl-6 space-y-6 ml-2 pt-2">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="relative group">
                        {/* Interactive timeline node */}
                        <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-brand-blue border-4 border-app-surface flex items-center justify-center shadow-md transition-transform group-hover:scale-125" />
                        
                        <div className="p-5 rounded-2xl bg-app-bg border border-app-border/80 hover:border-brand-blue/30 transition-all space-y-3">
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <h4 className="text-sm font-black text-app-text tracking-tight">{exp.role}</h4>
                              <p className="text-[10px] font-bold text-brand-blue uppercase mt-0.5 flex items-center gap-1.5">
                                <span>{exp.company}</span>
                                <span>•</span>
                                <span className="bg-brand-blue/5 px-2 py-0.5 rounded-md text-[9px] border border-brand-blue/10">{exp.employmentType}</span>
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-app-muted bg-app-surface border border-app-border/60 px-2.5 py-1 rounded-lg">
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                              </span>
                              
                              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => handleOpenExpEdit(exp)}
                                  className="p-1.5 bg-app-surface border border-app-border rounded-lg text-app-muted hover:text-brand-blue transition cursor-pointer"
                                  title="Edit Experience"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteExperience(exp.id)}
                                  className="p-1.5 bg-app-surface border border-app-border rounded-lg text-app-muted hover:text-red-500 transition cursor-pointer"
                                  title="Delete Experience"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-app-muted leading-relaxed font-semibold">
                            {exp.description}
                          </p>

                          {exp.skillsUsed.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {exp.skillsUsed.map((sk, idx) => (
                                <span key={idx} className="bg-app-surface border border-app-border/40 text-[9px] font-extrabold text-app-muted px-2 py-0.5 rounded-md">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {experiences.length === 0 && (
                      <div className="p-8 text-center bg-app-bg border border-dashed border-app-border rounded-2xl">
                        <p className="text-xs text-app-muted font-bold">No professional experiences listed yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: EDUCATION, SKILLS & LINKS */}
              {activeSubTab === 'EDUCATION, SKILLS & LINKS' && (
                <div className="space-y-8">
                  
                  {/* EDUCATION BLOCK */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-black text-app-text uppercase tracking-wider flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-brand-blue" />
                        Academic Degrees
                      </h4>
                      <button 
                        onClick={handleOpenEduAdd}
                        className="px-3.5 py-1.5 bg-brand-blue/10 hover:bg-brand-blue/20 border border-brand-blue/20 rounded-xl text-xs font-black text-brand-blue flex items-center gap-1 transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Education
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {educations.map((edu) => (
                        <div key={edu.id} className="p-4 rounded-2xl bg-app-bg border border-app-border flex justify-between items-center flex-wrap gap-4 group">
                          <div>
                            <h5 className="text-xs font-black text-app-text">{edu.institute}</h5>
                            <p className="text-[10px] font-bold text-brand-blue mt-1 flex items-center gap-2">
                              <span>{edu.degree} in {edu.specialization}</span>
                              <span>•</span>
                              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded text-[8px] font-extrabold">CGPA: {edu.cgpa}</span>
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-app-muted uppercase bg-app-surface px-3 py-1.5 border border-app-border rounded-xl">
                              {edu.startYear} - {edu.endYear}
                            </span>
                            
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleOpenEduEdit(edu)}
                                className="p-1.5 bg-app-surface border border-app-border rounded-lg text-app-muted hover:text-brand-blue transition cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteEducation(edu.id)}
                                className="p-1.5 bg-app-surface border border-app-border rounded-lg text-app-muted hover:text-red-500 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {educations.length === 0 && (
                        <div className="p-6 text-center bg-app-bg border border-dashed border-app-border rounded-2xl">
                          <p className="text-xs text-app-muted font-bold">No academic records specified.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SKILLS BLOCK WITH CATEGORIES */}
                  <div className="space-y-4 pt-4 border-t border-app-border/40">
                    <div>
                      <h4 className="text-sm font-black text-app-text uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-brand-blue" />
                        Categorized Skill Set
                      </h4>
                      <p className="text-xs text-app-muted mt-0.5">Verified technical capabilities indexed by client filters.</p>
                    </div>

                    {/* Skill addition form */}
                    <form onSubmit={handleAddSkill} className="bg-app-bg/50 border border-app-border/60 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 flex gap-2">
                        <select
                          value={selectedSkillCategory}
                          onChange={(e) => setSelectedSkillCategory(e.target.value)}
                          className="bg-app-bg border border-app-border rounded-xl p-2.5 text-xs text-app-text font-bold focus:ring-1 focus:ring-brand-blue focus:outline-none"
                        >
                          {skillsCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={newSkillText}
                          onChange={(e) => setNewSkillText(e.target.value)}
                          placeholder="e.g. Redux Toolkit, Go, Kubernetes"
                          className="flex-1 bg-app-bg border border-app-border rounded-xl p-2.5 text-xs text-app-text font-bold focus:ring-1 focus:ring-brand-blue focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-black rounded-xl flex items-center justify-center gap-1 transition"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Skill
                      </button>
                    </form>

                    {/* Render Category stacks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {skillsCategories.map((cat) => {
                        const IconComponent = cat.icon;
                        return (
                          <div key={cat.id} className="p-4 rounded-2xl bg-app-bg border border-app-border/60 space-y-3">
                            <div className="flex items-center gap-2 border-b border-app-border/40 pb-2">
                              <IconComponent className="w-4 h-4 text-brand-blue shrink-0" />
                              <span className="text-[11px] font-black uppercase tracking-wider text-app-text">{cat.label}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {cat.skills.map((sk) => (
                                <div 
                                  key={sk} 
                                  className="bg-app-surface border border-app-border text-xs font-bold text-app-text px-2.5 py-1 rounded-xl flex items-center gap-1.5 group hover:border-red-500/30 transition-all"
                                >
                                  <span>{sk}</span>
                                  <button 
                                    type="button"
                                    onClick={() => handleRemoveSkill(cat.id, sk)}
                                    className="text-app-muted hover:text-red-500 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              {cat.skills.length === 0 && (
                                <span className="text-[10px] text-app-muted font-bold italic">No skills listed</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SOCIAL & PROFESSIONAL LINKS BLOCK */}
                  <div className="space-y-4 pt-4 border-t border-app-border/40">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-black text-app-text uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-5 h-5 text-brand-blue" />
                        Social & Professional Links
                      </h4>
                      <button
                        type="button"
                        onClick={() => setEditingLinks(!editingLinks)}
                        className="px-3.5 py-1.5 bg-app-bg hover:bg-app-surface border border-app-border rounded-xl text-xs font-bold text-app-text hover:text-brand-blue flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        {editingLinks ? 'Cancel' : 'Edit Links'}
                      </button>
                    </div>

                    {editingLinks ? (
                      <form onSubmit={handleSaveLinks} className="bg-app-bg border border-app-border rounded-2xl p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { key: 'github', label: 'GitHub URL' },
                            { key: 'linkedin', label: 'LinkedIn URL' },
                            { key: 'portfolio', label: 'Portfolio Website' },
                            { key: 'website', label: 'Personal Website' },
                            { key: 'leetcode', label: 'LeetCode Profile' },
                            { key: 'hackerrank', label: 'HackerRank Profile' },
                            { key: 'codeforces', label: 'Codeforces URL' },
                            { key: 'medium', label: 'Medium Blog URL' },
                            { key: 'youtube', label: 'YouTube Channel' },
                            { key: 'x', label: 'X / Twitter URL' }
                          ].map((field) => (
                            <div key={field.key} className="space-y-1">
                              <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">{field.label}</label>
                              <input
                                type="url"
                                placeholder="https://..."
                                value={(links as any)[field.key] || ''}
                                onChange={(e) => setLinks({ ...links, [field.key]: e.target.value })}
                                className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text font-medium focus:ring-1 focus:ring-brand-blue focus:outline-none"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            className="px-5 py-2 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-extrabold rounded-xl transition cursor-pointer"
                          >
                            Save All Links
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                        {[
                          { key: 'github', label: 'GitHub', icon: Github, value: links.github },
                          { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, value: links.linkedin },
                          { key: 'portfolio', label: 'Portfolio', icon: Globe, value: links.portfolio },
                          { key: 'website', label: 'Website', icon: Globe, value: links.website },
                          { key: 'leetcode', label: 'LeetCode', icon: Terminal, value: links.leetcode },
                          { key: 'hackerrank', label: 'HackerRank', icon: Code, value: links.hackerrank },
                          { key: 'codeforces', label: 'Codeforces', icon: Code, value: links.codeforces },
                          { key: 'medium', label: 'Medium', icon: BookOpen, value: links.medium },
                          { key: 'youtube', label: 'YouTube', icon: Layers, value: links.youtube },
                          { key: 'x', label: 'X / Twitter', icon: Github, value: links.x }
                        ].map((plat) => {
                          const IconComponent = plat.icon;
                          const hasValue = !!plat.value;
                          
                          return hasValue ? (
                            <a
                              key={plat.key}
                              href={plat.value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-app-bg hover:bg-brand-blue/5 border border-app-border rounded-2xl flex items-center gap-2.5 transition-all group cursor-pointer"
                            >
                              <IconComponent className="w-4 h-4 text-app-muted group-hover:text-brand-blue shrink-0" />
                              <div className="truncate">
                                <span className="text-[8px] font-black text-app-muted block uppercase tracking-wider">{plat.label}</span>
                                <span className="text-[10px] font-bold text-app-text truncate block mt-0.5 group-hover:text-brand-blue">
                                  {plat.value.replace(/https?:\/\/(www\.)?/, '')}
                                </span>
                              </div>
                            </a>
                          ) : (
                            <div
                              key={plat.key}
                              onClick={() => {
                                setEditingLinks(true);
                                triggerToast(`Fill in your ${plat.label} profile URL!`);
                              }}
                              className="p-3 bg-app-bg border border-dashed border-app-border/60 rounded-2xl flex items-center gap-2.5 opacity-60 hover:opacity-100 transition cursor-pointer"
                            >
                              <Plus className="w-4 h-4 text-app-muted shrink-0" />
                              <div>
                                <span className="text-[8px] font-black text-app-muted block uppercase tracking-wider">{plat.label}</span>
                                <span className="text-[10px] font-bold text-app-muted block mt-0.5 italic">Not connected</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 4: PREFERENCES */}
              {activeSubTab === 'PREFERENCES' && (
                <form onSubmit={handlePreferencesSave} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-app-text">Matching Preferences</h3>
                    <p className="text-xs text-app-muted mt-0.5">Fine-tune system variables driving autonomous matchmaking pipelines.</p>
                  </div>

                  <div className="space-y-5">
                    
                    {/* Basic pref select row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 font-bold">
                        <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Expected Salary Package</label>
                        <select 
                          value={prefSalary}
                          onChange={(e) => setPrefSalary(e.target.value)}
                          className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:ring-1 focus:ring-brand-blue focus:outline-none"
                        >
                          <option value="₹6 - 10 LPA">₹6 - 10 LPA</option>
                          <option value="₹10 - 15 LPA">₹10 - 15 LPA</option>
                          <option value="₹12 - 18 LPA">₹12 - 18 LPA</option>
                          <option value="₹18 - 25 LPA">₹18 - 25 LPA</option>
                          <option value="₹25+ LPA">₹25+ LPA</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 font-bold">
                        <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Notice Period</label>
                        <select 
                          value={prefNoticePeriod}
                          onChange={(e) => setPrefNoticePeriod(e.target.value)}
                          className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs text-app-text focus:ring-1 focus:ring-brand-blue focus:outline-none"
                        >
                          <option value="Immediate">Immediate (Serving notice)</option>
                          <option value="15 Days">15 Days</option>
                          <option value="30 Days">30 Days</option>
                          <option value="60 Days">60 Days</option>
                          <option value="90 Days">90 Days</option>
                        </select>
                      </div>
                    </div>

                    {/* Preferred Job Roles chips */}
                    <div className="p-4 rounded-2xl bg-app-bg border border-app-border space-y-3">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Preferred Roles</label>
                      <div className="flex flex-wrap gap-1.5">
                        {prefRoles.map((role) => (
                          <div key={role} className="bg-brand-blue/10 border border-brand-blue/20 text-xs font-black text-brand-blue px-3 py-1 rounded-xl flex items-center gap-1.5">
                            <span>{role}</span>
                            <button type="button" onClick={() => handleRemovePrefRole(role)} className="hover:text-red-500 font-bold">×</button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 max-w-sm pt-1">
                        <input 
                          type="text" 
                          value={newPrefRole}
                          onChange={(e) => setNewPrefRole(e.target.value)}
                          placeholder="Add desired role..."
                          className="flex-1 bg-app-surface border border-app-border rounded-xl px-3 py-1.5 text-xs text-app-text focus:outline-none"
                        />
                        <button type="button" onClick={handleAddPrefRole} className="px-3 py-1.5 bg-brand-blue text-white text-xs font-bold rounded-xl">+</button>
                      </div>
                    </div>

                    {/* Preferred job locations */}
                    <div className="p-4 rounded-2xl bg-app-bg border border-app-border space-y-3">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Preferred Locations</label>
                      <div className="flex flex-wrap gap-1.5">
                        {prefLocations.map((loc) => (
                          <div key={loc} className="bg-brand-blue/10 border border-brand-blue/20 text-xs font-black text-brand-blue px-3 py-1 rounded-xl flex items-center gap-1.5">
                            <span>{loc}</span>
                            <button type="button" onClick={() => handleRemovePrefLocation(loc)} className="hover:text-red-500 font-bold">×</button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 max-w-sm pt-1">
                        <input 
                          type="text" 
                          value={newPrefLocation}
                          onChange={(e) => setNewPrefLocation(e.target.value)}
                          placeholder="Add preferred city..."
                          className="flex-1 bg-app-surface border border-app-border rounded-xl px-3 py-1.5 text-xs text-app-text focus:outline-none"
                        />
                        <button type="button" onClick={handleAddPrefLocation} className="px-3 py-1.5 bg-brand-blue text-white text-xs font-bold rounded-xl">+</button>
                      </div>
                    </div>

                    {/* Work mode setups */}
                    <div className="p-4 rounded-2xl bg-app-bg border border-app-border space-y-4">
                      <span className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Work Mode & Availability</span>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <label className="flex items-center gap-2.5 p-3 rounded-xl bg-app-surface border border-app-border/60 hover:border-brand-blue/30 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={prefRemote}
                            onChange={(e) => setPrefRemote(e.target.checked)}
                            className="rounded border-app-border text-brand-blue focus:ring-brand-blue bg-app-bg w-4 h-4"
                          />
                          <span className="text-xs font-bold text-app-text">Remote</span>
                        </label>

                        <label className="flex items-center gap-2.5 p-3 rounded-xl bg-app-surface border border-app-border/60 hover:border-brand-blue/30 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={prefHybrid}
                            onChange={(e) => setPrefHybrid(e.target.checked)}
                            className="rounded border-app-border text-brand-blue focus:ring-brand-blue bg-app-bg w-4 h-4"
                          />
                          <span className="text-xs font-bold text-app-text">Hybrid</span>
                        </label>

                        <label className="flex items-center gap-2.5 p-3 rounded-xl bg-app-surface border border-app-border/60 hover:border-brand-blue/30 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={prefOnsite}
                            onChange={(e) => setPrefOnsite(e.target.checked)}
                            className="rounded border-app-border text-brand-blue focus:ring-brand-blue bg-app-bg w-4 h-4"
                          />
                          <span className="text-xs font-bold text-app-text">Onsite</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <label className="flex items-start gap-3 p-3 rounded-xl bg-app-surface border border-app-border/60 hover:border-brand-blue/30 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={prefRelocation}
                            onChange={(e) => setPrefRelocation(e.target.checked)}
                            className="mt-0.5 rounded border-app-border text-brand-blue focus:ring-brand-blue bg-app-bg w-4 h-4"
                          />
                          <div>
                            <span className="text-xs font-bold text-app-text block">Open to Relocation</span>
                            <span className="text-[10px] text-app-muted font-semibold block mt-0.5">Willing to move to office territories</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 p-3 rounded-xl bg-app-surface border border-app-border/60 hover:border-brand-blue/30 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={prefInternational}
                            onChange={(e) => setPrefInternational(e.target.checked)}
                            className="mt-0.5 rounded border-app-border text-brand-blue focus:ring-brand-blue bg-app-bg w-4 h-4"
                          />
                          <div>
                            <span className="text-xs font-bold text-app-text block">Open to International Jobs</span>
                            <span className="text-[10px] text-app-muted font-semibold block mt-0.5">Willing to take foreign postings</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Notice Period & Employment Type options */}
                    <div className="p-4 rounded-2xl bg-app-bg border border-app-border space-y-3">
                      <span className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Notice Period & Employment type preferences</span>
                      <div className="flex flex-wrap gap-2.5 font-bold">
                        {['Full-Time', 'Part-Time', 'Contract', 'Internship'].map((empType) => {
                          const active = prefEmploymentType.includes(empType);
                          return (
                            <button
                              key={empType}
                              type="button"
                              onClick={() => handleTogglePrefEmploymentType(empType)}
                              className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                                active 
                                  ? 'bg-brand-blue/15 border-brand-blue text-brand-blue' 
                                  : 'bg-app-surface border-app-border text-app-muted'
                              }`}
                            >
                              {empType}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Preferred industries */}
                    <div className="p-4 rounded-2xl bg-app-bg border border-app-border space-y-3">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Preferred Industries</label>
                      <div className="flex flex-wrap gap-1.5">
                        {prefIndustries.map((ind) => (
                          <div key={ind} className="bg-brand-blue/10 border border-brand-blue/20 text-xs font-black text-brand-blue px-3 py-1 rounded-xl flex items-center gap-1.5">
                            <span>{ind}</span>
                            <button type="button" onClick={() => handleRemovePrefIndustry(ind)} className="hover:text-red-500 font-bold">×</button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 max-w-sm pt-1">
                        <input 
                          type="text" 
                          value={newPrefIndustry}
                          onChange={(e) => setNewPrefIndustry(e.target.value)}
                          placeholder="Add target industry..."
                          className="flex-1 bg-app-surface border border-app-border rounded-xl px-3 py-1.5 text-xs text-app-text focus:outline-none"
                        />
                        <button type="button" onClick={handleAddPrefIndustry} className="px-3 py-1.5 bg-brand-blue text-white text-xs font-bold rounded-xl">+</button>
                      </div>
                    </div>

                    {/* Toggle Settings */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Recruitment Visibility Controls</span>
                      
                      {/* Alert toggle */}
                      <div className="p-4 rounded-2xl bg-app-bg border border-app-border flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-xs font-black text-app-text">Active Job Alert Matching</h4>
                          <p className="text-[10px] text-app-muted mt-0.5 font-bold uppercase">Receive match indicators on matching recruiter postings.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setJobAlerts(!jobAlerts)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${jobAlerts ? 'bg-brand-blue' : 'bg-neutral-800'}`}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${jobAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      {/* AI recommendation toggle */}
                      <div className="p-4 rounded-2xl bg-app-bg border border-app-border flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-xs font-black text-app-text">Autonomous AI Recommendation</h4>
                          <p className="text-[10px] text-app-muted mt-0.5 font-bold uppercase">Permit the matchmaking engine to directly feed your profile to BDMs.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setAiRecommendation(!aiRecommendation)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${aiRecommendation ? 'bg-brand-blue' : 'bg-neutral-800'}`}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${aiRecommendation ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      {/* Recruiter visibility toggle */}
                      <div className="p-4 rounded-2xl bg-app-bg border border-app-border flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-xs font-black text-app-text">Recruiter Directory Discovery</h4>
                          <p className="text-[10px] text-app-muted mt-0.5 font-bold uppercase">Permit direct searches on your profile metrics in the portal.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setRecruiterVisibility(!recruiterVisibility)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${recruiterVisibility ? 'bg-brand-blue' : 'bg-neutral-800'}`}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${recruiterVisibility ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      {/* Availability status option */}
                      <div className="p-4 rounded-2xl bg-app-bg border border-app-border flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-xs font-black text-app-text">Availability Status</h4>
                          <p className="text-[10px] text-app-muted mt-0.5 font-bold uppercase">Display current engagement parameters directly on your profile card.</p>
                        </div>
                        <select
                          value={availabilityStatus}
                          onChange={(e) => setAvailabilityStatus(e.target.value)}
                          className="bg-app-bg border border-app-border rounded-xl p-2 text-xs text-app-text font-black focus:outline-none"
                        >
                          <option value="Actively Looking">Actively Looking</option>
                          <option value="Open to Offers">Open to Offers</option>
                          <option value="Not Looking">Not Looking</option>
                        </select>
                      </div>

                    </div>

                  </div>

                  <div className="flex justify-end pt-4 border-t border-app-border/40">
                    <button 
                      type="submit" 
                      className="px-6 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-brand-blue/15 uppercase tracking-wide cursor-pointer transition-all active:scale-95"
                    >
                      Save Preferences
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* EXPERIENCE DIALOG MODAL */}
      <AnimatePresence>
        {showExpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-app-bg border border-app-border rounded-[28px] overflow-hidden card-shadow flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-app-border/40 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-5 h-5 text-brand-blue" />
                  <h3 className="text-base font-black text-app-text">
                    {editingExpId ? 'Edit Work Experience' : 'Add Work Experience'}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowExpModal(false)}
                  className="p-1.5 rounded-full bg-app-surface border border-app-border text-app-muted hover:text-app-text transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveExperience} className="p-6 overflow-y-auto space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-app-muted uppercase block">Company Name</label>
                    <input 
                      type="text" 
                      value={expCompany}
                      onChange={(e) => setExpCompany(e.target.value)}
                      placeholder="e.g. Google"
                      className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-app-muted uppercase block">Job Title / Role</label>
                    <input 
                      type="text" 
                      value={expRole}
                      onChange={(e) => setExpRole(e.target.value)}
                      placeholder="e.g. Frontend Developer"
                      className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-app-muted uppercase block">Employment Type</label>
                    <select
                      value={expType}
                      onChange={(e) => setExpType(e.target.value)}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text font-bold"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-app-muted uppercase block">Start Date</label>
                    <input 
                      type="text" 
                      value={expStart}
                      onChange={(e) => setExpStart(e.target.value)}
                      placeholder="e.g. Jan 2025"
                      className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={expCurrent}
                      onChange={(e) => setExpCurrent(e.target.checked)}
                      className="rounded border-app-border text-brand-blue bg-app-surface w-4 h-4"
                    />
                    <span className="text-xs font-bold text-app-text">I currently work here</span>
                  </label>
                  
                  {!expCurrent && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-app-muted uppercase block">End Date</label>
                      <input 
                        type="text" 
                        value={expEnd}
                        onChange={(e) => setExpEnd(e.target.value)}
                        placeholder="e.g. Dec 2025"
                        className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text font-bold"
                        required={!expCurrent}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-app-muted uppercase block">Description / Responsibilities</label>
                  <textarea
                    rows={4}
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    placeholder="Describe your impact and core responsibilities..."
                    className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-xs text-app-text leading-relaxed font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-app-muted uppercase block">Skills Used (Comma-separated)</label>
                  <input 
                    type="text" 
                    value={expSkillsInput}
                    onChange={(e) => setExpSkillsInput(e.target.value)}
                    placeholder="React, TypeScript, Next.js, GCP"
                    className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text font-bold"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-app-border/40 gap-3">
                  <button
                    type="button"
                    onClick={() => setShowExpModal(false)}
                    className="px-4 py-2 bg-app-surface hover:bg-neutral-800 border border-app-border rounded-xl text-xs font-bold text-app-text transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingExp}
                    className="px-5 py-2 bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center gap-2"
                  >
                    {isSubmittingExp ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving Experience...
                      </>
                    ) : (
                      'Save Experience'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDUCATION DIALOG MODAL */}
      <AnimatePresence>
        {showEduModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-app-bg border border-app-border rounded-[28px] overflow-hidden card-shadow flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-app-border/40 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-5 h-5 text-brand-blue" />
                  <h3 className="text-base font-black text-app-text">
                    {editingEduId ? 'Edit Academic Record' : 'Add Academic Record'}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowEduModal(false)}
                  className="p-1.5 rounded-full bg-app-surface border border-app-border text-app-muted hover:text-app-text transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEducation} className="p-6 overflow-y-auto space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-app-muted uppercase block">University / Institute</label>
                  <input 
                    type="text" 
                    value={eduInstitute}
                    onChange={(e) => setEduInstitute(e.target.value)}
                    placeholder="e.g. Aryx University"
                    className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text font-bold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-app-muted uppercase block">Degree</label>
                    <input 
                      type="text" 
                      value={eduDegree}
                      onChange={(e) => setEduDegree(e.target.value)}
                      placeholder="e.g. B.Tech, M.S., B.Sc."
                      className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-app-muted uppercase block">Specialization / Branch</label>
                    <input 
                      type="text" 
                      value={eduSpecialization}
                      onChange={(e) => setEduSpecialization(e.target.value)}
                      placeholder="e.g. Computer Science"
                      className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-app-muted uppercase block">Grade / CGPA</label>
                    <input 
                      type="text" 
                      value={eduCgpa}
                      onChange={(e) => setEduCgpa(e.target.value)}
                      placeholder="e.g. 9.2/10 or 85%"
                      className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-app-muted uppercase block">Start Year</label>
                    <input 
                      type="text" 
                      value={eduStart}
                      onChange={(e) => setEduStart(e.target.value)}
                      placeholder="e.g. 2022"
                      className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-app-muted uppercase block">End Year</label>
                    <input 
                      type="text" 
                      value={eduEnd}
                      onChange={(e) => setEduEnd(e.target.value)}
                      placeholder="e.g. 2026"
                      className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-xs text-app-text font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-app-border/40 gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEduModal(false)}
                    className="px-4 py-2 bg-app-surface hover:bg-neutral-800 border border-app-border rounded-xl text-xs font-bold text-app-text transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingEdu}
                    className="px-5 py-2 bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center gap-2"
                  >
                    {isSubmittingEdu ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving Education...
                      </>
                    ) : (
                      'Save Education'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
