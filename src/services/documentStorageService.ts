import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from 'firebase/firestore';
import { db, storage, handleFirestoreError, OperationType } from '../firebase/firebase';

export interface DocumentMetadata {
  documentId: string;
  id: string; // backward-compatibility
  ownerUid: string;
  ownerRole: string;
  ownerName: string;
  category: string; // 'Resume' | 'Certificate' | 'Portfolio' | 'Identity' | 'Other'
  fileName: string;
  name: string; // backward-compatibility
  fileType: string;
  type: string; // backward-compatibility
  mimeType: string;
  extension: string;
  storagePath: string;
  downloadURL: string;
  url: string; // backward-compatibility
  fileSize: string;
  sizeBytes: number;
  size: string; // backward-compatibility
  uploadedAt: string;
  updatedAt: string;
  time: string;
  status: 'active' | 'archived';
  visibility: 'private' | 'public' | 'recruiters_only';
  createdBy: string;
  lastModifiedBy: string;
}

// Utility to format byte size nicely
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Extract file extension
export function getFileExtension(fileName: string): string {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

/**
 * Upload a candidate document to Firebase Storage & persist metadata in Firestore
 */
export async function uploadCandidateDocument(
  file: File,
  category: string = 'Other',
  user: { uid: string; fullName?: string; email?: string; role?: string }
): Promise<DocumentMetadata> {
  if (!user || !user.uid) {
    throw new Error('User authentication required for document upload.');
  }

  const uid = user.uid;
  const documentId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const extension = getFileExtension(file.name);
  
  // Requirement 6: Isolated directory structure: /applicants/{uid}/documents/{documentId}_{fileName}
  const storagePath = `applicants/${uid}/documents/${documentId}_${cleanFileName}`;
  const storageRef = ref(storage, storagePath);

  try {
    // 1. Upload bytes to Firebase Storage
    const uploadResult = await uploadBytes(storageRef, file, {
      contentType: file.type || 'application/octet-stream',
      customMetadata: {
        ownerUid: uid,
        category: category,
        uploadedAt: new Date().toISOString()
      }
    });

    // 2. Fetch public/signed download URL
    const downloadURL = await getDownloadURL(uploadResult.ref);

    const nowISO = new Date().toISOString();
    const formattedSize = formatFileSize(file.size);

    // Requirement 7: Comprehensive Firestore Metadata Schema
    const metadata: DocumentMetadata = {
      documentId,
      id: documentId,
      ownerUid: uid,
      ownerRole: user.role || 'marketplace_jobseeker',
      ownerName: user.fullName || 'Job Seeker',
      category: category || 'Other',
      fileName: file.name,
      name: file.name,
      fileType: file.type || 'application/octet-stream',
      type: file.type || 'application/octet-stream',
      mimeType: file.type || 'application/octet-stream',
      extension,
      storagePath,
      downloadURL,
      url: downloadURL,
      fileSize: formattedSize,
      sizeBytes: file.size,
      size: formattedSize,
      uploadedAt: nowISO,
      updatedAt: nowISO,
      time: 'Just now',
      status: 'active',
      visibility: category === 'Resume' || category === 'Portfolio' ? 'recruiters_only' : 'private',
      createdBy: uid,
      lastModifiedBy: uid
    };

    // 3. Update Firestore Document (Realtime listener will pick this up automatically)
    const userDocRef = doc(db, 'marketplace_jobseekers', uid);
    
    // Check if user doc exists
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      await updateDoc(userDocRef, {
        documents: arrayUnion(metadata),
        activity: arrayUnion({
          id: `act_${Date.now()}`,
          action: 'Document Uploaded',
          timestamp: nowISO,
          details: `Uploaded document: ${file.name} under ${category}`
        }),
        updatedAt: nowISO
      });
    } else {
      await setDoc(userDocRef, {
        profile: {
          uid,
          fullName: user.fullName || 'Job Seeker',
          email: user.email || ''
        },
        documents: [metadata],
        activity: [{
          id: `act_${Date.now()}`,
          action: 'Document Uploaded',
          timestamp: nowISO,
          details: `Uploaded document: ${file.name} under ${category}`
        }],
        createdAt: nowISO,
        updatedAt: nowISO
      });
    }

    return metadata;
  } catch (error: any) {
    console.error(`Firebase Storage upload error for ${file.name}:`, error);
    throw new Error(`Upload failed: ${error?.message || error?.code || String(error)}`);
  }
}

