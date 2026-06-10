import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  Sparkles, 
  BarChart3, 
  TrendingUp, 
  Settings, 
  Calendar, 
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

export default function ReportsTab() {
  const [recentReports] = useState([
    { name: 'Department Placement Report 2026', date: 'Yesterday at 14:20 PM', size: '1.2 MB', category: 'Departments' },
    { name: 'Company Hiring Statistics Complete', date: '08 Jun 2026', size: '3.4 MB', category: 'Companies' },
    { name: 'Student Placement Log Ledger', date: '04 Jun 2026', size: '840 KB', category: 'Students' },
    { name: 'Officer Performance Audit Sheet', date: '28 May 2026', size: '412 KB', category: 'Officers' }
  ]);

  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleGenerate = (reportName: string) => {
    setGeneratingId(reportName);
    setTimeout(() => {
      setGeneratingId(null);
      alert(`Success: "${reportName}" has been successfully generated on the server and is ready inside Xavier's cloud memory! Click download icon to save.`);
    }, 1500);
  };

  const handleDownload = (name: string) => {
    alert(`Downloading "${name}" spreadsheet securely via local server gateway...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-black text-app-text tracking-tight h-10 flex items-center">Reports</h2>
          <p className="text-xs text-app-muted font-bold mt-1">Generate, audit, and export real-time departmental statistics and company hiring trends.</p>
        </div>

        <button 
          onClick={() => alert('Compiling comprehensive annual portfolio of Xavier\'s Placement drives 2026...')}
          className="px-4 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-brand-blue/15 transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export All Reports</span>
        </button>
      </div>

      {/* KPI Overview Grid */}
      <div className="p-6 bg-app-surface/60 border border-app-border rounded-[32px] card-shadow space-y-4">
        <h3 className="text-sm font-black text-app-text uppercase tracking-wider">Report Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: '4,826' },
            { label: 'Placement Rate', value: '78%', detail: '+4% this year' },
            { label: 'Highest Package', value: '18.0 LPA' },
            { label: 'Average Package', value: '6.8 LPA' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-app-bg/60 border border-app-border rounded-2xl">
              <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">{item.label}</span>
              <div className="text-xl font-black text-app-text mt-1">{item.value}</div>
              {item.detail && <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">{item.detail}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Report Generation vs Historical Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Available Reports list (Left) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 bg-app-surface/60 border border-app-border rounded-[32px] card-shadow">
            <h3 className="text-lg font-display font-black text-app-text mb-1">Available Reports</h3>
            <p className="text-xs text-app-muted font-bold mb-6">Select a database perspective to compile a secure spreadsheet format.</p>

            <div className="space-y-4">
              {[
                { id: 'dept', title: 'Department Placement Report', desc: 'Breakdown of placement speed and cgpa metrics by department cells.', cat: 'Departments' },
                { id: 'company', title: 'Company Hiring Report', desc: 'Company-wise hiring statistics, maximum compensation offers and active recruitment filters.', cat: 'Companies' },
                { id: 'students', title: 'Student Placement Report', desc: 'Individual student performance metrics, active resumes, and joining verification status sheets.', cat: 'Students' },
                { id: 'officers', title: 'Officer Performance Report', desc: 'Audit performance sheets, driving capacity, and active communication logging of delegated placement officers.', cat: 'Officers' }
              ].map((rep, idx) => (
                <div key={idx} className="p-5 bg-app-bg rounded-2xl border border-app-border space-y-3 hover:border-brand-blue/30 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-extrabold text-brand-blue uppercase bg-brand-blue/10 px-2 py-0.5 rounded">
                        {rep.cat}
                      </span>
                      <h4 className="text-sm font-black text-app-text mt-1">{rep.title}</h4>
                      <p className="text-xs text-app-muted font-semibold mt-0.5">{rep.desc}</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-app-border/40">
                    <button 
                      onClick={() => handleGenerate(rep.title)}
                      disabled={generatingId !== null}
                      className="px-4 py-2 bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-sm shadow-brand-blue/10 transition-all"
                    >
                      {generatingId === rep.title ? 'Generating Spreadsheet...' : 'Generate New'}
                    </button>
                    <button 
                      onClick={() => handleDownload(rep.title)}
                      className="px-3 py-2 border border-app-border hover:bg-app-surface text-app-muted font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Export
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* History of generated files (Right) */}
        <div className="lg:col-span-5">
          <div className="p-6 bg-app-surface/60 border border-app-border rounded-[32px] card-shadow space-y-5">
            <div>
              <h3 className="text-lg font-display font-black text-app-text">Recent Reports</h3>
              <p className="text-xs text-app-muted font-bold mt-0.5">Audit history of recently downloaded spreadsheet sheets.</p>
            </div>

            <div className="space-y-3">
              {recentReports.map((item, idx) => (
                <div key={idx} className="p-4 bg-app-bg rounded-2xl border border-app-border flex justify-between items-center hover:border-brand-violet/20 transition-all">
                  <div className="flex gap-3">
                    <div className="p-2.5 bg-brand-blue/10 text-brand-blue rounded-xl shrink-0">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-app-text line-clamp-1">{item.name}</div>
                      <span className="text-[9px] text-app-muted font-bold block mt-0.5">{item.date} • {item.size}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDownload(item.name)}
                    className="p-2 bg-brand-violet/10 text-brand-violet hover:bg-brand-violet/20 rounded-xl transition-all cursor-pointer"
                    title="Download Generated File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-emerald-500 font-bold leading-relaxed rounded-2xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>All report datasets are compiled dynamically from live department logs with multi-level CRC validation.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
