import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Eye, AlertCircle, Search, SlidersHorizontal, X, Clock, Calendar, CheckCircle2, FileCheck2, UserCheck, MessageSquare } from 'lucide-react';
import { db } from '../../../../firebase/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';

interface Application {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  employeeUid: string;
  employeeName: string;
  organizationId: string;
  recruiterUid?: string;
  status: string;
  timeline?: Array<{
    status: string;
    date: string;
    label: string;
    remarks?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  remarks?: string;
  department?: string;
}

const getStatusColor = (status: string) => {
  const s = status?.toLowerCase() || '';
  if (s === 'applied') return 'bg-blue-500/10 border-blue-500/20 text-blue-500';
  if (s === 'under_review' || s === 'under review') return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
  if (s === 'shortlisted') return 'bg-violet-500/10 border-violet-500/20 text-violet-500';
  if (s === 'interview') return 'bg-orange-500/10 border-orange-500/20 text-orange-500';
  if (s === 'offer' || s === 'selected' || s === 'joined') return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
  if (s === 'rejected') return 'bg-red-500/10 border-red-500/20 text-red-500';
  return 'bg-gray-500/10 border-gray-500/20 text-app-muted';
};

const getStatusLabel = (status: string) => {
  const s = status?.toLowerCase() || '';
  if (s === 'applied') return 'Applied';
  if (s === 'under_review' || s === 'under review') return 'Under Review';
  if (s === 'shortlisted') return 'Shortlisted';
  if (s === 'interview') return 'Interview';
  if (s === 'offer' || s === 'selected') return 'Selected';
  if (s === 'joined') return 'Joined';
  if (s === 'rejected') return 'Rejected';
  return status || 'Applied';
};

export default function EmployeeApplicationsTab() {
  const { userProfile } = useAuth();
  const [selectedStatusTab, setSelectedStatusTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    if (!userProfile?.organizationId || !userProfile?.uid) return;

    const appsCol = collection(db, 'organizations_companies', userProfile.organizationId, 'applications');
    const qApps = query(appsCol, where('employeeUid', '==', userProfile.uid));

    const unsubscribe = onSnapshot(qApps, (snapshot) => {
      const fetchedApps = snapshot.docs.map(snapDoc => {
        const data = snapDoc.data();
        return {
          applicationId: snapDoc.id,
          jobId: data.jobId || '',
          jobTitle: data.jobTitle || 'Unknown Job',
          employeeUid: data.employeeUid || '',
          employeeName: data.employeeName || '',
          organizationId: data.organizationId || '',
          recruiterUid: data.recruiterUid || '',
          status: data.status || 'Applied',
          timeline: data.timeline || [
            { status: 'Applied', date: data.createdAt || new Date().toISOString(), label: 'Applied' }
          ],
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
          remarks: data.remarks || data.recruiterRemarks || '',
          department: data.department || data.team || 'Engineering'
        } as Application;
      });

      setApplications(fetchedApps);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to applications:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userProfile?.organizationId, userProfile?.uid]);

  const statusMetrics = useMemo(() => {
    const counts = {
      All: applications.length,
      Applied: 0,
      'Under Review': 0,
      Shortlisted: 0,
      Interview: 0,
      Selected: 0,
      Joined: 0,
      Rejected: 0
    };

    applications.forEach(app => {
      const label = getStatusLabel(app.status);
      if (label in counts) {
        counts[label as keyof typeof counts]++;
      }
    });

    return [
      { label: 'All', count: counts.All },
      { label: 'Applied', count: counts.Applied },
      { label: 'Under Review', count: counts['Under Review'] },
      { label: 'Shortlisted', count: counts.Shortlisted },
      { label: 'Interview', count: counts.Interview },
      { label: 'Selected', count: counts.Selected + counts.Joined },
      { label: 'Rejected', count: counts.Rejected }
    ];
  }, [applications]);

  const filteredApps = useMemo(() => {
    let result = applications.filter(app => {
      const matchSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.department?.toLowerCase().includes(searchTerm.toLowerCase());

      if (selectedStatusTab === 'All') return matchSearch;
      
      const appLabel = getStatusLabel(app.status);
      if (selectedStatusTab === 'Selected') {
        return matchSearch && (appLabel === 'Selected' || appLabel === 'Joined');
      }
      return matchSearch && appLabel === selectedStatusTab;
    });

    return result.sort((a, b) => {
      if (sortOrder === 'Newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOrder === 'Oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortOrder === 'Job Title') {
        return a.jobTitle.localeCompare(b.jobTitle);
      }
      return 0;
    });
  }, [applications, selectedStatusTab, searchTerm, sortOrder]);

  const paginatedApps = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredApps.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredApps, currentPage]);

