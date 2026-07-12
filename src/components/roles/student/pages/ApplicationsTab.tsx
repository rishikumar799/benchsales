import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Calendar, 
  FileText, 
  ArrowUpRight, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle,
  AlertCircle
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';

export default function ApplicationsTab() {
  const { userProfile } = useAuth();
  const studentId = userProfile?.uid;
  const organizationId = userProfile?.organizationId;

  const [activeFilter, setActiveFilter] = useState('All');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Listen to Applications subcollection in real-time
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
      // Sort by updatedAt descending
      list.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
      
      setApplications(list.map(app => ({
        company: app.companyName || 'Company',
        role: app.opportunityTitle || 'Software Engineer',
        type: 'Campus Drive',
        date: app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently',
        status: app.status || 'applied',
        remarks: app.remarks || ''
      })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `organizations_universities/${organizationId}/applications`);
    });

    return () => unsubscribe();
  }, [organizationId, studentId]);

  const getDisplayStatus = (status: string) => {
    switch (status) {
      case 'applied': return 'Applied';
      case 'under_review': return 'Under Review';
      case 'shortlisted': return 'Shortlisted';
      case 'interview': return 'Interview Scheduled';
      case 'selected': return 'Selected';
      case 'rejected': return 'Rejected';
      case 'placed': return 'Placed';
      default: return status;
    }
  };

  const filters = [
    { id: 'All', label: `All (${applications.length})` },
    { id: 'Applied', label: `Applied (${applications.filter(a => getDisplayStatus(a.status) === 'Applied').length})` },
    { id: 'Under Review', label: `Under Review (${applications.filter(a => getDisplayStatus(a.status) === 'Under Review').length})` },
    { id: 'Shortlisted', label: `Shortlisted (${applications.filter(a => getDisplayStatus(a.status) === 'Shortlisted').length})` },
    { id: 'Interview Scheduled', label: `Interview Scheduled (${applications.filter(a => getDisplayStatus(a.status) === 'Interview Scheduled').length})` },
    { id: 'Selected', label: `Selected (${applications.filter(a => getDisplayStatus(a.status) === 'Selected' || getDisplayStatus(a.status) === 'Placed').length})` },
    { id: 'Rejected', label: `Rejected (${applications.filter(a => getDisplayStatus(a.status) === 'Rejected').length})` },
  ];

  const getStatusStyle = (status: string) => {
    const dStatus = getDisplayStatus(status);
    switch (dStatus) {
      case 'Interview Scheduled':
        return 'bg-violet-500/10 text-violet-500 border border-violet-500/20';
      case 'Shortlisted':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'Under Review':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'Applied':
        return 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20';
      case 'Selected':
      case 'Placed':
        return 'bg-green-500/10 text-green-500 border border-green-500/20';
      case 'Rejected':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
    }
  };

  const filteredApps = applications.filter((app) => {
    if (activeFilter === 'All') return true;
    const dStatus = getDisplayStatus(app.status);
    if (activeFilter === 'Interview Scheduled' && dStatus === 'Interview Scheduled') return true;
    if (activeFilter === 'Selected' && (dStatus === 'Selected' || dStatus === 'Placed')) return true;
    return dStatus === activeFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-display font-bold text-app-text">Applications</h2>
        <p className="text-app-muted">Track your job applications and their live status.</p>
      </div>

      {/* Horizontal filter tabs matching Column 5 exactly */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-app-border/40">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === f.id 
                ? 'bg-brand-blue text-white shadow-md' 
                : 'text-app-muted hover:text-app-text hover:bg-app-surface/60'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Main Table View */}
      <div className="glass border-app-border rounded-[28px] overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border/40 bg-app-surface/20">
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted pl-6">Company</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Applied Role</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Application Type</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Applied On</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Status</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40">
              {filteredApps.length > 0 ? (
                filteredApps.map((app, index) => (
                  <tr key={index} className="hover:bg-app-surface/30 transition-colors">
                    {/* Company Column */}
                    <td className="p-4.5 pl-6 font-semibold text-app-text-active flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-display font-bold text-xs shrink-0">
                        {app.company ? app.company.substring(0, 3).toUpperCase() : 'JOB'}
                      </div>
                      <div>
                        <span className="font-extrabold text-sm">{app.company}</span>
                      </div>
                    </td>

                    {/* Applied Role Column */}
                    <td className="p-4.5 text-sm font-bold text-app-text">
                      {app.role}
                    </td>

                    {/* Application Type Column */}
                    <td className="p-4.5 text-xs font-bold text-app-muted">
                      <span className="bg-app-bg text-app-muted px-2.5 py-1 rounded-md border border-app-border">
                        {app.type}
                      </span>
                    </td>

                    {/* Applied On Column */}
                    <td className="p-4.5 text-xs font-semibold text-app-muted">
                      {app.date}
                    </td>

                    {/* Status Column */}
                    <td className="p-4.5 text-xs font-bold">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wide font-extrabold ${getStatusStyle(app.status)}`}>
                        {getDisplayStatus(app.status)}
                      </span>
                    </td>

                    {/* Action Column */}
                    <td className="p-4.5 text-right pr-6">
                      <button 
                        onClick={() => alert(`Reviewing application status details for ${app.role} drive with ${app.company}.\nCurrent status is: ${getDisplayStatus(app.status)}.\nRemarks: ${app.remarks || "No remarks from Placement Officer yet."}`)}
                        className="px-3.5 py-2 hover:bg-brand-blue hover:text-white transition-all text-xs font-bold bg-app-surface border border-app-border rounded-lg text-app-text"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-app-muted text-sm font-semibold">
                    {loading ? "Loading applications..." : "No applications tracked in this category yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
