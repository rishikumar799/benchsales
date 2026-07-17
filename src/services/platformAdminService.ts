import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  deleteDoc, 
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/firebase';

// Types and Interfaces
export interface PlatformAdminDoc {
  uid: string;
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  photoURL: string;
  role: 'platform_admin';
  securityLevel: 'root';
  status: 'Active' | 'Suspended';
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  loginCount: number;
  mfaEnabled: boolean;
  isSuperAdmin: boolean;
}

export interface PlatformSettingDoc {
  systemName: string;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  primaryContact: string;
}

export interface SystemMetricDoc {
  apiStatus: string;
  aiLatency: string;
  dbReplicaStatus: string;
  isolationGuard: string;
  storageUsedGB: number;
  storageTotalGB: number;
  uptime: string;
  securityMonitoring: string;
}

export interface DashboardMetricDoc {
  totalOrganizations: number;
  companiesCount: number;
  universitiesCount: number;
  otherOrgsCount: number;
  totalUsers: number;
  studentsCount: number;
  recruitersCount: number;
  managersCount: number;
  activeJobs: number;
  marketplaceJobs: number;
  universityJobs: number;
  companyJobs: number;
  monthlyRevenue: number;
  subscriptionRev: number;
  marketplaceRev: number;
  otherRev: number;
}

export interface AuditLogDoc {
  id: string;
  actorUid: string;
  actorName: string;
  actorEmail: string;
  action: string;
  target: string;
  oldValue: any;
  newValue: any;
  timestamp: string;
}

export interface LoginLogDoc {
  id: string;
  uid: string;
  email: string;
  timestamp: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  status: 'Success' | 'Failed';
}

export interface PlatformAnalyticsDoc {
  id: string;
  trends: Array<{
    month: string;
    users: number;
    orgs: number;
    jobs: number;
    rev: number;
    students: number;
    recruiters: number;
    managers: number;
    sub: number;
    mkt: number;
    other: number;
  }>;
}

// Default Seed Data
const DEFAULT_SETTINGS: PlatformSettingDoc = {
  systemName: 'ARYX AI',
  maintenanceMode: false,
  allowNewRegistrations: true,
  primaryContact: 'admin@AryxAI.com'
};

const DEFAULT_SYSTEM_METRICS: SystemMetricDoc = {
  apiStatus: '0',
  aiLatency: '0ms',
  dbReplicaStatus: 'N/A',
  isolationGuard: 'N/A',
  storageUsedGB: 0,
  storageTotalGB: 0,
  uptime: '0%',
  securityMonitoring: 'N/A'
};

const DEFAULT_DASHBOARD_METRICS: DashboardMetricDoc = {
  totalOrganizations: 0,
  companiesCount: 0,
  universitiesCount: 0,
  otherOrgsCount: 0,
  totalUsers: 0,
  studentsCount: 0,
  recruitersCount: 0,
  managersCount: 0,
  activeJobs: 0,
  marketplaceJobs: 0,
  universityJobs: 0,
  companyJobs: 0,
  monthlyRevenue: 0,
  subscriptionRev: 0,
  marketplaceRev: 0,
  otherRev: 0
};

const DEFAULT_ANALYTICS: PlatformAnalyticsDoc = {
  id: 'current',
  trends: []
};

const DEFAULT_ORGANIZATIONS: any[] = [];

const DEFAULT_SYS_USERS: any[] = [];

// Seeder Utility
export async function seedDefaultPlatformData() {
  // Auto-seeding disabled to display only real Firestore data.
  return;
}

