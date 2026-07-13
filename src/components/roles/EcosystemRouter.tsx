import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  FileText, 
  Play, 
  Bot, 
  ArrowRight, 
  ArrowLeft,
  Users, 
  BarChart3, 
  ShieldCheck, 
  Phone, 
  Search, 
  Settings, 
  Check, 
  AlertCircle, 
  Plus, 
  Sparkles, 
  Layers, 
  Share2, 
  Upload, 
  Building2, 
  GraduationCap, 
  TrendingUp, 
  ArrowRightLeft, 
  BriefcaseBusiness 
} from 'lucide-react';
import { UserRole } from '../../types';
import { auth, db } from '../../firebase/firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, setDoc, deleteDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

// Candidate custom page imports
import DashboardTab from './candidate/pages/DashboardTab';
import JobsTab from './candidate/pages/JobsTab';
import AiMatchingTab from './candidate/pages/AiMatchingTab';
import ResumeBuilderTab from './candidate/pages/ResumeBuilderTab';
import ApplicationsTab from './candidate/pages/ApplicationsTab';
import DocumentsTab from './candidate/pages/DocumentsTab';
import ProfileTab from './candidate/pages/ProfileTab';
import SettingsTab from './candidate/pages/SettingsTab';

// Recruiter component imports
import RecruiterDashboardTab from './recruiter/pages/DashboardTab';
import RecruiterAvailableJobsTab from './recruiter/pages/AvailableJobsTab';
import RecruiterCandidatePoolTab, { CandidateProfile } from './recruiter/pages/CandidatePoolTab';
import RecruiterMySelectionsTab from './recruiter/pages/MySelectionsTab';
import RecruiterSubmissionsTab from './recruiter/pages/SubmissionsTab';
import RecruiterProfileTab from './recruiter/pages/ProfileTab';

// BDM Manager custom page imports
import ManagerDashboardTab from './manager/pages/DashboardTab';
import ManagerJobsTab from './manager/pages/JobsTab';
import ManagerCreateJobTab from './manager/pages/CreateJobTab';
import ManagerRecruitersTab from './manager/pages/RecruitersTab';
import ManagerSubmissionsTab from './manager/pages/SubmissionsTab';
import ManagerAnalyticsTab from './manager/pages/AnalyticsTab';
import ManagerProfileTab from './manager/pages/ProfileTab';
import { recruiterStorage } from './recruiter/utils/recruiterStorage';

// University Student custom page imports
import StudentDashboardTab from './student/pages/DashboardTab';
import StudentOpportunitiesTab from './student/pages/OpportunitiesTab';
import StudentAIMatchingTab from './student/pages/AIMatchingTab';
import StudentResumeBuilderTab from './student/pages/ResumeBuilderTab';
import StudentApplicationsTab from './student/pages/ApplicationsTab';
import StudentDocumentsTab from './student/pages/DocumentsTab';
import StudentProfileTab from './student/pages/ProfileTab';
import StudentSettings from './student/pages/Settings';

// Corporate Employee custom page imports
import EmployeeDashboardTab from './employee/pages/EmployeeDashboardTab';
import EmployeeOpportunitiesTab from './employee/pages/EmployeeOpportunitiesTab';
import EmployeeResumeBuilderTab from './employee/pages/EmployeeResumeBuilderTab';
import EmployeeApplicationsTab from './employee/pages/EmployeeApplicationsTab';
import EmployeeDocumentsTab from './employee/pages/EmployeeDocumentsTab';
import EmployeeProfileTab from './employee/pages/EmployeeProfileTab';
import EmployeeSettingsTab from './employee/pages/EmployeeSettingsTab';

// Placement Officer custom page imports
import OfficerDashboardTab from './officer/pages/DashboardTab';
import OfficerStudentsTab from './officer/pages/StudentsTab';
import OfficerOpportunitiesTab from './officer/pages/OpportunitiesTab';
import OfficerApplicationsTab from './officer/pages/ApplicationsTab';
import OfficerPlacementsTab from './officer/pages/PlacementsTab';
import OfficerAnalyticsTab from './officer/pages/AnalyticsTab';
import OfficerProfileTab from './officer/pages/ProfileTab';
import OfficerCreateOpportunityTab from './officer/pages/CreateOpportunityTab';

// University Admin custom page imports
import AdminDashboardTab from './admin/pages/DashboardTab';
import AdminOfficersTab from './admin/pages/OfficersTab';
import AdminAddOfficerTab from './admin/pages/AddOfficerTab';
import AdminStudentsTab from './admin/pages/StudentsTab';
import AdminOpportunitiesTab from './admin/pages/OpportunitiesTab';
import AdminPlacementsTab from './admin/pages/PlacementsTab';
import AdminReportsTab from './admin/pages/ReportsTab';
import AdminProfileTab from './admin/pages/ProfileTab';

// Corporate Recruiter custom page imports
import CorpRecruiterDashboardTab from './recruiter/pages/RecruiterDashboardTab';
import CorpRecruiterJobsTab from './recruiter/pages/RecruiterJobsTab';
import CorpRecruiterCandidatesTab from './recruiter/pages/RecruiterCandidatesTab';
import CorpRecruiterApplicationsTab from './recruiter/pages/RecruiterApplicationsTab';
import CorpRecruiterPipelineTab from './recruiter/pages/RecruiterPipelineTab';
import CorpRecruiterAnalyticsTab from './recruiter/pages/RecruiterAnalyticsTab';
import CorpRecruiterProfileTab from './recruiter/pages/RecruiterProfileTab';

// Company Manager (c_manager) custom page imports
import CompanyManagerDashboard from './manager/company/CompanyManagerDashboard';
import CompanyManagerJobs from './manager/company/CompanyManagerJobs';
import CompanyManagerCreateJob from './manager/company/CompanyManagerCreateJob';
import CompanyManagerRecruiters from './manager/company/CompanyManagerRecruiters';
import CompanyManagerApplications from './manager/company/CompanyManagerApplications';
import CompanyManagerPipeline from './manager/company/CompanyManagerPipeline';
import CompanyManagerAnalytics from './manager/company/CompanyManagerAnalytics';
import CompanyManagerProfile from './manager/company/CompanyManagerProfile';

// Company Admin (c_admin) custom page imports
import CompanyAdminDashboard from './admin/company/CompanyAdminDashboard';
import CompanyAdminManagers from './admin/company/CompanyAdminManagers';
import CompanyAdminRecruiters from './admin/company/CompanyAdminRecruiters';
import CompanyAdminEmployees from './admin/company/CompanyAdminEmployees';
import CompanyAdminJobs from './admin/company/CompanyAdminJobs';
import CompanyAdminReports from './admin/company/CompanyAdminReports';
import CompanyAdminProfile from './admin/company/CompanyAdminProfile';
import CompanyAdminDepartments from './admin/company/CompanyAdminDepartments';
import CompanyAdminSettings from './admin/company/CompanyAdminSettings';

// Platform Admin custom page imports
import PlatformDashboard from './platform/PlatformDashboard';
import PlatformOrganizations from './platform/PlatformOrganizations';
import PlatformUsers from './platform/PlatformUsers';
import PlatformMarketplace from './platform/PlatformMarketplace';
import PlatformUniversities from './platform/PlatformUniversities';
import PlatformCompanies from './platform/PlatformCompanies';
import PlatformBilling from './platform/PlatformBilling';
import PlatformSystem from './platform/PlatformSystem';
import PlatformProfile from './platform/PlatformProfile';

import CandidatePreviewModal from './recruiter/components/CandidatePreviewModal';
import SubmitProfileModal from './recruiter/components/SubmitProfileModal';
import RequestMoreModal from './recruiter/components/RequestMoreModal';

const RECRUITER_INFOS: Record<string, { name: string; email: string; phone: string; status: string }> = {
  'rec-1': { name: 'Rahul Singh', email: 'rahul.singh@example.com', phone: '+91 98765 43210', status: 'Active' },
  'rec-2': { name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '+91 98765 43211', status: 'Active' },
  'rec-3': { name: 'Akash Verma', email: 'akash.verma@example.com', phone: '+91 98765 43212', status: 'Active' },
  'rec-4': { name: 'Neha Patel', email: 'neha.patel@example.com', phone: '+91 98765 43213', status: 'Active' },
  'rec-5': { name: 'Karthik Nair', email: 'karthik.nair@example.com', phone: '+91 98765 43214', status: 'Active' },
  'rec-6': { name: 'Vikas Mehta', email: 'vikas.mehta@example.com', phone: '+91 98765 43215', status: 'Inactive' },
  'rec-7': { name: 'Simran Kaur', email: 'simran.kaur@example.com', phone: '+91 98765 43216', status: 'Active' }
};

const logJobActivity = async (jobId: string, action: string, description: string) => {
  try {
    const activityCol = collection(db, 'marketplace_jobs', jobId, 'activity');
    const actRef = doc(activityCol);
    await setDoc(actRef, {
      action,
      performedBy: auth.currentUser?.displayName || auth.currentUser?.email || 'System BDM',
      performedByRole: 'marketplace_bdm',
      timestamp: serverTimestamp(),
      description
    });
  } catch (err) {
    console.error("Error logging job activity:", err);
  }
};

const addJobTimelineEvent = async (jobId: string, event: string, description: string) => {
  try {
    const timelineCol = collection(db, 'marketplace_jobs', jobId, 'timeline');
    const timeRef = doc(timelineCol);
    await setDoc(timeRef, {
      event,
      timestamp: serverTimestamp(),
      description
    });
  } catch (err) {
    console.error("Error adding timeline event:", err);
  }
};

const syncAssignedRecruitersSubcollection = async (jobId: string, recruiterIds: string[], previousRecruiters: string[]) => {
  try {
    const bdmName = auth.currentUser?.displayName || auth.currentUser?.email || 'System BDM';
    
    // 1. Add new recruiters
    for (const rid of recruiterIds) {
      if (!previousRecruiters.includes(rid)) {
        const recInfo = RECRUITER_INFOS[rid] || {
          name: 'Recruiter Partner',
          email: `${rid}@example.com`,
          phone: '+91 98765 00000',
          status: 'Active'
        };
        const recRef = doc(db, 'marketplace_jobs', jobId, 'assigned_recruiters', rid);
        await setDoc(recRef, {
          uid: rid,
          name: recInfo.name,
          email: recInfo.email,
          phone: recInfo.phone,
          assignedBy: bdmName,
          assignedAt: serverTimestamp(),
          status: recInfo.status
        });
        
        // Log activity & timeline
        await logJobActivity(jobId, 'Recruiter Assigned', `${recInfo.name} was assigned to this requirement.`);
      }
    }

    // 2. Remove unassigned recruiters
    for (const rid of previousRecruiters) {
      if (!recruiterIds.includes(rid)) {
        const recRef = doc(db, 'marketplace_jobs', jobId, 'assigned_recruiters', rid);
        await deleteDoc(recRef);
        
        const recInfo = RECRUITER_INFOS[rid] || { name: rid };
        await logJobActivity(jobId, 'Recruiter Removed', `${recInfo.name} was unassigned from this requirement.`);
      }
    }
  } catch (err) {
    console.error("Error syncing assigned recruiters subcollection:", err);
  }
};

interface EcosystemRouterProps {
  role: UserRole;
  activeTab: string;
  setActiveTab?: (tab: string) => void;
}

// ==========================================
// CENTRALIZED MOCK CENTRAL FOR ALL ECOSYSTEMS 
// (Strictly Segregated by Ecosystem)
// ==========================================

