import { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  CheckCircle, 
  XSquare, 
  HelpCircle, 
  Clock, 
  AlertCircle,
  FileSpreadsheet,
  Eye,
  Briefcase,
  User,
  Activity,
  X,
  FileText,
  MapPin,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { recruiterStorage, CandidateSubmission, RecruiterJob, RecruiterCandidate } from '../utils/recruiterStorage';

interface SubmissionsTabProps {
  onAddLogMessage?: (msg: string) => void;
}

export default function SubmissionsTab({ onAddLogMessage }: SubmissionsTabProps) {
  
  const [submissions, setSubmissions] = useState<CandidateSubmission[]>([]);
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [candidates, setCandidates] = useState<RecruiterCandidate[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [jobFilter, setJobFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [exporting, setExporting] = useState(false);

  // Modal View States
  const [previewResumePath, setPreviewResumePath] = useState<string | null>(null);
  const [selectedJobDetails, setSelectedJobDetails] = useState<RecruiterJob | null>(null);
  const [selectedCandidateDetails, setSelectedCandidateDetails] = useState<RecruiterCandidate | null>(null);
  const [trackedSubmission, setTrackedSubmission] = useState<CandidateSubmission | null>(null);

  // Load from localStorage on mount and sync
  const loadData = () => {
    setSubmissions(recruiterStorage.getSubmissions());
    setJobs(recruiterStorage.getJobs());
    setCandidates(recruiterStorage.getCandidates());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  // Export report simulation
  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      alert('ARYX AI: Submissions report exported successfully as CSV/Excel format to local downloads!');
    }, 1500);
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sub.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesJob = jobFilter === 'All' || sub.jobTitle === jobFilter;
    const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;

    return matchesSearch && matchesJob && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text font-display">Submissions</h1>
          <p className="text-app-muted mt-1">Track and manage candidate submissions with real-time status updates.</p>
        </div>
        <button 
          onClick={handleExport}
          className="px-5 py-3.5 bg-brand-blue/10 hover:bg-brand-blue/15 text-brand-blue font-extrabold rounded-2xl flex items-center gap-2 text-xs transition-all active:scale-95 shrink-0 border border-brand-blue/20"
        >
          {exporting ? (
            <>
              <span className="w-4 h-4 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Export Report
            </>
          )}
        </button>
      </div>

      {/* Filters bar */}
      <div className="p-4 rounded-2xl glass border border-app-border flex flex-col xl:flex-row gap-4 items-center justify-between">
        
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search by Submission ID, Candidate Name or Job Title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          {/* Job Filter */}
          <select 
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-4 py-3 text-xs font-semibold text-app-text outline-none cursor-pointer flex-1"
          >
            <option value="All">All Jobs (All)</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Java Developer">Java Developer</option>
            <option value="QA Engineer">QA Engineer</option>
          </select>

          {/* Status Filter */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-4 py-3 text-xs font-semibold text-app-text outline-none cursor-pointer flex-1"
          >
            <option value="All">All Statuses (All)</option>
            <option value="Submitted">Submitted</option>
            <option value="In Review">In Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
            <option value="Joined">Joined</option>
          </select>
        </div>

      </div>

      {/* Submissions table */}
      <div className="p-6 rounded-[28px] glass border border-app-border card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-app-border text-[11px] font-extrabold text-app-muted uppercase tracking-wider">
                <th className="py-4 px-3">Submission ID</th>
                <th className="py-4 px-3">Job ID</th>
                <th className="py-4 px-3">Job Title</th>
                <th className="py-4 px-3">Candidate Name</th>
                <th className="py-4 px-3">Candidate Resume</th>
                <th className="py-4 px-3">Submission Date</th>
                <th className="py-4 px-3">Submitted By</th>
                <th className="py-4 px-3">Assigned BDM</th>
                <th className="py-4 px-3">Current Status</th>
                <th className="py-4 px-3">Last Updated</th>
                <th className="py-4 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40 text-sm">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub) => {
                  
                  // Style configurations
                  let pillStyle = '';
                  if (sub.status === 'Submitted') pillStyle = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                  else if (sub.status === 'In Review') pillStyle = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
                  else if (sub.status === 'Shortlisted') pillStyle = 'bg-teal-500/10 text-teal-500 border-teal-500/20';
                  else if (sub.status === 'Interview') pillStyle = 'bg-violet-500/10 text-violet-500 border-violet-500/20';
                  else if (sub.status === 'Selected') pillStyle = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
                  else if (sub.status === 'Rejected') pillStyle = 'bg-red-500/10 text-red-500 border-red-500/20';
                  else if (sub.status === 'Joined') pillStyle = 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';

                  return (
                    <tr key={sub.id} className="hover:bg-app-surface/30 transition-colors">
                      {/* Submission ID */}
                      <td className="py-4 px-3 font-mono font-bold text-xs text-brand-blue">{sub.id}</td>
                      
                      {/* Job ID */}
                      <td className="py-4 px-3 font-mono text-xs text-app-muted">{sub.jobId.toUpperCase()}</td>
                      
                      {/* Job Title */}
                      <td className="py-4 px-3">
                        <button 
                          onClick={() => {
                            const matchingJob = jobs.find(j => j.id === sub.jobId);
                            setSelectedJobDetails(matchingJob || {
                              id: sub.jobId,
                              title: sub.jobTitle,
                              company: sub.companyName,
                              experience: '3-5 Years',
                              skills: ['React', 'TypeScript'],
                              location: 'Bangalore',
                              positions: 'N/A',
                              priority: 'Medium',
                              posted: 'Posted recently',
                              bdm: sub.assignedBdm,
                              jobType: 'open',
                              accessStatus: 'approved'
                            });
                          }}
                          className="font-bold text-app-text text-left hover:text-brand-blue hover:underline"
                        >
                          {sub.jobTitle}
                        </button>
                        <span className="block text-[10px] text-app-muted font-semibold mt-0.5">{sub.companyName}</span>
                      </td>

                      {/* Candidate Name */}
                      <td className="py-4 px-3">
                        <button 
                          onClick={() => {
                            const matchingCand = candidates.find(c => c.id === sub.candidateId);
                            setSelectedCandidateDetails(matchingCand || {
                              id: sub.candidateId,
                              name: sub.candidateName,
                              experience: '4 Years',
                              skills: ['React', 'Node.js'],
                              availability: 'Available',
                              details: {
                                role: 'Software Engineer',
                                skillsFull: ['React', 'Node.js', 'Express', 'MongoDB'],
                                years: 4,
                                currentCompany: 'Tech Solutions Inc',
                                currentRole: 'Software Engineer',
                                availabilityDetails: 'Available'
                              }
                            });
                          }}
                          className="font-bold text-app-text hover:text-brand-violet transition-colors flex items-center gap-1.5"
                        >
                          {sub.candidateName}
                        </button>
                      </td>

                      {/* Candidate Resume */}
                      <td className="py-4 px-3">
                        <button 
                          onClick={() => setPreviewResumePath(sub.candidateResume)}
                          className="inline-flex items-center gap-1.5 text-xs text-brand-blue hover:underline font-semibold"
                        >
                          <FileText className="w-3.5 h-3.5" /> PDF
                        </button>
                      </td>

                      {/* Submission Date */}
                      <td className="py-4 px-3 font-semibold text-app-text text-xs font-mono">{sub.submissionDate}</td>

                      {/* Submitted By */}
                      <td className="py-4 px-3 text-xs font-semibold text-app-text">{sub.submittedBy || 'Rohit Kumar'}</td>

                      {/* Assigned BDM */}
                      <td className="py-4 px-3 text-xs font-bold text-app-muted">{sub.assignedBdm}</td>

                      {/* Current Status */}
                      <td className="py-4 px-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full border ${pillStyle}`}>
                          {sub.status}
                        </span>
                      </td>

                      {/* Last Updated */}
                      <td className="py-4 px-3 font-semibold text-app-text text-xs font-mono">{sub.lastUpdated || sub.submissionDate}</td>

                      {/* Actions */}
                      <td className="py-4 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => setPreviewResumePath(sub.candidateResume)}
                            className="p-1.5 bg-app-surface border border-app-border rounded-lg text-app-muted hover:text-brand-blue"
                            title="Preview Resume"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          <button 
                            onClick={() => {
                              const matchingJob = jobs.find(j => j.id === sub.jobId);
                              setSelectedJobDetails(matchingJob || {
                                id: sub.jobId,
                                title: sub.jobTitle,
                                company: sub.companyName,
                                experience: '3-5 Years',
                                skills: ['React', 'TypeScript'],
                                location: 'Bangalore',
                                positions: 'N/A',
                                priority: 'Medium',
                                posted: 'Posted recently',
                                bdm: sub.assignedBdm,
                                jobType: 'open',
                                accessStatus: 'approved'
                              });
                            }}
                            className="p-1.5 bg-app-surface border border-app-border rounded-lg text-app-muted hover:text-brand-violet"
                            title="View Job"
                          >
                            <Briefcase className="w-3.5 h-3.5" />
                          </button>

                          <button 
                            onClick={() => {
                              const matchingCand = candidates.find(c => c.id === sub.candidateId);
                              setSelectedCandidateDetails(matchingCand || {
                                id: sub.candidateId,
                                name: sub.candidateName,
                                experience: '4 Years',
                                skills: ['React', 'Node.js'],
                                availability: 'Available',
                                details: {
                                  role: 'Software Engineer',
                                  skillsFull: ['React', 'Node.js', 'Express', 'MongoDB'],
                                  years: 4,
                                  currentCompany: 'Tech Solutions Inc',
                                  currentRole: 'Software Engineer',
                                  availabilityDetails: 'Available'
                                }
                              });
                            }}
                            className="p-1.5 bg-app-surface border border-app-border rounded-lg text-app-muted hover:text-brand-violet"
                            title="View Candidate"
                          >
                            <User className="w-3.5 h-3.5" />
                          </button>

                          <button 
                            onClick={() => setTrackedSubmission(sub)}
                            className="px-2.5 py-1.5 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue rounded-lg text-xs font-extrabold flex items-center gap-1"
                            title="Track Status"
                          >
                            <Activity className="w-3 h-3" /> Track
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-app-muted">
                    <AlertCircle className="w-10 h-10 text-app-muted mx-auto mb-3" />
                    <p className="font-semibold text-app-text text-sm">No submissions matched active filters</p>
                    <p className="text-xs text-app-muted mt-1">Refine your search keywords.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination component */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-2">
        <button className="p-2 border border-app-border rounded-xl text-app-muted hover:text-app-text bg-app-surface hover:bg-app-surface/80 text-xs">
          {'<'}
        </button>
        <button className="w-8 h-8 rounded-xl font-bold bg-brand-blue text-white text-xs">1</button>
        <button className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">2</button>
        <span className="text-app-muted px-1 text-xs">...</span>
        <button className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">5</button>
        <button className="p-2 border border-app-border rounded-xl text-app-muted hover:text-app-text bg-app-surface hover:bg-app-surface/80 text-xs">
          {'>'}
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* POPUP A: PREVIEW RESUME */}
      {/* ---------------------------------------------------- */}
      {previewResumePath && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#090D1A] border border-app-border rounded-3xl overflow-hidden shadow-2xl animate-scale-up text-app-text">
            
            <div className="h-16 border-b border-app-border/40 px-6 flex items-center justify-between bg-app-surface/20">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-blue" />
                <h3 className="font-display font-extrabold text-base text-app-text">
                  Resume Preview - {previewResumePath.replace('_Resume.pdf', '').replace('_', ' ')}
                </h3>
              </div>
              <button 
                onClick={() => setPreviewResumePath(null)}
                className="p-2 text-app-muted hover:text-app-text bg-app-surface/60 rounded-xl border border-app-border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* High Fidelity Resume Frame */}
              <div className="p-6 rounded-2xl bg-white text-slate-900 shadow-inner font-sans space-y-4 text-xs">
                <div className="border-b-2 border-slate-800 pb-3">
                  <h1 className="text-xl font-black uppercase tracking-wide text-slate-800">
                    {previewResumePath.replace('_Resume.pdf', '').replace('_', ' ')}
                  </h1>
                  <p className="font-bold text-slate-600 mt-0.5">Senior Technical Consultant • Bangalore, India • rohit@aryaxai.com</p>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-800 uppercase border-b border-slate-300 pb-1 mb-2">Professional Summary</h3>
                  <p className="leading-relaxed text-slate-700 font-semibold">
                    Dynamic, result-oriented Software Professional with 4+ years of comprehensive developer experience specializing in responsive web applications, secure cloud backend endpoints and modern UI component frameworks.
                  </p>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-800 uppercase border-b border-slate-300 pb-1 mb-2">Core Skills</h3>
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    {['React', 'Next.js', 'Node.js', 'TypeScript', 'AWS Cloud', 'Docker Containerization', 'MongoDB', 'PostgreSQL'].map((sk, sIdx) => (
                      <span key={sIdx} className="bg-slate-100 text-slate-800 font-bold px-2 py-1 rounded border border-slate-200">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-800 uppercase border-b border-slate-300 pb-1 mb-2">Professional Experience</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Lead UI Engineer - Tech Solutions Pvt Ltd</span>
                        <span>2024 - Present</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed mt-1">
                        - Spearheaded transition of monolithic dashboard layouts to highly modular, reusable React + Vite frameworks.<br/>
                        - Optimized client-side page load by 40% using code splitting, memoization and responsive image lazy-loading patterns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-16 border-t border-app-border/40 px-6 flex items-center justify-end bg-app-surface/20">
              <button 
                onClick={() => setPreviewResumePath(null)}
                className="px-5 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* POPUP B: VIEW JOB DETAILS */}
      {/* ---------------------------------------------------- */}
      {selectedJobDetails && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#090D1A] border border-app-border rounded-3xl overflow-hidden shadow-2xl animate-scale-up text-app-text">
            
            <div className="h-16 border-b border-app-border/40 px-6 flex items-center justify-between bg-app-surface/20">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-blue" />
                <h3 className="font-display font-extrabold text-base text-app-text">Job Details</h3>
              </div>
              <button 
                onClick={() => setSelectedJobDetails(null)}
                className="p-2 text-app-muted hover:text-app-text bg-app-surface/60 rounded-xl border border-app-border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-display font-black text-xl text-app-text">{selectedJobDetails.title}</h4>
                <p className="text-xs text-brand-blue font-bold mt-1">{selectedJobDetails.company} • {selectedJobDetails.location}</p>
              </div>

              <div className="p-4 rounded-xl bg-app-surface border border-app-border space-y-3 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-app-muted">Experience Requirement:</span>
                  <span className="text-app-text">{selectedJobDetails.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-app-muted">Positions Available:</span>
                  <span className="text-app-text">{selectedJobDetails.positions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-app-muted">Priority:</span>
                  <span className="text-brand-violet">{selectedJobDetails.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-app-muted">Assigned BDM:</span>
                  <span className="text-app-text">{selectedJobDetails.bdm}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-bold text-app-muted uppercase tracking-wider">Required Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJobDetails.skills.map((sk, idx) => (
                    <span key={idx} className="text-xs font-mono font-bold bg-app-bg px-2.5 py-1 rounded-lg border border-app-border text-app-text">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-16 border-t border-app-border/40 px-6 flex items-center justify-end bg-app-surface/20">
              <button 
                onClick={() => setSelectedJobDetails(null)}
                className="px-5 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* POPUP C: VIEW CANDIDATE PROFILE */}
      {/* ---------------------------------------------------- */}
      {selectedCandidateDetails && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#090D1A] border border-app-border rounded-3xl overflow-hidden shadow-2xl animate-scale-up text-app-text">
            
            <div className="h-16 border-b border-app-border/40 px-6 flex items-center justify-between bg-app-surface/20">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-brand-blue" />
                <h3 className="font-display font-extrabold text-base text-app-text">Candidate Profile Overview</h3>
              </div>
              <button 
                onClick={() => setSelectedCandidateDetails(null)}
                className="p-2 text-app-muted hover:text-app-text bg-app-surface/60 rounded-xl border border-app-border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue text-lg font-extrabold font-mono shrink-0">
                  {selectedCandidateDetails.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-display font-black text-lg text-app-text">{selectedCandidateDetails.name}</h4>
                  <p className="text-xs text-app-muted mt-0.5">{selectedCandidateDetails.details.role} • {selectedCandidateDetails.experience} Experience</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-app-surface border border-app-border space-y-3 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-app-muted">Current Company:</span>
                  <span className="text-app-text">{selectedCandidateDetails.details.currentCompany}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-app-muted">Current Designation:</span>
                  <span className="text-app-text">{selectedCandidateDetails.details.currentRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-app-muted">Notice Period:</span>
                  <span className="text-emerald-500 font-bold">{selectedCandidateDetails.details.availabilityDetails}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-bold text-app-muted uppercase tracking-wider">Complete Skillset Index</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidateDetails.details.skillsFull.map((sk, idx) => (
                    <span key={idx} className="text-xs font-mono font-bold bg-app-bg px-2.5 py-1 rounded-lg border border-app-border text-app-text">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-16 border-t border-app-border/40 px-6 flex items-center justify-end bg-app-surface/20">
              <button 
                onClick={() => setSelectedCandidateDetails(null)}
                className="px-5 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* POPUP D: TRACK STATUS (TIMELINE PROGRESS DIALOG) */}
      {/* ---------------------------------------------------- */}
      {trackedSubmission && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#090D1A] border border-app-border rounded-3xl overflow-hidden shadow-2xl animate-scale-up text-app-text">
            
            <div className="h-16 border-b border-app-border/40 px-6 flex items-center justify-between bg-app-surface/20">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand-blue" />
                <h3 className="font-display font-extrabold text-base text-app-text">Track Submission Status</h3>
              </div>
              <button 
                onClick={() => setTrackedSubmission(null)}
                className="p-2 text-app-muted hover:text-app-text bg-app-surface/60 rounded-xl border border-app-border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Context bar */}
              <div className="p-4 rounded-xl bg-app-surface/80 border border-app-border flex justify-between items-center text-xs font-semibold">
                <div>
                  <span className="text-app-muted block text-[10px] uppercase tracking-wider">Candidate</span>
                  <span className="text-app-text font-extrabold text-sm">{trackedSubmission.candidateName}</span>
                </div>
                <div className="text-right">
                  <span className="text-app-muted block text-[10px] uppercase tracking-wider">Submission ID</span>
                  <span className="text-brand-blue font-mono font-bold">{trackedSubmission.id}</span>
                </div>
              </div>

              {/* Status lifecycle timeline */}
              <div className="space-y-4">
                <span className="block text-xs font-bold text-app-muted uppercase tracking-wider">Lifecycle Tracking</span>
                
                <div className="relative border-l-2 border-app-border ml-4 pl-6 space-y-5 py-2">
                  
                  {[
                    { label: 'Submitted', desc: `Profile submitted successfully by ${trackedSubmission.submittedBy}`, date: trackedSubmission.submissionDate, passed: true },
                    { label: 'In Review', desc: 'BDM and company screening team analyzing credentials', date: trackedSubmission.lastUpdated, passed: ['In Review', 'Shortlisted', 'Interview', 'Selected', 'Joined'].includes(trackedSubmission.status) },
                    { label: 'Shortlisted', desc: 'Candidate flagged for active tech screen schedule', date: trackedSubmission.lastUpdated, passed: ['Shortlisted', 'Interview', 'Selected', 'Joined'].includes(trackedSubmission.status) },
                    { label: 'Interview', desc: 'Technical rounds/client loops in progress', date: '-', passed: ['Interview', 'Selected', 'Joined'].includes(trackedSubmission.status) },
                    { label: 'Selected', desc: 'Offer release process initiated', date: '-', passed: ['Selected', 'Joined'].includes(trackedSubmission.status) },
                    { label: 'Joined', desc: 'Onboarding finalized', date: '-', passed: trackedSubmission.status === 'Joined' }
                  ].map((step, idx) => {
                    const isActive = trackedSubmission.status === step.label;
                    return (
                      <div key={idx} className="relative">
                        {/* Timeline bubble */}
                        <div className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-app-bg flex items-center justify-center ${
                          isActive 
                            ? 'bg-brand-blue ring-4 ring-brand-blue/20 animate-pulse' 
                            : step.passed 
                            ? 'bg-emerald-500' 
                            : 'bg-app-surface border-app-border'
                        }`} />
                        
                        <div className={step.passed || isActive ? 'opacity-100' : 'opacity-40'}>
                          <div className="flex justify-between items-center text-xs font-extrabold">
                            <span className={isActive ? 'text-brand-blue text-sm' : step.passed ? 'text-app-text' : 'text-app-muted'}>
                              {step.label}
                            </span>
                            <span className="text-[10px] font-mono text-app-muted font-normal">{step.date}</span>
                          </div>
                          <p className="text-[11px] text-app-muted mt-0.5 font-semibold">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                  
                </div>
              </div>

            </div>

            <div className="h-16 border-t border-app-border/40 px-6 flex items-center justify-end bg-app-surface/20">
              <button 
                onClick={() => setTrackedSubmission(null)}
                className="px-5 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
