import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit, 
  ChevronRight, 
  X, 
  CheckCircle, 
  AlertTriangle,
  FileCheck,
  Building
} from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  type: 'University' | 'Company';
  users: number;
  plan: 'Enterprise' | 'Professional' | 'Starter';
  status: 'Active' | 'Suspended';
  joinedDate: string;
}

interface PlatformOrganizationsProps {
  organizationsList: Organization[];
  onAddOrg: (newOrg: Omit<Organization, 'id' | 'users' | 'joinedDate'>) => void;
  onEditOrg: (updatedOrg: Organization) => void;
  onDeleteOrg: (orgId: string) => void;
}

export default function PlatformOrganizations({ 
  organizationsList, 
  onAddOrg, 
  onEditOrg, 
  onDeleteOrg 
}: PlatformOrganizationsProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  // Form Field States
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<'University' | 'Company'>('University');
  const [formPlan, setFormPlan] = useState<'Enterprise' | 'Professional' | 'Starter'>('Enterprise');
  const [formStatus, setFormStatus] = useState<'Active' | 'Suspended'>('Active');

  // Filtered List
  const filteredOrgs = organizationsList.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(search.toLowerCase()) || org.id.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || org.type === typeFilter;
    const matchesPlan = planFilter === 'All' || org.plan === planFilter;
    const matchesStatus = statusFilter === 'All' || org.status === statusFilter;
    return matchesSearch && matchesType && matchesPlan && matchesStatus;
  });

  const handleOpenAdd = () => {
    setFormName('');
    setFormType('University');
    setFormPlan('Enterprise');
    setFormStatus('Active');
    setEditingOrg(null);
    setIsAddOpen(true);
  };

  const handleOpenEdit = (org: Organization) => {
    setEditingOrg(org);
    setFormName(org.name);
    setFormType(org.type);
    setFormPlan(org.plan);
    setFormStatus(org.status);
    setIsAddOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingOrg) {
      onEditOrg({
        ...editingOrg,
        name: formName,
        type: formType,
        plan: formPlan,
        status: formStatus
      });
    } else {
      onAddOrg({
        name: formName,
        type: formType,
        plan: formPlan,
        status: formStatus
      });
    }
    setIsAddOpen(false);
  };

  const totalCount = organizationsList.length;
  const activeCount = organizationsList.filter(o => o.status === 'Active').length;
  const suspendedCount = organizationsList.filter(o => o.status === 'Suspended').length;

  return (
    <div id="platform-orgs-view" className="space-y-6">
      {/* Organizations Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Organizations', value: totalCount, color: 'text-violet-500', detail: 'Across ecosystems' },
          { label: 'Active Organizations', value: activeCount, color: 'text-emerald-500', detail: 'Serving tenants' },
          { label: 'Suspended Orgs', value: suspendedCount, color: 'text-rose-500', detail: 'Restricted access' },
          { label: 'Created This Month', value: '28', color: 'text-blue-500', detail: '+12% MoM growth' },
        ].map((st, idx) => (
          <div key={idx} className="p-6 rounded-[32px] glass border-app-border card-shadow">
            <span className="text-xs font-bold uppercase tracking-widest text-app-muted">{st.label}</span>
            <div className={`text-3xl font-display font-bold mt-1 ${st.color}`}>{st.value}</div>
            <span className="text-[10px] text-app-muted mt-1 block font-medium">{st.detail}</span>
          </div>
        ))}
      </div>

      {/* Main Board Card */}
      <div className="p-6 sm:p-8 rounded-[32px] glass border-app-border card-shadow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-display font-bold">Registered Tenant Organizations</h3>
            <p className="text-app-muted text-xs mt-1">Configure and manage secure database boundaries for corporate and university clients.</p>
          </div>
          <button 
            onClick={handleOpenAdd}
            className="px-5 py-3 bg-brand-blue text-white font-bold text-xs rounded-xl flex items-center gap-2 w-max cursor-pointer hover:bg-brand-blue/90"
          >
            <Plus className="w-4 h-4" /> Add Tenant Organization
          </button>
        </div>

        {/* Filters Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
            <input 
              type="text" 
              placeholder="Search organizations by name or tenant ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-app-surface border border-app-border text-xs text-app-text focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-app-surface border border-app-border text-xs font-semibold text-app-text focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="University">Universities</option>
              <option value="Company">Companies</option>
            </select>
            <select 
              value={planFilter} 
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-app-surface border border-app-border text-xs font-semibold text-app-text focus:outline-none"
            >
              <option value="All">All Plans</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Professional">Professional</option>
              <option value="Starter">Starter</option>
            </select>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-app-surface border border-app-border text-xs font-semibold text-app-text focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Organizations Table List */}
        <div className="overflow-x-auto rounded-2xl border border-app-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-app-surface border-b border-app-border text-[10px] font-bold uppercase tracking-wider text-app-muted">
                <th className="py-4 px-6">Organization</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4">Active Users</th>
                <th className="py-4 px-4">Billing Plan</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Joined On</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40 text-xs text-app-text">
              {filteredOrgs.length > 0 ? (
                filteredOrgs.map((org) => (
                  <tr key={org.id} className="hover:bg-app-surface/20 transition-all">
                    <td className="py-4 px-6 font-semibold">
                      <div>
                        <div className="font-bold text-app-text text-sm">{org.name}</div>
                        <div className="text-[10px] font-mono text-app-muted mt-0.5">{org.id}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-app-text">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        org.type === 'University' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                      }`}>
                        {org.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-app-muted">{org.users.toLocaleString()} Accounts</td>
                    <td className="py-4 px-4 font-semibold text-app-text">
                      <span className={`font-mono text-[10px] px-2 py-0.5 border rounded-md uppercase tracking-wider ${
                        org.plan === 'Enterprise' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' :
                        org.plan === 'Professional' ? 'border-violet-500/30 text-violet-500 bg-violet-500/5' :
                        'border-gray-500/30 text-gray-400 bg-gray-500/5'
                      }`}>
                        {org.plan}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        org.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${org.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {org.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-app-muted font-medium">{org.joinedDate}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleOpenEdit(org)}
                          className="p-1 px-2.5 border border-app-border rounded-lg bg-app-surface text-app-text hover:bg-app-surface/60 transition-all font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" /> Toggle
                        </button>
                        <button 
                          onClick={() => onDeleteOrg(org.id)}
                          className="p-1.5 border border-rose-500/20 text-rose-500 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-app-muted">
                    No tenant organizations matched the selection criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Tenant Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-[32px] bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 text-white"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <h3 className="text-xl font-display font-bold">
                  {editingOrg ? 'Toggle Tenant Configuration' : 'Provision New Tenant Organization'}
                </h3>
                <button onClick={() => setIsAddOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-800 transition-all">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5 text-left">
                  <label className="text-slate-400 block ml-1">Organization Legal Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Stanford University, Google India Pvt. Ltd"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-slate-400 block ml-1">Sector Ecosystem</label>
                    <select 
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as 'University' | 'Company')}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                    >
                      <option value="University">University Ecosystem</option>
                      <option value="Company">Corporate Ecosystem</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-slate-400 block ml-1">Billing Tier</label>
                    <select 
                      value={formPlan}
                      onChange={(e) => setFormPlan(e.target.value as 'Enterprise' | 'Professional' | 'Starter')}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                    >
                      <option value="Enterprise">Enterprise Elite</option>
                      <option value="Professional">Professional Standard</option>
                      <option value="Starter">Starter Sandbox</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-slate-400 block ml-1">Isolation Status</label>
                  <select 
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Suspended')}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Active">Active (Operations Enabled)</option>
                    <option value="Suspended">Suspended (Locked/Isolated)</option>
                  </select>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1.5 text-[11px] text-amber-400">
                  <div className="flex gap-2 items-center font-bold">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" /> Cloud Database Automation Triggered
                  </div>
                  <span>Provisioning triggers automated Cloud SQL schema isolation, setting dedicated tenant credentials and isolated security boundaries instantly.</span>
                </div>

                <div className="flex gap-3 pt-4 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setIsAddOpen(false)}
                    className="px-5 py-3 border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-blue/90 transition-all cursor-pointer"
                  >
                    {editingOrg ? 'Save Settings' : 'Provision Cluster'}
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
