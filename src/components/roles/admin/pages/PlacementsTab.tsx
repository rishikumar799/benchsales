import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  CheckCircle, 
  Sparkles,
  Building2
} from 'lucide-react';
import { db } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';
import { 
  collection, 
  onSnapshot 
} from 'firebase/firestore';

interface PlacementRecord {
  id: string;
  student: string;
  avatar: string;
  company: string;
  role: string;
  pkg: string;
  officer: string;
  joiningDate: string;
  status: string;
  dept: string;
}

export default function PlacementsTab() {
  const { userProfile } = useAuth();
  const organizationId = userProfile?.organizationId;

  const [records, setRecords] = useState<PlacementRecord[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Real-time Firestore Listener
  useEffect(() => {
    if (!organizationId) return;

    const placementsCol = collection(db, 'organizations_universities', organizationId, 'placements');
    const unsub = onSnapshot(placementsCol, (snap) => {
      const list = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          student: data.student || '',
          avatar: data.avatar || `https://picsum.photos/seed/${doc.id}/100/100`,
          company: data.company || '',
          role: data.role || 'Software Engineer',
          pkg: data.pkg || data.package || '4.50 LPA',
          officer: data.officer || '',
          joiningDate: data.joiningDate || '15 Jul 2026',
          status: data.status || 'Confirmed',
          dept: data.dept || 'CSE'
        } as PlacementRecord;
      });
      setRecords(list);
    });

    return () => unsub();
  }, [organizationId]);

  // Unique list of companies and departments for filters
  const uniqueCompanies = Array.from(new Set(records.map(r => r.company).filter(Boolean)));
  const uniqueDepts = Array.from(new Set(records.map(r => r.dept).filter(Boolean)));

  // Filters logic
  const filteredRecords = records.filter(rec => {
    const matchesSearch = rec.student.toLowerCase().includes(search.toLowerCase()) || 
                          rec.role.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All' || rec.dept === selectedDept;
    const matchesCompany = selectedCompany === 'All' || rec.company === selectedCompany;

    return matchesSearch && matchesDept && matchesCompany;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    alert(`Generating consolidated Excel report sheet of ${records.length} placed scholars for Batch 2026...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-black text-app-text tracking-tight h-10 flex items-center">Placements</h2>
          <p className="text-xs text-app-muted font-bold mt-1">Track all student placements, customized salary package offers, and verified joining details.</p>
        </div>

        <button 
          onClick={handleExport}
          className="px-4 py-2.5 bg-app-surface hover:bg-app-surface/90 border border-app-border rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer text-app-text shadow-sm"
        >
          <Download className="w-4 h-4 text-brand-blue" />
          <span>Export Records</span>
        </button>
      </div>

      {/* Control / Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-app-surface/60 border border-app-border flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search placed scholar or role..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-brand-blue transition-colors"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap w-full md:w-auto items-center gap-3">
          {/* Department */}
          <div className="flex-1 md:flex-initial min-w-[130px]">
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3 text-xs font-bold text-app-muted focus:outline-none cursor-pointer"
            >
              <option value="All">All Departments</option>
              {uniqueDepts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Company */}
          <div className="flex-1 md:flex-initial min-w-[130px]">
            <select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3 text-xs font-bold text-app-muted focus:outline-none cursor-pointer"
            >
              <option value="All">All Companies</option>
              {uniqueCompanies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table listing */}
      <div className="bg-app-surface/60 border border-app-border rounded-[32px] overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-app-border text-left text-[10px] font-extrabold uppercase tracking-widest text-app-muted bg-app-bg/20 h-12">
                <th className="pl-6 py-3">Student Name</th>
                <th className="py-3">Company</th>
                <th className="py-3">Role</th>
                <th className="py-3 text-center">Package</th>
                <th className="py-3">Placement Officer</th>
                <th className="py-3">Joining Date</th>
                <th className="pr-6 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((rec) => (
                  <tr key={rec.id} className="group hover:bg-app-surface/40 transition-colors">
                    {/* Student */}
                    <td className="pl-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img 
                          src={rec.avatar} 
                          alt={rec.student} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-app-bg" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="text-sm font-extrabold text-app-text tracking-tight flex items-center gap-2">
                            <span>{rec.student}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-app-bg border border-app-border font-mono font-bold text-app-muted">{rec.dept}</span>
                          </div>
                          <span className="text-[10px] text-app-muted font-bold block mt-0.5">{userProfile?.organizationName || "St. Xavier's University"}</span>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-bold text-app-text text-xs">
                        <Building2 className="w-4 h-4 text-app-muted" />
                        <span>{rec.company}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 whitespace-nowrap text-xs font-semibold text-app-muted">
                      {rec.role}
                    </td>

                    {/* Package */}
                    <td className="py-4 whitespace-nowrap text-center text-sm font-black text-brand-violet">
                      {rec.pkg}
                    </td>

                    {/* Placement Officer */}
                    <td className="py-4 whitespace-nowrap text-xs font-semibold text-app-muted">
                      {rec.officer}
                    </td>

                    {/* Joining Date */}
                    <td className="py-4 whitespace-nowrap text-xs font-bold text-app-text">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-app-muted" />
                        <span>{rec.joiningDate}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="pr-6 py-4 whitespace-nowrap text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider bg-emerald-500/10 border-emerald-500/20 text-emerald-500">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        <span>{rec.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-app-muted font-bold text-sm">
                    No placement records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 sm:p-5 border-t border-app-border flex justify-between items-center bg-app-bg/10">
          <span className="text-xs text-app-muted font-bold">
            Showing <strong className="text-app-text font-black">{Math.min(startIndex + 1, filteredRecords.length)}-{Math.min(startIndex + itemsPerPage, filteredRecords.length)}</strong> of <strong className="text-app-text font-black">{filteredRecords.length}</strong> placement endorsement records
          </span>

          <div className="flex items-center gap-1.5">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="p-2 border border-app-border rounded-xl text-app-muted hover:text-app-text disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
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
              className="p-2 border border-app-border rounded-xl text-app-muted hover:text-app-text disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
