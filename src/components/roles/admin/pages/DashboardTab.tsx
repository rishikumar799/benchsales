import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Briefcase, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  TrendingUp, 
  ChevronRight,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  X,
  FileText
} from 'lucide-react';
import { db } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

interface DashboardTabProps {
  onNavigate: (tab: string) => void;
  onAddOfficer: () => void;
  onViewOfficer: (officer: any) => void;
}

export default function DashboardTab({ onNavigate, onAddOfficer, onViewOfficer }: DashboardTabProps) {
  const { userProfile } = useAuth();
  const organizationId = userProfile?.organizationId;

  // Real-time Firestore States
  const [profile, setProfile] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [officers, setOfficers] = useState<any[]>([]);
  const [departmentsList, setDepartmentsList] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [placements, setPlacements] = useState<any[]>([]);

  // UI state for Departments CRUD
  const [isManagingDepts, setIsManagingDepts] = useState(false);
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [deptNameInput, setDeptNameInput] = useState('');
  const [deptCodeInput, setDeptCodeInput] = useState('');
  const [deptCountInput, setDeptCountInput] = useState('100');

  // Loading/Ready checks
  const [isReady, setIsReady] = useState(false);

  // Firestore Realtime Listeners
  useEffect(() => {
    if (!organizationId) return;

    // 1. Listen to Profile
    const profileRef = doc(db, 'organizations_universities', organizationId);
    const unsubProfile = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) {
        setProfile(snap.data());
      }
    });

    // 2. Listen & Seed Departments
    const deptsCol = collection(db, 'organizations_universities', organizationId, 'departments');
    const unsubDepts = onSnapshot(deptsCol, (snap) => {
      if (snap.empty) {
        const defaultDepartments = [
          { id: '1', name: 'Computer Science', code: 'CSE', activeStudents: 1250, activeJobs: 12, percent: 26, color: 'bg-emerald-500' },
          { id: '2', name: 'Electronics & Communication', code: 'ECE', activeStudents: 980, activeJobs: 7, percent: 20, color: 'bg-blue-500' },
          { id: '3', name: 'Information Technology', code: 'IT', activeStudents: 760, activeJobs: 6, percent: 16, color: 'bg-brand-violet' },
          { id: '4', name: 'Business Administration', code: 'MBA', activeStudents: 540, activeJobs: 4, percent: 11, color: 'bg-amber-500' },
          { id: '5', name: 'Mechanical Engineering', code: 'ME', activeStudents: 460, activeJobs: 3, percent: 10, color: 'bg-pink-500' },
          { id: '6', name: 'Other Studies', code: 'Others', activeStudents: 836, activeJobs: 2, percent: 17, color: 'bg-gray-400' }
        ];
        defaultDepartments.forEach(async (dept) => {
          await setDoc(doc(deptsCol, dept.id), dept);
        });
      } else {
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDepartmentsList(list);
      }
    });

    // 3. Listen & Seed Students
    const studentsCol = collection(db, 'organizations_universities', organizationId, 'students');
    const unsubStudents = onSnapshot(studentsCol, (snap) => {
      if (snap.empty) {
        const defaultStudents = [
          { id: '1', name: 'Rahul Kumar', rollNumber: 'CS2026001', dept: 'CSE', batch: '2026', cgpa: 8.50, status: 'Placed', avatar: 'https://picsum.photos/seed/rahul/100/100', email: 'rahul.kumar@student.ssu.edu.in', phone: '+91 98165 43210', gender: 'Male', dob: '15 Mar 2004', skills: ['Java', 'Python', 'SQL', 'Data Structures', 'HTML', 'CSS', 'JavaScript', 'React.js'] },
          { id: '2', name: 'Anjali Sharma', rollNumber: 'EC2026005', dept: 'ECE', batch: '2026', cgpa: 8.10, status: 'Eligible', avatar: 'https://picsum.photos/seed/anjali/100/100', email: 'anjali.sharma@student.ssu.edu.in', phone: '+91 98165 43211', gender: 'Female', dob: '18 Aug 2004', skills: ['Embedded C', 'MATLAB', 'Python', 'Verilog', 'IoT'] },
          { id: '3', name: 'Vivek Singh', rollNumber: 'IT2026003', dept: 'IT', batch: '2026', cgpa: 7.90, status: 'Applied', avatar: 'https://picsum.photos/seed/vivek/100/100', email: 'vivek.singh@student.ssu.edu.in', phone: '+91 98165 43212', gender: 'Male', dob: '22 Jan 2004', skills: ['C++', 'SQL', 'OS', 'DBMS', 'Web Tech'] },
          { id: '4', name: 'Neha Mehta', rollNumber: 'CS2026064', dept: 'CSE', batch: '2026', cgpa: 8.70, status: 'Placed', avatar: 'https://picsum.photos/seed/nehap/100/100', email: 'neha.mehta@student.ssu.edu.in', phone: '+91 98165 43213', gender: 'Female', dob: '05 May 2004', skills: ['Java', 'Spring Boot', 'MongoDB', 'React', 'Docker'] },
          { id: '5', name: 'Arjun Patel', rollNumber: 'ME2026002', dept: 'Mechanical', batch: '2026', cgpa: 7.40, status: 'Under Review', avatar: 'https://picsum.photos/seed/arjun/100/100', email: 'arjun.patel@student.ssu.edu.in', phone: '+91 98165 43214', gender: 'Male', dob: '14 Oct 2003', skills: ['AutoCAD', 'SolidWorks', 'ANSYS', 'Thermodynamics'] },
          { id: '6', name: 'Pooja Verma', rollNumber: 'EC2026008', dept: 'ECE', batch: '2026', cgpa: 8.30, status: 'Eligible', avatar: 'https://picsum.photos/seed/pooja/100/100', email: 'pooja.verma@student.ssu.edu.in', phone: '+91 98165 43215', gender: 'Female', dob: '09 Nov 2004', skills: ['Verilog', 'Arduino', 'C Networking', 'Signal Systems'] },
          { id: '7', name: 'Rohit Jain', rollNumber: 'CS2026007', dept: 'CSE', batch: '2026', cgpa: 8.00, status: 'Placed', avatar: 'https://picsum.photos/seed/rohit123/100/100', email: 'rohit.jain@student.ssu.edu.in', phone: '+91 98165 43216', gender: 'Male', dob: '30 Dec 2003', skills: ['Node.js', 'Express', 'SQL', 'JavaScript', 'Git'] },
          { id: '8', name: 'Sneha Reddy', rollNumber: 'IT2026004', dept: 'IT', batch: '2026', cgpa: 8.20, status: 'Eligible', avatar: 'https://picsum.photos/seed/sneha/100/100', email: 'sneha.reddy@student.ssu.edu.in', phone: '+91 98165 43217', gender: 'Female', dob: '12 Jul 2004', skills: ['C++', 'Data Structures', 'Algorithms', 'Java', 'SQL'] }
        ];
        defaultStudents.forEach(async (stud) => {
          await setDoc(doc(studentsCol, stud.id), stud);
        });
      } else {
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(list);
      }
    });

    // 4. Listen & Seed Placement Officers
    const officersCol = collection(db, 'organizations_universities', organizationId, 'placement_officers');
    const unsubOfficers = onSnapshot(officersCol, (snap) => {
      if (snap.empty) {
        const defaultOfficers = [
          { id: 'off-1', name: 'Priya Sharma', fullName: 'Priya Sharma', dept: 'Training & Placement', department: 'Training & Placement', opportunities: 24, placements: 186, avatar: 'https://picsum.photos/seed/priyasharma/100/100', email: 'priya.sharma@sxu.edu.in', phone: '+91 98124 53210', designation: 'Placement Director', status: 'Active' },
          { id: 'off-2', name: 'Rahul Verma', fullName: 'Rahul Verma', dept: 'Placement Cell', department: 'Placement Cell', opportunities: 18, placements: 142, avatar: 'https://picsum.photos/seed/rahulv/100/100', email: 'rahul.verma@sxu.edu.in', phone: '+91 98124 53211', designation: 'Placement Officer', status: 'Active' },
          { id: 'off-3', name: 'Neha Patel', fullName: 'Neha Patel', dept: 'Placement Cell', department: 'Placement Cell', opportunities: 15, placements: 118, avatar: 'https://picsum.photos/seed/nehap/100/100', email: 'neha.patel@sxu.edu.in', phone: '+91 98124 53212', designation: 'Placement Associate', status: 'Active' }
        ];
        defaultOfficers.forEach(async (off) => {
          await setDoc(doc(officersCol, off.id), off);
        });
      } else {
        const list = snap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.fullName || data.name || '',
            fullName: data.fullName || data.name || '',
            dept: data.department || data.dept || '',
            department: data.department || data.dept || '',
            email: data.email || '',
            phone: data.phone || '',
            opportunities: data.opportunities || 0,
            placements: data.placements || 0,
            avatar: data.avatar || `https://picsum.photos/seed/${doc.id}/100/100`,
            status: data.status || 'Active',
            designation: data.designation || ''
          };
        });
        setOfficers(list);
      }
    });

    // 5. Listen & Seed Opportunities
    const oppsCol = collection(db, 'organizations_universities', organizationId, 'opportunities');
    const unsubOpps = onSnapshot(oppsCol, (snap) => {
      if (snap.empty) {
        const defaultOpportunities = [
          { id: '1', title: 'Software Engineer', company: 'TCS', officer: 'Priya Sharma', applicants: 124, status: 'Active', visibility: 'My University', pkg: '4.5 LPA' },
          { id: '2', title: 'System Engineer', company: 'Infosys', officer: 'Rahul Verma', applicants: 96, status: 'Active', visibility: 'My University', pkg: '4.0 LPA' },
          { id: '3', title: 'Associate Engineer', company: 'Wipro', officer: 'Priya Sharma', applicants: 82, status: 'Active', visibility: 'Selected Universities', pkg: '3.5 LPA' },
          { id: '4', title: 'Graduate Trainee', company: 'Accenture', officer: 'Neha Patel', applicants: 64, status: 'Active', visibility: 'All Universities', pkg: '4.2 LPA' },
          { id: '5', title: 'Data Analyst', company: 'Capgemini', officer: 'Amit Singh', applicants: 58, status: 'Inactive', visibility: 'My University', pkg: '4.3 LPA' },
          { id: '6', title: 'Business Analyst', company: 'Deloitte', officer: 'Kavita Joshi', applicants: 36, status: 'Closed', visibility: 'My University', pkg: '6.5 LPA' },
          { id: '7', title: 'SDE Intern', company: 'Microsoft', officer: 'Rahul Verma', applicants: 42, status: 'Active', visibility: 'All Universities', pkg: '12.0 LPA' },
          { id: '8', title: 'Cloud Engineer', company: 'Amazon', officer: 'Amit Singh', applicants: 30, status: 'Active', visibility: 'Selected Universities', pkg: '15.0 LPA' }
        ];
        defaultOpportunities.forEach(async (opp) => {
          await setDoc(doc(oppsCol, opp.id), opp);
        });
      } else {
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOpportunities(list);
      }
    });

    // 6. Listen & Seed Placements
    const placementsCol = collection(db, 'organizations_universities', organizationId, 'placements');
    const unsubPlacements = onSnapshot(placementsCol, (snap) => {
      if (snap.empty) {
        const defaultPlacements = [
          { id: '1', student: 'Rahul Kumar', avatar: 'https://picsum.photos/seed/rahul/100/100', company: 'TCS', role: 'Software Engineer', pkg: '7.00 LPA', officer: 'Priya Sharma', joiningDate: '15 Jul 2026', status: 'Confirmed', dept: 'CSE' },
          { id: '2', student: 'Anjali Sharma', avatar: 'https://picsum.photos/seed/anjali/100/100', company: 'Infosys', role: 'System Engineer', pkg: '6.50 LPA', officer: 'Rahul Verma', joiningDate: '10 Jul 2026', status: 'Confirmed', dept: 'ECE' },
          { id: '3', student: 'Vivek Singh', avatar: 'https://picsum.photos/seed/vivek/100/100', company: 'Wipro', role: 'Associate Engineer', pkg: '5.80 LPA', officer: 'Neha Patel', joiningDate: '20 Jul 2026', status: 'Confirmed', dept: 'CSE' },
          { id: '4', student: 'Pooja Verma', avatar: 'https://picsum.photos/seed/pooja/100/100', company: 'Accenture', role: 'Data Analyst', pkg: '7.90 LPA', officer: 'Amit Singh', joiningDate: '12 Jul 2026', status: 'Confirmed', dept: 'ECE' },
          { id: '5', student: 'Neha Mehta', avatar: 'https://picsum.photos/seed/nehap/100/100', company: 'Capgemini', role: 'Analyst', pkg: '6.00 LPA', officer: 'Kavita Joshi', joiningDate: '18 Jul 2026', status: 'Confirmed', dept: 'CSE' },
          { id: '6', student: 'Arjun Patel', avatar: 'https://picsum.photos/seed/arjun/100/100', company: 'TCS', role: 'Software Engineer', pkg: '8.50 LPA', officer: 'Priya Sharma', joiningDate: '15 Jul 2026', status: 'Confirmed', dept: 'ME' },
          { id: '7', student: 'Rohit Jain', avatar: 'https://picsum.photos/seed/rohit123/100/100', company: 'Amazon', role: 'SDE', pkg: '12.00 LPA', officer: 'Amit Singh', joiningDate: '01 Aug 2026', status: 'Confirmed', dept: 'CSE' }
        ];
        defaultPlacements.forEach(async (p) => {
          await setDoc(doc(placementsCol, p.id), p);
        });
      } else {
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlacements(list);
      }
    });

    setIsReady(true);

    return () => {
      unsubProfile();
      unsubDepts();
      unsubStudents();
      unsubOfficers();
      unsubOpps();
      unsubPlacements();
    };
  }, [organizationId]);

  // Compute stats dynamically
  const totalStudentsCount = students.length || 4826;
  const placementOfficersCount = officers.length || 12;
  const activeOpportunitiesCount = opportunities.filter(o => o.status === 'Active').length || 48;
  const totalPlacedCount = placements.length || 1268;

  // Placement Rate
  const placementRate = Math.round((totalPlacedCount / (totalStudentsCount || 1)) * 100) || 78;

  // Highest & Average packages
  const packageValues = placements.map(p => {
    const parsed = parseFloat(p.pkg || p.package || '0');
    return isNaN(parsed) ? 0 : parsed;
  }).filter(v => v > 0);

  const highestPackageVal = packageValues.length ? Math.max(...packageValues) : 18.0;
  const averagePackageVal = packageValues.length ? parseFloat((packageValues.reduce((sum, v) => sum + v, 0) / packageValues.length).toFixed(1)) : 6.8;

  // Department Distribution calculation
  const calculatedDepts = departmentsList.map(dept => {
    // Count real students belonging to this department code or name
    const studentCount = students.filter(s => s.dept?.toUpperCase() === dept.code?.toUpperCase() || s.dept?.toLowerCase() === dept.name?.toLowerCase()).length;
    // Fallback to activeStudents if 0 students added yet
    const finalCount = studentCount || dept.activeStudents || 0;
    return {
      ...dept,
      count: finalCount
    };
  });

  const grandTotalDepts = calculatedDepts.reduce((sum, d) => sum + d.count, 0) || totalStudentsCount;
  const finalDepts = calculatedDepts.map(d => ({
    ...d,
    percent: Math.round((d.count / (grandTotalDepts || 1)) * 100) || d.percent || 10
  }));

  // Create Department
  const handleCreateDept = async () => {
    if (!deptNameInput || !deptCodeInput || !organizationId) return;
    const deptsCol = collection(db, 'organizations_universities', organizationId, 'departments');
    const newId = String(Date.now());
    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-brand-violet', 'bg-amber-500', 'bg-pink-500', 'bg-indigo-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    await setDoc(doc(deptsCol, newId), {
      id: newId,
      name: deptNameInput,
      code: deptCodeInput.toUpperCase(),
      activeStudents: parseInt(deptCountInput) || 100,
      activeJobs: 0,
      percent: 10,
      color: randomColor
    });

    setDeptNameInput('');
    setDeptCodeInput('');
    setDeptCountInput('100');
    setEditingDeptId(null);
  };

  // Update Department
  const handleUpdateDept = async (id: string) => {
    if (!deptNameInput || !deptCodeInput || !organizationId) return;
    const deptRef = doc(db, 'organizations_universities', organizationId, 'departments', id);
    await updateDoc(deptRef, {
      name: deptNameInput,
      code: deptCodeInput.toUpperCase(),
      activeStudents: parseInt(deptCountInput) || 100
    });

    setDeptNameInput('');
    setDeptCodeInput('');
    setDeptCountInput('100');
    setEditingDeptId(null);
  };

  // Delete Department
  const handleDeleteDept = async (id: string) => {
    if (!organizationId) return;
    if (confirm('Are you sure you want to delete this department? This will remove it from the placement cell system.')) {
      const deptRef = doc(db, 'organizations_universities', organizationId, 'departments', id);
      await deleteDoc(deptRef);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section with welcome, date, and CTA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-app-text tracking-tight">Dashboard</h2>
          <p className="text-sm text-app-muted font-semibold mt-1">
            Welcome back, <span className="text-brand-blue">{profile?.adminName || 'Dr. Sandeep Jain'}!</span> Here's the overview of <span className="text-app-text font-bold">{profile?.organizationName || "St. Xavier's University"}</span> placement ecosystem.
          </p>
        </div>
        <button 
          onClick={onAddOfficer}
          className="px-5 py-3 rounded-2xl bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-brand-blue/20 transition-all cursor-pointer"
        >
          <Users className="w-4 h-4" />
          Add Placement Officer
        </button>
      </div>

      {/* Main KPI metrics bento cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: totalStudentsCount.toLocaleString(), detail: `+120 this month`, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Placement Officers', value: placementOfficersCount.toString(), detail: 'Active Officers', icon: UserCheck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active Opportunities', value: activeOpportunitiesCount.toString(), detail: '+6 this week', icon: Briefcase, color: 'text-brand-violet', bg: 'bg-brand-violet/10' },
          { label: 'Students Placed', value: totalPlacedCount.toLocaleString(), detail: `+85 this month`, icon: ShieldCheck, color: 'text-pink-500', bg: 'bg-pink-500/10' },
        ].map((kpi, idx) => (
          <div key={idx} className="p-6 rounded-[32px] bg-app-surface/60 border border-app-border flex flex-col justify-between hover:border-app-border/80 transition-all hover:bg-app-surface/80 card-shadow h-44">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-app-muted">{kpi.label}</span>
              <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-display font-black text-app-text">{kpi.value}</div>
              <div className="text-xs font-bold text-app-muted mt-1.5 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>{kpi.detail}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Grid: Placement Officer Overview & Department Pie-like view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Officer Overview */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-[32px] bg-app-surface/60 border border-app-border hover:border-app-border/80 transition-all card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-display font-black text-app-text">Placement Officer Overview</h3>
                <p className="text-xs text-app-muted font-bold mt-0.5">Top performing departmental career coordinates</p>
              </div>
              <button 
                onClick={() => onNavigate('placement_officers')}
                className="text-xs font-extrabold text-brand-blue hover:text-brand-blue/80 flex items-center gap-1 transition-all"
              >
                View All Officers <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-app-border text-left text-[10px] font-bold uppercase tracking-wider text-app-muted h-10">
                    <th className="pb-3">Officer</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3 text-center">Opportunities</th>
                    <th className="pb-3 text-center">Placements</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border">
                  {officers.slice(0, 3).map((off, idx) => (
                    <tr key={idx} className="group hover:bg-app-surface/40 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={off.avatar} 
                            alt={off.name} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-app-bg shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="text-sm font-extrabold text-app-text leading-snug group-hover:text-brand-blue transition-colors">{off.name}</div>
                            <div className="text-[10px] text-app-muted font-bold mt-0.5">{profile?.organizationName || "St. Xavier's University"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-xs font-extrabold text-app-text bg-app-bg px-3 py-1.5 rounded-lg border border-app-border">{off.dept}</span>
                      </td>
                      <td className="py-4 text-center">
                        <span className="text-sm font-black text-brand-violet">{off.opportunities}</span>
                      </td>
                      <td className="py-4 text-center">
                        <span className="text-sm font-black text-emerald-500">{off.placements}</span>
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => onViewOfficer(off)}
                          className="px-3 py-1.5 text-[11px] font-extrabold text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-all"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Department chart with REALTIME CRUD */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-[32px] bg-app-surface/60 border border-app-border hover:border-app-border/80 transition-all card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-display font-black text-app-text">Departments</h3>
                <p className="text-xs text-app-muted font-bold mt-0.5">Live career cells and student counts</p>
              </div>
              <button 
                onClick={() => setIsManagingDepts(true)}
                className="px-2.5 py-1 text-[10px] bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue font-extrabold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="flex justify-center items-center py-4 relative mb-4">
              <div className="w-36 h-36 rounded-full border-12 border-emerald-500 flex flex-col justify-center items-center relative">
                <div className="absolute inset-0 w-36 h-36 rounded-full border-12 border-blue-500 border-t-transparent border-r-transparent -rotate-45" />
                <div className="absolute inset-0 w-36 h-36 rounded-full border-12 border-brand-violet border-t-transparent border-r-transparent border-l-transparent rotate-90" />
                <div className="text-center z-10">
                  <div className="text-2xl font-black text-app-text">{grandTotalDepts.toLocaleString()}</div>
                  <div className="text-[9px] font-extrabold text-app-muted uppercase tracking-wider">In Cells</div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4 max-h-[180px] overflow-y-auto pr-1">
              {finalDepts.map((dept, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 font-bold text-app-muted">
                    <span className={`w-2.5 h-2.5 rounded-full ${dept.color || 'bg-gray-400'}`} />
                    <span>{dept.name} ({dept.code})</span>
                  </div>
                  <div className="flex items-center gap-3 font-extrabold">
                    <span className="text-app-text">{dept.count.toLocaleString()}</span>
                    <span className="text-app-muted text-[10px]">({dept.percent}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => onNavigate('reports')}
            className="w-full text-center py-2.5 mt-4 text-xs font-bold text-app-muted hover:text-brand-blue border-t border-app-border/50 pt-4 flex justify-between items-center transition-colors"
          >
            <span>View Detailed Reports</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Grid: Recent Placements & University Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Placements Activity list */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-[32px] bg-app-surface/60 border border-app-border hover:border-app-border/80 transition-all card-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-display font-black text-app-text">Recent Placement Activity</h3>
              <p className="text-xs text-app-muted font-bold mt-0.5">Live records of students graduating in 2026</p>
            </div>
            <button 
              onClick={() => onNavigate('placements')}
              className="text-xs font-extrabold text-brand-blue hover:text-brand-blue/80 flex items-center gap-1 transition-all"
            >
              View All Placements <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {placements.slice(0, 4).map((rp, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-2xl bg-app-bg border border-app-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-brand-blue/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={rp.avatar} 
                    alt={rp.student} 
                    className="w-10 h-10 rounded-full object-cover border border-app-border shrink-0" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-sm font-extrabold text-app-text leading-tight">{rp.student}</div>
                    <div className="text-[10px] text-app-muted font-bold mt-0.5">Department: <span className="text-brand-blue">{rp.dept || rp.department || 'CSE'}</span> | 2026 Batch</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-bold text-app-muted">Placed at</span>
                    <div className="text-sm font-black text-app-text">{rp.company}</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-extrabold text-center min-w-[70px]">
                    {rp.pkg || rp.package || '4.5 LPA'}
                  </div>
                  <span className="text-[10px] text-app-muted font-bold px-2 py-1 bg-app-surface border border-app-border rounded-md">
                    {rp.joiningDate || rp.time || '15 Jul 2026'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* University Statistics with verified badge */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-[32px] bg-app-surface/60 border border-app-border hover:border-app-border/80 transition-all card-shadow flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-display font-black text-app-text">University Statistics</h3>
              <p className="text-xs text-app-muted font-bold mt-0.5">Accumulated metrics of {profile?.organizationName || "St. Xavier's University"}</p>
            </div>

            <div className="space-y-4">
              {/* Placement rate info */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-app-muted">Placement Rate</span>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-500">{placementRate}%</span>
                    <span className="text-[9px] font-extrabold text-emerald-500 block">+4% this month</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-app-bg border border-app-border rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${placementRate}%` }} />
                </div>
              </div>

              {/* Highest Package */}
              <div className="p-4 rounded-2xl bg-brand-violet/5 border border-brand-violet/15 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-app-muted">Highest Package</span>
                  <div className="text-lg font-display font-black text-brand-violet mt-0.5">{highestPackageVal.toFixed(1)} LPA</div>
                </div>
                <span className="text-[9px] font-bold text-brand-violet bg-brand-violet/10 px-2 py-1 rounded-md">
                  Offered
                </span>
              </div>

              {/* Average Package */}
              <div className="p-4 rounded-2xl bg-brand-blue/5 border border-brand-blue/15 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-app-muted">Average Package</span>
                  <div className="text-lg font-display font-black text-brand-blue mt-0.5">{averagePackageVal.toFixed(1)} LPA</div>
                </div>
                <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                  +0.6 LPA this month
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-black text-emerald-500 leading-tight">Central placement Portal verified</div>
              <p className="text-[10px] text-emerald-500/80 font-bold mt-0.5">2026 Graduating Batch secure records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Manager Modal */}
      <AnimatePresence>
        {isManagingDepts && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-app-bg border border-app-border rounded-[32px] w-full max-w-lg overflow-hidden card-shadow max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-app-border flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-display font-black text-app-text">Manage Departments</h3>
                  <p className="text-xs text-app-muted font-bold">Add, edit, or delete institutional career cells</p>
                </div>
                <button 
                  onClick={() => {
                    setIsManagingDepts(false);
                    setEditingDeptId(null);
                    setDeptNameInput('');
                    setDeptCodeInput('');
                  }}
                  className="p-2 border border-app-border rounded-xl hover:bg-app-surface text-app-muted hover:text-app-text transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body & Forms */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Inline form to Add/Edit */}
                <div className="p-4 rounded-2xl bg-app-surface/50 border border-app-border space-y-3">
                  <h4 className="text-xs font-black text-app-text uppercase tracking-widest">
                    {editingDeptId ? 'Edit Department Cells' : 'Add New Department Cell'}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-app-muted uppercase">Dept Code</label>
                      <input 
                        type="text"
                        placeholder="e.g. CSE"
                        value={deptCodeInput}
                        onChange={(e) => setDeptCodeInput(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-app-muted uppercase">Students Count</label>
                      <input 
                        type="number"
                        placeholder="e.g. 150"
                        value={deptCountInput}
                        onChange={(e) => setDeptCountInput(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-app-muted uppercase">Dept Full Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Computer Science Engineering"
                      value={deptNameInput}
                      onChange={(e) => setDeptNameInput(e.target.value)}
                      className="w-full bg-app-bg border border-app-border rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2">
                    {editingDeptId && (
                      <button 
                        onClick={() => {
                          setEditingDeptId(null);
                          setDeptNameInput('');
                          setDeptCodeInput('');
                          setDeptCountInput('100');
                        }}
                        className="px-3 py-1.5 border border-app-border rounded-lg text-xs font-bold text-app-muted hover:bg-app-bg"
                      >
                        Cancel
                      </button>
                    )}
                    <button 
                      onClick={() => editingDeptId ? handleUpdateDept(editingDeptId) : handleCreateDept()}
                      disabled={!deptNameInput || !deptCodeInput}
                      className="px-4 py-1.5 bg-brand-blue text-white rounded-lg text-xs font-extrabold hover:bg-brand-blue/90 disabled:opacity-40 transition-all cursor-pointer"
                    >
                      {editingDeptId ? 'Save Changes' : 'Create Department'}
                    </button>
                  </div>
                </div>

                {/* List of current Departments */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-app-text uppercase tracking-widest">Active Departments ({finalDepts.length})</h4>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {finalDepts.map((d) => (
                      <div key={d.id} className="p-3 bg-app-surface/30 border border-app-border rounded-xl flex justify-between items-center">
                        <div>
                          <div className="text-xs font-black text-app-text">{d.name}</div>
                          <span className="text-[10px] text-app-muted font-bold">{d.code} • {d.count} candidates</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => {
                              setEditingDeptId(d.id);
                              setDeptNameInput(d.name || '');
                              setDeptCodeInput(d.code || '');
                              setDeptCountInput(String(d.count || d.activeStudents || 100));
                            }}
                            className="p-1.5 text-app-muted hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteDept(d.id)}
                            className="p-1.5 text-app-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
