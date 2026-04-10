import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Zap, Shield, BarChart3, Users, Bot, FileText, Bell } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-dark-bg selection:bg-brand-blue/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 blue-gradient rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
              <Zap className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">Bench Sales <span className="text-brand-blue">AI</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#teams" className="hover:text-white transition-colors">For Teams</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onLogin}
              className="px-6 py-2 text-sm font-semibold hover:text-brand-blue transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={onGetStarted}
              className="px-6 py-2.5 blue-gradient text-white text-sm font-semibold rounded-full hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-brand-blue/20"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-blue/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-brand-violet/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-blue-400 mb-8">
              <Zap className="w-4 h-4" /> AI-Powered Job Automation
            </span>
            <h1 className="text-6xl md:text-8xl font-display font-bold leading-[1.1] mb-8">
              Your Job Search. <br />
              <span className="text-gradient">Automated.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              10–15 perfectly tailored applications sent every day. No manual effort. Just interviews.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 blue-gradient text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-brand-blue/20"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 glass text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                Watch Demo
              </button>
            </div>

            <div className="mt-16 flex items-center justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Zap key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
                <span className="ml-2 text-sm font-bold text-white">Joined by 2,400+ students</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-5xl font-display font-bold text-white mb-2">10-15</div>
            <div className="text-sm uppercase tracking-widest text-gray-500 font-bold">Apps Daily Sent</div>
          </div>
          <div>
            <div className="text-5xl font-display font-bold text-white mb-2">100%</div>
            <div className="text-sm uppercase tracking-widest text-gray-500 font-bold">AI Resume Tailoring</div>
          </div>
          <div>
            <div className="text-5xl font-display font-bold text-white mb-2">Live</div>
            <div className="text-sm uppercase tracking-widest text-gray-500 font-bold">Real-Time Tracking</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-sm uppercase tracking-[0.3em] text-brand-blue font-bold mb-4">Premium Capabilities</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold">Everything Built In</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: "AI Resume Tailoring", desc: "Dynamically rewrites bullet points to match job descriptions perfectly." },
              { icon: Zap, title: "Cover Letter Generation", desc: "Unique, persuasive letters for every application that beat the bots." },
              { icon: BarChart3, title: "Live Application Dashboard", desc: "See exactly where you applied, when, and the current status." },
              { icon: Bot, title: "Agent Oversight", desc: "Human experts monitor your automated agent for 100% accuracy." },
              { icon: Bell, title: "Smart Notifications", desc: "Instant alerts via Email or WhatsApp for interview requests." },
              { icon: Shield, title: "Anti-Ban Protection", desc: "Proprietary logic mimics human browsing to prevent LinkedIn/Indeed bans." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl glass hover:bg-white/[0.08] transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-6 group-hover:blue-gradient group-hover:text-white transition-all">
                  <feature.icon className="w-6 h-6 text-brand-blue group-hover:text-white" />
                </div>
                <h4 className="text-xl font-bold mb-4">{feature.title}</h4>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stakeholders Section */}
      <section className="py-32 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-display font-bold">Built for Every Stakeholder</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                role: "Student / Job Seeker", 
                icon: Users,
                features: ["Auto-apply 24/7", "Personal Brand Tuning"],
                desc: "Focus on interview prep while we handle the grunt work of sourcing and applying to roles."
              },
              { 
                role: "Agent / Subadmin", 
                icon: Zap,
                features: ["Bulk Task Management", "Client Reports"],
                desc: "Manage multiple candidates efficiently with multi-tenant dashboard and performance logs."
              },
              { 
                role: "Admin / Superadmin", 
                icon: Shield,
                features: ["API Access", "Security Whitelisting"],
                desc: "Global configuration, billing management, and platform-wide security protocols."
              }
            ].map((item, i) => (
              <div key={i} className="p-10 rounded-[40px] glass border-white/5 flex flex-col items-start">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8">
                  <item.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h4 className="text-2xl font-bold mb-4">{item.role}</h4>
                <p className="text-gray-400 mb-8 leading-relaxed">{item.desc}</p>
                <div className="mt-auto space-y-3">
                  {item.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-brand-blue" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-display font-bold mb-4">Simple, Transparent Pricing</h3>
            <p className="text-gray-400">Choose the plan that fits your career velocity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Free", price: "0", features: ["3 applications per day", "Basic Resume Parsing", "Public Dashboard"] },
              { name: "Pro", price: "49", popular: true, features: ["15 applications per day", "AI Resume Tailoring", "WhatsApp Notifications", "Anti-Ban Protection"] },
              { name: "Team", price: "199", features: ["Unlimited applications", "5 Admin Seats", "Custom API Webhooks", "Dedicated Success Agent"] }
            ].map((plan, i) => (
              <div key={i} className={`p-10 rounded-[40px] glass relative ${plan.popular ? 'border-brand-blue ring-1 ring-brand-blue/50' : 'border-white/5'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 blue-gradient text-white text-xs font-bold rounded-full uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-display font-bold">${plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <div className="space-y-4 mb-10">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-brand-blue" /> {f}
                    </div>
                  ))}
                </div>
                <button className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.popular ? 'blue-gradient text-white shadow-lg shadow-brand-blue/20' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                  {plan.name === "Team" ? "Contact Sales" : plan.name === "Free" ? "Start Free" : "Upgrade to Pro"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="text-brand-blue w-6 h-6" />
              <span className="text-xl font-display font-bold tracking-tight text-white">Bench Sales AI</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              The world's first autonomous job search agent. Empowering candidates with AI-driven application velocity.
            </p>
          </div>
          
          <div>
            <h5 className="text-white font-bold mb-6">Product</h5>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6">Company</h5>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6">Legal</h5>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">© 2024 Bench Sales AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button className="text-gray-600 hover:text-white transition-colors"><Zap className="w-5 h-5" /></button>
            <button className="text-gray-600 hover:text-white transition-colors"><Zap className="w-5 h-5" /></button>
            <button className="text-gray-600 hover:text-white transition-colors"><Zap className="w-5 h-5" /></button>
          </div>
        </div>
      </footer>
    </div>
  );
}
