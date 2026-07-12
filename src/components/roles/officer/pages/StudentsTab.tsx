import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  ChevronRight, 
  Download, 
  User, 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  Mail, 
  Phone, 
  X, 
  FileText,
  TrendingUp,
  Award,
  CircleCheck,
  LayoutGrid,
  Edit2,
  Save,
  Plus,
  Trash2,
  Globe,
  Check,
  AlertCircle,
  HelpCircle,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { collection, doc, onSnapshot, writeBatch, updateDoc } from 'firebase/firestore';

interface Project {
  title: string;
  description: string;
  link: string;
}

interface DocumentItem {
  name: string;
  url: string;
}

interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

interface StudentDoc {
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  rollNumber: string;
  registrationNumber: string;
  department: string;
  branch: string;
  year: string;
  semester: string;
  cgpa: number;
  skills: string[];
  resume: string;
  photoURL: string;
  status: string;
  placementStatus: string;
  createdAt: string;
  updatedAt: string;
  applicationsCount?: number;
  projects?: Project[];
  documents?: DocumentItem[];
  activityTimeline?: TimelineItem[];
}

export default function StudentsTab() {
  const { userProfile } = useAuth();
  const [students, setStudents] = useState<StudentDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Filters & State
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cgpaFilter, setCgpaFilter] = useState('All');

  // Selected Student Details Realtime Tracking State
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [activeStudentDetail, setActiveStudentDetail] = useState<StudentDoc | null>(null);
  
  // Edit Panel State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<{
    fullName: string;
    email: string;
    phone: string;
    rollNumber: string;
    registrationNumber: string;
    department: string;
    branch: string;
    year: string;
    semester: string;
    cgpa: string;
    skills: string;
    resume: string;
    photoURL: string;
    status: string;
    applicationsCount: string;
    projects: Project[];
    documents: DocumentItem[];
    activityTimeline: TimelineItem[];
  } | null>(null);

  // Panel Tabs State
  const [activePanelTab, setActivePanelTab] = useState<'academics' | 'projects_skills' | 'documents' | 'timeline'>('academics');

  // Interactive Form helpers
  const [newProject, setNewProject] = useState<Project>({ title: '', description: '', link: '' });
  const [newDoc, setNewDoc] = useState<DocumentItem>({ name: '', url: '' });
  const [newTimeline, setNewTimeline] = useState<TimelineItem>({ date: new Date().toISOString().split('T')[0], title: '', description: '' });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Set up real-time listener for the students directory of this organization
  useEffect(() => {
    if (!userProfile?.organizationId) {
      setLoading(false);
      return;
    }

    const colPath = `organizations_universities/${userProfile.organizationId}/students`;
    const studentsColRef = collection(db, 'organizations_universities', userProfile.organizationId, 'students');

    const unsubscribe = onSnapshot(studentsColRef, async (querySnap) => {
      const studentList: StudentDoc[] = [];
      querySnap.forEach((docSnap) => {
        const data = docSnap.data();
        studentList.push({
          studentId: docSnap.id,
          fullName: data.fullName || data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          rollNumber: data.rollNumber || data.roll || '',
          registrationNumber: data.registrationNumber || '',
          department: data.department || data.dept || '',
          branch: data.branch || '',
          year: data.year || '4th Year',
          semester: data.semester || data.sem || '7th Semester',
          cgpa: typeof data.cgpa === 'number' ? data.cgpa : parseFloat(data.cgpa || '0'),
          skills: Array.isArray(data.skills) ? data.skills : [],
          resume: data.resume || '',
          photoURL: data.photoURL || data.avatar || '',
          status: data.status || 'Eligible',
          placementStatus: data.placementStatus || data.status || 'Eligible',
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || '',
          applicationsCount: data.applicationsCount || (docSnap.id === 'std-1' ? 12 : docSnap.id === 'std-4' ? 10 : docSnap.id === 'std-7' ? 9 : 6),
          projects: Array.isArray(data.projects) ? data.projects : [],
          documents: Array.isArray(data.documents) ? data.documents : [],
          activityTimeline: Array.isArray(data.activityTimeline) ? data.activityTimeline : []
        });
      });

      // Handle auto-seeding if collection is empty
      if (studentList.length === 0 && !seeding) {
        setSeeding(true);
        try {
          const batch = writeBatch(db);
          const initialStudents: StudentDoc[] = [
            {
              studentId: 'std-1',
              fullName: 'Rahul Kumar',
              email: 'rahul.kumar@xavier.edu',
              phone: '+91 98765 43210',
              rollNumber: 'CS20224001',
              registrationNumber: 'REG2022001',
              department: 'CSE',
              branch: 'Computer Science & Engineering',
              year: '4th Year',
              semester: '7th Semester',
              cgpa: 8.50,
              skills: ['Java', 'Python', 'SQL', 'Data Structures', 'React.js'],
              resume: 'https://example.com/resumes/rahul_kumar.pdf',
              photoURL: 'https://picsum.photos/seed/rahul/100/100',
              status: 'Placed',
              placementStatus: 'Placed',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              applicationsCount: 12,
              projects: [
                { title: 'E-Commerce Platform', description: 'A robust web application built using React, Express, and Node.js with secure payments.', link: 'https://github.com/rahul/ecommerce' },
                { title: 'AI Assistant Interface', description: 'A smart text chatbot leveraging Gemini API to answer campus administration requests.', link: 'https://github.com/rahul/chatbot' }
              ],
              documents: [
                { name: '10th Marksheet', url: 'https://example.com/docs/rahul_10th.pdf' },
                { name: '12th Marksheet', url: 'https://example.com/docs/rahul_12th.pdf' }
              ],
              activityTimeline: [
                { date: '2026-06-15', title: 'Joined Placement Registry', description: 'Academic criteria and credentials vetted by placement team.' },
                { date: '2026-06-25', title: 'Cleared TCS Coding Round', description: 'Successfully qualified national benchmark coding exam.' },
                { date: '2026-07-05', title: 'Received Job Offer', description: 'Offered Software Engineer position with Microsoft India.' }
              ]
            },
            {
              studentId: 'std-2',
              fullName: 'Anjali Sharma',
              email: 'anjali@xavier.edu',
              phone: '+91 87654 32109',
              rollNumber: 'EC20226015',
              registrationNumber: 'REG2022015',
              department: 'ECE',
              branch: 'Electronics & Communication Engineering',
              year: '4th Year',
              semester: '7th Semester',
              cgpa: 8.10,
              skills: ['Embedded C', 'MATLAB', 'Python', 'Verilog', 'IoT'],
              resume: 'https://example.com/resumes/anjali_sharma.pdf',
              photoURL: 'https://picsum.photos/seed/anjali/100/100',
              status: 'Eligible',
              placementStatus: 'Eligible',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              applicationsCount: 4,
              projects: [
                { title: 'Smart Home Automation', description: 'An automated home control grid built on Raspberry Pi with secure mobile companion apps.', link: 'https://github.com/anjali/smarthome' }
              ],
              documents: [
                { name: '10th Marksheet', url: 'https://example.com/docs/anjali_10th.pdf' }
              ],
              activityTimeline: [
                { date: '2026-06-10', title: 'Registered Profile', description: 'Student registered and uploaded first resume draft.' }
              ]
            },
            {
              studentId: 'std-3',
              fullName: 'Vikram Patel',
              email: 'vikram@xavier.edu',
              phone: '+91 76543 21098',
              rollNumber: 'IT20223023',
              registrationNumber: 'REG2022023',
              department: 'IT',
              branch: 'Information Technology',
              year: '4th Year',
              semester: '7th Semester',
              cgpa: 7.90,
              skills: ['C++', 'SQL', 'OS', 'DBMS', 'Web Tech'],
              resume: 'https://example.com/resumes/vikram_patel.pdf',
              photoURL: 'https://picsum.photos/seed/vikram/100/100',
              status: 'Applied',
              placementStatus: 'Applied',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              applicationsCount: 6,
              projects: [
                { title: 'Local Search Indexer', description: 'Fast file lookup system designed in C++ using custom B-Trees structure.', link: 'https://github.com/vikram/search' }
              ],
              documents: [
                { name: 'Intership Certificate', url: 'https://example.com/docs/vikram_intern.pdf' }
              ],
              activityTimeline: [
                { date: '2026-06-20', title: 'Profile Complete', description: 'Placement database initialized and ready for company drives.' }
              ]
            },
            {
              studentId: 'std-4',
              fullName: 'Neha Singh',
              email: 'neha@xavier.edu',
              phone: '+91 65432 10987',
              rollNumber: 'CS20224045',
              registrationNumber: 'REG2022045',
              department: 'CSE',
              branch: 'Computer Science & Engineering',
              year: '4th Year',
              semester: '7th Semester',
              cgpa: 8.70,
              skills: ['Java', 'Spring Boot', 'MongoDB', 'React', 'Docker'],
              resume: 'https://example.com/resumes/neha_singh.pdf',
              photoURL: 'https://picsum.photos/seed/neha/100/100',
              status: 'Shortlisted',
              placementStatus: 'Shortlisted',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              applicationsCount: 10,
              projects: [
                { title: 'Microservices Framework', description: 'Scalable service mesh designed in Spring Cloud with centralized authentication gateway.', link: 'https://github.com/neha/microservices' }
              ],
              documents: [
                { name: '10th Marksheet', url: 'https://example.com/docs/neha_10th.pdf' },
                { name: 'AWS Certificate', url: 'https://example.com/docs/neha_aws.pdf' }
              ],
              activityTimeline: [
                { date: '2026-06-18', title: 'Registered in Database', description: 'Student registered in university database.' },
                { date: '2026-07-02', title: 'Shortlisted by Amazon', description: 'Selected for final standard tech interview loops.' }
              ]
            }
          ];

          initialStudents.forEach((student) => {
            const docRef = doc(studentsColRef, student.studentId);
            batch.set(docRef, student);
          });

          await batch.commit();
        } catch (err) {
          console.error('Error seeding students:', err);
        } finally {
          setSeeding(false);
        }
      } else {
        setStudents(studentList);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, colPath);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userProfile, seeding]);

  // Set up real-time listener for the SPECIFIC SELECTED student details (read-only / live updates)
  useEffect(() => {
    if (!selectedStudentId || !userProfile?.organizationId) {
      setActiveStudentDetail(null);
      return;
    }

    const docPath = `organizations_universities/${userProfile.organizationId}/students/${selectedStudentId}`;
    const docRef = doc(db, 'organizations_universities', userProfile.organizationId, 'students', selectedStudentId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const activeStudent: StudentDoc = {
          studentId: docSnap.id,
          fullName: data.fullName || data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          rollNumber: data.rollNumber || data.roll || '',
          registrationNumber: data.registrationNumber || '',
          department: data.department || data.dept || '',
          branch: data.branch || '',
          year: data.year || '4th Year',
          semester: data.semester || data.sem || '7th Semester',
          cgpa: typeof data.cgpa === 'number' ? data.cgpa : parseFloat(data.cgpa || '0'),
          skills: Array.isArray(data.skills) ? data.skills : [],
          resume: data.resume || '',
          photoURL: data.photoURL || data.avatar || '',
          status: data.status || 'Eligible',
          placementStatus: data.placementStatus || data.status || 'Eligible',
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || '',
          applicationsCount: typeof data.applicationsCount === 'number' ? data.applicationsCount : 6,
          projects: Array.isArray(data.projects) ? data.projects : [],
          documents: Array.isArray(data.documents) ? data.documents : [],
          activityTimeline: Array.isArray(data.activityTimeline) ? data.activityTimeline : []
        };
        
        setActiveStudentDetail(activeStudent);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, docPath);
    });

    return () => unsubscribe();
  }, [selectedStudentId, userProfile]);

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, deptFilter, statusFilter, cgpaFilter]);

  // Initialize edit form with loaded real-time student details
  const startEditing = () => {
    if (!activeStudentDetail) return;
    setEditForm({
      fullName: activeStudentDetail.fullName,
      email: activeStudentDetail.email,
      phone: activeStudentDetail.phone,
      rollNumber: activeStudentDetail.rollNumber,
      registrationNumber: activeStudentDetail.registrationNumber,
      department: activeStudentDetail.department,
      branch: activeStudentDetail.branch,
      year: activeStudentDetail.year,
      semester: activeStudentDetail.semester,
      cgpa: activeStudentDetail.cgpa.toString(),
      skills: activeStudentDetail.skills.join(', '),
      resume: activeStudentDetail.resume,
      photoURL: activeStudentDetail.photoURL,
      status: activeStudentDetail.status,
      applicationsCount: (activeStudentDetail.applicationsCount ?? 6).toString(),
      projects: [...(activeStudentDetail.projects || [])],
      documents: [...(activeStudentDetail.documents || [])],
      activityTimeline: [...(activeStudentDetail.activityTimeline || [])],
    });
    setIsEditing(true);
  };

  // Submit edits via updateDoc()
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.organizationId || !selectedStudentId || !editForm) return;

    const docPath = `organizations_universities/${userProfile.organizationId}/students/${selectedStudentId}`;
    const docRef = doc(db, 'organizations_universities', userProfile.organizationId, 'students', selectedStudentId);

    try {
      const skillsArray = editForm.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      await updateDoc(docRef, {
        fullName: editForm.fullName,
        email: editForm.email,
        phone: editForm.phone,
        rollNumber: editForm.rollNumber,
        registrationNumber: editForm.registrationNumber,
        department: editForm.department,
        branch: editForm.branch,
        year: editForm.year,
        semester: editForm.semester,
        cgpa: parseFloat(editForm.cgpa) || 0,
        skills: skillsArray,
        resume: editForm.resume,
        photoURL: editForm.photoURL,
        status: editForm.status,
        placementStatus: editForm.status, // Keep both updated
        applicationsCount: parseInt(editForm.applicationsCount) || 0,
        projects: editForm.projects,
        documents: editForm.documents,
        activityTimeline: editForm.activityTimeline,
        updatedAt: new Date().toISOString()
      });

      setIsEditing(false);
      alert('✓ Student profile information updated successfully in Firestore!');
    } catch (err) {
      console.error('Error updating student document:', err);
      handleFirestoreError(err, OperationType.UPDATE, docPath);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Placed':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'Eligible':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'Applied':
        return 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20';
      case 'Shortlisted':
        return 'bg-violet-500/10 text-violet-500 border border-violet-500/20';
      case 'Under Review':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
    }
  };

  // Local state array filtering and searching
  const filteredStudents = students.filter(stu => {
    const matchesSearch = stu.fullName.toLowerCase().includes(search.toLowerCase()) || 
                          stu.rollNumber.toLowerCase().includes(search.toLowerCase());
    
    const matchesDept = deptFilter === 'All' || stu.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || stu.status === statusFilter;
    
    let matchesCgpa = true;
    if (cgpaFilter === '8.5') {
      matchesCgpa = stu.cgpa >= 8.5;
    } else if (cgpaFilter === '8.0') {
      matchesCgpa = stu.cgpa >= 8.0 && stu.cgpa < 8.5;
    } else if (cgpaFilter === '7.0') {
      matchesCgpa = stu.cgpa >= 7.0 && stu.cgpa < 8.0;
    }

    return matchesSearch && matchesDept && matchesStatus && matchesCgpa;
  });

  // Calculate statistics directly from the real-time collection state
  const totalCount = students.length;
  const placedCount = students.filter(s => s.status === 'Placed').length;
  const eligibleCount = students.filter(s => s.status === 'Eligible').length;
  const avgCgpa = students.length > 0 
    ? (students.reduce((acc, curr) => acc + curr.cgpa, 0) / students.length).toFixed(2)
    : '0.00';

  // Export as CSV
  const handleExportCSV = () => {
    if (students.length === 0) {
      alert('No student records available to export.');
      return;
    }
    const headers = [
      'Student ID', 'Full Name', 'Email', 'Phone', 'Roll Number', 
      'Registration Number', 'Department', 'Branch', 'Year', 
      'Semester', 'CGPA', 'Skills', 'Placement Status', 'Created At'
    ];
    
    const rows = students.map(s => [
      s.studentId,
      s.fullName,
      s.email,
      s.phone,
      s.rollNumber,
      s.registrationNumber,
      s.department,
      s.branch,
      s.year,
      s.semester,
      s.cgpa,
      s.skills.join('; '),
      s.status || s.placementStatus,
      s.createdAt
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Students_Registry_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination bounds
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-app-text">Students</h2>
          <p className="text-app-muted">View, search, and manage verified student placements activity.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="px-4.5 py-2.5 bg-app-surface text-app-text border border-app-border rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:bg-app-surface/90"
        >
          <Download className="w-4 h-4 text-app-muted" /> Export Excel
        </button>
      </div>

      {/* Statistics widgets directly reflecting real-time Firestore database */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 rounded-[24px] glass border-app-border/40 card-shadow flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-brand-blue/10 text-brand-blue">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Total Students</div>
            <div className="text-xl font-display font-black text-app-text mt-0.5">{totalCount}</div>
          </div>
        </div>

        <div className="p-5 rounded-[24px] glass border-app-border/40 card-shadow flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <CircleCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Students Placed</div>
            <div className="text-xl font-display font-black text-app-text mt-0.5">{placedCount}</div>
          </div>
        </div>

        <div className="p-5 rounded-[24px] glass border-app-border/40 card-shadow flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-500">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Eligible & Seeking</div>
            <div className="text-xl font-display font-black text-app-text mt-0.5">{eligibleCount}</div>
          </div>
        </div>

        <div className="p-5 rounded-[24px] glass border-app-border/40 card-shadow flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-violet-500/10 text-violet-500">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Average CGPA</div>
            <div className="text-xl font-display font-black text-app-text mt-0.5">{avgCgpa}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-5 rounded-[28px] glass border-app-border card-shadow flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search student names or roll numbers..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:border-brand-blue transition-colors font-semibold"
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select 
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-3 py-2.5 text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue transition-all"
          >
            <option value="All">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="IT">IT</option>
            <option value="ME">ME</option>
          </select>

          <select 
            value={cgpaFilter}
            onChange={(e) => setCgpaFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-3 py-2.5 text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue transition-all"
          >
            <option value="All">All CGPA</option>
            <option value="8.5">CGPA ≥ 8.5</option>
            <option value="8.0">CGPA 8.0 - 8.5</option>
            <option value="7.0">CGPA 7.0 - 8.0</option>
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-3 py-2.5 text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue transition-all"
          >
            <option value="All">Placement Status: All</option>
            <option value="Placed">Placed</option>
            <option value="Eligible">Eligible</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>
      </div>

      {/* Main Students Register Table */}
      <div className="glass border-app-border rounded-[28px] overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border/40 bg-app-surface/20">
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted pl-6">Student Name</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Roll Number</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Department</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">CGPA</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Applications</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Placement Status</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((stu) => {
                  const seedAvatar = stu.photoURL || `https://picsum.photos/seed/${stu.studentId}/100/100`;
                  return (
                    <tr key={stu.studentId} className="hover:bg-app-surface/30 transition-colors">
                      {/* Name */}
                      <td className="p-4.5 pl-6 font-semibold text-app-text flex items-center gap-3.5">
                        <img 
                          src={seedAvatar} 
                          alt={stu.fullName} 
                          className="w-9 h-9 rounded-full object-cover border border-app-border" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-extrabold text-sm text-app-text">{stu.fullName}</div>
                          <div className="text-[10px] text-app-muted font-bold">{stu.email}</div>
                        </div>
                      </td>

                      {/* Roll */}
                      <td className="p-4.5 text-xs font-extrabold text-app-text">{stu.rollNumber}</td>

                      {/* Department */}
                      <td className="p-4.5 text-xs font-bold text-app-muted">
                        <span className="bg-app-surface text-app-muted border border-app-border px-2 py-0.5 rounded-md font-extrabold">
                          {stu.department}
                        </span>
                      </td>

                      {/* CGPA */}
                      <td className="p-4.5 text-sm font-black text-brand-blue">{stu.cgpa.toFixed(2)}</td>

                      {/* Applications count */}
                      <td className="p-4.5 text-xs font-bold text-app-text pl-8">{stu.applicationsCount ?? 6}</td>

                      {/* Status badge */}
                      <td className="p-4.5 text-xs font-bold">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-extrabold tracking-wide ${getStatusStyle(stu.status)}`}>
                          {stu.status}
                        </span>
                      </td>

                      {/* View Profile Action button */}
                      <td className="p-4.5 text-right pr-6">
                        <button 
                          onClick={() => {
                            setSelectedStudentId(stu.studentId);
                            setActivePanelTab('academics');
                            setIsEditing(false);
                          }}
                          className="px-3 py-1.5 bg-brand-blue/10 text-brand-blue text-xs font-black rounded-lg hover:bg-brand-blue hover:text-white transition-all flex items-center gap-1 ml-auto"
                        >
                          View Profile <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-app-muted text-sm font-semibold">
                    No matching students found in this range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-app-border/40 flex justify-between items-center text-xs font-semibold text-app-muted bg-app-surface/10 px-6">
          <span>Showing {filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} students</span>
          <div className="flex gap-1.5">
            <button 
              className="px-2.5 py-1.5 border border-app-border rounded-lg hover:bg-app-surface transition-all text-app-muted disabled:opacity-40"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="px-3 py-1.5 bg-brand-blue/15 text-brand-blue border border-brand-blue/10 rounded-lg font-black text-xs">
              {currentPage} / {totalPages}
            </span>
            <button 
              className="px-2.5 py-1.5 border border-app-border rounded-lg hover:bg-app-surface transition-all text-app-muted disabled:opacity-40"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Floating Detailed Student Profile Sidebar Modal (Sheet Modal) */}
      <AnimatePresence>
        {selectedStudentId && activeStudentDetail && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setSelectedStudentId(null);
                setIsEditing(false);
              }}
            />

            {/* Panel Sheet */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-2xl bg-app-bg border-l border-app-border shadow-2xl h-full overflow-y-auto flex flex-col justify-between"
            >
              {/* Header inside Panel */}
              <div className="p-6 border-b border-app-border flex items-center justify-between sticky top-0 bg-app-bg/95 backdrop-blur-md z-10">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-brand-blue" />
                  <h3 className="font-display font-black text-lg text-app-text">
                    {isEditing ? 'Edit Student Details' : 'Student Detailed Profile'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <button 
                      onClick={startEditing}
                      className="px-3 py-1.5 bg-brand-blue/10 hover:bg-brand-blue/15 text-brand-blue text-xs font-black rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 bg-app-surface border border-app-border text-app-muted hover:text-app-text text-xs font-bold rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setSelectedStudentId(null);
                      setIsEditing(false);
                    }}
                    className="p-2 text-app-muted hover:text-app-text hover:bg-app-surface rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tab Selector inside Panel */}
              <div className="px-6 border-b border-app-border/40 flex gap-4 sticky top-[73px] bg-app-bg/90 backdrop-blur-md z-10 text-xs">
                {[
                  { id: 'academics', label: 'Overview & Academics' },
                  { id: 'projects_skills', label: 'Projects & Skills' },
                  { id: 'documents', label: 'Documents & Resume' },
                  { id: 'timeline', label: 'Activity Timeline' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActivePanelTab(tab.id as any)}
                    className={`py-3.5 border-b-2 font-bold uppercase tracking-wider text-[10px] transition-all ${
                      activePanelTab === tab.id 
                        ? 'border-brand-blue text-brand-blue font-extrabold' 
                        : 'border-transparent text-app-muted hover:text-app-text'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Panel Content Body */}
              <div className="p-6 sm:p-8 space-y-6 flex-1">
                
                {/* Visual Top Student Identity Header */}
                <div className="p-6 bg-app-surface/60 rounded-[28px] border border-app-border flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                  <div className="w-20 h-20 rounded-full blue-gradient p-0.5 shadow-lg relative">
                    <img 
                      src={activeStudentDetail.photoURL || `https://picsum.photos/seed/${activeStudentDetail.studentId}/200/200`} 
                      alt={activeStudentDetail.fullName} 
                      className="w-full h-full rounded-full object-cover border-4 border-app-bg"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-app-bg" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-display font-black text-app-text">{activeStudentDetail.fullName}</h4>
                    <p className="text-xs font-bold text-app-muted uppercase tracking-wider">
                      Roll Number: {activeStudentDetail.rollNumber} • {activeStudentDetail.department} {activeStudentDetail.branch ? `(${activeStudentDetail.branch})` : ''} - {activeStudentDetail.year}
                    </p>
                    <span className={`inline-block mt-1 text-[10px] uppercase font-extrabold px-3 py-1 rounded-full ${getStatusStyle(activeStudentDetail.status)}`}>
                      {activeStudentDetail.status} Status
                    </span>
                  </div>
                </div>

                {/* Form Wrapper */}
                <form onSubmit={handleUpdateStudent} className="space-y-6">
                  
                  {/* TAB 1: ACADEMICS & PERSONAL */}
                  {activePanelTab === 'academics' && (
                    <div className="space-y-6">
                      
                      {/* Identity & Contacts */}
                      <div className="p-5 bg-app-surface/40 border border-app-border rounded-2xl space-y-4">
                        <h5 className="font-display font-black text-xs text-app-text uppercase tracking-widest border-b border-app-border/40 pb-2 flex items-center gap-2">
                          <User className="w-4 h-4 text-brand-blue" /> Personal & Identity Details
                        </h5>
                        
                        {!isEditing ? (
                          <div className="space-y-3.5 text-xs font-semibold text-app-text">
                            <div className="flex justify-between items-center pb-2.5 border-b border-app-border/25">
                              <span className="text-app-muted font-bold uppercase tracking-wider text-[9px]">Full Name</span>
                              <span className="font-bold text-app-text">{activeStudentDetail.fullName}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2.5 border-b border-app-border/25">
                              <span className="text-app-muted font-bold uppercase tracking-wider text-[9px]">Email Address</span>
                              <span className="font-bold text-app-text text-brand-blue">{activeStudentDetail.email}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2.5 border-b border-app-border/25">
                              <span className="text-app-muted font-bold uppercase tracking-wider text-[9px]">Contact Phone</span>
                              <span className="font-bold text-app-text">{activeStudentDetail.phone}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-app-muted font-bold uppercase tracking-wider text-[9px]">Photo URL</span>
                              <span className="font-semibold text-app-muted truncate max-w-[280px]">{activeStudentDetail.photoURL || 'Standard Generated URL'}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Full Name</label>
                              <input 
                                type="text"
                                value={editForm?.fullName || ''}
                                onChange={(e) => setEditForm(prev => prev ? { ...prev, fullName: e.target.value } : null)}
                                className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text focus:outline-none focus:border-brand-blue"
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Email Address</label>
                              <input 
                                type="email"
                                value={editForm?.email || ''}
                                onChange={(e) => setEditForm(prev => prev ? { ...prev, email: e.target.value } : null)}
                                className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text focus:outline-none focus:border-brand-blue"
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Contact Phone</label>
                              <input 
                                type="text"
                                value={editForm?.phone || ''}
                                onChange={(e) => setEditForm(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text focus:outline-none focus:border-brand-blue"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Photo / Avatar URL</label>
                              <input 
                                type="text"
                                value={editForm?.photoURL || ''}
                                onChange={(e) => setEditForm(prev => prev ? { ...prev, photoURL: e.target.value } : null)}
                                className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text focus:outline-none focus:border-brand-blue"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Academic details info */}
                      <div className="p-5 bg-app-surface/40 border border-app-border rounded-2xl space-y-4">
                        <h5 className="font-display font-black text-xs text-app-text uppercase tracking-widest border-b border-app-border/40 pb-2 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-brand-blue" /> Academic Profile Vitals
                        </h5>
                        
                        {!isEditing ? (
                          <div className="space-y-3.5 text-xs font-semibold text-app-text">
                            <div className="grid grid-cols-2 gap-4 pb-2.5 border-b border-app-border/25">
                              <div>
                                <span className="text-app-muted font-bold uppercase tracking-wider text-[9px] block">Roll Number</span>
                                <span className="font-bold text-app-text mt-0.5 block">{activeStudentDetail.rollNumber}</span>
                              </div>
                              <div>
                                <span className="text-app-muted font-bold uppercase tracking-wider text-[9px] block">Registration Number</span>
                                <span className="font-bold text-app-text mt-0.5 block">{activeStudentDetail.registrationNumber || 'Not Registered'}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pb-2.5 border-b border-app-border/25">
                              <div>
                                <span className="text-app-muted font-bold uppercase tracking-wider text-[9px] block">Department / Branch</span>
                                <span className="font-bold text-app-text mt-0.5 block">{activeStudentDetail.department} • {activeStudentDetail.branch || 'General'}</span>
                              </div>
                              <div>
                                <span className="text-app-muted font-bold uppercase tracking-wider text-[9px] block">Academic Year / Semester</span>
                                <span className="font-bold text-app-text mt-0.5 block">{activeStudentDetail.year} • {activeStudentDetail.semester}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-app-muted font-bold uppercase tracking-wider text-[9px] block">CGPA Score</span>
                                <span className="text-brand-blue font-black text-base mt-0.5 block">{activeStudentDetail.cgpa.toFixed(2)} / 10.00</span>
                              </div>
                              <div>
                                <span className="text-app-muted font-bold uppercase tracking-wider text-[9px] block">Applications Count</span>
                                <span className="font-bold text-app-text mt-0.5 block">{activeStudentDetail.applicationsCount ?? 6} active submissions</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4 text-xs font-semibold">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Roll Number</label>
                                <input 
                                  type="text"
                                  value={editForm?.rollNumber || ''}
                                  onChange={(e) => setEditForm(prev => prev ? { ...prev, rollNumber: e.target.value } : null)}
                                  className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text focus:outline-none focus:border-brand-blue"
                                  required
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Registration Number</label>
                                <input 
                                  type="text"
                                  value={editForm?.registrationNumber || ''}
                                  onChange={(e) => setEditForm(prev => prev ? { ...prev, registrationNumber: e.target.value } : null)}
                                  className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text focus:outline-none focus:border-brand-blue"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Department</label>
                                <select 
                                  value={editForm?.department || ''}
                                  onChange={(e) => setEditForm(prev => prev ? { ...prev, department: e.target.value } : null)}
                                  className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text focus:outline-none focus:border-brand-blue font-bold"
                                >
                                  <option value="CSE">CSE</option>
                                  <option value="ECE">ECE</option>
                                  <option value="IT">IT</option>
                                  <option value="ME">ME</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Branch Specialization</label>
                                <input 
                                  type="text"
                                  value={editForm?.branch || ''}
                                  onChange={(e) => setEditForm(prev => prev ? { ...prev, branch: e.target.value } : null)}
                                  className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text focus:outline-none focus:border-brand-blue"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Academic Year</label>
                                <select 
                                  value={editForm?.year || ''}
                                  onChange={(e) => setEditForm(prev => prev ? { ...prev, year: e.target.value } : null)}
                                  className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text focus:outline-none focus:border-brand-blue"
                                >
                                  <option value="1st Year">1st Year</option>
                                  <option value="2nd Year">2nd Year</option>
                                  <option value="3rd Year">3rd Year</option>
                                  <option value="4th Year">4th Year</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Current Semester</label>
                                <input 
                                  type="text"
                                  value={editForm?.semester || ''}
                                  onChange={(e) => setEditForm(prev => prev ? { ...prev, semester: e.target.value } : null)}
                                  className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text focus:outline-none focus:border-brand-blue"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Current CGPA (out of 10)</label>
                                <input 
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  max="10"
                                  value={editForm?.cgpa || ''}
                                  onChange={(e) => setEditForm(prev => prev ? { ...prev, cgpa: e.target.value } : null)}
                                  className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text focus:outline-none focus:border-brand-blue"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Placement status modifier */}
                      <div className="p-5 bg-app-surface/40 border border-app-border rounded-2xl space-y-4">
                        <h5 className="font-display font-black text-xs text-app-text uppercase tracking-widest border-b border-app-border/40 pb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-brand-blue" /> Placement Outcomes
                        </h5>
                        
                        {!isEditing ? (
                          <div className="space-y-3.5 text-xs font-semibold text-app-text">
                            <div className="flex justify-between items-center pb-2.5 border-b border-app-border/25">
                              <span className="text-app-muted font-bold uppercase tracking-wider text-[9px]">Placement Status</span>
                              <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-extrabold tracking-wide ${getStatusStyle(activeStudentDetail.status)}`}>
                                {activeStudentDetail.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-app-muted font-bold uppercase tracking-wider text-[9px]">Applications Logged</span>
                              <span className="font-bold text-app-text">{activeStudentDetail.applicationsCount ?? 6} active listings</span>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Placement Status</label>
                              <select 
                                value={editForm?.status || 'Eligible'}
                                onChange={(e) => setEditForm(prev => prev ? { ...prev, status: e.target.value } : null)}
                                className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text focus:outline-none focus:border-brand-blue font-bold"
                              >
                                <option value="Eligible">Eligible</option>
                                <option value="Placed">Placed</option>
                                <option value="Applied">Applied</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Under Review">Under Review</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Applications Count</label>
                              <input 
                                type="number"
                                value={editForm?.applicationsCount || ''}
                                onChange={(e) => setEditForm(prev => prev ? { ...prev, applicationsCount: e.target.value } : null)}
                                className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text focus:outline-none focus:border-brand-blue"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* TAB 2: PROJECTS & SKILLS */}
                  {activePanelTab === 'projects_skills' && (
                    <div className="space-y-6">
                      
                      {/* Skill tags list */}
                      <div className="p-5 bg-app-surface/40 border border-app-border rounded-2xl space-y-4">
                        <h5 className="font-display font-black text-xs text-app-text uppercase tracking-widest border-b border-app-border/40 pb-2 flex items-center gap-2">
                          <Award className="w-4 h-4 text-brand-blue" /> Verified Skill Stack
                        </h5>

                        {!isEditing ? (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {activeStudentDetail.skills.length > 0 ? (
                              activeStudentDetail.skills.map((sk) => (
                                <span key={sk} className="text-xs font-bold bg-app-bg border border-app-border px-3 py-1.5 rounded-xl text-app-text">
                                  {sk}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-app-muted italic">No skill tags registered on profile.</span>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2 text-xs font-semibold">
                            <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Skills (Comma-separated)</label>
                            <input 
                              type="text"
                              value={editForm?.skills || ''}
                              onChange={(e) => setEditForm(prev => prev ? { ...prev, skills: e.target.value } : null)}
                              placeholder="React, Java, SQL, Python"
                              className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text focus:outline-none focus:border-brand-blue font-semibold"
                            />
                            <span className="text-[10px] text-app-muted font-semibold block leading-normal">Enter multiple skills separated by commas to structure student competencies search indexing.</span>
                          </div>
                        )}
                      </div>

                      {/* Projects Interactive Manager */}
                      <div className="p-5 bg-app-surface/40 border border-app-border rounded-2xl space-y-4">
                        <h5 className="font-display font-black text-xs text-app-text uppercase tracking-widest border-b border-app-border/40 pb-2 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-brand-blue" /> Academic & Personal Projects
                        </h5>

                        {/* List of projects */}
                        <div className="space-y-3.5">
                          {isEditing ? (
                            // Edit mode: List projects with deletion buttons
                            editForm?.projects && editForm.projects.length > 0 ? (
                              editForm.projects.map((proj, idx) => (
                                <div key={idx} className="p-3 bg-app-bg border border-app-border rounded-xl flex items-start justify-between gap-4">
                                  <div className="space-y-1 text-xs">
                                    <div className="font-extrabold text-app-text flex items-center gap-1.5">
                                      {proj.title}
                                      {proj.link && (
                                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">
                                          <Globe className="w-3.5 h-3.5 inline" />
                                        </a>
                                      )}
                                    </div>
                                    <p className="text-app-muted font-semibold text-[11px] leading-relaxed">{proj.description}</p>
                                  </div>
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      const updated = [...editForm.projects];
                                      updated.splice(idx, 1);
                                      setEditForm({ ...editForm, projects: updated });
                                    }}
                                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all shrink-0"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-app-muted italic">No projects registered yet.</p>
                            )
                          ) : (
                            // Read-only view
                            activeStudentDetail.projects && activeStudentDetail.projects.length > 0 ? (
                              activeStudentDetail.projects.map((proj, idx) => (
                                <div key={idx} className="p-4 bg-app-bg/50 border border-app-border/40 rounded-xl space-y-1.5">
                                  <div className="flex justify-between items-center">
                                    <h6 className="font-extrabold text-xs text-app-text">{proj.title}</h6>
                                    {proj.link && (
                                      <a 
                                        href={proj.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-[10px] text-brand-blue hover:underline font-bold flex items-center gap-1 shrink-0"
                                      >
                                        <Globe className="w-3.5 h-3.5" /> Project Link
                                      </a>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-app-muted font-semibold leading-relaxed">{proj.description}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-app-muted italic">No projects logged on student profile.</p>
                            )
                          )}
                        </div>

                        {/* Interactive Project Adder Form (Visible ONLY in editing state) */}
                        {isEditing && (
                          <div className="p-4 bg-app-surface border border-brand-blue/20 rounded-xl space-y-3.5 mt-4">
                            <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest block">Add New Project Record</span>
                            <div className="space-y-3 text-xs font-semibold">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-app-muted uppercase tracking-wider">Project Title</label>
                                  <input 
                                    type="text"
                                    value={newProject.title}
                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    className="w-full bg-app-bg border border-app-border rounded-lg p-2 text-app-text focus:outline-none"
                                    placeholder="e.g. Distributed Database Grid"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-app-muted uppercase tracking-wider">Repository / Live Link</label>
                                  <input 
                                    type="text"
                                    value={newProject.link}
                                    onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                                    className="w-full bg-app-bg border border-app-border rounded-lg p-2 text-app-text focus:outline-none"
                                    placeholder="https://github.com/..."
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-app-muted uppercase tracking-wider">Brief Description</label>
                                <textarea 
                                  value={newProject.description}
                                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                  className="w-full bg-app-bg border border-app-border rounded-lg p-2 text-app-text focus:outline-none h-16 resize-none"
                                  placeholder="Describe the stack used, core outcomes, and team scale."
                                />
                              </div>
                              <button 
                                type="button"
                                onClick={() => {
                                  if (!newProject.title) {
                                    alert('Please specify a project title.');
                                    return;
                                  }
                                  if (editForm) {
                                    setEditForm({
                                      ...editForm,
                                      projects: [...editForm.projects, newProject]
                                    });
                                    setNewProject({ title: '', description: '', link: '' });
                                  }
                                }}
                                className="px-3.5 py-1.5 bg-brand-blue text-white font-extrabold text-[10px] uppercase rounded-lg hover:bg-brand-blue/90 flex items-center gap-1 transition-all"
                              >
                                <PlusCircle className="w-3.5 h-3.5" /> Append Project
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* TAB 3: DOCUMENTS & RESUME */}
                  {activePanelTab === 'documents' && (
                    <div className="space-y-6">
                      
                      {/* PDF Resume link details */}
                      <div className="p-5 bg-app-surface/40 border border-app-border rounded-2xl space-y-4">
                        <h5 className="font-display font-black text-xs text-app-text uppercase tracking-widest border-b border-app-border/40 pb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-brand-blue" /> Primary Placement Resume
                        </h5>

                        {!isEditing ? (
                          <div className="space-y-3">
                            <p className="text-xs text-app-muted font-semibold">The student has linked the following primary resume file for vetting and company submissions:</p>
                            {activeStudentDetail.resume ? (
                              <div className="flex items-center justify-between p-3 bg-app-bg border border-app-border rounded-xl">
                                <span className="text-xs font-semibold text-app-text truncate max-w-[340px]">{activeStudentDetail.resume}</span>
                                <a 
                                  href={activeStudentDetail.resume}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1.5 bg-brand-blue/15 hover:bg-brand-blue/20 border border-brand-blue/10 text-brand-blue text-[10px] uppercase font-extrabold rounded-lg transition-all flex items-center gap-1"
                                >
                                  View Resume
                                </a>
                              </div>
                            ) : (
                              <div className="p-3 bg-rose-500/5 border border-rose-500/10 text-rose-500/80 rounded-xl text-xs font-bold flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" /> No resume PDF has been uploaded by the student.
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1.5 text-xs font-semibold">
                            <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Resume Link (PDF / Drive URL)</label>
                            <input 
                              type="text"
                              value={editForm?.resume || ''}
                              onChange={(e) => setEditForm(prev => prev ? { ...prev, resume: e.target.value } : null)}
                              className="w-full bg-app-surface border border-app-border rounded-xl p-2.5 text-app-text focus:outline-none focus:border-brand-blue font-semibold"
                              placeholder="https://drive.google.com/..."
                            />
                          </div>
                        )}
                      </div>

                      {/* Other academic documents catalog */}
                      <div className="p-5 bg-app-surface/40 border border-app-border rounded-2xl space-y-4">
                        <h5 className="font-display font-black text-xs text-app-text uppercase tracking-widest border-b border-app-border/40 pb-2 flex items-center gap-2">
                          <LayoutGrid className="w-4 h-4 text-brand-blue" /> Verified Marks Cards & Certifications
                        </h5>

                        {/* List other documents */}
                        <div className="space-y-3.5">
                          {isEditing ? (
                            // Edit mode: List other documents with deletions
                            editForm?.documents && editForm.documents.length > 0 ? (
                              editForm.documents.map((docItem, idx) => (
                                <div key={idx} className="p-3 bg-app-bg border border-app-border rounded-xl flex items-center justify-between gap-4 text-xs font-semibold">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-app-muted shrink-0" />
                                    <div>
                                      <span className="font-extrabold text-app-text">{docItem.name}</span>
                                      <span className="text-[10px] text-app-muted font-semibold block truncate max-w-[280px]">{docItem.url}</span>
                                    </div>
                                  </div>
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      const updated = [...editForm.documents];
                                      updated.splice(idx, 1);
                                      setEditForm({ ...editForm, documents: updated });
                                    }}
                                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all shrink-0"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-app-muted italic">No external documents logged on registry.</p>
                            )
                          ) : (
                            // Read-only view
                            activeStudentDetail.documents && activeStudentDetail.documents.length > 0 ? (
                              activeStudentDetail.documents.map((docItem, idx) => (
                                <div key={idx} className="p-3.5 bg-app-bg/50 border border-app-border/40 rounded-xl flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-2.5">
                                    <FileText className="w-4 h-4 text-brand-blue shrink-0" />
                                    <div>
                                      <div className="text-xs font-extrabold text-app-text">{docItem.name}</div>
                                      <div className="text-[9px] text-app-muted font-bold truncate max-w-[220px] sm:max-w-[320px]">{docItem.url}</div>
                                    </div>
                                  </div>
                                  <a 
                                    href={docItem.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-[10px] text-brand-blue hover:underline font-extrabold uppercase shrink-0"
                                  >
                                    View Link
                                  </a>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-app-muted italic">No verified academic documents logged on profile registry.</p>
                            )
                          )}
                        </div>

                        {/* Interactive Doc Adder */}
                        {isEditing && (
                          <div className="p-4 bg-app-surface border border-brand-blue/20 rounded-xl space-y-3.5 mt-4 text-xs font-semibold">
                            <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest block">Append Verified Document</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-app-muted uppercase tracking-wider">Document Name</label>
                                <input 
                                  type="text"
                                  value={newDoc.name}
                                  onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                                  className="w-full bg-app-bg border border-app-border rounded-lg p-2 text-app-text focus:outline-none"
                                  placeholder="e.g. 12th Leaving Certificate"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-app-muted uppercase tracking-wider">Verified Document Link</label>
                                <input 
                                  type="text"
                                  value={newDoc.url}
                                  onChange={(e) => setNewDoc({ ...newDoc, url: e.target.value })}
                                  className="w-full bg-app-bg border border-app-border rounded-lg p-2 text-app-text focus:outline-none"
                                  placeholder="https://drive.google.com/..."
                                />
                              </div>
                            </div>
                            <button 
                              type="button"
                              onClick={() => {
                                if (!newDoc.name || !newDoc.url) {
                                  alert('Please specify name and link URL.');
                                  return;
                                }
                                if (editForm) {
                                  setEditForm({
                                    ...editForm,
                                    documents: [...editForm.documents, newDoc]
                                  });
                                  setNewDoc({ name: '', url: '' });
                                }
                              }}
                              className="px-3.5 py-1.5 bg-brand-blue text-white font-extrabold text-[10px] uppercase rounded-lg hover:bg-brand-blue/90 flex items-center gap-1 transition-all"
                            >
                              <PlusCircle className="w-3.5 h-3.5" /> Append Document
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* TAB 4: ACTIVITY TIMELINE */}
                  {activePanelTab === 'timeline' && (
                    <div className="space-y-6">
                      
                      {/* Verified Placement Activity History */}
                      <div className="p-5 bg-app-surface/40 border border-app-border rounded-2xl space-y-5">
                        <h5 className="font-display font-black text-xs text-app-text uppercase tracking-widest border-b border-app-border/40 pb-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-brand-blue" /> Verified Placement Activity Log
                        </h5>

                        {/* List timeline events in historical pattern */}
                        <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-app-border/70">
                          
                          {isEditing ? (
                            // Edit mode: Timeline with deletion
                            editForm?.activityTimeline && editForm.activityTimeline.length > 0 ? (
                              editForm.activityTimeline.map((item, idx) => (
                                <div key={idx} className="relative space-y-1 text-xs font-semibold">
                                  {/* Point */}
                                  <div className="absolute -left-[20px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-blue border-2 border-app-bg shrink-0" />
                                  <div className="flex justify-between items-start gap-4 p-2 bg-app-bg border border-app-border rounded-xl">
                                    <div className="space-y-1">
                                      <span className="text-[9px] font-bold text-app-muted tracking-wider block">{item.date}</span>
                                      <h6 className="font-extrabold text-app-text leading-tight">{item.title}</h6>
                                      <p className="text-[11px] text-app-muted leading-relaxed font-semibold">{item.description}</p>
                                    </div>
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        const updated = [...editForm.activityTimeline];
                                        updated.splice(idx, 1);
                                        setEditForm({ ...editForm, activityTimeline: updated });
                                      }}
                                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all shrink-0"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-app-muted italic">No timeline events logged.</p>
                            )
                          ) : (
                            // Read-only Timeline
                            activeStudentDetail.activityTimeline && activeStudentDetail.activityTimeline.length > 0 ? (
                              activeStudentDetail.activityTimeline.map((item, idx) => (
                                <div key={idx} className="relative space-y-1">
                                  {/* Point */}
                                  <div className="absolute -left-[20px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-blue border-2 border-app-bg" />
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] font-black text-app-muted uppercase tracking-widest block">{item.date}</span>
                                    <h6 className="text-xs font-extrabold text-app-text">{item.title}</h6>
                                    <p className="text-[11px] text-app-muted font-semibold leading-relaxed">{item.description}</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-xs text-app-muted italic py-2 pl-2">No activity events logged.</div>
                            )
                          )}
                        </div>

                        {/* Interactive Timeline Log Adder */}
                        {isEditing && (
                          <div className="p-4 bg-app-surface border border-brand-blue/20 rounded-xl space-y-3.5 mt-4 text-xs font-semibold">
                            <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest block">Log New Placement Event</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-app-muted uppercase tracking-wider">Event Date</label>
                                <input 
                                  type="date"
                                  value={newTimeline.date}
                                  onChange={(e) => setNewTimeline({ ...newTimeline, date: e.target.value })}
                                  className="w-full bg-app-bg border border-app-border rounded-lg p-2 text-app-text focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-app-muted uppercase tracking-wider">Event Title</label>
                                <input 
                                  type="text"
                                  value={newTimeline.title}
                                  onChange={(e) => setNewTimeline({ ...newTimeline, title: e.target.value })}
                                  className="w-full bg-app-bg border border-app-border rounded-lg p-2 text-app-text focus:outline-none"
                                  placeholder="e.g. Round 2 Vetting Cleared"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-app-muted uppercase tracking-wider">Event Description</label>
                              <textarea 
                                value={newTimeline.description}
                                onChange={(e) => setNewTimeline({ ...newTimeline, description: e.target.value })}
                                className="w-full bg-app-bg border border-app-border rounded-lg p-2 text-app-text focus:outline-none h-16 resize-none"
                                placeholder="Details about specific selection status, interviewer feedback, or job specs."
                              />
                            </div>
                            <button 
                              type="button"
                              onClick={() => {
                                if (!newTimeline.title || !newTimeline.description) {
                                  alert('Please fill out the title and description of the event.');
                                  return;
                                }
                                if (editForm) {
                                  setEditForm({
                                    ...editForm,
                                    activityTimeline: [...editForm.activityTimeline, newTimeline]
                                  });
                                  setNewTimeline({ date: new Date().toISOString().split('T')[0], title: '', description: '' });
                                }
                              }}
                              className="px-3.5 py-1.5 bg-brand-blue text-white font-extrabold text-[10px] uppercase rounded-lg hover:bg-brand-blue/90 flex items-center gap-1 transition-all"
                            >
                              <PlusCircle className="w-3.5 h-3.5" /> Log Event
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* Submit / Update button panel at bottom of scroll (visible ONLY during editing mode) */}
                  {isEditing && (
                    <div className="flex justify-end gap-3.5 pt-4 border-t border-app-border/40">
                      <button 
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-5 py-2.5 bg-app-surface text-app-text border border-app-border rounded-xl text-xs font-bold transition-all hover:bg-app-surface/90"
                      >
                        Discard Changes
                      </button>
                      <button 
                        type="submit"
                        className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-brand-blue/25 flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" /> Save Profile Updates
                      </button>
                    </div>
                  )}

                </form>

              </div>

              {/* View Only Banner / Security Stamp at bottom of panel */}
              <div className="p-5 border-t border-app-border bg-app-surface/40 text-center text-xs select-none">
                <p className="text-[10px] font-bold text-app-muted uppercase tracking-widest">
                  {isEditing ? 'Working on Secured Firestore Context Session' : 'Secured Read-Write Student Placement Record'}
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
