import React, { useState, useEffect } from 'react';
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
  Eye,
  X
} from 'lucide-react';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';

interface DocFolder {
  name: string;
  category: string;
  count: number;
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
}

const defaultDocuments = [
  { id: 'doc-1', name: 'Rishi_Kumar_Resume.pdf', category: 'Resume', time: '2 hours ago', size: '1.2 MB', url: '#' },
  { id: 'doc-2', name: 'React_Project.pdf', category: 'Portfolio', time: '2 days ago', size: '3.4 MB', url: '#' },
  { id: 'doc-3', name: 'Aadhaar_Card.pdf', category: 'Identity', time: '3 days ago', size: '1.1 MB', url: '#' },
  { id: 'doc-4', name: 'Cover_Letter.pdf', category: 'Other', time: '3 days ago', size: '340 KB', url: '#' }
];

const defaultCertificates = [
  { id: 'cert-1', title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2025-10-12', url: '#' },
  { id: 'cert-2', title: 'Google Professional Cloud Architect', issuer: 'Google Cloud', date: '2026-02-15', url: '#' },
  { id: 'cert-3', title: 'Certified Kubernetes Administrator', issuer: 'The Linux Foundation', date: '2025-06-20', url: '#' }
];

export default function DocumentsTab() {
  const { user, userProfile } = useAuth();
  const uid = user?.uid || userProfile?.uid;
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Real-time Firestore Sync
  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'marketplace_jobseekers', uid);
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        let docs = data.documents;
        let certs = data.certificates;

        // Seed with default data if empty
        if (!docs || !certs) {
          const updates: any = {};
          if (!docs) {
            docs = defaultDocuments;
            updates.documents = defaultDocuments;
          }
          if (!certs) {
            certs = defaultCertificates;
            updates.certificates = defaultCertificates;
          }
          try {
            await updateDoc(docRef, updates);
          } catch (err) {
            console.error("Error seeding initial documents:", err);
          }
        }

        setDocuments(docs || []);
        setCertificates(certs || []);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error subscribing to documents:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, customCategory: string = 'Other') => {
    if (e.target.files && e.target.files.length > 0 && uid) {
      const file = e.target.files[0];
      const newDoc = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: file.name,
        category: customCategory,
        time: 'Just now',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url: '#'
      };

      try {
        const docRef = doc(db, 'marketplace_jobseekers', uid);
        await updateDoc(docRef, {
          documents: arrayUnion(newDoc),
          activity: arrayUnion({
            id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            action: 'Document Uploaded',
            timestamp: new Date().toISOString(),
            details: `Uploaded document: ${file.name} under category ${customCategory}`
          })
        });
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } catch (err) {
        console.error("Error saving document:", err);
      }
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!uid) return;
    const itemToDelete = documents.find(d => d.id === docId);
    if (!itemToDelete) return;

    const updatedDocs = documents.filter(d => d.id !== docId);

    try {
      const docRef = doc(db, 'marketplace_jobseekers', uid);
      await updateDoc(docRef, {
        documents: updatedDocs,
        activity: arrayUnion({
          id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          action: 'Document Deleted',
          timestamp: new Date().toISOString(),
          details: `Deleted document: ${itemToDelete.name}`
        })
      });
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  };

  // Folders list calculated dynamically
  const foldersList: DocFolder[] = [
    { name: 'Resume', category: 'Resume', count: documents.filter(d => d.category === 'Resume').length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Certificates', category: 'Certificate', count: certificates.length + documents.filter(d => d.category === 'Certificate').length, icon: Award, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { name: 'Portfolio', category: 'Portfolio', count: documents.filter(d => d.category === 'Portfolio').length, icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Identity Documents', category: 'Identity', count: documents.filter(d => d.category === 'Identity').length, icon: UserSquare, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Other Documents', category: 'Other', count: documents.filter(d => d.category === 'Other').length, icon: Folder, color: 'text-pink-500', bg: 'bg-pink-500/10' }
  ];

  // Filtered files
  const filteredFiles = activeCategory
    ? documents.filter(d => d.category.toLowerCase().includes(activeCategory.toLowerCase().substring(0, 4)))
    : documents;

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-app-muted font-mono">Loading documents from Firestore...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with Upload Trigger Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text tracking-tight">Documents</h1>
          <p className="text-app-muted text-sm mt-1">Manage and preview all your career documents and credentials securely in Firestore.</p>
        </div>

        <div className="flex items-center gap-3">
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="px-3 py-2 bg-app-surface hover:bg-app-surface/80 text-[10px] font-bold text-app-text border border-app-border rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Clear Filter
            </button>
          )}

          <div className="relative overflow-hidden">
            <input
              type="file"
              id="doc-uploader"
              onChange={(e) => handleUpload(e, activeCategory || 'Other')}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <label
              htmlFor="doc-uploader"
              className="px-4 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-xs font-bold text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-brand-blue/20"
            >
              <Plus className="w-4 h-4" /> Upload To {activeCategory || 'Other'}
            </label>
          </div>
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
            <CheckCircle2 className="w-4.5 h-4.5" /> Document uploaded and saved to Firestore successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Documents Folders Grid layout) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest block pl-1">Document Folders</span>
            {activeCategory && (
              <span className="text-[10px] font-mono text-brand-blue font-bold">Filtered by: {activeCategory}</span>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {foldersList.map((folder, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveCategory(folder.category)}
                className={`p-5 rounded-2xl bg-app-surface border card-shadow flex flex-col justify-between h-40 transition-all cursor-pointer select-none ${
                  activeCategory === folder.category 
                    ? 'border-brand-blue ring-1 ring-brand-blue bg-brand-blue/5' 
                    : 'border-app-border hover:border-brand-blue/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-xl ${folder.bg} flex items-center justify-center ${folder.color}`}>
                    <folder.icon className="w-5.5 h-5.5" />
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCategory(folder.category);
                    }}
                    className="p-1 text-app-muted hover:text-app-text rounded-lg"
                  >
                    <MoreVertical className="w-4.5 h-4.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-extrabold text-app-text block leading-tight">{folder.name}</span>
                  <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider">{folder.count} {folder.count === 1 ? 'file' : 'files'}</span>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCategory(folder.category);
                  }}
                  className="text-[10px] font-extrabold text-brand-blue hover:text-brand-violet transition-colors text-left uppercase tracking-wider"
                >
                  {activeCategory === folder.category ? 'Active Folder' : 'View Files'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Files list layout) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest block pl-1">
              {activeCategory ? `${activeCategory} Files` : 'All Documents'}
            </span>
            {activeCategory && (
              <button 
                onClick={() => setActiveCategory(null)}
                className="text-[10px] font-bold text-brand-blue hover:underline cursor-pointer"
              >
                Show All
              </button>
            )}
          </div>
          
          <div className="p-5 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-4 flex flex-col h-fit">
            <div className="space-y-3 min-h-[220px]">
              {filteredFiles.length === 0 ? (
                <div className="py-12 text-center text-app-muted flex flex-col items-center justify-center space-y-3">
                  <Folder className="w-8 h-8 opacity-30 text-app-muted" />
                  <p className="text-[11px] font-bold uppercase tracking-wider">No files in this folder</p>
                  <p className="text-[10px] opacity-75">Upload a new file to populate this section.</p>
                </div>
              ) : (
                filteredFiles.map((file, idx) => (
                  <div 
                    key={file.id || idx} 
                    className="p-3.5 rounded-2xl bg-app-bg hover:bg-app-surface border border-app-border flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-app-text block truncate leading-tight" title={file.name}>{file.name}</span>
                        <span className="text-[9px] font-bold text-app-muted uppercase mt-0.5 block">{file.category} • {file.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[9px] font-mono font-bold text-app-muted hidden sm:inline">{file.size}</span>
                      <button 
                        onClick={() => handleDeleteDocument(file.id)}
                        className="p-2 bg-app-surface/50 border border-app-border text-app-muted hover:text-red-500 hover:border-red-500/20 rounded-lg transition-colors cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={() => setActiveCategory(null)}
              className="w-full py-3 bg-app-bg hover:bg-app-surface border border-app-border rounded-xl text-xs font-bold text-app-text hover:text-brand-blue transition-all uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
