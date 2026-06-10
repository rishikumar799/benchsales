import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Users, 
  Briefcase, 
  Mail, 
  Phone,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';

interface Officer {
  id: string;
  name: string;
  dept: string;
  email: string;
  phone: string;
  opportunities: number;
  placements: number;
  status: string;
  avatar: string;
}

interface OfficersTabProps {
  officersList: Officer[];
  onAddOfficer: () => void;
  onStatusChange: (id: string, newStatus: string) => void;
  onDeleteOfficer?: (id: string) => void;
  onViewOfficer: (officer: Officer) => void;
}

export default function OfficersTab({ 
  officersList, 
  onAddOfficer, 
  onStatusChange,
  onViewOfficer
}: OfficersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter officers
  const filteredOfficers = officersList.filter((officer) => {
    const matchesSearch = officer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          officer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          officer.dept.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || officer.dept.toLowerCase().includes(selectedDept.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || officer.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOfficers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOfficers = filteredOfficers.slice(startIndex, startIndex + itemsPerPage);

  // Departments
  const depts = [
    { value: 'All', label: 'All Departments' },
    { value: 'Training', label: 'Training & Placement' },
    { value: 'Placement Cell', label: 'Placement Cell' },
    { value: 'Engineering', label: 'Engineering Dept.' },
    { value: 'Management', label: 'Management Dept.' },
    { value: 'Computer', label: 'Computer Applications' },
    { value: 'Sciences', label: 'Sciences' },
    { value: 'Commerce', label: 'Commerce' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-black text-app-text tracking-tight">Placement Officers</h2>
          <p className="text-xs text-app-muted font-bold mt-1">Manage and oversee all career & placement cells across university departments.</p>
        </div>
        <button 
          onClick={onAddOfficer}
          className="px-4 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-brand-blue/15 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Placement Officer
        </button>
      </div>

      {/* Control / Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-app-surface/60 border border-app-border flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search officers by name, email or department..."
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
          <div className="flex-1 md:flex-initial min-w-[130px]">
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3 text-xs font-bold text-app-muted focus:outline-none focus:border-brand-blue cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="Training">Training & Placement</option>
              <option value="Placement Cell">Placement Cell</option>
              <option value="Engineering">Engineering Dept.</option>
              <option value="Management">Management Dept.</option>
              <option value="Computer">Computer Applications</option>
              <option value="Sciences">Sciences</option>
              <option value="Commerce">Commerce</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex-1 md:flex-initial min-w-[110px]">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3 text-xs font-bold text-app-muted focus:outline-none focus:border-brand-blue cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>

          <button className="p-2.5 border border-app-border bg-app-bg text-app-muted hover:text-app-text hover:bg-app-surface transition-all rounded-xl flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Officers Table Card */}
      <div className="bg-app-surface/60 border border-app-border rounded-[32px] overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-app-border text-left text-[10px] font-extrabold uppercase tracking-widest text-app-muted bg-app-bg/20 h-12">
                <th className="pl-6 py-3">Officer Name</th>
                <th className="py-3">Department</th>
                <th className="py-3">Email Address</th>
                <th className="py-3 text-center">Opportunities</th>
                <th className="py-3 text-center">Placements</th>
                <th className="py-3 text-center">Status</th>
                <th className="pr-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/60">
              <AnimatePresence mode="popLayout">
                {paginatedOfficers.length > 0 ? (
                  paginatedOfficers.map((officer) => (
                    <motion.tr 
                      key={officer.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-app-surface/40 transition-colors"
                    >
                      <td className="pl-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img 
                            src={officer.avatar} 
                            alt={officer.name} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-app-bg shadow-sm" 
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="text-sm font-extrabold text-app-text leading-snug group-hover:text-brand-blue transition-colors">
                              {officer.name}
                            </div>
                            <div className="text-[10px] text-app-muted font-bold mt-0.5">St. Xavier's University</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 whitespace-nowrap">
                        <span className="text-xs font-bold text-app-text bg-app-bg px-2.5 py-1.5 rounded-lg border border-app-border">
                          {officer.dept}
                        </span>
                      </td>

                      <td className="py-4 whitespace-nowrap text-xs font-semibold text-app-muted">
                        {officer.email}
                      </td>

                      <td className="py-4 whitespace-nowrap text-center text-sm font-black text-brand-violet">
                        {officer.opportunities}
                      </td>

                      <td className="py-4 whitespace-nowrap text-center text-sm font-black text-emerald-500">
                        {officer.placements}
                      </td>

                      <td className="py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => onStatusChange(officer.id, officer.status === 'Active' ? 'Inactive' : 'Active')}
                          title="Click to toggle status"
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-extrabold border tracking-wider uppercase transition-all ${
                            officer.status === 'Active' 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/15' 
                              : 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/15'
                          }`}
                        >
                          {officer.status === 'Active' ? (
                            <>
                              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <span className="w-1 h-1 rounded-full bg-red-500" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="pr-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 text-xs">
                          <button 
                            onClick={() => onViewOfficer(officer)}
                            className="p-1 px-2 text-[11px] font-bold text-brand-blue hover:bg-brand-blue/10 rounded-lg flex items-center gap-1 transition-all"
                            title="View full credentials and performance analytics"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                          
                          <button className="p-1.5 text-app-muted hover:text-app-text rounded-lg transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-app-muted font-bold text-sm">
                      No matching placement officers found inside Central Registry.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="p-4 sm:p-5 border-t border-app-border flex justify-between items-center bg-app-bg/10">
          <span className="text-xs text-app-muted font-bold">
            Showing <strong className="text-app-text font-black">{Math.min(startIndex + 1, filteredOfficers.length)}-{Math.min(startIndex + itemsPerPage, filteredOfficers.length)}</strong> of <strong className="text-app-text font-black">{filteredOfficers.length}</strong> officers
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
                      ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/10' 
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
    </div>
  );
}
