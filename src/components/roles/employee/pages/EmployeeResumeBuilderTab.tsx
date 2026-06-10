import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, CheckCircle2, AlertCircle, Eye, Download, Sparkles, CheckSquare, Square } from 'lucide-react';

export default function EmployeeResumeBuilderTab() {
  const [successMsg, setSuccessMsg] = useState('');
  const [sections, setSections] = useState([
    { id: '1', name: 'Personal Information', completed: true },
    { id: '2', name: 'Professional Summary', completed: true },
    { id: '3', name: 'Skills', completed: true },
    { id: '4', name: 'Work Experience', completed: true },
    { id: '5', name: 'Projects', completed: true },
    { id: '6', name: 'Certifications', completed: true },
    { id: '7', name: 'Achievements', completed: true }
  ]);

  const [summary, setSummary] = useState(
    'Results-driven Software Engineer with 4+ years of experience in building scalable web applications and microservices. Proficient in JavaScript, React, Node.js, and cloud platforms. Passionate about solving complex problems and delivering high-quality solutions.'
  );
  
  const [skills, setSkills] = useState([
    'React', 'Node.js', 'JavaScript', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'MongoDB'
  ]);

  const [experience, setExperience] = useState({
    title: 'Software Engineer',
    company: 'Tech Solutions Pvt. Ltd.',
    period: 'Jun 2021 - Present',
    bullets: [
      'Developed and maintained scalable web applications using React and Node.js.',
      'Collaborated with cross-functional teams to deliver high-quality solutions.',
      'Optimized application performance and improved user experience.'
    ]
  });

  const [editingField, setEditingField] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setSections(sections.map(sec => sec.id === id ? { ...sec, completed: !sec.completed } : sec));
  };

  const handleSaveField = (fieldName: string) => {
    setEditingField(null);
    setSuccessMsg(`✓ Successfully updated ${fieldName}!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-black text-app-text">Resume Builder</h2>
        <p className="text-xs text-app-muted mt-1 font-semibold">Create and manage your professional resume.</p>
      </div>

      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-xs"
          >
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sections Checklists */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-app-muted">Resume Sections</h3>
            <div className="space-y-3">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => toggleSection(sec.id)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-app-bg hover:bg-app-surface border border-app-border transition-all text-left font-bold text-xs cursor-pointer text-app-text"
                >
                  <span className="truncate pr-2">{sec.name}</span>
                  {sec.completed ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-brand-blue shrink-0" />
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-full border border-app-border shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: Form & Previews */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 sm:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow space-y-6">
            {/* Prof Summary */}
            <div className="space-y-3 pb-6 border-b border-app-border">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-display font-black text-app-text">Professional Summary</h3>
                <button 
                  onClick={() => setEditingField(editingField === 'summary' ? null : 'summary')}
                  className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
                >
                  {editingField === 'summary' ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editingField === 'summary' ? (
                <div className="space-y-3">
                  <textarea 
                    rows={4}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-brand-blue"
                  />
                  <div className="flex justify-end">
                    <button 
                      onClick={() => handleSaveField('Professional Summary')}
                      className="px-4 py-2 bg-brand-blue text-white font-bold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Save Summary
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-app-muted leading-relaxed font-medium">{summary}</p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-3 pb-6 border-b border-app-border">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-display font-black text-app-text">Skills</h3>
                <button 
                  onClick={() => setEditingField(editingField === 'skills' ? null : 'skills')}
                  className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
                >
                  {editingField === 'skills' ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editingField === 'skills' ? (
                <div className="space-y-3">
                  <input 
                    type="text" 
                    value={skills.join(', ')}
                    onChange={(e) => setSkills(e.target.value.split(',').map(s => s.trim()))}
                    className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-brand-blue"
                  />
                  <p className="text-[10px] text-app-muted font-bold">Please separate skills with commas.</p>
                  <div className="flex justify-end">
                    <button 
                      onClick={() => handleSaveField('Skills & Tags')}
                      className="px-4 py-2 bg-brand-blue text-white font-bold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Save Skills
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="text-xs font-bold text-brand-blue bg-brand-blue/10 rounded-xl px-3.5 py-1.5 border border-brand-blue/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Work Exp */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-display font-black text-app-text">Work Experience</h3>
                <button 
                  onClick={() => setEditingField(editingField === 'experience' ? null : 'experience')}
                  className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
                >
                  {editingField === 'experience' ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editingField === 'experience' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-app-muted uppercase">Designation</label>
                      <input 
                        type="text" 
                        value={experience.title}
                        onChange={(e) => setExperience({ ...experience, title: e.target.value })}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-app-muted uppercase">Company</label>
                      <input 
                        type="text" 
                        value={experience.company}
                        onChange={(e) => setExperience({ ...experience, company: e.target.value })}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={() => handleSaveField('Work Experience')}
                      className="px-4 py-2 bg-brand-blue text-white font-bold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Save Experience
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-1 font-semibold">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="text-sm font-bold text-app-text">{experience.title}</div>
                      <div className="text-xs text-app-muted mt-0.5">{experience.company}</div>
                    </div>
                    <div className="text-[11px] text-app-muted font-mono">{experience.period}</div>
                  </div>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-app-muted font-medium">
                    {experience.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Score & Details */}
        <div className="lg:col-span-3">
          <div className="p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow text-center flex flex-col items-center justify-between h-full space-y-6">
            <h3 className="text-base font-display font-black text-app-text w-full text-left">Resume Score</h3>

            <div className="relative w-36 h-36 flex items-center justify-center my-1.5">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-app-border" />
                <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="390" strokeDashoffset="35" className="text-emerald-500" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-display font-black text-app-text">91%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Excellent</span>
              </div>
            </div>

            <div className="w-full text-left space-y-4">
              <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-widest block leading-none">Suggestions:</span>
              
              <div className="space-y-3 pb-4">
                {[
                  { text: 'Add more certifications', complete: false },
                  { text: 'Highlight leadership experiences', complete: false }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-xs font-bold text-app-text">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => alert('Launching full interactive Resume Preview... Ready.')}
                  className="w-full py-3 border border-app-border hover:border-brand-blue text-app-text font-extrabold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" /> Preview Resume
                </button>
                <button 
                  onClick={() => {
                    setSuccessMsg('✓ Initiating PDF Compile & Export...');
                    setTimeout(() => {
                      setSuccessMsg('');
                      alert('Resume compiled successfully! Export complete.');
                    }, 1500);
                  }}
                  className="w-full py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
