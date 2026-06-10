import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Manager {
  id: string;
  name: string;
  dept: string;
  jobs: number;
  applications: number;
  hires: number;
  status: 'Active' | 'Inactive';
  avatar: string;
  email: string;
}

interface CompanyAdminManagersProps {
  managersList: Manager[];
  onAddManager: (newManager: Omit<Manager, 'id'>) => void;
  onEditManager: (updatedManager: Manager) => void;
  onDeleteManager: (id: string) => void;
}

export default function CompanyAdminManagers({ managersList, onAddManager, onEditManager, onDeleteManager }: CompanyAdminManagersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formDept, setFormDept] = useState('Engineering');
  const [formEmail, setFormEmail] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');

  const departments = ['All', 'Engineering', 'Product', 'Data Science', 'Sales', 'Operations', 'Finance'];

  const filteredManagers = managersList.filter(mgr => {
    const matchesSearch = mgr.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          mgr.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' ? true : mgr.dept === deptFilter;
    return matchesSearch && matchesDept;
  });

  const handleOpenAddModal = () => {
    setFormName('');
    setFormEmail('');
    setFormDept('Engineering');
    setFormStatus('Active');
    setShowAddModal(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;
    onAddManager({
      name: formName,
      dept: formDept,
      email: formEmail,
      jobs: 0,
      applications: 0,
      hires: 0,
      status: formStatus,
      avatar: `https://picsum.photos/seed/${formName.replace(/\s+/g, '')}/100/100`
    });
    setShowAddModal(false);
  };

  const handleOpenEditModal = (mgr: Manager) => {
    setSelectedManager(mgr);
    setFormName(mgr.name);
    setFormEmail(mgr.email);
    setFormDept(mgr.dept);
    setFormStatus(mgr.status);
    setShowEditModal(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedManager || !formName || !formEmail) return;
    onEditManager({
      ...selectedManager,
      name: formName,
      email: formEmail,
      dept: formDept,
      status: formStatus
    });
    setShowEditModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Title + Action Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-app-text tracking-tight flex items-center gap-2">
            Managers Administration
          </h1>
          <p className="text-app-muted text-sm font-medium mt-1">Manage and audit company organization leaders supervising personnel contracts.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-brand-blue text-white font-bold rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-xs shadow-md"
        >
          <Plus className="w-4 h-4 stroke-[3px]" /> Create Manager
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-6 rounded-3xl glass border border-app-border/80 card-shadow">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search managers profiles by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-app-surface/60 border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-semibold"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Filter className="w-4 h-4 text-app-muted hidden sm:inline" />
          <span className="text-xs font-bold text-app-muted uppercase mr-1 hidden sm:inline">Dept:</span>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {departments.slice(0, 5).map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                  deptFilter === dept 
                    ? 'bg-brand-blue border-brand-blue text-white' 
                    : 'bg-app-surface border-app-border text-app-muted hover:text-app-text hover:bg-app-surface/60'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Managers Table */}
      <div className="glass border border-app-border rounded-[32px] card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border text-[10px] font-extrabold uppercase tracking-widest text-app-muted bg-app-surface/40">
                <th className="py-4.5 px-6">Manager profile</th>
                <th className="py-4.5 px-6">Department</th>
                <th className="py-4.5 px-6 text-center">Active Jobs</th>
                <th className="py-4.5 px-6 text-center">Applications</th>
                <th className="py-4.5 px-6 text-center">Direct Hires</th>
                <th className="py-4.5 px-6 text-center">Status</th>
                <th className="py-4.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/50 text-xs font-semibold">
              {filteredManagers.length > 0 ? (
                filteredManagers.map((mgr) => (
                  <tr key={mgr.id} className="hover:bg-app-surface/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={mgr.avatar} 
                          alt={mgr.name} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-app-bg" 
                        />
                        <div>
                          <p className="font-extrabold text-sm text-app-text">{mgr.name}</p>
                          <p className="text-[10px] text-app-muted font-bold font-mono mt-0.5">{mgr.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-app-text bg-app-surface border border-app-border px-2.5 py-1 rounded-lg">
                        {mgr.dept}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-sm font-bold text-app-text">{mgr.jobs}</td>
                    <td className="py-4 px-6 text-center text-sm font-semibold text-app-text">{mgr.applications}</td>
                    <td className="py-4 px-6 text-center text-sm font-bold text-emerald-500">{mgr.hires}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black border ${
                        mgr.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${mgr.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {mgr.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(mgr)}
                          className="p-2 hover:bg-brand-blue/10 hover:text-brand-blue rounded-xl text-app-muted transition-all"
                          title="Edit Manager"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDeleteManager(mgr.id)}
                          className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl text-app-muted transition-all"
                          title="Delete Manager"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-app-muted text-sm font-medium">
                    <Users className="w-10 h-10 mx-auto text-app-border mb-3" />
                    No managers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SHOW EXQUISITE MODALS */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-app-bg border border-app-border w-full max-w-md rounded-[32px] card-shadow overflow-hidden p-6 md:p-8 space-y-5 animate-scale-in">
            <h3 className="text-xl font-display font-black text-app-text">
              {showAddModal ? 'Create Hiring Manager' : 'Modify Manager Details'}
            </h3>
            <p className="text-xs text-app-muted font-bold -mt-3 uppercase tracking-wider">
              ENTERPRISE ROSTER SYNC ENABLED
            </p>

            <form onSubmit={showAddModal ? handleCreate : handleUpdate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-app-muted">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Amit Verma"
                  className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-app-muted">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="e.g. amit.verma@company.com"
                  className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-app-muted">Department</label>
                  <select 
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-app-muted">Roster Status</label>
                  <select 
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Inactive')}
                    className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button 
                  type="button" 
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                  className="px-4 py-2.5 bg-app-surface border border-app-border text-app-muted rounded-xl hover:bg-app-surface/60 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-brand-blue text-white rounded-xl hover:bg-brand-blue/90 font-bold text-xs transition-colors"
                >
                  {showAddModal ? 'Create Profile' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
