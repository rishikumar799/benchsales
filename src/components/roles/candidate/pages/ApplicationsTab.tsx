import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  Clock, 
  CheckCircle, 
  ExternalLink, 
  Briefcase, 
  Search,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  X,
  Download,
  Eye,
  FileText,
  Check
} from 'lucide-react';

interface SubmittedApplication {
  role: string;
  company: string;
  time: string;
  status: string;
  color: string;
  jobId: string;
  resumeName: string;
  jobDescription: string;
  logoBg?: string;
  logo?: string;
}

export default function ApplicationsTab() {
  const [activeSubTab, setActiveSubTab] = useState('All');
  const [selectedApplication, setSelectedApplication] = useState<SubmittedApplication | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [showResumeInline, setShowResumeInline] = useState(false);

  const subTabs = [
    { id: 'Today', label: 'Applied Today' },
    { id: 'Week', label: 'Applied This Week' },
    { id: 'Month', label: 'Applied This Month' },
    { id: 'All', label: 'All Applications' }
  ];

  const [applications, setApplications] = useState<SubmittedApplication[]>(() => {
    const saved = localStorage.getItem('aryx_submitted_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    
    // Default seed data with complete jobs descriptions and resumes
    const defaults = [
      { 
        role: 'Frontend Developer', 
        company: 'Google', 
        time: '2 hours ago', 
        status: 'Applied', 
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        jobId: 'job-1',
        resumeName: 'Primary Resume (from Resume Builder)',
        jobDescription: `Google is looking for a talented Frontend Developer to join our Core Developer Platforms and Chrome UX team. In this role, you will build next-generation user interfaces that are fast, accessible, and delight millions of users.\n\nKey Responsibilities:\n- Design, implement, and maintain highly responsive web interfaces using React, TypeScript, and modern front-end tooling.\n- Optimize web applications for maximum speed, responsiveness, cross-browser scalability.`
      },
      { 
        role: 'UI/UX Designer', 
        company: 'Figma', 
        time: '5 hours ago', 
        status: 'Applied', 
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        jobId: 'figma-1',
        resumeName: 'Design_Portfolio_2026.pdf',
        jobDescription: 'Figma is seeking a Product Designer to establish unified cross-platform layouts, wireframes, component design systems, and delightful prototyping micro-animations.'
      },
      { 
        role: 'Backend Developer', 
        company: 'Flipkart', 
        time: '1 day ago', 
        status: 'Applied', 
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        jobId: 'flipkart-1',
        resumeName: 'Primary Resume (from Resume Builder)',
        jobDescription: 'Flipkart is hiring robust node/go engineers to build distributed warehouse order management APIs capable of processing 100,000+ orders per minute.'
      },
      { 
        role: 'React Developer', 
        company: 'Swiggy', 
        time: '1 day ago', 
        status: 'Submitted', 
        color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        jobId: 'swiggy-1',
        resumeName: 'React_Expert_Rishi.pdf',
        jobDescription: 'Swiggy is seeking front-end developers to engineer and optimize localized checkout checkout frames, cart microservices, and food delivery maps.'
      },
      { 
        role: 'Full Stack Developer', 
        company: 'Microsoft', 
        time: '2 days ago', 
        status: 'Viewed', 
        color: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
        jobId: 'job-2',
        resumeName: 'Primary Resume (from Resume Builder)',
        jobDescription: 'Microsoft Azure team is hiring a Full Stack Developer to build cloud-native administrative dashboards and backend logic using Node.js and MongoDB.'
      }
    ];
    
    localStorage.setItem('aryx_submitted_applications', JSON.stringify(defaults));
    return defaults;
  });

  const topCompanies = [
    { name: 'Google', count: 24, max: 25 },
    { name: 'Microsoft', count: 18, max: 25 },
    { name: 'Amazon', count: 16, max: 25 },
    { name: 'Swiggy', count: 14, max: 25 },
    { name: 'Infosys', count: 12, max: 25 }
  ];

  // Filtering based on horizontal sub-tabs
  const filteredApps = applications.filter(app => {
    if (activeSubTab === 'Today') return app.time.includes('hour') || app.time.includes('now');
    if (activeSubTab === 'Week') return !app.time.includes('Month') && !app.time.includes('5 days') && !app.time.includes('day');
    return true; // default All
  });

  const triggerDownload = (fileName: string) => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 2000);
      
      const element = document.createElement("a");
      const file = new Blob([`ARYX AI Submitted Resume File: ${fileName}\nSubmitted Candidate: Rishi Kumar`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = fileName.endsWith('.pdf') || fileName.endsWith('.docx') ? fileName : `${fileName}.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-app-text tracking-tight">Applications</h1>
        <p className="text-app-muted text-sm mt-1">Monitor the lifecycle status of your submitted applications on Aryx AI.</p>
      </div>

      {/* Applied horizontal sub-tabs block from page 4 */}
      <div className="border-b border-app-border/40 pb-px flex gap-6 overflow-x-auto">
        {subTabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setActiveSubTab(tb.id)}
            className={`pb-4 text-xs font-bold uppercase tracking-wider relative transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === tb.id ? 'text-brand-blue' : 'text-app-muted hover:text-app-text'
            }`}
          >
            {tb.label}
            {activeSubTab === tb.id && (
              <motion.div 
                layoutId="activeSubTabUnderline" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" 
              />
            )}
          </button>
        ))}
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (List of applications table overview) */}
        <div className="lg:col-span-8 space-y-3">
          {filteredApps.length > 0 ? (
            filteredApps.map((app, idx) => (
              <div 
                key={idx} 
                className="p-4 sm:p-5 rounded-2xl bg-app-surface border border-app-border card-shadow flex items-center justify-between gap-4 hover:border-brand-blue/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                    <Building className="w-5 h-5 opacity-85" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-app-text tracking-tight">{app.role}</h3>
                    <div className="flex gap-2.5 mt-0.5 text-[10px] text-app-muted font-bold uppercase">
                      <span>{app.company}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {app.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${app.color}`}>
                    {app.status}
                  </span>
                  
                  <button 
                    onClick={() => {
                      setSelectedApplication(app);
                      setShowResumeInline(false);
                    }}
                    className="px-3.5 py-1.5 bg-app-bg hover:bg-app-surface border border-app-border rounded-lg text-[10px] font-bold text-app-text hover:text-brand-blue transition-all flex items-center gap-1 cursor-pointer"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-app-surface border border-app-border rounded-[24px] space-y-2">
              <p className="text-app-muted text-xs font-semibold">No applications found in this timeframe.</p>
            </div>
          )}
        </div>

        {/* Right Column (Distribution Pie representation & Top Companies) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Applications summary doughnut block */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow flex flex-col items-center">
            <h3 className="text-base font-bold text-app-text w-full text-left">Application Summary</h3>
            
            {/* Visual Progress ring with total counter */}
            <div className="relative w-36 h-36 flex items-center justify-center my-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="62" stroke="#E2E8F0" strokeWidth="12" strokeOpacity="0.1" fill="transparent" />
                {/* Visual divided rings for distribution */}
                <circle cx="72" cy="72" r="62" stroke="#3B82F6" strokeWidth="12" fill="transparent" strokeDasharray="390" strokeDashoffset="120" strokeLinecap="round" />
                <circle cx="72" cy="72" r="62" stroke="#8B5CF6" strokeWidth="12" fill="transparent" strokeDasharray="390" strokeDashoffset="310" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-display font-black text-app-text">{applications.length}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-app-muted">Total Active</span>
              </div>
            </div>

            {/* Segment legends row with counters */}
            <div className="w-full space-y-2 border-t border-app-border/40 pt-4 text-xs font-bold text-app-muted">
              {[
                { label: 'Applied', count: applications.filter(a => a.status === 'Applied').length, color: 'bg-blue-500' },
                { label: 'Submitted', count: applications.filter(a => a.status === 'Submitted').length, color: 'bg-emerald-500' },
                { label: 'Viewed', count: applications.filter(a => a.status === 'Viewed').length, color: 'bg-violet-500' },
                { label: 'Other', count: applications.filter(a => !['Applied', 'Submitted', 'Viewed'].includes(a.status)).length, color: 'bg-neutral-500' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${item.color} shrink-0`} />
                    <span className="text-app-text">{item.label}</span>
                  </div>
                  <span className="font-mono">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Companies bar distribution */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-4">
            <h3 className="text-base font-bold text-app-text">Top Companies</h3>
            
            <div className="space-y-3.5">
              {topCompanies.map((comp, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-app-text">
                    <span>{comp.name}</span>
                    <span className="text-app-muted font-mono">{comp.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-app-bg rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-blue rounded-full" 
                      style={{ width: `${(comp.count / comp.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
      <AnimatePresence>
        {selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-app-bg border border-app-border rounded-[28px] overflow-hidden card-shadow flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-app-border/40 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-app-text">{selectedApplication.role}</h3>
                    <p className="text-xs text-app-muted mt-0.5">{selectedApplication.company} • Submitted {selectedApplication.time}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedApplication(null);
                    setShowResumeInline(false);
                  }}
                  className="p-1.5 rounded-full bg-app-surface border border-app-border text-app-muted hover:text-app-text transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-sm">
                
                {/* 1. Submitted Resume Reference */}
                <div className="space-y-2">
                  <h4 className="font-bold text-app-text text-xs uppercase tracking-wider">Submitted Resume Document</h4>
                  <div className="p-4 rounded-2xl bg-app-surface border border-app-border flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                        <FileText className="w-5.5 h-5.5" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-app-text truncate">{selectedApplication.resumeName}</p>
                        <p className="text-[9px] text-app-muted font-bold uppercase mt-0.5">Exact instance submitted on application</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowResumeInline(!showResumeInline)}
                        className="px-3.5 py-2 bg-app-bg hover:bg-app-surface border border-app-border text-app-text rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {showResumeInline ? "Hide Preview" : "View Inline"}
                      </button>
                      <button
                        onClick={() => triggerDownload(selectedApplication.resumeName)}
                        disabled={isDownloading}
                        className="px-3.5 py-2 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {isDownloading ? (
                          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : isDownloaded ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        {isDownloading ? "Downloading..." : isDownloaded ? "Downloaded!" : "Download"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline Resume Viewer Simulation */}
                {showResumeInline && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl border border-app-border/60 bg-app-bg font-sans space-y-4"
                  >
                    <div className="border-b border-app-border/40 pb-3 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Inline Document Viewer</span>
                      <span className="text-[9px] font-bold text-app-muted">PAGE 1 of 1</span>
                    </div>
                    <div className="space-y-3 text-xs leading-relaxed text-app-muted">
                      <div className="text-center space-y-1">
                        <h2 className="text-sm font-bold text-app-text">Rishi Kumar</h2>
                        <p className="text-[10px]">Hyderabad, Telangana | rishi.kumar@example.com | +91 98765 43210</p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-app-text border-b border-app-border/30 pb-0.5">Education</h3>
                        <p className="font-semibold text-app-text">B.Tech in Computer Science & Engineering</p>
                        <p className="text-[10px]">Aryx University | CGPA: 9.2/10 (2022 - 2026)</p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-app-text border-b border-app-border/30 pb-0.5">Core Tech Stack</h3>
                        <p>React, Next.js, Node.js, Express, TypeScript, Tailwind CSS, PostgreSQL, MongoDB, Git</p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-app-text border-b border-app-border/30 pb-0.5">Declarative Status</h3>
                        <p className="italic text-[10px]">Submitted securely via ARYX AI Gateway. System certified on-demand cryptographic stamp attached.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. Job Description Section */}
                <div className="space-y-2">
                  <h4 className="font-bold text-app-text text-xs uppercase tracking-wider">Job Description Reference</h4>
                  <div className="p-4 rounded-2xl bg-app-surface/40 border border-app-border/40 text-xs text-app-muted leading-relaxed whitespace-pre-line font-medium max-h-[180px] overflow-y-auto">
                    {selectedApplication.jobDescription}
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-app-border/40 flex justify-end shrink-0 bg-app-surface/50">
                <button
                  onClick={() => {
                    setSelectedApplication(null);
                    setShowResumeInline(false);
                  }}
                  className="px-5 py-2.5 bg-brand-blue text-white text-xs font-bold rounded-xl hover:bg-brand-blue/90 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
