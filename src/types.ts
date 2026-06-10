export type UserRole = 
  | 'm_candidate' | 'm_recruiter' | 'm_manager'
  | 'u_admin' | 'u_officer' | 'u_student'
  | 'c_admin' | 'c_manager' | 'c_recruiter' | 'c_employee'
  | 'platform_admin'
  | null;

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phoneNumber: string;
  avatar?: string;
  approvalStatus: ApprovalStatus;
  assignedAgentId?: string; // For students
}

export interface JobApplication {
  id: string;
  studentId: string;
  company: string;
  role: string;
  status: 'pending' | 'applied' | 'interview' | 'offered' | 'rejected';
  appliedDate: string;
  tailoredResumeUrl?: string;
  coverLetterUrl?: string;
}

export interface StudentStats {
  appsSentToday: number;
  totalApps: number;
  interviews: number;
  lastActive: string;
}
