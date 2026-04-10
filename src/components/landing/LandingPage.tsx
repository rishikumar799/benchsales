import { motion } from 'motion/react';
import { ArrowRight, Zap, CheckCircle2, Shield, BarChart3, Users, Bot, FileText, Bell, Play, ShieldCheck } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function LandingPage({ onGetStarted, onLogin, theme, toggleTheme }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-app-bg selection:bg-brand-blue/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-app-border/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 blue-gradient rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
              <Zap className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">Bench Sales <span className="text-brand-blue">AI</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-app-muted">
            <a href="#features" className="hover:text-app-text transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-app-text transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-app-text transition-colors">Pricing</a>
            <a href="#teams" className="hover:text-app-text transition-colors">For Teams</a>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button 
              onClick={onLogin}
              className="px-6 py-2 text-sm font-semibold hover:text-brand-blue transition-colors text-app-text"
            >
              Sign In
            </button>
            <button 
              onClick={onGetStarted}
              className="px-6 py-2.5 premium-gradient text-white text-sm font-semibold rounded-full hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-brand-blue/20"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-blue/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-brand-violet/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/5 border border-brand-blue/10 text-sm font-medium text-brand-blue mb-8">
              <Zap className="w-4 h-4" /> The World's First Autonomous Job Agent
            </span>
            <h1 className="text-6xl md:text-8xl font-display font-bold leading-[1.1] mb-8">
              Your Job Search. <br />
              <span className="text-gradient">Fully Automated.</span>
            </h1>
            <p className="text-xl text-app-muted max-w-2xl mx-auto mb-12 leading-relaxed">
              Stop wasting hours on manual applications. Our AI agent sources, tailors, and applies to 10–15 roles daily while you focus on interviews.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-10 py-5 premium-gradient text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-2xl shadow-brand-blue/30"
              >
                Start Free Today <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-10 py-5 glass border-app-border text-app-text font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-app-surface transition-colors">
                <Play className="w-4 h-4 fill-current" /> Watch Demo
              </button>
            </div>

            <div className="mt-20 pt-10 border-t border-app-border/30 flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="text-2xl font-display font-bold">Google</div>
              <div className="text-2xl font-display font-bold">Meta</div>
              <div className="text-2xl font-display font-bold">Stripe</div>
              <div className="text-2xl font-display font-bold">Vercel</div>
              <div className="text-2xl font-display font-bold">Netflix</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Applications Sent', value: '2.4M+', desc: 'Across all active users' },
              { label: 'Interview Rate', value: '18%', desc: 'Average increase in velocity' },
              { label: 'Time Saved', value: '25h', desc: 'Per week per candidate' },
            ].map((stat, i) => (
              <div key={i} className="p-10 rounded-[40px] glass border-app-border text-center">
                <div className="text-5xl font-display font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-lg font-bold text-app-text mb-1">{stat.label}</div>
                <div className="text-sm text-app-muted">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 bg-app-surface/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-sm uppercase tracking-[0.3em] text-brand-blue font-bold mb-4">Premium Capabilities</h2>
              <h3 className="text-4xl md:text-6xl font-display font-bold">Everything you need to beat the bots.</h3>
            </div>
            <p className="text-app-muted max-w-md">
              From deep AI customization to bulletproof anti-ban measures, we've thought of everything to keep your search safe and successful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: "AI Resume Tailoring", desc: "Dynamically rewrites bullet points to match job descriptions perfectly using Gemini 1.5 Pro." },
              { icon: Zap, title: "Cover Letter Generation", desc: "Unique, persuasive letters for every application that bypass ATS filters with ease." },
              { icon: BarChart3, title: "Live Application Dashboard", desc: "See exactly where you applied, when, and the current status in real-time." },
              { icon: Bot, title: "Agent Oversight", desc: "Human experts monitor your automated agent for 100% accuracy and quality control." },
              { icon: Bell, title: "Smart Notifications", desc: "Instant alerts via Email or WhatsApp the second an employer reaches out." },
              { icon: Shield, title: "Anti-Ban Protection", desc: "Proprietary logic mimics human browsing patterns to prevent LinkedIn/Indeed bans." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[40px] glass border-app-border hover:bg-app-bg transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-8 group-hover:blue-gradient group-hover:text-white transition-all">
                  <feature.icon className="w-7 h-7 text-brand-blue group-hover:text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-4">{feature.title}</h4>
                <p className="text-app-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-display font-bold">Built for Every Stakeholder</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {[
              { role: "Student / Job Seeker", icon: Users, desc: "Focus on interview prep while we handle the grunt work of sourcing and applying." },
              { role: "Agent / Manager", icon: Zap, desc: "Manage multiple candidates efficiently with multi-tenant dashboards." },
              { role: "Manager / Supervisor", icon: ShieldCheck, desc: "Oversee agent performance and handle student approvals and follow-ups." },
              { role: "Admin / Superadmin", icon: BarChart3, desc: "Global configuration, billing, and platform-wide security protocols." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl glass border-app-border flex flex-col card-shadow">
                <div className="w-12 h-12 rounded-xl bg-brand-blue/5 flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-brand-blue" />
                </div>
                <h4 className="text-xl font-bold mb-3">{item.role}</h4>
                <p className="text-sm text-app-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-app-border bg-app-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-8">
              <Zap className="text-brand-blue w-8 h-8" />
              <span className="text-2xl font-display font-bold tracking-tight">Bench Sales</span>
            </div>
            <p className="text-app-muted text-sm leading-relaxed mb-8">
              The world's first autonomous job search agent. Empowering candidates with AI-driven application velocity.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full glass border-app-border flex items-center justify-center hover:text-brand-blue cursor-pointer transition-colors"><Zap className="w-5 h-5" /></div>
              <div className="w-10 h-10 rounded-full glass border-app-border flex items-center justify-center hover:text-brand-blue cursor-pointer transition-colors"><Zap className="w-5 h-5" /></div>
              <div className="w-10 h-10 rounded-full glass border-app-border flex items-center justify-center hover:text-brand-blue cursor-pointer transition-colors"><Zap className="w-5 h-5" /></div>
            </div>
          </div>
          
          <div>
            <h5 className="font-bold mb-8">Product</h5>
            <ul className="space-y-4 text-sm text-app-muted">
              <li><a href="#" className="hover:text-brand-blue transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-8">Company</h5>
            <ul className="space-y-4 text-sm text-app-muted">
              <li><a href="#" className="hover:text-brand-blue transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Privacy</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-8">Newsletter</h5>
            <p className="text-sm text-app-muted mb-6">Get the latest updates on AI job automation.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="flex-1 bg-app-bg border border-app-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-blue" />
              <button className="px-4 py-2 blue-gradient text-white text-sm font-bold rounded-xl">Join</button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-app-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-app-muted text-xs">© 2024 Bench Sales AI. All rights reserved.</p>
          <div className="flex items-center gap-8 text-xs text-app-muted">
            <a href="#" className="hover:text-app-text">Terms</a>
            <a href="#" className="hover:text-app-text">Privacy</a>
            <a href="#" className="hover:text-app-text">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
