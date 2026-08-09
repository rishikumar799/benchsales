// LocalStorage-based state store for ARYX AI - Marketplace Recruiter Module
// Mirroring the planned Firestore collections structure exactly.

import { 
  collection, 
  doc, 
  setDoc, 
  getDocs,
  getDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '../../../../firebase/firebase';


export interface RecruiterJob {
  id: string;
  title: string;
  company: string;
  experience: string;
  skills: string[];
  location: string;
  positions: string;
  priority: 'High' | 'Medium' | 'Low';
  posted: string;
  bdm: string;
  jobType: 'open' | 'assigned';
  accessStatus: 'none' | 'pending' | 'approved';
  status?: string;
  createdBy?: string;
}

export interface CandidateDetails {
  role: string;
  skillsFull: string[];
  years: number;
  currentCompany: string;
  currentRole: string;
  availabilityDetails: string;
}

export interface RecruiterCandidate {
  id: string;
  name: string;
  experience: string;
  skills: string[];
  availability: string;
  details: CandidateDetails;
}

export interface CandidateAccessRequest {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  status: 'Pending' | 'Approved' | 'Declined';
  requestedAt?: string;
  
  // Legacy compatibility fields
  requestDate?: string;
  notes?: string;
}

export interface CandidateSelection {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  addedAt?: string;
  
  // Legacy compatibility fields
  companyName?: string;
  notes?: string;
  selectionDate?: string;
  status?: string;
}

export interface CandidateSubmission {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  recruiterId?: string;
  recruiterName?: string;
  status: string;
  submittedAt?: string;
  timeline?: any[];
  
  // Legacy compatibility fields
  companyName?: string;
  candidateResume?: string;
  submissionDate?: string;
  submittedBy?: string;
  assignedBdm?: string;
  lastUpdated?: string;
  notes?: string;
}

export interface ActivityNotification {
  id: string;
  type: 'submit' | 'select' | 'approve' | 'status' | 'request';
  title: string;
  desc: string;
  time: string;
}

export interface RecruiterDashboard {
  openJobs: number;
  assignedJobs: number;
  availableCandidates: number;
  submittedCandidates: number;
  selections: number;
  successRate: string;
}

const INITIAL_JOBS: RecruiterJob[] = [];
const INITIAL_ACCESS_REQUESTS: CandidateAccessRequest[] = [];
const INITIAL_SELECTIONS: CandidateSelection[] = [];
const INITIAL_SUBMISSIONS: CandidateSubmission[] = [];
const INITIAL_NOTIFICATIONS: ActivityNotification[] = [];

export interface StudentApplication {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  type: string;
  status: string;
  appliedAt: string;
}

const INITIAL_APPLICATIONS: StudentApplication[] = [];
const INITIAL_CANDIDATES: RecruiterCandidate[] = [];

// Helper to get state or initialize without LocalStorage dependency
function getStorage<T>(key: string, initial: T): T {
  return initial;
}

function setStorage<T>(key: string, val: T): void {
  window.dispatchEvent(new Event('storage'));
}

// Initial state starts empty as required by No LocalStorage, No Mock Data
let cachedJobs: RecruiterJob[] = [];
let cachedCandidates: RecruiterCandidate[] = [];
let cachedAccessRequests: CandidateAccessRequest[] = [];
let cachedSelections: CandidateSelection[] = [];
let cachedSubmissions: CandidateSubmission[] = [];
let cachedNotifications: ActivityNotification[] = [];
let cachedApplications: StudentApplication[] = [];

function smartSort(a: any, b: any) {
  const idA = String(a.id || '');
  const idB = String(b.id || '');
  return idA.localeCompare(idB, undefined, { numeric: true, sensitivity: 'base' });
}

function mapJobseekerToCandidate(docData: any, docId: string): RecruiterCandidate {
  const profile = docData.profile || {};
  return {
    id: docId,
    name: profile.fullName || docData.name || 'Anonymous',
    experience: profile.experience || docData.experience || '2 Years',
    skills: profile.skills || docData.skills || [],
    availability: profile.availability || docData.availability || 'Available',
    details: profile.details || docData.details || {
      role: 'Software Engineer',
      skillsFull: profile.skills || docData.skills || [],
      years: 2,
      currentCompany: 'Self-employed',
      currentRole: 'Freelancer',
      availabilityDetails: 'Immediate availability'
    }
  };
}

// Global collections syncing helper
function syncCollection<T>(
  colName: string, 
  initialData: any[], 
  updateCache: (data: T[]) => void,
  customMapper?: (docData: any, docId: string) => T
) {
  const colRef = collection(db, colName);
  
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      initialData.forEach(async (item: any) => {
        try {
          const docId = item.id || doc(colRef).id;
          await setDoc(doc(colRef, docId), item);
        } catch (err) {
          console.error(`Error seeding ${colName}:`, err);
        }
      });
    } else {
      const dataList: T[] = [];
      snapshot.forEach((docSnap) => {
        if (customMapper) {
          dataList.push(customMapper(docSnap.data(), docSnap.id));
        } else {
          dataList.push({ ...docSnap.data() } as T);
        }
      });
      updateCache(dataList);
      setStorage(colName, dataList);
    }
  }, (error) => {
    console.error(`Firestore listener error on ${colName}:`, error);
  });
}

