import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  FileText, 
  Download, 
  Eye, 
  Plus, 
  Briefcase, 
  GraduationCap, 
  Sparkles,
  Award,
  BookOpen,
  Send
} from 'lucide-react';

export default function ResumeBuilderTab() {
  const [activeSection, setActiveSection] = useState('Personal Information');

  const sections = [
    { name: 'Personal Information', completed: true },
    { name: 'Summary', completed: true },
    { name: 'Skills', completed: true },
    { name: 'Projects', completed: true },
    { name: 'Internships', completed: true },
    { name: 'Education', completed: true },
    { name: 'Certifications', completed: true },
    { name: 'Achievements', completed: true },
    { name: 'Languages', completed: true },
    { name: 'Additional Information', completed: true },
  ];

  const handleDownload = () => {
    alert('Preparing your ATS-optimized Resume PDF for download...\nFile Generated: Resume_Rohit_Kumar.pdf');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-app-text">Resume Builder</h2>
          <p className="text-app-muted">Create an ATS-optimized professional resume that stands out.</p>
        </div>
        
        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="px-4 py-2.5 bg-app-surface hover:bg-app-surface/90 text-app-text border border-app-border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all">
            <Eye className="w-3.5 h-3.5 text-app-muted" /> Preview
          </button>
          <button 
            onClick={handleDownload}
            className="px-4 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-brand-blue/20"
          >
            <Download className="w-3.5 h-3.5" /> Download PDF
          </button>
        </div>
      </div>

      {/* Main Grid-3-Column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left column: Resume Sections checklist */}
        <div className="lg:col-span-1 p-5 rounded-[28px] glass border-app-border card-shadow space-y-4">
          <h4 className="font-display font-bold text-sm text-app-muted uppercase tracking-wider">Resume Sections</h4>
          
          <div className="space-y-1">
            {sections.map((sec) => (
              <button
                key={sec.name}
                onClick={() => setActiveSection(sec.name)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  activeSection === sec.name 
                    ? 'bg-brand-blue text-white shadow-md' 
                    : 'text-app-muted hover:text-app-text hover:bg-app-surface'
                }`}
              >
                <span>{sec.name}</span>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${
                  activeSection === sec.name ? 'text-white' : 'text-emerald-500'
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* Center column: Paper Mockup representing the resume document */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-[32px] bg-white text-slate-800 shadow-2xl relative border border-slate-200">
          
          {/* Internal Page simulation */}
          <div className="space-y-6">
            
            {/* Direct Heading Banner */}
            <div className="text-center border-b border-slate-200 pb-5 space-y-2">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">Rohit Kumar</h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 text-brand-blue">Software Developer</p>
              
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] font-bold text-slate-500 mt-2">
                <span>rohit.kumar@email.com</span>
                <span>•</span>
                <span>+91 98765 43210</span>
                <span>•</span>
                <span className="hover:underline cursor-pointer">linkedin.com/in/rohitkumar</span>
                <span>•</span>
                <span className="hover:underline cursor-pointer">github.com/rohitkumar</span>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-brand-blue border-b border-slate-100 pb-1">Summary</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Enthusiastic and detail-oriented Computer Science student with a strong foundation in software development. Proficient in Java, JavaScript, React, and database systems. Eager to contribute to innovative projects and grow in a challenging placement environment.
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-brand-blue border-b border-slate-100 pb-1">Skills</h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  'Java', 'JavaScript', 'React.js', 'HTML', 'CSS', 
                  'SQL', 'Data Structures', 'Git', 'Problem Solving'
                ].map((sk) => (
                  <span key={sk} className="text-[9px] font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Projects list */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-brand-blue border-b border-slate-100 pb-1">Projects</h4>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">E-Commerce Website</span>
                  <span className="font-semibold text-slate-500">Jan 2024</span>
                </div>
                <div className="text-[9px] font-extrabold text-slate-500">React, Node.js, MongoDB</div>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold pt-1">
                  Developed a full-stack e-commerce platform with automated secure user authentication and payments. Implemented fast product searching, categories, filtering, and live cart updates. Deployed client and host using Heroku and MongoDB Atlas.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right column: Resume ATS Core Scorecard */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Score wheel card */}
          <div className="p-6 rounded-[28px] glass border-app-border card-shadow text-center">
            <h4 className="font-display font-bold text-sm text-app-muted uppercase tracking-wider mb-4">Resume Score</h4>
            
            <div className="relative w-28 h-28 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-app-border/40" />
                <circle cx="56" cy="56" r="46" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="290" strokeDashoffset="23" className="text-emerald-500" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-display font-extrabold text-app-text">92%</span>
                <span className="text-[7px] font-bold text-emerald-500 uppercase tracking-widest leading-none">ATS Score</span>
              </div>
            </div>

            {/* Content list stats */}
            <div className="space-y-2 border-t border-app-border/40 pt-4 text-left">
              <div className="flex justify-between items-center text-xs font-semibold text-app-text">
                <span className="text-app-muted">ATS Compatibility</span>
                <span>90%</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-app-text">
                <span className="text-app-muted">Content Quality</span>
                <span>93%</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-app-text">
                <span className="text-app-muted">Completeness</span>
                <span>95%</span>
              </div>
            </div>
          </div>

          {/* AI Optimizer tips */}
          <div className="p-5 rounded-[28px] bg-brand-blue/5 border border-brand-blue/15 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1 px-1.5 bg-brand-blue/15 text-brand-blue rounded-lg text-xs font-bold uppercase">AI</div>
              <h5 className="font-display font-bold text-xs text-app-text">Tips to Maximise Score</h5>
            </div>
            
            <ul className="text-xs text-app-muted space-y-2 font-medium">
              <li className="flex gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-1.5 shrink-0" />
                <span>Format your technical skills into categorized tables to bypass older parsers.</span>
              </li>
              <li className="flex gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-1.5 shrink-0" />
                <span>Provide quantitative performance stats in project bullet points (e.g., "sped up load time by 32%").</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
