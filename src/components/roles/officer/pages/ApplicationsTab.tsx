import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  Search, 
  MapPin, 
  Briefcase, 
  Eye, 
  Calendar, 
  Download,
  Building2,
  ChevronRight,
  GraduationCap,
  Clock,
  User,
  CheckCircle2,
  X,
  FileText,
  AlertCircle,
  Plus,
  Bookmark
} from 'lucide-react';
import { collection, doc, onSnapshot, getDocs, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';

interface ApplicationTimelineItem {
  status: string;
  timestamp: string;
  remarks?: string;
}

interface ApplicationDoc {
  applicationId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentDepartment: string;
  studentBranch: string;
  studentYear: string;
  studentCgpa: number;
  opportunityId: string;
  opportunityTitle: string;
  companyId: string;
  companyName: string;
  placementOfficerUid: string;
  status: 'applied' | 'under_review' | 'shortlisted' | 'interview' | 'selected' | 'rejected' | 'placed';
  timeline: ApplicationTimelineItem[];
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export default function ApplicationsTab() {
  const { userProfile } = useAuth();
  const organizationId = userProfile?.organizationId || 'default_university';
  const officerUid = auth.currentUser?.uid || 'system_officer';

  const [applications, setApplications] = useState<ApplicationDoc[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filtering States
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Drawer / Detail state
  const [selectedApp, setSelectedApp] = useState<ApplicationDoc | null>(null);
  
  // Status & Remarks update form state
  const [editStatus, setEditStatus] = useState<ApplicationDoc['status']>('applied');
  const [editRemarks, setEditRemarks] = useState('');

  // Demo application creator state
  const [isCreateDemoOpen, setIsCreateDemoOpen] = useState(false);
  const [demoStudentName, setDemoStudentName] = useState('');
  const [demoStudentEmail, setDemoStudentEmail] = useState('');
  const [demoStudentDept, setDemoStudentDept] = useState('CSE');
  const [demoStudentCgpa, setDemoStudentCgpa] = useState('8.5');
  const [demoCompanyName, setDemoCompanyName] = useState('Google');
  const [demoJobTitle, setDemoJobTitle] = useState('Software Engineer');

  // Status Style utilities
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'under_review':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'shortlisted':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'interview':
        return 'bg-violet-500/10 text-violet-500 border border-violet-500/20';
      case 'selected':
        return 'bg-green-500/10 text-green-500 border border-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'placed':
        return 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'applied': return 'Applied';
      case 'under_review': return 'Under Review';
      case 'shortlisted': return 'Shortlisted';
      case 'interview': return 'Interview Scheduled';
      case 'selected': return 'Selected';
      case 'rejected': return 'Rejected';
      case 'placed': return 'Placed';
      default: return status;
    }
  };

  // Real-time listen & initial seed
  useEffect(() => {
    if (!organizationId) return;

    const colRef = collection(db, 'organizations_universities', organizationId, 'applications');
    let unsubscribe: (() => void) | undefined;

    const setupListener = async () => {
      try {
        const snapshot = await getDocs(colRef);
        if (snapshot.empty) {
          // Seed initial placement drive applications for campus students
          const initialApps: ApplicationDoc[] = [
            {
              applicationId: 'app_seed_1',
              studentId: 'student_101',
              studentName: 'Rahul Kumar',
              studentEmail: 'rahul.kumar@university.edu',
              studentDepartment: 'CSE',
              studentBranch: 'CSE',
              studentYear: '2026',
              studentCgpa: 8.8,
              opportunityId: 'opp_1',
              opportunityTitle: 'Software Engineer',
              companyId: 'company_tcs',
              companyName: 'TCS',
              placementOfficerUid: officerUid,
              status: 'interview',
              timeline: [
                { status: 'applied', timestamp: '2026-05-10T09:00:00Z', remarks: 'Application submitted successfully.' },
                { status: 'under_review', timestamp: '2026-05-12T14:30:00Z', remarks: 'Academic criteria and CGPA checked.' },
                { status: 'shortlisted', timestamp: '2026-05-14T11:00:00Z', remarks: 'Cleared primary technical assessment round.' },
                { status: 'interview', timestamp: '2026-05-16T16:00:00Z', remarks: 'Technical interview scheduled for June 18th.' }
              ],
              remarks: 'Student cleared coding assessment with 100% score.',
              createdAt: '2026-05-10T09:00:00Z',
              updatedAt: '2026-05-16T16:00:00Z'
            },
            {
              applicationId: 'app_seed_2',
              studentId: 'student_102',
              studentName: 'Anjali Sharma',
              studentEmail: 'anjali.sharma@university.edu',
              studentDepartment: 'ECE',
              studentBranch: 'ECE',
              studentYear: '2026',
              studentCgpa: 7.9,
              opportunityId: 'opp_2',
              opportunityTitle: 'System Engineer',
              companyId: 'company_infosys',
              companyName: 'Infosys',
              placementOfficerUid: officerUid,
              status: 'shortlisted',
              timeline: [
                { status: 'applied', timestamp: '2026-05-09T10:15:00Z', remarks: 'Applied via company portal.' },
                { status: 'under_review', timestamp: '2026-05-11T12:00:00Z', remarks: 'Profile is being evaluated.' },
                { status: 'shortlisted', timestamp: '2026-05-13T15:45:00Z', remarks: 'Shortlisted for online aptitude drive.' }
              ],
              remarks: 'Strong interest in hardware-software co-design.',
              createdAt: '2026-05-09T10:15:00Z',
              updatedAt: '2026-05-13T15:45:00Z'
            },
            {
              applicationId: 'app_seed_3',
              studentId: 'student_103',
              studentName: 'Vikram Patel',
              studentEmail: 'vikram.patel@university.edu',
              studentDepartment: 'IT',
              studentBranch: 'IT',
              studentYear: '2026',
              studentCgpa: 6.8,
              opportunityId: 'opp_3',
              opportunityTitle: 'Associate Engineer',
              companyId: 'company_wipro',
              companyName: 'Wipro',
              placementOfficerUid: officerUid,
              status: 'under_review',
              timeline: [
                { status: 'applied', timestamp: '2026-05-08T11:30:00Z', remarks: 'Form submitted.' },
                { status: 'under_review', timestamp: '2026-05-10T14:00:00Z', remarks: 'Documents sent to HR panel.' }
              ],
              remarks: 'Average performance, but strong projects portfolio.',
              createdAt: '2026-05-08T11:30:00Z',
              updatedAt: '2026-05-10T14:00:00Z'
            },
            {
              applicationId: 'app_seed_4',
              studentId: 'student_104',
              studentName: 'Neha Singh',
              studentEmail: 'neha.singh@university.edu',
              studentDepartment: 'CSE',
              studentBranch: 'CSE',
              studentYear: '2026',
              studentCgpa: 9.1,
              opportunityId: 'opp_1',
              opportunityTitle: 'Software Engineer',
              companyId: 'company_tcs',
              companyName: 'TCS',
              placementOfficerUid: officerUid,
              status: 'applied',
              timeline: [
                { status: 'applied', timestamp: '2026-05-07T08:45:00Z', remarks: 'Application submitted.' }
              ],
              remarks: 'Outstanding profile, high CGPA candidate.',
              createdAt: '2026-05-07T08:45:00Z',
              updatedAt: '2026-05-07T08:45:00Z'
            }
          ];

          for (const app of initialApps) {
            await setDoc(doc(colRef, app.applicationId), app);
          }
        }
      } catch (err) {
        console.error('Error seeding initial applications:', err);
      }

      unsubscribe = onSnapshot(colRef, (snapshot) => {
        const list: ApplicationDoc[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as ApplicationDoc);
        });
        setApplications(list);
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, `organizations_universities/${organizationId}/applications`);
      });
    };

    setupListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [organizationId, officerUid]);

  // Handle Review application selection
  const handleSelectApp = (app: ApplicationDoc) => {
    setSelectedApp(app);
    setEditStatus(app.status);
    setEditRemarks(app.remarks || '');
  };

  // Submit Application Status / Remarks update (using updateDoc())
  const handleUpdateApplication = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      const updatedTimeline = [...(selectedApp.timeline || [])];
      
      // If the status has changed, append a timeline record
      if (selectedApp.status !== editStatus) {
        updatedTimeline.push({
          status: editStatus,
          timestamp: new Date().toISOString(),
          remarks: `Status updated by Placement Officer to: ${getStatusLabel(editStatus)}. Remarks: ${editRemarks || 'None'}`
        });
      }

      const docRef = doc(db, 'organizations_universities', organizationId, 'applications', selectedApp.applicationId);
      await updateDoc(docRef, {
        status: editStatus,
        remarks: editRemarks,
        timeline: updatedTimeline,
        updatedAt: new Date().toISOString()
      });

      // If status is updated to 'placed', create or update the corresponding placement document
      if (editStatus === 'placed') {
        const placementId = 'placement_' + selectedApp.applicationId;
        const placementRef = doc(db, 'organizations_universities', organizationId, 'placements', placementId);
        
        let calculatedPackage = '4.5 LPA';
        try {
          const oppRef = doc(db, 'organizations_universities', organizationId, 'opportunities', selectedApp.opportunityId);
          const oppSnap = await getDoc(oppRef);
          if (oppSnap.exists()) {
            const data = oppSnap.data();
            calculatedPackage = data.salary || data.package || '4.5 LPA';
          }
        } catch (oppErr) {
          console.error('Failed to fetch opportunity package, using default:', oppErr);
        }

        let existingCreatedAt = new Date().toISOString();
        try {
          const placementSnap = await getDoc(placementRef);
          if (placementSnap.exists()) {
            existingCreatedAt = placementSnap.data().createdAt || existingCreatedAt;
          }
        } catch (snapErr) {
          console.error('Failed to check existing placement document:', snapErr);
        }

        const placementDoc = {
          placementId,
          studentId: selectedApp.studentId || 'unknown_student',
          studentName: selectedApp.studentName || 'Unknown Student',
          studentEmail: selectedApp.studentEmail || '',
          department: selectedApp.studentDepartment || selectedApp.studentBranch || 'General',
          branch: selectedApp.studentBranch || selectedApp.studentDepartment || 'General',
          cgpa: Number(selectedApp.studentCgpa) || 0.0,
          opportunityId: selectedApp.opportunityId || 'unknown_opp',
          opportunityTitle: selectedApp.opportunityTitle || 'Unknown Role',
          companyId: selectedApp.companyId || 'unknown_company',
          companyName: selectedApp.companyName || 'Unknown Company',
          package: calculatedPackage,
          joiningDate: '2026-07-15',
          placementOfficerUid: officerUid,
          applicationId: selectedApp.applicationId,
          status: 'Confirmed',
          offerStatus: 'Released',
          remarks: editRemarks || 'Placed via placement cell workflow.',
          createdAt: existingCreatedAt,
          updatedAt: new Date().toISOString()
        };

        await setDoc(placementRef, placementDoc, { merge: true });
      }

      // Update state local copy
      const nextDoc: ApplicationDoc = {
        ...selectedApp,
        status: editStatus,
        remarks: editRemarks,
        timeline: updatedTimeline,
        updatedAt: new Date().toISOString()
      };
      setSelectedApp(nextDoc);
      alert('Application status, remarks, and audit timeline successfully synchronized to Firestore!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `organizations_universities/${organizationId}/applications/${selectedApp.applicationId}`);
    }
  };

  // Create demo application (Never create duplicate documents)
  const handleCreateDemoApp = async (e: FormEvent) => {
    e.preventDefault();
    if (!demoStudentName || !demoStudentEmail || !demoCompanyName || !demoJobTitle) {
      alert('Please fill out all mandatory fields.');
      return;
    }

    try {
      // Prevent duplicate documents for the same student applying to the same job
      const duplicate = applications.find(
        (app) => 
          app.studentEmail.toLowerCase() === demoStudentEmail.toLowerCase() &&
          app.opportunityTitle.toLowerCase() === demoJobTitle.toLowerCase() &&
          app.companyName.toLowerCase() === demoCompanyName.toLowerCase()
      );

      if (duplicate) {
        alert(`Duplicate prevented! An application for student "${demoStudentName}" for "${demoJobTitle}" at "${demoCompanyName}" already exists.`);
        return;
      }

      const appId = 'app_' + Date.now();
      const newApp: ApplicationDoc = {
        applicationId: appId,
        studentId: 'student_demo_' + Date.now().toString().slice(-4),
        studentName: demoStudentName,
        studentEmail: demoStudentEmail,
        studentDepartment: demoStudentDept,
        studentBranch: demoStudentDept,
        studentYear: '2026',
        studentCgpa: parseFloat(demoStudentCgpa) || 8.0,
        opportunityId: 'opp_demo_' + Date.now().toString().slice(-4),
        opportunityTitle: demoJobTitle,
        companyId: demoCompanyName.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        companyName: demoCompanyName,
        placementOfficerUid: officerUid,
        status: 'applied',
        timeline: [
          { status: 'applied', timestamp: new Date().toISOString(), remarks: 'Application registered in placement cell.' }
        ],
        remarks: 'Direct referral application created for placement assessment.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'organizations_universities', organizationId, 'applications', appId), newApp);
      setIsCreateDemoOpen(false);
      setDemoStudentName('');
      setDemoStudentEmail('');
      setDemoStudentCgpa('8.5');
      alert('Demo student application successfully generated and persisted in Firestore!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `organizations_universities/${organizationId}/applications`);
    }
  };

  // Real-time counters
  const totalAppsCount = applications.length;
  const appliedCount = applications.filter(a => a.status === 'applied').length;
  const reviewCount = applications.filter(a => a.status === 'under_review').length;
  const shortlistedCount = applications.filter(a => a.status === 'shortlisted').length;
  const interviewCount = applications.filter(a => a.status === 'interview').length;
  const selectedCount = applications.filter(a => a.status === 'selected' || a.status === 'placed').length;

  // Search, Filter & Sort logic
  const filteredApps = applications.filter((app) => {
    const studentNameVal = app.studentName || '';
    const companyNameVal = app.companyName || '';
    const jobTitleVal = app.opportunityTitle || '';
    const deptVal = app.studentDepartment || '';

    const matchesSearch = 
      studentNameVal.toLowerCase().includes(search.toLowerCase()) || 
      companyNameVal.toLowerCase().includes(search.toLowerCase()) ||
      jobTitleVal.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = activeFilter === 'All' || app.status === activeFilter;
    const matchesDept = deptFilter === 'All' || deptVal === deptFilter;

    return matchesSearch && matchesFilter && matchesDept;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    }
    if (sortBy === 'cgpa') {
      return (b.studentCgpa || 0) - (a.studentCgpa || 0);
    }
    if (sortBy === 'name') {
      return (a.studentName || '').localeCompare(b.studentName || '');
    }
    return 0;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-app-text">Applications Manager</h2>
          <p className="text-app-muted">Track, process, and audit student placement application workflows in real-time.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsCreateDemoOpen(true)}
            className="px-4 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-brand-blue/20"
          >
            <Plus className="w-4 h-4" /> Add Demo Application
          </button>
          <button 
            onClick={() => {
              const dataString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(applications, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataString);
              downloadAnchor.setAttribute("download", `university_placement_applications_${organizationId}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="px-4 py-2.5 bg-app-surface text-app-text border border-app-border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all hover:bg-app-surface/90"
          >
            <Download className="w-4 h-4 text-app-muted" /> Export JSON Schema
          </button>
        </div>
      </div>

      {/* Realtime Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Apps', value: totalAppsCount, color: 'text-brand-blue bg-brand-blue/10 border-brand-blue/10' },
          { label: 'Applied', value: appliedCount, color: 'text-sky-500 bg-sky-500/10 border-sky-500/10' },
          { label: 'In Review', value: reviewCount, color: 'text-amber-500 bg-amber-500/10 border-amber-500/10' },
          { label: 'Shortlisted', value: shortlistedCount, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/10' },
          { label: 'Interviews / Placed', value: interviewCount + selectedCount, color: 'text-green-500 bg-green-500/10 border-green-500/10' }
        ].map((stat, index) => (
          <div key={index} className={`p-4 rounded-[20px] glass border card-shadow flex flex-col justify-between h-24 ${stat.color}`}>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-app-muted">{stat.label}</span>
            <span className="text-2xl font-display font-black leading-none">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Filter Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-app-border/40">
        {[
          { code: 'All', label: `All (${totalAppsCount})` },
          { code: 'applied', label: `Applied (${appliedCount})` },
          { code: 'under_review', label: `Under Review (${reviewCount})` },
          { code: 'shortlisted', label: `Shortlisted (${shortlistedCount})` },
          { code: 'interview', label: `Interview Scheduled (${interviewCount})` },
          { code: 'selected', label: `Selected (${selectedCount})` },
          { code: 'placed', label: 'Placed' }
        ].map((tab) => (
          <button
            key={tab.code}
            onClick={() => setActiveFilter(tab.code)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeFilter === tab.code 
                ? 'bg-brand-blue text-white shadow-md' 
                : 'text-app-muted hover:text-app-text hover:bg-app-surface/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar & Multi Filters */}
      <div className="p-5 rounded-[28px] glass border-app-border card-shadow flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search by student name, company, or job role..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:border-brand-blue transition-colors text-app-text font-medium"
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Department Filter */}
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

          {/* Sort By selection */}
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-3 py-2.5 text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue transition-all"
          >
            <option value="newest">Applied: Newest First</option>
            <option value="oldest">Applied: Oldest First</option>
            <option value="cgpa">Student: CGPA (High-Low)</option>
            <option value="name">Student: Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Main Table / Data list of application records */}
      <div className="glass border-app-border rounded-[28px] overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border/40 bg-app-surface/20">
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted pl-6">Student Information</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Job Opportunity</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Qualifications</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Applied Date</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Status Badge</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-app-muted text-sm font-semibold">
                    Subscribing to real-time applications from Firestore...
                  </td>
                </tr>
              ) : filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <tr key={app.applicationId} className="hover:bg-app-surface/30 transition-colors">
                    {/* Student Info */}
                    <td className="p-4.5 pl-6 font-semibold text-app-text flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-sm shrink-0 border border-brand-blue/15">
                        {app.studentName.substring(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-app-text">{app.studentName}</div>
                        <div className="text-[10px] text-app-muted font-bold">{app.studentEmail}</div>
                      </div>
                    </td>

                    {/* Job Opportunity */}
                    <td className="p-4.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-brand-blue/10 text-brand-blue flex items-center justify-center font-display font-bold text-[10px] shrink-0 border border-brand-blue/15">
                          {app.companyName.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-app-text">{app.opportunityTitle}</div>
                          <div className="text-[10px] text-brand-blue font-bold uppercase tracking-wider">{app.companyName}</div>
                        </div>
                      </div>
                    </td>

                    {/* Qualifications */}
                    <td className="p-4.5 text-xs font-semibold text-app-text">
                      <div className="font-bold text-app-text-active">Dept: {app.studentDepartment}</div>
                      <div className="text-[10px] text-emerald-500 font-extrabold">CGPA: {app.studentCgpa || 'N/A'}</div>
                    </td>

                    {/* Applied Date */}
                    <td className="p-4.5 text-xs font-semibold text-app-muted">
                      {new Date(app.createdAt || '').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4.5 text-xs font-bold">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wide font-black ${getStatusStyle(app.status)}`}>
                        {getStatusLabel(app.status)}
                      </span>
                    </td>

                    {/* Action button */}
                    <td className="p-4.5 text-right pr-6">
                      <button 
                        onClick={() => handleSelectApp(app)}
                        className="px-3.5 py-1.5 hover:bg-brand-blue hover:text-white transition-all text-xs font-bold bg-app-surface border border-app-border rounded-lg text-app-text-active flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> Review
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-app-muted text-sm font-semibold">
                    No student applications matched the specified filter requirements.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Sidepanel Overlay Drawer (Detail, status, remarks, timeline) */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-app-bg border-l border-app-border h-full shadow-2xl flex flex-col overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-app-border/40 flex items-center justify-between bg-app-surface/10">
                <div>
                  <h3 className="text-lg font-display font-black text-app-text">Review Application</h3>
                  <p className="text-xs text-app-muted mt-0.5">ID: {selectedApp.applicationId}</p>
                </div>
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="p-2 border border-app-border rounded-xl text-app-muted hover:text-app-text hover:bg-app-surface transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 flex-1 text-xs font-semibold">
                
                {/* Profile Card / Student Details */}
                <div className="p-4 rounded-2xl border border-app-border bg-app-surface/20 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-base border border-brand-blue/15">
                      {selectedApp.studentName.substring(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-app-text">{selectedApp.studentName}</h4>
                      <p className="text-[10px] text-app-muted">{selectedApp.studentEmail}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] border-t border-app-border/40 font-bold">
                    <div>
                      <span className="text-app-muted block font-semibold text-[9px] uppercase tracking-wider">Department & Branch</span>
                      <span className="text-app-text">{selectedApp.studentDepartment} ({selectedApp.studentBranch})</span>
                    </div>
                    <div>
                      <span className="text-app-muted block font-semibold text-[9px] uppercase tracking-wider">Academic CGPA</span>
                      <span className="text-emerald-500 font-extrabold">{selectedApp.studentCgpa || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-app-muted block font-semibold text-[9px] uppercase tracking-wider">Graduation Batch</span>
                      <span className="text-app-text">{selectedApp.studentYear} Batch</span>
                    </div>
                    <div>
                      <span className="text-app-muted block font-semibold text-[9px] uppercase tracking-wider">Status Code</span>
                      <span className="text-brand-blue uppercase">{selectedApp.status}</span>
                    </div>
                  </div>
                </div>

                {/* Job / Opportunity Details */}
                <div className="p-4 rounded-2xl border border-app-border bg-app-surface/20 space-y-2">
                  <span className="text-app-muted block text-[9px] uppercase tracking-wider">Opportunity Specifications</span>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-brand-blue shrink-0" />
                    <span className="text-app-text font-black text-sm">{selectedApp.opportunityTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-3.5 h-3.5 text-app-muted" />
                    <span className="text-app-muted">Recruiter:</span>
                    <span className="text-brand-blue font-bold uppercase">{selectedApp.companyName} (ID: {selectedApp.companyId})</span>
                  </div>
                </div>

                {/* Update form */}
                <form onSubmit={handleUpdateApplication} className="space-y-4 pt-2 border-t border-app-border/40">
                  <div className="space-y-1.5">
                    <label className="text-app-text font-bold block">Update Drive Status</label>
                    <select 
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as ApplicationDoc['status'])}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-bold focus:outline-none focus:border-brand-blue transition-colors"
                    >
                      <option value="applied">Applied</option>
                      <option value="under_review">Under Review</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interview">Interview Scheduled</option>
                      <option value="selected">Selected</option>
                      <option value="rejected">Rejected</option>
                      <option value="placed">Placed</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-app-text font-bold block">Internal Remarks</label>
                    <textarea 
                      rows={3}
                      placeholder="e.g. Assessment score high, candidate highly skilled in backend microservices..."
                      value={editRemarks}
                      onChange={(e) => setEditRemarks(e.target.value)}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md shadow-brand-blue/20"
                  >
                    Sync Status & Remarks
                  </button>
                </form>

                {/* Timeline display */}
                <div className="space-y-3 pt-4 border-t border-app-border/40">
                  <span className="text-app-muted block text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-app-muted" /> Audit Timeline Logs
                  </span>

                  <div className="relative border-l border-app-border/60 ml-2 pl-4 space-y-4">
                    {selectedApp.timeline && selectedApp.timeline.length > 0 ? (
                      selectedApp.timeline.map((log, idx) => (
                        <div key={idx} className="relative text-[11px] font-bold">
                          {/* Dot */}
                          <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-brand-blue border border-app-bg" />
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-brand-blue uppercase tracking-wide bg-brand-blue/5 px-2 py-0.5 rounded border border-brand-blue/10">
                              {getStatusLabel(log.status)}
                            </span>
                            <span className="text-app-muted font-semibold text-[9px]">
                              {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {log.remarks && (
                            <p className="text-app-muted font-medium text-[10px] mt-1 bg-app-surface/30 p-2 rounded-lg border border-app-border/20">
                              {log.remarks}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="text-app-muted font-normal text-xs">No logs registered yet.</span>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Demo Application Creation Modal */}
      <AnimatePresence>
        {isCreateDemoOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateDemoOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-app-bg border border-app-border rounded-[28px] p-6 shadow-2xl space-y-4 overflow-y-auto max-h-[90vh] text-xs font-semibold"
            >
              <div className="flex justify-between items-center pb-2 border-b border-app-border/40">
                <div>
                  <h3 className="text-lg font-display font-black text-app-text">Add Demo Application</h3>
                  <p className="text-xs text-app-muted mt-0.5">Create a simulation candidate for review testing.</p>
                </div>
                <button 
                  onClick={() => setIsCreateDemoOpen(false)}
                  className="p-1.5 border border-app-border rounded-lg text-app-muted hover:text-app-text hover:bg-app-surface transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateDemoApp} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-app-text font-bold block">Student Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. Ramesh Patel" 
                    value={demoStudentName}
                    onChange={(e) => setDemoStudentName(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-app-text font-bold block">Student Email <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    placeholder="e.g. ramesh.patel@university.edu" 
                    value={demoStudentEmail}
                    onChange={(e) => setDemoStudentEmail(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-app-text font-bold block">Department</label>
                    <select 
                      value={demoStudentDept}
                      onChange={(e) => setDemoStudentDept(e.target.value)}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-bold focus:outline-none focus:border-brand-blue"
                    >
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="IT">IT</option>
                      <option value="ME">ME</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-app-text font-bold block">Academic CGPA</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      placeholder="e.g. 8.5" 
                      value={demoStudentCgpa}
                      onChange={(e) => setDemoStudentCgpa(e.target.value)}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-app-text font-bold block">Company Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. TCS, Wipro, Google" 
                    value={demoCompanyName}
                    onChange={(e) => setDemoCompanyName(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-app-text font-bold block">Job Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. Software Engineer, Analyst" 
                    value={demoJobTitle}
                    onChange={(e) => setDemoJobTitle(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue"
                    required
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsCreateDemoOpen(false)}
                    className="flex-1 py-3 bg-app-surface hover:bg-app-surface/90 text-app-text-active border border-app-border rounded-xl text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-black transition-all shadow-md shadow-brand-blue/20"
                  >
                    Register Demo App
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
