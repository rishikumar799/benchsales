// LocalStorage-based state store for ARYX AI - Marketplace Recruiter Module
// Mirroring the planned Firestore collections structure exactly.

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
  availability: 'Available' | 'Assigned' | 'Offline';
  details: CandidateDetails;
}

export interface CandidateAccessRequest {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  notes?: string;
}

export interface CandidateSelection {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  selectionDate: string;
  status: 'Draft' | 'Ready';
  notes?: string;
}

export interface CandidateSubmission {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  candidateId: string;
  candidateName: string;
  candidateResume: string;
  submissionDate: string;
  submittedBy: string;
  assignedBdm: string;
  status: 'Submitted' | 'In Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected' | 'Joined';
  lastUpdated: string;
  notes?: string;
}

export interface RecruiterDashboard {
  openJobs: number;
  assignedJobs: number;
  availableCandidates: number;
  submittedCandidates: number;
  selections: number;
  successRate: string;
}

export interface ActivityNotification {
  id: string;
  type: 'submit' | 'select' | 'approve' | 'status' | 'request';
  title: string;
  desc: string;
  time: string;
}

// ----------------------------------------------------
// INITIAL MOCK DATASETS
// ----------------------------------------------------

const INITIAL_JOBS: RecruiterJob[] = [
  {
    id: 'job-1',
    title: 'Frontend Developer',
    company: 'ABC Tech Pvt Ltd',
    experience: '3-5 Years',
    skills: ['React', 'Next.js', 'TypeScript'],
    location: 'Bangalore',
    positions: '15 Positions',
    priority: 'High',
    posted: 'Posted 2 days ago',
    bdm: 'John Mathew',
    jobType: 'open',
    accessStatus: 'approved'
  },
  {
    id: 'job-2',
    title: 'Java Developer',
    company: 'Infoswift Solutions',
    experience: '4-6 Years',
    skills: ['Java', 'Spring Boot', 'MySQL'],
    location: 'Pune',
    positions: '8 Positions',
    priority: 'Medium',
    posted: 'Posted 5 days ago',
    bdm: 'John Mathew',
    jobType: 'assigned',
    accessStatus: 'none'
  },
  {
    id: 'job-3',
    title: 'Backend Developer',
    company: 'TechWave Systems',
    experience: '3-6 Years',
    skills: ['Node.js', 'Express', 'MongoDB'],
    location: 'Hyderabad',
    positions: '10 Positions',
    priority: 'High',
    posted: 'Posted 1 day ago',
    bdm: 'John Mathew',
    jobType: 'assigned',
    accessStatus: 'none'
  },
  {
    id: 'job-4',
    title: 'QA Engineer',
    company: 'X Corp',
    experience: '2-4 Years',
    skills: ['Manual', 'Automation', 'Selenium'],
    location: 'Chennai',
    positions: '6 Positions',
    priority: 'Low',
    posted: 'Posted 3 days ago',
    bdm: 'Arjun Patil',
    jobType: 'assigned',
    accessStatus: 'none'
  },
  {
    id: 'job-5',
    title: 'DevOps Engineer',
    company: 'CloudMatrix',
    experience: '4-6 Years',
    skills: ['AWS', 'Docker', 'Kubernetes'],
    location: 'Remote',
    positions: '5 Positions',
    priority: 'Medium',
    posted: 'Posted 2 days ago',
    bdm: 'Neha Sharma',
    jobType: 'open',
    accessStatus: 'approved'
  }
];

const INITIAL_CANDIDATES: RecruiterCandidate[] = [
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
];

const INITIAL_ACCESS_REQUESTS: CandidateAccessRequest[] = [
  {
    id: 'req-1',
    candidateId: 'c2',
    candidateName: 'Priya Sharma',
    jobId: 'job-2',
    jobTitle: 'Java Developer',
    requestDate: '23 Jun 2026',
    status: 'Pending',
    notes: 'Exceptional Spring Boot expertise.'
  },
  {
    id: 'req-2',
    candidateId: 'c1',
    candidateName: 'Ravi Kumar',
    jobId: 'job-1',
    jobTitle: 'Frontend Developer',
    requestDate: '21 Jun 2026',
    status: 'Approved',
    notes: 'Access requested for priority submission'
  },
  {
    id: 'req-3',
    candidateId: 'c3',
    candidateName: 'Akash Reddy',
    jobId: 'job-5',
    jobTitle: 'DevOps Engineer',
    requestDate: '20 Jun 2026',
    status: 'Completed',
    notes: 'Candidate submitted successfully'
  }
];

const INITIAL_SELECTIONS: CandidateSelection[] = [
  {
    id: 'sel-1',
    candidateId: 'c1',
    candidateName: 'Ravi Kumar',
    jobId: 'job-1',
    jobTitle: 'Frontend Developer',
    companyName: 'ABC Tech Pvt Ltd',
    selectionDate: '24 Jun 2026',
    status: 'Draft',
    notes: 'Strong portfolio matched.'
  },
  {
    id: 'sel-2',
    candidateId: 'c5',
    candidateName: 'Karthik Nair',
    jobId: 'job-5',
    jobTitle: 'DevOps Engineer',
    companyName: 'CloudMatrix',
    selectionDate: '24 Jun 2026',
    status: 'Draft',
    notes: 'Ready for client review'
  }
];

