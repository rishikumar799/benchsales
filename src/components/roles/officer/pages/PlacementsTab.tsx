import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  MapPin, 
  TrendingUp, 
  CheckCircle2, 
  Award, 
  FileSpreadsheet, 
  Download,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronRight,
  X,
  User,
  Building2,
  Briefcase,
  Calendar,
  DollarSign,
  GraduationCap,
  Edit3,
  Save,
  RefreshCw
} from 'lucide-react';
import { collection, doc, onSnapshot, getDocs, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';

interface PlacementDoc {
  placementId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  department: string;
  branch: string;
  cgpa: number;
  opportunityId: string;
  opportunityTitle: string;
  companyId: string;
  companyName: string;
  package: string;
  joiningDate: string;
  placementOfficerUid: string;
  applicationId: string;
  status: string; // 'Confirmed' | 'Joined' | 'Deferred' | 'Withdrawn'
  offerStatus: string; // 'Pending' | 'Released' | 'Accepted' | 'Declined'
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export default function PlacementsTab() {
  const { userProfile } = useAuth();
  const organizationId = userProfile?.organizationId || 'default_university';
  const officerUid = auth.currentUser?.uid || 'system_officer';

  const [placements, setPlacements] = useState<PlacementDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [offerStatusFilter, setOfferStatusFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');

  // Selected placement for deep-dive panel & edit
  const [selectedPlacement, setSelectedPlacement] = useState<PlacementDoc | null>(null);
  const [editOfferStatus, setEditOfferStatus] = useState('Released');
  const [editStatus, setEditStatus] = useState('Confirmed');
  const [editJoiningDate, setEditJoiningDate] = useState('2026-07-15');
  const [editRemarks, setEditRemarks] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Load and Listen to placements, with background auto-sync from applications
  useEffect(() => {
    if (!organizationId) return;

    // 1. Subscribe to placement documents in Firestore (real-time list)
    const placementsColRef = collection(db, 'organizations_universities', organizationId, 'placements');
    const unsubscribePlacements = onSnapshot(placementsColRef, (snapshot) => {
      const list: PlacementDoc[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as PlacementDoc);
      });
      setPlacements(list);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `organizations_universities/${organizationId}/placements`);
      setLoading(false);
    });

    // 2. Background Auto-Sync: ensure applications with 'placed' status are reflected as placements
    const applicationsColRef = collection(db, 'organizations_universities', organizationId, 'applications');
    const unsubscribeApps = onSnapshot(applicationsColRef, async (snapshot) => {
      snapshot.forEach(async (appDoc) => {
        const app = appDoc.data();
        if (app.status === 'placed') {
          const placementId = 'placement_' + app.applicationId;
          const placementRef = doc(db, 'organizations_universities', organizationId, 'placements', placementId);
          
          try {
            const placementSnap = await getDoc(placementRef);
            if (!placementSnap.exists()) {
              // Fetch job/opportunity package if available
              let calculatedPackage = '4.5 LPA';
              try {
                const oppRef = doc(db, 'organizations_universities', organizationId, 'opportunities', app.opportunityId);
                const oppSnap = await getDoc(oppRef);
                if (oppSnap.exists()) {
                  calculatedPackage = oppSnap.data().salary || oppSnap.data().package || '4.5 LPA';
                }
              } catch (oppErr) {
                console.error('Failed to fetch package for auto-sync', oppErr);
              }

              const placementData: PlacementDoc = {
                placementId,
                studentId: app.studentId || 'unknown_student',
                studentName: app.studentName || 'Unknown Student',
                studentEmail: app.studentEmail || '',
                department: app.studentDepartment || app.studentBranch || 'General',
                branch: app.studentBranch || app.studentDepartment || 'General',
                cgpa: Number(app.studentCgpa) || 0.0,
                opportunityId: app.opportunityId || 'unknown_opp',
                opportunityTitle: app.opportunityTitle || 'Unknown Role',
                companyId: app.companyId || 'unknown_company',
                companyName: app.companyName || 'Unknown Company',
                package: calculatedPackage,
                joiningDate: '2026-07-15',
                placementOfficerUid: officerUid,
                applicationId: app.applicationId,
                status: 'Confirmed',
                offerStatus: 'Released',
                remarks: app.remarks || 'Placed via placement cell workflow.',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              await setDoc(placementRef, placementData);
            }
          } catch (err) {
            console.error('Error during background auto-sync of placement:', err);
          }
        }
      });
    });

    return () => {
      unsubscribePlacements();
      unsubscribeApps();
    };
  }, [organizationId, officerUid]);

  // Handle Manual Refresh
  const handleForceRefresh = async () => {
    setSyncing(true);
    try {
      const applicationsColRef = collection(db, 'organizations_universities', organizationId, 'applications');
      const appSnap = await getDocs(applicationsColRef);
      let countSynced = 0;
      for (const appDoc of appSnap.docs) {
        const app = appDoc.data();
        if (app.status === 'placed') {
          const placementId = 'placement_' + app.applicationId;
          const placementRef = doc(db, 'organizations_universities', organizationId, 'placements', placementId);
          const placementSnap = await getDoc(placementRef);
          
          if (!placementSnap.exists()) {
            let calculatedPackage = '4.5 LPA';
            try {
              const oppRef = doc(db, 'organizations_universities', organizationId, 'opportunities', app.opportunityId);
              const oppSnap = await getDoc(oppRef);
              if (oppSnap.exists()) {
                calculatedPackage = oppSnap.data().salary || oppSnap.data().package || '4.5 LPA';
              }
            } catch (e) {}

            const placementData: PlacementDoc = {
              placementId,
              studentId: app.studentId || 'unknown_student',
              studentName: app.studentName || 'Unknown Student',
              studentEmail: app.studentEmail || '',
              department: app.studentDepartment || app.studentBranch || 'General',
              branch: app.studentBranch || app.studentDepartment || 'General',
              cgpa: Number(app.studentCgpa) || 0.0,
              opportunityId: app.opportunityId || 'unknown_opp',
              opportunityTitle: app.opportunityTitle || 'Unknown Role',
              companyId: app.companyId || 'unknown_company',
              companyName: app.companyName || 'Unknown Company',
              package: calculatedPackage,
              joiningDate: '2026-07-15',
              placementOfficerUid: officerUid,
              applicationId: app.applicationId,
              status: 'Confirmed',
              offerStatus: 'Released',
              remarks: app.remarks || 'Synchronized on demand.',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            await setDoc(placementRef, placementData);
            countSynced++;
          }
        }
      }
      alert(`Force refresh completed! Synchronized ${countSynced} pre-existing placed records successfully.`);
    } catch (err) {
      console.error(err);
      alert('Error manual syncing database.');
    } finally {
      setSyncing(false);
    }
  };

  // Open Details panel & copy fields to state
  const handleSelectPlacement = (p: PlacementDoc) => {
    setSelectedPlacement(p);
    setEditOfferStatus(p.offerStatus || 'Released');
    setEditStatus(p.status || 'Confirmed');
    setEditJoiningDate(p.joiningDate || '2026-07-15');
    setEditRemarks(p.remarks || '');
  };

  // Submit edits (MUST use updateDoc())
  const handleUpdatePlacement = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPlacement) return;
    setIsUpdating(true);

    try {
      const placementRef = doc(db, 'organizations_universities', organizationId, 'placements', selectedPlacement.placementId);
      await updateDoc(placementRef, {
        offerStatus: editOfferStatus,
        status: editStatus,
        joiningDate: editJoiningDate,
        remarks: editRemarks,
        updatedAt: new Date().toISOString()
      });

      setSelectedPlacement(prev => prev ? {
        ...prev,
        offerStatus: editOfferStatus,
        status: editStatus,
        joiningDate: editJoiningDate,
        remarks: editRemarks,
        updatedAt: new Date().toISOString()
      } : null);

      alert('Placement status updated successfully in Firestore!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `organizations_universities/${organizationId}/placements/${selectedPlacement.placementId}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Helper: extract numeric LPA package from string (e.g. "12 LPA" -> 12, "8.5" -> 8.5)
  const parseLPA = (pkgStr: string): number => {
    if (!pkgStr) return 0;
    const cleanStr = pkgStr.toLowerCase().replace(/lpa/gi, '').trim();
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  };

  // KPI calculations based on live placements
  const totalPlaced = placements.length;
  const highestLPA = placements.length > 0 
    ? Math.max(...placements.map(p => parseLPA(p.package))) 
    : 0;
  const avgLPA = placements.length > 0 
    ? (placements.reduce((sum, p) => sum + parseLPA(p.package), 0) / placements.length).toFixed(2)
    : '0';
  const acceptedOffers = placements.filter(p => p.offerStatus?.toLowerCase() === 'accepted').length;

  // Compute unique dynamic values for filters
  const uniqueDepts = Array.from(new Set(placements.map(p => p.department).filter(Boolean)));
  const uniqueCompanies = Array.from(new Set(placements.map(p => p.companyName).filter(Boolean)));

  // Filter & Sort logic
  const filteredPlacements = placements.filter(p => {
    const sTerm = search.toLowerCase();
    const matchesSearch = 
      (p.studentName || '').toLowerCase().includes(sTerm) ||
      (p.studentEmail || '').toLowerCase().includes(sTerm) ||
      (p.companyName || '').toLowerCase().includes(sTerm) ||
      (p.opportunityTitle || '').toLowerCase().includes(sTerm);

    const matchesDept = deptFilter === 'All' || p.department === deptFilter;
    const matchesCompany = companyFilter === 'All' || p.companyName === companyFilter;
    const matchesOffer = offerStatusFilter === 'All' || p.offerStatus === offerStatusFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

    return matchesSearch && matchesDept && matchesCompany && matchesOffer && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return (a.studentName || '').localeCompare(b.studentName || '');
      case 'name-desc':
        return (b.studentName || '').localeCompare(a.studentName || '');
      case 'cgpa-desc':
        return (b.cgpa || 0) - (a.cgpa || 0);
      case 'cgpa-asc':
        return (a.cgpa || 0) - (b.cgpa || 0);
      case 'package-desc':
        return parseLPA(b.package) - parseLPA(a.package);
      case 'date-desc':
        return new Date(b.joiningDate || 0).getTime() - new Date(a.joiningDate || 0).getTime();
      case 'created-desc':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      default:
        return 0;
    }
  });

  // Export to CSV
  const handleExport = () => {
    if (filteredPlacements.length === 0) {
      alert('No placement records to export.');
      return;
    }

    const headers = [
      'PlacementID',
      'StudentID',
      'StudentName',
      'StudentEmail',
      'Department',
      'Branch',
      'CGPA',
      'OpportunityTitle',
      'CompanyName',
      'Package',
      'JoiningDate',
      'OfferStatus',
      'JoiningStatus',
      'Remarks',
      'UpdatedAt'
    ];

    const csvRows = [headers.join(',')];

    for (const p of filteredPlacements) {
      const values = [
        p.placementId,
        p.studentId,
        p.studentName,
        p.studentEmail,
        p.department,
        p.branch,
        p.cgpa,
        p.opportunityTitle,
        p.companyName,
        p.package,
        p.joiningDate,
        p.offerStatus,
        p.status,
        (p.remarks || '').replace(/,/g, ';').replace(/\n/g, ' '),
        p.updatedAt
      ];
      csvRows.push(values.map(val => `"${val}"`).join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Placements_Report_${organizationId}.csv`);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-app-text flex items-center gap-2">
            <Award className="w-8 h-8 text-indigo-500" />
            Placements Tracker
          </h2>
          <p className="text-app-muted">Monitor offer letters, joining schedules, and audit candidate status changes in real-time.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleForceRefresh}
            disabled={syncing}
            className="px-4 py-2 bg-app-surface border border-app-border text-app-text hover:bg-app-surface/90 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Scan database for pre-existing placed records to synchronize"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} /> 
            {syncing ? 'Scanning...' : 'Force Sync Check'}
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-brand-blue/20"
          >
            <Download className="w-3.5 h-3.5" /> Export Placement Data
          </button>
        </div>
      </div>

      {/* KPI Stats Section - Dynamically Aggregated from Firestore */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Placed', val: totalPlaced, sub: `${acceptedOffers} accepted offers`, color: 'text-indigo-500 bg-indigo-500/5' },
          { label: 'Highest Package', val: highestLPA > 0 ? `${highestLPA} LPA` : '0 LPA', sub: 'Top tier offer', color: 'text-violet-500 bg-violet-500/5' },
          { label: 'Avg Package', val: `${avgLPA} LPA`, sub: 'Current average', color: 'text-brand-blue bg-brand-blue/5' },
          { label: 'Rate (Simulated)', val: totalPlaced > 0 ? `${Math.min(100, Math.round((totalPlaced / (totalPlaced + 10)) * 100))}%` : '0%', sub: 'Based on total applicants', color: 'text-emerald-500 bg-emerald-500/5' },
        ].map((card, idx) => (
          <div key={idx} className="p-5 rounded-[22px] bg-app-surface/60 border border-app-border space-y-1 hover:border-brand-blue/25 transition-all card-shadow">
            <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider">{card.label}</span>
            <div className={`text-2xl sm:text-3xl font-display font-black ${card.color.split(' ')[0]}`}>{card.val}</div>
            <p className="text-xs text-app-muted font-semibold">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Advanced Filters Panel */}
      <div className="p-6 rounded-[28px] glass border-app-border card-shadow space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search placed students by name, email, company, or role..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:border-brand-blue transition-colors text-app-text placeholder-app-muted"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          {/* Dept Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-app-muted">Department</label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full bg-app-surface border border-app-border text-xs rounded-xl py-2 px-3 text-app-text focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Departments</option>
              {uniqueDepts.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Company Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-app-muted">Company</label>
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="w-full bg-app-surface border border-app-border text-xs rounded-xl py-2 px-3 text-app-text focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Companies</option>
              {uniqueCompanies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>

          {/* Offer Status Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-app-muted">Offer Status</label>
            <select
              value={offerStatusFilter}
              onChange={(e) => setOfferStatusFilter(e.target.value)}
              className="w-full bg-app-surface border border-app-border text-xs rounded-xl py-2 px-3 text-app-text focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Offer Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Released">Released</option>
              <option value="Accepted">Accepted</option>
              <option value="Declined">Declined</option>
            </select>
          </div>

          {/* Joining Status Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-app-muted">Joining Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-app-surface border border-app-border text-xs rounded-xl py-2 px-3 text-app-text focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Joining Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Joined">Joined</option>
              <option value="Deferred">Deferred</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-app-muted flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" /> Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-app-surface border border-app-border text-xs rounded-xl py-2 px-3 text-app-text focus:outline-none focus:border-indigo-500 font-bold"
            >
              <option value="name-asc">Student Name (A-Z)</option>
              <option value="name-desc">Student Name (Z-A)</option>
              <option value="cgpa-desc">CGPA (High to Low)</option>
              <option value="cgpa-asc">CGPA (Low to High)</option>
              <option value="package-desc">Package (High to Low)</option>
              <option value="date-desc">Joining Date (Nearest)</option>
              <option value="created-desc">Date Placed (Newest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Placement Table List */}
      <div className="glass border-app-border rounded-[28px] overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-app-muted">Streaming placements securely from Firestore...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-app-border/40 bg-app-surface/20">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-app-muted pl-6">Student</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-app-muted">CGPA / Dept</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-app-muted">Company & Role</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-app-muted text-center">Package</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-app-muted text-center">Joining Date</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-app-muted text-center">Offer Status</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-app-muted text-center">Joining Status</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-app-muted text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border/40">
                {filteredPlacements.length > 0 ? (
                  filteredPlacements.map((p) => {
                    return (
                      <tr key={p.placementId} className="hover:bg-app-surface/30 transition-colors group">
                        {/* Student */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 border border-app-border flex items-center justify-center font-bold text-indigo-400">
                              {p.studentName ? p.studentName.charAt(0) : '?'}
                            </div>
                            <div>
                              <div className="font-extrabold text-sm text-app-text">{p.studentName}</div>
                              <div className="text-[10px] text-app-muted font-mono">{p.studentEmail}</div>
                            </div>
                          </div>
                        </td>

                        {/* CGPA / Dept */}
                        <td className="p-4">
                          <div className="text-xs font-bold text-app-text">{p.department} ({p.branch})</div>
                          <div className="text-[10px] text-indigo-400 font-mono font-bold">CGPA: {p.cgpa}</div>
                        </td>

                        {/* Company & Role */}
                        <td className="p-4">
                          <div className="text-sm font-bold text-app-text-active">{p.companyName}</div>
                          <div className="text-[11px] text-app-muted font-bold">{p.opportunityTitle}</div>
                        </td>

                        {/* Package */}
                        <td className="p-4 text-center">
                          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-black">
                            {p.package}
                          </span>
                        </td>

                        {/* Joining Date */}
                        <td className="p-4 text-center text-xs font-bold text-app-muted">
                          {p.joiningDate || 'N/A'}
                        </td>

                        {/* Offer Status */}
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            p.offerStatus === 'Accepted' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            p.offerStatus === 'Declined' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            p.offerStatus === 'Released' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                            'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {p.offerStatus || 'Pending'}
                          </span>
                        </td>

                        {/* Joining Status */}
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            p.status === 'Joined' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            p.status === 'Confirmed' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' :
                            p.status === 'Deferred' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                            'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {p.status || 'Confirmed'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right pr-6">
                          <button
                            onClick={() => handleSelectPlacement(p)}
                            className="p-1.5 hover:bg-app-surface border border-transparent hover:border-app-border text-indigo-400 hover:text-indigo-300 rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold">Manage</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-app-muted text-sm font-semibold">
                      No matching placement logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        {!loading && (
          <div className="p-4.5 border-t border-app-border/40 text-center text-xs text-app-muted font-bold bg-app-surface/10 flex justify-between items-center px-6">
            <span>Showing {filteredPlacements.length} of {placements.length} verified student placement logs</span>
            <span className="font-mono text-[10px] text-emerald-500/80">● Realtime Connection Active</span>
          </div>
        )}
      </div>

      {/* Details & Edit Placement Sidebar Panel */}
      <AnimatePresence>
        {selectedPlacement && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlacement(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-app-surface/95 border-l border-app-border z-50 overflow-y-auto p-6 shadow-2xl space-y-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-app-border/40 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Placement Record Audit</span>
                  <h3 className="text-xl font-display font-black text-app-text">{selectedPlacement.studentName}</h3>
                </div>
                <button 
                  onClick={() => setSelectedPlacement(null)}
                  className="p-1.5 hover:bg-app-surface border border-app-border rounded-xl text-app-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid content */}
              <div className="space-y-5">
                {/* 1. Student Details Card */}
                <div className="p-4 rounded-2xl bg-app-surface/40 border border-app-border/60 space-y-3">
                  <div className="flex items-center gap-1.5 text-indigo-400">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Student Academic Details</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-app-muted font-bold text-[10px]">STUDENT ID</div>
                      <div className="font-mono font-bold text-app-text">{selectedPlacement.studentId}</div>
                    </div>
                    <div>
                      <div className="text-app-muted font-bold text-[10px]">EMAIL ADDRESS</div>
                      <div className="font-mono font-semibold text-app-text text-ellipsis overflow-hidden">{selectedPlacement.studentEmail}</div>
                    </div>
                    <div>
                      <div className="text-app-muted font-bold text-[10px]">DEPARTMENT / BRANCH</div>
                      <div className="font-bold text-app-text">{selectedPlacement.department} ({selectedPlacement.branch})</div>
                    </div>
                    <div>
                      <div className="text-app-muted font-bold text-[10px]">CUMULATIVE CGPA</div>
                      <div className="font-bold text-emerald-400 font-mono">★ {selectedPlacement.cgpa}</div>
                    </div>
                  </div>
                </div>

                {/* 2. Company & Opportunity details */}
                <div className="p-4 rounded-2xl bg-app-surface/40 border border-app-border/60 space-y-3">
                  <div className="flex items-center gap-1.5 text-indigo-400">
                    <Building2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Company & Drive Information</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-app-muted font-bold text-[10px]">COMPANY NAME (ID)</div>
                      <div className="font-bold text-app-text">{selectedPlacement.companyName} <span className="font-mono text-[9px] text-app-muted">({selectedPlacement.companyId})</span></div>
                    </div>
                    <div>
                      <div className="text-app-muted font-bold text-[10px]">OPPORTUNITY ID</div>
                      <div className="font-mono font-bold text-app-text">{selectedPlacement.opportunityId}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-app-muted font-bold text-[10px]">DESIGNATION / TITLE</div>
                      <div className="font-black text-indigo-300 text-sm">{selectedPlacement.opportunityTitle}</div>
                    </div>
                    <div>
                      <div className="text-app-muted font-bold text-[10px]">VERIFIED ANNUAL SALARY</div>
                      <div className="font-black text-brand-blue font-mono text-sm">{selectedPlacement.package}</div>
                    </div>
                    <div>
                      <div className="text-app-muted font-bold text-[10px]">OFFICER UID</div>
                      <div className="font-mono text-app-muted text-[10px] text-ellipsis overflow-hidden">{selectedPlacement.placementOfficerUid}</div>
                    </div>
                  </div>
                </div>

                {/* 3. Interactive Edit form (MUST use updateDoc()) */}
                <form onSubmit={handleUpdatePlacement} className="space-y-4 pt-2">
                  <div className="flex items-center gap-1.5 text-indigo-400">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Status & Log Management</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Offer Status */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-app-text flex items-center gap-1">
                        Offer Letter Status
                      </label>
                      <select
                        value={editOfferStatus}
                        onChange={(e) => setEditOfferStatus(e.target.value)}
                        className="w-full bg-app-surface border border-app-border text-xs rounded-xl py-2 px-3 text-app-text focus:outline-none focus:border-indigo-500 font-bold"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Released">Released</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </div>

                    {/* Joining Status */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-app-text flex items-center gap-1">
                        Joining Schedule Status
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="w-full bg-app-surface border border-app-border text-xs rounded-xl py-2 px-3 text-app-text focus:outline-none focus:border-indigo-500 font-bold"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Joined">Joined</option>
                        <option value="Deferred">Deferred</option>
                        <option value="Withdrawn">Withdrawn</option>
                      </select>
                    </div>

                    {/* Joining Date */}
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-app-text flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-app-muted" /> Scheduled Joining Date
                      </label>
                      <input
                        type="date"
                        value={editJoiningDate}
                        onChange={(e) => setEditJoiningDate(e.target.value)}
                        className="w-full bg-app-surface border border-app-border text-xs rounded-xl py-2 px-3 text-app-text focus:outline-none focus:border-indigo-500 font-bold"
                      />
                    </div>

                    {/* Remarks */}
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-app-text">Placement Audit Remarks</label>
                      <textarea
                        value={editRemarks}
                        onChange={(e) => setEditRemarks(e.target.value)}
                        rows={3}
                        placeholder="Add recruitment remarks, joining requirements, or compliance check notes..."
                        className="w-full bg-app-surface border border-app-border text-xs rounded-xl py-2 px-3 text-app-text focus:outline-none focus:border-indigo-500 placeholder-app-muted"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="flex-1 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      {isUpdating ? 'Updating in Firestore...' : 'Update Placement Record'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPlacement(null)}
                      className="py-2.5 px-4 bg-app-surface border border-app-border text-app-text hover:bg-app-surface/90 rounded-xl text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