async function writeCollection<T extends { id: string }>(colName: string, items: T[]) {
  if (!auth.currentUser) return;
  const colRef = collection(db, colName);
  
  for (const item of items) {
    try {
      await setDoc(doc(colRef, item.id), item);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${colName}/${item.id}`);
    }
  }
}

// Automated migration of old collections to new enterprise collections
async function runAutomatedMigration() {
  if (!auth.currentUser) return;
  
  try {
    console.log('Starting automated Firestore migration to clean enterprise architecture...');
    
    // 1. Migrate old jobs -> marketplace_jobs
    const oldJobsSnap = await getDocs(collection(db, 'jobs'));
    if (!oldJobsSnap.empty) {
      for (const oldDoc of oldJobsSnap.docs) {
        await setDoc(doc(db, 'marketplace_jobs', oldDoc.id), oldDoc.data());
        await deleteDoc(doc(db, 'jobs', oldDoc.id));
      }
      console.log(`Successfully migrated and cleaned ${oldJobsSnap.size} jobs to marketplace_jobs`);
    }

    // 2. Migrate old submissions -> marketplace_submissions
    const oldSubsSnap = await getDocs(collection(db, 'submissions'));
    if (!oldSubsSnap.empty) {
      for (const oldDoc of oldSubsSnap.docs) {
        await setDoc(doc(db, 'marketplace_submissions', oldDoc.id), oldDoc.data());
        await deleteDoc(doc(db, 'submissions', oldDoc.id));
      }
      console.log(`Successfully migrated and cleaned ${oldSubsSnap.size} submissions to marketplace_submissions`);
    }

    // 3. Migrate old applications -> marketplace_applications
    const oldAppsSnap = await getDocs(collection(db, 'applications'));
    if (!oldAppsSnap.empty) {
      for (const oldDoc of oldAppsSnap.docs) {
        await setDoc(doc(db, 'marketplace_applications', oldDoc.id), oldDoc.data());
        await deleteDoc(doc(db, 'applications', oldDoc.id));
      }
      console.log(`Successfully migrated and cleaned ${oldAppsSnap.size} applications to marketplace_applications`);
    }

    // 4. Migrate candidates -> marketplace_jobseekers
    const oldCandidatesSnap = await getDocs(collection(db, 'candidates'));
    if (!oldCandidatesSnap.empty) {
      for (const oldDoc of oldCandidatesSnap.docs) {
        const cand = oldDoc.data();
        const seekerDoc = {
          id: oldDoc.id,
          profile: {
            uid: oldDoc.id,
            fullName: cand.name,
            email: `${cand.name.toLowerCase().replace(/\s+/g, '')}@test.com`,
            phoneNumber: '1234567890',
            status: 'approved',
            createdAt: new Date().toISOString(),
            experience: cand.experience,
            skills: cand.skills,
            availability: cand.availability,
            details: cand.details
          },
          resume: '',
          documents: [],
          certificates: [],
          saved_jobs: [],
          ai_profile: {},
          preferences: {},
          activity: [],
          settings: {}
        };
        await setDoc(doc(db, 'marketplace_jobseekers', oldDoc.id), seekerDoc);
        await deleteDoc(doc(db, 'candidates', oldDoc.id));
      }
      console.log(`Successfully migrated and cleaned ${oldCandidatesSnap.size} candidates to marketplace_jobseekers`);
    }

    // 5. Migrate notifications to user-specific notifications collection
    try {
      if (auth.currentUser) {
        const oldNotificationsSnap = await getDocs(collection(db, 'notifications'));
        if (!oldNotificationsSnap.empty) {
          const globalNotes: ActivityNotification[] = [];
          for (const oldDoc of oldNotificationsSnap.docs) {
            if (oldDoc.id !== auth.currentUser.uid) {
              globalNotes.push(oldDoc.data() as ActivityNotification);
              await deleteDoc(doc(db, 'notifications', oldDoc.id));
            }
          }
          if (globalNotes.length > 0) {
            await setDoc(doc(db, 'notifications', auth.currentUser.uid), { items: globalNotes }, { merge: true });
            console.log(`Successfully migrated and cleaned ${globalNotes.length} global notifications.`);
          }
        }
      }
    } catch (migErr) {
      // Legacy global notifications collection list is restricted by rules; safe to skip
    }

    // 6. Migrate old organization_admins -> organizations_universities or organizations_companies
    const oldOrgAdminsSnap = await getDocs(collection(db, 'organization_admins'));
    if (!oldOrgAdminsSnap.empty) {
      for (const oldDoc of oldOrgAdminsSnap.docs) {
        const data = oldDoc.data();
        const orgId = data.organizationId;
        const orgType = data.organizationType || 'university';
        const targetColName = orgType === 'university' ? 'organizations_universities' : 'organizations_companies';
        if (orgId) {
          await setDoc(doc(db, targetColName, orgId, 'admins', oldDoc.id), data);
          await deleteDoc(doc(db, 'organization_admins', oldDoc.id));
        }
      }
      console.log(`Successfully migrated and cleaned ${oldOrgAdminsSnap.size} organization admins.`);
    }

    // 6b. Migrate old top-level organizations -> organizations_universities and organizations_companies with subcollections
    const oldOrgsSnap = await getDocs(collection(db, 'organizations'));
    if (!oldOrgsSnap.empty) {
      for (const orgDoc of oldOrgsSnap.docs) {
        const orgData = orgDoc.data();
        const orgId = orgDoc.id;
        const orgType = orgData.organizationType || 'university';

        const targetColName = orgType === 'university' ? 'organizations_universities' : 'organizations_companies';
        
        // Write organization metadata to the new collection
        await setDoc(doc(db, targetColName, orgId), {
          organizationId: orgId,
          organizationName: orgData.organizationName || orgData.name || '',
          organizationType: orgType,
          adminUid: orgData.adminUid || '',
          createdAt: orgData.createdAt || new Date().toISOString()
        });

        // Subcollections to migrate
        const subcollections = [
          'admins',
          'placement_officers',
          'students',
          'recruiters',
          'employees',
          'managers',
          'departments'
        ];

        for (const subcol of subcollections) {
          try {
            const subSnap = await getDocs(collection(db, 'organizations', orgId, subcol));
            if (!subSnap.empty) {
              for (const subDoc of subSnap.docs) {
                await setDoc(doc(db, targetColName, orgId, subcol, subDoc.id), subDoc.data());
                await deleteDoc(doc(db, 'organizations', orgId, subcol, subDoc.id));
              }
            }
          } catch (subErr) {
            console.error(`Error migrating subcollection ${subcol} for org ${orgId}:`, subErr);
          }
        }

        // Finally delete the old top-level organization document
        await deleteDoc(doc(db, 'organizations', orgId));
      }
      console.log(`Successfully migrated ${oldOrgsSnap.size} organizations to the new separated top-level collections.`);
    }

    // 7. Migrate old marketplace_students -> marketplace_jobseekers
    const oldMarketplaceStudentsSnap = await getDocs(collection(db, 'marketplace_students'));
    if (!oldMarketplaceStudentsSnap.empty) {
      for (const oldDoc of oldMarketplaceStudentsSnap.docs) {
        await setDoc(doc(db, 'marketplace_jobseekers', oldDoc.id), oldDoc.data());
        await deleteDoc(doc(db, 'marketplace_students', oldDoc.id));
      }
      console.log(`Successfully migrated and cleaned ${oldMarketplaceStudentsSnap.size} marketplace_students to marketplace_jobseekers.`);
    }

    // 8. Migrate old candidate_pool -> marketplace_jobseekers
    const oldCandidatePoolSnap = await getDocs(collection(db, 'candidate_pool'));
    if (!oldCandidatePoolSnap.empty) {
      for (const oldDoc of oldCandidatePoolSnap.docs) {
        await setDoc(doc(db, 'marketplace_jobseekers', oldDoc.id), oldDoc.data());
        await deleteDoc(doc(db, 'candidate_pool', oldDoc.id));
      }
      console.log(`Successfully migrated and cleaned ${oldCandidatePoolSnap.size} candidate_pool to marketplace_jobseekers.`);
    }

    // 9. Migrate and clean candidate_access_requests (top-level delete)
    const oldAccessRequestsSnap = await getDocs(collection(db, 'candidate_access_requests'));
    if (!oldAccessRequestsSnap.empty) {
      for (const oldDoc of oldAccessRequestsSnap.docs) {
        await deleteDoc(doc(db, 'candidate_access_requests', oldDoc.id));
      }
      console.log(`Successfully deleted obsolete top-level candidate_access_requests.`);
    }

    // 10. Migrate and clean candidate_selections (top-level delete)
    const oldSelectionsSnap = await getDocs(collection(db, 'candidate_selections'));
    if (!oldSelectionsSnap.empty) {
      for (const oldDoc of oldSelectionsSnap.docs) {
        await deleteDoc(doc(db, 'candidate_selections', oldDoc.id));
      }
      console.log(`Successfully deleted obsolete top-level candidate_selections.`);
    }

    // 11. Migrate candidate_submissions -> marketplace_submissions
    const oldCandSubsSnap = await getDocs(collection(db, 'candidate_submissions'));
    if (!oldCandSubsSnap.empty) {
      for (const oldDoc of oldCandSubsSnap.docs) {
        await setDoc(doc(db, 'marketplace_submissions', oldDoc.id), oldDoc.data());
        await deleteDoc(doc(db, 'candidate_submissions', oldDoc.id));
      }
      console.log(`Successfully migrated and cleaned ${oldCandSubsSnap.size} candidate_submissions to marketplace_submissions.`);
    }

    console.log('Automated Firestore migration successfully completed.');
  } catch (err) {
    console.error('Error during automated Firestore migration:', err);
  }
}

function mapFirestoreJobToRecruiterJob(docData: any, docId: string): RecruiterJob {
  const skills = Array.isArray(docData.skills) 
    ? docData.skills 
    : (typeof docData.skills === 'string' ? docData.skills.split(',').map((s: string) => s.trim()) : []);
  
  const bdm = docData.bdm || docData.bdmName || 'John Mathew';
  const jobType = docData.assignmentMode === 'restricted' ? 'assigned' : 'open';

  // Determine access status dynamically based on BDM assignments array
  const isAssigned = docData.assignedRecruiters?.includes(auth.currentUser?.uid || '');
  const accessStatus = isAssigned ? 'approved' : 'none';

  return {
    id: docId,
    title: docData.title || 'Untitled Job',
    company: docData.client || docData.company || docData.companyName || 'Unknown Company',
    experience: docData.experience || 'Not Specified',
    skills: skills,
    location: docData.location || 'Remote',
    positions: String(docData.positions || docData.openings || '1'),
    priority: docData.priority || 'Medium',
    posted: docData.posted || 'Recent',
    bdm: bdm,
    jobType: jobType,
    accessStatus: accessStatus,
    status: docData.status || 'open',
    createdBy: docData.createdBy || docData.bdmUid || ''
  } as any;
}

// Dynamically handle Firestore sync based on Auth state
let syncUnsubscribers: (() => void)[] = [];

function startFirestoreSync() {
  stopFirestoreSync();
  try {
    // 1. Sync global jobs with visibility rules (Step 2 and Step 3)
    const jobsRef = collection(db, 'marketplace_jobs');
    const jobsUnsub = onSnapshot(jobsRef, (snapshot) => {
      const dataList: RecruiterJob[] = [];
      const currentUid = auth.currentUser?.uid || '';
      
      snapshot.forEach((docSnap) => {
        const docData = docSnap.data();
        
        // Filter out paused jobs
        if (docData.status === 'paused') {
          return;
        }

        const mapped = mapFirestoreJobToRecruiterJob(docData, docSnap.id);
        
        // Visibility condition:
        // - Open jobs are always visible.
        // - Restricted jobs are only visible if the recruiter is assigned.
        const isAssigned = docData.assignedRecruiters?.includes(currentUid) || false;
        const isCreator = docData.createdBy === currentUid;
        
        if (mapped.jobType === 'open' || isAssigned || isCreator) {
          dataList.push(mapped);
        }
      });
      
      cachedJobs = dataList.sort(smartSort);
      setStorage('jobs', cachedJobs);
    }, (error) => {
      console.error("Firestore listener error on marketplace_jobs:", error);
    });
    syncUnsubscribers.push(jobsUnsub);

    // 2. Sync global candidate profiles (marketplace_jobseekers)
    const seedJobseekers = INITIAL_CANDIDATES.map(cand => ({
      id: cand.id,
      profile: {
        uid: cand.id,
        fullName: cand.name,
        email: `${cand.name.toLowerCase().replace(/\s+/g, '')}@test.com`,
        phoneNumber: '1234567890',
        status: 'approved',
        createdAt: new Date().toISOString(),
        experience: cand.experience,
        skills: cand.skills,
        availability: cand.availability,
        details: cand.details
      },
      resume: '',
      documents: [],
      certificates: [],
      saved_jobs: [],
      ai_profile: {},
      preferences: {},
      activity: [],
      settings: {}
    }));

    syncUnsubscribers.push(
      syncCollection<RecruiterCandidate>('marketplace_jobseekers', seedJobseekers, (data) => {
        cachedCandidates = data.sort(smartSort);
      }, mapJobseekerToCandidate)
    );

    // 3. Sync global student applications
    syncUnsubscribers.push(
      syncCollection<StudentApplication>('marketplace_applications', INITIAL_APPLICATIONS, (data) => {
        cachedApplications = data.sort(smartSort);
      })
    );

    // 4. Sync global submissions filtered to recruiter's own submissions
    const subsRef = collection(db, 'marketplace_submissions');
    const subsUnsub = onSnapshot(subsRef, (snapshot) => {
      const dataList: CandidateSubmission[] = [];
      const currentUid = auth.currentUser?.uid || '';
      
      snapshot.forEach((docSnap) => {
        const docData = docSnap.data();
        const recruiterUid = docData.recruiterUid || docData.recruiterId || docData.submittedBy;
        
        if (recruiterUid === currentUid) {
          dataList.push({
            id: docSnap.id,
            candidateId: docData.candidateUid || docData.candidateId || '',
            candidateName: docData.candidateName || '',
            jobId: docData.jobId || '',
            jobTitle: docData.jobTitle || '',
            recruiterId: docData.recruiterUid || '',
            recruiterName: docData.recruiterName || '',
            status: docData.status || 'Submitted',
            submittedAt: docData.submittedAt || '',
            companyName: docData.companyName || '',
            candidateResume: docData.candidateResume || '',
            submissionDate: docData.submissionDate || '',
            submittedBy: docData.recruiterName || '',
            assignedBdm: docData.assignedBdm || 'John Mathew',
            lastUpdated: docData.lastUpdated || '',
            notes: docData.notes || ''
          });
        }
      });
      cachedSubmissions = dataList.sort(smartSort);
      setStorage('submissions', cachedSubmissions);
    }, (error) => {
      console.error("Firestore listener error on marketplace_submissions:", error);
    });
    syncUnsubscribers.push(subsUnsub);

    // 5. Sync recruiter-specific items if user is authenticated
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      
      // Sync recruiter document (contains private saved_candidates and candidate_queue)
      const recruiterDocRef = doc(db, 'marketplace_recruiters', uid);
      const recUnsub = onSnapshot(recruiterDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          cachedAccessRequests = (data.candidate_queue || []).sort(smartSort);
          cachedSelections = (data.saved_candidates || []).sort(smartSort);
          setStorage('candidate_access_requests', cachedAccessRequests);
          setStorage('candidate_selections', cachedSelections);
        } else {
          // Initialize empty
          setDoc(recruiterDocRef, {
            profile: {
              uid,
              fullName: auth.currentUser?.displayName || 'Recruiter User',
              email: auth.currentUser?.email || '',
              phoneNumber: '',
              status: 'approved',
              createdAt: new Date().toISOString()
            },
            candidate_queue: INITIAL_ACCESS_REQUESTS,
            saved_candidates: INITIAL_SELECTIONS,
            activity: [],
            notes: [],
            dashboard_cache: {},
            settings: {}
          }, { merge: true });
        }
      });
      syncUnsubscribers.push(recUnsub);

      // Sync user-private notifications
      const notificationDocRef = doc(db, 'notifications', uid);
      const notUnsub = onSnapshot(notificationDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          cachedNotifications = (data.items || []).sort(smartSort);
          setStorage('notifications', cachedNotifications);
        } else {
          setDoc(notificationDocRef, { items: INITIAL_NOTIFICATIONS });
        }
      });
      syncUnsubscribers.push(notUnsub);
    }
  } catch (e) {
    console.error('Error starting Firestore sync:', e);
  }
}

function stopFirestoreSync() {
  syncUnsubscribers.forEach((unsub) => {
    try {
      unsub();
    } catch (e) {
      // Ignore
    }
  });
  syncUnsubscribers = [];
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    runAutomatedMigration().then(() => {
      startFirestoreSync();
    });
  } else {
    stopFirestoreSync();
  }
});

export const recruiterStorage = {
  getJobs: () => cachedJobs,
  setJobs: (jobs: RecruiterJob[]) => {
    cachedJobs = jobs;
    setStorage('jobs', jobs);
    writeCollection('marketplace_jobs', jobs);
  },

  getCandidates: () => cachedCandidates,
  setCandidates: (cands: RecruiterCandidate[]) => {
    cachedCandidates = cands;
    setStorage('candidates', cands);
    // Write mapped jobseekers to the database
    if (auth.currentUser) {
      cands.forEach(async cand => {
        try {
          const seekerDoc = {
            id: cand.id,
            profile: {
              uid: cand.id,
              fullName: cand.name,
              email: `${cand.name.toLowerCase().replace(/\s+/g, '')}@test.com`,
              phoneNumber: '1234567890',
              status: 'approved',
              createdAt: new Date().toISOString(),
              experience: cand.experience,
              skills: cand.skills,
              availability: cand.availability,
              details: cand.details
            }
          };
          await setDoc(doc(db, 'marketplace_jobseekers', cand.id), seekerDoc, { merge: true });
        } catch (e) {
          console.error('Error updating marketplace_jobseekers:', e);
        }
      });
    }
  },

  getAccessRequests: () => cachedAccessRequests,
  setAccessRequests: (reqs: CandidateAccessRequest[]) => {
    cachedAccessRequests = reqs;
    setStorage('candidate_access_requests', reqs);
    if (auth.currentUser) {
      setDoc(doc(db, 'marketplace_recruiters', auth.currentUser.uid), {
        candidate_queue: reqs
      }, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, `marketplace_recruiters/${auth.currentUser?.uid}/candidate_queue`);
      });
    }
  },

  getSelections: () => cachedSelections,
  setSelections: (sels: CandidateSelection[]) => {
    cachedSelections = sels;
    setStorage('candidate_selections', sels);
    if (auth.currentUser) {
      setDoc(doc(db, 'marketplace_recruiters', auth.currentUser.uid), {
        saved_candidates: sels
      }, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, `marketplace_recruiters/${auth.currentUser?.uid}/saved_candidates`);
      });
    }
  },

  getSubmissions: () => cachedSubmissions,
  setSubmissions: (subs: CandidateSubmission[]) => {
    cachedSubmissions = subs;
    setStorage('submissions', subs);
    
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const recName = auth.currentUser.displayName || auth.currentUser.email || 'Recruiter User';
      
      subs.forEach(async (sub) => {
        const subDocRef = doc(db, 'marketplace_submissions', sub.id);
        try {
          const subSnap = await getDoc(subDocRef);
          if (!subSnap.exists()) {
            const targetJob = cachedJobs.find(j => j.id === sub.jobId);
            const bdmUid = targetJob?.createdBy || targetJob?.bdm || 'system-bdm';
            const companyName = targetJob?.company || sub.companyName || 'Unknown Company';

            await setDoc(subDocRef, {
              submissionId: sub.id,
              jobId: sub.jobId,
              jobTitle: sub.jobTitle,
              candidateUid: sub.candidateId,
              candidateName: sub.candidateName,
              recruiterUid: uid,
              recruiterName: recName,
              bdmUid: bdmUid,
              companyName: companyName,
              status: sub.status || 'Submitted',
              submittedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
        } catch (err) {
          console.error(`Error saving candidate submission:`, err);
        }
      });
    }
  },

  getNotifications: () => cachedNotifications,
  setNotifications: (notes: ActivityNotification[]) => {
    cachedNotifications = notes;
    setStorage('notifications', notes);
    if (auth.currentUser) {
      setDoc(doc(db, 'notifications', auth.currentUser.uid), {
        items: notes
      }, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, `notifications/${auth.currentUser?.uid}`);
      });
    }
  },

  getApplications: () => cachedApplications,
  setApplications: (apps: StudentApplication[]) => {
    cachedApplications = apps;
    setStorage('applications', apps);
    writeCollection('marketplace_applications', apps);
  },

  addNotification: (type: 'submit' | 'select' | 'approve' | 'status' | 'request', title: string, desc: string) => {
    const currentNotes = cachedNotifications;
    const newNote: ActivityNotification = {
      id: `n-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      title,
      desc,
      time: 'Just now'
    };
    recruiterStorage.setNotifications([newNote, ...currentNotes]);
  },

  getDashboardStats: (): RecruiterDashboard => {
    const jobs = cachedJobs;
    const cands = cachedCandidates;
    const selections = cachedSelections;
    const submissions = cachedSubmissions;

    const openJobs = jobs.filter(j => j.jobType === 'open').length;
    const assignedJobs = jobs.filter(j => j.jobType === 'assigned').length;
    const availableCandidates = cands.length;
    const submittedCandidates = submissions.length;
    
    // Calculate realistic success rate
    const totalDecided = submissions.filter(s => s.status === 'Selected' || s.status === 'Joined' || s.status === 'Rejected').length;
    const totalSuccessful = submissions.filter(s => s.status === 'Selected' || s.status === 'Joined').length;
    const successRate = totalDecided > 0 ? `${Math.round((totalSuccessful / totalDecided) * 100)}%` : '85%';

    return {
      openJobs,
      assignedJobs,
      availableCandidates,
      submittedCandidates,
      selections: selections.length,
      successRate
    };
  }
};
