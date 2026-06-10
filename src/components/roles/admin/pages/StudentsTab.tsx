import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Upload, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  FileText, 
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
  Calendar,
  Layers,
  MapPin,
  ClipboardList,
  CheckCircle2,
  Hourglass,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  dept: string;
  batch: string;
  cgpa: number;
  status: string;
  avatar: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  skills: string[];
}

export default function StudentsTab() {
  const [studentsList, setStudentsList] = useState<Student[]>([
    { id: '1', name: 'Rahul Kumar', rollNumber: 'CS2026001', dept: 'CSE', batch: '2026', cgpa: 8.50, status: 'Placed', avatar: 'https://picsum.photos/seed/rahul/100/100', email: 'rahul.kumar@student.ssu.edu.in', phone: '+91 98165 43210', gender: 'Male', dob: '15 Mar 2004', skills: ['Java', 'Python', 'SQL', 'Data Structures', 'HTML', 'CSS', 'JavaScript', 'React.js'] },
    { id: '2', name: 'Anjali Sharma', rollNumber: 'EC2026005', dept: 'ECE', batch: '2026', cgpa: 8.10, status: 'Eligible', avatar: 'https://picsum.photos/seed/anjali/100/100', email: 'anjali.sharma@student.ssu.edu.in', phone: '+91 98165 43211', gender: 'Female', dob: '18 Aug 2004', skills: ['Embedded C', 'MATLAB', 'Python', 'Verilog', 'IoT'] },
    { id: '3', name: 'Vivek Singh', rollNumber: 'IT2026003', dept: 'IT', batch: '2026', cgpa: 7.90, status: 'Applied', avatar: 'https://picsum.photos/seed/vivek/100/100', email: 'vivek.singh@student.ssu.edu.in', phone: '+91 98165 43212', gender: 'Male', dob: '22 Jan 2004', skills: ['C++', 'SQL', 'OS', 'DBMS', 'Web Tech'] },
    { id: '4', name: 'Neha Mehta', rollNumber: 'CS2026064', dept: 'CSE', batch: '2026', cgpa: 8.70, status: 'Shortlisted', avatar: 'https://picsum.photos/seed/nehap/100/100', email: 'neha.mehta@student.ssu.edu.in', phone: '+91 98165 43213', gender: 'Female', dob: '05 May 2004', skills: ['Java', 'Spring Boot', 'MongoDB', 'React', 'Docker'] },
    { id: '5', name: 'Arjun Patel', rollNumber: 'ME2026002', dept: 'Mechanical', batch: '2026', cgpa: 7.40, status: 'Under Review', avatar: 'https://picsum.photos/seed/arjun/100/100', email: 'arjun.patel@student.ssu.edu.in', phone: '+91 98165 43214', gender: 'Male', dob: '14 Oct 2003', skills: ['AutoCAD', 'SolidWorks', 'ANSYS', 'Thermodynamics'] },
    { id: '6', name: 'Pooja Verma', rollNumber: 'EC2026008', dept: 'ECE', batch: '2026', cgpa: 8.30, status: 'Eligible', avatar: 'https://picsum.photos/seed/pooja/100/100', email: 'pooja.verma@student.ssu.edu.in', phone: '+91 98165 43215', gender: 'Female', dob: '09 Nov 2004', skills: ['Verilog', 'Arduino', 'C Networking', 'Signal Systems'] },
    { id: '7', name: 'Rohit Jain', rollNumber: 'CS2026007', dept: 'CSE', batch: '2026', cgpa: 8.00, status: 'Applied', avatar: 'https://picsum.photos/seed/rohit123/100/100', email: 'rohit.jain@student.ssu.edu.in', phone: '+91 98165 43216', gender: 'Male', dob: '30 Dec 2003', skills: ['Node.js', 'Express', 'SQL', 'JavaScript', 'Git'] },
    { id: '8', name: 'Sneha Reddy', rollNumber: 'IT2026004', dept: 'IT', batch: '2026', cgpa: 8.20, status: 'Shortlisted', avatar: 'https://picsum.photos/seed/sneha/100/100', email: 'sneha.reddy@student.ssu.edu.in', phone: '+91 98165 43217', gender: 'Female', dob: '12 Jul 2004', skills: ['C++', 'Data Structures', 'Algorithms', 'Java', 'SQL'] },
  ]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [profileTab, setProfileTab] = useState<'overview' | 'academics' | 'resume' | 'applications' | 'placements'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  // New Student form states
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRoll, setNewStudentRoll] = useState('');
  const [newStudentDept, setNewStudentDept] = useState('CSE');
  const [newStudentCGPA, setNewStudentCGPA] = useState('8.00');
  const [newStudentBatch, setNewStudentBatch] = useState('2026');

  const itemsPerPage = 6;

  // Filters logic
  const filteredStudents = studentsList.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || s.dept.toLowerCase().includes(selectedDept.toLowerCase());
    const matchesBatch = selectedBatch === 'All' || s.batch === selectedBatch;
    const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;

    return matchesSearch && matchesDept && matchesBatch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCsvFile(file);
      alert(`✓ CSV Database file: "${file.name}" uploaded successfully! 14 new students registered added to system.`);
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentRoll || !newStudentCGPA) {
      alert('Please fill out all the fields.');
      return;
    }

    const brandNew: Student = {
      id: String(Date.now()),
      name: newStudentName,
      rollNumber: newStudentRoll,
      dept: newStudentDept,
      batch: newStudentBatch,
      cgpa: parseFloat(newStudentCGPA) || 8.0,
      status: 'Eligible',
      avatar: `https://picsum.photos/seed/${newStudentName.replace(/\s+/g, '')}/100/100`,
      email: `${newStudentName.toLowerCase().replace(/\s+/g, '.')}@student.ssu.edu.in`,
      phone: '+91 99000 88000',
      gender: 'Male',
      dob: '20 Jul 2004',
      skills: ['Java', 'SQL', 'HTML']
    };

    setStudentsList([brandNew, ...studentsList]);
    setIsAddingStudent(false);
    // Reset Form
    setNewStudentName('');
    setNewStudentRoll('');
    setNewStudentCGPA('8.00');
    alert(`Success: "${newStudentName}" has been successfully added to St. Xavier's student database.`);
  };

  const getStatusBadgeStyle = (status: string) => {
    switch(status) {
      case 'Placed':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
      case 'Eligible':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-500';
      case 'Applied':
        return 'bg-brand-violet/10 border-brand-violet/20 text-brand-violet';
      case 'Shortlisted':
        return 'bg-pink-500/10 border-pink-500/20 text-pink-500';
      case 'Under Review':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {!selectedStudent ? (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-display font-black text-app-text tracking-tight animate-fade-in">Students</h2>
              <p className="text-xs text-app-muted font-bold mt-1">
                View, monitor and manage active batches of students registered in the placement tracking ecosystem.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Custom import button */}
              <label className="px-4 py-2.5 bg-app-surface border border-app-border hover:bg-app-surface/85 hover:border-app-border/80 text-app-text font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-sm">
                <Upload className="w-4 h-4 text-brand-blue" />
                <span>Import Students</span>
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              </label>

              <button 
                onClick={() => setIsAddingStudent(true)}
                className="px-4 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-brand-blue/15 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Add Student
              </button>
            </div>
          </div>

          {/* Quick add student conditional drawer / form */}
          {isAddingStudent && (
            <div className="p-6 rounded-3xl bg-app-surface/90 border border-app-border card-shadow space-y-4">
              <h3 className="text-sm font-black text-app-text uppercase tracking-wider flex justify-between items-center">
                <span>Direct Scholar Addition</span>
                <button onClick={() => setIsAddingStudent(false)} className="text-xs font-bold text-red-500 hover:underline">Cancel</button>
              </h3>
              <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="space-y-1.5 md:col-span-2">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase">Student Full Name</span>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Rahul Kumar" 
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full bg-app-bg border border-app-border text-xs font-bold py-2.5 px-3 rounded-lg focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase">Roll Number</span>
                  <input 
                    type="text" 
                    required 
                    placeholder="CS2026001" 
                    value={newStudentRoll}
                    onChange={(e) => setNewStudentRoll(e.target.value)}
                    className="w-full bg-app-bg border border-app-border text-xs font-bold py-2.5 px-3 rounded-lg focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div className="space-y-1.5/2 flex gap-3">
                  <div className="flex-1 space-y-1.5">
                    <span className="text-[10px] font-extrabold text-app-muted uppercase block">Dept</span>
                    <select 
                      value={newStudentDept}
                      onChange={(e) => setNewStudentDept(e.target.value)}
                      className="w-full bg-app-bg border border-app-border text-xs font-bold py-2.5 px-2 rounded-lg cursor-pointer"
                    >
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="IT">IT</option>
                      <option value="Mechanical">ME</option>
                    </select>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <span className="text-[10px] font-extrabold text-app-muted uppercase block">CGPA</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      max="10.00" 
                      required 
                      value={newStudentCGPA}
                      onChange={(e) => setNewStudentCGPA(e.target.value)}
                      className="w-full bg-app-bg border border-app-border text-xs font-bold py-2.5 px-2 rounded-lg"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-brand-blue hover:bg-brand-blue/95 text-white font-extrabold text-xs rounded-lg shadow-sm"
                >
                  Create Student Profile
                </button>
              </form>
            </div>
          )}

          {/* Filters Bar */}
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-app-surface/60 border border-app-border flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
              <input 
                type="text" 
                placeholder="Search students by name, roll number, or skills..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-brand-blue transition-colors"
              />
            </div>

            {/* Filters Group */}
            <div className="flex flex-wrap w-full md:w-auto items-center gap-3">
              {/* Department */}
              <div className="flex-1 md:flex-initial min-w-[110px]">
                <select
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3 text-xs font-bold text-app-muted focus:outline-none focus:border-brand-blue cursor-pointer"
                >
                  <option value="All">All Departments</option>
                  <option value="CSE">CSE (Computer Science)</option>
                  <option value="ECE">ECE (Electronics)</option>
                  <option value="IT">IT (Info Tech)</option>
                  <option value="Mechanical">Mechanical</option>
                </select>
              </div>

              {/* Batch */}
              <div className="flex-1 md:flex-initial min-w-[90px]">
                <select
                  value={selectedBatch}
                  onChange={(e) => {
                    setSelectedBatch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3 text-xs font-bold text-app-muted focus:outline-none focus:border-brand-blue cursor-pointer"
                >
                  <option value="All">All Batches</option>
                  <option value="2026">2026 Batch</option>
                  <option value="2025">2025 Batch</option>
                </select>
              </div>

              {/* Status */}
              <div className="flex-1 md:flex-initial min-w-[120px]">
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3 text-xs font-bold text-app-muted focus:outline-none focus:border-brand-blue cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Placed">Placed</option>
                  <option value="Eligible">Eligible</option>
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Under Review">Under Review</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-app-surface/60 border border-app-border rounded-[32px] overflow-hidden card-shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-app-border text-left text-[10px] font-extrabold uppercase tracking-widest text-app-muted bg-app-bg/20 h-12">
                    <th className="pl-6 py-3">Student Name</th>
                    <th className="py-3">Roll Number</th>
                    <th className="py-3">Department</th>
                    <th className="py-3">Batch</th>
                    <th className="py-3 text-center">CGPA</th>
                    <th className="py-3 text-center">Placement Status</th>
                    <th className="pr-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border/50">
                  {paginatedStudents.length > 0 ? (
                    paginatedStudents.map((student) => (
                      <tr key={student.id} className="group hover:bg-app-surface/40 transition-colors">
                        <td className="pl-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img 
                              src={student.avatar} 
                              alt={student.name} 
                              className="w-10 h-10 rounded-full object-cover border-2 border-app-bg" 
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="text-sm font-extrabold text-app-text leading-snug group-hover:text-brand-blue transition-all">
                                {student.name}
                              </div>
                              <div className="text-[10px] text-app-muted font-bold mt-0.5">St. Xavier's University</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 whitespace-nowrap text-xs font-mono font-bold text-app-muted">
                          {student.rollNumber}
                        </td>

                        <td className="py-4 whitespace-nowrap">
                          <span className="text-xs font-bold text-app-text bg-app-bg px-2.5 py-1.5 rounded-lg border border-app-border">
                            {student.dept}
                          </span>
                        </td>

                        <td className="py-4 whitespace-nowrap text-xs font-extrabold text-app-muted">
                          {student.batch}
                        </td>

                        <td className="py-4 whitespace-nowrap text-center text-sm font-black text-app-text">
                          {student.cgpa.toFixed(2)}
                        </td>

                        <td className="py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold border tracking-wider uppercase ${getStatusBadgeStyle(student.status)}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            <span>{student.status}</span>
                          </span>
                        </td>

                        <td className="pr-6 py-4 whitespace-nowrap text-right">
                          <button 
                            onClick={() => {
                              setSelectedStudent(student);
                              setProfileTab('overview');
                            }}
                            className="px-3.5 py-2 text-xs font-extrabold text-brand-blue hover:bg-brand-blue/10 rounded-xl border border-transparent hover:border-brand-blue/15 transition-all cursor-pointer"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-app-muted font-bold text-sm">
                        No students found matching current filter query inside the Xavier's registry.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 sm:p-5 border-t border-app-border flex justify-between items-center bg-app-bg/10">
              <span className="text-xs text-app-muted font-bold">
                Showing <strong className="text-app-text font-black">{Math.min(startIndex + 1, filteredStudents.length)}-{Math.min(startIndex + itemsPerPage, filteredStudents.length)}</strong> of <strong className="text-app-text font-black">{filteredStudents.length}</strong> scholars
              </span>

              <div className="flex items-center gap-1.5">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  className="p-2 border border-app-border rounded-xl text-app-muted hover:text-app-text disabled:opacity-40 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-8 h-8 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        currentPage === idx + 1 
                          ? 'bg-brand-blue text-white shadow-md' 
                          : 'border border-app-border text-app-muted hover:bg-app-surface hover:text-app-text'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  className="p-2 border border-app-border rounded-xl text-app-muted hover:text-app-text disabled:opacity-40 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Dynamic student deep detailed profile view block */
        <div className="space-y-6">
          {/* Breadcrumb row */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedStudent(null)}
              className="p-2 border border-app-border rounded-xl hover:bg-app-surface text-app-muted hover:text-app-text transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="text-xs font-bold text-app-muted flex items-center gap-2">
                <span className="cursor-pointer hover:underline" onClick={() => setSelectedStudent(null)}>Students</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-brand-blue font-extrabold">Student Profile</span>
              </div>
              <h2 className="text-xl font-display font-black text-app-text mt-0.5">Scholar Profile Profile Detail</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Card: Basic visual summary */}
            <div className="lg:col-span-4 p-6 sm:p-8 rounded-[32px] bg-app-surface/60 border border-app-border hover:border-app-border/85 transition-all text-center flex flex-col justify-between items-center card-shadow">
              <div className="w-full flex flex-col items-center">
                <div className="w-24 h-24 rounded-full blue-gradient p-1 mb-4 shadow-md relative">
                  <img 
                    src={selectedStudent.avatar} 
                    alt={selectedStudent.name} 
                    className="w-full h-full rounded-full object-cover border-4 border-app-surface"
                    referrerPolicy="no-referrer"
                  />
                  <span className={`absolute bottom-0 right-0 px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider ${
                    selectedStudent.status === 'Placed' ? 'bg-emerald-500 text-white' : 'bg-brand-blue text-white'
                  }`}>
                    {selectedStudent.status}
                  </span>
                </div>

                <h3 className="text-xl font-display font-black text-app-text">{selectedStudent.name}</h3>
                <span className="text-xs font-mono font-bold text-app-muted block mt-1">{selectedStudent.rollNumber}</span>
                
                <div className="w-full border-t border-app-border/60 my-5" />

                <div className="w-full space-y-4 text-left">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-app-muted">Department:</span>
                    <span className="text-app-text font-black">{selectedStudent.dept}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-app-muted">Batch Year:</span>
                    <span className="text-app-text font-black">{selectedStudent.batch}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-app-muted">CGPA Scale:</span>
                    <span className="text-brand-violet font-black">{selectedStudent.cgpa.toFixed(2)} / 10.0</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-app-muted">Semester:</span>
                    <span className="text-app-text font-black">6th Semester (Active)</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-app-muted">Date of Birth:</span>
                    <span className="text-app-text font-black">{selectedStudent.dob}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-app-muted">Gender Identity:</span>
                    <span className="text-app-text font-black">{selectedStudent.gender}</span>
                  </div>
                </div>
              </div>

              <div className="w-full mt-6 space-y-3">
                <a 
                  href={`mailto:${selectedStudent.email}`}
                  className="w-full py-2.5 rounded-xl border border-app-border bg-app-bg text-app-text font-bold text-xs flex items-center justify-center gap-2 hover:bg-app-surface transition-all"
                >
                  <Mail className="w-4 h-4 text-app-muted" />
                  <span>{selectedStudent.email}</span>
                </a>
                <a 
                  href={`tel:${selectedStudent.phone}`}
                  className="w-full py-2.5 rounded-xl border border-app-border bg-app-bg text-app-text font-bold text-xs flex items-center justify-center gap-2 hover:bg-app-surface transition-all"
                >
                  <Phone className="w-4 h-4 text-app-muted" />
                  <span>{selectedStudent.phone}</span>
                </a>
              </div>
            </div>

            {/* Right Card: Detail Tabs with custom content container */}
            <div className="lg:col-span-8 p-6 sm:p-8 rounded-[32px] bg-app-surface/60 border border-app-border hover:border-app-border/85 transition-all card-shadow flex flex-col">
              {/* Inner Tabs navigation */}
              <div className="flex flex-wrap border-b border-app-border/80 pb-3 gap-2">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'academics', label: 'Academics' },
                  { id: 'resume', label: 'Resume' },
                  { id: 'applications', label: 'Applications' },
                  { id: 'placements', label: 'Placements' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setProfileTab(tab.id as any)}
                    className={`px-4 py-2 text-xs font-extrabold rounded-lg tracking-wide transition-all cursor-pointer ${
                      profileTab === tab.id 
                        ? 'bg-brand-blue text-white shadow-sm' 
                        : 'text-app-muted hover:text-app-text hover:bg-app-bg'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Inner Tab Content */}
              <div className="flex-1 py-6">
                {profileTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Skills list */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-app-muted">Skills Inventory</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedStudent.skills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-xl bg-brand-blue/5 border border-brand-blue/15 text-brand-blue text-xs font-extrabold hover:bg-brand-blue/10 transition-colors">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Recent applications listing */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-app-muted">Recent Job Portal Applications</h4>
                      <div className="space-y-3">
                        {[
                          { company: 'TCS', role: 'Software Engineer', date: '10 May 2026', status: 'Placed', style: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' },
                          { company: 'Infosys', role: 'System Engineer', date: '08 May 2026', status: 'Shortlisted', style: 'bg-pink-500/10 border-pink-500/20 text-pink-500' },
                          { company: 'Wipro', role: 'Project Engineer', date: '05 May 2026', status: 'Rejected', style: 'bg-red-500/10 border-red-500/20 text-red-500' },
                        ].map((app, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-app-bg border border-app-border flex justify-between items-center hover:border-app-border/80 transition-all">
                            <div>
                              <div className="text-xs font-extrabold text-app-text">{app.company} — <span className="text-app-muted">{app.role}</span></div>
                              <span className="text-[10px] text-app-muted font-bold block mt-0.5">Applied: {app.date}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${app.style}`}>
                              {app.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {profileTab === 'academics' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-app-bg border border-app-border rounded-2xl space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-app-muted">Matriculation (10th) Score</span>
                        <div className="text-base font-black text-app-text">94.2%</div>
                        <span className="text-[9px] text-emerald-500 font-extrabold block">✓ State Central Board Verified</span>
                      </div>
                      <div className="p-4 bg-app-bg border border-app-border rounded-2xl space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-app-muted">Intermediate (12th) Score</span>
                        <div className="text-base font-black text-app-text">91.8%</div>
                        <span className="text-[9px] text-emerald-500 font-extrabold block">✓ CBSE National Verified</span>
                      </div>
                    </div>

                    <div className="p-4 bg-brand-violet/5 border border-brand-violet/10 rounded-2xl space-y-3">
                      <h4 className="text-xs font-black text-brand-violet">Department Vetted Credentials</h4>
                      <p className="text-[11px] text-app-muted font-semibold leading-relaxed">
                        Scholars are vetted by their respective Department Officers before being routed to external job portal syncing. CGPA records are synchronized on-chain with the University Admin registrar.
                      </p>
                      <div className="flex gap-4 text-xs font-bold text-app-text">
                        <div>Active Backlogs: <span className="text-emerald-500 font-black">None</span></div>
                        <div>Course Duration: <span className="text-brand-blue font-black">4 Years (B.Tech)</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {profileTab === 'resume' && (
                  <div className="space-y-5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-app-muted">Active Placement Resume</h4>
                    <p className="text-xs text-app-muted leading-relaxed font-semibold">
                      This PDF contains the professional verification of the student. External verified organizations can access this resume.
                    </p>

                    <div className="p-5 bg-app-bg border border-app-border rounded-2xl flex items-center justify-between hover:border-brand-blue/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                          <FileText className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="text-sm font-extrabold text-app-text">{selectedStudent.name.replace(/\s+/g, '_')}_Resume.pdf</div>
                          <span className="text-[10px] text-app-muted font-bold block mt-0.5">Uploaded via Central Student Applet • PDF • 182 KB</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => alert('Downloading Verified Scholar Resume PDF from ARYX S3 Bucket...')}
                        className="p-3 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue rounded-xl transition-all cursor-pointer"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {profileTab === 'applications' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-app-muted">Application Activity Funnel</h4>
                    <div className="space-y-3">
                      {[
                        { company: 'TCS', role: 'Software Engineer', salary: '7.0 LPA', status: 'Shortlisted', date: '2 days ago', desc: 'Direct Campus Drive recruitment' },
                        { company: 'Wipro', role: 'Associate Coder', salary: '5.5 LPA', status: 'Under Review', date: 'Yesterday', desc: 'S&P Engineering portal placement' },
                      ].map((app, idx) => (
                        <div key={idx} className="p-4 bg-app-bg border border-app-border rounded-2xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-extrabold text-app-text">{app.company} <span className="text-xs text-app-muted font-bold">({app.role})</span></span>
                            <span className="text-xs font-black text-brand-violet">{app.salary}</span>
                          </div>
                          <p className="text-[11px] text-app-muted font-bold">{app.desc}</p>
                          <div className="flex justify-between items-center text-[10px] text-app-muted pt-2 border-t border-app-border/40 border-dashed">
                            <span>Status updated: {app.date}</span>
                            <span className="px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue font-extrabold uppercase">{app.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {profileTab === 'placements' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-app-muted font-display">Final Endorsement Status</h4>
                    {selectedStudent.status === 'Placed' ? (
                      <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-emerald-500 text-sm font-black">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Endorsement Verified by Priya Sharma (T&P)</span>
                        </div>
                        <p className="text-xs text-app-muted leading-relaxed font-semibold">
                          This student has finalized their campus placement drive. They are placed at <strong className="text-app-text">TCS</strong> with a package of <strong className="text-brand-violet">7.0 LPA</strong>. The letter of intent is fully archived in the Central Registrar office.
                        </p>
                      </div>
                    ) : (
                      <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-start gap-3">
                        <Hourglass className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-black text-amber-500">Endorsement Verification Pending</div>
                          <p className="text-xs text-app-muted leading-relaxed font-semibold mt-1">
                            This student has not yet secured or completed a final corporate placement offer. They are currently visible as an active talent in the recruitment pipeline.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
