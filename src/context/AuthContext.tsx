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
  collection 
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase/firebase';
import { UserRole } from '../types';

// Db representation of the User
export interface DbUser {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string; // Database role string (e.g. 'marketplace_student')
  accountType: 'individual' | 'organization';
  organizationType?: 'university' | 'company';
  organizationId?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Map app-level roles to Firestore database role identifiers
export function appRoleToDbRole(role: UserRole): string {
  switch (role) {
    case 'm_candidate': return 'marketplace_student';
    case 'm_recruiter': return 'marketplace_recruiter';
    case 'm_manager': return 'marketplace_bdm';
    case 'u_admin': return 'organization_admin';
    case 'u_officer': return 'placement_officer';
    case 'u_student': return 'marketplace_student';
    case 'c_admin': return 'company_admin';
    case 'c_recruiter': return 'company_recruiter';
    case 'c_manager': return 'company_manager';
    case 'c_employee': return 'employee';
    case 'platform_admin': return 'platform_admin';
    default: return 'marketplace_student';
  }
}

// Map Firestore database role identifiers back to app-level roles
export function dbRoleToAppRole(role: string): UserRole {
  switch (role) {
    case 'marketplace_student': return 'm_candidate';
    case 'marketplace_recruiter': return 'm_recruiter';
    case 'marketplace_bdm': return 'm_manager';
    case 'organization_admin': return 'u_admin';
    case 'placement_officer': return 'u_officer';
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
    case 'marketplace_student': return 'marketplace_students';
    case 'marketplace_recruiter': return 'marketplace_recruiters';
    case 'marketplace_bdm': return 'marketplace_bdms';
    case 'organization_admin': return 'organization_admins';
    case 'placement_officer': return 'placement_officers';
    case 'company_admin': return 'company_admins';
    case 'company_recruiter': return 'company_recruiters';
    case 'company_manager': return 'company_managers';
    case 'employee': return 'employees';
    default: return 'marketplace_students';
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
          if (userSnap.exists()) {
            setUserProfile(userSnap.data() as DbUser);
          } else {
            // Handle case where user auth exists but Firestore document doesn't (could be platform_admin fallback)
            const fallbackProfile: DbUser = {
              uid: firebaseUser.uid,
              fullName: firebaseUser.displayName || 'System User',
              email: firebaseUser.email || '',
              phoneNumber: firebaseUser.phoneNumber || '',
              role: firebaseUser.email === 'admin@AryxAI.com' ? 'platform_admin' : 'marketplace_student',
              accountType: 'individual',
              status: 'approved',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            setUserProfile(fallbackProfile);
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
        const profile = userSnap.data() as DbUser;
        setUserProfile(profile);
        return profile;
      } else {
        // Fallback for platform_admin
        if (email === "admin@AryxAI.com") {
          const profile: DbUser = {
            uid: credential.user.uid,
            fullName: 'Platform Administrator',
            email,
            phoneNumber: '',
            role: 'platform_admin',
            accountType: 'individual',
            status: 'approved',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
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
    let targetRoleString = 'marketplace_student';
    if (individualRole === 'candidate') targetRoleString = 'marketplace_student';
    else if (individualRole === 'recruiter') targetRoleString = 'marketplace_recruiter';
    else if (individualRole === 'manager') targetRoleString = 'marketplace_bdm';

    const credential = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = credential.user.uid;

    const profile: DbUser = {
      uid,
      fullName,
      email,
      phoneNumber: phone,
      role: targetRoleString,
      accountType: 'individual',
      status: 'approved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store in users master collection
    const userDocRef = doc(db, 'users', uid);
    try {
      await setDoc(userDocRef, profile);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
    }

    // Store in specific role collection
    const collectionName = getRoleCollectionName(targetRoleString);
    const roleDocRef = doc(db, collectionName, uid);
    try {
      await setDoc(roleDocRef, {
        uid,
        fullName,
        email,
        phoneNumber: phone,
        status: 'approved',
        createdAt: profile.createdAt
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${collectionName}/${uid}`);
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

    // Generate random doc ID for organization
    const orgDocRef = doc(collection(db, 'organizations'));
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
      handleFirestoreError(err, OperationType.WRITE, `organizations/${organizationId}`);
    }

    // Determine target database role
    const targetRoleString = orgType === 'university' ? 'organization_admin' : 'company_admin';

    const profile: DbUser = {
      uid,
      fullName: adminName,
      email,
      phoneNumber: phone,
      role: targetRoleString,
      accountType: 'organization',
      organizationType: orgType,
      organizationId,
      status: 'approved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store in master users collection
    const userDocRef = doc(db, 'users', uid);
    try {
      await setDoc(userDocRef, profile);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
    }

    // Store in specific role collection
    const collectionName = getRoleCollectionName(targetRoleString);
    const roleDocRef = doc(db, collectionName, uid);
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
      handleFirestoreError(err, OperationType.WRITE, `${collectionName}/${uid}`);
    }

    setUserProfile(profile);
    return profile;
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
    setUserProfile({
      uid: `bypass_${role}`,
      fullName: `Test ${role} Profile`,
      email: `${role}@test.com`,
      phoneNumber: '1234567890',
      role: dbRole,
      accountType: 'individual',
      status: 'approved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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
      bypassLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
}
