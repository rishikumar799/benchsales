import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { useAuth } from './AuthContext';

export interface RecruiterSettings {
  emailAlerts?: boolean;
  pushAlerts?: boolean;
  smsAlerts?: boolean;
  autoMatching?: boolean;
  priorityAlerts?: boolean;
  publicProfile?: boolean;
  bdmAcess?: boolean;
  theme?: 'light' | 'dark';
  language?: string;
}

export interface RecruiterProfileData {
  fullName: string;
  email: string;
  phone: string;
  phoneNumber?: string;
  location: string;
  address?: string;
  dept: string;
  department?: string;
  bio: string;
  skills: string;
  experience: string;
  portfolio: string;
  linkedin: string;
  photoUrl: string;
  profilePhotoUrl?: string;
}

export interface RecruiterDoc {
  profile: RecruiterProfileData;
  candidate_queue?: any[];
  saved_candidates?: any[];
  activity?: any[];
  notes?: any[];
  dashboard_cache?: any;
  settings?: RecruiterSettings;
  createdAt?: string;
  lastLogin?: string;
  marketplaceId?: string;
}

interface RecruiterContextType {
  recruiterProfile: RecruiterDoc | null;
  loading: boolean;
  updateProfile: (profileFields: Partial<RecruiterProfileData>) => Promise<void>;
  updateSettings: (settingsFields: Partial<RecruiterSettings>) => Promise<void>;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => Promise<void>;
}

export const RecruiterContext = createContext<RecruiterContextType | null>(null);

export function useRecruiter() {
  const context = useContext(RecruiterContext);
  if (!context) {
    throw new Error('useRecruiter must be used within a RecruiterProvider');
  }
  return context;
}

interface RecruiterProviderProps {
  children: React.ReactNode;
}

export function RecruiterProvider({ children }: RecruiterProviderProps) {
  const { user, userProfile } = useAuth();
  const [recruiterProfile, setRecruiterProfile] = useState<RecruiterDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  const uid = user?.uid || userProfile?.uid;
  const isMarketplaceRecruiter = userProfile?.role === 'marketplace_recruiter' || userProfile?.role === 'm_recruiter';

  // 1. Establish ONE realtime Firestore listener
  useEffect(() => {
    if (!uid || !isMarketplaceRecruiter) {
      setRecruiterProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const docRef = doc(db, 'marketplace_recruiters', uid);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as RecruiterDoc;
        setRecruiterProfile(data);

        // Manage theme synchronization
        const storedTheme = data.settings?.theme || 'light';
        setThemeState(storedTheme);
        
        // Apply theme to document element
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(storedTheme);
        localStorage.setItem('theme', storedTheme);
      } else {
        // Initialize if doesn't exist
        const initialDoc: RecruiterDoc = {
          profile: {
            fullName: userProfile?.fullName || user?.displayName || 'Recruiter User',
            email: userProfile?.email || user?.email || '',
            phone: userProfile?.phoneNumber || '',
            location: 'Bangalore, India',
            dept: 'Engineering Recruitment Division',
            bio: '',
            skills: '',
            experience: '2 Years',
            portfolio: '',
            linkedin: '',
            photoUrl: userProfile?.photoURL || user?.photoURL || ''
          },
          candidate_queue: [],
          saved_candidates: [],
          activity: [],
          notes: [],
          dashboard_cache: {},
          settings: {
            theme: 'light',
            language: 'English',
            emailAlerts: true,
            pushAlerts: true,
            smsAlerts: false,
            autoMatching: true,
            priorityAlerts: true,
            publicProfile: true,
            bdmAcess: true
          },
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          marketplaceId: `REC-${uid.slice(0, 6).toUpperCase()}`
        };

        setDoc(docRef, initialDoc).then(() => {
          setRecruiterProfile(initialDoc);
        }).catch(err => {
          console.error("Error creating initial recruiter profile doc:", err);
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to marketplace recruiter profile:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid, isMarketplaceRecruiter]);

  // 2. Update profile fields using updateDoc to only modify specific fields
  const updateProfile = async (profileFields: Partial<RecruiterProfileData>) => {
    if (!uid) return;
    const docRef = doc(db, 'marketplace_recruiters', uid);

    const updatePayload: any = {
      updatedAt: new Date().toISOString()
    };

    // Add nested profile fields using dot-notation to avoid replacing the entire object
    Object.entries(profileFields).forEach(([key, val]) => {
      if (val !== undefined) {
        updatePayload[`profile.${key}`] = val;
      }
    });

    // Handle backward compatibility values aligned
    const nameVal = profileFields.fullName;
    if (nameVal !== undefined) {
      updatePayload.fullName = nameVal;
      updatePayload.name = nameVal;
      updatePayload[`profile.name`] = nameVal;
    }

    const phoneVal = profileFields.phone;
    if (phoneVal !== undefined) {
      updatePayload.phone = phoneVal;
      updatePayload.phoneNumber = phoneVal;
      updatePayload[`profile.phoneNumber`] = phoneVal;
    }

    const locVal = profileFields.location;
    if (locVal !== undefined) {
      updatePayload.location = locVal;
      updatePayload.address = locVal;
      updatePayload[`profile.address`] = locVal;
    }

    const deptVal = profileFields.dept;
    if (deptVal !== undefined) {
      updatePayload.dept = deptVal;
      updatePayload.department = deptVal;
      updatePayload[`profile.department`] = deptVal;
    }

    const photoVal = profileFields.photoUrl;
    if (photoVal !== undefined) {
      updatePayload.photoUrl = photoVal;
      updatePayload.profilePhotoUrl = photoVal;
      updatePayload[`profile.profilePhotoUrl`] = photoVal;
    }

    await updateDoc(docRef, updatePayload);
  };

  // 3. Update settings object using updateDoc to only modify specific fields
  const updateSettings = async (settingsFields: Partial<RecruiterSettings>) => {
    if (!uid) return;
    const docRef = doc(db, 'marketplace_recruiters', uid);

    const updatePayload: any = {
      updatedAt: new Date().toISOString()
    };

    Object.entries(settingsFields).forEach(([key, val]) => {
      if (val !== undefined) {
        updatePayload[`settings.${key}`] = val;
      }
    });

    await updateDoc(docRef, updatePayload);
  };

  // 4. Update Theme specifically
  const setTheme = async (newTheme: 'light' | 'dark') => {
    await updateSettings({ theme: newTheme });
  };

  return (
    <RecruiterContext.Provider value={{
      recruiterProfile,
      loading,
      updateProfile,
      updateSettings,
      theme,
      setTheme
    }}>
      {children}
    </RecruiterContext.Provider>
  );
}
