import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Search, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Eye,
  Settings
} from 'lucide-react';
import { db } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';
import { 
  collection, 
  doc, 
  onSnapshot, 
  updateDoc 
} from 'firebase/firestore';

interface Opportunity {
  id: string;
  title: string;
  company: string;
  officer: string;
  applicants: number;
  status: string;
  visibility: string;
  pkg: string;
}

export default function OpportunitiesTab() {
  const { userProfile } = useAuth();
  const organizationId = userProfile?.organizationId;

  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [search, setSearch] = useState('');
  const [officerFilter, setOfficerFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [visibilityFilter, setVisibilityFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Real-time Firestore Sync
  useEffect(() => {
    if (!organizationId) return;

    const oppsCol = collection(db, 'organizations_universities', organizationId, 'opportunities');
    const unsub = onSnapshot(oppsCol, (snap) => {
      const list = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || '',
          company: data.company || '',
          officer: data.officer || '',
          applicants: typeof data.applicants === 'number' ? data.applicants : parseInt(data.applicants || '0'),
          status: data.status || 'Active',
          visibility: data.visibility || 'My University',
          pkg: data.pkg || data.package || '4.5 LPA'
        } as Opportunity;
      });
      setOpps(list);
    });

    return () => unsub();
  }, [organizationId]);

  // Unique list of officers for the dropdown filter
  const uniqueOfficers = Array.from(new Set(opps.map(o => o.officer).filter(Boolean)));

  // Filters logic
  const filteredOpps = opps.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.company.toLowerCase().includes(search.toLowerCase());
    const matchesOfficer = officerFilter === 'All' || item.officer === officerFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesVisibility = visibilityFilter === 'All' || item.visibility === visibilityFilter;

    return matchesSearch && matchesOfficer && matchesStatus && matchesVisibility;
  });

  const totalPages = Math.ceil(filteredOpps.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOpps = filteredOpps.slice(startIndex, startIndex + itemsPerPage);

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
      case 'Inactive': return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      case 'Closed': return 'bg-red-500/10 border-red-500/20 text-red-400';
      default: return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
    }
  };

  const getVisibilityStyle = (vis: string) => {
    switch(vis) {
      case 'My University': return 'bg-brand-violet/5 border-brand-violet/15 text-brand-violet';
      case 'All Universities': return 'bg-brand-blue/5 border-brand-blue/15 text-brand-blue';
      case 'Selected Universities': return 'bg-pink-500/5 border-pink-500/15 text-pink-500';
      default: return 'bg-gray-500/5 border-gray-500/10 text-gray-500';
    }
  };

  const toggleStatus = async (id: string) => {
    if (!organizationId) return;
    const currentOpp = opps.find(o => o.id === id);
    if (!currentOpp) return;

    const nextStatus = currentOpp.status === 'Active' ? 'Inactive' : currentOpp.status === 'Inactive' ? 'Closed' : 'Active';
    const docRef = doc(db, 'organizations_universities', organizationId, 'opportunities', id);
    await updateDoc(docRef, { status: nextStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-black text-app-text tracking-tight h-10 flex items-center">Opportunities</h2>
        <p className="text-xs text-app-muted font-bold mt-1">
          Monitor job postings, campus placements drive invitations, and internships authorized by departments.
        </p>
      </div>

      {/* Filters bar */}
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-app-surface/60 border border-app-border flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search opportunity name or company..."
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
          {/* Officer */}
          <div className="flex-1 md:flex-initial min-w-[125px]">
            <select
              value={officerFilter}
              onChange={(e) => {
                setOfficerFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3 text-xs font-bold text-app-muted focus:outline-none cursor-pointer"
            >
              <option value="All">All Officers</option>
              {uniqueOfficers.map(off => (
                <option key={off} value={off}>{off}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex-1 md:flex-initial min-w-[100px]">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3 text-xs font-bold text-app-muted focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Visibility */}
          <div className="flex-1 md:flex-initial min-w-[130px]">
            <select
              value={visibilityFilter}
              onChange={(e) => {
                setVisibilityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3 text-xs font-bold text-app-muted focus:outline-none cursor-pointer"
            >
              <option value="All">All Visibility</option>
              <option value="My University">My University</option>
              <option value="All Universities">All Universities</option>
              <option value="Selected Universities">Selected Universities</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid listing */}
      <div className="bg-app-surface/60 border border-app-border rounded-[32px] overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-app-border text-left text-[10px] font-extrabold uppercase tracking-widest text-app-muted bg-app-bg/20 h-12">
                <th className="pl-6 py-3">Opportunity</th>
                <th className="py-3">Company</th>
                <th className="py-3">Placement Officer</th>
                <th className="py-3 text-center">Applicants</th>
                <th className="py-3 text-center">Status</th>
                <th className="py-3 text-center">Visibility</th>
                <th className="pr-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40">
              {paginatedOpps.length > 0 ? (
                paginatedOpps.map((opp) => (
                  <tr key={opp.id} className="group hover:bg-app-surface/40 transition-colors">
                    <td className="pl-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-extrabold text-app-text tracking-tight group-hover:text-brand-blue transition-all">
                            {opp.title}
                          </div>
                          <span className="text-[10px] text-app-muted font-bold block mt-0.5">Package: {opp.pkg}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-bold text-app-text text-xs">
                        <Building2 className="w-4 h-4 text-app-muted" />
                        <span>{opp.company}</span>
                      </div>
                    </td>

                    <td className="py-4 whitespace-nowrap text-xs font-semibold text-app-muted">
                      {opp.officer}
                    </td>

                    <td className="py-4 whitespace-nowrap text-center text-sm font-black text-brand-violet">
                      {opp.applicants}
                    </td>

                    <td className="py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => toggleStatus(opp.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider transition-colors cursor-pointer ${getStatusStyle(opp.status)}`}
                        title="Click to toggle status cycle"
                      >
                        <span>{opp.status}</span>
                      </button>
                    </td>

                    <td className="py-4 whitespace-nowrap text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-extrabold border ${getVisibilityStyle(opp.visibility)}`}>
                        {opp.visibility}
                      </span>
                    </td>

                    <td className="pr-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => alert(`Reviewing application log sheets for ${opp.title} authorized by ${opp.officer}.`)}
                        className="px-3.5 py-1.5 text-xs font-bold text-brand-blue hover:bg-brand-blue/10 rounded-xl transition-all cursor-pointer border border-transparent hover:border-brand-blue/15"
                      >
                        View Drive
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-app-muted font-bold text-sm">
                    No matching opportunities recorded within the university ecosystem.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 sm:p-5 border-t border-app-border flex justify-between items-center bg-app-bg/10">
          <span className="text-xs text-app-muted font-bold">
            Showing <strong className="text-app-text font-black">{Math.min(startIndex + 1, filteredOpps.length)}-{Math.min(startIndex + itemsPerPage, filteredOpps.length)}</strong> of <strong className="text-app-text font-black">{filteredOpps.length}</strong> opportunities
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
