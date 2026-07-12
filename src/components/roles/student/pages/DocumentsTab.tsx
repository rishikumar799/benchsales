import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Download, 
  Eye, 
  X,
  CheckCircle,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { db, storage, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useAuth } from '../../../../context/AuthContext';

export default function DocumentsTab() {
  const { userProfile } = useAuth();
  const studentId = userProfile?.uid;
  const organizationId = userProfile?.organizationId;

  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Upload Modal States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState('Resume');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Listen to Student Profile document for documents metadata
  useEffect(() => {
    if (!organizationId || !studentId) return;
    const docRef = doc(db, 'organizations_universities', organizationId, 'students', studentId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setStudentData(snapshot.data());
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `organizations_universities/${organizationId}/students/${studentId}`);
    });
    return () => unsubscribe();
  }, [organizationId, studentId]);

  // Handle Drag events for file upload
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !organizationId || !studentId) return;

    setUploading(true);
    try {
      const timestamp = Date.now();
      const safeFileName = `${timestamp}_${selectedFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      
      // Upload file to Firebase Storage
      const fileRef = ref(storage, `organizations_universities/${organizationId}/students/${studentId}/documents/${safeFileName}`);
      const uploadResult = await uploadBytes(fileRef, selectedFile);
      const fileUrl = await getDownloadURL(uploadResult.ref);

      // Save metadata to Firestore student document
      const docRef = doc(db, 'organizations_universities', organizationId, 'students', studentId);
      const newDocMetadata = {
        name: fileName || selectedFile.name,
        storagePath: `organizations_universities/${organizationId}/students/${studentId}/documents/${safeFileName}`,
        category,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        size: formatBytes(selectedFile.size),
        url: fileUrl,
        uploadedAt: new Date().toISOString()
      };

      await updateDoc(docRef, {
        documents: arrayUnion(newDocMetadata),
        // If they uploaded a resume, also update the main student doc resume field
        ...(category === 'Resume' ? { resume: fileUrl } : {})
      });

      setIsUploadOpen(false);
      setSelectedFile(null);
      setFileName('');
      alert('Document uploaded successfully!');
    } catch (error: any) {
      console.error(error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docItem: any) => {
    if (!organizationId || !studentId) return;
    if (!confirm(`Are you sure you want to permanently delete: ${docItem.name}?`)) return;

    try {
      // 1. Delete from Firebase Storage if path exists
      if (docItem.storagePath) {
        const fileRef = ref(storage, docItem.storagePath);
        await deleteObject(fileRef).catch(err => {
          console.warn("Storage delete failed, proceeding to Firestore: ", err);
        });
      }

      // 2. Delete metadata from student document
      const docRef = doc(db, 'organizations_universities', organizationId, 'students', studentId);
      await updateDoc(docRef, {
        documents: arrayRemove(docItem),
        // If it was the resume, clear the main student doc resume field
        ...(docItem.category === 'Resume' ? { resume: '' } : {})
      });

      alert('Document deleted successfully!');
    } catch (error: any) {
      alert(`Failed to delete document: ${error.message}`);
    }
  };

  const documents = studentData?.documents || [];

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
          onClick={() => setIsUploadOpen(true)}
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
                documents.map((docItem: any, idx: number) => (
                  <tr key={idx} className="hover:bg-app-surface/30 transition-colors">
                    
                    {/* Document title */}
                    <td className="p-4.5 pl-6 font-semibold text-app-text flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <a 
                        href={docItem.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="font-bold text-sm text-app-text hover:text-brand-blue transition-colors cursor-pointer"
                      >
                        {docItem.name}
                      </a>
                    </td>

                    {/* Category column */}
                    <td className="p-4.5 text-xs font-bold text-app-muted">
                      <span className="bg-app-bg text-app-muted px-2.5 py-1 rounded-md border border-app-border">
                        {docItem.category}
                      </span>
                    </td>

                    {/* Date column */}
                    <td className="p-4.5 text-xs font-semibold text-app-muted">
                      {docItem.date}
                    </td>

                    {/* Size column */}
                    <td className="p-4.5 text-xs font-bold text-app-muted">
                      {docItem.size}
                    </td>

                    {/* Actions column */}
                    <td className="p-4.5 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <a 
                          href={docItem.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 hover:bg-brand-blue/10 rounded-lg text-app-muted hover:text-brand-blue transition-all"
                          title="View inline"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <a 
                          href={docItem.url}
                          download={docItem.name}
                          className="p-2 hover:bg-brand-blue/10 rounded-lg text-app-muted hover:text-brand-blue transition-all"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => handleDelete(docItem)}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-app-muted hover:text-red-500 transition-all"
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
                    {loading ? "Loading documents..." : "No documents uploaded yet. Click 'Upload Document' to add your first file."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real File Upload Modal */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-app-bg/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass border border-app-border rounded-[28px] overflow-hidden card-shadow flex flex-col"
            >
              <div className="p-6 border-b border-app-border/40 flex justify-between items-center bg-app-surface/20">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-brand-blue" />
                  <h3 className="font-display font-bold text-lg text-app-text-active">Upload Document</h3>
                </div>
                <button 
                  onClick={() => setIsUploadOpen(false)}
                  className="p-1.5 hover:bg-app-surface border border-app-border rounded-xl text-app-muted hover:text-app-text"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
                
                {/* Drag and Drop Zone */}
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    dragActive 
                      ? 'border-brand-blue bg-brand-blue/5' 
                      : 'border-app-border hover:border-brand-blue/40 bg-app-surface/30'
                  }`}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  />
                  <div className="flex flex-col items-center gap-2.5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    {selectedFile ? (
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-app-text truncate max-w-[280px]">{selectedFile.name}</p>
                        <p className="text-xs text-app-muted font-semibold">{formatBytes(selectedFile.size)}</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-app-text">Drag & drop your file here</p>
                        <p className="text-xs text-app-muted font-medium">or click to browse from system (Max 10MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional file fields */}
                {selectedFile && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-app-muted uppercase block mb-1">Document Display Name</label>
                      <input 
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full bg-app-surface/60 border border-app-border rounded-xl px-4 py-2.5 text-sm text-app-text focus:outline-none focus:border-brand-blue"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-app-muted uppercase block mb-1">Document Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-app-surface/60 border border-app-border rounded-xl px-4 py-2.5 text-sm text-app-text focus:outline-none focus:border-brand-blue cursor-pointer"
                      >
                        <option value="Resume">Resume</option>
                        <option value="Academic Certificate">Academic Certificate</option>
                        <option value="Mark Sheets">Mark Sheets</option>
                        <option value="Internship Certificate">Internship Certificate</option>
                        <option value="Placement Documents">Placement Documents</option>
                        <option value="Other Documents">Other Documents</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-app-border/40">
                  <button 
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    className="px-5 py-2.5 bg-app-surface hover:bg-app-surface/80 border border-app-border text-app-text font-bold rounded-xl text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={!selectedFile || uploading}
                    className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue-dark disabled:bg-brand-blue/50 text-white font-extrabold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm shadow-brand-blue/20"
                  >
                    {uploading ? "Uploading file..." : "Complete Upload"}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
