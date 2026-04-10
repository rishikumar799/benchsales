export type UserRole = 'student' | 'agent' | 'manager' | 'admin' | null;

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
