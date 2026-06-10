import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  FileText, 
  Check, 
  Share2, 
  Users, 
  ChevronRight,
  Eye,
  AlertCircle
} from 'lucide-react';

interface CandidatePoolTabProps {
  selectedCandidates: string[];
  onToggleSelect: (id: string) => void;
  onPreviewCandidate: (id: string) => void;
}

export interface CandidateProfile {
  id: string;
  name: string;
  experience: string;
  skills: string[];
  availability: 'Available' | 'Assigned' | 'Offline';
  details: {
    role: string;
    skillsFull: string[];
    years: number;
    currentCompany: string;
    currentRole: string;
    availabilityDetails: string;
  };
}

export default function CandidatePoolTab({ 
  selectedCandidates, 
  onToggleSelect, 
  onPreviewCandidate 
}: CandidatePoolTabProps) {
  
  // High fidelity candidate profile catalog matched with screenshots (3) & (8)
  const [candidates] = useState<CandidateProfile[]>([
    {
      id: 'c1',
      name: 'Ravi Kumar',
      experience: '4 Years',
      skills: ['React', 'Node.js', 'MongoDB'],
      availability: 'Available',
      details: {
        role: 'Software Developer',
        skillsFull: ['React', 'Node.js', 'MongoDB', 'Express.js', 'JavaScript', 'HTML', 'CSS', 'Bootstrap'],
        years: 4,
        currentCompany: 'Tech Solutions Pvt Ltd',
        currentRole: 'Software Developer',
        availabilityDetails: 'Available Immediately'
      }
    },
    {
      id: 'c2',
      name: 'Priya Sharma',
      experience: '3 Years',
      skills: ['Java', 'Spring Boot', 'MySQL'],
      availability: 'Available',
      details: {
        role: 'Backend Java Developer',
        skillsFull: ['Java', 'Spring Boot', 'MySQL', 'Hibernate', 'REST APIs', 'AWS'],
        years: 3,
        currentCompany: 'Infosys Ltd',
        currentRole: 'System Engineer',
        availabilityDetails: 'Available Immediately'
      }
    },
    {
      id: 'c3',
      name: 'Akash Reddy',
      experience: '5 Years',
      skills: ['AWS', 'DevOps', 'Docker'],
      availability: 'Available',
      details: {
        role: 'DevOps & Site Reliability Engineer',
        skillsFull: ['AWS', 'DevOps', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux'],
        years: 5,
        currentCompany: 'Wipro Technologies',
        currentRole: 'Infrastructure Engineer',
        availabilityDetails: 'Available Immediately'
      }
    },
    {
      id: 'c4',
      name: 'Sneha Iyer',
      experience: '2 Years',
      skills: ['Python', 'Django', 'PostgreSQL'],
      availability: 'Available',
      details: {
        role: 'Junior PyDev Engineer',
        skillsFull: ['Python', 'Django', 'Flask', 'PostgreSQL', 'API Development', 'Git'],
        years: 2,
        currentCompany: 'Cognizant Ltd',
        currentRole: 'Software Associate',
        availabilityDetails: 'Available Immediately'
      }
    },
    {
      id: 'c5',
      name: 'Karthik Nair',
      experience: '4 Years',
      skills: ['React', 'TypeScript', 'Redux'],
      availability: 'Available',
      details: {
        role: 'Sr. Frontend UI Engineer',
        skillsFull: ['React', 'TypeScript', 'Redux', 'Tailwind CSS', 'Vite', 'GraphQL'],
        years: 4,
        currentCompany: 'Accenture Cloud Services',
        currentRole: 'Frontend Analyst',
        availabilityDetails: 'Available Immediately'
      }
    },
    {
      id: 'c6',
      name: 'Neha Verma',
      experience: '3 Years',
      skills: ['UI/UX', 'Figma', 'Adobe XD'],
      availability: 'Available',
      details: {
        role: 'Product Designer',
        skillsFull: ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Wireframing'],
        years: 3,
        currentCompany: 'Creative Agency Inc',
        currentRole: 'UI/UX Lead Designer',
        availabilityDetails: 'Available Immediately'
      }
    },
    {
      id: 'c7',
      name: 'Pavan Kumar',
      experience: '4 Years',
      skills: ['Java', 'Microservices', 'Kafka'],
      availability: 'Available',
      details: {
        role: 'Cloud Microservices Engineer',
        skillsFull: ['Java', 'Spring Cloud', 'Microservices', 'Apache Kafka', 'Redis', 'Docker'],
        years: 4,
        currentCompany: 'LTI Mindtree',
        currentRole: 'Backend Engineer',
        availabilityDetails: 'Available Immediately'
      }
    },
    {
      id: 'c8',
      name: 'Anjali Mehta',
      experience: '2 Years',
      skills: ['Manual Testing', 'Selenium'],
      availability: 'Available',
      details: {
        role: 'QA Automation Engineer',
        skillsFull: ['Manual Testing', 'Selenium', 'Java', 'JUnit', 'Regression Testing', 'Jira'],
        years: 2,
        currentCompany: 'HCL Technologies',
        currentRole: 'QA Test Analyst',
        availabilityDetails: 'Available Immediately'
      }
    },
    {
      id: 'c9',
      name: 'Mohit Singh',
      experience: '5 Years',
      skills: ['.NET', 'C#', 'SQL Server'],
      availability: 'Available',
      details: {
        role: 'Full Stack .NET Developer',
        skillsFull: ['.NET Core', 'C#', 'SQL Server', 'ASP.NET Core', 'React', 'Azure Developer'],
        years: 5,
        currentCompany: 'Capgemini Tech',
        currentRole: 'Senior .NET Developer',
        availabilityDetails: 'Available Immediately'
      }
    },
    {
      id: 'c10',
      name: 'Divya Reddy',
      experience: '3 Years',
      skills: ['Node.js', 'Express', 'MongoDB'],
      availability: 'Available',
      details: {
        role: 'Fullstack Node.js Developer',
        skillsFull: ['Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'TypeScript', 'Jest', 'Git'],
        years: 3,
        currentCompany: 'Tech Mahindra',
        currentRole: 'Software Developer',
        availabilityDetails: 'Available Immediately'
      }
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('All');

  // Filter candidates on Search and Skill selection
  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = cand.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cand.skills.some(sk => sk.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSkill = skillFilter === 'All' || cand.skills.includes(skillFilter);
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Segment */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text">Candidate Pool (30)</h1>
          <p className="text-app-muted mt-1">These candidates are allocated to you by BDM. Select and submit suitable profiles.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-app-muted bg-app-surface border border-app-border px-3.5 py-2.5 rounded-xl">
            Selected: <span className="text-brand-blue font-extrabold">{selectedCandidates.length}</span> / 18 Cap
          </span>
          <button className="px-4 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold shrink-0 shadow-lg shadow-brand-blue/15">
            30 Candidates
          </button>
        </div>
      </div>

      {/* Action and Search Rails */}
      <div className="p-4 rounded-2xl glass border border-app-border flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search candidate by name or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <select 
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-4 py-3 text-xs font-semibold text-app-text outline-none cursor-pointer flex-1 md:flex-initial"
          >
            <option value="All">All Skillsets</option>
            <option value="React">React</option>
            <option value="Java">Java</option>
            <option value="AWS">AWS</option>
            <option value="Python">Python</option>
            <option value="UI/UX">UI/UX</option>
          </select>
          
          <button className="p-3 bg-app-surface border border-app-border rounded-xl text-app-muted hover:text-app-text transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Candidate Database Table */}
      <div className="p-6 rounded-[28px] glass border border-app-border card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border text-xs font-extrabold text-app-muted uppercase tracking-wider">
                <th className="py-4 px-3 w-12 text-center">#</th>
                <th className="py-4 px-4">Name</th>
                <th className="py-4 px-4">Experience</th>
                <th className="py-4 px-4">Skills</th>
                <th className="py-4 px-4">Availability</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40 text-sm">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((cand, index) => {
                  const isSelected = selectedCandidates.includes(cand.id);
                  return (
                    <tr 
                      key={cand.id} 
                      className={`group transition-colors hover:bg-app-surface/40 ${
                        isSelected ? 'bg-brand-blue/5' : ''
                      }`}
                    >
                      <td className="py-4 px-3 text-center text-xs font-mono font-bold text-app-muted">{index + 1}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue text-xs font-extrabold font-mono shrink-0">
                            {cand.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <button 
                              onClick={() => onPreviewCandidate(cand.id)}
                              className="font-bold text-app-text hover:text-brand-blue text-left transition-colors flex items-center gap-1"
                            >
                              {cand.name}
                              <Eye className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand-blue transition-opacity" />
                            </button>
                            <span className="text-[10px] font-semibold text-app-muted block mt-0.5">{cand.details.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-app-text text-sm">{cand.experience}</td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {cand.skills.map((skill, sIdx) => {
                            // Generate unique clean colors for skills
                            const sColors = [
                              'bg-indigo-500/10 text-indigo-400 border-indigo-500/15',
                              'bg-violet-500/10 text-violet-400 border-violet-500/15',
                              'bg-emerald-500/10 text-emerald-400 border-emerald-500/15',
                              'bg-blue-500/10 text-blue-400 border-blue-500/15',
                              'bg-pink-500/10 text-pink-400 border-pink-500/15',
                            ];
                            const color = sColors[sIdx % sColors.length];
                            return (
                              <span key={sIdx} className={`text-[10px] font-mono font-extrabold border px-2.5 py-0.5 rounded-lg ${color}`}>
                                {skill}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-extrabold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          {cand.availability}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => onPreviewCandidate(cand.id)}
                            className="p-2 bg-app-surface hover:bg-app-bg text-app-muted hover:text-brand-violet rounded-xl border border-app-border transition-colors group/btn"
                            title="Preview Candidate Detail"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          
                          <button 
                            onClick={() => onToggleSelect(cand.id)}
                            className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                              isSelected 
                                ? 'bg-brand-blue text-white border-brand-blue shadow-md' 
                                : 'bg-white text-brand-blue border-brand-blue hover:bg-brand-blue hover:text-white'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-app-muted">
                    <AlertCircle className="w-10 h-10 text-app-muted mx-auto mb-3" />
                    <p className="font-semibold text-app-text text-sm">No pool candidates found</p>
                    <p className="text-xs text-app-muted mt-1">Refine your keyword search or filter by skillset.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination component as seen in Image 3 */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-2">
        <button className="p-2 border border-app-border rounded-xl text-app-muted hover:text-app-text bg-app-surface hover:bg-app-surface/80 text-xs">
          {'<'}
        </button>
        <button className="w-8 h-8 rounded-xl font-bold bg-brand-blue text-white text-xs">1</button>
        <button className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">2</button>
        <button className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">3</button>
        <span className="text-app-muted px-1 text-xs">...</span>
        <button className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">3</button>
        <button className="p-2 border border-app-border rounded-xl text-app-muted hover:text-app-text bg-app-surface hover:bg-app-surface/80 text-xs">
          {'>'}
        </button>
      </div>

    </div>
  );
}