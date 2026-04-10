export type UserRole = 'student' | 'agent' | 'admin' | null;

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
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
