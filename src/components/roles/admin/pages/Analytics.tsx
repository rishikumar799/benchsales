import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Download,
  Filter,
  Globe
} from 'lucide-react';

export default function AdminAnalytics() {
  const dataPoints = [
    { label: 'Platform Revenue', value: '$124,500', trend: '+18.2%', up: true },
    { label: 'Active Sessions', value: '4,284', trend: '+5.4%', up: true },
    { label: 'Conversion Rate', value: '3.2%', trend: '-0.8%', up: false },
    { label: 'Server Uptime', value: '99.98%', trend: '+0.01%', up: true },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Platform Analytics</h1>
          <p className="text-app-muted">Holistic overview of platform performance and growth metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl glass border border-app-border text-sm font-bold hover:bg-app-surface transition-all">
            <Calendar className="w-4 h-4" /> Customized Range
          </button>
          <button className="px-6 py-3 premium-gradient text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-blue/20 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export BI Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dataPoints.map((p, i) => (
          <div key={i} className="p-8 rounded-[32px] glass border-app-border card-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-blue/5 rounded-full blur-2xl group-hover:bg-brand-blue/10 transition-colors" />
            <div className="text-[10px] font-bold text-app-muted uppercase tracking-[0.2em] mb-4">{p.label}</div>
            <div className="text-3xl font-display font-bold mb-1 tracking-tight">{p.value}</div>
            <div className={`text-xs font-bold flex items-center gap-1 ${p.up ? 'text-emerald-500' : 'text-red-500'}`}>
              {p.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {p.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 p-8 rounded-[40px] glass border-app-border card-shadow h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-display font-bold">Growth Map</h3>
               <div className="flex items-center gap-2">
                 <button className="px-3 py-1 text-[10px] font-bold text-brand-blue bg-brand-blue/10 rounded-lg uppercase tracking-widest">Revenue</button>
                 <button className="px-3 py-1 text-[10px] font-bold text-app-muted hover:bg-app-surface rounded-lg uppercase tracking-widest">Users</button>
               </div>
            </div>
            <div className="flex-1 bg-app-surface/30 rounded-3xl border border-app-border/50 flex items-center justify-center p-8">
              <div className="w-full h-full flex items-end justify-between gap-6 px-10 pt-10">
                {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="flex-1 premium-gradient rounded-t-2xl relative"
                  />
                ))}
              </div>
            </div>
         </div>

         <div className="p-8 rounded-[40px] glass border-app-border card-shadow space-y-8">
            <h3 className="text-xl font-display font-bold">Global Reach</h3>
            <div className="space-y-6">
              {[
                { country: 'United States', val: '45%', color: 'bg-blue-500' },
                { country: 'United Kingdom', val: '22%', color: 'bg-violet-500' },
                { country: 'India', val: '18%', color: 'bg-emerald-500' },
                { country: 'Germany', val: '15%', color: 'bg-orange-500' },
              ].map((c, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-app-muted">{c.country}</span>
                    <span>{c.val}</span>
                  </div>
                  <div className="h-1.5 bg-app-bg rounded-full overflow-hidden">
                    <div className={`h-full ${c.color} rounded-full`} style={{ width: c.val }} />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-app-surface border border-app-border rounded-2xl text-xs font-bold hover:bg-app-bg transition-all">
              <Globe className="w-4 h-4" /> View Detailed Geo Map
            </button>
         </div>
      </div>
    </div>
  );
}
