import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Briefcase, 
  Activity, 
  TrendingUp, 
  Layers, 
  Sparkles,
  MapPin,
  Flame,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { usePlatformAdmin } from '../../../context/PlatformAdminContext';

export default function PlatformMarketplace() {
  const { 
    candidatesCount, 
    recruitersCount, 
    bdmsCount, 
    activeJobsCount, 
    applicationsCount,
    platformAnalytics 
  } = usePlatformAdmin();

  const trendData = platformAnalytics?.trends || [];

  const categoryData = activeJobsCount > 0 ? [
    { name: 'Engineering & CS', value: 100, color: '#8b5cf6' },
  ] : [];

  return (
    <div id="platform-marketplace-view" className="space-y-6">
      {/* Platform Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">Ecosystem Isolation - Tier 1</span>
        <h2 className="text-3xl font-display font-bold mt-1">Marketplace Agency Ecosystem</h2>
        <p className="text-app-muted text-sm mt-1">Analytics and insights for freelance staffing agencies, recruiters, and independent candidate profiles.</p>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Candidates', value: candidatesCount.toLocaleString(), color: 'text-violet-500' },
          { label: 'Total Recruiters', value: recruitersCount.toLocaleString(), color: 'text-emerald-500' },
          { label: 'Total BDMs / Managers', value: bdmsCount.toLocaleString(), color: 'text-blue-500' },
          { label: 'Active Jobs', value: activeJobsCount.toLocaleString(), color: 'text-amber-500' },
          { label: 'Total Applications', value: applicationsCount.toLocaleString(), color: 'text-purple-500' },
        ].map((st, idx) => (
          <div key={idx} className="p-5 rounded-[28px] glass border-app-border card-shadow">
            <span className="text-[10px] font-bold uppercase tracking-widest text-app-muted block">{st.label}</span>
            <div className={`text-2xl font-display font-bold mt-1.5 ${st.color}`}>{st.value}</div>
            <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">▲ Real-Time Sync</span>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Growth */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">Candidate Growth Pattern</h3>
          <div className="h-48">
            {trendData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-app-muted font-bold text-sm">
                No Records Found
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" fontSize={10} stroke="#9ca3af" />
                  <YAxis fontSize={10} stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="candidates" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recruiter Activity */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">Recruiter Onboarding</h3>
          <div className="h-48">
            {trendData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-app-muted font-bold text-sm">
                No Records Found
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" fontSize={10} stroke="#9ca3af" />
                  <YAxis fontSize={10} stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="recruiters" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Applications Trend */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">Application Activity</h3>
          <div className="h-48">
            {trendData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-app-muted font-bold text-sm">
                No Records Found
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" fontSize={10} stroke="#9ca3af" />
                  <YAxis fontSize={10} stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="apps" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Demand & Locations Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Skills Demand */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">Top Skills In Demand</h3>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="space-y-3.5">
            {activeJobsCount === 0 ? (
              <div className="py-12 text-center text-app-muted font-bold text-xs">
                No Records Found
              </div>
            ) : (
              [
                { skill: 'JavaScript / TS', count: `${activeJobsCount} listings`, percent: 100, color: 'bg-violet-500' },
              ].map((sk, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-app-text">{sk.skill}</span>
                    <span className="text-app-muted">{sk.count}</span>
                  </div>
                  <div className="w-full bg-app-surface border border-app-border h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${sk.color}`} style={{ width: `${sk.percent}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Jobs by Category */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">Jobs by Industry Domain</h3>
          {activeJobsCount === 0 ? (
            <div className="py-12 text-center text-app-muted font-bold text-xs">
              No Records Found
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-32 h-32 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2 text-xs">
                {categoryData.map((cat, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-app-text">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </div>
                    <span className="text-app-muted font-bold">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Locations */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">Top Location Hubs</h3>
            <MapPin className="w-4 h-4 text-brand-blue" />
          </div>
          <div className="space-y-3">
            {activeJobsCount === 0 ? (
              <div className="py-12 text-center text-app-muted font-bold text-xs">
                No Records Found
              </div>
            ) : (
              [
                { place: 'Bengaluru / India', count: `${activeJobsCount} Active`, flag: '📍' },
              ].map((loc, i) => (
                <div key={i} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-app-surface/50 border border-app-border">
                  <span className="font-bold flex items-center gap-2">
                    <span>{loc.flag}</span> {loc.place}
                  </span>
                  <span className="text-brand-blue font-bold">{loc.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
