import { useState } from 'react';
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
  ExternalLink,
  BookOpen,
  Award,
  CircleCheck,
  TrendingUp,
  LayoutGrid
} from 'lucide-react';

export default function StudentsTab() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cgpaFilter, setCgpaFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const studentsList = [
    { id: '1', name: 'Rahul Kumar', roll: 'CS20224001', dept: 'CSE', cgpa: '8.50', applications: 12, status: 'Placed', email: 'rahul.kumar@xavier.edu', phone: '+91 98765 43210', dob: '15 May 2004', batch: '2026', sem: '7th Semester' },
    { id: '2', name: 'Anjali Sharma', roll: 'EC20226015', dept: 'ECE', cgpa: '8.10', applications: 8, status: 'Eligible', email: 'anjali@xavier.edu', phone: '+91 87654 32109', dob: '22 Aug 2004', batch: '2026', sem: '7th Semester' },
    { id: '3', name: 'Vikram Patel', roll: 'IT20223023', dept: 'IT', cgpa: '7.90', applications: 6, status: 'Applied', email: 'vikram@xavier.edu', phone: '+91 76543 21098', dob: '10 Jan 2004', batch: '2026', sem: '7th Semester' },
    { id: '4', name: 'Neha Singh', roll: 'CS20224045', dept: 'CSE', cgpa: '8.70', applications: 10, status: 'Shortlisted', email: 'neha@xavier.edu', phone: '+91 65432 10987', dob: '05 Dec 2004', batch: '2026', sem: '7th Semester' },
    { id: '5', name: 'Arjun Mehta', roll: 'ME20225012', dept: 'ME', cgpa: '7.60', applications: 5, status: 'Under Review', email: 'arjun@xavier.edu', phone: '+91 54321 09876', dob: '18 Nov 2004', batch: '2026', sem: '7th Semester' },
    { id: '6', name: 'Pooja Verma', roll: 'EC20226032', dept: 'ECE', cgpa: '8.30', applications: 7, status: 'Eligible', email: 'pooja@xavier.edu', phone: '+91 43210 98765', dob: '12 Sep 2004', batch: '2026', sem: '7th Semester' },
    { id: '7', name: 'Rohit Jain', roll: 'CS20224067', dept: 'CSE', cgpa: '8.00', applications: 9, status: 'Applied', email: 'rohit@xavier.edu', phone: '+91 32109 87654', dob: '25 Jun 2004', batch: '2026', sem: '7th Semester' },
    { id: '8', name: 'Sneha Reddy', roll: 'IT20223041', dept: 'IT', cgpa: '8.20', applications: 6, status: 'Shortlisted', email: 'sneha@xavier.edu', phone: '+91 21098 76543', dob: '30 Oct 2004', batch: '2026', sem: '7th Semester' },
  ];

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

  const filteredStudents = studentsList.filter(stu => {
    const matchesSearch = stu.name.toLowerCase().includes(search.toLowerCase()) || stu.roll.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'All' || stu.dept === deptFilter;
    const matchesStatus = statusFilter === 'All' || stu.status === statusFilter;
    
    let matchesCgpa = true;
    if (cgpaFilter === '8.5') {
      matchesCgpa = parseFloat(stu.cgpa) >= 8.5;
    } else if (cgpaFilter === '8.0') {
      matchesCgpa = parseFloat(stu.cgpa) >= 8.0 && parseFloat(stu.cgpa) < 8.5;
    } else if (cgpaFilter === '7.0') {
      matchesCgpa = parseFloat(stu.cgpa) >= 7.0 && parseFloat(stu.cgpa) < 8.0;
    }

    return matchesSearch && matchesDept && matchesStatus && matchesCgpa;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-app-text">Students</h2>
          <p className="text-app-muted">View, search, and manage verified student placements activity.</p>
        </div>
        <button 
          onClick={() => alert('Exporting all student metrics to Microsoft Excel spreadsheet...')}
          className="px-4.5 py-2.5 bg-app-surface text-app-text border border-app-border rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:bg-app-surface/90"
        >
          <Download className="w-4 h-4 text-app-muted" /> Export Excel
        </button>
      </div>

      {/* Filter and Search Box */}
      <div className="p-5 rounded-[28px] glass border-app-border card-shadow flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search student names or roll numbers..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:border-brand-blue transition-colors"
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
              {filteredStudents.length > 0 ? (
                filteredStudents.map((stu) => (
                  <tr key={stu.id} className="hover:bg-app-surface/30 transition-colors">
                    {/* Student Name */}
                    <td className="p-4.5 pl-6 font-semibold text-app-text flex items-center gap-3.5">
                      <img 
                        src={`https://picsum.photos/seed/${stu.id}/100/100`} 
                        alt={stu.name} 
                        className="w-9 h-9 rounded-full object-cover border border-app-border" 
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-extrabold text-sm text-app-text">{stu.name}</div>
                        <div className="text-[10px] text-app-muted font-bold">{stu.email}</div>
                      </div>
                    </td>

                    {/* Roll */}
                    <td className="p-4.5 text-xs font-extrabold text-app-text">{stu.roll}</td>

                    {/* Dept */}
                    <td className="p-4.5 text-xs font-bold text-app-muted">
                      <span className="bg-app-surface text-app-muted border border-app-border px-2 py-0.5 rounded-md font-extrabold">
                        {stu.dept}
                      </span>
                    </td>

                    {/* CGPA */}
                    <td className="p-4.5 text-sm font-black text-brand-blue">{stu.cgpa}</td>

                    {/* Applications count */}
                    <td className="p-4.5 text-xs font-bold text-app-text pl-8">{stu.applications}</td>

                    {/* Status badge */}
                    <td className="p-4.5 text-xs font-bold">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-extrabold tracking-wide ${getStatusStyle(stu.status)}`}>
                        {stu.status}
                      </span>
                    </td>

                    {/* Action button */}
                    <td className="p-4.5 text-right pr-6">
                      <button 
                        onClick={() => setSelectedStudent(stu)}
                        className="px-3 py-1.5 bg-brand-blue/10 text-brand-blue text-xs font-black rounded-lg hover:bg-brand-blue hover:text-white transition-all flex items-center gap-1 ml-auto"
                      >
                        View Profile <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
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
          <span>Showing 1 to {filteredStudents.length} of {studentsList.length} students</span>
          <div className="flex gap-1.5">
            <button className="px-2.5 py-1.5 border border-app-border rounded-lg hover:bg-app-surface transition-all text-app-muted" disabled>Prev</button>
            <button className="px-3 py-1.5 bg-brand-blue text-white rounded-lg font-bold">1</button>
            <button className="px-2.5 py-1.5 border border-app-border rounded-lg hover:bg-app-surface transition-all text-app-muted" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* Floating Detailed Student Profile Sidebar Model (Sheet Modal) */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedStudent(null)}
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
                  <h3 className="font-display font-black text-lg text-app-text">Student Detailed Profile</h3>
                </div>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 text-app-muted hover:text-app-text hover:bg-app-surface rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Panel Content Body */}
              <div className="p-6 sm:p-8 space-y-6 flex-1">
                
                {/* Upper Card containing Student Avatar & Roll */}
                <div className="p-6 bg-app-surface/60 rounded-[28px] border border-app-border flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                  <div className="w-20 h-20 rounded-full blue-gradient p-0.5 shadow-lg relative">
                    <img 
                      src={`https://picsum.photos/seed/${selectedStudent.id}/200/200`} 
                      alt={selectedStudent.name} 
                      className="w-full h-full rounded-full object-cover border-4 border-app-bg"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-app-bg" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-display font-black text-app-text">{selectedStudent.name}</h4>
                    <p className="text-xs font-bold text-app-muted uppercase tracking-wider">
                      Roll Number: {selectedStudent.roll} • {selectedStudent.dept} - CSE 4th Year
                    </p>
                    <span className={`inline-block mt-1 text-[10px] uppercase font-extrabold px-3 py-1 rounded-full ${getStatusStyle(selectedStudent.status)}`}>
                      {selectedStudent.status} Status
                    </span>
                  </div>
                </div>

                {/* Grid: Academic & Contacts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                  
                  {/* Academic info box */}
                  <div className="p-5 bg-app-surface/40 border border-app-border rounded-2xl space-y-4">
                    <h5 className="font-display font-black text-xs text-app-text uppercase tracking-widest border-b border-app-border/40 pb-2">Academic Information</h5>
                    <div className="space-y-3.5 text-xs font-semibold text-app-text">
                      <div className="flex justify-between items-center pb-2.5 border-b border-app-border/25">
                        <span className="text-app-muted font-bold uppercase tracking-wider text-[9px]">University</span>
                        <span>St. Xavier\'s University</span>
                      </div>
                      <div className="flex justify-between items-center pb-2.5 border-b border-app-border/25">
                        <span className="text-app-muted font-bold uppercase tracking-wider text-[9px]">Department</span>
                        <span>{selectedStudent.dept}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2.5 border-b border-app-border/25">
                        <span className="text-app-muted font-bold uppercase tracking-wider text-[9px]">Semester</span>
                        <span>{selectedStudent.sem}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-app-muted font-bold uppercase tracking-wider text-[9px]">CGPA SCORE</span>
                        <span className="text-brand-blue font-black text-sm">{selectedStudent.cgpa} / 10</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact info box */}
                  <div className="p-5 bg-app-surface/40 border border-app-border rounded-2xl space-y-4">
                    <h5 className="font-display font-black text-xs text-app-text uppercase tracking-widest border-b border-app-border/40 pb-2">Contact Details</h5>
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-app-text">
                        <Mail className="w-4 h-4 text-brand-blue shrink-0" />
                        <span className="truncate">{selectedStudent.email}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-app-text mt-3">
                        <Phone className="w-4 h-4 text-brand-blue shrink-0" />
                        <span>{selectedStudent.phone}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-app-text mt-3">
                        <Calendar className="w-4 h-4 text-brand-blue shrink-0" />
                        <span>Born on: {selectedStudent.dob}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Skills tags breakdown */}
                <div className="p-5 bg-app-surface/40 border border-app-border rounded-2xl space-y-3.5">
                  <h5 className="font-display font-black text-xs text-app-text uppercase tracking-widest border-b border-app-border/40 pb-2">Verified Skill Stack</h5>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Java', 'SQL', 'Data Structures', 'React.js', 'Spring Boot', 'Problem Solving', 'HTML', 'CSS', 'JavaScript'].map((sk) => (
                      <span key={sk} className="text-xs font-black bg-app-bg border border-app-border px-3 py-1.5 rounded-xl block text-app-text">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Placement status tracker list details */}
                <div className="p-5 bg-app-surface/40 border border-app-border rounded-2xl space-y-4">
                  <h5 className="font-display font-black text-xs text-app-text uppercase tracking-widest border-b border-app-border/40 pb-2">Placement Status Outcome</h5>
                  
                  <div className="grid grid-cols-3 gap-4.5 text-center">
                    <div className="p-3 border border-app-border bg-app-bg rounded-xl">
                      <span className="text-[9px] font-bold text-app-muted uppercase tracking-widest block mb-0.5">Total Apps</span>
                      <span className="text-lg font-black text-app-text">{selectedStudent.applications}</span>
                    </div>
                    <div className="p-3 border border-app-border bg-app-bg rounded-xl">
                      <span className="text-[9px] font-bold text-app-muted uppercase tracking-widest block mb-0.5">Shortlisted</span>
                      <span className="text-lg font-black text-violet-500">2</span>
                    </div>
                    <div className="p-3 border border-app-border bg-app-bg rounded-xl">
                      <span className="text-[9px] font-bold text-app-muted uppercase tracking-widest block mb-0.5">Offers Received</span>
                      <span className="text-lg font-black text-emerald-500">
                        {selectedStudent.status === 'Placed' ? '1' : '0'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* View Only Banner at bottom of panel */}
              <div className="p-5 border-t border-app-border bg-app-surface/40 text-center">
                <p className="text-[11px] font-bold text-app-muted uppercase tracking-wider select-none">
                  Note: This information is read-only. For any updates, please coordinate with the candidate.
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
