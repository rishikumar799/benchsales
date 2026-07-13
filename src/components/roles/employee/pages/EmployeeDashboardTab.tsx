import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  FileText, 
  ChevronRight,
  Clock,
  UserCheck,
  Award,
  AlertTriangle,
  XCircle,
  Activity,
  ThumbsUp,
  Inbox
} from 'lucide-react';
import { db } from '../../../../firebase/firebase';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface EmployeeDashboardTabProps {
  onNavigate: (tabId: string) => void;
  onApplyJob?: (jobTitle: string, company: string) => void;
}

export default function EmployeeDashboardTab({ onNavigate, onApplyJob }: EmployeeDashboardTabProps) {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);

  // Firestore reactive state variables
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [documentsCount, setDocumentsCount] = useState<number>(0);
  const [profileData, setProfileData] = useState<any>(null);
  const [activityList, setActivityList] = useState<any[]>([]);

  // 1. Listen to all collections in Real-time (Read-only onSnapshot)
  useEffect(() => {
    if (!userProfile?.organizationId || !userProfile?.uid) return;

    const orgId = userProfile.organizationId;
    const uid = userProfile.uid;

    // A. Listen to Jobs
    const jobsCol = collection(db, 'organizations_companies', orgId, 'jobs');
    const unsubscribeJobs = onSnapshot(jobsCol, (snapshot) => {
      const fetchedJobs = snapshot.docs.map(snapDoc => {
        const data = snapDoc.data();
        return {
          id: snapDoc.id,
          role: data.title || data.role || '',
          team: data.dept || data.team || data.department || 'Engineering Team',
          matchType: data.matchType || 'Internal Mobility',
          location: data.location || 'Hyderabad, India',
          exp: data.experience || data.exp || '3+ Years',
          type: data.type || 'Full Time',
          department: data.dept || data.department || 'Engineering',
          status: data.status || 'Active',
          createdAt: data.createdAt || new Date().toISOString(),
        };
      });

      // Sort client-side by createdAt descending to avoid compound index requirements
      fetchedJobs.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });

      setJobs(fetchedJobs);
    }, (error) => {
      console.error("Error listening to jobs in dashboard:", error);
    });

    // B. Listen to current Employee's Applications
    const appsCol = collection(db, 'organizations_companies', orgId, 'applications');
    const qApps = query(appsCol, where('employeeUid', '==', uid));
    const unsubscribeApps = onSnapshot(qApps, (snapshot) => {
      const fetchedApps = snapshot.docs.map(snapDoc => {
        const data = snapDoc.data();
        return {
          id: snapDoc.id,
          role: data.jobTitle || data.role || 'Unknown Job',
          team: data.department || data.team || 'Engineering',
          status: data.status || 'Applied',
          createdAt: data.createdAt || new Date().toISOString(),
        };
      });

      // Sort client-side by createdAt descending
      fetchedApps.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });

      setApplications(fetchedApps);
    }, (error) => {
      console.error("Error listening to applications in dashboard:", error);
    });

    // C. Listen to current Employee's Documents Count
    const docsCol = collection(db, 'organizations_companies', orgId, 'documents');
    const qDocs = query(docsCol, where('employeeUid', '==', uid));
    const unsubscribeDocs = onSnapshot(qDocs, (snapshot) => {
      setDocumentsCount(snapshot.size);
    }, (error) => {
      console.error("Error listening to documents in dashboard:", error);
    });

    // D. Listen to Employee's Profile completion
    const profileRef = doc(db, 'organizations_companies', orgId, 'employees', uid);
    const unsubscribeProfile = onSnapshot(profileRef, (snapshot) => {
      if (snapshot.exists()) {
        setProfileData(snapshot.data());
      } else {
        setProfileData(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to profile in dashboard:", error);
      setLoading(false);
    });

    // E. Listen to Organization Activity feed
    const activityCol = collection(db, 'organizations_companies', orgId, 'activity');
    const unsubscribeActivity = onSnapshot(activityCol, (snapshot) => {
      const fetchedActivities = snapshot.docs.map(snapDoc => {
        const data = snapDoc.data();
        return {
          id: snapDoc.id,
          userName: data.userName || 'Employee',
          action: data.action || 'updated preferences',
          subject: data.subject || '',
          time: data.time || 'Just Now',
          avatar: data.avatar || 'https://picsum.photos/seed/emp/100/100',
          createdAt: data.createdAt || new Date().toISOString(),
        };
      });

      // Sort client-side by createdAt descending to guarantee robust load order
      fetchedActivities.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });

      setActivityList(fetchedActivities);
    }, (error) => {
      console.error("Error listening to company activity feed:", error);
    });

    return () => {
      unsubscribeJobs();
      unsubscribeApps();
      unsubscribeDocs();
      unsubscribeProfile();
      unsubscribeActivity();
    };
  }, [userProfile?.organizationId, userProfile?.uid]);

  // 2. Computed Metrics & Stats
  const metrics = useMemo(() => {
    // Only display jobs where status is 'open' or 'active'
    const openJobs = jobs.filter(job => job.status?.toLowerCase() === 'open' || job.status?.toLowerCase() === 'active');
    
    // Status breakdowns
    let underReviewCount = 0;
    let interviewCount = 0;
    let offersCount = 0;
    let joinedCount = 0;
    let rejectedCount = 0;

    applications.forEach(app => {
      const s = app.status?.toLowerCase() || '';
      if (s === 'under_review' || s === 'under review') {
        underReviewCount++;
      } else if (s === 'interview' || s === 'shortlisted') {
        interviewCount++;
      } else if (s === 'offer' || s === 'selected') {
        offersCount++;
      } else if (s === 'joined') {
        joinedCount++;
      } else if (s === 'rejected') {
        rejectedCount++;
      }
    });

    // Profile Completion Percentage based on fields filled
    let completionPercentage = 92; // Default fallback
    if (profileData) {
      const fields = [
        profileData.name || profileData.fullName,
        profileData.employeeId,
        profileData.department || profileData.dept,
        profileData.designation,
        profileData.location,
        profileData.manager,
        profileData.email,
        profileData.phone || profileData.phoneNumber,
        profileData.experience || profileData.totalExperience,
        profileData.linkedin,
        profileData.github,
        profileData.about
      ];
      
      let filled = fields.filter(Boolean).length;
      if (Array.isArray(profileData.skills) && profileData.skills.length > 0) filled += 1;
      if (Array.isArray(profileData.languages) && profileData.languages.length > 0) filled += 1;
      
      const totalFields = fields.length + 2;
      completionPercentage = Math.round((filled / totalFields) * 100);
    }

    return {
      availableJobs: openJobs.length,
      appliedJobs: applications.length,
      underReview: underReviewCount,
      interview: interviewCount,
      offers: offersCount,
      joined: joinedCount,
      rejected: rejectedCount,
      documentsCount,
      profileCompletion: completionPercentage
    };
  }, [jobs, applications, documentsCount, profileData]);

  // 3. Dynamic chart data for Recharts PieChart
  const chartData = useMemo(() => {
    return [
      { name: 'Applied', value: Math.max(0, metrics.appliedJobs - metrics.underReview - metrics.interview - metrics.offers - metrics.joined - metrics.rejected), color: '#3B82F6' },
      { name: 'Under Review', value: metrics.underReview, color: '#F59E0B' },
      { name: 'Interview / Shortlist', value: metrics.interview, color: '#8B5CF6' },
      { name: 'Offers / Joined', value: metrics.offers + metrics.joined, color: '#10B981' },
      { name: 'Rejected', value: metrics.rejected, color: '#EF4444' }
    ].filter(d => d.value > 0); // Only render slices with actual applications
  }, [metrics]);

  const hasChartData = chartData.length > 0;

  const handleApply = (jobTitle: string) => {
    if (onApplyJob) {
      onApplyJob(jobTitle, 'Internal Platform');
    }
  };

  if (!userProfile?.organizationId || !userProfile?.uid) {
    return (
      <div className="p-8 text-center text-app-muted font-bold text-xs">
        Connecting to corporate workspace...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-16 text-center text-app-muted text-xs font-bold animate-pulse">
        Aggregating corporate metrics and workspace analytics...
      </div>
    );
  }

  // Get first 3 latest jobs for dashboard
  const latestJobs = jobs
    .filter(job => job.status?.toLowerCase() === 'open' || job.status?.toLowerCase() === 'active')
    .slice(0, 3);

  // Get first 3 recent applications for dashboard display
  const recentApps = applications.slice(0, 3);

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* 1. Welcoming Header banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 md:p-8 rounded-[32px] premium-gradient text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-3.5 z-10">
          <span className="text-xs bg-white/20 text-white font-extrabold uppercase px-3 py-1 rounded-full border border-white/10 tracking-widest">
            Internal Career Portal
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-black leading-tight tracking-tight">
            Discover internal opportunities and advance your career within the organization.
          </h2>
          <div className="flex flex-wrap gap-3 pt-1">
            <button 
              onClick={() => onNavigate('opportunities')}
              className="px-5 py-2.5 bg-white text-brand-blue font-bold rounded-2xl text-xs hover:bg-neutral-100 transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              Explore Opportunities <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => onNavigate('resume_builder')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs border border-white/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Update Resume
            </button>
          </div>
        </div>

        {/* Dynamic Abstract Mascot Widget */}
        <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-[28px] shrink-0 flex items-center justify-center p-2 backdrop-blur-md border border-white/10 shadow-inner">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
            <rect x="35" y="45" width="130" height="110" rx="40" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
            <rect x="45" y="55" width="110" height="85" rx="30" fill="#090E1A" />
            <circle cx="75" cy="90" r="10" fill="#3B82F6" />
            <circle cx="75" cy="90" r="4" fill="#00E5FF" />
            <circle cx="125" cy="90" r="10" fill="#3B82F6" />
            <circle cx="125" cy="90" r="4" fill="#00E5FF" />
            <path d="M 80,122 C 90,130 110,130 120,122" stroke="#00E5FF" strokeWidth="4" fill="none" strokeLinecap="round" />
            <rect x="95" y="25" width="10" height="20" fill="#94A3B8" />
            <circle cx="100" cy="20" r="8" fill="#F43F5E" />
          </svg>
        </div>
      </motion.div>

      {/* 2. Top-Level Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Available Opportunities', value: metrics.availableJobs.toString(), actionText: 'View all', tab: 'opportunities', color: 'text-brand-blue' },
          { label: 'Applications Submitted', value: metrics.appliedJobs.toString(), actionText: 'View all', tab: 'applications', color: 'text-emerald-500' },
          { label: 'Uploaded Documents', value: metrics.documentsCount.toString(), actionText: 'View all', tab: 'documents', color: 'text-amber-500' },
          { label: 'Profile Completion', value: `${metrics.profileCompletion}%`, actionText: 'Complete', tab: 'profile', color: 'text-violet-500' }
        ].map((st, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow flex flex-col justify-between hover:border-brand-blue/30 transition-all group"
          >
            <div>
              <span className="text-xs font-bold text-app-muted uppercase tracking-widest block leading-tight">{st.label}</span>
              <span className={`text-3xl font-display font-black block mt-3 leading-none h-9 ${st.color}`}>{st.value}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-app-border/40 flex items-center justify-between">
              {st.label === 'Profile Completion' ? (
                <div className="flex-1 mr-4">
                  <div className="w-full h-1.5 bg-app-bg border border-app-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-violet-500 rounded-full transition-all duration-500" 
                      style={{ width: `${metrics.profileCompletion}%` }} 
                    />
                  </div>
                </div>
              ) : null}
              <button 
                onClick={() => onNavigate(st.tab)}
                className="text-xs font-extrabold text-brand-blue hover:text-brand-violet transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{st.actionText}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Dedicated Application Pipeline / Funnel Section */}
      <div className="p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow space-y-6">
        <div>
          <h3 className="text-lg font-display font-black text-app-text">Application Pipeline Breakdown</h3>
          <p className="text-xs text-app-muted font-semibold mt-1">Real-time distribution of your current internal mobility requests</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Under Review', count: metrics.underReview, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
            { label: 'Interview Scheduled', count: metrics.interview, icon: Activity, color: 'text-violet-500', bg: 'bg-violet-500/10 border-violet-500/20' },
            { label: 'Offers Extended', count: metrics.offers, icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
            { label: 'Joined / Transferred', count: metrics.joined, icon: UserCheck, color: 'text-brand-blue', bg: 'bg-brand-blue/10 border-brand-blue/20' },
            { label: 'Rejected', count: metrics.rejected, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' }
          ].map((item, idx) => (
            <div key={idx} className={`p-5 rounded-2xl border ${item.bg} flex flex-col justify-between h-28`}>
              <div className="flex items-center justify-between">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-xs font-bold text-app-muted">KPI</span>
              </div>
              <div>
                <span className="text-2xl font-black font-display text-app-text block leading-none">{item.count}</span>
                <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block mt-1.5">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Multi-column Bento Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Opportunities, Applications, and Chart */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* PieChart Visualization of applications */}
          <div className="p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 space-y-3">
              <h3 className="text-base font-display font-black text-app-text">Pipeline Visualizer</h3>
              <p className="text-xs text-app-muted font-semibold leading-relaxed">
                Visualizing the current allocation and status percentage of your internal applications.
              </p>
              
              <div className="space-y-2 pt-2 text-[10px] font-bold text-app-muted">
                {chartData.map((data, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: data.color }} />
                    <span className="text-app-text truncate">{data.name}</span>
                    <span className="ml-auto font-mono">{data.value} apps</span>
                  </div>
                ))}
                {!hasChartData && (
                  <div className="text-[11px] text-app-muted italic py-1">
                    No active applications found. Open jobs are waiting!
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-7 h-52 relative flex items-center justify-center">
              {hasChartData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#090e1a', 
                        borderColor: '#2b2b3d',
                        borderRadius: '16px',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <Inbox className="w-10 h-10 text-app-muted/30 mb-2" />
                  <span className="text-xs font-bold text-app-muted uppercase tracking-wider">No Application Data</span>
                </div>
              )}
              {hasChartData && (
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black font-display text-app-text leading-none">{metrics.appliedJobs}</span>
                  <span className="text-[9px] font-bold text-app-muted uppercase tracking-widest mt-1">Total Apps</span>
                </div>
              )}
            </div>
          </div>

          {/* Featured internal opportunities (Latest 3) */}
          <div className="p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-display font-black text-app-text">Latest Opportunities</h3>
              <button 
                onClick={() => onNavigate('opportunities')}
                className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            {latestJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {latestJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="p-5 rounded-2xl bg-app-bg hover:bg-app-surface border border-app-border flex flex-col justify-between gap-4 group transition-all duration-300 hover:border-brand-blue/30"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-blue/10 border border-brand-blue/20 text-brand-blue">
                          {job.matchType}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-app-text leading-snug group-hover:text-brand-blue transition-colors line-clamp-1">{job.role}</h4>
                        <p className="text-[10px] text-app-muted font-bold mt-0.5">{job.team}</p>
                      </div>
                      <div className="flex flex-col gap-1 text-[10px] text-app-muted font-medium pt-1">
                        <span className="flex items-center gap-1.5">📍 {job.location}</span>
                        <span className="flex items-center gap-1.5">💼 {job.exp}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleApply(job.role)}
                      className="w-full py-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-[10px] rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-app-bg border border-app-border rounded-2xl">
                <p className="text-xs text-app-muted font-bold">No active opportunities found. Check back soon!</p>
              </div>
            )}
          </div>

          {/* Recent applications */}
          <div className="p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-display font-black text-app-text">Recent Applications</h3>
              <button 
                onClick={() => onNavigate('applications')}
                className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            {recentApps.length > 0 ? (
              <div className="space-y-3">
                {recentApps.map((app, id) => {
                  const s = app.status?.toLowerCase() || '';
                  const badgeColor = 
                    s === 'applied' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                    s === 'under_review' || s === 'under review' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                    s === 'shortlisted' || s === 'interview' ? 'bg-violet-500/10 border-violet-500/20 text-violet-500' :
                    s === 'offer' || s === 'selected' || s === 'joined' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                    'bg-red-500/10 border-red-500/20 text-red-500';

                  return (
                    <div key={id} className="p-3.5 rounded-2xl bg-app-bg border border-app-border flex items-center justify-between">
                      <div className="truncate pr-2">
                        <div className="text-xs font-extrabold text-app-text truncate">{app.role}</div>
                        <div className="text-[10px] text-app-muted font-bold mt-0.5">{app.team}</div>
                      </div>
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full whitespace-nowrap border ${badgeColor}`}>
                        {app.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-app-bg border border-app-border rounded-2xl">
                <p className="text-xs text-app-muted font-bold">You have not submitted any internal applications yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Profile Completion Gauge, missing fields & Corporate Activity log */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Resume Health & Profile Gauge */}
          <div className="p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow text-center flex flex-col items-center justify-between space-y-5">
            <h3 className="text-base font-display font-black text-app-text w-full text-left">Resume Health</h3>

            {/* Circular Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-app-border" />
                <circle 
                  cx="72" 
                  cy="72" 
                  r="62" 
                  stroke="currentColor" 
                  strokeWidth="10" 
                  fill="transparent" 
                  strokeDasharray="390" 
                  strokeDashoffset={390 - (390 * metrics.profileCompletion) / 100} 
                  className="text-emerald-500 transition-all duration-700" 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-display font-black text-app-text">{metrics.profileCompletion}%</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${metrics.profileCompletion > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {metrics.profileCompletion > 80 ? 'Good' : 'Incomplete'}
                </span>
              </div>
            </div>

            <div className="w-full text-left space-y-3 pt-2">
              <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-widest block leading-none">Missing Fields Checker:</span>
              
              <div className="space-y-2 pb-2">
                {[
                  { key: 'skills', label: 'Skills Set List' },
                  { key: 'experience', label: 'Corporate Experience' },
                  { key: 'linkedin', label: 'LinkedIn Profile' },
                  { key: 'github', label: 'GitHub Link' },
                  { key: 'about', label: 'Professional Summary / About' }
                ].map((item, idx) => {
                  const isComplete = profileData && profileData[item.key] && (Array.isArray(profileData[item.key]) ? profileData[item.key].length > 0 : Boolean(profileData[item.key]));
                  return (
                    <div key={idx} className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-xs font-bold text-app-text">{item.label}</span>
                      <span className="ml-auto text-[9px] font-black uppercase text-app-muted">
                        {isComplete ? '✓' : 'Missing'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={() => onNavigate('resume_builder')}
                className="w-full py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md active:scale-[0.98] uppercase tracking-wider cursor-pointer"
              >
                Update Resume
              </button>
            </div>
          </div>

          {/* Realtime Corporate Activity Feed */}
          <div className="p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-display font-black text-app-text">Corporate Feed</h3>
              <span className="text-[10px] bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-bold px-2 py-0.5 rounded-full uppercase">Realtime</span>
            </div>

            <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
              {activityList.slice(0, 5).map((act) => (
                <div key={act.id} className="flex gap-3 items-start text-xs border-b border-app-border/40 pb-3 last:border-b-0 last:pb-0">
                  <img 
                    src={act.avatar} 
                    alt={act.userName} 
                    className="w-8 h-8 rounded-full border border-app-border shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <p className="font-semibold text-app-text leading-tight">
                      <span className="font-bold text-brand-blue">{act.userName}</span> {act.action} <span className="font-bold">{act.subject}</span>
                    </p>
                    <span className="text-[10px] text-app-muted font-bold block">{act.time}</span>
                  </div>
                </div>
              ))}
              {activityList.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-xs text-app-muted italic font-bold">No internal corporate activities logged yet.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
