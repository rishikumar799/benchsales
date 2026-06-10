import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Download, 
  Eye, 
  ArrowUpRight,
  ClipboardCheck,
  Award,
  BookOpen
} from 'lucide-react';

export default function DocumentsTab() {
  const [documents, setDocuments] = useState([
    { name: 'Resume_Rohit_Kumar.pdf', category: 'Resume', date: '10 May 2026', size: '512 KB' },
    { name: '10th_Marksheet.pdf', category: 'Academic Certificate', date: '15 Apr 2026', size: '245 KB' },
    { name: '12th_Marksheet.pdf', category: 'Academic Certificate', date: '15 Apr 2026', size: '268 KB' },
    { name: 'BTech_Sem6_Marksheet.pdf', category: 'Mark Sheets', date: '20 Apr 2026', size: '320 KB' },
    { name: 'BTech_Sem5_Marksheet.pdf', category: 'Mark Sheets', date: '20 Apr 2026', size: '316 KB' },
    { name: 'Internship_Certificate.pdf', category: 'Internship Certificate', date: '25 Apr 2026', size: '410 KB' },
    { name: 'Aptitude_Certificate.pdf', category: 'Placement Documents', date: '02 May 2026', size: '210 KB' },
    { name: 'NSS_Certificate.pdf', category: 'Other Documents', date: '01 May 2026', size: '190 KB' },
  ]);

  const handleUploadClick = () => {
    alert('Launching Secure File Explorer to upload new academic / placement document...\nAllowed types: PDF, PNG, JPG (Max 5MB)');
  };

  const handleDownload = (name: string) => {
    alert(`Downloading document safely:\nFile: ${name}`);
  };

  const handleDelete = (name: string) => {
    if (confirm(`Are you sure you want to permanently delete: ${name}?`)) {
      setDocuments(prev => prev.filter(doc => doc.name !== name));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-app-text">Documents</h2>
          <p className="text-app-muted">Upload and manage your important placement documents and files.</p>
        </div>
        
        {/* Upload Button */}
        <button 
          onClick={handleUploadClick}
          className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-brand-blue/20"
        >
          <Upload className="w-3.5 h-3.5" /> Upload Document
        </button>
      </div>

      {/* Main Grid table card */}
      <div className="glass border-app-border rounded-[28px] overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border/40 bg-app-surface/20">
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted pl-6">Document Name</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Category</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Uploaded On</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Size</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40">
              {documents.length > 0 ? (
                documents.map((doc, idx) => (
                  <tr key={idx} className="hover:bg-app-surface/30 transition-colors">
                    
                    {/* Document title */}
                    <td className="p-4.5 pl-6 font-semibold text-app-text flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm text-app-text hover:text-brand-blue cursor-pointer transition-colors" onClick={() => alert(`Reviewing document: ${doc.name}`)}>
                        {doc.name}
                      </span>
                    </td>

                    {/* Category column */}
                    <td className="p-4.5 text-xs font-bold text-app-muted">
                      <span className="bg-app-bg text-app-muted px-2.5 py-1 rounded-md border border-app-border">
                        {doc.category}
                      </span>
                    </td>

                    {/* Date column */}
                    <td className="p-4.5 text-xs font-semibold text-app-muted">
                      {doc.date}
                    </td>

                    {/* Size column */}
                    <td className="p-4.5 text-xs font-bold text-app-muted">
                      {doc.size}
                    </td>

                    {/* Actions column */}
                    <td className="p-4.5 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => alert(`Opening secure inline preview for: ${doc.name}`)}
                          className="p-2 hover:bg-brand-blue/10 rounded-lg text-app-muted hover:text-brand-blue transition-all"
                          title="View inline"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDownload(doc.name)}
                          className="p-2 hover:bg-brand-blue/10 rounded-lg text-app-muted hover:text-brand-blue transition-all"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(doc.name)}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-app-muted hover:text-red-550 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-app-muted text-sm font-semibold">
                    No documents uploaded. Drag-and-drop or upload document to get started.
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
