import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Zap, 
  Bell, 
  Sparkles, 
  AlertCircle,
  TrendingUp,
  Award,
  BookOpen,
  Calendar
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';

interface DashboardTabProps {
  onNavigate: (tabId: string) => void;
  onApplyJob: (jobTitle: string, company: string, opportunityId?: string) => void;
}

export default function DashboardTab({ onNavigate, onApplyJob }: DashboardTabProps) {
  const { userProfile } = useAuth();
  const studentId = userProfile?.uid;
  const organizationId = userProfile?.organizationId;

  const [studentData, setStudentData] = useState<any>(null);
  const [allOpportunities, setAllOpportunities] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Listen to Student Profile document
  useEffect(() => {
    if (!organizationId || !studentId) return;

    const studentDocRef = doc(db, 'organizations_universities', organizationId, 'students', studentId);
    
    const unsubscribe = onSnapshot(studentDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setStudentData(snapshot.data());
        setLoading(false);
      } else {
        // Automatically seed student document if it doesn't exist to ensure consistency across pages
        const defaultProfile = {
          studentId: studentId,
          fullName: userProfile?.fullName || 'Rohit Kumar',
          email: userProfile?.email || 'rohit.kumar@email.com',
          phone: userProfile?.phoneNumber || '+91 98765 43210',
          rollNumber: 'CS2022001',
          registrationNumber: 'REG2022001',
          department: 'Computer Science Engineering',
          branch: 'CSE',
          year: '3rd Year',
          semester: '6th Semester',
          cgpa: 8.45,
          skills: [
            'Java', 'JavaScript', 'React.js', 'HTML', 'CSS', 
            'SQL', 'Data Structures', 'Problem Solving', 'Git', 'Node.js', 'MongoDB'
          ],
          resume: 'Resume_Rohit_Kumar.pdf',
          photoURL: userProfile?.photoURL || 'https://picsum.photos/seed/rohit123/200/200',
          status: 'active',
          placementStatus: 'eligible',
          projects: [
            { title: 'AI Placement Portal', description: 'Full-stack placement automation platform using React, Firestore and AI matching', link: 'github.com/rohit/ai-portal' },
            { title: 'Smart Resume Parser', description: 'NLP-based resume parsing and rating application built using Python and FastAPI', link: 'github.com/rohit/parser' }
          ],
          documents: [
            { name: 'Resume_Rohit_Kumar.pdf', category: 'Resume', date: '10 May 2026', size: '512 KB' },
            { name: '10th_Marksheet.pdf', category: 'Academic Certificate', date: '15 Apr 2026', size: '245 KB' },
            { name: '12th_Marksheet.pdf', category: 'Academic Certificate', date: '15 Apr 2026', size: '268 KB' },
            { name: 'BTech_Sem6_Marksheet.pdf', category: 'Mark Sheets', date: '20 Apr 2026', size: '320 KB' }
          ],
          activityTimeline: [
            { date: '10 May 2026', title: 'Profile Verified', description: 'Academic details verified by placement officer' },
            { date: '08 May 2026', title: 'Resume Uploaded', description: 'Primary resume uploaded and indexed by AI model' }
          ],
          linkedin: 'linkedin.com/in/rohitkumar',
          github: 'github.com/rohitkumar',
          portfolio: 'rohitkumar.dev',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setDoc(studentDocRef, defaultProfile)
          .then(() => {
            setStudentData(defaultProfile);
            setLoading(false);
          })
          .catch(err => {
            console.error("Error seeding default profile:", err);
            setLoading(false);
          });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `organizations_universities/${organizationId}/students/${studentId}`);
    });

    return () => unsubscribe();
  }, [organizationId, studentId, userProfile]);

  // 2. Listen to Opportunities
  useEffect(() => {
    if (!organizationId) return;
    const oppsCol = collection(db, 'organizations_universities', organizationId, 'opportunities');
    const unsubscribe = onSnapshot(oppsCol, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setAllOpportunities(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `organizations_universities/${organizationId}/opportunities`);
    });
    return () => unsubscribe();
  }, [organizationId]);

  // 3. Listen to Applications
  useEffect(() => {
    if (!organizationId || !studentId) return;
    const appsCol = collection(db, 'organizations_universities', organizationId, 'applications');
    const unsubscribe = onSnapshot(appsCol, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.studentId === studentId) {
          list.push({ id: doc.id, ...data });
        }
      });
      setApplications(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `organizations_universities/${organizationId}/applications`);
    });
    return () => unsubscribe();
  }, [organizationId, studentId]);

  // 4. Eligibility Checking Logic
  const isEligible = (opp: any) => {
    if (!studentData) return true; // Default to true if profile is loading

    // Status check - only display open opportunities
    if (opp.status && opp.status !== 'open') return false;

    // CGPA check
    if (opp.minimumCgpa) {
      const minCgpa = parseFloat(opp.minimumCgpa);
      const studentCgpa = parseFloat(studentData.cgpa || '0');
      if (studentCgpa < minCgpa) return false;
    }

    // Department check
    if (opp.eligibleDepartments && Array.isArray(opp.eligibleDepartments) && opp.eligibleDepartments.length > 0) {
      const lowerDepts = opp.eligibleDepartments.map((d: string) => d.toLowerCase());
      if (!lowerDepts.includes('all') && studentData.department) {
        if (!lowerDepts.includes(studentData.department.toLowerCase())) return false;
      }
    }

    // Branch check
    if (opp.eligibleBranches && Array.isArray(opp.eligibleBranches) && opp.eligibleBranches.length > 0) {
      const lowerBranches = opp.eligibleBranches.map((b: string) => b.toLowerCase());
      if (!lowerBranches.includes('all') && studentData.branch) {
        if (!lowerBranches.includes(studentData.branch.toLowerCase())) return false;
      }
    }

    return true;
  };

  const getMatchScore = (opp: any) => {
    if (!studentData || !opp) return 85;
    const requiredSkills = opp.skills || [];
    if (requiredSkills.length === 0) return 90;
    const studentSkills = studentData.skills || [];
    const matched = requiredSkills.filter((s: string) => 
      studentSkills.some((sk: string) => sk.toLowerCase().includes(s.toLowerCase()))
    );
    const pct = Math.round((matched.length / requiredSkills.length) * 100);
    return Math.max(70, Math.min(100, pct));
  };

  // 5. Derive Stats & Collections
  const availableOpportunities = allOpportunities.filter(isEligible);
  
  const stats = [
    { label: 'Available Opportunities', value: String(availableOpportunities.length), icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10', link: 'opportunities' },
    { label: 'Applications Submitted', value: String(applications.length), icon: CheckCircle2, color: 'text-violet-500', bg: 'bg-violet-500/10', link: 'applications' },
    { label: 'AI Match Score', value: availableOpportunities.length > 0 ? `${Math.round(availableOpportunities.reduce((acc, o) => acc + getMatchScore(o), 0) / availableOpportunities.length)}%` : '91%', icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-500/10', subtext: 'Excellent Match' },
    { label: 'Upcoming Drives', value: String(availableOpportunities.filter(o => o.deadline && new Date(o.deadline) >= new Date()).length), icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10', link: 'opportunities' },
  ];

  const announcements = allOpportunities.length > 0 ? 
    allOpportunities.filter(o => o.status === 'open').slice(0, 3).map((opp, idx) => ({
      id: opp.id || idx,
      title: `${opp.companyName} Drive`,
      detail: opp.title ? `Applications are open for ${opp.title}` : 'New opportunity posted',
      time: opp.createdAt ? new Date(opp.createdAt).toLocaleDateString('en-GB') : 'Recently',
      tag: opp.employmentType || 'Direct'
    })) : [
      { id: 1, title: 'TCS Campus Drive', detail: 'Applications are open for 2026 batch', time: '2 hours ago', tag: 'Direct' },
      { id: 2, title: 'Infosys Hiring Drive', detail: 'Registration ends tomorrow', time: '1 day ago', tag: 'Urgent' },
      { id: 3, title: 'Wipro Off-Campus Program', detail: 'New opportunity added regularly', time: '2 days ago', tag: 'External' },
    ];

  const recommendations = availableOpportunities.length > 0 ? 
    availableOpportunities.slice(0, 3).map((opp) => ({
      id: opp.id,
      title: opp.title,
      company: opp.companyName,
      match: `${getMatchScore(opp)}%`,
      package: opp.salary || 'Competitive',
      location: opp.location || 'Remote'
    })) : [
      { title: 'Software Engineer', company: 'TCS', match: '94%', package: '4.5 LPA', location: 'Hyderabad' },
      { title: 'Graduate Engineer Trainee', company: 'Infosys', match: '91%', package: '4.0 LPA', location: 'Bangalore' },
      { title: 'Associate Software Engineer', company: 'Wipro', match: '88%', package: '3.6 LPA', location: 'Chennai' },
    ];

  const upcommingDrives = availableOpportunities.filter(o => o.deadline).length > 0 ? 
    availableOpportunities.filter(o => o.deadline).slice(0, 3).map((opp) => ({
      company: opp.companyName,
      date: new Date(opp.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      eligibility: opp.eligibleDepartments ? opp.eligibleDepartments.join(' / ') : 'All',
      status: 'Open'
    })) : [
      { company: 'TCS', date: '20 Jun 2026', eligibility: 'B.Tech - 2026 Batch', status: 'Registration Open' },
      { company: 'Infosys', date: '25 Jun 2026', eligibility: 'B.Tech / MCA - 2026 Batch', status: 'Closing Soon' },
      { company: 'Wipro', date: '28 Jun 2026', eligibility: 'Any Degree - 2026 Batch', status: 'Open' },
    ];

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner Grid matching image exactly */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-[32px] premium-gradient text-white relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-lg">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <Sparkles className="w-64 h-64 text-white" />
          </div>
          <div className="space-y-3 z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" /> AI Campus Career Assistant Active
            </div>
            <h2 className="text-2xl sm:text-3.5xl font-display font-bold leading-tight">
              Discover campus opportunities, improve your profile, and prepare for placements with ARYX AI.
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6 z-10">
            <button 
              onClick={() => onNavigate('opportunities')} 
              className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 transition-all font-bold rounded-xl text-sm shadow-md"
            >
              Explore Opportunities
            </button>
            <button 
              onClick={() => onNavigate('resume_builder')} 
              className="px-6 py-3 bg-white/15 hover:bg-white/25 transition-all text-white font-bold rounded-xl text-sm border border-white/20 backdrop-blur-md"
            >
              Improve Resume
            </button>
          </div>
        </div>

        {/* Small Welcome Card on Mobile/Side */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">Live Intake Sync</span>
            </div>
            <h3 className="text-xl font-display font-bold text-app-text">{studentData?.fullName || 'Rohit Kumar'}</h3>
            <p className="text-xs text-app-muted font-semibold">
              {studentData?.degree || 'B.Tech'} {studentData?.branch || 'CSE'} • {studentData?.year || '2026 Batch'} • {studentData?.university || "St. Xavier's University"}
            </p>
          </div>
          
          <div className="mt-6 p-4 rounded-2xl bg-app-surface/60 border border-app-border flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-app-muted block">Indexed CGPA</span>
              <span className="text-2xl font-display font-extrabold text-brand-blue">{studentData?.cgpa || '8.45'} / 10</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 block">Status</span>
              <span className="text-xs font-bold text-app-text">
                {studentData?.placementStatus === 'placed' ? 'Placed' : 'Eligible for All Drives'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid matching Image Columns exactly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((st, idx) => (
          <div 
            key={idx} 
            onClick={() => st.link && onNavigate(st.link)}
            className="p-6 rounded-[28px] glass border-app-border card-shadow flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${st.bg} flex items-center justify-center`}>
                <st.icon className={`w-6 h-6 ${st.color}`} />
              </div>
              {st.link ? (
                <span className="text-[10px] font-bold text-brand-blue uppercase bg-brand-blue/10 px-2 py-0.5 rounded-md flex items-center gap-1 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                  View <ArrowUpRight className="w-3 h-3" />
                </span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-md uppercase">
                  {st.subtext}
                </span>
              )}
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-app-text tracking-tight">{st.value}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-app-muted mt-0.5">{st.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Announcements and Quick Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Placement Officers Announcements */}
        <div className="lg:col-span-1 p-6 rounded-[32px] glass border-app-border card-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-display font-bold text-lg text-app-text">Placement Announcements</h4>
              <button 
                onClick={() => onNavigate('opportunities')}
                className="text-xs font-bold text-brand-blue hover:underline"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 rounded-2xl bg-app-surface/50 border border-app-border hover:border-brand-blue/30 transition-all">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="font-bold text-sm text-app-text leading-tight">{ann.title}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      ann.tag === 'Urgent' ? 'bg-red-500/10 text-red-500' :
                      ann.tag === 'Direct' ? 'bg-blue-500/10 text-brand-blue' : 'bg-slate-500/10 text-app-muted'
                    }`}>
                      {ann.tag}
                    </span>
                  </div>
                  <p className="text-xs text-app-muted leading-relaxed font-medium mb-2">{ann.detail}</p>
                  <span className="text-[10px] text-app-muted/80 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {ann.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Opportunities AI Match */}
        <div className="lg:col-span-2 p-6 rounded-[32px] glass border-app-border card-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-display font-bold text-lg text-app-text">Recommended (AI Match)</h4>
              <button 
                onClick={() => onNavigate('opportunities')}
                className="text-xs font-bold text-brand-blue hover:underline font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-3.5">
              {recommendations.map((rec, i) => (
                <div 
                  key={rec.id || i} 
                  className="p-4 rounded-2xl bg-app-surface/60 border border-app-border flex items-center justify-between hover:scale-[1.005] hover:bg-app-surface transition-all gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-display font-extrabold text-sm shadow-inner">
                      {rec.company ? rec.company.substring(0, 3).toUpperCase() : 'JOB'}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-app-text leading-none">{rec.title}</div>
                      <div className="text-xs font-medium text-app-muted mt-1">
                        {rec.company} • {rec.package} • {rec.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Match {rec.match}
                      </span>
                    </div>
                    <button 
                      onClick={() => onApplyJob(rec.title, rec.company, rec.id)}
                      className="px-4 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-xl text-xs whitespace-nowrap transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Drives table & Resume Health + Profile widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upcoming Drives row list */}
        <div className="lg:col-span-1 p-6 rounded-[32px] glass border-app-border card-shadow">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-display font-bold text-lg text-app-text">Upcoming Drives</h4>
            <button 
              onClick={() => onNavigate('opportunities')}
              className="text-xs font-bold text-brand-blue hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {upcommingDrives.map((drv, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-app-surface/60 border border-app-border flex justify-between items-center">
                <div>
                  <div className="font-bold text-sm text-app-text">{drv.company} Placement</div>
                  <div className="text-xs text-app-muted mt-0.5">{drv.eligibility}</div>
                  <div className="text-[10px] text-brand-violet font-semibold mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Drive date: {drv.date}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full block text-center">
                    {drv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resume Health Widget */}
        <div className="lg:col-span-1 p-6 rounded-[32px] glass border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h4 className="font-display font-bold text-lg text-app-text mb-4">Resume Health</h4>
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-app-border/40" />
                  <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="240" strokeDashoffset="19" className="text-emerald-500" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-display font-bold text-app-text">92%</span>
                  <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest leading-none">Great</span>
                </div>
              </div>

              <div className="flex-1 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-app-muted">Missing Checklist</span>
                <ul className="text-xs text-app-text space-y-1 font-semibold">
                  <li className="flex items-center gap-1.5 text-red-500">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Add more projects
                  </li>
                  <li className="flex items-center gap-1.5 text-amber-500">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Add certifications
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('resume_builder')}
            className="w-full py-3 mt-4 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 border border-brand-blue/10"
          >
            Improve Resume <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Strength Widget */}
        <div className="lg:col-span-1 p-6 rounded-[32px] glass border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h4 className="font-display font-bold text-lg text-app-text mb-4">Profile Strength</h4>
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-app-border/40" />
                  <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="240" strokeDashoffset="33" className="text-brand-violet" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-display font-bold text-app-text">86%</span>
                  <span className="text-[8px] font-bold text-brand-violet uppercase tracking-widest leading-none">Good</span>
                </div>
              </div>

              <div className="flex-1 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-app-muted">Action Suggested</span>
                <ul className="text-xs text-app-text space-y-1 font-semibold">
                  <li className="flex items-center gap-1.5 text-amber-500">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Add portfolio link
                  </li>
                  <li className="flex items-center gap-1.5 text-blue-500">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Add LinkedIn profile
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('profile')}
            className="w-full py-3 mt-4 bg-brand-violet/10 hover:bg-brand-violet/20 text-brand-violet font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 border border-brand-violet/10"
          >
            Improve Profile <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
