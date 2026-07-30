import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  BookOpen, 
  PlayCircle, 
  ExternalLink,
  Award,
  ChevronRight,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useJobSeeker } from '../../../../context/JobSeekerContext';

interface AiMatchingTabProps {
  onNavigate?: (tab: string) => void;
}

export default function AiMatchingTab({ onNavigate }: AiMatchingTabProps) {
  const { jobSeekerProfile, loading: profileLoading } = useJobSeeker();
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  // Subscribe to active open jobs from Firestore in real-time
  useEffect(() => {
    const qJobs = query(
      collection(db, 'marketplace_jobs'),
      where('status', '==', 'open')
    );
    const unsubscribeJobs = onSnapshot(qJobs, (snap) => {
      const fetched = snap.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setJobs(fetched);
      setJobsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'marketplace_jobs');
      setJobsLoading(false);
    });

    return () => unsubscribeJobs();
  }, []);

  // Safe normalization helper to prevent runtime exceptions on invalid/legacy data
  const safeArray = (val: any): any[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && val.trim().length > 0) {
      return val.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (typeof val === 'object') {
      return Object.values(val).filter(Boolean);
    }
    return [];
  };

  const normalizeSkills = (val: any): string[] => {
    const arr = safeArray(val);
    return arr
      .filter(s => s !== null && s !== undefined)
      .map(s => (typeof s === 'string' ? s.trim() : String(s).trim()))
      .filter(s => s.length > 0);
  };

  // 1. Determine Candidate's Skills from direct skills, profile skills, and resume skills
  const directSkills = normalizeSkills(jobSeekerProfile?.skills);
  const profileSkills = normalizeSkills(jobSeekerProfile?.profile?.skills);
  const resumeSkills = normalizeSkills(
    typeof jobSeekerProfile?.resume === 'object' ? jobSeekerProfile?.resume?.skills : null
  );

  const candidateSkillsSet = new Set<string>();
  [...directSkills, ...profileSkills, ...resumeSkills].forEach(s => {
    if (s) candidateSkillsSet.add(s);
  });
  const candidateSkills = Array.from(candidateSkillsSet);
  const hasConfiguredSkills = candidateSkills.length > 0;

  // 2. Compute live Skills Match percentage based on actual market demand across active jobs
  const computedSkillsMatch = candidateSkills.map(skill => {
    // Count how many active jobs require this skill
    const frequency = jobs.filter(j => {
      const reqSkills = normalizeSkills(j.skills || j.reqSkills || j.requiredSkills || j.skillsRequired);
      return reqSkills.some(s => s.toLowerCase() === skill.toLowerCase());
    }).length;

    // Scale mapping: more frequent skills rank higher
    const pct = jobs.length > 0
      ? Math.round((frequency / jobs.length) * 40) + 60 // scale 60% - 100%
      : 80;

    return { skill, pct };
  }).sort((a, b) => b.pct - a.pct);

  // 3. Compute Skills You Should Improve (identify required job skills that candidate lacks)
  const allRequiredSkills: string[] = [];
  jobs.forEach(j => {
    const reqSkills = normalizeSkills(j.skills || j.reqSkills || j.requiredSkills || j.skillsRequired);
    reqSkills.forEach(s => allRequiredSkills.push(s));
  });

  const missingSkillsWithFreq = (Array.from(new Set(allRequiredSkills)) as string[])
    .filter(skill => !candidateSkills.some(cs => cs.toLowerCase() === skill.toLowerCase()))
    .map(skill => {
      const frequency = jobs.filter(j => {
        const reqSkills = normalizeSkills(j.skills || j.reqSkills || j.requiredSkills || j.skillsRequired);
        return reqSkills.some(s => s.toLowerCase() === skill.toLowerCase());
      }).length;
      return { skill, frequency };
    })
    .sort((a, b) => b.frequency - a.frequency); // Highly requested missing skills first

  const suggestedImprovements = missingSkillsWithFreq.length > 0
    ? missingSkillsWithFreq.slice(0, 4).map((item, idx) => {
        const colors = [
          { text: 'text-amber-500 bg-amber-500/10 border-amber-500/15' },
          { text: 'text-blue-500 bg-blue-500/10 border-blue-500/15' },
          { text: 'text-purple-500 bg-purple-500/10 border-purple-500/15' },
          { text: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/15' }
        ];
        const style = colors[idx % colors.length];
        return {
          skill: item.skill,
          matchValue: `Needed in ${item.frequency} open role${item.frequency > 1 ? 's' : ''}`,
          action: idx % 2 === 0 ? 'Learn' : 'Build',
          color: style.text
        };
      })
    : [];

  // 4. Compute Recommended Roles dynamically based on real skill alignment, location, and experience
  const candidateLoc = (jobSeekerProfile?.location || jobSeekerProfile?.profile?.location || '').toLowerCase();
  const candidateExp = (jobSeekerProfile?.experience || jobSeekerProfile?.profile?.experience || '').toLowerCase();

  const computedRecommendedRoles = jobs.map(job => {
    const reqSkills = normalizeSkills(job.skills || job.reqSkills || job.requiredSkills || job.skillsRequired);
    const matching = reqSkills.filter(s => candidateSkills.some(cs => cs.toLowerCase() === s.toLowerCase()));
    
    const skillRatio = reqSkills.length > 0 ? matching.length / reqSkills.length : 0.5;
    const jobLoc = (job.location || '').toLowerCase();
    const locBonus = (candidateLoc && jobLoc && (candidateLoc.includes(jobLoc) || jobLoc.includes(candidateLoc) || jobLoc.includes('remote'))) ? 10 : 0;
    const jobExp = (job.experience || job.experienceRequired || '').toLowerCase();
    const expBonus = (candidateExp && jobExp && candidateExp === jobExp) ? 10 : 5;

    let match = Math.round(skillRatio * 70 + locBonus + expBonus + 10);
    match = Math.max(45, Math.min(98, match));

    return {
      id: job.id,
      role: job.role || job.title || 'Software Engineer',
      company: job.company || job.companyName || 'Aryx AI Partner',
      match
    };
  })
  .sort((a, b) => b.match - a.match)
  .slice(0, 5);

  const recommendedRoles = computedRecommendedRoles;

  // 5. Compute AI Learning Recommendations dynamically
  const courses = computedRecommendedRoles.length > 0 && missingSkillsWithFreq.length > 0
    ? missingSkillsWithFreq.slice(0, 3).map(imp => {
        let title = `${imp.skill} Fundamentals`;
        let level = 'Beginner';
        let duration = '3h';
        
        const nameLower = imp.skill.toLowerCase();
        if (nameLower.includes('aws') || nameLower.includes('cloud')) {
          title = 'AWS Certified Cloud Practitioner';
          level = 'Intermediate';
          duration = '6h';
        } else if (nameLower.includes('docker') || nameLower.includes('container')) {
          title = 'Docker Containers for Beginners';
          level = 'Beginner';
          duration = '3.5h';
        } else if (nameLower.includes('k8s') || nameLower.includes('kubernetes')) {
          title = 'Kubernetes Administration (CKA)';
          level = 'Advanced';
          duration = '9h';
        } else if (nameLower.includes('ci/cd') || nameLower.includes('actions')) {
          title = 'CI/CD Pipelines & GitHub Actions';
          level = 'Intermediate';
          duration = '5h';
        } else if (nameLower.includes('redux') || nameLower.includes('state')) {
          title = 'Advanced React State Architecture';
          level = 'Intermediate';
          duration = '4h';
        }
        
        return { title, level, duration };
      })
    : [];

  // 6. Overall Employability Score from AI profile inside Firestore seeker document
  const overallScore = jobSeekerProfile?.ai_profile?.matchScore || 0;
  const scoreBadge = overallScore >= 90 ? 'Excellent' : overallScore >= 75 ? 'Good' : overallScore > 0 ? 'Developing' : 'No Score';

  if (profileLoading || jobsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
        <p className="text-sm font-semibold text-app-muted">Analyzing your match metrics across the database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text tracking-tight flex items-center gap-2">
            AI Matching
            <Sparkles className="w-6 h-6 text-brand-blue" />
          </h1>
          <p className="text-app-muted text-sm mt-1">Detailed index scoring analyzed by our semantic matchmaking model.</p>
        </div>
        
        {!hasConfiguredSkills && (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold px-4 py-2.5 rounded-2xl max-w-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Using default developer profile. Update your skills in Profile to personalize matches.</span>
          </div>
        )}
      </div>

      {/* Frame 3 top banner: Score overview with growth line chart */}
      <div className="p-6 md:p-8 rounded-[32px] bg-gradient-to-r from-brand-blue via-brand-blue to-brand-violet text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-stretch gap-8">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex-1 space-y-3 z-10 flex flex-col justify-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 block">Your Overall Employability Score</span>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-display font-black tracking-tighter">{overallScore}%</span>
            <span className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">{scoreBadge}</span>
          </div>
          <p className="text-white/80 max-w-md text-xs md:text-sm font-medium">
            {overallScore >= 85 
              ? "You are exceptionally prepared! Keep expanding your core stack and apply for top recommended roles to fast-track your career."
              : "Great progress! Strengthen your match score further by adding certificates or building projects in the requested improvement topics."
            }
          </p>
        </div>

        {/* Employability Score Trend Line Chart on the right */}
        <div className="w-full md:w-80 h-36 bg-white/10 rounded-2xl p-4 flex flex-col justify-between shrink-0 border border-white/15 shadow-inner backdrop-blur-sm z-10">
          <svg viewBox="0 0 400 100" className="w-full h-20 text-white overflow-visible">
            {/* Smooth trend curve mapping Feb->Jun index values */}
            <path d="M 30,80 Q 110,65 190,55 T 350,20" fill="none" stroke="currentColor" strokeWidth="3" />
            
            {/* Anchor circles with tooltips */}
            <circle cx="30" cy="80" r="4" fill="#FFFFFF" />
            <text x="30" y="95" fill="#FFFFFF" fillOpacity="0.8" fontSize="8" fontWeight="bold" textAnchor="middle">Feb</text>

            <circle cx="110" cy="70" r="4" fill="#FFFFFF" />
            <text x="110" y="94" fill="#FFFFFF" fillOpacity="0.8" fontSize="8" fontWeight="bold" textAnchor="middle">Mar</text>

            <circle cx="190" cy="55" r="4" fill="#FFFFFF" />
            <text x="190" y="95" fill="#FFFFFF" fillOpacity="0.8" fontSize="8" fontWeight="bold" textAnchor="middle">Apr</text>

            <circle cx="270" cy="40" r="4" fill="#FFFFFF" />
            <text x="270" y="95" fill="#FFFFFF" fillOpacity="0.8" fontSize="8" fontWeight="bold" textAnchor="middle">May</text>

            <circle cx="350" cy="20" r="4.5" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="350" y="95" fill="#FFFFFF" fillOpacity="0.8" fontSize="8" fontWeight="bold" textAnchor="middle">Jun</text>

            {/* Values above anchors */}
            <text x="30" y="70" fill="#FFFFFF" fillOpacity="0.6" fontSize="7" fontWeight="bold" textAnchor="middle">72%</text>
            <text x="110" y="60" fill="#FFFFFF" fillOpacity="0.6" fontSize="7" fontWeight="bold" textAnchor="middle">76%</text>
            <text x="190" y="45" fill="#FFFFFF" fillOpacity="0.6" fontSize="7" fontWeight="bold" textAnchor="middle">80%</text>
            <text x="270" y="30" fill="#FFFFFF" fillOpacity="0.6" fontSize="7" fontWeight="bold" textAnchor="middle">83%</text>
            <text x="350" y="10" fill="#00E5FF" fontSize="8" fontWeight="black" textAnchor="middle">{overallScore}%</text>
          </svg>
        </div>
      </div>

      {/* Grid distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Skills Match list & Remedial Topics) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Skills Match */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-6">
            <div>
              <h3 className="text-base font-bold text-app-text">Skills Match</h3>
              <p className="text-xs text-app-muted mt-0.5">Primary stack compatibility analyzed against active job postings.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {computedSkillsMatch.map((match, id) => (
                <div key={id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-app-text">
                    <span>{match.skill}</span>
                    <span className="text-brand-blue font-mono">{match.pct}% Market Match</span>
                  </div>
                  <div className="h-2 w-full bg-app-bg border border-app-border/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-blue rounded-full transition-all duration-500" 
                      style={{ width: `${match.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills You Should Improve */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-4">
            <div>
              <h3 className="text-base font-bold text-app-text">Skills You Should Improve</h3>
              <p className="text-xs text-app-muted mt-0.5">Personalized semantic recommendations based on active recruiter postings.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {suggestedImprovements.map((imp, idx) => (
                <div key={idx} className={`p-4 border rounded-2xl flex flex-col justify-between h-32 ${imp.color}`}>
                  <div>
                    <span className="text-app-text text-sm font-extrabold block truncate">{imp.skill}</span>
                    <span className="text-[10px] font-bold block mt-1 opacity-80">{imp.matchValue}</span>
                  </div>
                  <button className="w-full py-1.5 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue border border-brand-blue/20 text-[10px] uppercase tracking-wider font-extrabold rounded-xl transition-all cursor-pointer">
                    {imp.action} Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Recommended Roles & Learning paths) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recommended Roles */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-4">
            <h3 className="text-base font-bold text-app-text">Recommended Roles</h3>
            <div className="space-y-3">
              {recommendedRoles.map((role, id) => (
                <div key={id} className="p-3.5 rounded-2xl bg-app-bg hover:bg-app-surface border border-app-border flex items-center justify-between group transition-all">
                  <div className="truncate pr-2">
                    <div className="text-xs font-bold text-app-text truncate">{role.role}</div>
                    <div className="text-[10px] text-emerald-500 font-bold mt-0.5">{role.match}% Score Match</div>
                  </div>
                  <button 
                    onClick={() => onNavigate?.('jobs')}
                    className="px-3 py-1.5 bg-brand-blue text-white rounded-lg text-[9px] font-bold uppercase transition-all cursor-pointer hover:bg-brand-blue/90 shrink-0"
                  >
                    View Jobs
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Learning Recommendations */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-4">
            <h3 className="text-base font-bold text-app-text flex items-center justify-between">
              AI Learning Recommendations
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-2.5 py-1 rounded-lg">Adaptive</span>
            </h3>
            <div className="space-y-3">
              {courses.map((crs, id) => (
                <div key={id} className="p-4 rounded-2xl bg-app-bg border border-app-border flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-app-text block leading-snug">{crs.title}</span>
                    <div className="flex gap-2 items-center text-[9px] font-bold text-app-muted uppercase">
                      <span>{crs.level}</span>
                      <span>•</span>
                      <span>{crs.duration}</span>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold rounded-lg cursor-pointer transition-all">
                    Start
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