// 1. Platform Admin Service
export const PlatformAdminService = {
  async getProfile(uid: string): Promise<PlatformAdminDoc | null> {
    try {
      const snap = await getDoc(doc(db, 'platform_admins', uid));
      if (snap.exists()) {
        return snap.data() as PlatformAdminDoc;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `platform_admins/${uid}`);
    }
  },

  async updateProfile(uid: string, data: Partial<PlatformAdminDoc>): Promise<void> {
    try {
      await updateDoc(doc(db, 'platform_admins', uid), {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `platform_admins/${uid}`);
    }
  },

  async getSettings(): Promise<PlatformSettingDoc | null> {
    try {
      const snap = await getDoc(doc(db, 'platform_settings', 'general'));
      if (snap.exists()) {
        return snap.data() as PlatformSettingDoc;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'platform_settings/general');
    }
  },

  async updateSettings(data: Partial<PlatformSettingDoc>): Promise<void> {
    try {
      await updateDoc(doc(db, 'platform_settings', 'general'), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'platform_settings/general');
    }
  }
};

// 2. Dashboard & Analytics Service
export const DashboardService = {
  listenToMetrics(callback: (metrics: DashboardMetricDoc) => void) {
    return onSnapshot(
      doc(db, 'dashboard_metrics', 'current'),
      (snap) => {
        if (snap.exists()) {
          callback(snap.data() as DashboardMetricDoc);
        } else {
          callback(DEFAULT_DASHBOARD_METRICS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'dashboard_metrics/current');
      }
    );
  },

  listenToAnalytics(callback: (data: PlatformAnalyticsDoc) => void) {
    return onSnapshot(
      doc(db, 'platform_analytics', 'current'),
      (snap) => {
        if (snap.exists()) {
          callback(snap.data() as PlatformAnalyticsDoc);
        } else {
          callback(DEFAULT_ANALYTICS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'platform_analytics/current');
      }
    );
  }
};

// 3. Metrics Service
export const MetricsService = {
  listenToSystemMetrics(callback: (metrics: SystemMetricDoc) => void) {
    return onSnapshot(
      doc(db, 'system_metrics', 'current'),
      (snap) => {
        if (snap.exists()) {
          callback(snap.data() as SystemMetricDoc);
        } else {
          callback(DEFAULT_SYSTEM_METRICS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'system_metrics/current');
      }
    );
  }
};

// 4. Audit Log Service
export const AuditLogService = {
  async log(action: string, target: string, oldValue: any = null, newValue: any = null) {
    try {
      const id = 'aud-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      const actorUid = 'system-admin'; // Fallback if no auth context
      await setDoc(doc(db, 'audit_logs', id), {
        id,
        actorUid,
        actorName: 'Super Admin',
        actorEmail: 'admin@AryxAI.com',
        action,
        target,
        oldValue,
        newValue,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'audit_logs');
    }
  },

  listenToLogs(callback: (logs: AuditLogDoc[]) => void) {
    return onSnapshot(
      collection(db, 'audit_logs'),
      (snap) => {
        const logs: AuditLogDoc[] = [];
        snap.forEach(doc => {
          logs.push(doc.data() as AuditLogDoc);
        });
        // Sort by timestamp desc
        logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        callback(logs.slice(0, 50)); // Limit to last 50 logs
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'audit_logs');
      }
    );
  }
};

// 5. Login Log Service
export const LoginLogService = {
  async logLogin(uid: string, email: string, status: 'Success' | 'Failed') {
    try {
      const id = 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      await setDoc(doc(db, 'login_logs', id), {
        id,
        uid,
        email,
        timestamp: new Date().toISOString(),
        device: 'Chrome on macOS',
        browser: 'Chrome 125.0',
        location: 'New Delhi, India',
        ip: '192.168.1.1',
        status
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'login_logs');
    }
  },

  listenToLoginLogs(callback: (logs: LoginLogDoc[]) => void) {
    return onSnapshot(
      collection(db, 'login_logs'),
      (snap) => {
        const logs: LoginLogDoc[] = [];
        snap.forEach(doc => {
          logs.push(doc.data() as LoginLogDoc);
        });
        logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        callback(logs.slice(0, 50));
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'login_logs');
      }
    );
  }
};

// 6. Organization Firestore Sync Service
export const OrganizationService = {
  listenToOrganizations(callback: (orgs: any[]) => void) {
    const orgsMap = new Map<string, any>();
    
    const emit = () => {
      const combined = Array.from(orgsMap.values());
      // Sort desc by joined date or name
      combined.sort((a, b) => a.name.localeCompare(b.name));
      callback(combined);
    };

    const unsubUniv = onSnapshot(collection(db, 'organizations_universities'), (snap) => {
      snap.forEach(doc => {
        const d = doc.data();
        orgsMap.set(doc.id, {
          id: doc.id,
          name: d.organizationName || d.name || 'Unnamed University',
          type: 'University',
          users: d.usersCount || 0,
          plan: d.plan || 'Enterprise',
          status: d.status || 'Active',
          joinedDate: d.joinedDate || d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '02 May 2024'
        });
      });
      emit();
    });

    const unsubComp = onSnapshot(collection(db, 'organizations_companies'), (snap) => {
      snap.forEach(doc => {
        const d = doc.data();
        orgsMap.set(doc.id, {
          id: doc.id,
          name: d.organizationName || d.name || 'Unnamed Company',
          type: 'Company',
          users: d.usersCount || 0,
          plan: d.plan || 'Enterprise',
          status: d.status || 'Active',
          joinedDate: d.joinedDate || d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 May 2024'
        });
      });
      emit();
    });

    return () => {
      unsubUniv();
      unsubComp();
    };
  },

  async addOrganization(org: { name: string, type: 'University' | 'Company', plan: string, status: 'Active' | 'Suspended' }) {
    try {
      const colName = org.type === 'University' ? 'organizations_universities' : 'organizations_companies';
      const id = 'org-' + Date.now() + '-' + Math.floor(Math.random() * 100);
      await setDoc(doc(db, colName, id), {
        organizationId: id,
        organizationName: org.name,
        organizationType: org.type.toLowerCase(),
        plan: org.plan,
        status: org.status,
        createdAt: new Date().toISOString()
      });
      await AuditLogService.log('Create Organization', `${org.type}: ${org.name}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `organizations_${org.type.toLowerCase()}s`);
    }
  },

  async updateOrganization(orgId: string, type: 'University' | 'Company', updates: { name: string, plan: string, status: 'Active' | 'Suspended' }) {
    try {
      const colName = type === 'University' ? 'organizations_universities' : 'organizations_companies';
      await updateDoc(doc(db, colName, orgId), {
        organizationName: updates.name,
        plan: updates.plan,
        status: updates.status
      });
      await AuditLogService.log('Update Organization', `${type} [${orgId}]: ${updates.name}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `organizations_${type.toLowerCase()}s/${orgId}`);
    }
  },

  async deleteOrganization(orgId: string, type: 'University' | 'Company') {
    try {
      const colName = type === 'University' ? 'organizations_universities' : 'organizations_companies';
      await deleteDoc(doc(db, colName, orgId));
      await AuditLogService.log('Delete Organization', `${type} [${orgId}]`);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `organizations_${type.toLowerCase()}s/${orgId}`);
    }
  }
};

// 7. Universal Platform Users Sync Service
export const PlatformUserService = {
  listenToPlatformUsers(callback: (users: any[]) => void) {
    return onSnapshot(collection(db, 'users'), (snap) => {
      const users: any[] = [];
      snap.forEach(doc => {
        const d = doc.data();
        let roleLabel = d.role || 'User';
        // Format role name nicely
        roleLabel = roleLabel.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
        
        users.push({
          id: doc.id,
          name: d.displayName || d.fullName || 'No Name',
          email: d.email || '',
          role: roleLabel,
          organization: d.organizationName || d.organizationId || 'ARYX AI',
          lastLogin: d.lastLogin ? new Date(d.lastLogin).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A',
          status: d.status === 'suspended' ? 'Suspended' : 'Active'
        });
      });
      callback(users);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'users');
    });
  },

  async toggleUserStatus(userId: string, currentStatus: 'Active' | 'Suspended') {
    try {
      const nextStatus = currentStatus === 'Active' ? 'suspended' : 'approved';
      await updateDoc(doc(db, 'users', userId), {
        status: nextStatus,
        updatedAt: new Date().toISOString()
      });
      await AuditLogService.log('Toggle User Status', `User: ${userId} to ${nextStatus}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
    }
  },

  async deleteUser(userId: string) {
    try {
      await deleteDoc(doc(db, 'users', userId));
      await AuditLogService.log('Delete User', `User: ${userId}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${userId}`);
    }
  },

  async addUser(newUser: { name: string, email: string, role: string, organization: string, status: 'Active' | 'Suspended' }) {
    try {
      const id = 'usr-' + Date.now() + '-' + Math.floor(Math.random() * 100);
      await setDoc(doc(db, 'users', id), {
        uid: id,
        displayName: newUser.name,
        email: newUser.email,
        role: newUser.role.toLowerCase().replace(/ /g, '_'),
        organizationId: null,
        organizationName: newUser.organization,
        status: newUser.status === 'Suspended' ? 'suspended' : 'approved',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
      await AuditLogService.log('Add User', `User: ${newUser.name} (${newUser.email})`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
    }
  }
};
