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
  getDocs,
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
  organizationName?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: DbUser | null;
  loading: boolean;
  profileError: string | null;
  login: (email: string, pass: string) => Promise<DbUser>;
  signupIndividual: (
    fullName: string, 
    email: string, 
    phone: string, 
    pass: string, 
    individualRole: 'candidate' | 'recruiter' | 'manager',
    companyName?: string
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

async function migrateCompanyRolesForOrganization(db: any, orgId: string, orgName: string, userRole: string) {
  try {
    const migratedKey = `aryx_ai_ecosystem_migrated_${orgId}_v3`;
    if (localStorage.getItem(migratedKey)) {
      return; // Already migrated for this company on this device
    }

    // Only company admins and platform admins can read all company subcollections
    if (userRole !== 'company_admin' && userRole !== 'platform_admin') {
      return;
    }

    console.log(`[Migration] Running localized company role migration for organization ${orgName} (${orgId})...`);
    
    const roles = [
      { sub: 'admins', top: 'organizations_companies_admins' },
      { sub: 'managers', top: 'organizations_companies_managers' },
      { sub: 'recruiters', top: 'organizations_companies_recruiters' },
      { sub: 'employees', top: 'organizations_companies_employees' }
    ];

    for (const roleInfo of roles) {
      try {
        const subColRef = collection(db, 'organizations_companies', orgId, roleInfo.sub);
        const subSnap = await getDocs(subColRef);

        for (const roleDoc of subSnap.docs) {
          const uid = roleDoc.id;
          const data = roleDoc.data();

          if (uid && data) {
            const topDocRef = doc(db, roleInfo.top, uid);
            const subDocRef = doc(db, 'organizations_companies', orgId, roleInfo.sub, uid);

            const finalPhone = data.phone || data.phoneNumber || 'N/A';
            const finalDept = data.department || data.dept || 'Executive';
            const finalDesignation = data.designation || (roleInfo.sub === 'admins' ? 'Company Administrator' : roleInfo.sub === 'managers' ? 'Manager' : roleInfo.sub === 'recruiters' ? 'Recruiter' : 'Staff');
            const finalStatus = data.status || 'approved';

            const payload = {
              ...data,
              uid,
              organizationId: orgId,
              organizationName: orgName,
              role: data.role || (roleInfo.sub === 'admins' ? 'company_admin' : roleInfo.sub === 'managers' ? 'company_manager' : roleInfo.sub === 'recruiters' ? 'company_recruiter' : 'employee'),
              displayName: data.displayName || data.fullName || 'System User',
              fullName: data.fullName || data.displayName || 'System User',
              email: (data.email || '').trim(),
              phone: finalPhone,
              phoneNumber: finalPhone,
              department: finalDept,
              dept: finalDept,
              designation: finalDesignation,
              status: finalStatus === 'Active' || finalStatus === 'approved' ? 'approved' : 'inactive',
              createdAt: data.createdAt || new Date().toISOString(),
              updatedAt: data.updatedAt || new Date().toISOString()
            };

            await setDoc(topDocRef, payload, { merge: true });
            await setDoc(subDocRef, payload, { merge: true });
          }
        }
      } catch (innerErr: any) {
        console.warn(`[Migration] Skipped subcollection ${roleInfo.sub} due to lack of permission:`, innerErr.message || innerErr);
      }
    }

    localStorage.setItem(migratedKey, 'true');
    console.log(`[Migration] Localized company role migration completed successfully.`);
  } catch (err) {
    console.warn('[Migration] Error during localized role collection migration:', err);
  }
}

interface AuthProviderProps {
  children: React.ReactNode;
  onRoleChange?: (role: UserRole) => void;
}

export function AuthProvider({ children, onRoleChange }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Sync with App's state role when profile loads
  useEffect(() => {
    if (onRoleChange) {
      if (userProfile) {
        onRoleChange(dbRoleToAppRole(userProfile.role));
      } else {
        onRoleChange(null);
      }
    }
  }, [userProfile?.role, onRoleChange]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          setProfileError(null);
          const userSnap = await getDoc(userDocRef);
          let profile: DbUser;
          
          if (userSnap.exists()) {
            profile = userSnap.data() as DbUser;
            
            // 1. Validation: Verify role exists, ecosystem exists, and organizationId exists for company users
            const isCompanyRole = ['company_admin', 'company_recruiter', 'company_manager', 'employee'].includes(profile.role);
            if (!profile.role) {
              const errMsg = "Login validation failed: User record is missing a 'role' field.";
              console.error(errMsg);
              setProfileError(errMsg);
              setUserProfile(null);
              setLoading(false);
              return;
            }
            if (!profile.ecosystem) {
              const errMsg = "Login validation failed: User record is missing an 'ecosystem' field.";
              console.error(errMsg);
              setProfileError(errMsg);
              setUserProfile(null);
              setLoading(false);
              return;
            }
            if (isCompanyRole && !profile.organizationId) {
              const errMsg = "Login validation failed: Company user record is missing an 'organizationId' field.";
              console.error(errMsg);
              setProfileError(errMsg);
              setUserProfile(null);
              setLoading(false);
              return;
            }

            profile.fullName = profile.displayName || profile.fullName || firebaseUser.displayName || 'System User';
            profile.email = profile.email || firebaseUser.email || '';

            // Set user profile & unblock loading IMMEDIATELY for instant navigation
            setUserProfile(profile);
            setLoading(false);

            // Launch non-blocking background task for self-healing, role syncing, and migration
            (async () => {
              try {
                let resolvedOrgName = profile.organizationName || '';
                if (!resolvedOrgName && profile.organizationId) {
                  try {
                    const parentCol = isCompanyRole ? 'organizations_companies' : 'organizations_universities';
                    const orgSnap = await getDoc(doc(db, parentCol, profile.organizationId));
                    if (orgSnap.exists()) {
                      resolvedOrgName = orgSnap.data()?.organizationName || '';
                    }
                  } catch (e) {
                    console.error('Failed to resolve organizationName on background user validation:', e);
                  }
                }
                if (!resolvedOrgName && ['company_admin', 'company_recruiter', 'company_manager', 'employee', 'organization_admin', 'placement_officer', 'student'].includes(profile.role)) {
                  resolvedOrgName = 'Organization';
                }

                const lastLoginIso = new Date().toISOString();
                const healedUserDoc = {
                  uid: profile.uid || firebaseUser.uid,
                  email: profile.email || firebaseUser.email || '',
                  displayName: profile.displayName || profile.fullName || firebaseUser.displayName || 'System User',
                  photoURL: profile.photoURL || firebaseUser.photoURL || '',
                  role: profile.role,
                  ecosystem: profile.ecosystem || getEcosystemForRole(profile.role),
                  organizationId: profile.organizationId || null,
                  organizationName: resolvedOrgName || null,
                  organizationType: profile.organizationType || null,
                  status: profile.status || 'approved',
                  createdAt: profile.createdAt || new Date().toISOString(),
                  updatedAt: profile.updatedAt || new Date().toISOString(),
                  lastLogin: lastLoginIso
                };

                await setDoc(userDocRef, healedUserDoc, { merge: true });

                const targetRoleString = profile.role;
                const isCompanyUser = ['company_admin', 'company_recruiter', 'company_manager', 'employee'].includes(targetRoleString);
                const roleDocRef = getRoleDocRef(db, profile);

                if (roleDocRef && isCompanyUser) {
                  const subColName = targetRoleString === 'company_admin' ? 'admins' :
                                    targetRoleString === 'company_manager' ? 'managers' :
                                    targetRoleString === 'company_recruiter' ? 'recruiters' : 'employees';
                  const topColName = `organizations_companies_${subColName}`;
                  const topRoleDocRef = doc(db, topColName, profile.uid);
                  const subRoleDocRef = roleDocRef;

                  const [topSnap, subSnap] = await Promise.all([
                    getDoc(topRoleDocRef),
                    getDoc(subRoleDocRef)
                  ]);

                  if (topSnap.exists() || subSnap.exists()) {
                    const topData = (topSnap.exists() ? topSnap.data() : {}) as any;
                    const subData = (subSnap.exists() ? subSnap.data() : {}) as any;

                    const resolvedPhone = topData.phone || subData.phone || topData.phoneNumber || subData.phoneNumber || profile.phoneNumber || 'N/A';
                    const resolvedDept = topData.department || subData.department || topData.dept || subData.dept || 'Executive';
                    const resolvedDesignation = topData.designation || subData.designation || (targetRoleString === 'company_admin' ? 'Company Administrator' : 'Staff');
                    const resolvedStatus = topData.status || subData.status || profile.status || 'approved';

                    const updatedRoleData = {
                      ...subData,
                      ...topData,
                      uid: topData.uid || subData.uid || profile.uid || firebaseUser.uid,
                      organizationId: topData.organizationId || subData.organizationId || profile.organizationId || '',
                      organizationName: resolvedOrgName,
                      role: topData.role || subData.role || targetRoleString,
                      displayName: topData.displayName || subData.displayName || topData.fullName || subData.fullName || topData.name || subData.name || profile.displayName || profile.fullName || 'System User',
                      fullName: topData.fullName || subData.fullName || topData.displayName || subData.displayName || 'System User',
                      email: topData.email || subData.email || profile.email || firebaseUser.email || '',
                      department: resolvedDept,
                      dept: resolvedDept,
                      designation: resolvedDesignation,
                      phone: resolvedPhone,
                      phoneNumber: resolvedPhone,
                      status: resolvedStatus === 'Active' || resolvedStatus === 'approved' ? 'approved' : 'inactive',
                      createdAt: topData.createdAt || subData.createdAt || profile.createdAt || new Date().toISOString(),
                      updatedAt: topData.updatedAt || subData.updatedAt || new Date().toISOString()
                    };

                    const needsTopWrite = !topSnap.exists();
                    const needsSubWrite = !subSnap.exists();
                    if (needsTopWrite || needsSubWrite) {
                      await Promise.all([
                        setDoc(topRoleDocRef, updatedRoleData, { merge: true }),
                        setDoc(subRoleDocRef, updatedRoleData, { merge: true })
                      ]);
                    }
                  }
                }

                // Localized company-wide migration for company admins/recruiters/managers
                if (isCompanyUser && profile.organizationId) {
                  migrateCompanyRolesForOrganization(db, profile.organizationId, resolvedOrgName || 'Company', targetRoleString);
                }

                // Seed platform admin logs
                if (targetRoleString === 'platform_admin') {
                  try {
                    const { seedDefaultPlatformData, LoginLogService } = await import('../services/platformAdminService');
                    await seedDefaultPlatformData();
                    await LoginLogService.logLogin(profile.uid, profile.email, 'Success');
                  } catch (err) {
                    console.error('Failed to initialize Platform Admin logs and seeding:', err);
                  }
                }

                // Ensure role document exists
                if (roleDocRef) {
                  const roleSnap = await getDoc(roleDocRef);
                  const isUniversityUser = ['organization_admin', 'placement_officer', 'student'].includes(targetRoleString);

                  if (!roleSnap.exists()) {
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
                  }
                }
              } catch (bgErr) {
                console.warn('Background sync task completed with warning:', bgErr);
              }
            })();

          } else {
            // Automatically detect role and create user document if user has special email
            let detectedRole = 'marketplace_jobseeker';
            if (firebaseUser.email === 'admin@AryxAI.com') {
              detectedRole = 'platform_admin';
            } else if (firebaseUser.email?.includes('recruiter')) {
              detectedRole = 'marketplace_recruiter';
            } else if (firebaseUser.email?.includes('bdm') || firebaseUser.email?.includes('manager')) {
              detectedRole = 'marketplace_bdm';
            } else {
              const errMsg = `Login validation failed: Identity record 'users/${firebaseUser.uid}' does not exist in the database.`;
              console.error(errMsg);
              setProfileError(errMsg);
              setUserProfile(null);
              setLoading(false);
              return;
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
            
            setUserProfile(profile);
            setLoading(false);

            await setDoc(userDocRef, {
              uid: profile.uid,
              email: profile.email,
              displayName: profile.displayName,
              photoURL: profile.photoURL || '',
              role: profile.role,
              ecosystem: profile.ecosystem,
              organizationId: null,
              organizationName: null,
              status: profile.status,
              createdAt: profile.createdAt,
              updatedAt: profile.updatedAt,
              lastLogin: profile.lastLogin
            });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
          setLoading(false);
        }
      } else {
        setUserProfile(null);
        setLoading(false);
      }
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
    individualRole: 'candidate' | 'recruiter' | 'manager',
    companyName?: string
  ): Promise<DbUser> => {
    // Determine mapped role
    let targetRoleString = 'marketplace_jobseeker';
    if (individualRole === 'candidate') targetRoleString = 'marketplace_jobseeker';
    else if (individualRole === 'recruiter') targetRoleString = 'marketplace_recruiter';
    else if (individualRole === 'manager') targetRoleString = 'marketplace_bdm';

    const cleanEmail = email.trim();
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();
    const timestamp = new Date().toISOString();

    let credential;
    try {
      credential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    } catch (err: any) {
      if (err?.code === 'auth/email-already-in-use' || String(err).includes('email-already-in-use')) {
        throw new Error('An account with this email address already exists. Please sign in instead.');
      } else if (err?.code === 'auth/invalid-email' || String(err).includes('invalid-email')) {
        throw new Error('Please enter a valid email address.');
      } else if (err?.code === 'auth/weak-password' || String(err).includes('weak-password')) {
        throw new Error('Password should be at least 6 characters long.');
      } else {
        throw err;
      }
    }

    const uid = credential.user.uid;

    const profile: DbUser = {
      uid,
      fullName: cleanName,
      displayName: cleanName,
      email: cleanEmail,
      phoneNumber: cleanPhone,
      role: targetRoleString,
      ecosystem: getEcosystemForRole(targetRoleString),
      accountType: 'individual',
      status: 'approved',
      createdAt: timestamp,
      updatedAt: timestamp,
      lastLogin: timestamp
    };

    // Prepare Master User Document (users/{uid})
    const userDocRef = doc(db, 'users', uid);
    const masterUserDoc = {
      uid,
      fullName: cleanName,
      displayName: cleanName,
      email: cleanEmail,
      phoneNumber: cleanPhone,
      phone: cleanPhone,
      photoURL: '',
      role: targetRoleString,
      ecosystem: profile.ecosystem,
      accountType: 'individual',
      organizationId: null,
      status: 'approved',
      createdAt: timestamp,
      updatedAt: timestamp,
      lastLogin: timestamp
    };

    // Prepare Role Profile Document (marketplace_{role}/{uid})
    const roleDocRef = getRoleDocRef(db, profile);
    
    let defaultDoc: any = {};
    if (targetRoleString === 'marketplace_jobseeker') {
      defaultDoc = {
        profile: {
          uid,
          fullName: cleanName,
          displayName: cleanName,
          email: cleanEmail,
          phoneNumber: cleanPhone,
          phone: cleanPhone,
          role: targetRoleString,
          status: 'approved',
          createdAt: timestamp,
          updatedAt: timestamp
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
          fullName: cleanName,
          displayName: cleanName,
          email: cleanEmail,
          phoneNumber: cleanPhone,
          phone: cleanPhone,
          companyName: companyName || '',
          role: targetRoleString,
          status: 'approved',
          createdAt: timestamp,
          updatedAt: timestamp
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
          fullName: cleanName,
          displayName: cleanName,
          email: cleanEmail,
          phoneNumber: cleanPhone,
          phone: cleanPhone,
          companyName: companyName || '',
          role: targetRoleString,
          status: 'approved',
          createdAt: timestamp,
          updatedAt: timestamp
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
        fullName: cleanName,
        displayName: cleanName,
        email: cleanEmail,
        phoneNumber: cleanPhone,
        phone: cleanPhone,
        status: 'approved',
        createdAt: timestamp,
        updatedAt: timestamp
      };
    }

    // Write both documents atomically using writeBatch
    const batch = writeBatch(db);
    batch.set(userDocRef, masterUserDoc);
    batch.set(roleDocRef, defaultDoc);

    try {
      await batch.commit();
    } catch (err: any) {
      console.error('Atomic batch write failed during individual signup:', err);
      handleFirestoreError(err, OperationType.WRITE, `Atomic write for signup: ${uid}`);
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
        organizationName: orgName,
        organizationType: profile.organizationType || null,
        status: profile.status,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        lastLogin: profile.lastLogin
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
    }

    // Store in specific role collection
    const roleDocRef = getRoleDocRef(db, profile);
    const adminPayload = {
      uid,
      fullName: adminName,
      displayName: adminName,
      role: targetRoleString,
      email,
      phone: phone || 'N/A',
      phoneNumber: phone || 'N/A',
      organizationId,
      organizationName: orgName,
      department: orgType === 'company' ? 'Executive' : 'Administration',
      designation: orgType === 'company' ? 'Company Administrator' : 'University Administrator',
      status: 'approved',
      createdAt: profile.createdAt,
      updatedAt: profile.createdAt
    };

    try {
      await setDoc(roleDocRef, adminPayload);
      if (orgType === 'company') {
        const topAdminDocRef = doc(db, 'organizations_companies_admins', uid);
        await setDoc(topAdminDocRef, adminPayload);
      }
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

  const bypassLogin = async (role: UserRole) => {
    if (role === null) {
      setUserProfile(null);
      return;
    }
    const dbRole = appRoleToDbRole(role);
    const eco = getEcosystemForRole(dbRole);

    let currentUid = auth.currentUser?.uid;
    if (!auth.currentUser) {
      try {
        const { signInAnonymously } = await import('firebase/auth');
        const userCred = await signInAnonymously(auth);
        currentUid = userCred.user.uid;
      } catch (err) {
        console.warn("signInAnonymously during bypassLogin failed:", err);
      }
    }

    const effectiveUid = currentUid || `bypass_${role}`;

    setUserProfile({
      uid: effectiveUid,
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
      profileError,
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
