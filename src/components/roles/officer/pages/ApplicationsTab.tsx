import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ClipboardList, 
  Search, 
  MapPin, 
  Briefcase, 
  Eye, 
  Calendar, 
  Download,
  Building2
} from 'lucide-react';

interface ApplicationsTabProps {
  onReviewSubmit?: (appId: string) => void;
}

export default function ApplicationsTab({ onReviewSubmit }: ApplicationsTabProps) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  const filters = [
    { id: 'All', label: 'All (1,248)', code: 'All' },
    { id: 'Applied', label: 'Applied (648)', code: 'Applied' },
    { id: 'Under Review', label: 'Under Review (320)', code: 'Under Review' },
    { id: 'Shortlisted', label: 'Shortlisted (154)', code: 'Shortlisted' },
    { id: 'Interview Scheduled', label: 'Interview (78)', code: 'Interview Scheduled' },
    { id: 'Selected', label: 'Selected (28)', code: 'Selected' },
    { id: 'Rejected', label: 'Rejected (18)', code: 'Rejected' },
  ];

  const applicationsList = [
    { id: '1', studentName: 'Rahul Kumar', dept: 'CSE', company: 'TCS', role: 'Software Engineer', date: '10 May 2026', status: 'Interview Scheduled' },
    { id: '2', studentName: 'Anjali Sharma', dept: 'ECE', company: 'Infosys', role: 'System Engineer', date: '09 May 2026', status: 'Shortlisted' },
    { id: '3', studentName: 'Vikram Patel', dept: 'IT', company: 'Wipro', role: 'Associate Engineer', date: '08 May 2026', status: 'Under Review' },
    { id: '4', studentName: 'Neha Singh', dept: 'CSE', company: 'TCS', role: 'Software Engineer', date: '07 May 2026', status: 'Applied' },
    { id: '5', studentName: 'Arjun Mehta', dept: 'ME', company: 'Capgemini', role: 'Analyst', date: '06 May 2026', status: 'Under Review' },
    { id: '6', studentName: 'Pooja Verma', dept: 'ECE', company: 'Infosys', role: 'System Engineer', date: '05 May 2026', status: 'Shortlisted' },
    { id: '7', studentName: 'Rohit Jain', dept: 'CSE', company: 'Wipro', role: 'Project Engineer', date: '04 May 2026', status: 'Applied' },
    { id: '8', studentName: 'Sneha Reddy', dept: 'IT', company: 'TCS', role: 'Software Engineer', date: '03 May 2026', status: 'Rejected' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Interview Scheduled':
        return 'bg-violet-500/10 text-violet-500 border border-violet-500/20';
      case 'Shortlisted':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'Under Review':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'Applied':
        return 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20';
      case 'Selected':
        return 'bg-green-500/10 text-green-500 border border-green-500/20';
      case 'Rejected':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
    }
  };

  const filteredApps = applicationsList.filter((app) => {
    const matchesSearch = app.studentName.toLowerCase().includes(search.toLowerCase()) || 
                          app.company.toLowerCase().includes(search.toLowerCase()) ||
                          app.role.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = activeFilter === 'All' || app.status === activeFilter;
    const matchesDept = deptFilter === 'All' || app.dept === deptFilter;

    return matchesSearch && matchesFilter && matchesDept;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-app-text">Applications</h2>
          <p className="text-app-muted">Track status of campus-wide student job applications across all recruitment runs.</p>
        </div>
        <button 
          onClick={() => alert('Exporting all placement applications to standard CSV spreadsheet file...')}
          className="px-4 py-2.5 bg-app-surface text-app-text border border-app-border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all hover:bg-app-surface/90"
        >
          <Download className="w-4 h-4 text-app-muted" /> Export Applications
        </button>
      </div>

      {/* Horizontal filter tabs matching search dashboard */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-app-border/40">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.code)}
            className={`whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === f.code 
                ? 'bg-brand-blue text-white shadow-md' 
                : 'text-app-muted hover:text-app-text hover:bg-app-surface/60'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Search and drop-down filters */}
      <div className="p-5 rounded-[28px] glass border-app-border card-shadow flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search by student name, company, or job role..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:border-brand-blue transition-colors"
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select 
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue transition-all"
          >
            <option value="All">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="IT">IT</option>
            <option value="ME">ME</option>
          </select>
        </div>
      </div>

      {/* Main Table View */}
      <div className="glass border-app-border rounded-[28px] overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border/40 bg-app-surface/20">
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted pl-6">Student Name</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Company</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Applied Role</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Applied Date</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Approval Status</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-app-surface/30 transition-colors">
                    {/* Student Name */}
                    <td className="p-4.5 pl-6 font-semibold text-app-text flex items-center gap-3">
                      <img 
                        src={`https://picsum.photos/seed/${app.id}/100/100`} 
                        alt={app.studentName} 
                        className="w-8.5 h-8.5 rounded-full object-cover border border-app-border" 
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-extrabold text-sm text-app-text">{app.studentName}</div>
                        <div className="text-[10px] text-app-muted font-bold">{app.dept} Department</div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="p-4.5 font-bold text-app-text">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-brand-blue/10 text-brand-blue flex items-center justify-center font-display font-bold text-[10px]">
                          {app.company.substring(0,2).toUpperCase()}
                        </div>
                        <span>{app.company}</span>
                      </div>
                    </td>

                    {/* Applied Role */}
                    <td className="p-4.5 text-sm font-bold text-app-text">
                      {app.role}
                    </td>

                    {/* Applied On */}
                    <td className="p-4.5 text-xs font-semibold text-app-muted">
                      {app.date}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4.5 text-xs font-bold">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wide font-extrabold ${getStatusStyle(app.status)}`}>
                        {app.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="p-4.5 text-right pr-6">
                      <button 
                        onClick={() => alert(`Reviewing application status log for ${app.studentName} applying for ${app.role} driven by ${app.company}.\nStatus: ${app.status}`)}
                        className="px-3 py-1.5 hover:bg-brand-blue hover:text-white transition-all text-xs font-bold bg-app-surface border border-app-border rounded-lg text-app-text"
                      >
                        Review
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-app-muted text-sm font-semibold">
                    No applications matched the filtering requirements.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
