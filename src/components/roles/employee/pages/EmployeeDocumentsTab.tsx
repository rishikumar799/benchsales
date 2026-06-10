import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Upload, Download, Trash2, ArrowUpRight } from 'lucide-react';

export default function EmployeeDocumentsTab() {
  const [successMsg, setSuccessMsg] = useState('');
  
  const categories = [
    { name: 'Resume', count: '1 Document' },
    { name: 'Certifications', count: '5 Documents' },
    { name: 'Training Certificates', count: '3 Documents' },
    { name: 'Awards & Recognitions', count: '2 Documents' },
    { name: 'Performance Documents', count: '4 Documents' },
    { name: 'Other Documents', count: '6 Documents' }
  ];

  const [documents, setDocuments] = useState([
    { id: '1', name: 'Rohit_Kumar_Resume.pdf', category: 'Resume', date: '10 May 2024', size: '512 KB' },
    { id: '2', name: 'AWS_Solutions_Architect.pdf', category: 'Certifications', date: '08 May 2024', size: '245 KB' },
    { id: '3', name: 'Leadership_Training_Cert.pdf', category: 'Training Certificates', date: '05 May 2024', size: '328 KB' },
    { id: '4', name: 'Performance_Review_2024.pdf', category: 'Performance Documents', date: '02 May 2024', size: '412 KB' }
  ]);

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.png,.jpg';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const newDoc = {
          id: String(documents.length + 1),
          name: file.name,
          category: 'Other Documents',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          size: `${Math.round(file.size / 1024)} KB`
        };
        setDocuments([newDoc, ...documents]);
        setSuccessMsg(`✓ Successfully uploaded "${file.name}"!`);
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    };
    input.click();
  };

  const handleDelete = (id: string, name: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    setSuccessMsg(`✓ Document "${name}" removed from server storage.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header section with Upload target */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-black text-app-text">Documents</h2>
          <p className="text-xs text-app-muted mt-1 font-semibold">Manage your important documents.</p>
        </div>
        <button 
          onClick={handleUploadClick}
          className="px-5 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Upload className="w-4 h-4" /> Upload Document
        </button>
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

      {/* Categories Grid layout */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {categories.map((cat, i) => (
          <div 
            key={i} 
            className="p-5 rounded-2xl bg-app-surface border border-app-border text-center flex flex-col justify-between items-center group hover:border-brand-blue/30 transition-all card-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center text-brand-blue mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-app-text group-hover:text-brand-blue transition-colors h-8 flex items-center justify-center leading-tight">{cat.name}</h4>
              <span className="text-[9px] font-bold text-app-muted mt-1 block uppercase tracking-wider">{cat.count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recents list section */}
      <div className="space-y-4">
        <h3 className="text-sm font-display font-black text-app-muted uppercase tracking-wider">Recent Documents</h3>

        <div className="rounded-[32px] bg-app-surface border border-app-border card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-app-border bg-app-bg/50">
                  <th className="p-6 text-xs font-bold uppercase tracking-widest text-app-muted">Document Name</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-widest text-app-muted">Category</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-widest text-app-muted">Uploaded On</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-widest text-app-muted">Size</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-widest text-app-muted text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-app-bg/20 transition-all font-semibold">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-brand-blue shrink-0" />
                        <span className="text-xs font-bold text-app-text">{doc.name}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-xs font-bold text-app-muted bg-app-bg border border-app-border rounded-lg px-2.5 py-1">
                        {doc.category}
                      </span>
                    </td>
                    <td className="p-6 text-xs text-app-muted font-mono">{doc.date}</td>
                    <td className="p-6 text-xs text-app-muted font-mono">{doc.size}</td>
                    <td className="p-6 text-right space-x-2">
                      <button 
                        onClick={() => alert(`Downloading file: ${doc.name}`)}
                        className="p-2.5 border border-app-border rounded-xl bg-app-bg hover:bg-app-surface text-app-muted hover:text-brand-blue transition-colors cursor-pointer inline-flex items-center"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(doc.id, doc.name)}
                        className="p-2.5 border border-red-500/20 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-500 transition-colors cursor-pointer inline-flex items-center"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
