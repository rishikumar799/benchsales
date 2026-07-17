import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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
  role: 'c_manager' | 'c_recruiter' | 'c_employee';
  organizationId: string;
  organizationName: string;
  dept?: string;
  designation?: string;
  phone?: string;
  status?: 'Active' | 'Inactive';
  extraFields?: Record<string, any>;
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

    // 1. Create Firebase Authentication user
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email.trim(), password);
    const uid = userCredential.user.uid;

    if (!uid) {
      throw new Error('Failed to obtain a valid Firebase Authentication UID.');
    }

    // 2. Create users/{uid} document
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      uid,
      email: email.trim(),
      displayName: name,
      name,
      role,
      ecosystem: 'company',
      organizationId,
      organizationName,
      status,
      dept,
      department: dept,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Determine the role collection name
    let roleCollection = '';
    if (role === 'c_manager') {
      roleCollection = 'managers';
    } else if (role === 'c_recruiter') {
      roleCollection = 'recruiters';
    } else if (role === 'c_employee') {
      roleCollection = 'employees';
    } else {
      throw new Error(`Unsupported provisioning role: ${role}`);
    }

    // 3. Create role document: organizations_companies/{organizationId}/{roleCollection}/{uid}
    const roleDocRef = doc(db, 'organizations_companies', organizationId, roleCollection, uid);
    await setDoc(roleDocRef, {
      uid,
      organizationId,
      organizationName,
      email: email.trim(),
      displayName: name,
      name,
      department: dept,
      dept,
      designation,
      phone,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...extraFields
    });

    // 4. Sign out the newly created user from the secondary auth instance
    await signOut(secondaryAuth);

    return { success: true, uid };
  } catch (error: any) {
    console.error('Error provisioning company user:', error);
    return { success: false, error: error?.message || String(error) };
  }
}
