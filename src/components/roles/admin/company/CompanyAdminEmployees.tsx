import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Filter,
  Upload,
  Download
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  empId: string;
  dept: string;
  designation: string;
  status: 'Active' | 'Inactive';
  avatar: string;
  email: string;
}

interface CompanyAdminEmployeesProps {
  employeesList: Employee[];
  onAddEmployee: (newEmployee: Omit<Employee, 'id'>) => void;
  onEditEmployee: (updatedEmployee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  onBulkUpload: (employees: Omit<Employee, 'id'>[]) => void;
}

export default function CompanyAdminEmployees({ employeesList, onAddEmployee, onEditEmployee, onDeleteEmployee, onBulkUpload }: CompanyAdminEmployeesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmpId, setFormEmpId] = useState('');
  const [formDept, setFormDept] = useState('Engineering');
  const [formDesignation, setFormDesignation] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');

  const filteredEmployees = employeesList.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' ? true : emp.dept === deptFilter;
    const matchesStatus = statusFilter === 'All' ? true : emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setFormName('');
    setFormEmpId(`EMP${Math.floor(10000 + Math.random() * 90000)}`);
    setFormDept('Engineering');
    setFormDesignation('');
    setFormEmail('');
    setFormStatus('Active');
    setShowAddModal(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formDesignation || !formEmail) return;
    onAddEmployee({
      name: formName,
      empId: formEmpId,
      dept: formDept,
      designation: formDesignation,
      email: formEmail,
      status: formStatus,
      avatar: `https://picsum.photos/seed/${formName.replace(/\s+/g, '')}/100/100`
    });
    setShowAddModal(false);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setSelectedEmployee(emp);
    setFormName(emp.name);
    setFormEmpId(emp.empId);
    setFormDept(emp.dept);
    setFormDesignation(emp.designation);
    setFormEmail(emp.email);
    setFormStatus(emp.status);
    setShowEditModal(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !formName || !formDesignation || !formEmail) return;
    onEditEmployee({
      ...selectedEmployee,
      name: formName,
      empId: formEmpId,
      dept: formDept,
      designation: formDesignation,
      email: formEmail,
      status: formStatus
    });
    setShowEditModal(false);
  };

  const handleCsvBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Simulate parsing a beautiful CSV bulk import
    const simulatedEmployees: Omit<Employee, 'id'>[] = [
      { name: 'Arun Patel', empId: 'EMP10006', dept: 'Operations', designation: 'Operations Analyst', email: 'arun.patel@techsolutions.com', status: 'Active', avatar: 'https://picsum.photos/seed/arun/100/100' },
      { name: 'Kavya Reddy', empId: 'EMP10007', dept: 'Engineering', designation: 'QA Engineer', email: 'kavya.reddy@techsolutions.com', status: 'Active', avatar: 'https://picsum.photos/seed/kavya/100/100' },
      { name: 'Rohan Deshmukh', empId: 'EMP10008', dept: 'Product', designation: 'UI/UX Designer', email: 'rohan.deshmukh@techsolutions.com', status: 'Active', avatar: 'https://picsum.photos/seed/rohan/100/100' },
    ];
    
    onBulkUpload(simulatedEmployees);
    alert('Successfully imported 3 employee roster profiles from CSV roster template!');
  };

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Title + Action Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-app-text tracking-tight flex items-center gap-2">
            Company employees records
          </h1>
          <p className="text-app-muted text-sm font-medium mt-1">Directory of all staff and system users currently in service.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <label className="px-4 py-2.5 bg-app-surface border border-app-border text-app-text font-bold rounded-xl flex items-center gap-2 hover:bg-app-surface/60 transition-all text-xs shadow-sm cursor-pointer whitespace-nowrap">
            <Upload className="w-4 h-4 text-brand-blue" /> Roster Bulk Upload
            <input type="file" onChange={handleCsvBulkUpload} accept=".csv,.xlsx" className="hidden" />
          </label>
          <button 
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-brand-blue text-white font-bold rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-xs shadow-md whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3px]" /> Add Employee
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-3xl glass border border-app-border/80 card-shadow items-center">
        <div className="relative col-span-1 md:col-span-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search by name, ID, title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-app-surface/60 border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-semibold"
          />
        </div>

        <div className="flex items-center gap-2 col-span-1 select-none">
          <span className="text-xs font-black text-app-muted uppercase">Dept:</span>
          <select 
            value={deptFilter} 
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-app-surface border border-app-border text-app-text text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-brand-blue"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Data Science">Data Science</option>
            <option value="Sales">Sales</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

        <div className="flex items-center gap-2 col-span-1 select-none">
          <span className="text-xs font-black text-app-muted uppercase">Status:</span>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-app-surface border border-app-border text-app-text text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-brand-blue"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="glass border border-app-border rounded-[32px] card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border text-[10px] font-extrabold uppercase tracking-widest text-app-muted bg-app-surface/40">
                <th className="py-4.5 px-6">Employee name</th>
                <th className="py-4.5 px-6">Employee ID</th>
                <th className="py-4.5 px-6">Department</th>
                <th className="py-4.5 px-6">Designation</th>
                <th className="py-4.5 px-6 text-center">Status</th>
                <th className="py-4.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/50 text-xs font-semibold text-app-text">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-app-surface/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={emp.avatar} 
                          alt={emp.name} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-app-bg" 
                        />
                        <div>
                          <p className="font-extrabold text-sm text-app-text">{emp.name}</p>
                          <p className="text-[10px] text-app-muted font-bold font-mono mt-0.5">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-brand-blue font-mono">{emp.empId}</td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-app-muted uppercase tracking-wider text-[10px] bg-app-surface border border-app-border px-2.5 py-1 rounded-lg">
                        {emp.dept}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-app-text font-bold">{emp.designation}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black border ${
                        emp.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(emp)}
                          className="p-2 hover:bg-brand-blue/10 hover:text-brand-blue rounded-xl text-app-muted transition-all"
                          title="Edit Employee"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDeleteEmployee(emp.id)}
                          className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl text-app-muted transition-all"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-app-muted text-sm font-medium">
                    <Users className="w-10 h-10 mx-auto text-app-border mb-3" />
                    No employees found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SHOW EMPLOYEE MODALS */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-app-bg border border-app-border w-full max-w-md rounded-[32px] card-shadow overflow-hidden p-6 md:p-8 space-y-5 animate-scale-in">
            <h3 className="text-xl font-display font-black text-app-text">
              {showAddModal ? 'Register Employee Roster Record' : 'Modify Employee Details'}
            </h3>
            <p className="text-xs text-app-muted font-bold -mt-3 uppercase tracking-wider">
              OFFICIAL BUSINESS DIRECTORY SYNC
            </p>

            <form onSubmit={showAddModal ? handleCreate : handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-app-muted">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Vikram Joshi"
                    className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-app-muted">Employee ID</label>
                  <input 
                    type="text" 
                    required
                    value={formEmpId}
                    onChange={(e) => setFormEmpId(e.target.value)}
                    placeholder="e.g. EMP10003"
                    className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-app-muted">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="e.g. user@company.com"
                  className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-app-muted">Designation Title</label>
                <input 
                  type="text" 
                  required
                  value={formDesignation}
                  onChange={(e) => setFormDesignation(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
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
                  <label className="text-[10px] font-black uppercase text-app-muted">Status</label>
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
                  {showAddModal ? 'Register Profile' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
