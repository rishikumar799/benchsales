import { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Briefcase, 
  Search, 
  SlidersHorizontal,
  AlertCircle
} from 'lucide-react';
import { auth, db } from '../../../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  doc, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';

export default function PendingRequestsTab() {
  const [requests, setRequests] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Listen to open marketplace_jobs
        const qJobs = query(collection(db, 'marketplace_jobs'), where('status', '==', 'open'));
        const unsubJobs = onSnapshot(qJobs, (snapshot) => {
          const list: any[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() });
          });
          setJobs(list);
        }, (err) => {
          console.error("Jobs sync error:", err);
          setLoading(false);
        });
        return unsubJobs;
      } else {
        setJobs([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      setLoading(false);
      return;
    }
    if (jobs.length === 0) {
      setLoading(false);
      return;
    }

    const requestsMap = new Map<string, any>();
    const unsubs = jobs.map(job => {
      const docRef = doc(db, 'marketplace_jobs', job.id, 'access_requests', currentUid);
      return onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          requestsMap.set(job.id, {
            id: snapshot.id,
            jobId: job.id,
            jobTitle: job.title || data.jobTitle || 'Untitled Job',
            recruiterUid: currentUid,
            recruiterName: data.recruiterName || 'Recruiter Partner',
            status: data.status || 'pending',
            requestedAt: data.requestedAt || null,
            bdm: job.bdm || job.bdmName || data.bdmName || data.bdm || 'John Mathew'
          });
        } else {
          requestsMap.delete(job.id);
        }

        // Update requests list
        const list = Array.from(requestsMap.values());
        list.sort((a, b) => {
          const timeA = a.requestedAt ? new Date(a.requestedAt).getTime() : 0;
          const timeB = b.requestedAt ? new Date(b.requestedAt).getTime() : 0;
          return timeB - timeA;
        });
        setRequests(list);
        setLoading(false);
      }, (err) => {
        console.error(`Error syncing request for job ${job.id}:`, err);
      });
    });

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [jobs]);

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Normalize status strings
    const normStatus = req.status.toLowerCase();
    let matchesStatus = true;
    if (statusFilter !== 'All') {
      if (statusFilter === 'Pending') matchesStatus = normStatus === 'pending';
      if (statusFilter === 'Approved') matchesStatus = normStatus === 'approved';
      if (statusFilter === 'Rejected') matchesStatus = normStatus === 'rejected' || normStatus === 'declined';
    }

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-app-muted text-sm font-semibold">Syncing with Firestore...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-app-text">Pending Requests</h1>
        <p className="text-app-muted mt-1">Track the status of your access requests to restrict requirements in the marketplace.</p>
      </div>

      {/* Grid Filter Bar */}
      <div className="p-4 rounded-2xl glass border border-app-border space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
            <input 
              type="text" 
              placeholder="Search by job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
            <div className="flex items-center gap-1.5 bg-app-surface border border-app-border px-3 py-2 rounded-xl text-xs font-semibold">
              <SlidersHorizontal className="w-3.5 h-3.5 text-app-muted" />
              <span className="text-app-muted">Filters:</span>
            </div>

            {/* Status */}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-app-surface border border-app-border rounded-xl px-3 py-2 text-xs font-semibold text-app-text focus:border-brand-blue outline-none cursor-pointer"
            >
              <option value="All">Status (All)</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

        </div>
      </div>

      {/* Requests Grid */}
      {filteredRequests.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-app-surface border border-app-border">
          <AlertCircle className="w-12 h-12 text-app-muted mx-auto mb-4" />
          <h3 className="font-display font-bold text-lg text-app-text">No Requests Found</h3>
          <p className="text-app-muted text-sm mt-1">There are no access requests currently matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => {
            const statusLower = req.status.toLowerCase();
            const isApproved = statusLower === 'approved';
            const isPending = statusLower === 'pending';
            const isRejected = statusLower === 'rejected' || statusLower === 'declined';

            return (
              <div 
                key={req.id} 
                className="p-6 rounded-[28px] bg-app-surface border border-app-border/80 hover:border-brand-blue/30 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-xl relative"
              >
                {/* Top Row */}
                <div className="flex justify-between items-start">
                  <div className="p-3.5 rounded-2xl bg-brand-blue/10 text-brand-blue shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isApproved && (
                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    )}
                    {isPending && (
                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                    {isRejected && (
                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & metadata */}
                <div className="space-y-1">
                  <h3 className="text-lg font-display font-black text-app-text tracking-tight">
                    {req.jobTitle}
                  </h3>
                  <div className="text-xs font-bold text-app-muted">
                    <span>BDM Owner: </span>
                    <span className="text-app-text">{req.bdm}</span>
                  </div>
                </div>

                {/* Timeline / Dates */}
                <div className="pt-2 border-t border-app-border/40 text-xs font-semibold text-app-muted flex justify-between items-center">
                  <span>Requested On:</span>
                  <span className="text-app-text">
                    {req.requestedAt 
                      ? new Date(req.requestedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
                      : 'N/A'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
