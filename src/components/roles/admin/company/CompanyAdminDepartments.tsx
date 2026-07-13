import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Briefcase,
  AlertCircle,
  FolderOpen
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface Employee {
  id: string;
  dept: string;
}

interface CompanyAdminDepartmentsProps {
  departmentsList: Department[];
  employeesList: Employee[];
  onAddDepartment: (newDept: Omit<Department, 'id' | 'createdAt'>) => Promise<boolean>;
  onEditDepartment: (updatedDept: Department) => Promise<boolean>;
  onDeleteDepartment: (id: string) => Promise<void>;
}

export default function CompanyAdminDepartments({ 
  departmentsList, 
  employeesList, 
  onAddDepartment, 
  onEditDepartment, 
  onDeleteDepartment 
}: CompanyAdminDepartmentsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const filteredDepts = departmentsList.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStaffCount = (deptName: string) => {
    return employeesList.filter(emp => emp.dept?.toLowerCase() === deptName.toLowerCase()).length;
  };

  const handleOpenAddModal = () => {
    setFormName('');
    setFormDescription('');
    setErrorMsg('');
    setShowAddModal(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formName.trim()) {
      setErrorMsg('Department name is required.');
      return;
    }

    // Duplicate check
    const isDuplicate = departmentsList.some(
      d => d.name.trim().toLowerCase() === formName.trim().toLowerCase()
    );
    if (isDuplicate) {
      setErrorMsg(`A department named "${formName.trim()}" already exists.`);
      return;
    }

    const success = await onAddDepartment({
      name: formName.trim(),
      description: formDescription.trim()
    });

    if (success) {
      setShowAddModal(false);
    } else {
      setErrorMsg('Failed to create department. Please try again.');
    }
  };

  const handleOpenEditModal = (dept: Department) => {
    setSelectedDept(dept);
    setFormName(dept.name);
    setFormDescription(dept.description);
    setErrorMsg('');
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!selectedDept) return;
    if (!formName.trim()) {
      setErrorMsg('Department name is required.');
      return;
    }

    // Duplicate check excluding self
    const isDuplicate = departmentsList.some(
      d => d.id !== selectedDept.id && d.name.trim().toLowerCase() === formName.trim().toLowerCase()
    );
    if (isDuplicate) {
      setErrorMsg(`A department named "${formName.trim()}" already exists.`);
      return;
    }

    const success = await onEditDepartment({
      ...selectedDept,
      name: formName.trim(),
      description: formDescription.trim()
    });

    if (success) {
      setShowEditModal(false);
    } else {
      setErrorMsg('Failed to update department. Please try again.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-app-text" id="departments-tab-root">
      
      {/* Title + Action Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-app-text tracking-tight flex items-center gap-2">
            Company Departments
          </h1>
          <p className="text-app-muted text-sm font-medium mt-1">
            Organize, list and structure business departments and calculate active personnel sizes.
          </p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-brand-blue text-white font-bold rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-xs shadow-md"
          id="btn-add-department"
        >
          <Plus className="w-4 h-4 stroke-[3px]" /> Create Department
        </button>
      </div>

      {/* Search Input */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-6 rounded-3xl glass border border-app-border/80 card-shadow">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search departments by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-app-surface/60 border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-semibold"
          />
        </div>
        <div className="text-xs font-bold text-app-muted">
          Total Departments: <strong className="text-brand-blue">{departmentsList.length}</strong>
        </div>
      </div>

      {/* Departments Grid/Table */}
      <div className="glass border border-app-border rounded-[32px] card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border text-[10px] font-extrabold uppercase tracking-widest text-app-muted bg-app-surface/40">
                <th className="py-4.5 px-6">Department Name</th>
                <th className="py-4.5 px-6">Description</th>
                <th className="py-4.5 px-6 text-center">Staff Count</th>
                <th className="py-4.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/50 text-xs font-semibold">
              {filteredDepts.length > 0 ? (
                filteredDepts.map((dept) => (
                  <tr key={dept.id} className="hover:bg-app-surface/20 transition-colors" id={`dept-row-${dept.id}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span className="font-extrabold text-sm text-app-text">{dept.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-app-muted max-w-xs truncate">{dept.description || 'No description provided'}</td>
                    <td className="py-4 px-6 text-center text-sm font-bold text-brand-violet">{getStaffCount(dept.name)}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(dept)}
                          className="p-2 hover:bg-brand-blue/10 hover:text-brand-blue rounded-xl text-app-muted transition-all cursor-pointer"
                          title="Edit Department"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete department "${dept.name}"?`)) {
                              onDeleteDepartment(dept.id);
                            }
                          }}
                          className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl text-app-muted transition-all cursor-pointer"
                          title="Delete Department"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-app-muted text-sm font-medium">
                    <FolderOpen className="w-10 h-10 mx-auto text-app-border mb-3" />
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-app-bg border border-app-border w-full max-w-md rounded-[32px] card-shadow overflow-hidden p-6 md:p-8 space-y-5 animate-scale-in">
            <h3 className="text-xl font-display font-black text-app-text">
              {showAddModal ? 'Create Department' : 'Modify Department'}
            </h3>
            <p className="text-xs text-app-muted font-bold -mt-3 uppercase tracking-wider">
              CORPORATE DEPARTMENTS MANAGER
            </p>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={showAddModal ? handleCreate : handleUpdate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-app-muted">Department Name</label>
                <input 
                  type="text" 
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Data Science"
                  className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-app-muted">Description</label>
                <textarea 
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Machine learning models and analytical dashboards development division."
                  rows={3}
                  className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-semibold resize-none"
                />
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
                  {showAddModal ? 'Create Department' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