export default function EcosystemRouter({ role, activeTab, setActiveTab }: EcosystemRouterProps) {
  const { userProfile, createPlacementOfficerUser } = useAuth();
  // Common states
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1.1 Corporate Recruiter States & Data
  const [recruiterActiveCandidateId, setRecruiterActiveCandidateId] = useState('');
  const [recruiterJobsList, setRecruiterJobsList] = useState<Array<{
    id: string;
    title: string;
    dept: string;
    location: string;
    applicationsCount: number;
    openings: number;
    status: 'Active' | 'Draft' | 'Closed';
    experience: string;
    type: string;
  }>>([]);

  const [recruiterCandidatesList, setRecruiterCandidatesList] = useState<Array<{
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    location: string;
    experience: string;
    currentCompany: string;
    currentRole: string;
    skills: string[];
    about: string;
    status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
    appliedDate: string;
    dept: string;
    assignedRecruiterId?: string;
    assignedByAdmin?: string;
    assignedDate?: string;
    assignedJobs?: string[];
  }>>([]);

  const [recruiterSelectedPipelineJob, setRecruiterSelectedPipelineJob] = useState('All');

  // Real-time Sync for Corporate Recruiter (c_recruiter)
  React.useEffect(() => {
    if (role !== 'c_recruiter' || !userProfile?.organizationId) {
      return;
    }

    const orgId = userProfile.organizationId;

    // A. Sync Jobs
    const jobsCol = collection(db, 'organizations_companies', orgId, 'jobs');
    const unsubscribeJobs = onSnapshot(jobsCol, (snap) => {
      const jobs = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || '',
          dept: data.dept || data.department || '',
          location: data.location || '',
          applicationsCount: data.applicationsCount || 0,
          openings: Number(data.openings) || 0,
          status: data.status || 'Active',
          experience: data.experience || '',
          type: data.type || '',
          createdBy: data.createdBy || ''
        };
      });
      setRecruiterJobsList(jobs);
    }, (err) => {
      console.error("Error syncing recruiter jobs:", err);
    });

    // B. Sync Applications (Candidates list for corporate recruiter)
    const appsCol = collection(db, 'organizations_companies', orgId, 'applications');
    const unsubscribeApps = onSnapshot(appsCol, (snap) => {
      const apps = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || data.candidateName || '',
          role: data.role || data.jobTitle || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          experience: data.experience || '',
          currentCompany: data.currentCompany || '',
          currentRole: data.currentRole || '',
          skills: data.skills || [],
          about: data.about || '',
          status: data.status || 'Applied',
          appliedDate: data.appliedDate || '',
          dept: data.dept || '',
          assignedRecruiterId: data.assignedRecruiterId || '',
          assignedByAdmin: data.assignedByAdmin || '',
          assignedDate: data.assignedDate || '',
          assignedJobs: data.assignedJobs || []
        };
      });
      setRecruiterCandidatesList(apps);
    }, (err) => {
      console.error("Error syncing recruiter candidates:", err);
    });

    return () => {
      unsubscribeJobs();
      unsubscribeApps();
    };
  }, [role, userProfile?.organizationId]);

  // Set first candidate as active when candidates list loads and active ID is empty
  React.useEffect(() => {
    if (role !== 'c_recruiter') return;
    const assigned = recruiterCandidatesList.filter(c => c.assignedRecruiterId === (userProfile?.uid || auth.currentUser?.uid || 'rec-1'));
    if (assigned.length > 0 && !recruiterActiveCandidateId) {
      setRecruiterActiveCandidateId(assigned[0].id);
    }
  }, [role, recruiterCandidatesList, userProfile?.uid, recruiterActiveCandidateId]);

  // Company Manager (c_manager) stateful data
  const [managerJobsList, setManagerJobsList] = useState<Array<{
    id: string;
    title: string;
    dept: string;
    location: string;
    applicationsCount: number;
    openings: number;
    status: 'Active' | 'Draft' | 'Closed';
    experience: string;
    type: string;
    reach: 'Internal - My Company' | 'Cross Company Network' | 'Across All Companies';
    recruitersAssigned: string[];
  }>>([
    { id: 'job-1', title: 'Senior Software Engineer', dept: 'Engineering', location: 'Bangalore, India', applicationsCount: 82, openings: 4, status: 'Active', experience: '4-6 Years', type: 'Full-time', reach: 'Internal - My Company', recruitersAssigned: ['Priya Sharma', 'Rahul Verma'] },
    { id: 'job-2', title: 'Cloud Engineer', dept: 'Engineering', location: 'Hyderabad, India', applicationsCount: 41, openings: 2, status: 'Active', experience: '3-5 Years', type: 'Full-time', reach: 'Cross Company Network', recruitersAssigned: ['Rahul Verma'] },
    { id: 'job-3', title: 'Tech Lead', dept: 'Engineering', location: 'Pune, India', applicationsCount: 26, openings: 1, status: 'Active', experience: '6-8 Years', type: 'Full-time', reach: 'Across All Companies', recruitersAssigned: ['Neha Patel'] },
    { id: 'job-4', title: 'Data Scientist', dept: 'Data Science', location: 'Bangalore, India', applicationsCount: 18, openings: 2, status: 'Active', experience: '4-6 Years', type: 'Full-time', reach: 'Cross Company Network', recruitersAssigned: ['Priya Sharma', 'Neha Patel'] },
    { id: 'job-5', title: 'Product Manager', dept: 'Product', location: 'Remote', applicationsCount: 15, openings: 1, status: 'Draft', experience: '6-8 Years', type: 'Full-time', reach: 'Internal - My Company', recruitersAssigned: ['Neha Patel'] },
  ]);
  const [managerEditingJob, setManagerEditingJob] = useState<any>(null);
  const [isManagerCreatingJob, setIsManagerCreatingJob] = useState(false);

  // Company Admin (c_admin) stateful data
  const [adminManagersList, setAdminManagersList] = useState<any[]>([]);
  const [adminRecruitersList, setAdminRecruitersList] = useState<any[]>([]);
  const [adminEmployeesList, setAdminEmployeesList] = useState<any[]>([]);
  const [adminJobsList, setAdminJobsList] = useState<any[]>([]);
  const [adminDepartmentsList, setAdminDepartmentsList] = useState<any[]>([]);
  const [companySettings, setCompanySettings] = useState<any>({});
  const [companyData, setCompanyData] = useState<any>(null);
  const [adminProfileData, setAdminProfileData] = useState<any>(null);
  const [activityList, setActivityList] = useState<any[]>([]);
  const [applicationsList, setApplicationsList] = useState<any[]>([]);

  // 1. Marketplace Mock Data & States
  const [myRequirements, setMyRequirements] = useState([
    { id: '1', title: 'Senior React Developer', client: 'Netflix', salary: '$140k - $160k', visibility: 'All Marketplace Recruiters', skills: 'React, TypeScript, Tailwind' },
    { id: '2', title: 'Solutions Architect', client: 'Stripe', salary: '$180k - $210k', visibility: 'Selected Recruiters', skills: 'AWS, Kubernetes, Go' },
  ]);
  const [newReqTitle, setNewReqTitle] = useState('');
  const [newReqClient, setNewReqClient] = useState('');
  const [newReqSalary, setNewReqSalary] = useState('');
  const [newReqVisibility, setNewReqVisibility] = useState('All Marketplace Recruiters');
  const [newReqSkills, setNewReqSkills] = useState('');

  const [talentPool, setTalentPool] = useState([
    { id: '1', name: 'Alok Sharma', role: 'Fullstack Dev', score: 98, status: 'Active', age: '3 days on Bench' },
    { id: '2', name: 'Sneha Patel', role: 'Cloud Platform Eng', score: 95, status: 'Pending Approval', age: '1 day on Bench' },
    { id: '3', name: 'Rohan Deshmukh', role: 'Senior UX Designer', score: 91, status: 'Claimed', age: '12 days on Bench' }
  ]);

  const [submissions, setSubmissions] = useState([
    { id: '1', candidate: 'Alok Sharma', requirement: 'Senior React Developer', bdm: 'Chris Cooper', status: 'Submitted' },
    { id: '2', candidate: 'Rohan Deshmukh', requirement: 'Solutions Architect', bdm: 'Sarah Jenkins', status: 'Interviewing' },
  ]);

  // BDM Manager States and Datasets matching Image 2 exactly
  const [mManagerJobs, setMManagerJobs] = useState([
    {
      id: 'job-1',
      title: 'Frontend Developer',
      client: 'ABC Technologies',
      experience: '3 - 5 Years',
      skills: 'React, Node.js, TypeScript, HTML',
      location: 'Hyderabad',
      openings: '15 Positions',
      recruitersCount: 5,
      submissionsCount: 18,
      status: 'Active' as const,
      assignmentMode: 'restricted' as const,
      assignedRecruiters: ['rec-1', 'rec-2', 'rec-3', 'rec-4', 'rec-5'],
    },
    {
      id: 'job-2',
      title: 'Java Developer',
      client: 'Infosoft',
      experience: '4 - 6 Years',
      skills: 'Java, Spring Boot, MySQL',
      location: 'Bangalore',
      openings: '8 Positions',
      recruitersCount: 3,
      submissionsCount: 12,
      status: 'Active' as const,
      assignmentMode: 'open' as const,
      assignedRecruiters: [] as string[],
    },
    {
      id: 'job-3',
      title: 'QA Engineer',
      client: 'X Corp',
      experience: '2 - 4 Years',
      skills: 'Manual Testing, Selenium, JIRA',
      location: 'Pune',
      openings: '6 Positions',
      recruitersCount: 2,
      submissionsCount: 8,
      status: 'Active' as const,
      assignmentMode: 'restricted' as const,
      assignedRecruiters: ['rec-2', 'rec-3'],
    },
    {
      id: 'job-4',
      title: 'DevOps Engineer',
      client: 'CloudNet Solutions',
      experience: '3 - 6 Years',
      skills: 'AWS, Docker, Kubernetes',
      location: 'Remote',
      openings: '10 Positions',
      recruitersCount: 4,
      submissionsCount: 15,
      status: 'Active' as const,
      assignmentMode: 'open' as const,
      assignedRecruiters: [] as string[],
    }
  ]);
  const [editingMManagerJob, setEditingMManagerJob] = useState<any | null>(null);

  // Recruiter Specific States and Datasets
  const [recruiterCandidates, setRecruiterCandidates] = useState<CandidateProfile[]>([
    {
      id: 'c1',
      name: 'Ravi Kumar',
      experience: '4 Years',
      skills: ['React', 'Node.js', 'MongoDB'],
      availability: 'Available',
      details: {
        role: 'Software Developer',
        skillsFull: ['React', 'Node.js', 'MongoDB', 'Express.js', 'JavaScript', 'HTML', 'CSS', 'Bootstrap'],
        years: 4,
        currentCompany: 'Tech Solutions Pvt Ltd',
        currentRole: 'Software Developer',
        availabilityDetails: 'Available Immediately'
      }
    },
    {
      id: 'c2',
      name: 'Priya Sharma',
      experience: '3 Years',
      skills: ['Java', 'Spring Boot', 'MySQL'],
      availability: 'Available',
      details: {
        role: 'Backend Java Developer',
        skillsFull: ['Java', 'Spring Boot', 'MySQL', 'Hibernate', 'REST APIs', 'AWS'],
        years: 3,
        currentCompany: 'Infosys Ltd',
        currentRole: 'System Engineer',
        availabilityDetails: 'Available Immediately'
      }
    },
    {
      id: 'c3',
      name: 'Akash Reddy',
      experience: '5 Years',
      skills: ['AWS', 'DevOps', 'Docker'],
      availability: 'Available',
      details: {
        role: 'DevOps & Site Reliability Engineer',
        skillsFull: ['AWS', 'DevOps', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux'],
        years: 5,
        currentCompany: 'Wipro Technologies',
        currentRole: 'Infrastructure Engineer',
        availabilityDetails: 'Available Immediately'
      }
    },
    {
      id: 'c4',
      name: 'Sneha Iyer',
      experience: '2 Years',
      skills: ['Python', 'Django', 'PostgreSQL'],
      availability: 'Available',
      details: {
        role: 'Junior PyDev Engineer',
        skillsFull: ['Python', 'Django', 'Flask', 'PostgreSQL', 'API Development', 'Git'],
        years: 2,
        currentCompany: 'Cognizant Ltd',
        currentRole: 'Software Associate',
        availabilityDetails: 'Available Immediately'
      }
    },
    {
      id: 'c5',
      name: 'Karthik Nair',
      experience: '4 Years',
      skills: ['React', 'TypeScript', 'Redux'],
      availability: 'Available',
      details: {
        role: 'Sr. Frontend UI Engineer',
        skillsFull: ['React', 'TypeScript', 'Redux', 'Tailwind CSS', 'Vite', 'GraphQL'],
        years: 4,
        currentCompany: 'Accenture Cloud Services',
        currentRole: 'Frontend Analyst',
        availabilityDetails: 'Available Immediately'
      }
    },
    {
      id: 'c6',
      name: 'Neha Verma',
      experience: '3 Years',
      skills: ['UI/UX', 'Figma', 'Adobe XD'],
      availability: 'Available',
      details: {
        role: 'Product Designer',
        skillsFull: ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Wireframing'],
        years: 3,
        currentCompany: 'Creative Agency Inc',
        currentRole: 'UI/UX Lead Designer',
        availabilityDetails: 'Available Immediately'
      }
    },
    {
      id: 'c7',
      name: 'Pavan Kumar',
      experience: '4 Years',
      skills: ['Java', 'Microservices', 'Kafka'],
      availability: 'Available',
      details: {
        role: 'Cloud Microservices Engineer',
        skillsFull: ['Java', 'Spring Cloud', 'Microservices', 'Apache Kafka', 'Redis', 'Docker'],
        years: 4,
        currentCompany: 'LTI Mindtree',
        currentRole: 'Backend Engineer',
        availabilityDetails: 'Available Immediately'
      }
    },
    {
      id: 'c8',
      name: 'Anjali Mehta',
      experience: '2 Years',
      skills: ['Manual Testing', 'Selenium'],
      availability: 'Available',
      details: {
        role: 'QA Automation Engineer',
        skillsFull: ['Manual Testing', 'Selenium', 'Java', 'JUnit', 'Regression Testing', 'Jira'],
        years: 2,
        currentCompany: 'HCL Technologies',
        currentRole: 'QA Test Analyst',
        availabilityDetails: 'Available Immediately'
      }
    },
    {
      id: 'c9',
      name: 'Mohit Singh',
      experience: '5 Years',
      skills: ['.NET', 'C#', 'SQL Server'],
      availability: 'Available',
      details: {
        role: 'Full Stack .NET Developer',
        skillsFull: ['.NET Core', 'C#', 'SQL Server', 'ASP.NET Core', 'React', 'Azure Developer'],
        years: 5,
        currentCompany: 'Capgemini Tech',
        currentRole: 'Senior .NET Developer',
        availabilityDetails: 'Available Immediately'
      }
    },
    {
      id: 'c10',
      name: 'Divya Reddy',
      experience: '3 Years',
      skills: ['Node.js', 'Express', 'MongoDB'],
      availability: 'Available',
      details: {
        role: 'Fullstack Node.js Developer',
        skillsFull: ['Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'TypeScript', 'Jest', 'Git'],
        years: 3,
        currentCompany: 'Tech Mahindra',
        currentRole: 'Software Developer',
        availabilityDetails: 'Available Immediately'
      }
    }
  ]);

  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>(['c1', 'c2', 'c3']);
  const [previewCandidate, setPreviewCandidate] = useState<CandidateProfile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [submitCandidate, setSubmitCandidate] = useState<CandidateProfile | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  const [isRequestMoreOpen, setIsRequestMoreOpen] = useState(false);

  // AI Resume Tailoring Simulator
  const [jdPasted, setJdPasted] = useState('');
  const [tailoringProgress, setTailoringProgress] = useState(0);
  const [tailoredResult, setTailoredResult] = useState<{ score: number; keywords: string[]; text: string } | null>(null);

  // Auto Apply worker simulation
  const [autoApplyLogs, setAutoApplyLogs] = useState<string[]>([
    'Worker initialized on server...',
    'Awaiting job submission cues...',
  ]);
  const [isApplyActive, setIsApplyActive] = useState(false);

  // Placement Officer states
  const [officerJobs, setOfficerJobs] = useState([
    { id: '1', company: 'TCS', title: 'Software Engineer', type: 'Full Time', package: '4.5 LPA', experience: 'Freshers', location: 'Hyderabad', eligibility: 'B.Tech - 2026 Batch', gradYear: '2026', dept: 'CSE', deadline: '15 Jun 2026', description: 'Development and maintenance of software components.', applicants: 124, visibility: 'My University', status: 'Active' },
    { id: '2', company: 'Infosys', title: 'System Engineer', type: 'Full Time', package: '4.0 LPA', experience: 'Freshers', location: 'Bangalore', eligibility: 'B.Tech / MCA - 2026 Batch', gradYear: '2026', dept: 'CSE', deadline: '20 Jun 2026', description: 'Configure, test, and support computer systems.', applicants: 96, visibility: 'All Universities', status: 'Active' },
    { id: '3', company: 'Wipro', title: 'Associate Engineer', type: 'Full Time', package: '3.5 LPA', experience: 'Freshers', location: 'Chennai', eligibility: 'Any Graduate - 2026', gradYear: '2026', dept: 'All', deadline: '25 Jun 2026', description: 'Assisting in software development lifecycle activities.', applicants: 82, visibility: 'Selected Universities', status: 'Active' },
    { id: '4', company: 'Capgemini', title: 'Analyst', type: 'Full Time', package: '4.3 LPA', experience: 'Freshers', location: 'Pune', eligibility: 'B.E / B.Tech - 2026', gradYear: '2026', dept: 'ECE', deadline: '18 Jun 2026', description: 'Analyze business processes and software specifications.', applicants: 64, visibility: 'My University', status: 'Active' },
  ]);
  const [isCreatingOpportunity, setIsCreatingOpportunity] = useState(false);

  // University states
  const [csvUploaded, setCsvUploaded] = useState(false);
  const [deptOfficers, setDeptOfficers] = useState([
    { name: 'Dr. Ramesh Babu', dept: 'Computer Science', activeJobs: '12 Drives', activeStudents: 145 },
    { name: 'Prof. Geetha Roy', dept: 'Electrical Eng', activeJobs: '7 Drives', activeStudents: 98 },
  ]);
  const [campusDrives, setCampusDrives] = useState([
    { id: '101', title: 'TCS Digital Drive', package: '7.5 LPA', deadline: '2026-06-15', enrolled: 84 },
    { id: '102', title: 'Cognizant GenC Elevate', package: '5.2 LPA', deadline: '2026-06-20', enrolled: 110 }
  ]);

  // University Admin Placement Officers state
  const [adminOfficers, setAdminOfficers] = useState<any[]>([]);

  // Firestore listener for Placement Officers
  React.useEffect(() => {
    if (role !== 'u_admin' || !userProfile?.organizationId) {
      return;
    }

    const colRef = collection(db, 'organizations_universities', userProfile.organizationId, 'placement_officers');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const officers = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.fullName || '',
          fullName: data.fullName || '',
          dept: data.department || '',
          department: data.department || '',
          designation: data.designation || '',
          email: data.email || '',
          phone: data.phone || '',
          opportunities: data.opportunities || 0,
          placements: data.placements || 0,
          status: data.status || 'Active',
          avatar: data.avatar || `https://picsum.photos/seed/${(data.fullName || 'officer').replace(/\s+/g, '')}/100/100`,
          createdAt: data.createdAt || ''
        };
      });
      setAdminOfficers(officers);
    }, (error) => {
      console.error("Error fetching placement officers from Firestore: ", error);
    });

    return () => unsubscribe();
  }, [role, userProfile?.organizationId]);

  const [isAdminCreatingOfficer, setIsAdminCreatingOfficer] = useState(false);
  const [selectedAdminOfficer, setSelectedAdminOfficer] = useState<any | null>(null);
  const [isEditingSelectedOfficer, setIsEditingSelectedOfficer] = useState(false);
  const [editOfficerName, setEditOfficerName] = useState('');
  const [editOfficerPhone, setEditOfficerPhone] = useState('');
  const [editOfficerDept, setEditOfficerDept] = useState('');
  const [editOfficerDesignation, setEditOfficerDesignation] = useState('');

  // Company Ecosystem states
  const [corpPositions, setCorpPositions] = useState([
    { title: 'Global Lead Engineer', dept: 'Core Platform', grade: 'L7', vacancies: 2 },
    { title: 'Information Security Officer', dept: 'InfoSec Division', grade: 'L6', vacancies: 1 }
  ]);
  const [skillsPath, setSkillsPath] = useState([
    { skill: 'Google Cloud Architect Certification', status: 'AI Recommends', difficulty: 'Advanced' },
    { skill: 'System Design Patterns', status: 'In Progress', difficulty: 'Intermediate' }
  ]);

  // Platform Admin states
  const [organizations, setOrganizations] = useState<any[]>([
    { id: 'org-1', name: 'Stanford University (Ecosystem 2)', type: 'University', users: 1420, plan: 'Enterprise', status: 'Active', joinedDate: '02 May 2024' },
    { id: 'org-2', name: 'Microsoft Corporation (Ecosystem 3)', type: 'Company', users: 890, plan: 'Enterprise', status: 'Active', joinedDate: '01 May 2024' },
    { id: 'org-3', name: 'ABC Placement Agency (Ecosystem 1)', type: 'Company', users: 5400, plan: 'Professional', status: 'Active', joinedDate: '28 Apr 2024' },
    { id: 'org-4', name: 'InnovateX Solutions', type: 'Company', users: 3120, plan: 'Professional', status: 'Active', joinedDate: '24 Apr 2024' },
    { id: 'org-5', name: 'Future University Group', type: 'University', users: 2750, plan: 'Enterprise', status: 'Active', joinedDate: '15 Apr 2024' },
  ]);
  const [sysUsers, setSysUsers] = useState<any[]>([
    { id: 'usr-1', name: 'Rahul Verma', email: 'rahul.verma@corp.com', role: 'Company Admin', organization: 'TechCorp Solutions', lastLogin: '30 May 2024, 10:30 AM', status: 'Active' },
    { id: 'usr-2', name: 'Priya Sharma', email: 'priya.sharma@edu.edu', role: 'Placement Officer', organization: 'ABC University', lastLogin: '30 May 2024, 09:15 AM', status: 'Active' },
    { id: 'usr-3', name: 'Amit Singh', email: 'amit.singh@globalrecruit.com', role: 'Recruiter', organization: 'Global Recruiters', lastLogin: '30 May 2024, 08:45 AM', status: 'Active' },
    { id: 'usr-4', name: 'Neha Patel', email: 'neha.patel@innovatex.com', role: 'BDM', organization: 'InnovateX', lastLogin: '29 May 2024, 06:20 PM', status: 'Active' },
    { id: 'usr-5', name: 'Vikram Joshi', email: 'vikram.joshi@uni.edu', role: 'University Admin', organization: 'XYZ University', lastLogin: '29 May 2024, 04:10 PM', status: 'Suspended' },
    { id: 'usr-6', name: 'Anjali Mehta', email: 'anjali.mehta@aryx.ai', role: 'Platform Admin', organization: 'ARYX AI', lastLogin: '29 May 2024, 11:35 AM', status: 'Active' },
  ]);

  // ==========================================
  // COMPANY ADMIN FIRESTORE LISTENERS & AUTO-SEEDERS
  // ==========================================
  
  // 1. Root Company Document standardization & real-time Sync
  React.useEffect(() => {
    if (role !== 'c_admin' || !userProfile?.organizationId) {
      return;
    }

    const docRef = doc(db, 'organizations_companies', userProfile.organizationId);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setCompanyData({ id: snap.id, ...snap.data() });
      } else {
        // Fallback locally only - ZERO automatic seeding writes
        const defaultCompany = {
          organizationId: userProfile.organizationId,
          organizationName: 'Tech Solutions Pvt. Ltd.',
          organizationType: 'company',
          adminUid: userProfile.uid || '',
          status: 'Active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          category: 'Technology, Information and Internet',
          primarySegment: 'Software Development',
          website: 'www.techsolutions.com',
          hqLocation: 'Bangalore, India',
          foundedYear: '2015',
          workforceVolume: '1001 - 5000 Employees',
          supportEmail: 'contact@techsolutions.com',
          enableAutoSuggestions: true,
          digestFrequency: 'Daily',
          portalStatus: 'Active'
        };
        setCompanyData(defaultCompany);
      }
    }, (error) => {
      console.error("Error syncing company document:", error);
    });
    return () => unsubscribe();
  }, [role, userProfile?.organizationId]);

  // 2. Admin Personal Profile real-time Sync
  React.useEffect(() => {
    if (role !== 'c_admin' || !userProfile?.organizationId || !userProfile?.uid) {
      return;
    }

    const docRef = doc(db, 'organizations_companies', userProfile.organizationId, 'admins', userProfile.uid);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setAdminProfileData({ id: snap.id, ...snap.data() });
      } else {
        // Fallback locally only - ZERO automatic seeding writes
        const defaultAdmin = {
          uid: userProfile.uid,
          fullName: userProfile.fullName || userProfile.displayName || 'Vikram Singh',
          name: userProfile.fullName || userProfile.displayName || 'Vikram Singh',
          empId: 'ADM10001',
          designation: 'Company Administrator',
          department: 'Administration',
          dept: 'Administration',
          email: userProfile.email || 'admin@techsolutions.com',
          phoneNumber: userProfile.phoneNumber || '+91 98765 43210',
          phone: userProfile.phoneNumber || '+91 98765 43210',
          status: 'Active',
          createdAt: new Date().toISOString()
        };
        setAdminProfileData(defaultAdmin);
      }
    }, (error) => {
      console.error("Error syncing admin profile:", error);
    });
    return () => unsubscribe();
  }, [role, userProfile?.organizationId, userProfile?.uid]);

  // 3. Departments real-time Sync
  React.useEffect(() => {
    if (role !== 'c_admin' || !userProfile?.organizationId) {
      return;
    }

    const colRef = collection(db, 'organizations_companies', userProfile.organizationId, 'departments');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const depts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdminDepartmentsList(depts);
    }, (error) => {
      console.error("Error syncing departments:", error);
    });
    return () => unsubscribe();
  }, [role, userProfile?.organizationId]);

  // 4. Recruiters real-time Sync
  React.useEffect(() => {
    if (role !== 'c_admin' || !userProfile?.organizationId) {
      return;
    }

    const colRef = collection(db, 'organizations_companies', userProfile.organizationId, 'recruiters');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const recruiters = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdminRecruitersList(recruiters);
    }, (error) => {
      console.error("Error syncing recruiters:", error);
    });
    return () => unsubscribe();
  }, [role, userProfile?.organizationId]);

  // 5. Employees real-time Sync
  React.useEffect(() => {
    if (role !== 'c_admin' || !userProfile?.organizationId) {
      return;
    }

    const colRef = collection(db, 'organizations_companies', userProfile.organizationId, 'employees');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const emps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdminEmployeesList(emps);
    }, (error) => {
      console.error("Error syncing employees:", error);
    });
    return () => unsubscribe();
  }, [role, userProfile?.organizationId]);

  // 6. Managers real-time Sync
  React.useEffect(() => {
    if (role !== 'c_admin' || !userProfile?.organizationId) {
      return;
    }

    const colRef = collection(db, 'organizations_companies', userProfile.organizationId, 'managers');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const mgrs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdminManagersList(mgrs);
    }, (error) => {
      console.error("Error syncing managers:", error);
    });
    return () => unsubscribe();
  }, [role, userProfile?.organizationId]);

  // 7. Jobs real-time Sync
  React.useEffect(() => {
    if (role !== 'c_admin' || !userProfile?.organizationId) {
      return;
    }

    const colRef = collection(db, 'organizations_companies', userProfile.organizationId, 'jobs');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdminJobsList(jobs);
    }, (error) => {
      console.error("Error syncing jobs:", error);
    });
    return () => unsubscribe();
  }, [role, userProfile?.organizationId]);

  // 8. Recent Activities Sync
  React.useEffect(() => {
    if (role !== 'c_admin' || !userProfile?.organizationId) {
      return;
    }

    const colRef = collection(db, 'organizations_companies', userProfile.organizationId, 'activity');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const acts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActivityList(acts);
    }, (error) => {
      console.error("Error syncing activities:", error);
    });
    return () => unsubscribe();
  }, [role, userProfile?.organizationId]);

  // 9. Applications real-time Sync
  React.useEffect(() => {
    if (role !== 'c_admin' || !userProfile?.organizationId) {
      return;
    }

    const colRef = collection(db, 'organizations_companies', userProfile.organizationId, 'applications');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplicationsList(apps);
    }, (error) => {
      console.error("Error syncing applications:", error);
    });
    return () => unsubscribe();
  }, [role, userProfile?.organizationId]);

  // ==========================================
  // HANDLERS
  // ==========================================

  React.useEffect(() => {
    const syncJobs = () => {
      const dbJobs = recruiterStorage.getJobs();
      setMManagerJobs(dbJobs.map(job => ({
        id: job.id,
        title: job.title,
        client: job.company,
        experience: job.experience,
        skills: Array.isArray(job.skills) ? job.skills.join(', ') : String(job.skills),
        location: job.location,
        openings: job.positions,
        recruitersCount: job.jobType === 'assigned' ? 3 : 5, 
        submissionsCount: recruiterStorage.getSubmissions().filter(s => s.jobId === job.id).length, 
        status: job.accessStatus === 'none' ? 'Paused' as const : 'Active' as const, 
        assignmentMode: job.jobType === 'assigned' ? 'restricted' as const : 'open' as const,
        assignedRecruiters: job.jobType === 'assigned' ? ['rec-1', 'rec-2'] : []
      })));
    };

    syncJobs();
    window.addEventListener('storage', syncJobs);
    return () => window.removeEventListener('storage', syncJobs);
  }, []);

  React.useEffect(() => {
    const unsub = onSnapshot(collection(db, 'marketplace_submissions'), async (snapshot) => {
      try {
        const allSubs = snapshot.docs.map(d => ({ id: d.id, ...d.data() as any }));
        
        const subsByJob: Record<string, any[]> = {};
        allSubs.forEach(s => {
          if (s.jobId) {
            if (!subsByJob[s.jobId]) subsByJob[s.jobId] = [];
            subsByJob[s.jobId].push(s);
          }
        });

        const jobsSnap = await getDocs(collection(db, 'marketplace_jobs'));
        for (const jobDoc of jobsSnap.docs) {
          const jobId = jobDoc.id;
          const jobData = jobDoc.data();
          const jobSubs = subsByJob[jobId] || [];

          const submissionCount = jobSubs.length;
          const shortlistedCount = jobSubs.filter(s => s.status === 'Shortlisted').length;
          const hiredCount = jobSubs.filter(s => s.status === 'Selected' || s.status === 'Joined' || s.status === 'Hired').length;
          const recruiterCount = jobData.assignedRecruiters?.length || 0;

          if (
            jobData.submissionCount !== submissionCount ||
            jobData.shortlistedCount !== shortlistedCount ||
            jobData.hiredCount !== hiredCount ||
            jobData.recruiterCount !== recruiterCount
          ) {
            await updateDoc(jobDoc.ref, {
              submissionCount,
              shortlistedCount,
              hiredCount,
              recruiterCount
            });

            const bdmUid = jobData.createdBy;
            if (bdmUid) {
              const bdmJobRef = doc(db, 'marketplace_bdms', bdmUid, 'jobs', jobId);
              const bdmJobSnap = await getDoc(bdmJobRef);
              if (bdmJobSnap.exists()) {
                await updateDoc(bdmJobRef, {
                  updatedAt: serverTimestamp()
                });
              }
            }
          }

          for (const s of jobSubs) {
            const subRef = doc(db, 'marketplace_jobs', jobId, 'submissions', s.id);
            const subSnap = await getDoc(subRef);
            if (!subSnap.exists()) {
              await setDoc(subRef, s);
            } else {
              const currentSubData = subSnap.data();
              if (currentSubData.status !== s.status) {
                await setDoc(subRef, s);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error in submissions-to-jobs auto-sync:", err);
      }
    });

    return () => unsub();
  }, []);

  const handleInitializeDemoWorkspace = async () => {
    if (!userProfile?.organizationId) return;

    try {
      // 1. Root Company Doc
      const docRef = doc(db, 'organizations_companies', userProfile.organizationId);
      const defaultCompany = {
        organizationId: userProfile.organizationId,
        organizationName: 'Tech Solutions Pvt. Ltd.',
        organizationType: 'company',
        adminUid: userProfile.uid || '',
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: 'Technology, Information and Internet',
        primarySegment: 'Software Development',
        website: 'www.techsolutions.com',
        hqLocation: 'Bangalore, India',
        foundedYear: '2015',
        workforceVolume: '1001 - 5000 Employees',
        supportEmail: 'contact@techsolutions.com',
        enableAutoSuggestions: true,
        digestFrequency: 'Daily',
        portalStatus: 'Active'
      };
      await setDoc(docRef, defaultCompany);

      // 2. Admin Personal Profile
      if (userProfile.uid) {
        const adminDocRef = doc(db, 'organizations_companies', userProfile.organizationId, 'admins', userProfile.uid);
        const defaultAdmin = {
          uid: userProfile.uid,
          fullName: userProfile.fullName || userProfile.displayName || 'Vikram Singh',
          name: userProfile.fullName || userProfile.displayName || 'Vikram Singh',
          empId: 'ADM10001',
          designation: 'Company Administrator',
          department: 'Administration',
          dept: 'Administration',
          email: userProfile.email || 'admin@techsolutions.com',
          phoneNumber: userProfile.phoneNumber || '+91 98765 43210',
          phone: userProfile.phoneNumber || '+91 98765 43210',
          status: 'Active',
          createdAt: new Date().toISOString()
        };
        await setDoc(adminDocRef, defaultAdmin);
      }

      // 3. Departments
      const deptCol = collection(db, 'organizations_companies', userProfile.organizationId, 'departments');
      const deptDefaults = [
        { name: 'Engineering', description: 'Software design, backend services, cloud infrastructure development and engineering QA division.', createdAt: new Date().toISOString() },
        { name: 'Product', description: 'Product roadmap definitions, requirement specifications, UI/UX design and wireframing.', createdAt: new Date().toISOString() },
        { name: 'Data Science', description: 'Big data processing, analytics, predictive models, machine learning algorithms and dashboard visualization.', createdAt: new Date().toISOString() },
        { name: 'Sales', description: 'Enterprise accounts development, product presentation, contract negotiation and sales pipeline acceleration.', createdAt: new Date().toISOString() },
        { name: 'Operations', description: 'Business alignment, resource scheduling, corporate workflow automation and customer deployment support.', createdAt: new Date().toISOString() }
      ];
      for (const dept of deptDefaults) {
        await addDoc(deptCol, dept);
      }

      // 4. Recruiters
      const recCol = collection(db, 'organizations_companies', userProfile.organizationId, 'recruiters');
      const recDefaults = [
        { name: 'Priya Sharma', dept: 'Engineering', jobs: 4, applications: 248, selections: 8, status: 'Active', avatar: 'https://picsum.photos/seed/priyasharma/100/100', email: 'priya.sharma@company.com' },
        { name: 'Rahul Verma', dept: 'Engineering', jobs: 3, applications: 186, selections: 6, status: 'Active', avatar: 'https://picsum.photos/seed/rahulv/100/100', email: 'rahul.verma@company.com' },
        { name: 'Neha Patel', dept: 'Product', jobs: 5, applications: 310, selections: 9, status: 'Active', avatar: 'https://picsum.photos/seed/nehap/100/100', email: 'neha.patel@company.com' },
        { name: 'Amit Singh', dept: 'Sales', jobs: 2, applications: 142, selections: 3, status: 'Active', avatar: 'https://picsum.photos/seed/amits/100/100', email: 'amit.singh@company.com' },
        { name: 'Kavya Reddy', dept: 'Operations', jobs: 3, applications: 167, selections: 4, status: 'Active', avatar: 'https://picsum.photos/seed/kavya/100/100', email: 'kavya.reddy@company.com' }
      ];
      for (const rec of recDefaults) {
        await addDoc(recCol, rec);
      }

      // 5. Employees
      const empCol = collection(db, 'organizations_companies', userProfile.organizationId, 'employees');
      const empDefaults = [
        { name: 'Rahul Kumar', empId: 'EMP10001', dept: 'Engineering', designation: 'Software Engineer', status: 'Active', avatar: 'https://picsum.photos/seed/rahulk/100/100', email: 'rahul.kumar@techsolutions.com', createdAt: new Date().toISOString() },
        { name: 'Anjali Sharma', empId: 'EMP10002', dept: 'Engineering', designation: 'Senior Engineer', status: 'Active', avatar: 'https://picsum.photos/seed/anjalis/100/100', email: 'anjali.sharma@techsolutions.com', createdAt: new Date().toISOString() },
        { name: 'Vikram Joshi', empId: 'EMP10003', dept: 'Product', designation: 'Product Manager', status: 'Active', avatar: 'https://picsum.photos/seed/vikramj/100/100', email: 'vikram.joshi@techsolutions.com', createdAt: new Date().toISOString() },
        { name: 'Sneha Reddy', empId: 'EMP10004', dept: 'Sales', designation: 'Sales Executive', status: 'Active', avatar: 'https://picsum.photos/seed/snehared/100/100', email: 'sneha.reddy@techsolutions.com', createdAt: new Date().toISOString() },
        { name: 'Arjun Patel', empId: 'EMP10005', dept: 'Operations', designation: 'Operations Analyst', status: 'Active', avatar: 'https://picsum.photos/seed/arjunp/100/100', email: 'arjun.patel@techsolutions.com', createdAt: new Date().toISOString() }
      ];
      for (const emp of empDefaults) {
        await addDoc(empCol, emp);
      }

      // 6. Managers
      const mgrCol = collection(db, 'organizations_companies', userProfile.organizationId, 'managers');
      const mgrDefaults = [
        { name: 'Amit Verma', dept: 'Engineering', jobs: 24, applications: 1246, hires: 28, status: 'Active', avatar: 'https://picsum.photos/seed/amitverma/100/100', email: 'amit.verma@company.com', createdAt: new Date().toISOString() },
        { name: 'Priya Sharma', dept: 'Engineering', jobs: 18, applications: 982, hires: 22, status: 'Active', avatar: 'https://picsum.photos/seed/priyasharma/100/100', email: 'priya.sharma@company.com', createdAt: new Date().toISOString() },
        { name: 'Rahul Verma', dept: 'Product', jobs: 14, applications: 746, hires: 17, status: 'Active', avatar: 'https://picsum.photos/seed/rahulv/100/100', email: 'rahul.verma@company.com', createdAt: new Date().toISOString() },
        { name: 'Neha Patel', dept: 'Sales', jobs: 10, applications: 508, hires: 12, status: 'Active', avatar: 'https://picsum.photos/seed/nehap/100/100', email: 'neha.patel@company.com', createdAt: new Date().toISOString() },
        { name: 'Sandeep Iyer', dept: 'Operations', jobs: 8, applications: 312, hires: 9, status: 'Active', avatar: 'https://picsum.photos/seed/sandeep/100/100', email: 'sandeep.iyer@company.com', createdAt: new Date().toISOString() }
      ];
      for (const mgr of mgrDefaults) {
        await addDoc(mgrCol, mgr);
      }

      // 7. Jobs
      const jobCol = collection(db, 'organizations_companies', userProfile.organizationId, 'jobs');
      const jobDefaults = [
        { title: 'Senior Software Engineer', dept: 'Engineering', location: 'Bangalore, India', applicationsCount: 82, openings: 4, status: 'Active', experience: '4-6 Years', type: 'Full-time', createdAt: new Date().toISOString() },
        { title: 'Cloud Engineer', dept: 'Engineering', location: 'Hyderabad, India', applicationsCount: 41, openings: 2, status: 'Active', experience: '3-5 Years', type: 'Full-time', createdAt: new Date().toISOString() },
        { title: 'Tech Lead', dept: 'Engineering', location: 'Pune, India', applicationsCount: 26, openings: 1, status: 'Active', experience: '6-8 Years', type: 'Full-time', createdAt: new Date().toISOString() },
        { title: 'Data Scientist', dept: 'Data Science', location: 'Bangalore, India', applicationsCount: 18, openings: 2, status: 'Active', experience: '4-6 Years', type: 'Full-time', createdAt: new Date().toISOString() },
        { title: 'Product Manager', dept: 'Product', location: 'Remote', applicationsCount: 15, openings: 1, status: 'Draft', experience: '6-8 Years', type: 'Full-time', createdAt: new Date().toISOString() }
      ];
      for (const job of jobDefaults) {
        await addDoc(jobCol, job);
      }

      // 8. Recent Activities
      const actCol = collection(db, 'organizations_companies', userProfile.organizationId, 'activity');
      const actDefaults = [
        { userName: 'Amit Verma', action: 'created a new job', subject: 'Senior Software Engineer', time: '10:30 AM', avatar: 'https://picsum.photos/seed/amitverma/100/100', createdAt: new Date().toISOString() },
        { userName: 'Priya Sharma', action: 'submitted a candidate', subject: 'Rahul Kumar for Tech Lead', time: '09:45 AM', avatar: 'https://picsum.photos/seed/priyasharma/100/100', createdAt: new Date().toISOString() },
        { userName: 'Anjali Sharma', action: 'applied for', subject: 'Cloud Engineer', time: '09:15 AM', avatar: 'https://picsum.photos/seed/anjali/100/100', createdAt: new Date().toISOString() },
        { userName: 'Rahul Verma', action: 'closed a job', subject: 'Data Analyst', time: 'Yesterday', avatar: 'https://picsum.photos/seed/rahulv/100/100', createdAt: new Date().toISOString() },
        { userName: 'Neha Patel', action: 'hired a candidate', subject: 'Vikram Joshi for DevOps Engineer', time: 'Yesterday', avatar: 'https://picsum.photos/seed/nehap/100/100', createdAt: new Date().toISOString() }
      ];
      for (const act of actDefaults) {
        await addDoc(actCol, act);
      }

      // 9. Applications (recruiter candidates)
      const appsCol = collection(db, 'organizations_companies', userProfile.organizationId, 'applications');
      const currentRecUid = userProfile?.uid || auth.currentUser?.uid || 'rec-1';
      const appDefaults = [
        {
          name: 'Rahul Kumar',
          candidateName: 'Rahul Kumar',
          role: 'Senior Software Engineer',
          jobTitle: 'Senior Software Engineer',
          email: 'rahul.kumar@gmail.com',
          phone: '+91 9876543210',
          location: 'Bangalore, India',
          experience: '4.5 Years',
          currentCompany: 'Tech Solutions Pvt. Ltd.',
          currentRole: 'Software Engineer',
          skills: ['React.js', 'Node.js', 'JavaScript', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'Git'],
          about: 'Experienced software engineer with a strong background in building scalable web applications using modern technologies. Passionate about problem solving and clean code.',
          status: 'Applied',
          appliedDate: '25 May 25',
          dept: 'Engineering',
          assignedRecruiterId: currentRecUid,
          assignedByAdmin: 'Amit Sen (Company Admin)',
          assignedDate: '24 May 25',
          assignedJobs: ['Senior Software Engineer']
        },
        {
          name: 'Anjali Sharma',
          candidateName: 'Anjali Sharma',
          role: 'Cloud Engineer',
          jobTitle: 'Cloud Engineer',
          email: 'anjali.sharma@gmail.com',
          phone: '+91 9876543222',
          location: 'Hyderabad, India',
          experience: '3.5 Years',
          currentCompany: 'CloudSpace Systems',
          currentRole: 'Associate Cloud Analyst',
          skills: ['AWS', 'Python', 'Docker', 'Terraform', 'CI/CD'],
          about: 'Cloud professional focused on deploying high-availability architectures and automating software delivery pipelines.',
          status: 'Under Review',
          appliedDate: '25 May 25',
          dept: 'Infrastructure',
          assignedRecruiterId: currentRecUid,
          assignedByAdmin: 'Amit Sen (Company Admin)',
          assignedDate: '24 May 25',
          assignedJobs: ['Cloud Engineer']
        },
        {
          name: 'Vikram Patel',
          candidateName: 'Vikram Patel',
          role: 'Tech Lead',
          jobTitle: 'Tech Lead',
          email: 'vikram.patel@gmail.com',
          phone: '+91 9876543233',
          location: 'Pune, India',
          experience: '7 Years',
          currentCompany: 'Platform Core',
          currentRole: 'Senior Developer',
          skills: ['Java', 'Spring Boot', 'MySQL', 'System Design'],
          about: 'Passionate team lead with experience architecting backend systems and spearheading multi-engineer platform squads.',
          status: 'Shortlisted',
          appliedDate: '24 May 25',
          dept: 'Engineering',
          assignedRecruiterId: currentRecUid,
          assignedByAdmin: 'Amit Sen (Company Admin)',
          assignedDate: '24 May 25',
          assignedJobs: ['Tech Lead']
        },
        {
          name: 'Neha Singh',
          candidateName: 'Neha Singh',
          role: 'Data Analyst',
          jobTitle: 'Data Analyst',
          email: 'neha.singh@gmail.com',
          phone: '+91 9876543244',
          location: 'Bangalore, India',
          experience: '3 Years',
          currentCompany: 'DataMiners Inc',
          currentRole: 'Data Analyst',
          skills: ['Python', 'SQL', 'Tableau', 'Pandas'],
          about: 'Detail-oriented data analyst specialized in transforming complex query results into intuitive visual intelligence boards.',
          status: 'Interview',
          appliedDate: '24 May 25',
          dept: 'Data',
          assignedRecruiterId: currentRecUid,
          assignedByAdmin: 'Amit Sen (Company Admin)',
          assignedDate: '24 May 25',
          assignedJobs: ['Data Analyst']
        },
        {
          name: 'Amit Verma',
          candidateName: 'Amit Verma',
          role: 'DevOps Engineer',
          jobTitle: 'DevOps Engineer',
          email: 'amit.verma@gmail.com',
          phone: '+91 9876543255',
          location: 'Remote',
          experience: '4 Years',
          currentCompany: 'NetworkGrid',
          currentRole: 'Systems Engineer',
          skills: ['AWS', 'Jenkins', 'Bash', 'Kubernetes'],
          about: 'DevOps professional passionate about robust infrastructure automation, safety alerts, and continuous deployment.',
          status: 'Applied',
          appliedDate: '23 May 25',
          dept: 'Infrastructure',
          assignedRecruiterId: currentRecUid,
          assignedByAdmin: 'Amit Sen (Company Admin)',
          assignedDate: '24 May 25',
          assignedJobs: ['DevOps Engineer']
        },
        {
          name: 'Siddharth Jain',
          candidateName: 'Siddharth Jain',
          role: 'Tech Lead',
          jobTitle: 'Tech Lead',
          email: 'siddharth.jain@gmail.com',
          phone: '+91 9876543266',
          location: 'Pune, India',
          experience: '8 Years',
          currentCompany: 'AppDynamics',
          currentRole: 'Tech Architect',
          skills: ['Java', 'Spring', 'Kubernetes', 'Microservices'],
          about: 'Experienced architect specializing in scalable microservices development and containerized system orchestration.',
          status: 'Selected',
          appliedDate: '22 May 25',
          dept: 'Engineering',
          assignedRecruiterId: currentRecUid,
          assignedByAdmin: 'Amit Sen (Company Admin)',
          assignedDate: '24 May 25',
          assignedJobs: ['Tech Lead']
        }
      ];
      for (const app of appDefaults) {
        await addDoc(appsCol, app);
      }

      setSuccessMsg?.('Corporate workspace initialized with high-fidelity demo data.');
    } catch (e) {
      console.error("Error initializing demo workspace:", e);
      setErrorMsg?.('Failed to initialize demo workspace.');
    }
  };

  const handleCreateRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReqTitle || !newReqClient) {
      setErrorMsg('Please enter Title and Client name.');
      return;
    }
    const req = {
      id: String(myRequirements.length + 1),
      title: newReqTitle,
      client: newReqClient,
      salary: newReqSalary || '$120k+',
      visibility: newReqVisibility,
      skills: newReqSkills || 'N/A'
    };
    setMyRequirements([req, ...myRequirements]);
    setNewReqTitle('');
    setNewReqClient('');
    setNewReqSalary('');
    setNewReqSkills('');
    setSuccessMsg('New Requirement Created Successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleMManagerSubmitJob = async (jobData: any) => {
    try {
      const bdmUid = auth.currentUser?.uid || 'anonymous-bdm';
      const dbStatus = jobData.status === 'Paused' ? 'paused' : 'open';

      if (jobData.id) {
        // Edit mode using updateDoc()
        const jobId = jobData.id;
        const jobRef = doc(db, 'marketplace_jobs', jobId);
        
        // Fetch existing job to find old assignments
        const jobSnap = await getDoc(jobRef);
        const existingData = jobSnap.exists() ? jobSnap.data() : null;
        const previousRecruiters = existingData?.assignedRecruiters || [];
        const oldStatus = existingData?.status || 'open';

        await updateDoc(jobRef, {
          title: jobData.title,
          companyName: jobData.client,
          experience: jobData.experience,
          skills: typeof jobData.skills === 'string' ? jobData.skills : (Array.isArray(jobData.skills) ? jobData.skills.join(', ') : ''),
          location: jobData.location,
          openings: jobData.openings,
          employmentType: jobData.employmentType || 'Full Time',
          salary: jobData.salaryRange || '6 - 10 LPA',
          description: jobData.description || '',
          requirements: jobData.responsibilities || '',
          status: dbStatus,
          assignmentMode: jobData.assignmentMode || 'open',
          assignedRecruiters: jobData.assignedRecruiters || [],
          updatedAt: serverTimestamp()
        });

        // Sync BDM lightweight reference
        const bdmJobRef = doc(db, 'marketplace_bdms', bdmUid, 'jobs', jobId);
        await setDoc(bdmJobRef, {
          jobId,
          title: jobData.title,
          company: jobData.client || 'Unknown',
          companyName: jobData.client || 'Unknown',
          status: dbStatus,
          updatedAt: serverTimestamp()
        }, { merge: true });

        // Sync recruiters subcollection
        await syncAssignedRecruitersSubcollection(jobId, jobData.assignedRecruiters || [], previousRecruiters);

        // General Edit logs
        await logJobActivity(jobId, 'Job Edited', 'Job requirement details were updated');
        await addJobTimelineEvent(jobId, 'Updated', 'Job requirement details updated.');

        // Status change logs
        if (oldStatus !== dbStatus) {
          if (dbStatus === 'paused') {
            await logJobActivity(jobId, 'Job Paused', 'Sourcing was paused');
            await addJobTimelineEvent(jobId, 'Paused', 'Sourcing paused.');
          } else if (dbStatus === 'open') {
            await logJobActivity(jobId, 'Job Opened', 'Sourcing was reopened');
            await addJobTimelineEvent(jobId, 'Reopened', 'Sourcing reopened.');
          }
        }

        setSuccessMsg('Requirement Saved and Sync\'d Successfully!');
      } else {
        // Create mode using generated ID (Master doc first, then BDM reference)
        const colRef = collection(db, 'marketplace_jobs');
        const jobDocRef = doc(colRef);
        const jobId = jobDocRef.id;

        await setDoc(jobDocRef, {
          id: jobId,
          jobId,
          title: jobData.title,
          companyName: jobData.client,
          companyId: 'company-1',
          experience: jobData.experience,
          skills: typeof jobData.skills === 'string' ? jobData.skills : (Array.isArray(jobData.skills) ? jobData.skills.join(', ') : ''),
          location: jobData.location,
          openings: jobData.openings,
          employmentType: jobData.employmentType || 'Full Time',
          salary: jobData.salaryRange || '6 - 10 LPA',
          description: jobData.description || '',
          requirements: jobData.responsibilities || '',
          status: dbStatus,
          visibility: 'public',
          assignmentMode: jobData.assignmentMode || 'open',
          assignedRecruiters: jobData.assignedRecruiters || [],
          createdBy: bdmUid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          recruiterCount: jobData.assignedRecruiters?.length || 0,
          submissionCount: 0,
          shortlistedCount: 0,
          hiredCount: 0
        });

        // Create lightweight BDM reference
        const bdmJobRef = doc(db, 'marketplace_bdms', bdmUid, 'jobs', jobId);
        await setDoc(bdmJobRef, {
          jobId,
          title: jobData.title,
          company: jobData.client || 'Unknown',
          companyName: jobData.client || 'Unknown',
          status: dbStatus,
          updatedAt: serverTimestamp()
        });

        // Initialize subcollection entries and logs
        await logJobActivity(jobId, 'Job Created', 'Job listing was created');
        await addJobTimelineEvent(jobId, 'Created', 'Job listing published.');

        // Sync recruiter subcollection if there are initial recruiters
        if (jobData.assignedRecruiters && jobData.assignedRecruiters.length > 0) {
          await syncAssignedRecruitersSubcollection(jobId, jobData.assignedRecruiters, []);
        }

        setSuccessMsg('Requirement Published on Marketplace Sourcing Partners!');
      }
    } catch (err) {
      console.error('Error submitting job:', err);
    }
    setEditingMManagerJob(null);
    setActiveTab?.('jobs');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleMManagerToggleStatus = async (id: string, currentStatus?: string) => {
    try {
      const jobRef = doc(db, 'marketplace_jobs', id);
      const jobSnap = await getDoc(jobRef);
      const jobData = jobSnap.exists() ? jobSnap.data() : null;
      const bdmUid = jobData?.createdBy || auth.currentUser?.uid || 'anonymous-bdm';

      // Toggle status between paused and open
      const isCurrentlyActive = currentStatus === 'Active' || currentStatus === 'OPEN' || currentStatus === 'open';
      const newStatus = isCurrentlyActive ? 'paused' : 'open';

      await updateDoc(jobRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      // Update BDM ref with setDoc merge
      const bdmJobRef = doc(db, 'marketplace_bdms', bdmUid, 'jobs', id);
      await setDoc(bdmJobRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Activity and Timeline Logging
      if (newStatus === 'paused') {
        await logJobActivity(id, 'Job Paused', 'Sourcing was paused');
        await addJobTimelineEvent(id, 'Paused', 'Sourcing paused.');
      } else {
        await logJobActivity(id, 'Job Opened', 'Sourcing was reopened');
        await addJobTimelineEvent(id, 'Reopened', 'Sourcing reopened.');
      }

      setSuccessMsg(`Sourcing successfully ${newStatus === 'open' ? 'resumed' : 'paused'}.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleMManagerDeleteJob = async (id: string) => {
    try {
      const jobRef = doc(db, 'marketplace_jobs', id);
      const jobSnap = await getDoc(jobRef);
      const jobData = jobSnap.exists() ? jobSnap.data() : null;
      const bdmUid = jobData?.createdBy || auth.currentUser?.uid || 'anonymous-bdm';

      // 1. Cascade-delete subcollections FIRST while master document still exists
      const subcollections = ['assigned_recruiters', 'recruiters', 'submissions', 'activity', 'timeline'];
      for (const sub of subcollections) {
        const colRef = collection(db, 'marketplace_jobs', id, sub);
        const snapshot = await getDocs(colRef);
        const deletePromises = snapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
        await Promise.all(deletePromises);
      }

      // 2. Delete BDM lightweight reference
      const bdmJobRef = doc(db, 'marketplace_bdms', bdmUid, 'jobs', id);
      await deleteDoc(bdmJobRef);

      // 3. Delete master document last
      await deleteDoc(jobRef);

      setSuccessMsg('Requirement permanently deleted from system successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error permanently deleting job:', err);
    }
  };

  const handleStudentApplyJob = async (jobTitle: string, company: string, opportunityId?: string) => {
    try {
      const organizationId = userProfile?.organizationId;
      const studentId = userProfile?.uid || auth.currentUser?.uid;

      if (!organizationId || !studentId) {
        alert("Unable to apply: Missing student profile or organization ID.");
        return;
      }

      if (!opportunityId) {
        alert("Unable to apply: Missing opportunity details.");
        return;
      }

      // 1. Check for duplicates under: organizations_universities/{organizationId}/applications
      const appsCol = collection(db, 'organizations_universities', organizationId, 'applications');
      const q = query(
        appsCol,
        where('studentId', '==', studentId),
        where('opportunityId', '==', opportunityId)
      );
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        alert("You have already applied for this opportunity.");
        return;
      }

      // 2. Load student details
      const studentDocRef = doc(db, 'organizations_universities', organizationId, 'students', studentId);
      const studentSnap = await getDoc(studentDocRef);
      if (!studentSnap.exists()) {
        alert("Please complete your profile details before applying.");
        return;
      }
      const studentData = studentSnap.data();

      // 3. Load opportunity details
      const oppDocRef = doc(db, 'organizations_universities', organizationId, 'opportunities', opportunityId);
      const oppSnap = await getDoc(oppDocRef);
      if (!oppSnap.exists()) {
        alert("Opportunity not found or is closed.");
        return;
      }
      const oppData = oppSnap.data();

      // 4. Generate new application document ID
      const appDocRef = doc(appsCol);
      const applicationId = appDocRef.id;

      // 5. Build application details
      const newApp = {
        applicationId,
        studentId,
        studentName: studentData.fullName || studentData.name || userProfile?.fullName || 'Student',
        studentEmail: studentData.email || userProfile?.email || '',
        studentDepartment: studentData.department || '',
        studentBranch: studentData.branch || '',
        studentCgpa: studentData.cgpa || '',
        studentYear: studentData.year || '',
        
        opportunityId,
        opportunityTitle: oppData.title || jobTitle,
        
        companyId: oppData.companyId || 'company-1',
        companyName: oppData.companyName || company,
        
        placementOfficerUid: oppData.createdBy || '',
        status: 'applied',
        timeline: [
          {
            status: 'applied',
            remarks: 'Application submitted successfully via student portal.',
            updatedAt: new Date().toISOString()
          }
        ],
        remarks: 'Applied successfully via student portal',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // 6. Write to Firestore
      await setDoc(appDocRef, newApp);

      setSuccessMsg(`Application to ${newApp.opportunityTitle} at ${newApp.companyName} submitted successfully!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Error applying for job:', err);
      alert(`Failed to submit application: ${err.message}`);
    }
  };

  const handleTailorResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdPasted) return;
    setTailoringProgress(10);
    setTailoredResult(null);
    let current = 10;
    const interval = setInterval(() => {
      current += 30;
      if (current >= 100) {
        clearInterval(interval);
        setTailoringProgress(100);
        setTailoredResult({
          score: 94,
          keywords: ['System Architecture', 'Scale Optimization', 'Fullstack API Integration', 'Team Sprints'],
          text: 'Engineered high-throughput cloud functions improving efficiency by 24%. Refactored responsive workspace flows reducing layout friction by 40%...'
        });
      } else {
        setTailoringProgress(current);
      }
    }, 400);
  };

  const toggleAutoApply = () => {
    if (isApplyActive) {
      setIsApplyActive(false);
      setAutoApplyLogs(prev => [...prev, '[SYSTEM] Auto-Apply worker suspended.']);
    } else {
      setIsApplyActive(true);
      setAutoApplyLogs(prev => [...prev, '[SYSTEM] Active crawler scouting matches...', '[AI] Match found for Vercel Solutions Architect (92%)', '[BOT] Tailoring credentials and submitting application automatically.']);
    }
  };

  const handleClaimTalent = (id: string) => {
    setTalentPool(prev => prev.map(t => t.id === id ? { ...t, status: 'Claimed' } : t));
    setSuccessMsg('Consultant claimed! Direct sync enabled.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvUploaded(true);
      setSuccessMsg('Bulk roster parsed! 48 student records imported instantly.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleProvisionOrg = () => {
    const org = {
      id: `org-${organizations.length + 1}`,
      name: 'IIT Kharagpur Inc',
      type: 'University',
      status: 'Active',
      users: 5
    };
    setOrganizations([...organizations, org]);
    setSuccessMsg('Provisioned New University Hub on SaaS platform!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // ==========================================
  // ECOSYSTEM VIEW DISPATCHERS
  // ==========================================

  return (
    <div className="space-y-6">
      {/* Visual Feedback Alerts */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-3 font-semibold"
          >
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-5 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-3 font-semibold"
          >
            <AlertCircle className="w-6 h-6 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* 1. MARKETPLACE CANDIDATE (m_candidate) */}
      {/* ==================================================== */}
      {role === 'm_candidate' && (
        <div className="space-y-6">
          {activeTab === 'dashboard' && <DashboardTab onNavigate={(tab) => setActiveTab?.(tab)} />}
          {activeTab === 'jobs' && <JobsTab />}
          {activeTab === 'ai_matching' && <AiMatchingTab onNavigate={(tab) => setActiveTab?.(tab)} />}
          {activeTab === 'resume_builder' && <ResumeBuilderTab />}
          {activeTab === 'applications' && <ApplicationsTab />}
          {activeTab === 'documents' && <DocumentsTab />}
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. MARKETPLACE RECRUITER (m_recruiter) */}
      {/* ==================================================== */}
      {role === 'm_recruiter' && (
        <>
          <div className="space-y-6">
            {activeTab === 'dashboard' && (
              <RecruiterDashboardTab 
                onNavigate={(tab) => setActiveTab?.(tab)} 
                onRequestMore={() => setIsRequestMoreOpen(true)}
                onPreviewCandidate={(id) => {
                  const cand = recruiterCandidates.find(c => c.id === id);
                  if (cand) {
                    setPreviewCandidate(cand);
                    setIsPreviewOpen(true);
                  }
                }}
                onSelectCandidate={(id) => {
                  setSelectedCandidateIds(prev => 
                    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
                  );
                }}
                selectedCount={selectedCandidateIds.length}
              />
            )}
            {activeTab === 'jobs' && (
              <RecruiterAvailableJobsTab 
                onNavigate={(tab) => setActiveTab?.(tab)}
              />
            )}
            {activeTab === 'candidates' && (
              <RecruiterCandidatePoolTab 
                selectedCandidates={selectedCandidateIds}
                onToggleSelect={(id) => {
                  setSelectedCandidateIds(prev => 
                    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
                  );
                }}
                onPreviewCandidate={(id) => {
                  const cand = recruiterCandidates.find(c => c.id === id);
                  if (cand) {
                    setPreviewCandidate(cand);
                    setIsPreviewOpen(true);
                  }
                }}
              />
            )}
            {activeTab === 'selections' && (
              <RecruiterMySelectionsTab 
                candidates={recruiterCandidates}
                selectedCandidateIds={selectedCandidateIds}
                onDeselect={(id) => {
                  setSelectedCandidateIds(prev => prev.filter(x => x !== id));
                }}
                onSubmitProfile={(cand) => {
                  setSubmitCandidate(cand);
                  setIsSubmitOpen(true);
                }}
                onNavigate={(tab) => setActiveTab?.(tab)}
              />
            )}
            {activeTab === 'submissions' && (
              <RecruiterSubmissionsTab />
            )}
            {activeTab === 'profile' && (
              <RecruiterProfileTab />
            )}
          </div>

          {/* Recruiter Modals */}
          <CandidatePreviewModal 
            candidate={previewCandidate}
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            isSelected={previewCandidate ? selectedCandidateIds.includes(previewCandidate.id) : false}
            onSelectToggle={() => {
              if (previewCandidate) {
                const id = previewCandidate.id;
                setSelectedCandidateIds(prev => 
                  prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
                );
              }
            }}
          />

          <SubmitProfileModal 
            candidate={submitCandidate}
            isOpen={isSubmitOpen}
            onClose={() => setIsSubmitOpen(false)}
            onSubmitSuccess={(candidateName, jobTitle) => {
              setSuccessMsg(`Successfully submitted profile of ${candidateName} to ${jobTitle}!`);
              setTimeout(() => setSuccessMsg(''), 5000);
            }}
          />

          <RequestMoreModal 
            isOpen={isRequestMoreOpen}
            onClose={() => setIsRequestMoreOpen(false)}
            onRequestSuccess={(count, jobName) => {
              setSuccessMsg(`Successfully requested ${count} additional candidates for ${jobName}. Standard BDM verification has initiated.`);
              setTimeout(() => setSuccessMsg(''), 5000);
            }}
          />
        </>
      )}

      {/* ==================================================== */}
      {/* 3. MARKETPLACE MANAGER (m_manager) */}
      {/* ==================================================== */}
      {role === 'm_manager' && (
        <div className="space-y-6">
          {activeTab === 'dashboard' && (
            <ManagerDashboardTab 
              onNavigate={(tab) => {
                if (tab === 'jobs' || tab === 'recruiters' || tab === 'submissions' || tab === 'analytics' || tab === 'profile') {
                  setActiveTab?.(tab);
                }
              }}
              onCreateJobClick={() => {
                setEditingMManagerJob(null);
                setActiveTab?.('create-job');
              }}
            />
          )}

          {activeTab === 'jobs' && (
            <ManagerJobsTab 
              jobsList={mManagerJobs}
              onToggleStatus={handleMManagerToggleStatus}
              onDeleteJob={handleMManagerDeleteJob}
              onCreateJobClick={() => {
                setEditingMManagerJob(null);
                setActiveTab?.('create-job');
              }}
              onEditJobClick={(job) => {
                setEditingMManagerJob(job);
                setActiveTab?.('create-job');
              }}
            />
          )}

          {activeTab === 'create-job' && (
            <ManagerCreateJobTab 
              editJob={editingMManagerJob}
              onBackToJobs={() => {
                setEditingMManagerJob(null);
                setActiveTab?.('jobs');
              }}
              onSubmitJob={handleMManagerSubmitJob}
            />
          )}

          {activeTab === 'recruiters' && (
            <ManagerRecruitersTab />
          )}

          {activeTab === 'submissions' && (
            <ManagerSubmissionsTab />
          )}

          {activeTab === 'analytics' && (
            <ManagerAnalyticsTab />
          )}

          {activeTab === 'profile' && (
            <ManagerProfileTab />
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. UNIVERSITY ADMIN (u_admin) */}
      {/* ==================================================== */}
      {role === 'u_admin' && (
        <div className="space-y-6">
          {activeTab === 'dashboard' && (
            <AdminDashboardTab 
              onNavigate={(tab) => {
                if (setActiveTab) {
                  setActiveTab(tab);
                }
              }} 
              onAddOfficer={() => {
                if (setActiveTab) {
                  setActiveTab('placement_officers');
                }
                setIsAdminCreatingOfficer(true);
              }}
              onViewOfficer={(off) => {
                setSelectedAdminOfficer(off);
                if (setActiveTab) {
                  setActiveTab('placement_officers');
                }
              }}
            />
          )}

          {activeTab === 'placement_officers' && (
            <div>
              {isAdminCreatingOfficer ? (
                <AdminAddOfficerTab 
                  onBack={() => setIsAdminCreatingOfficer(false)} 
                  onSubmit={async (newOff) => {
                    if (!userProfile?.organizationId) {
                      throw new Error("University profile or Organization ID not found.");
                    }
                    await createPlacementOfficerUser(
                      userProfile.organizationId,
                      newOff.name,
                      newOff.email,
                      newOff.phone,
                      newOff.designation,
                      newOff.dept,
                      newOff.password
                    );
                    setIsAdminCreatingOfficer(false);
                  }} 
                />
              ) : selectedAdminOfficer ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        setSelectedAdminOfficer(null);
                        setIsEditingSelectedOfficer(false);
                      }} 
                      className="p-2 border border-app-border rounded-xl hover:bg-app-surface text-app-muted hover:text-app-text transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="text-xl font-display font-black text-app-text">Placement Officer Details</h2>
                      <p className="text-xs text-app-muted">Review credential records and active communication channels.</p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 rounded-[32px] bg-app-surface/60 border border-app-border card-shadow flex flex-col sm:flex-row gap-6">
                    <img 
                      src={selectedAdminOfficer.avatar} 
                      alt={selectedAdminOfficer.name} 
                      className="w-20 h-20 rounded-full object-cover border-2 border-app-border shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-2.5 flex-1">
                      {isEditingSelectedOfficer ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-extrabold uppercase text-app-muted">Full Name</label>
                              <input 
                                type="text"
                                value={editOfficerName}
                                onChange={(e) => setEditOfficerName(e.target.value)}
                                className="w-full bg-app-bg border border-app-border rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-brand-blue"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-extrabold uppercase text-app-muted">Phone</label>
                              <input 
                                type="text"
                                value={editOfficerPhone}
                                onChange={(e) => setEditOfficerPhone(e.target.value)}
                                className="w-full bg-app-bg border border-app-border rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-brand-blue"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-extrabold uppercase text-app-muted">Department</label>
                              <input 
                                type="text"
                                value={editOfficerDept}
                                onChange={(e) => setEditOfficerDept(e.target.value)}
                                className="w-full bg-app-bg border border-app-border rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-brand-blue"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-extrabold uppercase text-app-muted">Designation</label>
                              <input 
                                type="text"
                                value={editOfficerDesignation}
                                onChange={(e) => setEditOfficerDesignation(e.target.value)}
                                className="w-full bg-app-bg border border-app-border rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-brand-blue"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <button 
                              onClick={() => setIsEditingSelectedOfficer(false)}
                              className="px-4 py-2 border border-app-border rounded-xl text-xs font-bold text-app-muted hover:bg-app-bg"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={async () => {
                                if (userProfile?.organizationId) {
                                  const docRef = doc(db, 'organizations_universities', userProfile.organizationId, 'placement_officers', selectedAdminOfficer.id);
                                  await updateDoc(docRef, {
                                    fullName: editOfficerName,
                                    name: editOfficerName,
                                    phone: editOfficerPhone,
                                    department: editOfficerDept,
                                    dept: editOfficerDept,
                                    designation: editOfficerDesignation
                                  });
                                  setSelectedAdminOfficer({
                                    ...selectedAdminOfficer,
                                    name: editOfficerName,
                                    fullName: editOfficerName,
                                    phone: editOfficerPhone,
                                    dept: editOfficerDept,
                                    department: editOfficerDept,
                                    designation: editOfficerDesignation
                                  });
                                  setIsEditingSelectedOfficer(false);
                                }
                              }}
                              className="px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-bold"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg font-display font-black text-app-text">{selectedAdminOfficer.name}</h3>
                          <div className="text-xs text-app-muted font-bold">Cell: <strong className="text-brand-blue">{selectedAdminOfficer.dept}</strong></div>
                          <div className="text-xs text-app-muted font-bold">Email: <strong className="text-app-text">{selectedAdminOfficer.email}</strong></div>
                          <div className="text-xs text-app-muted font-bold">Phone: <strong className="text-app-text">{selectedAdminOfficer.phone}</strong></div>
                          
                          <div className="flex flex-wrap gap-4 pt-1">
                            <span className="text-xs font-bold text-app-muted">
                              Drives Created: <strong className="text-brand-violet">{selectedAdminOfficer.opportunities}</strong>
                            </span>
                            <span className="text-xs font-bold text-app-muted">
                              Endorsed Hires: <strong className="text-emerald-500">{selectedAdminOfficer.placements}</strong>
                            </span>
                          </div>

                          <div className="pt-2 flex flex-wrap items-center gap-3">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border tracking-wider ${
                              selectedAdminOfficer.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              <span>{selectedAdminOfficer.status} Status</span>
                            </span>

                            <button 
                              onClick={() => {
                                setEditOfficerName(selectedAdminOfficer.name);
                                setEditOfficerPhone(selectedAdminOfficer.phone);
                                setEditOfficerDept(selectedAdminOfficer.dept);
                                setEditOfficerDesignation(selectedAdminOfficer.designation || '');
                                setIsEditingSelectedOfficer(true);
                              }}
                              className="px-3 py-1 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                            >
                              Edit Profile
                            </button>

                            <button 
                              onClick={async () => {
                                if (confirm(`Are you sure you want to delete ${selectedAdminOfficer.name}?`)) {
                                  if (userProfile?.organizationId) {
                                    const docRef = doc(db, 'organizations_universities', userProfile.organizationId, 'placement_officers', selectedAdminOfficer.id);
                                    await deleteDoc(docRef);
                                    setSelectedAdminOfficer(null);
                                  }
                                }
                              }}
                              className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                            >
                              Delete Officer
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <AdminOfficersTab 
                  officersList={adminOfficers}
                  onAddOfficer={() => setIsAdminCreatingOfficer(true)}
                  onStatusChange={async (id, newStatus) => {
                    if (userProfile?.organizationId) {
                      const docRef = doc(db, 'organizations_universities', userProfile.organizationId, 'placement_officers', id);
                      await updateDoc(docRef, { status: newStatus });
                    }
                  }}
                  onViewOfficer={(off) => setSelectedAdminOfficer(off)}
                />
              )}
            </div>
          )}

          {activeTab === 'students' && (
            <AdminStudentsTab />
          )}

          {activeTab === 'opportunities' && (
            <AdminOpportunitiesTab />
          )}

          {activeTab === 'placements' && (
            <AdminPlacementsTab />
          )}

          {activeTab === 'reports' && (
            <AdminReportsTab />
          )}

          {activeTab === 'profile' && (
            <AdminProfileTab />
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. PLACEMENT OFFICER (u_officer) */}
      {/* ==================================================== */}
      {role === 'u_officer' && (
        <div className="space-y-6">
          {activeTab === 'dashboard' && (
            <OfficerDashboardTab 
              onNavigate={(tab) => {
                setActiveTab?.(tab);
                setIsCreatingOpportunity(false);
              }}
              onCreateOpportunity={() => {
                setActiveTab?.('opportunities');
                setIsCreatingOpportunity(true);
              }}
            />
          )}

          {activeTab === 'opportunities' && !isCreatingOpportunity && (
            <OfficerOpportunitiesTab 
              onAddOpportunity={() => setIsCreatingOpportunity(true)}
              onEditOpportunity={(job) => {
                alert(`Opening job edit context for ${job.title} at ${job.company}. All values are ready.`);
              }}
              onViewApplications={(jobId, title) => {
                setActiveTab?.('applications');
              }}
              jobsList={officerJobs}
            />
          )}

          {activeTab === 'opportunities' && isCreatingOpportunity && (
            <OfficerCreateOpportunityTab 
              onBack={() => setIsCreatingOpportunity(false)}
              onSubmit={(newJob) => {
                setOfficerJobs([newJob, ...officerJobs]);
                setIsCreatingOpportunity(false);
              }}
            />
          )}

          {activeTab === 'students' && (
            <OfficerStudentsTab />
          )}

          {activeTab === 'applications' && (
            <OfficerApplicationsTab />
          )}

          {activeTab === 'placements' && (
            <OfficerPlacementsTab />
          )}

          {activeTab === 'analytics' && (
            <OfficerAnalyticsTab />
          )}

          {activeTab === 'profile' && (
            <OfficerProfileTab />
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 6. UNIVERSITY STUDENT (u_student) */}
      {/* ==================================================== */}
      {role === 'u_student' && (
        <div className="space-y-6">
          {activeTab === 'dashboard' && (
            <StudentDashboardTab 
              onNavigate={(tab) => setActiveTab?.(tab)} 
              onApplyJob={handleStudentApplyJob}
            />
          )}

          {activeTab === 'opportunities' && (
            <StudentOpportunitiesTab 
              onApplyJob={handleStudentApplyJob}
            />
          )}

          {activeTab === 'ai_matching' && (
            <StudentAIMatchingTab 
              onNavigate={(tab) => setActiveTab?.(tab)}
            />
          )}

          {activeTab === 'resume_builder' && (
            <StudentResumeBuilderTab />
          )}

          {activeTab === 'applications' && (
            <StudentApplicationsTab />
          )}

          {activeTab === 'documents' && (
            <StudentDocumentsTab />
          )}

          {activeTab === 'profile' && (
            <StudentProfileTab />
          )}

          {activeTab === 'settings' && (
            <StudentSettings />
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 7. COMPANY ADMIN (c_admin) */}
      {/* ==================================================== */}
      {role === 'c_admin' && (
        <div className="space-y-6">
          
          {activeTab === 'dashboard' && (
            <CompanyAdminDashboard 
              onNavigate={(tab) => setActiveTab?.(tab)}
              onAddManagerClick={() => setActiveTab?.('managers')}
              managersList={adminManagersList}
              recruitersList={adminRecruitersList}
              employeesList={adminEmployeesList}
              jobsList={adminJobsList}
              departmentsList={adminDepartmentsList}
              activityList={activityList}
              applicationsList={applicationsList}
              onInitializeDemoWorkspace={handleInitializeDemoWorkspace}
            />
          )}

          {activeTab === 'managers' && (
            <CompanyAdminManagers 
              managersList={adminManagersList}
              onAddManager={async (newMgr) => {
                if (!userProfile?.organizationId) return false;
                try {
                  const colRef = collection(db, 'organizations_companies', userProfile.organizationId, 'managers');
                  await addDoc(colRef, {
                    ...newMgr,
                    createdAt: new Date().toISOString()
                  });
                  setSuccessMsg?.('Manager profile added.');
                  return true;
                } catch (e) {
                  console.error("Error adding manager:", e);
                  return false;
                }
              }}
              onEditManager={async (updatedMgr) => {
                if (!userProfile?.organizationId) return false;
                try {
                  const docRef = doc(db, 'organizations_companies', userProfile.organizationId, 'managers', updatedMgr.id);
                  const { id, ...data } = updatedMgr;
                  await updateDoc(docRef, {
                    ...data,
                    updatedAt: new Date().toISOString()
                  });
                  setSuccessMsg?.('Manager updated successfully!');
                  return true;
                } catch (e) {
                  console.error("Error updating manager:", e);
                  return false;
                }
              }}
              onDeleteManager={async (mgrId) => {
                if (!userProfile?.organizationId) return;
                try {
                  const docRef = doc(db, 'organizations_companies', userProfile.organizationId, 'managers', mgrId);
                  await deleteDoc(docRef);
                  setSuccessMsg?.('Manager profile deleted.');
                } catch (e) {
                  console.error("Error deleting manager:", e);
                }
              }}
            />
          )}

          {activeTab === 'recruiters' && (
            <CompanyAdminRecruiters 
              recruitersList={adminRecruitersList}
              onAddRecruiter={async (newRec) => {
                if (!userProfile?.organizationId) return false;
                // No duplicate recruiter documents based on unique email check
                const duplicate = adminRecruitersList.some(r => r.email?.toLowerCase() === newRec.email?.toLowerCase());
                if (duplicate) {
                  alert(`A recruiter with email ${newRec.email} already exists.`);
                  return false;
                }
                try {
                  const colRef = collection(db, 'organizations_companies', userProfile.organizationId, 'recruiters');
                  await addDoc(colRef, {
                    ...newRec,
                    createdAt: new Date().toISOString()
                  });
                  setSuccessMsg?.('Recruiter added successfully.');
                  return true;
                } catch (e) {
                  console.error("Error adding recruiter:", e);
                  return false;
                }
              }}
              onEditRecruiter={async (updatedRec) => {
                if (!userProfile?.organizationId) return false;
                try {
                  const docRef = doc(db, 'organizations_companies', userProfile.organizationId, 'recruiters', updatedRec.id);
                  const { id, ...data } = updatedRec;
                  await updateDoc(docRef, {
                    ...data,
                    updatedAt: new Date().toISOString()
                  });
                  setSuccessMsg?.('Recruiter updated successfully!');
                  return true;
                } catch (e) {
                  console.error("Error updating recruiter:", e);
                  return false;
                }
              }}
              onDeleteRecruiter={async (recId) => {
                if (!userProfile?.organizationId) return;
                try {
                  const docRef = doc(db, 'organizations_companies', userProfile.organizationId, 'recruiters', recId);
                  await deleteDoc(docRef);
                  setSuccessMsg?.('Recruiter profile deleted.');
                } catch (e) {
                  console.error("Error deleting recruiter:", e);
                }
              }}
            />
          )}

          {activeTab === 'employees' && (
            <CompanyAdminEmployees 
              employeesList={adminEmployeesList}
              onAddEmployee={async (newEmp) => {
                if (!userProfile?.organizationId) return false;
                // No duplicate employee documents
                const emailExists = adminEmployeesList.some(e => e.email?.toLowerCase() === newEmp.email?.toLowerCase());
                const empIdExists = adminEmployeesList.some(e => e.empId?.toLowerCase() === newEmp.empId?.toLowerCase());
                if (emailExists || empIdExists) {
                  alert(`An employee with that email or employee ID already exists.`);
                  return false;
                }
                try {
                  const colRef = collection(db, 'organizations_companies', userProfile.organizationId, 'employees');
                  await addDoc(colRef, {
                    ...newEmp,
                    createdAt: new Date().toISOString()
                  });
                  setSuccessMsg?.('Employee registered successfully.');
                  return true;
                } catch (e) {
                  console.error("Error registering employee:", e);
                  return false;
                }
              }}
              onEditEmployee={async (updatedEmp) => {
                if (!userProfile?.organizationId) return false;
                try {
                  const docRef = doc(db, 'organizations_companies', userProfile.organizationId, 'employees', updatedEmp.id);
                  const { id, ...data } = updatedEmp;
                  await updateDoc(docRef, {
                    ...data,
                    updatedAt: new Date().toISOString()
                  });
                  setSuccessMsg?.('Employee profile updated successfully!');
                  return true;
                } catch (e) {
                  console.error("Error updating employee:", e);
                  return false;
                }
              }}
              onDeleteEmployee={async (empId) => {
                if (!userProfile?.organizationId) return;
                try {
                  const docRef = doc(db, 'organizations_companies', userProfile.organizationId, 'employees', empId);
                  await deleteDoc(docRef);
                  setSuccessMsg?.('Employee profile deleted.');
                } catch (e) {
                  console.error("Error deleting employee:", e);
                }
              }}
              onBulkUpload={async (bulkEmployees) => {
                if (!userProfile?.organizationId) return;
                try {
                  const colRef = collection(db, 'organizations_companies', userProfile.organizationId, 'employees');
                  let count = 0;
                  for (const emp of bulkEmployees) {
                    const duplicate = adminEmployeesList.some(
                      e => e.email?.toLowerCase() === emp.email?.toLowerCase() || e.empId?.toLowerCase() === emp.empId?.toLowerCase()
                    );
                    if (!duplicate) {
                      await addDoc(colRef, {
                        ...emp,
                        createdAt: new Date().toISOString()
                      });
                      count++;
                    }
                  }
                  setSuccessMsg?.(`Bulk upload processed successfully! Registered ${count} new profiles.`);
                } catch (e) {
                  console.error("Error bulk uploading employees:", e);
                }
              }}
            />
          )}

          {activeTab === 'jobs' && (
            <CompanyAdminJobs 
              jobsList={adminJobsList}
              onAddJob={async (newJob) => {
                if (!userProfile?.organizationId) return false;
                try {
                  const colRef = collection(db, 'organizations_companies', userProfile.organizationId, 'jobs');
                  await addDoc(colRef, {
                    ...newJob,
                    applicationsCount: 0,
                    createdAt: new Date().toISOString()
                  });
                  setSuccessMsg?.('Job requisition created successfully!');
                  return true;
                } catch (e) {
                  console.error("Error creating job requisition:", e);
                  return false;
                }
              }}
              onEditJob={async (updatedJob) => {
                if (!userProfile?.organizationId) return false;
                try {
                  const docRef = doc(db, 'organizations_companies', userProfile.organizationId, 'jobs', updatedJob.id);
                  const { id, ...data } = updatedJob;
                  await updateDoc(docRef, {
                    ...data,
                    updatedAt: new Date().toISOString()
                  });
                  setSuccessMsg?.('Job requisition updated.');
                  return true;
                } catch (e) {
                  console.error("Error updating job requisition:", e);
                  return false;
                }
              }}
              onDeleteJob={async (jobId) => {
                if (!userProfile?.organizationId) return;
                try {
                  const docRef = doc(db, 'organizations_companies', userProfile.organizationId, 'jobs', jobId);
                  await deleteDoc(docRef);
                  setSuccessMsg?.('Job requisition deleted.');
                } catch (e) {
                  console.error("Error deleting job requisition:", e);
                }
              }}
            />
          )}

          {activeTab === 'reports' && (
            <CompanyAdminReports />
          )}

          {activeTab === 'profile' && (
            <CompanyAdminProfile 
              onNavigate={(tab) => setActiveTab?.(tab)}
              onAddManagerClick={() => setActiveTab?.('managers')}
              onAddRecruiterClick={() => setActiveTab?.('recruiters')}
              companyData={companyData}
              adminProfileData={adminProfileData}
            />
          )}

          {activeTab === 'departments' && (
            <CompanyAdminDepartments 
              departmentsList={adminDepartmentsList}
              employeesList={adminEmployeesList}
              onAddDepartment={async (newDept) => {
                if (!userProfile?.organizationId) return false;
                // Prevent duplicate department names
                const duplicate = adminDepartmentsList.some(d => d.name?.toLowerCase() === newDept.name?.toLowerCase());
                if (duplicate) {
                  alert(`A department with name ${newDept.name} already exists.`);
                  return false;
                }
                try {
                  const colRef = collection(db, 'organizations_companies', userProfile.organizationId, 'departments');
                  await addDoc(colRef, {
                    ...newDept,
                    createdAt: new Date().toISOString()
                  });
                  setSuccessMsg?.('Department created successfully!');
                  return true;
                } catch (e) {
                  console.error("Error creating department:", e);
                  return false;
                }
              }}
              onEditDepartment={async (updatedDept) => {
                if (!userProfile?.organizationId) return false;
                try {
                  const docRef = doc(db, 'organizations_companies', userProfile.organizationId, 'departments', updatedDept.id);
                  const { id, ...data } = updatedDept;
                  await updateDoc(docRef, {
                    ...data,
                    updatedAt: new Date().toISOString()
                  });
                  setSuccessMsg?.('Department details updated.');
                  return true;
                } catch (e) {
                  console.error("Error updating department:", e);
                  return false;
                }
              }}
              onDeleteDepartment={async (deptId) => {
                if (!userProfile?.organizationId) return;
                try {
                  const docRef = doc(db, 'organizations_companies', userProfile.organizationId, 'departments', deptId);
                  await deleteDoc(docRef);
                  setSuccessMsg?.('Department deleted successfully.');
                } catch (e) {
                  console.error("Error deleting department:", e);
                }
              }}
            />
          )}

          {activeTab === 'settings' && (
            <CompanyAdminSettings 
              initialSettings={companyData || {}}
              onSaveSettings={async (settings) => {
                if (!userProfile?.organizationId) return false;
                try {
                  const docRef = doc(db, 'organizations_companies', userProfile.organizationId);
                  await setDoc(docRef, {
                    ...settings,
                    updatedAt: new Date().toISOString()
                  }, { merge: true });
                  setSuccessMsg?.('Corporate administrative settings updated.');
                  return true;
                } catch (e) {
                  console.error("Error saving corporate settings:", e);
                  return false;
                }
              }}
            />
          )}

        </div>
      )}

      {/* ==================================================== */}
      {/* 8. INTERNAL MANAGER (c_manager) */}
      {/* ==================================================== */}
      {role === 'c_manager' && (
        <div className="space-y-6">
          
          {/* Notification banner */}
          {successMsg && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl text-xs font-bold animate-fade-in flex items-center justify-between">
              <span>{successMsg}</span>
              <button onClick={() => setSuccessMsg('')} className="hover:opacity-80">✕</button>
            </div>
          )}

          {/* Active Tab Routing */}
          {activeTab === 'dashboard' && (
            <CompanyManagerDashboard 
              onNavigate={(tab) => {
                if (setActiveTab) setActiveTab(tab);
              }}
              onCreateJobClick={() => {
                setManagerEditingJob(null);
                setIsManagerCreatingJob(true);
                if (setActiveTab) setActiveTab('requirements');
              }}
            />
          )}

          {activeTab === 'requirements' && (
            isManagerCreatingJob || managerEditingJob ? (
              <CompanyManagerCreateJob 
                editJob={managerEditingJob}
                recruiters={[
                  { id: 'r-1', name: 'Priya Sharma', email: 'priya.sharma@company.com' },
                  { id: 'r-2', name: 'Rahul Verma', email: 'rahul.verma@company.com' },
                  { id: 'r-3', name: 'Neha Patel', email: 'neha.patel@company.com' },
                  { id: 'r-4', name: 'Amit Singh', email: 'amit.singh@company.com' },
                ]}
                onBack={() => {
                  setIsManagerCreatingJob(false);
                  setManagerEditingJob(null);
                }}
                onSubmit={(jobData) => {
                  if (managerEditingJob) {
                    // Update
                    setManagerJobsList(managerJobsList.map(j => j.id === managerEditingJob.id ? { ...j, ...jobData } : j));
                    setRecruiterJobsList(recruiterJobsList.map(j => j.id === managerEditingJob.id ? { 
                      ...j, 
                      title: jobData.title,
                      dept: jobData.dept,
                      location: jobData.location,
                      openings: jobData.openings,
                      status: jobData.status,
                      experience: jobData.experience,
                      type: jobData.type
                    } : j));
                    setSuccessMsg('Job requisition updated successfully.');
                  } else {
                    // Create
                    const newJob = {
                      id: `job-${managerJobsList.length + 1}`,
                      applicationsCount: 0,
                      ...jobData
                    };
                    setManagerJobsList([newJob, ...managerJobsList]);
                    setRecruiterJobsList([{
                      id: newJob.id,
                      title: newJob.title,
                      dept: newJob.dept,
                      location: newJob.location,
                      applicationsCount: 0,
                      openings: newJob.openings,
                      status: newJob.status,
                      experience: newJob.experience,
                      type: newJob.type
                    }, ...recruiterJobsList]);
                    setSuccessMsg('New job requirement published in directory.');
                  }
                  setIsManagerCreatingJob(false);
                  setManagerEditingJob(null);
                  setTimeout(() => setSuccessMsg(''), 3000);
                }}
              />
            ) : (
              <CompanyManagerJobs 
                jobsList={managerJobsList}
                onAddJobClick={() => {
                  setManagerEditingJob(null);
                  setIsManagerCreatingJob(true);
                }}
                onEditJobClick={(job) => {
                  setManagerEditingJob(job);
                  setIsManagerCreatingJob(false);
                }}
                onDeleteJobClick={(id) => {
                  if (confirm('Are you sure you want to delete this job requisition?')) {
                    setManagerJobsList(managerJobsList.filter(j => j.id !== id));
                    setRecruiterJobsList(recruiterJobsList.filter(j => j.id !== id));
                    setSuccessMsg('Job requisition has been deleted.');
                    setTimeout(() => setSuccessMsg(''), 2000);
                  }
                }}
                onViewPipelineClick={() => {
                  if (setActiveTab) setActiveTab('pipeline');
                }}
              />
            )
          )}

          {activeTab === 'recruiters' && (
            <CompanyManagerRecruiters />
          )}

          {activeTab === 'placements' && (
            <CompanyManagerApplications 
              candidates={recruiterCandidatesList}
              onSelectCandidate={(candId) => {
                setRecruiterActiveCandidateId(candId);
                // Redirect corporate managers to recruiter candidates pool tab view
              }}
              onUpdateStatus={(candId, newStatus) => {
                setRecruiterCandidatesList(recruiterCandidatesList.map(c => c.id === candId ? { ...c, status: newStatus } : c));
                setSuccessMsg('Candidacy status has been successfully updated.');
                setTimeout(() => setSuccessMsg(''), 2000);
              }}
            />
          )}

          {activeTab === 'pipeline' && (
            <CompanyManagerPipeline />
          )}

          {activeTab === 'analytics' && (
            <CompanyManagerAnalytics />
          )}

          {activeTab === 'profile' && (
            <CompanyManagerProfile />
          )}

        </div>
      )}

      {/* ==================================================== */}
      {/* 9. INTERNAL RECRUITER (c_recruiter) */}
      {/* ==================================================== */}
      {role === 'c_recruiter' && (() => {
        const currentRecruiterUid = userProfile?.uid || auth.currentUser?.uid || 'rec-1';
        const assignedCandidates = recruiterCandidatesList.filter(c => c.assignedRecruiterId === currentRecruiterUid);
        return (
          <div className="space-y-6">
            {activeTab === 'dashboard' && (
              <CorpRecruiterDashboardTab 
                onNavigate={(tab) => {
                  if (setActiveTab) setActiveTab(tab);
                }}
                onSelectCandidate={(candidateId) => {
                  setRecruiterActiveCandidateId(candidateId);
                  if (setActiveTab) setActiveTab('candidates');
                }}
                stats={{
                  activeJobs: recruiterJobsList.filter(j => j.status === 'Active').length,
                  totalCandidates: assignedCandidates.length,
                  applications: assignedCandidates.length,
                  openPositions: recruiterJobsList.reduce((acc, curr) => acc + curr.openings, 0)
                }}
                activeJobsList={recruiterJobsList}
                recentApplications={assignedCandidates.map(c => ({
                  id: c.id,
                  candidateName: c.name,
                  role: c.role,
                  date: c.appliedDate,
                  status: c.status
                })).slice(0, 3)}
                hiringProgress={{
                  applied: assignedCandidates.filter(c => c.status === 'Applied').length,
                  underReview: assignedCandidates.filter(c => c.status === 'Under Review').length,
                  shortlisted: assignedCandidates.filter(c => c.status === 'Shortlisted').length,
                  interview: assignedCandidates.filter(c => c.status === 'Interview').length,
                  selected: assignedCandidates.filter(c => c.status === 'Selected').length
                }}
              />
            )}

            {activeTab === 'jobs' && (
              <CorpRecruiterJobsTab 
                onNavigate={(tab, jobFilter) => {
                  if (jobFilter) {
                    setRecruiterSelectedPipelineJob(jobFilter);
                  } else {
                    setRecruiterSelectedPipelineJob('All');
                  }
                  if (setActiveTab) setActiveTab(tab);
                }}
                jobs={recruiterJobsList}
                onAddJob={async (newJob) => {
                  if (!userProfile?.organizationId) return;
                  try {
                    const jobsCol = collection(db, 'organizations_companies', userProfile.organizationId, 'jobs');
                    await addDoc(jobsCol, {
                      ...newJob,
                      applicationsCount: 0,
                      createdBy: currentRecruiterUid,
                      createdAt: new Date().toISOString()
                    });

                    // Log activity
                    const actCol = collection(db, 'organizations_companies', userProfile.organizationId, 'activity');
                    await addDoc(actCol, {
                      userName: userProfile.fullName || userProfile.displayName || 'Recruiter',
                      action: 'created a new job opening',
                      subject: newJob.title,
                      time: 'Just Now',
                      avatar: userProfile.avatar || 'https://picsum.photos/seed/rec/100/100',
                      createdAt: new Date().toISOString()
                    });

                    setSuccessMsg(`Successfully created job opening "${newJob.title}"`);
                    setTimeout(() => setSuccessMsg(''), 4000);
                  } catch (err) {
                    console.error("Error creating job:", err);
                    setErrorMsg("Failed to create job opening.");
                    setTimeout(() => setErrorMsg(''), 4000);
                  }
                }}
                onUpdateJob={async (updatedJob) => {
                  if (!userProfile?.organizationId) return;
                  try {
                    const jobDoc = doc(db, 'organizations_companies', userProfile.organizationId, 'jobs', updatedJob.id);
                    const { id, ...jobData } = updatedJob;
                    await updateDoc(jobDoc, {
                      ...jobData,
                      updatedAt: new Date().toISOString()
                    });

                    // Log activity
                    const actCol = collection(db, 'organizations_companies', userProfile.organizationId, 'activity');
                    await addDoc(actCol, {
                      userName: userProfile.fullName || userProfile.displayName || 'Recruiter',
                      action: 'updated job opening',
                      subject: updatedJob.title,
                      time: 'Just Now',
                      avatar: userProfile.avatar || 'https://picsum.photos/seed/rec/100/100',
                      createdAt: new Date().toISOString()
                    });

                    setSuccessMsg(`Successfully updated job opening "${updatedJob.title}"`);
                    setTimeout(() => setSuccessMsg(''), 4000);
                  } catch (err) {
                    console.error("Error updating job:", err);
                    setErrorMsg("Failed to update job opening.");
                    setTimeout(() => setErrorMsg(''), 4000);
                  }
                }}
              />
            )}

            {activeTab === 'candidates' && (
              <CorpRecruiterCandidatesTab 
                candidates={assignedCandidates}
                selectedCandidateId={recruiterActiveCandidateId}
                onSelectCandidate={(id) => setRecruiterActiveCandidateId(id)}
                onUpdateStatus={async (id, status) => {
                  if (!userProfile?.organizationId) return;
                  try {
                    const appDoc = doc(db, 'organizations_companies', userProfile.organizationId, 'applications', id);
                    await updateDoc(appDoc, {
                      status,
                      updatedAt: new Date().toISOString()
                    });

                    const candName = recruiterCandidatesList.find(c => c.id === id)?.name || 'Candidate';

                    // Log activity
                    const actCol = collection(db, 'organizations_companies', userProfile.organizationId, 'activity');
                    await addDoc(actCol, {
                      userName: userProfile.fullName || userProfile.displayName || 'Recruiter',
                      action: `updated candidacy status of ${candName} to "${status}"`,
                      subject: candName,
                      time: 'Just Now',
                      avatar: userProfile.avatar || 'https://picsum.photos/seed/rec/100/100',
                      createdAt: new Date().toISOString()
                    });

                    setSuccessMsg(`Updated status of ${candName} to "${status}"`);
                    setTimeout(() => setSuccessMsg(''), 4000);
                  } catch (err) {
                    console.error("Error updating status:", err);
                    setErrorMsg("Failed to update status.");
                    setTimeout(() => setErrorMsg(''), 4000);
                  }
                }}
              />
            )}

            {activeTab === 'applications' && (
              <CorpRecruiterApplicationsTab 
                onNavigate={(tab, jobFilter) => {
                  if (jobFilter) {
                    setRecruiterSelectedPipelineJob(jobFilter);
                  } else {
                    setRecruiterSelectedPipelineJob('All');
                  }
                  if (setActiveTab) setActiveTab(tab);
                }}
                applications={assignedCandidates.map(c => ({
                  id: c.id,
                  candidateName: c.name,
                  role: c.role,
                  date: c.appliedDate,
                  status: c.status,
                  dept: c.dept
                }))}
                onSelectCandidate={(id) => setRecruiterActiveCandidateId(id)}
                hiringProgress={{
                  applied: assignedCandidates.filter(c => c.status === 'Applied').length,
                  underReview: assignedCandidates.filter(c => c.status === 'Under Review').length,
                  shortlisted: assignedCandidates.filter(c => c.status === 'Shortlisted').length,
                  interview: assignedCandidates.filter(c => c.status === 'Interview').length,
                  selected: assignedCandidates.filter(c => c.status === 'Selected').length
                }}
              />
            )}

            {activeTab === 'pipeline' && (
              <CorpRecruiterPipelineTab 
                onNavigate={(tab) => {
                  if (setActiveTab) setActiveTab(tab);
                }}
                candidates={assignedCandidates}
                onUpdateStatus={async (id, status) => {
                  if (!userProfile?.organizationId) return;
                  try {
                    const appDoc = doc(db, 'organizations_companies', userProfile.organizationId, 'applications', id);
                    await updateDoc(appDoc, {
                      status,
                      updatedAt: new Date().toISOString()
                    });

                    const candName = recruiterCandidatesList.find(c => c.id === id)?.name || 'Candidate';

                    // Log activity
                    const actCol = collection(db, 'organizations_companies', userProfile.organizationId, 'activity');
                    await addDoc(actCol, {
                      userName: userProfile.fullName || userProfile.displayName || 'Recruiter',
                      action: `moved ${candName} to "${status}"`,
                      subject: candName,
                      time: 'Just Now',
                      avatar: userProfile.avatar || 'https://picsum.photos/seed/rec/100/100',
                      createdAt: new Date().toISOString()
                    });

                    setSuccessMsg(`Successfully moved ${candName} to "${status}"`);
                    setTimeout(() => setSuccessMsg(''), 4000);
                  } catch (err) {
                    console.error("Error updating status:", err);
                    setErrorMsg("Failed to update status.");
                    setTimeout(() => setErrorMsg(''), 4000);
                  }
                }}
                onSelectCandidate={(id) => setRecruiterActiveCandidateId(id)}
                selectedJob={recruiterSelectedPipelineJob}
                setSelectedJob={setRecruiterSelectedPipelineJob}
              />
            )}

            {activeTab === 'analytics' && (
              <CorpRecruiterAnalyticsTab />
            )}

            {activeTab === 'profile' && (
              <CorpRecruiterProfileTab />
            )}
          </div>
        );
      })()}

      {/* ==================================================== */}
      {/* 10. EMPLOYEE (c_employee) */}
      {/* ==================================================== */}
      {role === 'c_employee' && (
        <div className="space-y-6">
          {activeTab === 'dashboard' && (
            <EmployeeDashboardTab 
              onNavigate={(tab) => {
                if (setActiveTab) {
                  setActiveTab(tab);
                }
              }}
              onApplyJob={(roleName) => {
                setSuccessMsg(`Initiated internal transfer request for ${roleName}!`);
                setTimeout(() => setSuccessMsg(''), 4000);
              }}
            />
          )}

          {activeTab === 'opportunities' && (
            <EmployeeOpportunitiesTab 
              onApplyJob={(roleName) => {
                setSuccessMsg(`Initiated internal transfer request for ${roleName}!`);
                setTimeout(() => setSuccessMsg(''), 4000);
              }}
            />
          )}

          {activeTab === 'resume_builder' && (
            <EmployeeResumeBuilderTab />
          )}

          {activeTab === 'applications' && (
            <EmployeeApplicationsTab />
          )}

          {activeTab === 'documents' && (
            <EmployeeDocumentsTab />
          )}

          {activeTab === 'profile' && (
            <EmployeeProfileTab />
          )}

          {activeTab === 'settings' && (
            <EmployeeSettingsTab />
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 11. PLATFORM ADMIN (platform_admin) */}
      {/* ==================================================== */}
      {role === 'platform_admin' && (
        <div className="space-y-6">
          
          {activeTab === 'dashboard' && (
            <PlatformDashboard 
              onNavigate={(tab) => setActiveTab?.(tab)}
              onExport={() => {
                setSuccessMsg('Comprehensive platform performance report compiled & downloaded successfully.');
                setTimeout(() => setSuccessMsg(''), 4000);
              }}
            />
          )}

          {activeTab === 'organizations' && (
            <PlatformOrganizations 
              organizationsList={organizations}
              onAddOrg={(newOrg) => {
                const id = `org-${organizations.length + 1}`;
                const added = { id, users: 0, joinedDate: 'Today', ...newOrg };
                setOrganizations([added, ...organizations]);
                setSuccessMsg(`Database boundary initialized for ${newOrg.name} on ${newOrg.plan} tier!`);
                setTimeout(() => setSuccessMsg(''), 4000);
              }}
              onEditOrg={(updatedOrg) => {
                setOrganizations(organizations.map(o => o.id === updatedOrg.id ? updatedOrg : o));
                setSuccessMsg(`Access privileges updated for ${updatedOrg.name}.`);
                setTimeout(() => setSuccessMsg(''), 4000);
              }}
              onDeleteOrg={(orgId) => {
                setOrganizations(organizations.filter(o => o.id !== orgId));
                setSuccessMsg('Database cluster boundary completely de-provisioned.');
                setTimeout(() => setSuccessMsg(''), 4000);
              }}
            />
          )}

          {activeTab === 'users' && (
            <PlatformUsers 
              usersList={sysUsers}
              onToggleStatus={(userId) => {
                setSysUsers(sysUsers.map(u => {
                  if (u.id === userId) {
                    const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
                    setSuccessMsg(`User status adjusted to ${nextStatus}.`);
                    setTimeout(() => setSuccessMsg(''), 4000);
                    return { ...u, status: nextStatus };
                  }
                  return u;
                }));
              }}
              onDeleteUser={(userId) => {
                setSysUsers(sysUsers.filter(u => u.id !== userId));
                setSuccessMsg('User account permanently deleted.');
                setTimeout(() => setSuccessMsg(''), 4000);
              }}
              onAddUser={(newUser) => {
                const id = `usr-${sysUsers.length + 1}`;
                const added = { id, lastLogin: 'Never Active', ...newUser };
                setSysUsers([added, ...sysUsers]);
                setSuccessMsg(`Credential profile initialized for ${newUser.name}.`);
                setTimeout(() => setSuccessMsg(''), 4000);
              }}
            />
          )}

          {activeTab === 'marketplace' && (
            <PlatformMarketplace />
          )}

          {activeTab === 'universities' && (
            <PlatformUniversities />
          )}

          {activeTab === 'companies' && (
            <PlatformCompanies />
          )}

          {activeTab === 'billing' && (
            <PlatformBilling />
          )}

          {activeTab === 'system' && (
            <PlatformSystem />
          )}

          {activeTab === 'profile' && (
            <PlatformProfile />
          )}

        </div>
      )}
    </div>
  );
}