  const totalPages = Math.ceil(filteredApps.length / itemsPerPage) || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatusTab, searchTerm, sortOrder]);

  if (!userProfile?.organizationId) {
    return (
      <div className="p-8 text-center text-app-muted font-bold text-xs">
        Loading Corporate Workspace...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-black text-app-text">Applications</h2>
          <p className="text-xs text-app-muted mt-1 font-semibold">Track your internal job applications.</p>
        </div>

        {/* Real-time search & sort controllers */}
        <div className="flex flex-col sm:flex-row gap-2 max-w-md w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-app-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-brand-blue transition-colors"
            />
          </div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2.5 bg-app-surface border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none cursor-pointer hover:bg-app-bg"
          >
            <option value="Newest">Newest First</option>
            <option value="Oldest">Oldest First</option>
            <option value="Job Title">Job Title A-Z</option>
          </select>
        </div>
      </div>

      {/* Dynamic Status Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-app-border/40 pb-4">
        {statusMetrics.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setSelectedStatusTab(tab.label)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
              selectedStatusTab === tab.label
                ? 'bg-brand-blue text-white shadow-md'
                : 'bg-app-surface text-app-muted border border-app-border hover:text-app-text'
            }`}
          >
            <span className="mr-1">{tab.label}</span>
            <span className={`inline-flex items-center justify-center font-mono text-[9px] rounded-full px-1.5 py-0.5 ${
              selectedStatusTab === tab.label ? 'bg-white/25 text-white' : 'bg-app-bg text-app-muted border border-app-border'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Applications Table Card */}
      <div className="rounded-[32px] bg-app-surface border border-app-border card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border bg-app-bg/50">
                <th className="p-6 text-xs font-bold uppercase tracking-widest text-app-muted">Role</th>
                <th className="p-6 text-xs font-bold uppercase tracking-widest text-app-muted">Department</th>
                <th className="p-6 text-xs font-bold uppercase tracking-widest text-app-muted">Applied Date</th>
                <th className="p-6 text-xs font-bold uppercase tracking-widest text-app-muted">Status</th>
                <th className="p-6 text-xs font-bold uppercase tracking-widest text-app-muted text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-app-muted text-xs py-20 font-bold">
                    Loading your applications in real-time...
                  </td>
                </tr>
              ) : paginatedApps.length > 0 ? (
                paginatedApps.map((row) => (
                  <tr key={row.applicationId} className="hover:bg-app-bg/20 transition-all font-semibold animate-fade-in">
                    <td className="p-6">
                      <div className="font-display font-black text-app-text text-sm">{row.jobTitle}</div>
                      <div className="text-[10px] text-app-muted font-bold mt-0.5">Corporate Internal Posting</div>
                    </td>
                    <td className="p-6 text-xs text-app-text">{row.department}</td>
                    <td className="p-6 text-xs text-app-muted font-mono">
                      {new Date(row.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border tracking-wider ${getStatusColor(row.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{getStatusLabel(row.status)}</span>
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => setSelectedApp(row)}
                        className="p-2.5 border border-app-border rounded-xl bg-app-bg hover:bg-app-surface text-app-muted hover:text-app-text transition-colors cursor-pointer inline-flex items-center"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-app-muted text-sm py-20 font-bold">
                    <div className="w-12 h-12 bg-app-surface border border-app-border rounded-full flex items-center justify-center mx-auto mb-3 text-app-muted/60">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    No applications listed under the "{selectedStatusTab}" filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controllers */}
        {!loading && filteredApps.length > 0 && (
          <div className="flex justify-between items-center p-6 border-t border-app-border bg-app-bg/10">
            <span className="text-[11px] font-bold text-app-muted">
              Showing {Math.min(filteredApps.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredApps.length, currentPage * itemsPerPage)} of {filteredApps.length} applications
            </span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-app-border rounded-xl text-xs font-bold bg-app-surface text-app-muted disabled:opacity-50 cursor-pointer"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    currentPage === i + 1 ? 'bg-brand-blue text-white' : 'border border-app-border bg-app-surface text-app-muted'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-app-border rounded-xl text-xs font-bold bg-app-surface text-app-muted disabled:opacity-50 cursor-pointer"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Timeline Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-app-surface border border-app-border rounded-[32px] shadow-2xl p-6 md:p-8 overflow-hidden z-10"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase text-brand-blue tracking-widest">Internal Sourcing Portal</span>
                  <h3 className="text-xl font-display font-black text-app-text mt-1">{selectedApp.jobTitle}</h3>
                  <p className="text-xs text-app-muted font-bold mt-0.5">{selectedApp.department}</p>
                </div>
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="p-2 rounded-xl border border-app-border hover:bg-app-bg text-app-muted hover:text-app-text transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-app-bg/50 border border-app-border flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-blue" />
                  <span className="text-xs font-bold text-app-text">Current Application Status</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-black uppercase border tracking-wider ${getStatusColor(selectedApp.status)}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>{getStatusLabel(selectedApp.status)}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Timeline Progress */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-app-muted tracking-widest">Status History</h4>
                  <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-app-border">
                    {selectedApp.timeline && selectedApp.timeline.length > 0 ? (
                      selectedApp.timeline.map((event, idx) => (
                        <div key={idx} className="relative">
                          {/* Dot */}
                          <span className="absolute -left-[20px] top-1 w-3 h-3 rounded-full border-2 border-app-surface bg-brand-blue" />
                          <div className="space-y-1">
                            <div className="text-xs font-black text-app-text">{getStatusLabel(event.status)}</div>
                            <div className="flex items-center gap-1 text-[10px] text-app-muted font-mono">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(event.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            {event.remarks && (
                              <p className="text-[10px] text-app-text bg-app-bg/30 p-2 rounded-lg border border-app-border/40 font-semibold mt-1">
                                {event.remarks}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="relative">
                        <span className="absolute -left-[20px] top-1 w-3 h-3 rounded-full border-2 border-app-surface bg-brand-blue" />
                        <div className="space-y-1">
                          <div className="text-xs font-black text-app-text">Applied</div>
                          <div className="flex items-center gap-1 text-[10px] text-app-muted font-mono">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(selectedApp.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recruiter Remarks */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-app-muted tracking-widest">Sourcing Feedback</h4>
                  <div className="p-5 rounded-2xl border border-app-border bg-app-bg/30 h-full min-h-[140px] flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-app-text">
                        <MessageSquare className="w-4 h-4 text-app-muted" />
                        <span>Remarks / Instructions</span>
                      </div>
                      <p className="text-xs text-app-muted leading-relaxed font-semibold">
                        {selectedApp.remarks || "No comments from recruiter yet. Your application has been successfully filed in the ecosystem and is currently awaiting internal screening by the talent acquisition team."}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-app-border/40 text-[10px] font-bold text-app-muted flex items-center justify-between">
                      <span>Last Updated:</span>
                      <span className="font-mono">{new Date(selectedApp.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-6 mt-6 border-t border-app-border/60">
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="px-5 py-2.5 bg-app-bg hover:bg-app-border border border-app-border text-app-text font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

