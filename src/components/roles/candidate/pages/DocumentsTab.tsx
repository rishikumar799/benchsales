import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Folder, 
  FileText, 
  Award, 
  Briefcase, 
  UserSquare, 
  Download,
  Trash2,
  Plus,
  CheckCircle2,
  Eye,
  X,
  RefreshCw,
  Image as ImageIcon,
  ExternalLink,
  ShieldAlert,
  FileCheck,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';
import { 
  uploadCandidateDocument, 
  deleteCandidateDocument, 
  replaceCandidateDocument,
  DocumentMetadata 
} from '../../../../services/documentStorageService';

interface DocFolder {
  name: string;
  category: string;
  count: number;
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
}

export default function DocumentsTab() {
  const { user, userProfile } = useAuth();
  const uid = user?.uid || userProfile?.uid;
  
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Modal states
  const [previewDoc, setPreviewDoc] = useState<DocumentMetadata | any | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const [replacingDocItem, setReplacingDocItem] = useState<DocumentMetadata | any | null>(null);

  // Requirement 1 & 5: Real-time Firestore Sync strictly bound to authenticated user's uid
  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const userDocRef = doc(db, 'marketplace_jobseekers', uid);
    
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const docs: any[] = data.documents || [];

        // Requirement 5: Verify all documents belong to current user
        const userDocs = docs.map((d: any) => ({
          ...d,
          ownerUid: d.ownerUid || uid, // backfill missing ownerUid if legacy record
          fileName: d.fileName || d.name || 'Document',
          name: d.fileName || d.name || 'Document',
          downloadURL: d.downloadURL || d.url || '',
          url: d.downloadURL || d.url || '',
          category: d.category || 'Other',
          fileSize: d.fileSize || d.size || '0 KB',
          size: d.fileSize || d.size || '0 KB'
        }));

        setDocuments(userDocs);
      } else {
        setDocuments([]);
      }
      setLoading(false);
    }, (error: any) => {
      console.error("Firestore document subscription error:", error);
      setErrorMessage(`Realtime sync error: ${error?.message || error?.code || String(error)}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  // Requirement 1: Upload handler (Firebase Storage + Realtime Firestore)
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, customCategory: string = 'Other') => {
    if (!e.target.files || e.target.files.length === 0 || !uid) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    setErrorMessage(null);

    try {
      const metadata = await uploadCandidateDocument(file, customCategory, {
        uid,
        fullName: userProfile?.fullName || user?.displayName || 'Job Seeker',
        email: userProfile?.email || user?.email || '',
        role: userProfile?.role || 'marketplace_jobseeker'
      });

      setUploadSuccess(`Document "${metadata.fileName}" uploaded successfully!`);
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err: any) {
      console.error("Document upload failed:", err);
      // Requirement 9: Report exact Storage error
      setErrorMessage(err?.message || 'Failed to upload document.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // Requirement 4 & 6: Replace handler
  const handleTriggerReplace = (docItem: DocumentMetadata | any) => {
    setReplacingDocItem(docItem);
    if (replaceFileInputRef.current) {
      replaceFileInputRef.current.value = '';
      replaceFileInputRef.current.click();
    }
  };

  const handleExecuteReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !uid || !replacingDocItem) return;

    const file = e.target.files[0];
    setIsUploading(true);
    setErrorMessage(null);

    try {
      const newDoc = await replaceCandidateDocument(replacingDocItem, file, {
        uid,
        fullName: userProfile?.fullName || user?.displayName || 'Job Seeker',
        email: userProfile?.email || user?.email || '',
        role: userProfile?.role || 'marketplace_jobseeker'
      });

      setUploadSuccess(`Successfully replaced document with "${newDoc.fileName}"!`);
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err: any) {
      console.error("Document replacement failed:", err);
      setErrorMessage(err?.message || 'Failed to replace document.');
    } finally {
      setIsUploading(false);
      setReplacingDocItem(null);
      e.target.value = '';
    }
  };

  // Requirement 4: Delete handler (Deletes Storage file + Firestore metadata)
  const handleDeleteDocument = async (docItem: DocumentMetadata | any) => {
    if (!uid) return;
    setErrorMessage(null);

    try {
      await deleteCandidateDocument(docItem, uid);

      if (previewDoc && (previewDoc.documentId === docItem.documentId || previewDoc.id === docItem.id)) {
        setPreviewDoc(null);
      }

      setUploadSuccess(`Deleted "${docItem.fileName || docItem.name}".`);
      setTimeout(() => setUploadSuccess(null), 3000);
    } catch (err: any) {
      console.error("Document delete error:", err);
      setErrorMessage(err?.message || 'Failed to delete document.');
    }
  };

  // Requirement 2 & 9: Download handler with accurate error messages
  const handleDownload = async (docItem: DocumentMetadata | any) => {
    const fileUrl = docItem.downloadURL || docItem.url;
    const fileName = docItem.fileName || docItem.name || 'document';

    if (!fileUrl) {
      setErrorMessage("Download error: No download URL is associated with this document.");
      return;
    }

    try {
      // Check network connectivity first
      if (!navigator.onLine) {
        throw new Error("No internet connection detected. Please reconnect and try again.");
      }

      // Try fetching blob directly for trigger download
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Storage server returned HTTP status ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (fetchErr: any) {
      console.warn("Direct blob fetch download encountered issue, attempting fallback opening:", fetchErr);
      
      // Fallback: If URL is valid http link, trigger open in new tab
      if (fileUrl.startsWith('http')) {
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Requirement 2 & 9: Display actual error message instead of generic "Check Internet"
        setErrorMessage(`Download failed: ${fetchErr?.message || fetchErr?.code || String(fetchErr)}`);
      }
    }
  };

  // Folders list calculated dynamically
  const foldersList: DocFolder[] = [
    { name: 'Resumes', category: 'Resume', count: documents.filter(d => d.category === 'Resume').length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Certificates', category: 'Certificate', count: documents.filter(d => d.category === 'Certificate').length, icon: Award, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { name: 'Portfolio', category: 'Portfolio', count: documents.filter(d => d.category === 'Portfolio').length, icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Identity', category: 'Identity', count: documents.filter(d => d.category === 'Identity').length, icon: UserSquare, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Other', category: 'Other', count: documents.filter(d => d.category === 'Other').length, icon: Folder, color: 'text-pink-500', bg: 'bg-pink-500/10' }
  ];

  // Filtered files
  const filteredFiles = activeCategory
    ? documents.filter(d => d.category?.toLowerCase() === activeCategory.toLowerCase())
    : documents;

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-app-muted font-mono">Synchronizing documents from Firebase Storage...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Hidden file input for Replace */}
      <input 
        type="file" 
        ref={replaceFileInputRef} 
        onChange={handleExecuteReplace} 
        className="hidden" 
      />

      {/* 1. Header with Upload Trigger Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text tracking-tight">Document Manager</h1>
          <p className="text-app-muted text-sm mt-1">Manage, preview, download, and organize all your career documents.</p>
        </div>

        <div className="flex items-center gap-3">
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="px-3 py-2 bg-app-surface hover:bg-app-surface/80 text-xs font-bold text-app-text border border-app-border rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Clear Filter
            </button>
          )}

          <div className="relative overflow-hidden">
            <input
              type="file"
              id="doc-uploader"
              disabled={isUploading}
              onChange={(e) => handleUpload(e, activeCategory || 'Other')}
              className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <label
              htmlFor="doc-uploader"
              className={`px-4 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-xs font-bold text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-brand-blue/20 ${
                isUploading ? 'opacity-70 pointer-events-none' : ''
              }`}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading to Storage...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Upload Document {activeCategory ? `(${activeCategory})` : ''}</span>
                </>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Status Alerts */}
      <AnimatePresence>
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 font-bold text-xs flex items-center gap-2 border border-emerald-500/15"
          >
            <CheckCircle2 className="w-4.5 h-4.5 shrink-0" /> {uploadSuccess}
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-red-500/10 text-red-500 font-bold text-xs flex items-center justify-between border border-red-500/15"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="text-red-500 hover:text-red-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Documents Folders Grid layout) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest block pl-1">Document Folders</span>
            {activeCategory && (
              <span className="text-[10px] font-mono text-brand-blue font-bold">Filtered: {activeCategory}</span>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {foldersList.map((folder, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveCategory(activeCategory === folder.category ? null : folder.category)}
                className={`p-4 rounded-2xl bg-app-surface border flex items-center justify-between transition-all cursor-pointer select-none ${
                  activeCategory === folder.category 
                    ? 'border-brand-blue ring-2 ring-brand-blue/20 bg-brand-blue/5' 
                    : 'border-app-border hover:border-brand-blue/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${folder.bg} flex items-center justify-center ${folder.color} shrink-0`}>
                    <folder.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-app-text block leading-tight">{folder.name}</span>
                    <span className="text-[10px] font-semibold text-app-muted">{folder.count} {folder.count === 1 ? 'file' : 'files'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                    activeCategory === folder.category 
                      ? 'bg-brand-blue text-white' 
                      : 'bg-app-bg text-app-muted'
                  }`}>
                    {activeCategory === folder.category ? 'Active' : 'Filter'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Files list layout) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest block pl-1">
              {activeCategory ? `${activeCategory} Files (${filteredFiles.length})` : `All Documents (${documents.length})`}
            </span>
            {activeCategory && (
              <button 
                onClick={() => setActiveCategory(null)}
                className="text-[10px] font-bold text-brand-blue hover:underline cursor-pointer"
              >
                Show All Files
              </button>
            )}
          </div>
          
          <div className="p-5 rounded-2xl bg-app-surface border border-app-border card-shadow space-y-3">
            {filteredFiles.length === 0 ? (
              <div className="py-12 text-center text-app-muted flex flex-col items-center justify-center space-y-3">
                <Folder className="w-10 h-10 opacity-30 text-app-muted" />
                <p className="text-xs font-bold uppercase tracking-wider">No files in {activeCategory || 'this section'}</p>
                <p className="text-[11px] opacity-75">Upload a document to populate this folder.</p>
              </div>
            ) : (
              filteredFiles.map((file) => {
                const fileName = file.fileName || file.name || 'Document';
                const fileCat = file.category || 'Other';
                const fileSize = file.fileSize || file.size || '0 KB';
                const fileTime = file.time || 'Uploaded';

                return (
                  <div 
                    key={file.documentId || file.id} 
                    className="p-4 rounded-xl bg-app-bg hover:bg-app-surface border border-app-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 group transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
                        {fileName.endsWith('.pdf') ? (
                          <FileText className="w-5 h-5 text-red-500" />
                        ) : fileName.match(/\.(jpg|jpeg|png|webp|svg)$/i) ? (
                          <ImageIcon className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <FileSpreadsheet className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-app-text block truncate leading-tight" title={fileName}>
                          {fileName}
                        </span>
                        <span className="text-[10px] font-medium text-app-muted uppercase mt-0.5 block">
                          {fileCat} • {fileSize} • {fileTime}
                        </span>
                      </div>
                    </div>

                    {/* Actions buttons */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-app-border w-full sm:w-auto justify-end">
                      {/* View Button */}
                      <button
                        onClick={() => setPreviewDoc(file)}
                        className="px-2.5 py-1.5 bg-brand-blue/10 hover:bg-brand-blue hover:text-white text-brand-blue text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        title="View Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      {/* Download Button */}
                      <button
                        onClick={() => handleDownload(file)}
                        className="px-2.5 py-1.5 bg-app-surface border border-app-border hover:bg-slate-200 dark:hover:bg-slate-800 text-app-text text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>

                      {/* Replace Button */}
                      <button
                        onClick={() => handleTriggerReplace(file)}
                        className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500 hover:text-white text-amber-600 dark:text-amber-400 text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        title="Replace Document"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Replace</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteDocument(file)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-app-surface border border-app-border rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-app-border flex items-center justify-between bg-app-bg/50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-brand-blue/10 rounded-lg text-brand-blue shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-app-text truncate">
                      {previewDoc.fileName || previewDoc.name}
                    </h3>
                    <p className="text-[10px] text-app-muted font-medium">
                      {previewDoc.category} • {previewDoc.fileSize || previewDoc.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDownload(previewDoc)}
                    className="px-3 py-1.5 bg-brand-blue text-white text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-brand-blue/90 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="p-1.5 text-app-muted hover:text-app-text rounded-lg bg-app-bg hover:bg-app-surface border border-app-border cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Requirement 3: Modal Preview Content - Replaced iframe with <object> for PDFs to prevent Chrome block errors */}
              <div className="p-6 overflow-y-auto flex-grow flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 min-h-[380px]">
                {(previewDoc.fileName || previewDoc.name || '').endsWith('.pdf') || previewDoc.mimeType === 'application/pdf' || previewDoc.type === 'application/pdf' ? (
                  <div className="w-full h-[500px] relative rounded-xl overflow-hidden border border-app-border bg-white shadow-inner">
                    <object
                      data={previewDoc.downloadURL || previewDoc.url}
                      type="application/pdf"
                      className="w-full h-full rounded-xl"
                    >
                      {/* Fallback container if browser PDF plugin is blocked or restricted */}
                      <div className="p-8 text-center flex flex-col items-center justify-center h-full space-y-4 bg-app-bg">
                        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center">
                          <FileText className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="font-bold text-app-text text-sm">{previewDoc.fileName || previewDoc.name}</h4>
                          <p className="text-xs text-app-muted mt-1 max-w-md">
                            Inline PDF preview controls. Click below to view the full PDF document directly in a clean viewer window or download it.
                          </p>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                          <a
                            href={previewDoc.downloadURL || previewDoc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-brand-blue text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-md hover:bg-brand-blue/90"
                          >
                            <ExternalLink className="w-4 h-4" /> Open PDF in New Window
                          </a>
                          <button
                            onClick={() => handleDownload(previewDoc)}
                            className="px-4 py-2 bg-app-surface border border-app-border text-app-text text-xs font-bold rounded-xl inline-flex items-center gap-1.5 hover:bg-app-bg"
                          >
                            <Download className="w-4 h-4" /> Download PDF
                          </button>
                        </div>
                      </div>
                    </object>
                  </div>
                ) : (previewDoc.fileName || previewDoc.name || '').match(/\.(jpg|jpeg|png|webp|svg)$/i) || (previewDoc.mimeType || previewDoc.type || '').startsWith('image/') ? (
                  <img 
                    src={previewDoc.downloadURL || previewDoc.url} 
                    alt={previewDoc.fileName || previewDoc.name} 
                    className="max-h-[480px] max-w-full object-contain rounded-xl shadow-md mx-auto"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      console.error("Image render failed for document:", previewDoc);
                    }}
                  />
                ) : (previewDoc.fileName || previewDoc.name || '').match(/\.(doc|docx)$/i) ? (
                  <div className="w-full h-[500px] relative rounded-xl overflow-hidden border border-app-border bg-white shadow-inner flex flex-col items-center justify-center p-8 text-center space-y-4">
                    <FileText className="w-16 h-16 text-blue-500" />
                    <div>
                      <h4 className="font-bold text-app-text text-sm">{previewDoc.fileName || previewDoc.name}</h4>
                      <p className="text-xs text-app-muted mt-1">Microsoft Word Document ({previewDoc.fileSize || previewDoc.size})</p>
                    </div>
                    <button
                      onClick={() => handleDownload(previewDoc)}
                      className="px-5 py-2.5 bg-brand-blue text-white font-bold text-xs rounded-xl shadow-lg hover:bg-brand-blue/90 inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> Download Word Document
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-4 py-8 max-w-md">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center mx-auto">
                      <FileCheck className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-app-text">{previewDoc.fileName || previewDoc.name}</p>
                      <p className="text-xs text-app-muted mt-1">
                        Document format ({previewDoc.category}). Download the document below to inspect content.
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(previewDoc)}
                      className="px-5 py-2.5 bg-brand-blue text-white font-bold text-xs rounded-xl shadow-lg hover:bg-brand-blue/90 inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> Download File
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
