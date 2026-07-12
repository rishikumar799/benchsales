import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Search, 
  Plus, 
  MapPin, 
  GraduationCap, 
  Users, 
  Building2, 
  MoreVertical, 
  Edit, 
  Eye, 
  DollarSign, 
  Sparkles,
  ClipboardList,
  Play,
  Pause,
  Trash2,
  X,
  PlusCircle,
  HelpCircle,
  Layers,
  AlertCircle
} from 'lucide-react';
import { collection, doc, onSnapshot, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';

interface OpportunitiesTabProps {
  onAddOpportunity: () => void;
  onEditOpportunity: (job: any) => void;
  onViewApplications: (jobId: string, jobTitle: string) => void;
  jobsList: any[];
}

export default function OpportunitiesTab({ onAddOpportunity, onEditOpportunity, onViewApplications, jobsList }: OpportunitiesTabProps) {
  const { userProfile } = useAuth();
  const organizationId = userProfile?.organizationId || 'default_university';

  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, Filters & Sorting
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Modal and edit states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<any | null>(null);

  // Form states
  const [formCompany, setFormCompany] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('Full Time');
  const [formSalary, setFormSalary] = useState('');
  const [formOpenings, setFormOpenings] = useState(5);
  const [formLocation, setFormLocation] = useState('');
  const [formDepts, setFormDepts] = useState('CSE');
  const [formBranches, setFormBranches] = useState('CSE');
  const [formCgpa, setFormCgpa] = useState(6.0);
  const [formDeadline, setFormDeadline] = useState('');
  const [formSkills, setFormSkills] = useState('');
  const [formRequirements, setFormRequirements] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState('open');
  const [formVisibility, setFormVisibility] = useState('My University');

  // Real-time onSnapshot subscriber with initial seeding
  useEffect(() => {
    if (!organizationId) return;

    const colRef = collection(db, 'organizations_universities', organizationId, 'opportunities');
    let unsubscribe: (() => void) | undefined;

    const setupListener = async () => {
      try {
        const snapshot = await getDocs(colRef);
        if (snapshot.empty) {
          const initial = [
            {
              opportunityId: 'opp_1',
              title: 'Software Engineer',
              companyName: 'TCS',
              companyId: 'company_tcs',
              description: 'Development and maintenance of software components.',
              requirements: 'B.Tech - 2026 Batch. Freshers only.',
              skills: ['Java', 'Spring Boot', 'SQL'],
              location: 'Hyderabad',
              employmentType: 'Full Time',
              salary: '4.5 LPA',
              openings: 15,
              eligibleDepartments: ['CSE', 'IT'],
              eligibleBranches: ['CSE', 'IT'],
              minimumCgpa: 6.5,
              deadline: '2026-06-15',
              status: 'open',
              createdBy: auth.currentUser?.uid || 'system',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              opportunityId: 'opp_2',
              title: 'System Engineer',
              companyName: 'Infosys',
              companyId: 'company_infosys',
              description: 'Configure, test, and support computer systems.',
              requirements: 'B.Tech / MCA - 2026 Batch.',
              skills: ['Python', 'Cloud Basics', 'Linux'],
              location: 'Bangalore',
              employmentType: 'Full Time',
              salary: '4.0 LPA',
              openings: 25,
              eligibleDepartments: ['CSE', 'ECE', 'IT'],
              eligibleBranches: ['CSE', 'ECE', 'IT'],
              minimumCgpa: 6.0,
              deadline: '2026-06-20',
              status: 'open',
              createdBy: auth.currentUser?.uid || 'system',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              opportunityId: 'opp_3',
              title: 'Associate Engineer',
              companyName: 'Wipro',
              companyId: 'company_wipro',
              description: 'Assisting in software development lifecycle activities.',
              requirements: 'Any Graduate - 2026.',
              skills: ['JavaScript', 'HTML/CSS', 'Git'],
              location: 'Chennai',
              employmentType: 'Full Time',
              salary: '3.5 LPA',
              openings: 10,
              eligibleDepartments: ['All Departments'],
              eligibleBranches: ['All Branches'],
              minimumCgpa: 5.5,
              deadline: '2026-06-25',
              status: 'paused',
              createdBy: auth.currentUser?.uid || 'system',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              opportunityId: 'opp_4',
              title: 'Analyst',
              companyName: 'Capgemini',
              companyId: 'company_capgemini',
              description: 'Analyze business processes and software specifications.',
              requirements: 'B.E / B.Tech - 2026.',
              skills: ['Excel', 'Data Analysis', 'SQL'],
              location: 'Pune',
              employmentType: 'Full Time',
              salary: '4.3 LPA',
              openings: 8,
              eligibleDepartments: ['ECE', 'CSE'],
              eligibleBranches: ['ECE', 'CSE'],
              minimumCgpa: 6.0,
              deadline: '2026-06-18',
              status: 'closed',
              createdBy: auth.currentUser?.uid || 'system',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ];

          for (const opp of initial) {
            await setDoc(doc(colRef, opp.opportunityId), opp);
          }
        }
      } catch (err) {
        console.error('Error seeding opportunities:', err);
      }

      unsubscribe = onSnapshot(colRef, (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data());
        });
        setOpportunities(list);
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, `organizations_universities/${organizationId}/opportunities`);
      });
    };

    setupListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [organizationId]);

  // Real-time counters calculation
  const totalOpportunities = opportunities.length;
  const openDrives = opportunities.filter(o => o.status === 'open').length;
  const pausedDrives = opportunities.filter(o => o.status === 'paused').length;
  const closedDrives = opportunities.filter(o => o.status === 'closed').length;

  // Actions
  const handleToggleStatus = async (opp: any) => {
    try {
      const nextStatus = opp.status === 'open' ? 'paused' : 'open';
      const docRef = doc(db, 'organizations_universities', organizationId, 'opportunities', opp.opportunityId);
      await updateDoc(docRef, {
        status: nextStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `organizations_universities/${organizationId}/opportunities/${opp.opportunityId}`);
    }
  };

  const handleDeleteOpportunity = async (oppId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this placement opportunity? This action is irreversible.')) {
      return;
    }
    try {
      const docRef = doc(db, 'organizations_universities', organizationId, 'opportunities', oppId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `organizations_universities/${organizationId}/opportunities/${oppId}`);
    }
  };

  // Open creation sidepanel
  const handleOpenCreate = () => {
    setEditingOpportunity(null);
    setFormCompany('');
    setFormTitle('');
    setFormType('Full Time');
    setFormSalary('');
    setFormOpenings(5);
    setFormLocation('');
    setFormDepts('CSE');
    setFormBranches('CSE');
    setFormCgpa(6.0);
    setFormDeadline('');
    setFormSkills('');
    setFormRequirements('');
    setFormDescription('');
    setFormStatus('open');
    setFormVisibility('My University');
    setIsModalOpen(true);
  };

  // Open edit sidepanel
  const handleOpenEdit = (opp: any) => {
    setEditingOpportunity(opp);
    setFormCompany(opp.companyName || opp.company || '');
    setFormTitle(opp.title || '');
    setFormType(opp.employmentType || opp.type || 'Full Time');
    setFormSalary(opp.salary || opp.package || '');
    setFormOpenings(opp.openings || 5);
    setFormLocation(opp.location || '');
    setFormDepts(opp.eligibleDepartments?.join(', ') || opp.dept || 'CSE');
    setFormBranches(opp.eligibleBranches?.join(', ') || opp.dept || 'CSE');
    setFormCgpa(opp.minimumCgpa || 6.0);
    setFormDeadline(opp.deadline || '');
    setFormSkills(opp.skills?.join(', ') || '');
    setFormRequirements(opp.requirements || opp.eligibility || '');
    setFormDescription(opp.description || '');
    setFormStatus(opp.status || 'open');
    setFormVisibility(opp.visibility || 'My University');
    setIsModalOpen(true);
  };

  // Save changes (Create / Edit) with duplicate checks
  const handleSaveOpportunity = async (e: FormEvent) => {
    e.preventDefault();
    if (!formCompany || !formTitle || !formSalary || !formLocation) {
      alert('Please fill out all mandatory fields marked with an asterisk (*).');
      return;
    }

    try {
      const skillsArray = formSkills ? formSkills.split(',').map(s => s.trim()).filter(Boolean) : [];
      const deptsArray = formDepts ? formDepts.split(',').map(d => d.trim()).filter(Boolean) : [];
      const branchesArray = formBranches ? formBranches.split(',').map(b => b.trim()).filter(Boolean) : [];

      if (editingOpportunity) {
        // Edit Operation with updateDoc()
        const oppId = editingOpportunity.opportunityId;
        const docRef = doc(db, 'organizations_universities', organizationId, 'opportunities', oppId);
        await updateDoc(docRef, {
          companyName: formCompany,
          title: formTitle,
          employmentType: formType,
          salary: formSalary,
          openings: Number(formOpenings) || 5,
          location: formLocation,
          eligibleDepartments: deptsArray,
          eligibleBranches: branchesArray,
          minimumCgpa: Number(formCgpa) || 6.0,
          deadline: formDeadline,
          skills: skillsArray,
          requirements: formRequirements,
          description: formDescription,
          status: formStatus,
          visibility: formVisibility,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Create Operation - Check duplicate first
        const colRef = collection(db, 'organizations_universities', organizationId, 'opportunities');
        const qSnapshot = await getDocs(colRef);
        let duplicate = false;
        qSnapshot.forEach((doc) => {
          const data = doc.data();
          if (
            data.companyName?.toLowerCase() === formCompany.toLowerCase() && 
            data.title?.toLowerCase() === formTitle.toLowerCase()
          ) {
            duplicate = true;
          }
        });

        if (duplicate) {
          alert(`An opportunity for "${formTitle}" at "${formCompany}" already exists in the system. Duplicate creation prevented.`);
          return;
        }

        const oppId = 'opp_' + Date.now();
        const newJob = {
          opportunityId: oppId,
          title: formTitle,
          companyName: formCompany,
          companyId: formCompany.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
          description: formDescription,
          requirements: formRequirements,
          skills: skillsArray,
          location: formLocation,
          employmentType: formType,
          salary: formSalary.includes('LPA') ? formSalary : `${formSalary} LPA`,
          openings: Number(formOpenings) || 5,
          eligibleDepartments: deptsArray,
          eligibleBranches: branchesArray,
          minimumCgpa: Number(formCgpa) || 6.0,
          deadline: formDeadline || '2026-06-15',
          status: formStatus,
          visibility: formVisibility,
          createdBy: auth.currentUser?.uid || 'system',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'organizations_universities', organizationId, 'opportunities', oppId), newJob);
      }

      setIsModalOpen(false);
      setEditingOpportunity(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `organizations_universities/${organizationId}/opportunities`);
    }
  };

  // Local Client side searching & filtering
  const filteredOpportunities = opportunities.filter((job) => {
    const jobTitle = job.title || '';
    const jobCompany = job.companyName || job.company || '';
    const jobDesc = job.description || '';
    const jobLoc = job.location || '';
    
    const matchesSearch = 
      jobTitle.toLowerCase().includes(search.toLowerCase()) || 
      jobCompany.toLowerCase().includes(search.toLowerCase()) ||
      jobDesc.toLowerCase().includes(search.toLowerCase()) ||
      jobLoc.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    const matchesType = typeFilter === 'All' || job.employmentType === typeFilter || job.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    }
    if (sortBy === 'salary') {
      const getVal = (s: string) => parseFloat(s) || 0;
      return getVal(b.salary) - getVal(a.salary);
    }
    if (sortBy === 'openings') {
      return (b.openings || 0) - (a.openings || 0);
    }
    return 0;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-app-text">Opportunities Portal</h2>
          <p className="text-app-muted">Real-time drive workspace for Placements and Jobs.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-brand-blue/20"
        >
          <Plus className="w-3.5 h-3.5" /> Create Opportunity
        </button>
      </div>

      {/* Realtime Counters Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Drives', value: totalOpportunities, color: 'text-brand-blue bg-brand-blue/10 border-brand-blue/10' },
          { label: 'Open Drives', value: openDrives, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/10' },
          { label: 'Paused Drives', value: pausedDrives, color: 'text-amber-500 bg-amber-500/10 border-amber-500/10' },
          { label: 'Closed Drives', value: closedDrives, color: 'text-red-500 bg-red-500/10 border-red-500/10' },
        ].map((stat, idx) => (
          <div key={idx} className={`p-4 rounded-[20px] glass border card-shadow flex flex-col justify-between h-24 ${stat.color}`}>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-app-muted">{stat.label}</span>
            <span className="text-2xl font-display font-black leading-none">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar Section */}
      <div className="p-5 rounded-[28px] glass border-app-border card-shadow flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search opportunities by title, company, skills, or location..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:border-brand-blue transition-colors text-app-text font-medium"
          />
        </div>
        
        {/* Dropdowns */}
        <div className="flex flex-wrap gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-3 py-2.5 text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue transition-all"
          >
            <option value="All">Status: All</option>
            <option value="open">Open</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>

          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-3 py-2.5 text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue transition-all"
          >
            <option value="All">Job Type: All</option>
            <option value="Full Time">Full Time</option>
            <option value="Internship">Internship</option>
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-3 py-2.5 text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue transition-all"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="salary">Sort: Package (High-Low)</option>
            <option value="openings">Sort: Openings (High-Low)</option>
          </select>
        </div>
      </div>

      {/* Opportunities List Container */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-app-muted glass border border-app-border rounded-[28px] font-semibold text-sm">
            Loading real-time opportunities from Firestore...
          </div>
        ) : filteredOpportunities.length > 0 ? (
          filteredOpportunities.map((job) => {
            const companyNameString = job.companyName || job.company || '';
            const packageString = job.salary || job.package || '';
            const eligibilityString = job.requirements || job.eligibility || '';
            const typeString = job.employmentType || job.type || 'Full Time';
            const idString = job.opportunityId || job.id;

            return (
              <div 
                key={idString} 
                className="p-6 rounded-[28px] glass border-app-border card-shadow flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:border-brand-blue/15 transition-all group"
              >
                {/* Job Logo and Primary Info */}
                <div className="flex items-start sm:items-center gap-4 flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-display font-black text-sm shrink-0 border border-brand-blue/15 shadow-sm group-hover:scale-105 transition-transform duration-300">
                    {companyNameString.substring(0, 3).toUpperCase()}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display font-black text-base text-app-text leading-snug">{job.title}</span>
                      <span className="text-[10px] font-extrabold bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full uppercase tracking-wider">{companyNameString}</span>
                      <span className="text-[10px] font-extrabold bg-app-surface border border-app-border text-app-muted px-2 py-0.5 rounded-md">{typeString}</span>
                      
                      {/* Status Badges */}
                      {job.status === 'open' && (
                        <span className="text-[10px] font-extrabold bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Open</span>
                      )}
                      {job.status === 'paused' && (
                        <span className="text-[10px] font-extrabold bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Paused</span>
                      )}
                      {job.status === 'closed' && (
                        <span className="text-[10px] font-extrabold bg-red-500/10 text-red-500 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Closed</span>
                      )}
                    </div>
                    
                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-app-muted pt-0.5">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-brand-blue" />
                        <span>Package: {packageString}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-app-muted" />
                        <span>{job.location}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-app-muted" />
                        <span>{eligibilityString}</span>
                      </div>
                    </div>

                    {/* Skill tags list */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {job.skills.map((skill: string, idx: number) => (
                          <span key={idx} className="text-[9px] font-bold bg-app-surface text-app-muted px-2 py-0.5 rounded border border-app-border/50">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Openings and Visibility Info */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold shrink-0">
                  <div className="px-4 py-2.5 rounded-xl bg-app-surface border border-app-border flex items-center gap-2">
                    <span className="font-black text-brand-blue">{job.openings || 5}</span>
                    <span className="text-app-muted">Openings</span>
                  </div>

                  <div className="px-4 py-2.5 rounded-xl bg-app-surface border border-app-border flex items-center gap-2">
                    <span className="text-app-muted">Visibility:</span>
                    <span className="font-black text-emerald-500">{job.visibility || 'My University'}</span>
                  </div>
                </div>

                {/* Actions & Buttons */}
                <div className="flex items-center gap-2 w-full lg:w-auto self-stretch lg:self-center justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-app-border/40">
                  {/* Pause / Resume action */}
                  {job.status !== 'closed' && (
                    <button 
                      onClick={() => handleToggleStatus(job)}
                      title={job.status === 'open' ? 'Pause Application Intake' : 'Resume Application Intake'}
                      className={`p-2.5 border rounded-xl flex items-center justify-center transition-colors ${
                        job.status === 'open' 
                          ? 'border-amber-500/20 text-amber-500 hover:bg-amber-500/10' 
                          : 'border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10'
                      }`}
                    >
                      {job.status === 'open' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  )}

                  {/* Edit action */}
                  <button 
                    onClick={() => handleOpenEdit(job)}
                    className="p-2.5 border border-app-border text-app-text hover:bg-app-surface rounded-xl flex items-center justify-center transition-colors"
                    title="Edit Drive details"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete action */}
                  <button 
                    onClick={() => handleDeleteOpportunity(idString)}
                    className="p-2.5 border border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl flex items-center justify-center transition-colors"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={() => onViewApplications(idString, job.title)}
                    className="px-4 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <ClipboardList className="w-3.5 h-3.5" /> Apps
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-app-muted glass border border-app-border rounded-[28px] font-semibold text-sm">
            No opportunities found. Click "Create Opportunity" to launch a new job drive.
          </div>
        )}
      </div>

      {/* Edit / Create Sidepanel Overlay Drawer */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-app-bg border-l border-app-border h-full shadow-2xl flex flex-col overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-app-border/40 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-display font-bold text-app-text">
                    {editingOpportunity ? 'Edit Placement Drive' : 'Launch Placement Drive'}
                  </h3>
                  <p className="text-xs text-app-muted mt-0.5">
                    {editingOpportunity ? 'Modify details for this active opportunity.' : 'Provide job specifications for placement drives.'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 border border-app-border rounded-xl text-app-muted hover:text-app-text hover:bg-app-surface transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveOpportunity} className="p-6 space-y-5 text-xs font-semibold flex-1">
                <div className="grid grid-cols-2 gap-4">
                  {/* Company Name */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-app-text font-bold block">Company Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g. TCS, Infosys, Wipro" 
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
                      required
                    />
                  </div>

                  {/* Job Title */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-app-text font-bold block">Job Title <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g. Fullstack Developer" 
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
                      required
                    />
                  </div>

                  {/* Job Type */}
                  <div className="space-y-1.5">
                    <label className="text-app-text font-bold block">Job Type <span className="text-red-500">*</span></label>
                    <select 
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  {/* Salary Package */}
                  <div className="space-y-1.5">
                    <label className="text-app-text font-bold block">Package / Salary <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g. 4.5 LPA or $60,000" 
                      value={formSalary}
                      onChange={(e) => setFormSalary(e.target.value)}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
                      required
                    />
                  </div>

                  {/* Total Openings */}
                  <div className="space-y-1.5">
                    <label className="text-app-text font-bold block">Total Openings</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 5" 
                      value={formOpenings}
                      onChange={(e) => setFormOpenings(Number(e.target.value))}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-app-text font-bold block">Location <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g. Hyderabad, Remote" 
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
                      required
                    />
                  </div>

                  {/* Min CGPA */}
                  <div className="space-y-1.5">
                    <label className="text-app-text font-bold block">Minimum CGPA</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      placeholder="e.g. 6.0" 
                      value={formCgpa}
                      onChange={(e) => setFormCgpa(Number(e.target.value))}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
                    />
                  </div>

                  {/* Application Deadline */}
                  <div className="space-y-1.5">
                    <label className="text-app-text font-bold block">Application Deadline</label>
                    <input 
                      type="date" 
                      value={formDeadline}
                      onChange={(e) => setFormDeadline(e.target.value)}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
                    />
                  </div>

                  {/* Status selection */}
                  <div className="space-y-1.5">
                    <label className="text-app-text font-bold block">Drive Status</label>
                    <select 
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
                    >
                      <option value="open">Open (Accepting Apps)</option>
                      <option value="paused">Paused</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  {/* Visibility selection */}
                  <div className="space-y-1.5">
                    <label className="text-app-text font-bold block">Visibility</label>
                    <select 
                      value={formVisibility}
                      onChange={(e) => setFormVisibility(e.target.value)}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
                    >
                      <option value="My University">My University Only</option>
                      <option value="Selected Universities">Selected Sister Colleges</option>
                      <option value="All Universities">All National Databases</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>

                  {/* Eligible Departments */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-app-text font-bold block">Eligible Departments (comma-separated)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. CSE, IT, ECE" 
                      value={formDepts}
                      onChange={(e) => setFormDepts(e.target.value)}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
                    />
                  </div>

                  {/* Skills required */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-app-text font-bold block">Required Skills (comma-separated)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. React, Node.js, TypeScript, SQL" 
                      value={formSkills}
                      onChange={(e) => setFormSkills(e.target.value)}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
                    />
                  </div>

                  {/* Requirements Description */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-app-text font-bold block">Eligibility / Requirements Description</label>
                    <textarea 
                      rows={3} 
                      placeholder="e.g. Must have completed 1 internship. No active backlogs." 
                      value={formRequirements}
                      onChange={(e) => setFormRequirements(e.target.value)}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors resize-none"
                    />
                  </div>

                  {/* Job Description */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-app-text font-bold block">Job Description</label>
                    <textarea 
                      rows={4} 
                      placeholder="Enter detailed role descriptions, daily activities, and deliverables..." 
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Submit action buttons */}
                <div className="pt-4 flex gap-3 border-t border-app-border/40">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-app-surface hover:bg-app-surface/90 text-app-text-active border border-app-border rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md shadow-brand-blue/20"
                  >
                    Save Opportunity
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
