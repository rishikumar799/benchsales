import React from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Users, 
  Briefcase, 
  Building2, 
  Target, 
  Award,
  BookOpen,
  PieChart as PieIcon
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

export default function PlatformUniversities() {
  const { 
    organizations, 
    candidatesCount, 
    applicationsCount,
    platformAnalytics 
  } = usePlatformAdmin();

  const universitiesList = organizations.filter(o => o.type === 'University');
  const totalUniversities = universitiesList.length;
  const totalStudents = candidatesCount;
  const placementOfficers = 0;
  const placementsSecured = applicationsCount;
  const placementRate = 0.0;

  const dataSeries = platformAnalytics?.trends || [];

  const streamData = totalStudents > 0 ? [
    { name: 'Engineering & CS', value: 100, color: '#3b82f6' },
  ] : [];

  return (
    <div id="platform-universities-view" className="space-y-6">
      {/* Ecosystem Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">Ecosystem Isolation - Tier 2</span>
        <h2 className="text-3xl font-display font-bold mt-1">University & College Placements Ecosystem</h2>
        <p className="text-app-muted text-sm mt-1">Institutional academic structures. Multi-college datasets restricted from commercial outreach.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Universities', value: totalUniversities.toLocaleString(), color: 'text-blue-500' },
          { label: 'Total Students', value: totalStudents.toLocaleString(), color: 'text-violet-500' },
          { label: 'Placement Officers', value: placementOfficers.toLocaleString(), color: 'text-emerald-500' },
          { label: 'Placements Secured', value: placementsSecured.toLocaleString(), color: 'text-amber-500' },
          { label: 'Placement Rate (%)', value: `${placementRate.toFixed(1)}%`, color: 'text-pink-500' },
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
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">University Growth (YoY)</h3>
          <div className="h-48">
            {dataSeries.length === 0 ? (
              <div className="h-full flex items-center justify-center text-app-muted font-bold text-sm">
                No Records Found
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataSeries} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" fontSize={10} stroke="#9ca3af" />
                  <YAxis fontSize={10} stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="colleges" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">Student Accounts Connected</h3>
          <div className="h-48">
            {dataSeries.length === 0 ? (
              <div className="h-full flex items-center justify-center text-app-muted font-bold text-sm">
                No Records Found
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataSeries} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" fontSize={10} stroke="#9ca3af" />
                  <YAxis fontSize={10} stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="students" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted font-mono text-pink-500">Placement Success Rate %</h3>
          <div className="h-48">
            {dataSeries.length === 0 ? (
              <div className="h-full flex items-center justify-center text-app-muted font-bold text-sm">
                No Records Found
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataSeries} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" fontSize={10} stroke="#9ca3af" />
                  <YAxis fontSize={10} stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Streams & Top Performers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placements by Stream */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
            <PieIcon className="w-4 h-4 text-brand-blue" /> Placement Streams
          </h3>
          {totalStudents === 0 ? (
            <div className="py-8 text-center text-app-muted font-bold text-xs">
              No Records Found
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-32 h-32 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={streamData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {streamData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2 text-xs">
                {streamData.map((stream, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-app-text">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stream.color }} />
                      {stream.name}
                    </div>
                    <span className="text-app-muted font-bold">{stream.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Universities */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" /> Top Performing Institutions
          </h3>
          <div className="space-y-2">
            {universitiesList.length === 0 ? (
              <div className="py-8 text-center text-app-muted font-bold text-xs">
                No Records Found
              </div>
            ) : (
              universitiesList.slice(0, 5).map((univ, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-app-surface/50 border border-app-border text-xs flex justify-between items-center">
                  <div>
                    <div className="font-bold text-app-text truncate max-w-[150px]">{univ.name}</div>
                    <div className="text-[10px] text-app-muted/80">Active Ecosystem</div>
                  </div>
                  <span className="text-emerald-500 font-bold whitespace-nowrap text-[11px]">{univ.plan} Plan</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Student Engagement */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-violet-500" /> Student Activation Logs
          </h3>
          <div className="space-y-3 text-xs">
            {[
              { metric: 'Active Resumes Built', total: `${totalStudents} accounts`, percent: totalStudents > 0 ? 100 : 0, metricType: 'Resume files download/print ready' },
              { metric: 'Placement Profile Completion', total: totalStudents > 0 ? '100% completeness' : '0% completeness', percent: totalStudents > 0 ? 100 : 0, metricType: 'L1 to L8 grade fields configured' },
              { metric: 'Placement Applications Routed', total: `${placementsSecured} secure dispatches`, percent: placementsSecured > 0 ? 100 : 0, metricType: 'Instant agency proxy dispatch' },
            ].map((eng, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-app-surface border border-app-border space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-app-text">{eng.metric}</span>
                  <span className="font-mono text-brand-blue font-bold">{eng.total.split(' ')[0]}</span>
                </div>
                <div className="text-[10px] text-app-muted leading-tight">{eng.metricType}</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div className="h-full bg-emerald-500" style={{ width: `${eng.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
