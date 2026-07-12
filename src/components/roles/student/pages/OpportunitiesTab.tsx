import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  MapPin, 
  Award, 
  DollarSign, 
  Sparkles, 
  Search, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';

interface OpportunitiesTabProps {
  onApplyJob: (jobTitle: string, company: string, opportunityId?: string) => void;
}

export default function OpportunitiesTab({ onApplyJob }: OpportunitiesTabProps) {
  const { userProfile } = useAuth();
  const studentId = userProfile?.uid;
  const organizationId = userProfile?.organizationId;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  const [studentData, setStudentData] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Listen to Student Profile document for eligibility matching
  useEffect(() => {
    if (!organizationId || !studentId) return;
    const studentDocRef = doc(db, 'organizations_universities', organizationId, 'students', studentId);
    const unsubscribe = onSnapshot(studentDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setStudentData(snapshot.data());
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `organizations_universities/${organizationId}/students/${studentId}`);
    });
    return () => unsubscribe();
  }, [organizationId, studentId]);

  // 2. Listen to Opportunities in real-time
  useEffect(() => {
    if (!organizationId) return;
    const oppsCol = collection(db, 'organizations_universities', organizationId, 'opportunities');
    const unsubscribe = onSnapshot(oppsCol, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setOpportunities(list);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `organizations_universities/${organizationId}/opportunities`);
    });
    return () => unsubscribe();
  }, [organizationId]);

  // 3. Eligibility checking helper
  const isEligible = (opp: any) => {
    if (!studentData) return true; // Default to true if profile is loading

    // Status check - only display open opportunities
    if (opp.status && opp.status !== 'open') return false;

    // CGPA check
    if (opp.minimumCgpa) {
      const minCgpa = parseFloat(opp.minimumCgpa);
      const studentCgpa = parseFloat(studentData.cgpa || '0');
      if (studentCgpa < minCgpa) return false;
    }

    // Department check
    if (opp.eligibleDepartments && Array.isArray(opp.eligibleDepartments) && opp.eligibleDepartments.length > 0) {
      const lowerDepts = opp.eligibleDepartments.map((d: string) => d.toLowerCase());
      if (!lowerDepts.includes('all') && studentData.department) {
        if (!lowerDepts.includes(studentData.department.toLowerCase())) return false;
      }
    }

    // Branch check
    if (opp.eligibleBranches && Array.isArray(opp.eligibleBranches) && opp.eligibleBranches.length > 0) {
      const lowerBranches = opp.eligibleBranches.map((b: string) => b.toLowerCase());
      if (!lowerBranches.includes('all') && studentData.branch) {
        if (!lowerBranches.includes(studentData.branch.toLowerCase())) return false;
      }
    }

    return true;
  };

  const getMatchScore = (opp: any) => {
    if (!studentData || !opp) return 'Excellent';
    const requiredSkills = opp.skills || [];
    if (requiredSkills.length === 0) return 'Excellent';
    const studentSkills = studentData.skills || [];
    const matched = requiredSkills.filter((s: string) => 
      studentSkills.some((sk: string) => sk.toLowerCase().includes(s.toLowerCase()))
    );
    const pct = (matched.length / requiredSkills.length) * 100;
    if (pct >= 85) return 'Excellent';
    if (pct >= 65) return 'Very Good';
    if (pct >= 45) return 'Good';
    return 'Fair';
  };

  // 4. Map and Filter
  const mappedOpportunities = opportunities.map(opp => ({
    id: opp.id,
    company: opp.companyName || 'JOB',
    fullName: opp.companyName || 'Company Solutions',
    title: opp.title || 'Software Engineer',
    type: opp.employmentType || 'Campus Drive',
    duration: 'Full Time',
    package: opp.salary || 'Competitive',
    location: opp.location || 'Remote',
    eligibility: opp.eligibleDepartments ? opp.eligibleDepartments.join(' / ') : 'All Batches',
    match: getMatchScore(opp),
    date: opp.createdAt ? `Posted on ${new Date(opp.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` : 'Posted recently',
    raw: opp
  }));

  // Only display eligible opportunities
  const eligibleOpps = mappedOpportunities.filter(o => isEligible(o.raw));

  const filteredOpportunities = eligibleOpps.filter((opp) => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          opp.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          opp.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJobType = selectedJobType === 'All' || opp.type === selectedJobType;
    const matchesLocation = selectedLocation === 'All' || opp.location === selectedLocation;
    return matchesSearch && matchesJobType && matchesLocation;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-display font-bold text-app-text">Opportunities</h2>
        <p className="text-app-muted">Find and apply to opportunities posted by your placement office.</p>
      </div>

      {/* Control Search & Filter Hub exactly matching Column 2 */}
      <div className="p-6 rounded-[28px] glass border-app-border card-shadow space-y-4">
        
        {/* Search Input Row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-app-muted" />
            <input 
              type="text" 
              placeholder="Search opportunities..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-app-surface/60 border border-app-border rounded-xl text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
          <button className="px-5 py-3 bg-app-surface/80 hover:bg-app-surface text-app-text font-bold rounded-xl text-sm border border-app-border flex items-center justify-center gap-2 transition-all">
            <SlidersHorizontal className="w-4 h-4 text-app-muted" /> Filters
          </button>
        </div>

        {/* Dropdown Filters row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-app-border/40">
          
          {/* Job Type Custom select */}
          <div className="relative">
            <select 
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className="appearance-none bg-app-surface/80 border border-app-border rounded-xl pl-4 pr-9 py-2 text-xs font-semibold text-app-text focus:outline-none focus:border-brand-blue cursor-pointer"
            >
              <option value="All">Job Type</option>
              <option value="Campus Drive">Campus Drive</option>
              <option value="Off-Campus">Off-Campus</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-3.5 h-3.5 text-app-muted pointer-events-none" />
          </div>

          {/* Location Custom select */}
          <div className="relative">
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="appearance-none bg-app-surface/80 border border-app-border rounded-xl pl-4 pr-9 py-2 text-xs font-semibold text-app-text focus:outline-none focus:border-brand-blue cursor-pointer"
            >
              <option value="All">Location (All)</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Chennai">Chennai</option>
              <option value="Pune">Pune</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-3.5 h-3.5 text-app-muted pointer-events-none" />
          </div>

          {/* Dummy placeholders for layout parity */}
          <div className="relative">
            <select disabled className="appearance-none bg-app-surface/40 border border-app-border/60 rounded-xl pl-4 pr-9 py-2 text-xs font-semibold text-app-muted cursor-not-allowed">
              <option>Experience (Freshers)</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-3.5 h-3.5 text-app-muted pointer-events-none" />
          </div>

          <div className="relative">
            <select disabled className="appearance-none bg-app-surface/40 border border-app-border/60 rounded-xl pl-4 pr-9 py-2 text-xs font-semibold text-app-muted cursor-not-allowed">
              <option>Package (All)</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-3.5 h-3.5 text-app-muted pointer-events-none" />
          </div>

          <div className="relative">
            <select disabled className="appearance-none bg-app-surface/40 border border-app-border/60 rounded-xl pl-4 pr-9 py-2 text-xs font-semibold text-app-muted cursor-not-allowed">
              <option>Eligibility (Eligible)</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-3.5 h-3.5 text-app-muted pointer-events-none" />
          </div>

          <button className="text-xs font-bold text-brand-blue hover:underline bg-brand-blue/5 px-3 py-2 rounded-xl border border-brand-blue/10 ml-auto flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> All Filters
          </button>
        </div>
      </div>

      {/* Main Opportunity Listing Cards */}
      <div className="space-y-4">
        {filteredOpportunities.length > 0 ? (
          filteredOpportunities.map((opp, index) => (
            <motion.div
              key={opp.id || index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="p-5 sm:p-6 rounded-[28px] glass border-app-border card-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-brand-blue/30 transition-all duration-300"
            >
              <div className="space-y-4 flex-1">
                {/* Header info */}
                <div className="flex flex-wrap items-start justify-between sm:justify-start gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-display font-extrabold text-xl shadow-inner border border-brand-blue/10">
                    {opp.company ? opp.company.substring(0, 3).toUpperCase() : 'JOB'}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-app-text-active">{opp.title}</h3>
                    <span className="text-[11px] font-bold text-app-muted uppercase select-none block tracking-wide">{opp.fullName}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 ml-0 sm:ml-4 mt-1">
                    <span className="text-[10px] font-extrabold px-3 py-1 bg-brand-violet/10 text-brand-violet rounded-full uppercase tracking-wide">
                      {opp.type}
                    </span>
                    <span className="text-[10px] font-extrabold px-3 py-1 bg-app-bg text-app-muted rounded-full uppercase tracking-wide border border-app-border">
                      {opp.duration}
                    </span>
                  </div>
                </div>

                {/* Info Grid of Specifications matching image exactly */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-app-border/40">
                  <div>
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block mb-0.5">Package Offered</span>
                    <span className="text-xs font-extrabold text-app-text flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-brand-blue" /> {opp.package}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block mb-0.5">Location</span>
                    <span className="text-xs font-extrabold text-app-text flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-blue" /> {opp.location}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block mb-0.5">Eligibility Criterion</span>
                    <span className="text-xs font-extrabold text-app-text flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-brand-blue" /> {opp.eligibility}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block mb-0.5">AI Match Assessment</span>
                    <span className="text-xs font-extrabold text-emerald-500 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10" /> Match: {opp.match}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons on the far right */}
              <div className="flex sm:flex-col md:flex-row w-full md:w-auto items-stretch gap-2 shrink-0 md:pl-6 md:border-l border-app-border/40">
                <button 
                  onClick={() => alert(`Details for ${opp.title} at ${opp.company}:\nLocation: ${opp.location}\nSalary: ${opp.package}\nRequirements: ${opp.raw.requirements || "None specified"}`)}
                  className="flex-1 md:flex-none px-4 py-3 bg-app-surface/80 hover:bg-app-surface text-app-text font-bold rounded-xl text-xs border border-app-border whitespace-nowrap transition-all"
                >
                  View Details
                </button>
                <button 
                  onClick={() => onApplyJob(opp.title, opp.company, opp.id)}
                  className="flex-1 md:flex-none px-5 py-3 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-xl text-xs whitespace-nowrap transition-all flex items-center justify-center gap-1 hover:scale-[1.02] shadow-sm shadow-brand-blue/25"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-12 text-center text-app-muted rounded-2xl bg-app-surface/20 border border-app-border">
            {loading ? "Loading opportunities..." : "No opportunities matched your current eligibility. Try adjusting your profile academic details."}
          </div>
        )}
      </div>

      {/* Pagination Footer precisely matched to Column 2 */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-app-border/40">
        <span className="text-xs font-semibold text-app-muted">
          Showing 1 to {filteredOpportunities.length} of {filteredOpportunities.length} opportunities
        </span>
        
        <div className="flex items-center gap-1">
          <button className="p-2.5 bg-app-surface border border-app-border rounded-lg text-app-muted hover:text-app-text transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button className="w-9 h-9 bg-brand-blue text-white rounded-lg font-bold text-xs">1</button>
          
          <button className="p-2.5 bg-app-surface border border-app-border rounded-lg text-app-muted hover:text-app-text transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
