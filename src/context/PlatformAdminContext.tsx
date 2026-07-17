import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from './AuthContext';
import { 
  DashboardService, 
  MetricsService, 
  AuditLogService, 
  LoginLogService, 
  OrganizationService, 
  PlatformUserService,
  PlatformAdminService,
  DashboardMetricDoc,
  SystemMetricDoc,
  AuditLogDoc,
  LoginLogDoc,
  PlatformAnalyticsDoc,
  PlatformSettingDoc
} from '../services/platformAdminService';

interface PlatformAdminContextType {
  organizations: any[];
  sysUsers: any[];
  dashboardMetrics: DashboardMetricDoc | null;
  systemMetrics: SystemMetricDoc | null;
  auditLogs: AuditLogDoc[];
  loginLogs: LoginLogDoc[];
  platformAnalytics: PlatformAnalyticsDoc | null;
  platformSettings: PlatformSettingDoc | null;
  loading: boolean;
  activeJobsCount: number;
  recruitersCount: number;
  candidatesCount: number;
  bdmsCount: number;
  applicationsCount: number;
  addOrg: (org: { name: string; type: 'University' | 'Company'; plan: string; status: 'Active' | 'Suspended' }) => Promise<void>;
  editOrg: (orgId: string, type: 'University' | 'Company', updates: { name: string; plan: string; status: 'Active' | 'Suspended' }) => Promise<void>;
  deleteOrg: (orgId: string, type: 'University' | 'Company') => Promise<void>;
  toggleUserStatus: (userId: string, currentStatus: 'Active' | 'Suspended') => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  addUser: (newUser: { name: string; email: string; role: string; organization: string; status: 'Active' | 'Suspended' }) => Promise<void>;
  updateSettings: (updates: Partial<PlatformSettingDoc>) => Promise<void>;
}

const PlatformAdminContext = createContext<PlatformAdminContextType | undefined>(undefined);

export function PlatformAdminProvider({ children }: { children: React.ReactNode }) {
  const { userProfile } = useAuth();
  const isPlatformAdmin = userProfile?.role === 'platform_admin';

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [sysUsers, setSysUsers] = useState<any[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetricDoc | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetricDoc | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogDoc[]>([]);
  const [loginLogs, setLoginLogs] = useState<LoginLogDoc[]>([]);
  const [platformAnalytics, setPlatformAnalytics] = useState<PlatformAnalyticsDoc | null>(null);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettingDoc | null>(null);
  const [loading, setLoading] = useState(true);

  // Core collection counts
  const [activeJobsCount, setActiveJobsCount] = useState(0);
  const [recruitersCount, setRecruitersCount] = useState(0);
  const [candidatesCount, setCandidatesCount] = useState(0);
  const [bdmsCount, setBdmsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);

  useEffect(() => {
    if (!isPlatformAdmin) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Initial load of settings
    PlatformAdminService.getSettings().then(settings => {
      if (settings) setPlatformSettings(settings);
    });

    // Subscriptions
    const unsubOrgs = OrganizationService.listenToOrganizations(setOrganizations);
    const unsubUsers = PlatformUserService.listenToPlatformUsers(setSysUsers);
    const unsubDbMetrics = DashboardService.listenToMetrics(setDashboardMetrics);
    const unsubSysMetrics = MetricsService.listenToSystemMetrics(setSystemMetrics);
    const unsubAnalytics = DashboardService.listenToAnalytics(setPlatformAnalytics);
    const unsubAudit = AuditLogService.listenToLogs(setAuditLogs);
    const unsubLogin = LoginLogService.listenToLoginLogs(setLoginLogs);

    const unsubJobs = onSnapshot(collection(db, 'marketplace_jobs'), (snap) => {
      setActiveJobsCount(snap.size);
    }, (err) => console.error("Error listening to jobs:", err));

    const unsubRecs = onSnapshot(collection(db, 'marketplace_recruiters'), (snap) => {
      setRecruitersCount(snap.size);
    }, (err) => console.error("Error listening to recruiters:", err));

    const unsubJobseekers = onSnapshot(collection(db, 'marketplace_jobseekers'), (snap) => {
      setCandidatesCount(snap.size);
    }, (err) => console.error("Error listening to jobseekers:", err));

    const unsubBdms = onSnapshot(collection(db, 'marketplace_bdms'), (snap) => {
      setBdmsCount(snap.size);
    }, (err) => console.error("Error listening to bdms:", err));

    const unsubApps = onSnapshot(collection(db, 'marketplace_applications'), (snap) => {
      setApplicationsCount(snap.size);
    }, (err) => console.error("Error listening to apps:", err));

    setLoading(false);

    return () => {
      unsubOrgs();
      unsubUsers();
      unsubDbMetrics();
      unsubSysMetrics();
      unsubAnalytics();
      unsubAudit();
      unsubLogin();
      unsubJobs();
      unsubRecs();
      unsubJobseekers();
      unsubBdms();
      unsubApps();
    };
  }, [isPlatformAdmin]);

  const addOrg = async (org: { name: string; type: 'University' | 'Company'; plan: string; status: 'Active' | 'Suspended' }) => {
    await OrganizationService.addOrganization(org);
  };

  const editOrg = async (orgId: string, type: 'University' | 'Company', updates: { name: string; plan: string; status: 'Active' | 'Suspended' }) => {
    await OrganizationService.updateOrganization(orgId, type, updates);
  };

  const deleteOrg = async (orgId: string, type: 'University' | 'Company') => {
    await OrganizationService.deleteOrganization(orgId, type);
  };

  const toggleUserStatus = async (userId: string, currentStatus: 'Active' | 'Suspended') => {
    await PlatformUserService.toggleUserStatus(userId, currentStatus);
  };

  const deleteUser = async (userId: string) => {
    await PlatformUserService.deleteUser(userId);
  };

  const addUser = async (newUser: { name: string; email: string; role: string; organization: string; status: 'Active' | 'Suspended' }) => {
    await PlatformUserService.addUser(newUser);
  };

  const updateSettings = async (updates: Partial<PlatformSettingDoc>) => {
    await PlatformAdminService.updateSettings(updates);
    const updated = await PlatformAdminService.getSettings();
    if (updated) setPlatformSettings(updated);
  };

  return (
    <PlatformAdminContext.Provider value={{
      organizations,
      sysUsers,
      dashboardMetrics,
      systemMetrics,
      auditLogs,
      loginLogs,
      platformAnalytics,
      platformSettings,
      loading,
      activeJobsCount,
      recruitersCount,
      candidatesCount,
      bdmsCount,
      applicationsCount,
      addOrg,
      editOrg,
      deleteOrg,
      toggleUserStatus,
      deleteUser,
      addUser,
      updateSettings
    }}>
      {children}
    </PlatformAdminContext.Provider>
  );
}

export function usePlatformAdmin() {
  const context = useContext(PlatformAdminContext);
  if (context === undefined) {
    throw new Error('usePlatformAdmin must be used within a PlatformAdminProvider');
  }
  return context;
}
