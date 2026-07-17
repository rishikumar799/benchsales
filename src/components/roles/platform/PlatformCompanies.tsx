import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Users, 
  Briefcase, 
  TrendingUp, 
  BriefcaseBusiness,
  Activity, 
  Calendar,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { usePlatformAdmin } from '../../../context/PlatformAdminContext';

export default function PlatformCompanies() {
  const { 
    organizations, 
    sysUsers, 
    activeJobsCount, 
    recruitersCount, 
    bdmsCount,
    platformAnalytics 
  } = usePlatformAdmin();

  const companiesList = organizations.filter(o => o.type === 'Company');
  const totalCompanies = companiesList.length;
  const corporateEmployees = recruitersCount + bdmsCount;
  const approvedManagers = bdmsCount;
  const internalRecruiters = recruitersCount;
  const activeRequisitions = activeJobsCount;

  const seriesData = platformAnalytics?.trends || [];

  const deptData = activeRequisitions > 0 ? [
    { name: 'Engineering / Tech', value: 100, color: '#10b981' },
  ] : [];

  return (
    <div id="platform-companies-view" className="space-y-6">
      {/* Platform Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">Ecosystem Isolation - Tier 3</span>
        <h2 className="text-3xl font-display font-bold mt-1">Corporate & Internal Hiring Ecosystem</h2>
        <p className="text-app-muted text-sm mt-1">Corporate secure workspace. Roster directories and job requisitions completely isolated inside private tenant boundaries.</p>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Companies', value: totalCompanies.toLocaleString(), color: 'text-emerald-500' },
          { label: 'Corporate Employees', value: corporateEmployees.toLocaleString(), color: 'text-indigo-500' },
          { label: 'Approved Managers', value: approvedManagers.toLocaleString(), color: 'text-violet-500' },
          { label: 'Internal Recruiters', value: internalRecruiters.toLocaleString(), color: 'text-blue-500' },
          { label: 'Active Requisitions', value: activeRequisitions.toLocaleString(), color: 'text-amber-500' },
        ].map((st, idx) => (
          <div key={idx} className="p-5 rounded-[28px] glass border-app-border card-shadow">
            <span className="text-[10px] font-bold uppercase tracking-widest text-app-muted block">{st.label}</span>
            <div className={`text-2xl font-display font-bold mt-1.5 ${st.color}`}>{st.value}</div>
            <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">▲ Real-Time Sync</span>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">Company Adoption Growth</h3>
          <div className="h-48">
            {seriesData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-app-muted font-bold text-sm">
                No Records Found
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={seriesData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" fontSize={10} stroke="#9ca3af" />
                  <YAxis fontSize={10} stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="corp" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">Active Placements / Job Requisitions</h3>
          <div className="h-48">
            {seriesData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-app-muted font-bold text-sm">
                No Records Found
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={seriesData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" fontSize={10} stroke="#9ca3af" />
                  <YAxis fontSize={10} stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="hireActive" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">Workforce Size Increase</h3>
          <div className="h-48">
            {seriesData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-app-muted font-bold text-sm">
                No Records Found
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={seriesData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" fontSize={10} stroke="#9ca3af" />
                  <YAxis fontSize={10} stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="staff" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Jobs & Companies Details Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Jobs by Department */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-500" /> Jobs by Department
          </h3>
          {activeRequisitions === 0 ? (
            <div className="py-8 text-center text-app-muted font-bold text-xs">
              No Records Found
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-32 h-32 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deptData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {deptData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2 text-xs">
                {deptData.map((dept, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-app-text">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dept.color }} />
                      {dept.name}
                    </div>
                    <span className="text-app-muted font-bold">{dept.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Hiring Companies */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-violet-500" /> Top Hiring Corporations
          </h3>
          <div className="space-y-2">
            {companiesList.length === 0 ? (
              <div className="py-8 text-center text-app-muted font-bold text-xs">
                No Records Found
              </div>
            ) : (
              companiesList.slice(0, 5).map((company, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-app-surface/50 border border-app-border text-xs flex justify-between items-center">
                  <div>
                    <div className="font-bold text-app-text truncate max-w-[150px]">{company.name}</div>
                    <div className="text-[10px] text-app-muted/80">Active Subscription</div>
                  </div>
                  <span className="text-brand-blue font-bold whitespace-nowrap text-[11px]">{company.plan} Plan</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Time to Hire & Offer Acceptance Rate */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted mb-4 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-brand-blue" /> Corporate Efficiency
            </h3>
            <div className="space-y-4 text-xs font-semibold">
              <div className="p-4 bg-app-surface border border-app-border rounded-xl space-y-1">
                <div className="text-app-muted block">Time to Hire (Average)</div>
                <div className="text-3xl font-display font-bold text-brand-blue mt-1">0 <span className="text-xs font-normal text-app-muted">Days</span></div>
                <div className="text-[10px] text-app-muted font-semibold mt-1">Waiting for data inputs</div>
              </div>

              <div className="p-4 bg-app-surface border border-app-border rounded-xl space-y-1">
                <div className="text-app-muted block flex items-center gap-1.5"><HeartHandshake className="w-4 h-4 text-emerald-500" /> Offer Acceptance Rate</div>
                <div className="text-3xl font-display font-bold text-emerald-500 mt-1">0.0%</div>
                <div className="text-[10px] text-app-muted font-semibold mt-1">Waiting for data inputs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
