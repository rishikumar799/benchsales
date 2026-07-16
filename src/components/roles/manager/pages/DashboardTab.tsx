import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  FileText, 
  Plus, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Zap, 
  Award, 
  ArrowRight,
  PieChart,
  Target,
  Bell
} from 'lucide-react';
import { db, auth } from '../../../../firebase/firebase';
import { collection, onSnapshot, query, where, doc } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';

interface DashboardTabProps {
  onNavigate: (tab: string) => void;
  onCreateJobClick: () => void;
}

export default function DashboardTab({ onNavigate, onCreateJobClick }: DashboardTabProps) {
  const { user, userProfile } = useAuth();
  const currentBdmUid = user?.uid || userProfile?.uid || '';
  const currentBdmName = userProfile?.fullName || userProfile?.displayName || user?.displayName || 'Marketplace BDM';

  const [data, setData] = useState({
    activeJobsCount: 0,
    totalJobsCount: 0,
    submissionsCount: 0,
    recentJobs: [] as any[],
    recentSubmissions: [] as any[],
    recruiterActivity: [] as any[],
    insights: [] as any[]
  });

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentBdmUid) return;

    let unsubJobs: (() => void) | null = null;
    let unsubSubs: (() => void) | null = null;
    let unsubRecruiters: (() => void) | null = null;
    let unsubJobseekers: (() => void) | null = null;
    let unsubNotifs: (() => void) | null = null;

    setLoading(true);

    try {
      // Helper function to extract and standardise dates/timestamps
      const getTimestamp = (val: any) => {
        if (!val) return 0;
        if (typeof val === 'object' && val.seconds) {
          return val.seconds * 1000;
        }
        if (typeof val === 'string') {
          const parsed = Date.parse(val);
          return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
      };

      const formatSubmittedAt = (val: any) => {
        if (!val) return 'Just now';
        if (typeof val === 'object' && val.seconds) {
          return new Date(val.seconds * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }
        if (typeof val === 'string') {
          const parsed = Date.parse(val);
          if (!isNaN(parsed)) {
            return new Date(parsed).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
          }
          return val;
        }
        return 'Just now';
      };

      // 1. Listen to BDM-private notifications
      const notifDocRef = doc(db, 'notifications', currentBdmUid);
      unsubNotifs = onSnapshot(notifDocRef, (notifSnap) => {
        if (notifSnap.exists()) {
          setNotifications(notifSnap.data().items || []);
        } else {
          setNotifications([]);
        }
      }, (err) => {
        console.warn("Notifications listener error:", err);
      });

      // 2. Real-time Job Seekers listener to keep reactivity aligned
      unsubJobseekers = onSnapshot(collection(db, 'marketplace_jobseekers'), () => {
        // Kept for full real-time synchronization compliance
      }, (err) => {
        console.warn("Jobseekers listener error:", err);
      });

      // 3. Listen to all marketplace recruiters
      unsubRecruiters = onSnapshot(collection(db, 'marketplace_recruiters'), (recruitersSnapshot) => {
        const recruitersList = recruitersSnapshot.docs.map(d => ({ id: d.id, ...d.data() as any }));

        // 4. Listen to BDM-specific submissions in real-time
        const submissionsQuery = query(
          collection(db, 'marketplace_submissions'),
          where('bdmUid', '==', currentBdmUid)
        );

        unsubSubs = onSnapshot(submissionsQuery, (subsSnapshot) => {
          const bdmSubmissions = subsSnapshot.docs.map(d => ({ id: d.id, ...d.data() as any }));

          // 5. Listen to BDM-specific jobs in real-time
          const jobsQuery = query(
            collection(db, 'marketplace_jobs'),
            where('createdBy', '==', currentBdmUid)
          );

          unsubJobs = onSnapshot(jobsQuery, (jobsSnapshot) => {
            try {
              const bdmJobs = jobsSnapshot.docs.map(d => ({ id: d.id, ...d.data() as any }));

              // Metrics & Stats
              const nonArchivedJobs = bdmJobs.filter(j => j.status !== 'archived' && j.status !== 'ARCHIVED');
              const activeJobs = nonArchivedJobs.filter(j => j.status === 'Active' || j.status === 'OPEN' || j.status === 'open');

              // Recent Jobs: newest 4 jobs created by this BDM
              const sortedJobs = [...nonArchivedJobs].sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));
              const rJobs = sortedJobs.slice(0, 4).map(j => {
                const isPaused = j.status === 'Paused' || j.status === 'PAUSED' || j.status === 'paused';
                return {
                  id: j.id,
                  title: j.title || 'Untitled Role',
                  company: j.companyName || j.client || 'Direct Client',
                  openings: j.openings || '1 Position',
                  status: isPaused ? 'Paused' : 'Active'
                };
              });

              // Recent Submissions: newest 3 submissions belonging to this BDM
              const sortedSubs = [...bdmSubmissions].sort((a, b) => getTimestamp(b.submittedAt) - getTimestamp(a.submittedAt));
              const rSubs = sortedSubs.slice(0, 3).map((s: any, idx) => ({
                id: s.id || `sub-idx-${idx}`,
                candidate: s.candidateName || 'Candidate',
                recruiter: s.recruiterName || s.submittedBy || 'Recruiter',
                job: s.jobTitle || 'Job Requirement',
                date: formatSubmittedAt(s.submittedAt || s.submissionDate)
              }));

              // Recruiter Activity Map (Unique recruiters working on this BDM's jobs or who have submitted candidates)
              const recruiterIds = new Set<string>();
              const recruiterNamesToIds: Record<string, string> = {};

              // Extract from jobs assignments
              bdmJobs.forEach(job => {
                if (Array.isArray(job.assignedRecruiters)) {
                  job.assignedRecruiters.forEach((rid: string) => {
                    if (rid) recruiterIds.add(rid);
                  });
                }
              });

              // Extract from submissions
              bdmSubmissions.forEach(sub => {
                const rUid = sub.recruiterUid;
                if (rUid && rUid !== 'N/A') {
                  recruiterIds.add(rUid);
                  if (sub.recruiterName) {
                    recruiterNamesToIds[sub.recruiterName] = rUid;
                  }
                }
              });

              const recruiterActivityList = Array.from(recruiterIds).map((rid) => {
                const profile = recruitersList.find(r => r.id === rid || r.uid === rid);
                const fullName = profile?.profile?.fullName || profile?.fullName || profile?.name || profile?.displayName ||
                  Object.keys(recruiterNamesToIds).find(name => recruiterNamesToIds[name] === rid) || 'Recruiter Partner';
                const photoURL = profile?.profile?.photoURL || profile?.photoURL || profile?.profile?.avatar || `https://picsum.photos/seed/${encodeURIComponent(fullName)}/100/100`;

                // Submissions belonging to this BDM submitted by this recruiter
                const rSubsCount = bdmSubmissions.filter(sub => sub.recruiterUid === rid || sub.recruiterName === fullName).length;

                // Active jobs of this BDM assigned to or submitted by this recruiter
                const rActiveJobsCount = bdmJobs.filter(job => {
                  const isActive = job.status === 'Active' || job.status === 'OPEN' || job.status === 'open';
                  if (!isActive) return false;
                  const isAssigned = Array.isArray(job.assignedRecruiters) && job.assignedRecruiters.includes(rid);
                  const hasSubmission = bdmSubmissions.some(sub => sub.jobId === job.id && (sub.recruiterUid === rid || sub.recruiterName === fullName));
                  return isAssigned || hasSubmission;
                }).length;

                return {
                  id: rid,
                  name: fullName,
                  activeJobs: rActiveJobsCount,
                  submissions: rSubsCount,
                  img: photoURL
                };
              });

              // Compute Insights dynamically
              const jobsSubCountMap: Record<string, number> = {};
              bdmSubmissions.forEach(sub => {
                const title = sub.jobTitle || 'Job Requirement';
                jobsSubCountMap[title] = (jobsSubCountMap[title] || 0) + 1;
              });

              let mostActiveJob = '';
              let maxSubs = 0;
              Object.entries(jobsSubCountMap).forEach(([job, count]) => {
                if (count > maxSubs) {
                  maxSubs = count;
                  mostActiveJob = job;
                }
              });

              let topRecruiter = '';
              let maxRecruiterSubs = 0;
              recruiterActivityList.forEach((r) => {
                if (r.submissions > maxRecruiterSubs) {
                  maxRecruiterSubs = r.submissions;
                  topRecruiter = r.name;
                }
              });

              const skillCount: Record<string, number> = {};
              bdmJobs.forEach(job => {
                const skillsStr = job.skills || '';
                if (skillsStr) {
                  skillsStr.split(',').forEach((s: string) => {
                    const cleaned = s.trim();
                    if (cleaned) {
                      skillCount[cleaned] = (skillCount[cleaned] || 0) + 1;
                    }
                  });
                }
              });

              let mostRequestedSkill = '';
              let maxSkillCount = 0;
              Object.entries(skillCount).forEach(([skill, count]) => {
                if (count > maxSkillCount) {
                  maxSkillCount = count;
                  mostRequestedSkill = skill;
                }
              });

              const dynamicInsights = [];
              if (mostActiveJob) {
                dynamicInsights.push({ icon: Target, label: 'Most Active Job', value: mostActiveJob, desc: `${maxSubs} submittals` });
              }
              if (mostRequestedSkill) {
                dynamicInsights.push({ icon: Zap, label: 'Most Requested Skill', value: mostRequestedSkill, desc: `${maxSkillCount} job postings` });
              }
              if (topRecruiter) {
                dynamicInsights.push({ icon: Award, label: 'Top Recruiter', value: topRecruiter, desc: `${maxRecruiterSubs} submissions` });
              }

              setData({
                activeJobsCount: activeJobs.length,
                totalJobsCount: nonArchivedJobs.length,
                submissionsCount: bdmSubmissions.length,
                recentJobs: rJobs,
                recentSubmissions: rSubs,
                recruiterActivity: recruiterActivityList,
                insights: dynamicInsights
              });

              setLoading(false);
            } catch (err: any) {
              setError(err.message || String(err));
              setLoading(false);
            }
          }, (err) => {
            setError(err.message);
            setLoading(false);
          });
        }, (err) => {
          setError(err.message);
          setLoading(false);
        });
      }, (err) => {
        setError(err.message);
        setLoading(false);
      });

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }

    return () => {
      if (unsubJobs) unsubJobs();
      if (unsubSubs) unsubSubs();
      if (unsubRecruiters) unsubRecruiters();
      if (unsubJobseekers) unsubJobseekers();
      if (unsubNotifs) unsubNotifs();
    };
  }, [currentBdmUid]);

  const stats = [
    { label: 'Active Jobs', value: String(data.activeJobsCount), desc: 'View all active roles', color: 'text-blue-500', target: 'jobs' },
    { label: 'Recruiters Working', value: String(data.recruiterActivity.length), desc: 'On active pipelines', color: 'text-emerald-500', target: 'recruiters' },
    { label: 'Candidate Submissions', value: String(data.submissionsCount), desc: 'Total applications', color: 'text-amber-500', target: 'submissions' },
    { label: 'Total Jobs Posted', value: String(data.totalJobsCount), desc: 'Created across workspace', color: 'text-violet-500', target: 'jobs' },
  ];

  const recentJobs = data.recentJobs;
  const recruiterActivity = data.recruiterActivity;
  const recentSubmissions = data.recentSubmissions;
  const Insights = data.insights;

  return (
    <div className="space-y-8 animate-fade-in text-app-text">
      
      {/* 1. Header with dynamic welcome details */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text">Dashboard</h1>
          <p className="text-app-muted mt-1">Welcome back, {currentBdmName}! Here's what's happening in your marketplace.</p>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center rounded-[32px] glass border border-app-border card-shadow flex flex-col items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full mb-4"></div>
          <p className="text-sm font-semibold text-app-muted">Loading BDM metrics and activity feed from Firestore...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center rounded-[32px] glass border border-rose-500/20 card-shadow bg-rose-500/5">
          <div className="text-rose-500 font-extrabold text-lg mb-2">Firestore Load Error</div>
          <p className="text-sm text-app-muted">{error}</p>
        </div>
      ) : (
        <>
          {/* 2. Hero Action Banner */}
          <div className="p-6 md:p-8 rounded-[32px] premium-gradient text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl">
              <span className="bg-white/20 text-white font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                BDM Control Center
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-bold mt-3 mb-2">Marketplace Hiring Workspace</h2>
              <p className="text-white/85 text-sm leading-relaxed">
                Create and manage job requirements for recruiters across the marketplace and monitor hiring pipeline fill rates.
              </p>
            </div>
            <button 
              onClick={onCreateJobClick} 
              className="relative z-10 px-6 py-3.5 bg-white text-brand-blue font-bold rounded-2xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-sm shadow-xl shrink-0"
            >
              <Plus className="w-4 h-4 text-brand-blue stroke-[3px]" /> Create New Job
            </button>
            {/* Abstract design elements */}
            <div className="absolute right-0 bottom-0 w-96 h-96 bg-brand-violet/20 blur-3xl rounded-full" />
          </div>

          {/* 3. Stat Metrics row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((st, idx) => (
              <button 
                key={idx}
                onClick={() => onNavigate(st.target)}
                className="p-6 rounded-[28px] glass border border-app-border text-left hover:border-brand-blue/30 hover:scale-[1.01] transition-all group card-shadow cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-app-muted">{st.label}</span>
                  <div className={`text-3.5xl font-display font-black mt-2 ${st.color}`}>{st.value}</div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-app-border/40 w-full">
                  <span className="text-xs font-semibold text-app-muted group-hover:text-app-text transition-colors">{st.desc}</span>
                  <ChevronRight className="w-4 h-4 text-app-muted group-hover:text-app-text group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))}
          </div>

          {/* 4. Middle Layout: Recent Jobs & Recent Submissions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left column: Recent Jobs */}
            <div className="lg:col-span-5 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display font-bold text-lg text-app-text">Recent Jobs</h3>
                  <button 
                    onClick={() => onNavigate('jobs')} 
                    className="text-xs font-semibold text-brand-blue hover:underline"
                  >
                    View All Jobs
                  </button>
                </div>
                {recentJobs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Briefcase className="w-8 h-8 text-app-muted/30 mb-3" />
                    <p className="text-sm font-semibold text-app-text">No jobs created yet</p>
                    <p className="text-xs text-app-muted mt-1">Click "Create New Job" above to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentJobs.map((j) => (
                      <div key={j.id} className="p-4 rounded-2xl bg-app-surface/60 border border-app-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-app-text">{j.title}</h4>
                            <p className="text-xs text-app-muted mt-0.5 font-semibold">{j.company}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-app-muted bg-app-bg px-2.5 py-1 rounded-xl border border-app-border">
                            {j.openings}
                          </span>
                          <span className="ml-2 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/15">
                            {j.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={() => onNavigate('jobs')} 
                className="w-full text-center py-3 border border-app-border hover:bg-app-surface text-xs font-bold text-app-text rounded-2xl mt-6 transition-all"
              >
                Manage Active Sourcing Requirements →
              </button>
            </div>

            {/* Right column: Recent Submissions */}
            <div className="lg:col-span-7 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display font-bold text-lg text-app-text">Recent Submissions</h3>
                  <button 
                    onClick={() => onNavigate('submissions')} 
                    className="text-xs font-semibold text-brand-blue hover:underline"
                  >
                    View All Submissions
                  </button>
                </div>
                {recentSubmissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="w-8 h-8 text-app-muted/30 mb-3" />
                    <p className="text-sm font-semibold text-app-text">No candidate submittals yet</p>
                    <p className="text-xs text-app-muted mt-1">Assigned recruiters will submit profiles here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-app-border text-xs font-extrabold text-app-muted uppercase tracking-wider">
                          <th className="py-3 px-2">Candidate</th>
                          <th className="py-3 px-2">Recruiter</th>
                          <th className="py-3 px-2">Job</th>
                          <th className="py-3 px-2 text-right">Submitted On</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-app-border/40 text-xs">
                        {recentSubmissions.map((sub) => (
                          <tr key={sub.id} className="hover:bg-app-surface/30 transition-colors">
                            <td className="py-4.5 px-2 font-bold text-app-text">{sub.candidate}</td>
                            <td className="py-4.5 px-2 font-semibold text-app-muted">{sub.recruiter}</td>
                            <td className="py-4.5 px-2 font-mono font-bold text-brand-purple">{sub.job}</td>
                            <td className="py-4.5 px-2 text-right font-semibold text-app-muted font-mono">{sub.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* 5. Bottom Rows Layout: Recruiter Activity & Insights/Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Recruiter Activity */}
            <div className="lg:col-span-8 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display font-bold text-lg text-app-text">Recruiter Activity</h3>
                  <button 
                    onClick={() => onNavigate('recruiters')} 
                    className="text-xs font-semibold text-brand-blue hover:underline"
                  >
                    View All
                  </button>
                </div>
                {recruiterActivity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="w-8 h-8 text-app-muted/30 mb-3" />
                    <p className="text-sm font-semibold text-app-text">No recruiter activity yet</p>
                    <p className="text-xs text-app-muted mt-1">Recruiters will appear as they begin sourcing.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-app-border text-xs font-extrabold text-app-muted uppercase tracking-wider">
                          <th className="py-3 px-2">Recruiter</th>
                          <th className="py-3 px-2 text-center">Active Jobs</th>
                          <th className="py-3 px-2 text-right">Submissions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-app-border/40 text-xs">
                        {recruiterActivity.map((r) => (
                          <tr key={r.id} className="hover:bg-app-surface/30 transition-colors">
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-2.5">
                                <img 
                                  src={r.img} 
                                  alt={r.name} 
                                  className="w-8 h-8 rounded-full object-cover border border-app-border" 
                                  referrerPolicy="no-referrer"
                                />
                                <span className="font-bold text-app-text">{r.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-center font-extrabold text-app-text">{r.activeJobs}</td>
                            <td className="py-3 px-2 text-right font-extrabold text-brand-blue">{r.submissions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <button 
                onClick={() => onNavigate('recruiters')} 
                className="w-full text-center py-3 bg-app-bg hover:bg-app-surface text-xs font-bold text-brand-blue border border-app-border rounded-2xl mt-6 transition-all"
              >
                Review Marketplace Sourcing Partners
              </button>
            </div>

            {/* Right Side: Insights & Realtime Notifications Stack */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Marketplace Insights */}
              <div className="p-6 rounded-[32px] bg-gradient-to-br from-brand-violet/10 to-brand-blue/10 border border-brand-violet/20 card-shadow flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-app-text mb-6">Marketplace Insights</h3>
                  {Insights.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Sparkles className="w-10 h-10 text-brand-violet/30 mb-3" />
                      <p className="text-sm font-semibold text-app-text">No computed insights yet</p>
                      <p className="text-xs text-app-muted mt-1">Sourcing activity on your jobs will populate this dynamically.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {Insights.map((ins, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-white dark:bg-app-surface rounded-xl flex items-center justify-center shadow-md shrink-0">
                            <ins.icon className="w-5 h-5 text-brand-violet" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">{ins.label}</span>
                            <span className="font-bold text-sm text-app-text mt-0.5 block">{ins.value}</span>
                            <span className="text-xs text-app-muted">{ins.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => onNavigate('analytics')} 
                  className="w-full mt-6 py-3.5 bg-brand-violet text-white text-xs font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-violet/15"
                >
                  Open Market Intelligence Reports
                </button>
              </div>

              {/* Realtime Notifications Feed */}
              <div className="p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display font-bold text-base text-app-text flex items-center gap-2">
                      <Bell className="w-4 h-4 text-brand-blue" />
                      Recent Activity Alerts
                    </h3>
                    <span className="text-[10px] font-mono bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full font-bold">
                      {notifications.length} Alerts
                    </span>
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <Bell className="w-6 h-6 text-app-muted/20 mb-2" />
                      <p className="text-xs font-semibold text-app-muted">No recent notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                      {notifications.slice(0, 4).map((notif: any) => (
                        <div key={notif.id || Math.random().toString()} className="p-3 rounded-xl bg-app-surface/40 border border-app-border/40 text-xs">
                          <div className="font-bold text-app-text">{notif.title}</div>
                          <p className="text-app-muted mt-0.5 leading-relaxed">{notif.desc}</p>
                          <span className="text-[9px] font-mono text-app-muted block mt-1.5">{notif.time || 'Just now'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

        </>
      )}

    </div>
  );
}
