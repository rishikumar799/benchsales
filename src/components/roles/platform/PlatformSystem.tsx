import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Cpu, 
  Database, 
  Server, 
  Bell, 
  Key, 
  Clock, 
  AlertTriangle,
  Code2,
  Terminal
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { usePlatformAdmin } from '../../../context/PlatformAdminContext';

const liveSystemTelemetry = [
  { time: '00:00', response: 138, errors: 0.2, tokens: 1.2 },
  { time: '04:00', response: 145, errors: 0.35, tokens: 0.8 },
  { time: '08:00', response: 140, errors: 0.22, tokens: 1.9 },
  { time: '12:00', response: 152, errors: 0.45, tokens: 2.8 },
  { time: '16:00', response: 142, errors: 0.28, tokens: 2.4 },
  { time: '20:00', response: 135, errors: 0.15, tokens: 2.1 },
];

export default function PlatformSystem() {
  const { systemMetrics, auditLogs, loginLogs, platformAnalytics } = usePlatformAdmin();

  const activeServices = [
    { name: 'Authentication Layer', status: systemMetrics?.apiStatus === '0' ? 'Inactive' : 'Healthy', latency: '0ms', load: '0%', icon: Key },
    { name: 'AI Services (L1-L8 Routing)', status: systemMetrics?.apiStatus === '0' ? 'Inactive' : 'Healthy', latency: systemMetrics?.aiLatency || '0ms', load: '0%', icon: Cpu },
    { name: 'Relational Cloud SQL Database', status: systemMetrics?.dbReplicaStatus || 'Inactive', latency: '0ms', load: '0%', icon: Database },
    { name: 'Secured Object Storage', status: systemMetrics?.apiStatus === '0' ? 'Inactive' : 'Healthy', latency: '0ms', load: '0%', icon: Server },
    { name: 'Ecosystem Dispatch Webhooks', status: systemMetrics?.apiStatus === '0' ? 'Inactive' : 'Healthy', latency: '0ms', load: '0%', icon: Bell },
  ];

  const mergedLogs = [
    ...loginLogs.map(log => ({
      event: `User ${log.email} successfully authenticated from IP ${log.ip || 'Unknown'}`,
      category: 'AUTH_GATEWAY',
      time: new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false }),
      type: 'info',
      rawTime: log.timestamp
    })),
    ...auditLogs.map(log => ({
      event: `Action "${log.action}" performed on target "${log.target}"`,
      category: 'AUDIT_LOG',
      time: new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false }),
      type: log.action.toLowerCase().includes('delete') || log.action.toLowerCase().includes('suspend') ? 'warn' : 'info',
      rawTime: log.timestamp
    }))
  ].sort((a, b) => new Date(b.rawTime).getTime() - new Date(a.rawTime).getTime()).slice(0, 20);

  const logsToDisplay = mergedLogs;

  const storageUsed = systemMetrics?.storageUsedGB || 0;
  const storageTotal = systemMetrics?.storageTotalGB || 0;
  const storageUsagePct = storageTotal > 0 ? ((storageUsed / storageTotal) * 100).toFixed(0) : '0';

  const liveSystemTelemetry = platformAnalytics?.trends || [];

  return (
    <div id="platform-system-view" className="space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">Core Hardware & Network Telemetry</span>
        <h2 className="text-3xl font-display font-medium mt-1">Platform System Health</h2>
        <p className="text-app-muted text-sm mt-1">Regulate system uptime, microservice performance rates, and relational cloud infrastructure health.</p>
      </div>

      {/* Services status indicators */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {activeServices.map((srv, idx) => {
          const Icon = srv.icon;
          return (
            <div key={idx} className="p-5 rounded-3xl glass border-app-border card-shadow flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <Icon className="w-4 h-4 text-emerald-500" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  srv.status === 'Healthy' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'
                }`}>
                  {srv.status}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-xs font-bold text-app-text block truncate">{srv.name}</span>
                <div className="text-sm font-mono font-bold text-app-muted mt-1">Latency: {srv.latency}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key system load metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'API Response Time (AVG)', value: systemMetrics?.aiLatency || '0ms', change: 'Real-Time Telemetry', status: 'text-emerald-500' },
          { label: 'Core System Error Rate', value: '0.00%', change: 'Real-Time Telemetry', status: 'text-emerald-500' },
          { label: 'AI Inference Tokens (24h)', value: '0.0M', change: 'Real-Time Telemetry', status: 'text-indigo-500' },
          { label: 'Cloud SQL Storage usage', value: `${storageUsagePct}%`, change: 'Real-Time Telemetry', status: 'text-blue-500' },
        ].map((met, idx) => (
          <div key={idx} className="p-6 rounded-[28px] bg-app-surface/40 border border-app-border select-none">
            <span className="text-[10px] uppercase tracking-wider text-app-muted font-bold block">{met.label}</span>
            <div className={`text-2xl font-mono font-bold mt-1.5 ${met.status}`}>{met.value}</div>
            <span className="text-[10px] text-app-muted font-medium mt-1 block">{met.change}</span>
          </div>
        ))}
      </div>

      {/* Live System performance charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency graph */}
        <div className="p-6 sm:p-8 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">API Core Latency Trend (ms)</h3>
          <div className="h-48">
            {liveSystemTelemetry.length === 0 ? (
              <div className="h-full flex items-center justify-center text-app-muted font-bold text-sm">
                No Records Found
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={liveSystemTelemetry} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="time" fontSize={10} stroke="#9ca3af" />
                  <YAxis fontSize={10} stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="response" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Error rate graph */}
        <div className="p-6 sm:p-8 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">HTTP Router Error Rate (%)</h3>
          <div className="h-48">
            {liveSystemTelemetry.length === 0 ? (
              <div className="h-full flex items-center justify-center text-app-muted font-bold text-sm">
                No Records Found
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={liveSystemTelemetry} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="time" fontSize={10} stroke="#9ca3af" />
                  <YAxis fontSize={10} stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Live Operations Events Stream terminal */}
      <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted flex items-center gap-2">
            <Terminal className="w-4 h-4 text-brand-violet" /> Real-time Platform Operations Stream
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold uppercase tracking-wider animate-pulse">Running live</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-900 space-y-2.5 max-h-60 overflow-y-auto">
          {logsToDisplay.length === 0 ? (
            <div className="text-center text-slate-500 py-8 font-bold">
              No Records Found
            </div>
          ) : (
            logsToDisplay.map((log, idx) => (
              <div key={idx} className="flex gap-4 items-start py-0.5 border-b border-slate-900/50 hover:bg-slate-900/20">
                <span className="text-slate-500 text-[10px] select-none">[{log.time}]</span>
                <span className={`text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded ${
                  log.type === 'warn' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-400'
                }`}>{log.category}</span>
                <span className="flex-1 text-slate-300 font-medium">{log.event}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
