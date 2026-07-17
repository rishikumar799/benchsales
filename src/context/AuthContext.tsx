import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  writeBatch
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase/firebase';
import { UserRole } from '../types';

// Db representation of the User
export interface DbUser {
  uid: string;
  fullName: string;
  displayName?: string;
  email: string;
  phoneNumber: string;
  photoURL?: string;
  role: string; // Database role string (e.g. 'marketplace_jobseeker', 'student')
  ecosystem: 'marketplace' | 'university' | 'company' | 'platform';
  accountType: 'individual' | 'organization';
  organizationType?: 'university' | 'company';
  organizationId?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: DbUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<DbUser>;
  signupIndividual: (
    fullName: string, 
    email: string, 
    phone: string, 
    pass: string, 
    individualRole: 'candidate' | 'recruiter' | 'manager'
  ) => Promise<DbUser>;
  signupOrganization: (
    orgName: string,
    adminName: string,
    email: string,
    phone: string,
    pass: string,
    orgType: 'university' | 'company'
  ) => Promise<DbUser>;
  logout: () => Promise<void>;
  bypassLogin: (role: UserRole) => void;
  createPlacementOfficerUser: (
    organizationId: string,
    fullName: string,
    email: string,
    phone: string,
    designation: string,
    department: string,
    pass: string
  ) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Get ecosystem for database role string
export function getEcosystemForRole(role: string): 'marketplace' | 'university' | 'company' | 'platform' {
  switch (role) {
    case 'marketplace_jobseeker':
    case 'marketplace_student':
    case 'marketplace_recruiter':
    case 'marketplace_bdm':
      return 'marketplace';
    case 'organization_admin':
    case 'placement_officer':
    case 'student':
      return 'university';
    case 'company_admin':
    case 'company_recruiter':
    case 'company_manager':
    case 'employee':
      return 'company';
    case 'platform_admin':
      return 'platform';
    default:
      return 'marketplace';
  }
}

// Map app-level roles to Firestore database role identifiers
export function appRoleToDbRole(role: UserRole): string {
  switch (role) {
    case 'm_candidate': return 'marketplace_jobseeker';
    case 'm_recruiter': return 'marketplace_recruiter';
    case 'm_manager': return 'marketplace_bdm';
    case 'u_admin': return 'organization_admin';
    case 'u_officer': return 'placement_officer';
    case 'u_student': return 'student';
    case 'c_admin': return 'company_admin';
    case 'c_recruiter': return 'company_recruiter';
    case 'c_manager': return 'company_manager';
    case 'c_employee': return 'employee';
    case 'platform_admin': return 'platform_admin';
    default: return 'marketplace_jobseeker';
  }
}

// Map Firestore database role identifiers back to app-level roles
export function dbRoleToAppRole(role: string): UserRole {
  switch (role) {
    case 'marketplace_jobseeker':
    case 'marketplace_student':
      return 'm_candidate';
    case 'marketplace_recruiter': return 'm_recruiter';
    case 'marketplace_bdm': return 'm_manager';
    case 'organization_admin': return 'u_admin';
    case 'placement_officer': return 'u_officer';
    case 'student': return 'u_student';
    case 'company_admin': return 'c_admin';
    case 'company_recruiter': return 'c_recruiter';
    case 'company_manager': return 'c_manager';
    case 'employee': return 'c_employee';
    case 'platform_admin': return 'platform_admin';
    default: return 'm_candidate';
  }
}

// Get the role collection name in Firestore based on DB role name
export function getRoleCollectionName(role: string): string {
  switch (role) {
    case 'marketplace_jobseeker':
    case 'marketplace_student':
      return 'marketplace_jobseekers';
    case 'marketplace_recruiter': return 'marketplace_recruiters';
    case 'marketplace_bdm': return 'marketplace_bdms';
    case 'platform_admin': return 'platform_admins';
    default: return 'marketplace_jobseekers';
  }
}

// Get the direct DocumentReference in Firestore based on profile role and organization context
export function getRoleDocRef(db: any, profile: DbUser): any {
  const role = profile.role;
  const uid = profile.uid;
  const orgId = profile.organizationId;

  if (orgId) {
    let subcol = '';
    let parentColName = '';
    switch (role) {
      case 'organization_admin':
        parentColName = 'organizations_universities';
        subcol = 'admins';
        break;
      case 'placement_officer':
        parentColName = 'organizations_universities';
        subcol = 'placement_officers';
        break;
      case 'student':
        parentColName = 'organizations_universities';
        subcol = 'students';
        break;
      case 'company_admin':
        parentColName = 'organizations_companies';
        subcol = 'admins';
        break;
      case 'company_recruiter':
        parentColName = 'organizations_companies';
        subcol = 'recruiters';
        break;
      case 'company_manager':
        parentColName = 'organizations_companies';
        subcol = 'managers';
        break;
      case 'employee':
        parentColName = 'organizations_companies';
        subcol = 'employees';
        break;
      default:
        break;
    }
    if (parentColName && subcol) {
      return doc(db, parentColName, orgId, subcol, uid);
    }
  }

  // Fallback to top-level collection
  const collectionName = getRoleCollectionName(role);
  return doc(db, collectionName, uid);
}

interface AuthProviderProps {
  children: React.ReactNode;
  onRoleChange?: (role: UserRole) => void;
}

export function AuthProvider({ children, onRoleChange }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync with App's state role when profile loads
  useEffect(() => {
    if (onRoleChange) {
      if (userProfile) {
        onRoleChange(dbRoleToAppRole(userProfile.role));
      } else {
        onRoleChange(null);
      }
    }
  }, [userProfile, onRoleChange]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userSnap = await getDoc(userDocRef);
          let profile: DbUser;
          
          if (userSnap.exists()) {
            profile = userSnap.data() as DbUser;
            profile.lastLogin = new Date().toISOString();
            await setDoc(userDocRef, {
              uid: profile.uid,
              email: profile.email,
              displayName: profile.displayName || profile.fullName || firebaseUser.displayName || 'System User',
              photoURL: profile.photoURL || firebaseUser.photoURL || '',
              role: profile.role,
              ecosystem: getEcosystemForRole(profile.role),
              organizationId: profile.organizationId || null,
              organizationType: profile.organizationType || null,
              status: profile.status || 'approved',
              createdAt: profile.createdAt || new Date().toISOString(),
              lastLogin: profile.lastLogin
            }, { merge: true });
          } else {
            // Automatically detect role and create user document
            let detectedRole = 'marketplace_jobseeker';
            if (firebaseUser.email === 'admin@AryxAI.com') {
              detectedRole = 'platform_admin';
            } else if (firebaseUser.email?.includes('recruiter')) {
              detectedRole = 'marketplace_recruiter';
            } else if (firebaseUser.email?.includes('bdm') || firebaseUser.email?.includes('manager')) {
              detectedRole = 'marketplace_bdm';
            }
            
            const displayName = firebaseUser.displayName || 'System User';
            profile = {
              uid: firebaseUser.uid,
              fullName: displayName,
              displayName: displayName,
              email: firebaseUser.email || '',
              phoneNumber: firebaseUser.phoneNumber || '',
              photoURL: firebaseUser.photoURL || '',
              role: detectedRole,
              ecosystem: getEcosystemForRole(detectedRole),
              accountType: 'individual',
              status: 'approved',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              lastLogin: new Date().toISOString()
            };
            
            await setDoc(userDocRef, {
              uid: profile.uid,
              email: profile.email,
              displayName: profile.displayName,
              photoURL: profile.photoURL || '',
              role: profile.role,
              ecosystem: profile.ecosystem,
              organizationId: null,
              status: profile.status,
              createdAt: profile.createdAt,
              lastLogin: profile.lastLogin
            });
            console.log(`Created missing users/${firebaseUser.uid} document`);
          }
          
          setUserProfile(profile);

          // Dynamically initialize and standardize the role profile document if it does not exist or lacks fields
          const targetRoleString = profile.role;
          if (targetRoleString === 'platform_admin') {
            try {
              const { seedDefaultPlatformData, LoginLogService } = await import('../services/platformAdminService');
              await seedDefaultPlatformData();
              await LoginLogService.logLogin(profile.uid, profile.email, 'Success');
            } catch (err) {
              console.error('Failed to initialize Platform Admin logs and seeding:', err);
            }
          }
          const roleDocRef = getRoleDocRef(db, profile);
          if (roleDocRef) {
            const roleSnap = await getDoc(roleDocRef);
            const isUniversityUser = ['organization_admin', 'placement_officer', 'student'].includes(targetRoleString);
            
            if (isUniversityUser && profile.organizationId) {
              const orgId = profile.organizationId;
              const roleData: any = roleSnap.exists() ? roleSnap.data() : null;
              
              // Standardize values
              const currentUid = firebaseUser.uid;
              const currentOrgId = orgId;
              const currentCreatedAt = roleData?.createdAt || profile.createdAt || new Date().toISOString();
              const currentStatus = roleData?.status || roleData?.placementStatus || 'Active';
              
              // Name standardization
              const currentFullName = roleData?.fullName || roleData?.name || profile.fullName || profile.displayName || 'System User';
              const currentName = currentFullName; // backward compatibility
              
              // Phone standardization
              const currentPhoneNumber = roleData?.phoneNumber || roleData?.phone || profile.phoneNumber || '';
              const currentPhone = currentPhoneNumber; // backward compatibility
              
              // Department standardization (for student or placement_officer)
              let currentDepartment = roleData?.department || roleData?.dept || '';
              if (!currentDepartment && targetRoleString === 'placement_officer') {
                currentDepartment = 'Training & Placement';
              } else if (!currentDepartment && targetRoleString === 'student') {
                currentDepartment = 'CSE';
              }
              const currentDept = currentDepartment; // backward compatibility

              // Check if the document already contains all standardized fields perfectly
              const isAlreadyNormalized = roleSnap.exists() && roleData && (
                roleData.uid === currentUid &&
                roleData.organizationId === currentOrgId &&
                roleData.createdAt === currentCreatedAt &&
                roleData.status === currentStatus &&
                roleData.fullName === currentFullName &&
                roleData.name === currentName &&
                roleData.phoneNumber === currentPhoneNumber &&
                roleData.phone === currentPhone &&
                (targetRoleString !== 'student' && targetRoleString !== 'placement_officer' ? true : (
                  roleData.department === currentDepartment &&
                  roleData.dept === currentDept
                )) &&
                (targetRoleString !== 'placement_officer' ? true : (
                  roleData.designation === (roleData.designation || 'Placement Officer')
                ))
              );

              if (!isAlreadyNormalized) {
                // Build normalized document only if missing or mismatched
                const currentUpdatedAt = new Date().toISOString();
                const normalizedDoc: any = {
                  ...(roleData || {}),
                  uid: currentUid,
                  organizationId: currentOrgId,
                  createdAt: currentCreatedAt,
                  updatedAt: currentUpdatedAt,
                  status: currentStatus,
                  fullName: currentFullName,
                  name: currentName,
                  phoneNumber: currentPhoneNumber,
                  phone: currentPhone,
                };

                if (targetRoleString === 'student') {
                  normalizedDoc.department = currentDepartment;
                  normalizedDoc.dept = currentDept;
                } else if (targetRoleString === 'placement_officer') {
                  normalizedDoc.department = currentDepartment;
                  normalizedDoc.dept = currentDept;
                  normalizedDoc.designation = roleData?.designation || 'Placement Officer';
                }

                // Save the normalized document
                await setDoc(roleDocRef, normalizedDoc);
                console.log(`Auto-standardized University Role Document: ${roleDocRef.path}`);
              } else {
                console.log(`University Role Document is already fully standardized. Zero writes performed for: ${roleDocRef.path}`);
              }
            } else if (!roleSnap.exists()) {
              let defaultDoc: any = {};
              if (targetRoleString === 'marketplace_jobseeker' || targetRoleString === 'marketplace_student') {
                defaultDoc = {
                  profile: {
                    uid: firebaseUser.uid,
                    fullName: profile.fullName || profile.displayName || 'System User',
                    email: profile.email,
                    phoneNumber: profile.phoneNumber,
                    status: 'approved',
                    createdAt: profile.createdAt
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
              } else if (targetRoleString === 'marketplace_recruiter') {
                defaultDoc = {
                  profile: {
                    uid: firebaseUser.uid,
                    fullName: profile.fullName || profile.displayName || 'System User',
                    email: profile.email,
                    phoneNumber: profile.phoneNumber,
                    status: 'approved',
                    createdAt: profile.createdAt
                  },
                  candidate_queue: [],
                  saved_candidates: [],
                  activity: [],
                  notes: [],
                  dashboard_cache: {},
                  settings: {}
                };
              } else if (targetRoleString === 'marketplace_bdm') {
                defaultDoc = {
                  profile: {
                    uid: firebaseUser.uid,
                    fullName: profile.fullName || profile.displayName || 'System User',
                    email: profile.email,
                    phoneNumber: profile.phoneNumber,
                    status: 'approved',
                    createdAt: profile.createdAt
                  },
                  dashboard_cache: {},
                  analytics_cache: {},
                  draft_jobs: [],
                  notes: [],
                  activity: [],
                  settings: {}
                };
              } else {
                defaultDoc = {
                  uid: firebaseUser.uid,
                  fullName: profile.fullName || profile.displayName || 'System User',
                  email: profile.email,
                  phoneNumber: profile.phoneNumber,
                  status: 'approved',
                  createdAt: profile.createdAt
                };
                if (profile.organizationId) {
                  defaultDoc.organizationId = profile.organizationId;
                }
              }
              await setDoc(roleDocRef, defaultDoc);
              console.log(`Created missing role profile document in ${roleDocRef.path}`);
            }
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<DbUser> => {
    const credential = await signInWithEmailAndPassword(auth, email, pass);
    const userDocRef = doc(db, 'users', credential.user.uid);
    try {
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const profileData = userSnap.data();
        const profile: DbUser = {
          uid: profileData.uid,
          fullName: profileData.displayName || 'System User',
          displayName: profileData.displayName || 'System User',
          email: profileData.email,
          phoneNumber: '',
          photoURL: profileData.photoURL || '',
          role: profileData.role,
          ecosystem: profileData.ecosystem || getEcosystemForRole(profileData.role),
          accountType: profileData.organizationId ? 'organization' : 'individual',
          organizationId: profileData.organizationId || undefined,
          organizationType: profileData.organizationType || undefined,
          status: profileData.status || 'approved',
          createdAt: profileData.createdAt,
          updatedAt: profileData.createdAt,
          lastLogin: new Date().toISOString()
        };
        setUserProfile(profile);
        return profile;
      } else {
        // Fallback for platform_admin
        if (email === "admin@AryxAI.com") {
          const profile: DbUser = {
            uid: credential.user.uid,
            fullName: 'Platform Administrator',
            displayName: 'Platform Administrator',
            email,
            phoneNumber: '',
            role: 'platform_admin',
            ecosystem: 'platform',
            accountType: 'individual',
            status: 'approved',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          setUserProfile(profile);
          return profile;
        }
        throw new Error('User profile record does not exist in the database.');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${credential.user.uid}`);
    }
  };

  const signupIndividual = async (
    fullName: string, 
    email: string, 
    phone: string, 
    pass: string, 
    individualRole: 'candidate' | 'recruiter' | 'manager'
  ): Promise<DbUser> => {
    // Determine mapped role
    let targetRoleString = 'marketplace_jobseeker';
    if (individualRole === 'candidate') targetRoleString = 'marketplace_jobseeker';
    else if (individualRole === 'recruiter') targetRoleString = 'marketplace_recruiter';
    else if (individualRole === 'manager') targetRoleString = 'marketplace_bdm';

    const credential = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = credential.user.uid;

    const profile: DbUser = {
      uid,
      fullName,
      displayName: fullName,
      email,
      phoneNumber: phone,
      role: targetRoleString,
      ecosystem: getEcosystemForRole(targetRoleString),
      accountType: 'individual',
      status: 'approved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    // Store in users master collection
    const userDocRef = doc(db, 'users', uid);
    try {
      await setDoc(userDocRef, {
        uid: profile.uid,
        email: profile.email,
        displayName: profile.displayName,
        photoURL: '',
        role: profile.role,
        ecosystem: profile.ecosystem,
        organizationId: null,
        status: profile.status,
        createdAt: profile.createdAt,
        lastLogin: profile.lastLogin
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
    }

    // Store in specific role collection
    const roleDocRef = getRoleDocRef(db, profile);
    
    let defaultDoc: any = {};
    if (targetRoleString === 'marketplace_jobseeker') {
      defaultDoc = {
        profile: {
          uid,
          fullName,
          email,
          phoneNumber: phone,
          status: 'approved',
          createdAt: profile.createdAt
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
    } else if (targetRoleString === 'marketplace_recruiter') {
      defaultDoc = {
        profile: {
          uid,
          fullName,
          email,
          phoneNumber: phone,
          status: 'approved',
          createdAt: profile.createdAt
        },
        candidate_queue: [],
        saved_candidates: [],
        activity: [],
        notes: [],
        dashboard_cache: {},
        settings: {}
      };
    } else if (targetRoleString === 'marketplace_bdm') {
      defaultDoc = {
        profile: {
          uid,
          fullName,
          email,
          phoneNumber: phone,
          status: 'approved',
          createdAt: profile.createdAt
        },
        dashboard_cache: {},
        analytics_cache: {},
        draft_jobs: [],
        notes: [],
        activity: [],
        settings: {}
      };
    } else {
      defaultDoc = {
        uid,
        fullName,
        email,
        phoneNumber: phone,
        status: 'approved',
        createdAt: profile.createdAt
      };
      if (profile.organizationId) {
        defaultDoc.organizationId = profile.organizationId;
      }
    }

    try {
      await setDoc(roleDocRef, defaultDoc);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, roleDocRef.path);
    }

    setUserProfile(profile);
    return profile;
  };

  const signupOrganization = async (
    orgName: string,
    adminName: string,
    email: string,
    phone: string,
    pass: string,
    orgType: 'university' | 'company'
  ): Promise<DbUser> => {
    // Register User Auth
    const credential = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = credential.user.uid;

    // Generate random doc ID for organization based on type
    const parentColName = orgType === 'university' ? 'organizations_universities' : 'organizations_companies';
    const orgDocRef = doc(collection(db, parentColName));
    const organizationId = orgDocRef.id;

    // Store organization detail
    const orgData = {
      organizationId,
      organizationName: orgName,
      organizationType: orgType,
      adminUid: uid,
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(orgDocRef, orgData);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${parentColName}/${organizationId}`);
    }

    // Determine target database role
    const targetRoleString = orgType === 'university' ? 'organization_admin' : 'company_admin';

    const profile: DbUser = {
      uid,
      fullName: adminName,
      displayName: adminName,
      email,
      phoneNumber: phone,
      role: targetRoleString,
      ecosystem: getEcosystemForRole(targetRoleString),
      accountType: 'organization',
      organizationType: orgType,
      organizationId,
      status: 'approved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    // Store in master users collection
    const userDocRef = doc(db, 'users', uid);
    try {
      await setDoc(userDocRef, {
        uid: profile.uid,
        email: profile.email,
        displayName: profile.displayName,
        photoURL: '',
        role: profile.role,
        ecosystem: profile.ecosystem,
        organizationId: profile.organizationId,
        organizationType: profile.organizationType || null,
        status: profile.status,
        createdAt: profile.createdAt,
        lastLogin: profile.lastLogin
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
    }

    // Store in specific role collection
    const roleDocRef = getRoleDocRef(db, profile);
    try {
      await setDoc(roleDocRef, {
        uid,
        fullName: adminName,
        email,
        phoneNumber: phone,
        organizationId,
        status: 'approved',
        createdAt: profile.createdAt
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, roleDocRef.path);
    }

    setUserProfile(profile);
    return profile;
  };

  const createPlacementOfficerUser = async (
    organizationId: string,
    fullName: string,
    email: string,
    phone: string,
    designation: string,
    department: string,
    pass: string
  ): Promise<string> => {
    // 1. Initialize secondary app to create user without logging current admin out
    const { initializeApp, getApp, getApps } = await import('firebase/app');
    const { getAuth: getSecondaryAuth, createUserWithEmailAndPassword: createSecondaryUser, signOut: signSecondaryOut } = await import('firebase/auth');
    const { firebaseConfig } = await import('../firebase/firebase');

    let secondaryApp;
    const apps = getApps();
    const existingApp = apps.find(a => a.name === 'SecondaryApp');
    if (existingApp) {
      secondaryApp = existingApp;
    } else {
      secondaryApp = initializeApp(firebaseConfig, 'SecondaryApp');
    }

    const secondaryAuth = getSecondaryAuth(secondaryApp);
    const credential = await createSecondaryUser(secondaryAuth, email, pass);
    const uid = credential.user.uid;
    await signSecondaryOut(secondaryAuth);

    // 4 & 5. Write identity and business profile documents atomically using WriteBatch
    const userDocRef = doc(db, 'users', uid);
    const officerDocRef = doc(db, 'organizations_universities', organizationId, 'placement_officers', uid);
    const createdAt = new Date().toISOString();

    const batch = writeBatch(db);
    
    // Identity document
    batch.set(userDocRef, {
      uid,
      email,
      displayName: fullName,
      role: 'placement_officer',
      ecosystem: 'university',
      organizationId,
      organizationType: 'university',
      status: 'approved',
      createdAt,
      lastLogin: createdAt
    });

    // Business profile document
    batch.set(officerDocRef, {
      uid,
      fullName,
      email,
      phone,
      designation,
      department,
      status: 'Active',
      createdAt,
      createdBy: userProfile?.uid || '',
      organizationId
    });

    try {
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `Atomic write for placement officer: ${uid}`);
    }

    return uid;
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
    setUser(null);
  };

  const bypassLogin = (role: UserRole) => {
    if (role === null) {
      setUserProfile(null);
      return;
    }
    const dbRole = appRoleToDbRole(role);
    const eco = getEcosystemForRole(dbRole);
    setUserProfile({
      uid: `bypass_${role}`,
      fullName: `Test ${role} Profile`,
      displayName: `Test ${role} Profile`,
      email: `${role}@test.com`,
      phoneNumber: '1234567890',
      role: dbRole,
      ecosystem: eco,
      accountType: 'individual',
      organizationId: eco === 'university' ? 'test_university' : eco === 'company' ? 'test_company' : undefined,
      organizationType: eco === 'university' ? 'university' : eco === 'company' ? 'company' : undefined,
      status: 'approved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      loading, 
      login, 
      signupIndividual, 
      signupOrganization, 
      logout,
      bypassLogin,
      createPlacementOfficerUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}
