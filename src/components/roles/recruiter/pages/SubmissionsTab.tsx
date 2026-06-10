import { useState } from 'react';
import { 
  Search, 
  Download, 
  CheckCircle, 
  XSquare, 
  HelpCircle, 
  Clock, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

interface SubmissionsTabProps {
  onAddLogMessage?: (msg: string) => void;
}

interface Submission {
  id: string;
  candidateName: string;
  jobTitle: string;
  submittedOn: string;
  status: 'Submitted' | 'Shortlisted' | 'In Progress' | 'Rejected';
  lastUpdated: string;
}

export default function SubmissionsTab({ onAddLogMessage }: SubmissionsTabProps) {
  
  // High fidelity submissions matching image #6 exactly
  const [submissions, setSubmissions] = useState<Submission[]>([
    { id: '1', candidateName: 'Ravi Kumar', jobTitle: 'Frontend Developer', submittedOn: '10 Jun 2026', status: 'Submitted', lastUpdated: '10 Jun 2026' },
    { id: '2', candidateName: 'Akash Reddy', jobTitle: 'DevOps Engineer', submittedOn: '09 Jun 2026', status: 'Shortlisted', lastUpdated: '10 Jun 2026' },
    { id: '3', candidateName: 'Sneha Iyer', jobTitle: 'Backend Developer', submittedOn: '08 Jun 2026', status: 'In Progress', lastUpdated: '09 Jun 2026' },
    { id: '4', candidateName: 'Priya Sharma', jobTitle: 'Java Developer', submittedOn: '07 Jun 2026', status: 'Submitted', lastUpdated: '08 Jun 2026' },
    { id: '5', candidateName: 'Karthik Nair', jobTitle: 'QA Engineer', submittedOn: '06 Jun 2026', status: 'Rejected', lastUpdated: '06 Jun 2026' },
    { id: '6', candidateName: 'Pavan Kumar', jobTitle: 'Java Developer', submittedOn: '05 Jun 2026', status: 'In Progress', lastUpdated: '05 Jun 2026' },
    { id: '7', candidateName: 'Neha Verma', jobTitle: 'UI/UX Designer', submittedOn: '04 Jun 2026', status: 'Shortlisted', lastUpdated: '04 Jun 2026' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [jobFilter, setJobFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [exporting, setExporting] = useState(false);

  // Simulated export function
  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      alert('Submissions report downloaded successfully as csv/excel format!');
    }, 1500);
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sub.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesJob = jobFilter === 'All' || sub.jobTitle === jobFilter;
    const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;

    return matchesSearch && matchesJob && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text">Submissions (42)</h1>
          <p className="text-app-muted mt-1">Track all candidates you have submitted across different jobs.</p>
        </div>
        <button 
          onClick={handleExport}
          className="px-5 py-3.5 bg-brand-blue/10 hover:bg-brand-blue/15 text-brand-blue font-extrabold rounded-2xl flex items-center gap-2 text-xs transition-all active:scale-95 shrink-0 border border-brand-blue/20"
        >
          {exporting ? (
            <>
              <span className="w-4 h-4 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Export Report
            </>
          )}
        </button>
      </div>

      {/* Filters bar */}
      <div className="p-4 rounded-2xl glass border border-app-border flex flex-col xl:flex-row gap-4 items-center justify-between">
        
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search by candidate or job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          {/* Job Filter */}
          <select 
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-4 py-3 text-xs font-semibold text-app-text outline-none cursor-pointer flex-1"
          >
            <option value="All">All Jobs (All)</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Java Developer">Java Developer</option>
            <option value="QA Engineer">QA Engineer</option>
            <option value="UI/UX Designer">UI/UX Designer</option>
          </select>

          {/* Status Filter */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-4 py-3 text-xs font-semibold text-app-text outline-none cursor-pointer flex-1"
          >
            <option value="All">All Statuses (All)</option>
            <option value="Submitted">Submitted</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="In Progress">In Progress</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

      </div>

      {/* Submissions table */}
      <div className="p-6 rounded-[28px] glass border border-app-border card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border text-xs font-extrabold text-app-muted uppercase tracking-wider">
                <th className="py-4 px-3 w-12 text-center">#</th>
                <th className="py-4 px-4">Candidate</th>
                <th className="py-4 px-4">Job</th>
                <th className="py-4 px-4">Submitted On</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40 text-sm">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub, index) => {
                  
                  // Style configurations
                  let pillStyle = '';
                  if (sub.status === 'Submitted') {
                    pillStyle = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                  } else if (sub.status === 'Shortlisted') {
                    pillStyle = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
                  } else if (sub.status === 'In Progress') {
                    pillStyle = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
                  } else if (sub.status === 'Rejected') {
                    pillStyle = 'bg-red-500/10 text-red-500 border-red-500/20';
                  }

                  return (
                    <tr key={sub.id} className="hover:bg-app-surface/30 transition-colors">
                      <td className="py-4 px-3 text-center text-xs font-mono font-bold text-app-muted">{index + 1}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-violet/10 flex items-center justify-center text-brand-violet text-[11px] font-extrabold font-mono shrink-0">
                            {sub.candidateName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <span className="font-bold text-app-text block">{sub.candidateName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs font-extrabold text-app-muted uppercase tracking-wider group-hover:text-app-text">
                        {sub.jobTitle}
                      </td>
                      <td className="py-4 px-4 font-semibold text-app-text text-xs font-mono">{sub.submittedOn}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full border ${pillStyle}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-app-muted text-xs font-mono">{sub.lastUpdated}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-app-muted">
                    <AlertCircle className="w-10 h-10 text-app-muted mx-auto mb-3" />
                    <p className="font-semibold text-app-text text-sm">No submissions matched active filters</p>
                    <p className="text-xs text-app-muted mt-1">Refine your keyword search or filter variables.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination component as seen in Image 6 */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-2">
        <button className="p-2 border border-app-border rounded-xl text-app-muted hover:text-app-text bg-app-surface hover:bg-app-surface/80 text-xs">
          {'<'}
        </button>
        <button className="w-8 h-8 rounded-xl font-bold bg-brand-blue text-white text-xs">1</button>
        <button className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">2</button>
        <button className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">3</button>
        <span className="text-app-muted px-1 text-xs">...</span>
        <button className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">7</button>
        <button className="p-2 border border-app-border rounded-xl text-app-muted hover:text-app-text bg-app-surface hover:bg-app-surface/80 text-xs">
          {'>'}
        </button>
      </div>

    </div>
  );
}