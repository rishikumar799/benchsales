import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, firebaseConfig } from './firebase';

/**
 * Generates a default password for the user: companyName@123
 */
export function generateDefaultPassword(orgName: string): string {
  const cleanedName = orgName ? orgName.replace(/[^a-zA-Z0-9]/g, '') : 'Company';
  const capitalized = cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1);
  return `${capitalized}@123`;
}

/**
 * Initializes/gets a secondary Firebase Auth instance to create a user
 * without affecting the current Company Admin's authenticated session.
 */
function getSecondaryAuth() {
  const appName = 'SecondaryAuthApp';
  let secondaryApp;
  const apps = getApps();
  const existing = apps.find(app => app.name === appName);
  if (existing) {
    secondaryApp = existing;
  } else {
    secondaryApp = initializeApp(firebaseConfig, appName);
  }
  return getAuth(secondaryApp);
}

interface ProvisionUserParams {
  email: string;
  name: string;
  role: 'c_manager' | 'c_recruiter' | 'c_employee' | 'company_manager' | 'company_recruiter' | 'employee';
  organizationId: string;
  organizationName: string;
  dept?: string;
  designation?: string;
  phone?: string;
  status?: 'Active' | 'Inactive';
  extraFields?: Record<string, any>;
}

/**
 * Maps any incoming role string to the standardized DB role and collection name
 */
export function getStandardizedRoleAndCollection(role: string): { dbRole: string; roleCollection: string } {
  switch (role) {
    case 'c_manager':
    case 'company_manager':
      return { dbRole: 'company_manager', roleCollection: 'managers' };
    case 'c_recruiter':
    case 'company_recruiter':
      return { dbRole: 'company_recruiter', roleCollection: 'recruiters' };
    case 'c_employee':
    case 'employee':
      return { dbRole: 'employee', roleCollection: 'employees' };
    default:
      throw new Error(`Unsupported provisioning role: ${role}`);
  }
}

/**
 * Provisions a new company user:
 * 1. Creates a Firebase Authentication user via a secondary Auth instance.
 * 2. Creates the global identity registry document in `users/{uid}`.
 * 3. Creates the role-specific document in `organizations_companies/{orgId}/{roleCollection}/{uid}`.
 * 4. Signs out of the secondary Auth instance so it doesn't leak session memory.
 */
export async function provisionCompanyUser(params: ProvisionUserParams): Promise<{ success: boolean; uid?: string; error?: string }> {
  const {
    email,
    name,
    role,
    organizationId,
    organizationName,
    dept = '',
    designation = '',
    phone = '',
    status = 'Active',
    extraFields = {}
  } = params;

  // Generate password automatically
  const password = generateDefaultPassword(organizationName);

  try {
    const secondaryAuth = getSecondaryAuth();

    let uid: string | null = null;

    // 1. Create Firebase Authentication user
    try {
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email.trim(), password);
      uid = userCredential.user.uid;
    } catch (err: any) {
      if (err?.code === 'auth/email-already-in-use' || String(err).includes('email-already-in-use')) {
        console.log('Email already in use. Attempting to retrieve existing user UID...');
        
        // Strategy A: Query users collection in Firestore
        try {
          const q = query(collection(db, 'users'), where('email', '==', email.trim()));
          const snap = await getDocs(q);
          if (!snap.empty) {
            uid = snap.docs[0].id;
            console.log('Resolved existing UID from users collection:', uid);
          }
        } catch (queryErr) {
          console.error('Failed to query users collection for existing email:', queryErr);
        }

        // Strategy B: If Firestore query yielded nothing, try to sign in using the expected default password
        if (!uid) {
          try {
            const userCredential = await signInWithEmailAndPassword(secondaryAuth, email.trim(), password);
            uid = userCredential.user.uid;
            console.log('Resolved existing UID from auth sign-in:', uid);
          } catch (signInErr) {
            console.error('Failed to sign in with expected default password:', signInErr);
          }
        }

        if (!uid) {
          throw new Error('This email address is already registered in the system, and its unique user identifier could not be retrieved. Please verify the email or try a different one.');
        }
      } else {
        throw err;
      }
    }

    if (!uid) {
      throw new Error('Failed to obtain a valid Firebase Authentication UID.');
    }

    // Standardize role and role collection
    const { dbRole, roleCollection } = getStandardizedRoleAndCollection(role);

    // 2. Create users/{uid} document with precise standardized fields
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      uid,
      email: email.trim(),
      displayName: name,
      fullName: name,
      role: dbRole, // "role value is identical everywhere"
      ecosystem: 'company', // "ecosystem value is 'company'"
      organizationId,
      organizationName,
      status: status === 'Active' ? 'approved' : 'inactive',
      photoURL: extraFields?.avatar || extraFields?.photoURL || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // 3. Create role document: organizations_companies/{organizationId}/{roleCollection}/{uid}
    // and include all required fields
    const roleDocRef = doc(db, 'organizations_companies', organizationId, roleCollection, uid);
    await setDoc(roleDocRef, {
      ...extraFields,
      uid,
      organizationId,
      organizationName,
      role: dbRole, // "role value is identical everywhere"
      displayName: name,
      email: email.trim(),
      department: dept,
      dept,
      designation,
      phone,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // 4. Sign out the newly created user from the secondary auth instance
    await signOut(secondaryAuth);

    return { success: true, uid };
  } catch (error: any) {
    console.error('Error provisioning company user:', error);
    return { success: false, error: error?.message || String(error) };
  }
}