const INITIAL_SUBMISSIONS: CandidateSubmission[] = [
  {
    id: 'SUB-2026-001',
    jobId: 'job-1',
    jobTitle: 'Frontend Developer',
    companyName: 'ABC Tech Pvt Ltd',
    candidateId: 'c1',
    candidateName: 'Ravi Kumar',
    candidateResume: 'Ravi_Kumar_Frontend_Developer_Resume.pdf',
    submissionDate: '10 Jun 2026',
    submittedBy: 'Rohit Kumar',
    assignedBdm: 'John Mathew',
    status: 'Submitted',
    lastUpdated: '10 Jun 2026',
    notes: 'Great match with Next.js skills.'
  },
  {
    id: 'SUB-2026-002',
    jobId: 'job-5',
    jobTitle: 'DevOps Engineer',
    companyName: 'CloudMatrix',
    candidateId: 'c3',
    candidateName: 'Akash Reddy',
    candidateResume: 'Akash_Reddy_DevOps_Resume.pdf',
    submissionDate: '09 Jun 2026',
    submittedBy: 'Rohit Kumar',
    assignedBdm: 'Neha Sharma',
    status: 'Shortlisted',
    lastUpdated: '10 Jun 2026',
    notes: 'Certificates in Kubernetes.'
  },
  {
    id: 'SUB-2026-003',
    jobId: 'job-3',
    jobTitle: 'Backend Developer',
    companyName: 'TechWave Systems',
    candidateId: 'c4',
    candidateName: 'Sneha Iyer',
    candidateResume: 'Sneha_Iyer_PyDev_Resume.pdf',
    submissionDate: '08 Jun 2026',
    submittedBy: 'Rohit Kumar',
    assignedBdm: 'John Mathew',
    status: 'In Review',
    lastUpdated: '09 Jun 2026',
    notes: 'Clean Django implementations.'
  },
  {
    id: 'SUB-2026-004',
    jobId: 'job-2',
    jobTitle: 'Java Developer',
    companyName: 'Infoswift Solutions',
    candidateId: 'c2',
    candidateName: 'Priya Sharma',
    candidateResume: 'Priya_Sharma_Java_Resume.pdf',
    submissionDate: '07 Jun 2026',
    submittedBy: 'Rohit Kumar',
    assignedBdm: 'John Mathew',
    status: 'Submitted',
    lastUpdated: '08 Jun 2026',
    notes: 'Strong logical programming background.'
  },
  {
    id: 'SUB-2026-005',
    jobId: 'job-4',
    jobTitle: 'QA Engineer',
    companyName: 'X Corp',
    candidateId: 'c8',
    candidateName: 'Anjali Mehta',
    candidateResume: 'Anjali_Mehta_QA_Resume.pdf',
    submissionDate: '06 Jun 2026',
    submittedBy: 'Rohit Kumar',
    assignedBdm: 'Arjun Patil',
    status: 'Rejected',
    lastUpdated: '06 Jun 2026',
    notes: 'Lacked Automation experience.'
  }
];

const INITIAL_NOTIFICATIONS: ActivityNotification[] = [
  { id: 'n1', type: 'submit', title: 'Profile Submitted', desc: 'Ravi Kumar submitted for Frontend Developer', time: '2 hours ago' },
  { id: 'n2', type: 'select', title: 'Candidate Selected', desc: 'You selected Priya Sharma from your pool', time: '5 hours ago' },
  { id: 'n3', type: 'approve', title: 'Job Access Approved', desc: 'BDM John Mathew approved your access for Java Developer', time: '1 day ago' },
  { id: 'n4', type: 'status', title: 'Status Updated', desc: 'Akash Reddy status updated to Shortlisted', time: '2 days ago' }
];

// Helper to get from localstorage or initialize
function getStorage<T>(key: string, initial: T): T {
  try {
    const val = localStorage.getItem(key);
    if (val) return JSON.parse(val);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
}

function setStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    // Trigger storage event to refresh across listeners
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error(e);
  }
}

export const recruiterStorage = {
  getJobs: () => getStorage<RecruiterJob[]>('jobs', INITIAL_JOBS),
  setJobs: (jobs: RecruiterJob[]) => setStorage('jobs', jobs),

  getCandidates: () => getStorage<RecruiterCandidate[]>('candidate_pool', INITIAL_CANDIDATES),
  setCandidates: (cands: RecruiterCandidate[]) => setStorage('candidate_pool', cands),

  getAccessRequests: () => getStorage<CandidateAccessRequest[]>('candidate_access_requests', INITIAL_ACCESS_REQUESTS),
  setAccessRequests: (reqs: CandidateAccessRequest[]) => setStorage('candidate_access_requests', reqs),

  getSelections: () => getStorage<CandidateSelection[]>('candidate_selections', INITIAL_SELECTIONS),
  setSelections: (sels: CandidateSelection[]) => setStorage('candidate_selections', sels),

  getSubmissions: () => getStorage<CandidateSubmission[]>('candidate_submissions', INITIAL_SUBMISSIONS),
  setSubmissions: (subs: CandidateSubmission[]) => setStorage('candidate_submissions', subs),

  getNotifications: () => getStorage<ActivityNotification[]>('notifications', INITIAL_NOTIFICATIONS),
  setNotifications: (notes: ActivityNotification[]) => setStorage('notifications', notes),

  getDashboardStats: (): RecruiterDashboard => {
    const jobs = getStorage<RecruiterJob[]>('jobs', INITIAL_JOBS);
    const cands = getStorage<RecruiterCandidate[]>('candidate_pool', INITIAL_CANDIDATES);
    const selections = getStorage<CandidateSelection[]>('candidate_selections', INITIAL_SELECTIONS);
    const submissions = getStorage<CandidateSubmission[]>('candidate_submissions', INITIAL_SUBMISSIONS);

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