/**
 * Delete candidate document from Firebase Storage and Firestore
 */
export async function deleteCandidateDocument(
  docItem: DocumentMetadata | any,
  uid: string
): Promise<void> {
  if (!uid) throw new Error('User authentication required for deletion.');

  const docId = docItem.documentId || docItem.id;
  const storagePath = docItem.storagePath;

  // 1. Delete Storage Object if path exists (Requirement 4: No orphan files)
  if (storagePath) {
    try {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
    } catch (storageErr: any) {
      // If object was already deleted or doesn't exist, log warning and proceed with metadata cleanup
      console.warn(`Storage object deletion notice (${storagePath}):`, storageErr?.message || storageErr);
    }
  }

  // 2. Remove document metadata from Firestore
  try {
    const userDocRef = doc(db, 'marketplace_jobseekers', uid);
    const snap = await getDoc(userDocRef);

    if (snap.exists()) {
      const data = snap.data();
      const existingDocs: any[] = data.documents || [];
      const updatedDocs = existingDocs.filter(d => (d.documentId || d.id) !== docId);

      await updateDoc(userDocRef, {
        documents: updatedDocs,
        activity: arrayUnion({
          id: `act_${Date.now()}`,
          action: 'Document Deleted',
          timestamp: new Date().toISOString(),
          details: `Deleted document: ${docItem.fileName || docItem.name || 'File'}`
        }),
        updatedAt: new Date().toISOString()
      });
    }
  } catch (firestoreErr) {
    handleFirestoreError(firestoreErr, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
  }
}

/**
 * Replace existing document with a new file
 */
export async function replaceCandidateDocument(
  oldDocItem: DocumentMetadata | any,
  newFile: File,
  user: { uid: string; fullName?: string; email?: string; role?: string }
): Promise<DocumentMetadata> {
  const uid = user.uid;

  // 1. Upload new file first
  const newMetadata = await uploadCandidateDocument(newFile, oldDocItem.category || 'Other', user);

  // 2. Delete old document
  await deleteCandidateDocument(oldDocItem, uid);

  return newMetadata;
}

/**
 * Upload profile photo to Firebase Storage and update Firestore in real time
 */
export async function uploadCandidateProfilePhoto(
  file: File,
  uid: string,
  userFullName?: string
): Promise<string> {
  if (!uid) throw new Error('Authentication required for profile photo upload.');

  const extension = getFileExtension(file.name) || 'jpg';
  // Requirement 6: Storage path /applicants/{uid}/profile/...
  const storagePath = `applicants/${uid}/profile/avatar_${Date.now()}.${extension}`;
  const storageRef = ref(storage, storagePath);

  try {
    const uploadResult = await uploadBytes(storageRef, file, {
      contentType: file.type || 'image/jpeg',
      customMetadata: { ownerUid: uid, type: 'profile_photo' }
    });

    const downloadURL = await getDownloadURL(uploadResult.ref);
    const nowISO = new Date().toISOString();

    // Update marketplace_jobseekers
    const candidateDocRef = doc(db, 'marketplace_jobseekers', uid);
    const candidateSnap = await getDoc(candidateDocRef);

    if (candidateSnap.exists()) {
      await updateDoc(candidateDocRef, {
        'profile.profilePhoto': downloadURL,
        'profile.photoURL': downloadURL,
        profilePhoto: downloadURL,
        photoURL: downloadURL,
        updatedAt: nowISO
      });
    } else {
      await setDoc(candidateDocRef, {
        profile: {
          uid,
          fullName: userFullName || 'Job Seeker',
          profilePhoto: downloadURL,
          photoURL: downloadURL
        },
        profilePhoto: downloadURL,
        photoURL: downloadURL,
        createdAt: nowISO,
        updatedAt: nowISO
      }, { merge: true });
    }

    // Update users/{uid} for global system navbar/header sync
    const userDocRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      await updateDoc(userDocRef, {
        photoURL: downloadURL,
        profilePhoto: downloadURL,
        updatedAt: nowISO
      });
    }

    return downloadURL;
  } catch (err: any) {
    console.error("Profile photo upload failed:", err);
    throw new Error(`Profile photo upload error: ${err?.message || err?.code || String(err)}`);
  }
}
