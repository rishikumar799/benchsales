import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Building, 
  ShieldAlert, 
  Save, 
  CheckCircle, 
  Sliders, 
  Bell, 
  Mail, 
  Lock 
} from 'lucide-react';

interface CompanySettings {
  organizationName?: string;
  category?: string;
  primarySegment?: string;
  website?: string;
  hqLocation?: string;
  foundedYear?: string;
  workforceVolume?: string;
  supportEmail?: string;
  enableAutoSuggestions?: boolean;
  digestFrequency?: string;
  portalStatus?: string;
}

interface CompanyAdminSettingsProps {
  initialSettings: CompanySettings;
  onSaveSettings: (settings: CompanySettings) => Promise<boolean>;
}

export default function CompanyAdminSettings({ initialSettings, onSaveSettings }: CompanyAdminSettingsProps) {
  const [formData, setFormData] = useState<CompanySettings>({
    organizationName: '',
    category: '',
    primarySegment: '',
    website: '',
    hqLocation: '',
    foundedYear: '',
    workforceVolume: '',
    supportEmail: '',
    enableAutoSuggestions: true,
    digestFrequency: 'Daily',
    portalStatus: 'Active'
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');

  useEffect(() => {
    setFormData({
      organizationName: initialSettings.organizationName || '',
      category: initialSettings.category || 'Technology, Information and Internet',
      primarySegment: initialSettings.primarySegment || 'Software Development',
      website: initialSettings.website || 'www.techsolutions.com',
      hqLocation: initialSettings.hqLocation || 'Bangalore, India',
      foundedYear: initialSettings.foundedYear || '2015',
      workforceVolume: initialSettings.workforceVolume || '1001 - 5000 Employees',
      supportEmail: initialSettings.supportEmail || 'contact@techsolutions.com',
      enableAutoSuggestions: initialSettings.enableAutoSuggestions !== undefined ? initialSettings.enableAutoSuggestions : true,
      digestFrequency: initialSettings.digestFrequency || 'Daily',
      portalStatus: initialSettings.portalStatus || 'Active'
    });
  }, [initialSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    const ok = await onSaveSettings(formData);
    setSaving(false);
    if (ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-app-text" id="settings-tab-root">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-black text-app-text tracking-tight flex items-center gap-2">
          Administrative Settings
        </h1>
        <p className="text-app-muted text-sm font-medium mt-1">
          Supervise recruitment parameters, legal identities and system notifications triggers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 flex lg:flex-col gap-2 p-3 rounded-2xl glass border border-app-border/80">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-brand-blue text-white shadow-md'
                : 'text-app-muted hover:bg-app-surface/60 hover:text-app-text'
            }`}
          >
            <Building className="w-4 h-4" /> Company Identity
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'preferences'
                ? 'bg-brand-blue text-white shadow-md'
                : 'text-app-muted hover:bg-app-surface/60 hover:text-app-text'
            }`}
          >
            <Sliders className="w-4 h-4" /> Preferences & Alerts
          </button>
        </div>

        {/* Configurations Form */}
        <div className="lg:col-span-9">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-[32px] glass border border-app-border/80 card-shadow space-y-6">
            
            {success && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-fade-in">
                <CheckCircle className="w-5 h-5" />
                <span>Configuration changes saved and updated in real-time successfully!</span>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-3 border-b border-app-border/40 pb-4">
                  <Building className="w-5 h-5 text-brand-blue" />
                  <h3 className="text-base font-black font-display text-app-text">Corporate Legal Identity</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-app-muted">Legal Entity Name</label>
                    <input 
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      placeholder="e.g. Tech Solutions Pvt. Ltd."
                      className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-app-muted">Corporate Category</label>
                    <input 
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="e.g. Technology, Information and Internet"
                      className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-app-muted">Primary Business Segment</label>
                    <input 
                      type="text"
                      name="primarySegment"
                      value={formData.primarySegment}
                      onChange={handleChange}
                      placeholder="e.g. Software Development"
                      className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-app-muted">Official Corporate URL</label>
                    <input 
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="e.g. www.techsolutions.com"
                      className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-app-muted">Headquarters Location</label>
                    <input 
                      type="text"
                      name="hqLocation"
                      value={formData.hqLocation}
                      onChange={handleChange}
                      placeholder="e.g. Bangalore, India"
                      className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-app-muted">Founded Year</label>
                    <input 
                      type="text"
                      name="foundedYear"
                      value={formData.foundedYear}
                      onChange={handleChange}
                      placeholder="e.g. 2015"
                      className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-app-muted">Workforce Volume scale</label>
                    <select
                      name="workforceVolume"
                      value={formData.workforceVolume}
                      onChange={handleChange}
                      className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                    >
                      <option value="1 - 10 Employees">1 - 10 Employees</option>
                      <option value="11 - 50 Employees">11 - 50 Employees</option>
                      <option value="51 - 200 Employees">51 - 200 Employees</option>
                      <option value="201 - 1000 Employees">201 - 1000 Employees</option>
                      <option value="1001 - 5000 Employees">1001 - 5000 Employees</option>
                      <option value="5000+ Employees">5000+ Employees</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-app-muted">Official Corporate Support Email</label>
                    <input 
                      type="email"
                      name="supportEmail"
                      value={formData.supportEmail}
                      onChange={handleChange}
                      placeholder="e.g. contact@techsolutions.com"
                      className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-3 border-b border-app-border/40 pb-4">
                  <Sliders className="w-5 h-5 text-brand-violet" />
                  <h3 className="text-base font-black font-display text-app-text">Recruitment Preferences & Notifications</h3>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  <div className="flex items-center justify-between p-4 bg-app-surface/40 border border-app-border rounded-2xl">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-extrabold text-app-text">Enable AI Candidate Suggestions</h4>
                      <p className="text-app-muted text-[11px] font-semibold">Allow system-wide machine learning algorithms to auto-rank candidate applications.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        name="enableAutoSuggestions"
                        checked={formData.enableAutoSuggestions}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-app-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-blue"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-app-muted">Hiring Digest Notifications frequency</label>
                      <select
                        name="digestFrequency"
                        value={formData.digestFrequency}
                        onChange={handleChange}
                        className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                      >
                        <option value="Realtime">Realtime (Instant)</option>
                        <option value="Daily">Daily Summary</option>
                        <option value="Weekly">Weekly digest</option>
                        <option value="Disabled">Disabled</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-app-muted">Hiring Portal Status</label>
                      <select
                        name="portalStatus"
                        value={formData.portalStatus}
                        onChange={handleChange}
                        className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                      >
                        <option value="Active">Active (Accepting applications)</option>
                        <option value="Maintenance">Maintenance Mode</option>
                        <option value="Closed">Closed (Hidden from public listings)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end border-t border-app-border/40 pt-5">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl flex items-center gap-2 hover:scale-[1.01] active:scale-95 transition-all text-xs shadow-md disabled:opacity-60 disabled:pointer-events-none"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving changes...' : 'Save Settings'}
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
