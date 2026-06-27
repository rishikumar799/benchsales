import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Eye, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  FileText,
  Upload,
  X
} from 'lucide-react';

export default function ResumeBuilderTab() {
  const [activeStep, setActiveStep] = useState(1);
  const [fullName, setFullName] = useState('Rishi Kumar');
  const [email, setEmail] = useState('rishi.kumar@email.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [location, setLocation] = useState('Hyderabad, India');
  const [linkedin, setLinkedin] = useState('linkedin.com/in/rishi-kumar');
  const [portfolio, setPortfolio] = useState('rishikumar.dev');
  
  // Professional Summary state
  const [summary, setSummary] = useState(
    'Passionate full stack developer with experience building modern web applications. Always eager to learn new technologies and solve real-world problems.'
  );

  const [uploadedResume, setUploadedResume] = useState<{name: string, date: string} | null>(() => {
    const saved = localStorage.getItem('aryx_uploaded_resume');
    return saved ? JSON.parse(saved) : null;
  });
  const [isUploadingModalOpen, setIsUploadingModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const steps = [
    { id: 1, label: 'Personal Details' },
    { id: 2, label: 'Professional Summary' },
    { id: 3, label: 'Skills' },
    { id: 4, label: 'Experience' },
    { id: 5, label: 'Projects' },
    { id: 6, label: 'Education' },
    { id: 7, label: 'Certifications' },
    { id: 8, label: 'Achievements' },
    { id: 9, label: 'Languages' }
  ];

  const [showMessage, setShowMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      // Advance to next step if possible
      if (activeStep < steps.length) {
        setActiveStep(prev => prev + 1);
      }
    }, 2000);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploadSuccess(true);
    const newResume = {
      name: file.name,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    setTimeout(() => {
      setUploadedResume(newResume);
      localStorage.setItem('aryx_uploaded_resume', JSON.stringify(newResume));
      setUploadSuccess(false);
      setIsUploadingModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Upper header action items */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text tracking-tight">Resume Builder</h1>
          <p className="text-xs text-app-muted font-bold mt-1">
            {uploadedResume 
              ? `Active: ${uploadedResume.name} • Uploaded ${uploadedResume.date}` 
              : 'My Resume • Last updated 3 hours ago'}
          </p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <button 
            onClick={() => setIsUploadingModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-xs font-bold text-indigo-400 rounded-xl flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" /> Upload Existing Resume
          </button>

          <button className="px-4 py-2.5 bg-app-surface hover:bg-app-surface/80 border border-app-border text-xs font-bold text-app-text rounded-xl flex items-center gap-2 transition-all">
            <Eye className="w-3.5 h-3.5 text-brand-blue" /> Preview
          </button>
          
          <button className="px-4 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-xs font-bold text-white rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-brand-blue/20">
            <Download className="w-3.5 h-3.5" /> Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step checklist sidebar (Left Column) */}
        <div className="lg:col-span-3 space-y-2">
          {steps.map((st) => (
            <button
              key={st.id}
              onClick={() => setActiveStep(st.id)}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left text-xs font-bold border transition-all ${
                activeStep === st.id
                  ? 'bg-brand-blue border-brand-blue text-white shadow-md shadow-brand-blue/15'
                  : activeStep > st.id 
                    ? 'bg-brand-blue/5 border-brand-blue/15 text-brand-blue hover:bg-brand-blue/10'
                    : 'bg-app-surface border-app-border text-app-muted hover:text-app-text'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  activeStep === st.id 
                    ? 'bg-white text-brand-blue'
                    : activeStep > st.id
                      ? 'bg-brand-blue text-white'
                      : 'bg-app-bg text-app-muted'
                }`}>
                  {st.id}
                </span>
                <span>{st.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          ))}
        </div>

        {/* Interactive Form panel (Middle Column) */}
        <div className="lg:col-span-6 p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow h-fit space-y-6">
          <div className="flex justify-between items-center border-b border-app-border/40 pb-4">
            <h2 className="text-base font-bold text-app-text">{steps.find(s => s.id === activeStep)?.label}</h2>
            <span className="text-[10px] font-bold text-app-muted uppercase">Step {activeStep} of 9</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              {activeStep === 1 && (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Full Name</label>
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Phone Number</label>
                      <input 
                        type="text" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Physical Location</label>
                      <input 
                        type="text" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">LinkedIn Profile</label>
                      <input 
                        type="text" 
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Portfolio URL/Github</label>
                      <input 
                        type="text" 
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-app-border/40">
                    <button type="submit" className="px-5 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs rounded-xl shadow-md uppercase tracking-wide">
                      {showMessage ? 'Details Recorded...' : 'Save & Continue'}
                    </button>
                  </div>
                </form>
              )}

              {activeStep === 2 && (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Professional Summary</label>
                    <textarea 
                      rows={5}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Write a summary about your skills, goals, and history..."
                      className="w-full bg-app-bg border border-app-border rounded-xl p-4 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                    />
                  </div>
                  <div className="flex justify-end pt-4 border-t border-app-border/40">
                    <button type="submit" className="px-5 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs rounded-xl shadow-md uppercase tracking-wide">
                      Save & Continue
                    </button>
                  </div>
                </form>
              )}

              {activeStep > 2 && (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-app-text">Build {steps.find(s => s.id === activeStep)?.label}</h3>
                    <p className="text-xs text-app-muted mt-1 max-w-xs mx-auto">Dynamic inputs for this profile section configured under Candidate workspace.</p>
                  </div>
                  <button 
                    onClick={() => setActiveStep(prev => prev === steps.length ? 1 : prev + 1)}
                    className="px-5 py-2 px-6 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text"
                  >
                    Skip step or Save
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Resume Health Index (Right Column) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow flex flex-col items-center">
            <h3 className="text-base font-bold text-app-text mb-4 w-full text-left">Resume Score</h3>
            
            {/* Visual Circular Progress */}
            <div className="relative w-32 h-32 flex items-center justify-center my-1.5">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-app-border" />
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="351" strokeDashoffset="31" className="text-brand-blue" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-display font-black text-app-text">91%</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-500">Excellent</span>
              </div>
            </div>

            {/* Criteria checks list matching collage image */}
            <div className="w-full text-left space-y-3.5 mt-6 border-t border-app-border/40 pt-4">
              {[
                { name: 'Content Quality', status: 'Excellent', complete: true },
                { name: 'ATS Friendly', status: 'Excellent', complete: true },
                { name: 'Completeness', status: 'Good', complete: true },
                { name: 'Readability', status: 'Excellent', complete: true }
              ].map((criteria, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-app-text font-semibold">{criteria.name}</span>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-mono">{criteria.status}</span>
                </div>
              ))}
            </div>

            {/* Hint alert card at bottom */}
            <div className="p-4 rounded-xl bg-brand-blue/5 border border-brand-blue/10 flex gap-3 mt-6">
              <AlertCircle className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-app-muted font-medium">
                <strong className="text-app-text">Tip:</strong> Add more quantifiable achievements to improve your resume impact. For example: "Managed a codebase that scaled output by 40%."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Existing Resume Modal */}
      <AnimatePresence>
        {isUploadingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-app-bg border border-app-border rounded-[28px] overflow-hidden card-shadow p-6 space-y-6"
            >
              <div className="flex justify-between items-center border-b border-app-border/40 pb-4">
                <div>
                  <h3 className="text-base font-bold text-app-text">Upload Existing Resume</h3>
                  <p className="text-xs text-app-muted mt-0.5">Support PDF, DOCX formats up to 10MB</p>
                </div>
                <button 
                  onClick={() => setIsUploadingModalOpen(false)}
                  className="p-1.5 rounded-full bg-app-surface hover:bg-app-surface/80 border border-app-border text-app-muted hover:text-app-text transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {uploadSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500">
                    <CheckCircle2 className="w-6 h-6 animate-bounce" />
                  </div>
                  <h4 className="text-sm font-bold text-app-text">Resume Received!</h4>
                  <p className="text-xs text-app-muted">Storing your document securely in ARYX AI...</p>
                </div>
              ) : (
                <div 
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center space-y-3 transition-colors ${
                    dragActive 
                      ? 'border-brand-blue bg-brand-blue/5' 
                      : 'border-app-border bg-app-surface/50 hover:bg-app-surface'
                  }`}
                >
                  <Upload className="w-8 h-8 text-app-muted mx-auto" />
                  <div>
                    <p className="text-xs font-bold text-app-text">Drag and drop your file here</p>
                    <p className="text-[10px] text-app-muted font-medium mt-1">or click below to browse local storage</p>
                  </div>
                  
                  <label className="inline-block px-4 py-2 bg-app-bg border border-app-border hover:bg-app-surface text-xs font-bold text-app-text rounded-xl cursor-pointer select-none transition-all">
                    Browse File
                    <input 
                      type="file" 
                      accept=".pdf,.docx,.doc" 
                      onChange={handleFileSelect} 
                      className="hidden" 
                    />
                  </label>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setIsUploadingModalOpen(false)}
                  className="w-full py-2.5 bg-app-surface border border-app-border text-app-text rounded-xl text-xs font-bold cursor-pointer hover:bg-neutral-800 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
