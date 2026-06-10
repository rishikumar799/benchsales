import { useState } from 'react';
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

interface OpportunitiesTabProps {
  onApplyJob: (jobTitle: string, company: string) => void;
}

export default function OpportunitiesTab({ onApplyJob }: OpportunitiesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  // Exact dataset matching Column 2 image
  const opportunities = [
    {
      company: 'TCS',
      fullName: 'Tata Consultancy Services',
      title: 'Software Engineer',
      type: 'Campus Drive',
      duration: 'Full Time',
      package: '4.5 LPA',
      location: 'Hyderabad',
      eligibility: 'B.Tech - 2026',
      match: 'Excellent',
      date: 'Posted on 10 May 2026',
    },
    {
      company: 'Infosys',
      fullName: 'Infosys Limited',
      title: 'System Engineer',
      type: 'Campus Drive',
      duration: 'Full Time',
      package: '4.0 LPA',
      location: 'Bangalore',
      eligibility: 'B.Tech / MCA - 2026',
      match: 'Excellent',
      date: 'Posted on 09 May 2026',
    },
    {
      company: 'Wipro',
      fullName: 'Wipro Technologies',
      title: 'Project Engineer',
      type: 'Off-Campus',
      duration: 'Full Time',
      package: '3.6 LPA',
      location: 'Chennai',
      eligibility: 'Any Degree - 2026',
      match: 'Very Good',
      date: 'Posted on 08 May 2026',
    },
    {
      company: 'Accenture',
      fullName: 'Accenture Solutions',
      title: 'Software Engineer',
      type: 'Campus Drive',
      duration: 'Full Time',
      package: '4.5 LPA',
      location: 'Pune',
      eligibility: 'B.Tech - 2026',
      match: 'Excellent',
      date: 'Posted on 07 May 2026',
    },
  ];

  const filteredOpportunities = opportunities.filter((opp) => {
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
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="p-5 sm:p-6 rounded-[28px] glass border-app-border card-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-brand-blue/30 transition-all duration-300"
            >
              <div className="space-y-4 flex-1">
                {/* Header info */}
                <div className="flex flex-wrap items-start justify-between sm:justify-start gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-display font-extrabold text-xl shadow-inner border border-brand-blue/10">
                    {opp.company}
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
                  onClick={() => alert(`Details for ${opp.title} at ${opp.company}: Requires ${opp.eligibility} at ${opp.location}. Package: ${opp.package}.`)}
                  className="flex-1 md:flex-none px-4 py-3 bg-app-surface/80 hover:bg-app-surface text-app-text font-bold rounded-xl text-xs border border-app-border whitespace-nowrap transition-all"
                >
                  View Details
                </button>
                <button 
                  onClick={() => onApplyJob(opp.title, opp.company)}
                  className="flex-1 md:flex-none px-5 py-3 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-xl text-xs whitespace-nowrap transition-all flex items-center justify-center gap-1 hover:scale-[1.02] shadow-sm shadow-brand-blue/25"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-12 text-center text-app-muted rounded-2xl bg-app-surface/20 border border-app-border">
            No opportunities matched your current filter selection. Try adjusting your fields.
          </div>
        )}
      </div>

      {/* Pagination Footer precisely matched to Column 2 */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-app-border/40">
        <span className="text-xs font-semibold text-app-muted">
          Showing 1 to {filteredOpportunities.length} of 42 opportunities
        </span>
        
        <div className="flex items-center gap-1">
          <button className="p-2.5 bg-app-surface border border-app-border rounded-lg text-app-muted hover:text-app-text transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button className="w-9 h-9 bg-brand-blue text-white rounded-lg font-bold text-xs">1</button>
          <button className="w-9 h-9 bg-app-surface border border-app-border text-app-muted hover:text-app-text rounded-lg font-bold text-xs transition-colors">2</button>
          <button className="w-9 h-9 bg-app-surface border border-app-border text-app-muted hover:text-app-text rounded-lg font-bold text-xs transition-colors">3</button>
          <button className="w-9 h-9 bg-app-surface border border-app-border text-app-muted hover:text-app-text rounded-lg font-bold text-xs transition-colors">4</button>
          <button className="w-9 h-9 bg-app-surface border border-app-border text-app-muted hover:text-app-text rounded-lg font-bold text-xs transition-colors">5</button>
          
          <span className="text-xs text-app-muted px-1">...</span>
          
          <button className="w-9 h-9 bg-app-surface border border-app-border text-app-muted hover:text-app-text rounded-lg font-bold text-xs transition-colors">11</button>
          
          <button className="p-2.5 bg-app-surface border border-app-border rounded-lg text-app-muted hover:text-app-text transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
