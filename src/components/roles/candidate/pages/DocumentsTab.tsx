import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Folder, 
  FileText, 
  Award, 
  Briefcase, 
  UserSquare, 
  ShieldAlert, 
  MoreVertical,
  Download,
  Trash2,
  Plus,
  CheckCircle2,
  Eye
} from 'lucide-react';

interface DocFolder {
  name: string;
  count: number;
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
}

interface RecentFile {
  name: string;
  category: string;
  time: string;
  size: string;
}

export default function DocumentsTab() {
  const [folders, setFolders] = useState<DocFolder[]>([
    { name: 'Resume', count: 1, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Certificates', count: 6, icon: Award, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { name: 'Portfolio', count: 2, icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Identity Documents', count: 3, icon: UserSquare, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Other Documents', count: 4, icon: Folder, color: 'text-pink-500', bg: 'bg-pink-500/10' }
  ]);

  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([
    { name: 'Rishi_Kumar_Resume.pdf', category: 'Resume', time: '2 hours ago', size: '1.2 MB' },
    { name: 'AWS_Certificate.pdf', category: 'Certificate', time: '1 day ago', size: '840 KB' },
    { name: 'React_Project.pdf', category: 'Portfolio', time: '2 days ago', size: '3.4 MB' },
    { name: 'Aadhaar_Card.pdf', category: 'Identity', time: '3 days ago', size: '1.1 MB' },
    { name: 'Cover_Letter.pdf', category: 'Other', time: '3 days ago', size: '340 KB' }
  ]);

  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newFile: RecentFile = {
        name: file.name,
        category: 'Other',
        time: 'Just now',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      };
      
      setRecentFiles([newFile, ...recentFiles]);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with Upload Trigger Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text tracking-tight">Documents</h1>
          <p className="text-app-muted text-sm mt-1">Manage and preview all your career documents and credentials securely.</p>
        </div>

        <div className="relative overflow-hidden">
          <input
            type="file"
            id="doc-uploader"
            onChange={handleSimulatedUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <label
            htmlFor="doc-uploader"
            className="px-4 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-xs font-bold text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-brand-blue/20"
          >
            <Plus className="w-4 h-4" /> Upload New
          </label>
        </div>
      </div>

      <AnimatePresence>
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 font-bold text-xs flex items-center gap-2 border border-emerald-500/15"
          >
            <CheckCircle2 className="w-4.5 h-4.5" /> File uploaded and structured successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Documents Folders Grid layout) */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest block pl-1">Document Folders</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {folders.map((folder, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-app-surface border border-app-border card-shadow flex flex-col justify-between h-40 hover:border-brand-blue/30 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-xl ${folder.bg} flex items-center justify-center ${folder.color}`}>
                    <folder.icon className="w-5.5 h-5.5" />
                  </div>
                  <button className="p-1 text-app-muted hover:text-app-text rounded-lg">
                    <MoreVertical className="w-4.5 h-4.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-extrabold text-app-text block leading-tight">{folder.name}</span>
                  <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider">{folder.count} {folder.count === 1 ? 'file' : 'files'}</span>
                </div>

                <button className="text-[10px] font-extrabold text-brand-blue hover:text-brand-violet transition-colors text-left uppercase tracking-wider">
                  View Files
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Recent Files list layout) */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest block pl-1">Recent Files</span>
          
          <div className="p-5 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-4 flex flex-col h-fit">
            <div className="space-y-3">
              {recentFiles.map((file, idx) => (
                <div 
                  key={idx} 
                  className="p-3.5 rounded-2xl bg-app-bg hover:bg-app-surface border border-app-border flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-app-text block truncate leading-tight">{file.name}</span>
                      <span className="text-[9px] font-bold text-app-muted uppercase mt-0.5 block">{file.category} • {file.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-mono font-bold text-app-muted hidden sm:inline">{file.size}</span>
                    <button className="p-2 bg-app-surface/50 border border-app-border text-app-muted hover:text-brand-blue rounded-lg transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-3 bg-app-bg hover:bg-app-surface border border-app-border rounded-xl text-xs font-bold text-app-text hover:text-brand-blue transition-all uppercase tracking-wider">
              View All Documents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
