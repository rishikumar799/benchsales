import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  CheckSquare, 
  CheckCircle, 
  AlertCircle, 
  Briefcase, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CandidateProfile } from '../pages/CandidatePoolTab';
import { db, auth, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';

interface SubmitProfileModalProps {
  candidate: CandidateProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (candidateName: string, jobTitle: string) => void;
}

export default function SubmitProfileModal({ 
  candidate, 
  isOpen, 
  onClose, 
  onSubmitSuccess 
}: SubmitProfileModalProps) {
  
  if (!isOpen || !candidate) return null;

  const [selectedJob, setSelectedJob] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [recruiterName, setRecruiterName] = useState('Rohit Kumar');
  const [candidateProfile, setCandidateProfile] = useState<any | null>(null);

  // Load real active jobs, current recruiter profile, and candidate details from Firestore
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // 1. Fetch Open Jobs from Firestore
    const qJobs = query(collection(db, 'marketplace_jobs'), where('status', '==', 'open'));
    getDocs(qJobs).then((snap) => {
      const list: any[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          title: data.title || 'N/A',
          company: data.company || data.companyName || 'N/A',
          companyId: data.companyId || 'company-default-id',
          bdm: data.bdm || 'John Mathew',
          bdmUid: data.bdmUid || data.assignedBdmUid || 'bdm-default-uid',
          ...data
        });
      });
      setJobs(list);
      if (list.length > 0) {
        setSelectedJob(`${list[0].title} - ${list[0].company}`);
      }
    }).catch(err => {
      console.error("Error loading open jobs in modal:", err);
    });

    // 2. Fetch Recruiter profile details from Firestore
    const recruiterRef = doc(db, 'marketplace_recruiters', user.uid);
    getDoc(recruiterRef).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRecruiterName(data?.profile?.fullName || user.displayName || 'Rohit Kumar');
      } else {
        setRecruiterName(user.displayName || 'Rohit Kumar');
      }
    }).catch(err => {
      console.warn("Recruiter profile not found, defaulting name:", err);
      setRecruiterName(user.displayName || 'Rohit Kumar');
    });

    // 3. Fetch Candidate's real profile from marketplace_jobseekers/{candidate.id}
    const candidateRef = doc(db, 'marketplace_jobseekers', candidate.id);
    getDoc(candidateRef).then((docSnap) => {
      if (docSnap.exists()) {
        setCandidateProfile(docSnap.data());
      }
    }).catch(err => {
      console.error("Error fetching full candidate profile:", err);
    });

  }, [candidate.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !selectedJob) return;
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setSubmitting(true);
    
    const [jobTitle, companyName] = selectedJob.split(' - ');
    const targetJob = jobs.find(j => j.title === jobTitle && j.company === companyName);
    
    if (targetJob) {
      // Use deterministic submission ID to enforce ONE submission per recruiter + candidate + job
      const subId = `sub_${currentUser.uid}_${candidate.id}_${targetJob.id}`;
      const submissionRef = doc(db, 'marketplace_submissions', subId);

      // Extract real email/phone from the database profile, if available
      const prof = candidateProfile?.profile || {};
      const candidateEmail = prof.email || candidateProfile?.email || candidate.id + '@example.com';
      const candidatePhone = prof.phone || prof.phoneNumber || candidateProfile?.phone || candidateProfile?.phoneNumber || 'N/A';

      const newSubmission = {
        submissionId: subId,
        id: subId, // for double compatibility
        jobId: targetJob.id,
        jobTitle: targetJob.title,
        candidateUid: candidate.id,
        candidateId: candidate.id, // for double compatibility
        candidateName: candidate.name,
        candidateEmail: candidateEmail,
        candidatePhone: candidatePhone,
        recruiterUid: currentUser.uid,
        recruiterName: recruiterName,
        submittedBy: recruiterName, // for double compatibility
        bdmUid: targetJob.bdmUid || targetJob.assignedBdmUid || 'bdm-default-uid',
        companyId: targetJob.companyId || 'company-default-id',
        companyName: targetJob.company || 'N/A',
        status: 'submitted', // lowercase as requested
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        candidateResume: `${candidate.name.replace(' ', '_')}_Resume.pdf`,
        submissionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        assignedBdm: targetJob.bdm || 'John Mathew',
        lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        notes: notes || 'Submitted directly from candidate profile.',
        timeline: [
          {
            action: 'Submitted',
            performedBy: recruiterName,
            performedByRole: 'Marketplace Recruiter',
            timestamp: new Date().toISOString()
          }
        ]
      };

      try {
        await setDoc(submissionRef, newSubmission);
        onSubmitSuccess(candidate.name, targetJob.title);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `marketplace_submissions/${subId}`);
      }
    }
    
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      
      <div className="w-full max-w-4xl bg-[#090D1A] border border-app-border rounded-[32px] overflow-hidden shadow-2xl animate-scale-up text-app-text">
        
        {/* Header */}
        <div className="h-16 border-b border-app-border/40 px-6 flex items-center justify-between bg-app-surface/20">
          <div>
            <h3 className="font-display font-extrabold text-lg text-app-text flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-blue" />
              Submit Candidate Profile
            </h3>
            <p className="text-[10px] text-app-muted font-semibold">Submit the selected candidate to a active job requirement.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-app-muted hover:text-app-text bg-app-surface/60 rounded-xl border border-app-border"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Main Grid split to match Image #5 */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-app-border/40">
            
            {/* Left Column: Candidate Overview (5 cols) */}
            <div className="md:col-span-5 p-8 space-y-6">
              <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Candidate to Submit</span>
              
              <div className="p-6 rounded-2xl bg-app-surface border border-app-border space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue text-sm font-extrabold font-mono shrink-0">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-app-text">{candidate.name}</h4>
                    <p className="text-xs text-app-muted mt-0.5">{candidate.experience} Experience</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-app-border/40 space-y-3 text-xs">
                  <div>
                    <span className="text-app-muted block">Experience</span>
                    <span className="font-bold text-app-text mt-0.5 block">{candidate.details.years} Years</span>
                  </div>
                  <div>
                    <span className="text-app-muted block">Current Company</span>
                    <span className="font-bold text-app-text mt-0.5 block">{candidate.details.currentCompany}</span>
                  </div>
                  <div>
                    <span className="text-app-muted block">Current Role</span>
                    <span className="font-bold text-app-text mt-0.5 block">{candidate.details.currentRole}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-3 border-t border-app-border/30">
                  {candidate.skills.map((skill, index) => (
                    <span key={index} className="text-[9px] font-mono font-semibold bg-app-bg px-2 py-0.5 rounded-md border border-app-border text-app-muted">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Submission details form (7 cols) */}
            <div className="md:col-span-7 p-8 space-y-6">
              
              {/* Select Job Field */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Select Job Requirement</label>
                <select 
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="w-full bg-app-surface border border-app-border rounded-xl p-3.5 text-sm font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none cursor-pointer"
                  required
                >
                  {jobs.map((job, idx) => {
                    const val = `${job.title} - ${job.company}`;
                    return <option key={idx} value={val}>{val}</option>;
                  })}
                </select>
                <p className="text-[10px] text-app-muted font-bold">Only open requirements with approved recruiter access are shown.</p>
              </div>

              {/* Notes Field */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Notes (Optional)</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about the candidate (strengths, comments, references etc.). This will be shared directly with the BDM."
                  maxLength={500}
                  className="w-full h-44 bg-app-surface border border-app-border rounded-xl p-4 text-xs font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none resize-none leading-relaxed"
                />
                <div className="flex justify-between items-center text-[10px] text-app-muted font-bold">
                  <span>Honesty assessment is recommended.</span>
                  <span>{notes.length}/500 letters</span>
                </div>
              </div>

            </div>

          </div>

          {/* Footer Controls */}
          <div className="h-18 border-t border-app-border/40 px-6 flex items-center justify-between bg-app-surface/10">
            <div className="flex items-center gap-1.5 text-[10px] text-app-muted font-bold uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-brand-blue" /> Secure submission tunnel
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-5 py-3 bg-app-surface border border-app-border text-app-text hover:bg-app-bg text-xs font-bold rounded-xl transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              
              <button 
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-brand-blue text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                {submitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting Profile...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Submit Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>

    </div>
  );
}