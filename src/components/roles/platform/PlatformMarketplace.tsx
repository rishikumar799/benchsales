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

const trendData = [
  { month: 'Dec', candidates: 98000, recruiters: 2100, apps: 32000 },
  { month: 'Jan', candidates: 104000, recruiters: 2250, apps: 35000 },
  { month: 'Feb', candidates: 112000, recruiters: 2400, apps: 38000 },
  { month: 'Mar', candidates: 118000, recruiters: 2550, apps: 40000 },
  { month: 'Apr', candidates: 122000, recruiters: 2700, apps: 41200 },
  { month: 'May', candidates: 125430, recruiters: 2845, apps: 42188 },
];

const categoryData = [
  { name: 'IT Services', value: 45, color: '#8b5cf6' },
  { name: 'Product', value: 25, color: '#3b82f6' },
  { name: 'Consulting', value: 15, color: '#10b981' },
  { name: 'Finance', value: 10, color: '#f59e0b' },
  { name: 'Others', value: 5, color: '#ef4444' },
];

export default function PlatformMarketplace() {
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
          { label: 'Total Candidates', value: '125,430', change: '+13.0%', color: 'text-violet-500', bg: 'bg-violet-500/10' },
          { label: 'Total Recruiters', value: '2,845', change: '+15.4%', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Total BDMs / Managers', value: '1,246', change: '+12.1%', color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active Jobs', value: '5,620', change: '+14.0%', color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Total Applications', value: '42,188', change: '+18.1%', color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((st, idx) => (
          <div key={idx} className="p-5 rounded-[28px] glass border-app-border card-shadow">
            <span className="text-[10px] font-bold uppercase tracking-widest text-app-muted block">{st.label}</span>
            <div className={`text-2xl font-display font-bold mt-1.5 ${st.color}`}>{st.value}</div>
            <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">▲ {st.change}</span>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Growth */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">Candidate Growth Pattern</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" fontSize={10} stroke="#9ca3af" />
                <YAxis fontSize={10} stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="candidates" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recruiter Activity */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">Recruiter Onboarding</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" fontSize={10} stroke="#9ca3af" />
                <YAxis fontSize={10} stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="recruiters" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Applications Trend */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">Application Activity</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" fontSize={10} stroke="#9ca3af" />
                <YAxis fontSize={10} stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="apps" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
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
            {[
              { skill: 'JavaScript / TS', count: '12,430 listings', percent: 85, color: 'bg-violet-500' },
              { skill: 'Python / ML', count: '10,245 listings', percent: 76, color: 'bg-blue-500' },
              { skill: 'React / Next.js', count: '9,876 listings', percent: 70, color: 'bg-emerald-500' },
              { skill: 'Node.js Backend', count: '7,650 listings', percent: 58, color: 'bg-amber-500' },
              { skill: 'SQL Databases', count: '6,342 listings', percent: 45, color: 'bg-rose-500' },
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
            ))}
          </div>
        </div>

        {/* Jobs by Category */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">Jobs by Industry Domain</h3>
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
        </div>

        {/* Top Locations */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">Top Location Hubs</h3>
            <MapPin className="w-4 h-4 text-brand-blue" />
          </div>
          <div className="space-y-3">
            {[
              { place: 'Bengaluru / India', count: '12,430 Active', flag: '📍' },
              { place: 'Hyderabad / India', count: '8,654 Active', flag: '📍' },
              { place: 'Pune / India', count: '6,431 Active', flag: '📍' },
              { place: 'Delhi NCR', count: '5,678 Active', flag: '📍' },
              { place: 'Mumbai / India', count: '4,995 Active', flag: '📍' },
            ].map((loc, i) => (
              <div key={i} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-app-surface/50 border border-app-border">
                <span className="font-bold flex items-center gap-2">
                  <span>{loc.flag}</span> {loc.place}
                </span>
                <span className="text-brand-blue font-bold">{loc.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
