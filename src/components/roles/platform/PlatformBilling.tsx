import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Search, 
  CheckCircle,
  FileDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

const billingHistory = [
  { id: 'TX-901', org: 'TechCorp Solutions', plan: 'Enterprise Elite', amount: '₹1,20,000', date: '01 Jun 2024', status: 'Paid' },
  { id: 'TX-902', org: 'ABC University', plan: 'Enterprise Elite', amount: '₹1,50,000', date: '03 Jun 2024', status: 'Paid' },
  { id: 'TX-903', org: 'InnovateX Inc', plan: 'Professional', amount: '₹75,000', date: '05 Jun 2024', status: 'Paid' },
  { id: 'TX-904', org: 'Global Recruiters Ltd', plan: 'Professional', amount: '₹75,000', date: '07 Jun 2024', status: 'Failed' },
  { id: 'TX-905', org: 'Future Education Group', plan: 'Enterprise Sandbox', amount: '₹1,20,000', date: '08 Jun 2024', status: 'Paid' },
];

const revenueOverviewData = [
  { month: 'Dec', rev: 12.5 },
  { month: 'Jan', rev: 14.1 },
  { month: 'Feb', rev: 15.8 },
  { month: 'Mar', rev: 16.9 },
  { month: 'Apr', rev: 17.8 },
  { month: 'May', rev: 18.6 },
];

export default function PlatformBilling() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredHistory = billingHistory.filter(tx => {
    const matchesSearch = tx.org.toLowerCase().includes(search.toLowerCase()) || tx.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div id="platform-billing-view" className="space-y-6">
      {/* Platform Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">Platform Capital</span>
          <h2 className="text-3xl font-display font-bold mt-1">SaaS Finances & Billing Oversight</h2>
          <p className="text-app-muted text-sm mt-1">Manage global enterprise subscriptions, track multi-tenant invoice cycles, and monitor revenue streams.</p>
        </div>
        <button className="px-4 py-2.5 bg-brand-blue text-white font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-brand-blue/95 cursor-pointer">
          <FileDown className="w-4 h-4" /> Export Financials
        </button>
      </div>

      {/* Finances Overview Counter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Monthly Revenue', value: '₹18.6L', change: '+14.8% MoM growth', icon: DollarSign, color: 'text-amber-500' },
          { label: 'Annual Projected Revenue', value: '₹2.18Cr', change: '+17.2% YoY growth', icon: CreditCard, color: 'text-emerald-500' },
          { label: 'Active Paid Subscriptions', value: '42 Tenants', change: '+12.9% client addition', icon: CheckCircle, color: 'text-indigo-500' },
          { label: 'Failed Payments (30d)', value: '3 invoices', change: 'Flagged or retrying', icon: AlertTriangle, color: 'text-rose-500' },
        ].map((st, idx) => {
          const Icon = st.icon;
          return (
            <div key={idx} className="p-6 rounded-[32px] glass border-app-border card-shadow flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-app-muted block">{st.label}</span>
                <div className={`text-3xl font-display font-bold mt-2 ${st.color}`}>{st.value}</div>
              </div>
              <span className="text-[10px] text-app-muted mt-2 block font-medium">{st.change}</span>
            </div>
          );
        })}
      </div>

      {/* Revenue Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Graph */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">Aryx Platform Revenue (INR Lakhs)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueOverviewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="rev" fill="#f59e0b" radius={[12, 12, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secure Checkout / Gateways Indicator */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted mb-4">Stripe API Bridge Status</h3>
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-app-surface border border-app-border rounded-2xl flex items-center gap-3">
                <span className="flex-shrink-0 w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <div className="font-bold text-app-text">Stripe Production Bridge</div>
                  <div className="text-[10px] text-emerald-500 font-semibold mt-0.5">Online • Real-Time Webhooks Active</div>
                </div>
              </div>

              <div className="p-4 bg-app-surface border border-app-border rounded-2xl flex items-center gap-3">
                <span className="flex-shrink-0 w-3 h-3 rounded-full bg-emerald-500" />
                <div>
                  <div className="font-bold text-app-text">Multi-Currency Conversion Engine</div>
                  <div className="text-[10px] text-app-muted font-medium mt-0.5">Active (INR, USD, EUR auto-exchange dynamic scale)</div>
                </div>
              </div>

              <p className="text-app-muted leading-tight text-[11px] p-2 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                Tenant organizations are automatically issued customized branded payment link triggers via email prior to their subscription renewal milestones.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History and Payments Grid */}
      <div className="p-6 sm:p-8 rounded-[32px] glass border-app-border card-shadow space-y-6">
        <div>
          <h3 className="text-2xl font-display font-medium">B2B Core Invoices log</h3>
          <p className="text-app-muted text-xs mt-1">Audit detailed ledger records of enterprise license disbursements.</p>
        </div>

        {/* Invoices List Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
            <input 
              type="text" 
              placeholder="Filter by organization name or invoice ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-app-surface border border-app-border text-xs text-app-text focus:outline-none"
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-app-surface border border-app-border text-xs font-semibold text-app-text focus:outline-none"
          >
            <option value="All">All Invoices</option>
            <option value="Paid">Completed</option>
            <option value="Failed">Declined</option>
          </select>
        </div>

        {/* Billing logs table */}
        <div className="overflow-x-auto rounded-2xl border border-app-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-app-surface border-b border-app-border text-[10px] font-bold uppercase tracking-wider text-app-muted">
                <th className="py-4 px-6">Invoice ID</th>
                <th className="py-4 px-4">Organization client</th>
                <th className="py-4 px-4">Billing plan Tier</th>
                <th className="py-4 px-4">Renewal date</th>
                <th className="py-4 px-4 text-right">Amount billed</th>
                <th className="py-4 px-6 text-center">Receipts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40 text-xs text-app-text">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((history) => (
                  <tr key={history.id} className="hover:bg-app-surface/20 transition-all">
                    <td className="py-4 px-6 font-mono font-bold text-app-muted">{history.id}</td>
                    <td className="py-4 px-4 font-bold text-app-text">{history.org}</td>
                    <td className="py-4 px-4 font-semibold text-app-text">{history.plan}</td>
                    <td className="py-4 px-4 text-app-muted font-medium">{history.date}</td>
                    <td className="py-4 px-4 text-right font-bold text-app-text">{history.amount}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                        history.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {history.status === 'Paid' ? 'Paid' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-app-muted">
                    No matching invoices found in platform ledger.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
