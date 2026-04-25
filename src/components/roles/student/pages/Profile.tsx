import { motion } from 'motion/react';
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Github, 
  Linkedin, 
  Edit3, 
  Plus,
  FileText,
  Briefcase,
  GraduationCap,
  Award
} from 'lucide-react';

export default function StudentProfile() {
  const skills = ['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS', 'AWS', 'Docker', 'Python', 'GraphQL', 'Redux'];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header / Cover */}
      <div className="relative">
        <div className="h-48 premium-gradient rounded-[40px] overflow-hidden opacity-90 shadow-xl" />
        <div className="absolute bottom-[-64px] left-12 flex items-end gap-6">
          <div className="w-32 h-32 rounded-[32px] blue-gradient p-1 shadow-2xl">
            <img 
              src="https://picsum.photos/seed/rishi/150/150" 
              alt="Avatar" 
              className="w-full h-full rounded-[28px] object-cover border-4 border-app-bg"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="mb-4">
            <h1 className="text-3xl font-display font-bold text-app-text drop-shadow-sm">Rishi Kumar</h1>
            <p className="text-app-muted font-bold uppercase tracking-wider text-[10px]">Frontend Engineer & UI UX Designer</p>
          </div>
        </div>
        <div className="absolute bottom-4 right-8">
          <button className="px-6 py-3 glass border border-white/20 text-white text-sm font-bold rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all shadow-lg active:scale-95">
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        </div>
      </div>

      <div className="pt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Info */}
        <div className="space-y-8">
          <div className="p-8 rounded-[40px] glass border-app-border card-shadow space-y-6">
            <h3 className="text-xl font-display font-bold">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-app-muted">
                <Mail className="w-5 h-5 text-brand-blue" />
                <span className="text-sm font-medium">rishi@example.com</span>
              </div>
              <div className="flex items-center gap-3 text-app-muted">
                <Phone className="w-5 h-5 text-brand-blue" />
                <span className="text-sm font-medium">+1 (555) 000-0000</span>
              </div>
              <div className="flex items-center gap-3 text-app-muted">
                <MapPin className="w-5 h-5 text-brand-blue" />
                <span className="text-sm font-medium">San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-3 text-app-muted">
                <Globe className="w-5 h-5 text-brand-blue" />
                <span className="text-sm font-medium">rishikumar.dev</span>
              </div>
            </div>
            
            <div className="pt-6 border-t border-app-border flex items-center gap-4">
              <button className="w-10 h-10 rounded-xl bg-app-surface border border-app-border flex items-center justify-center text-app-muted hover:text-brand-blue transition-all">
                <Github className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-app-surface border border-app-border flex items-center justify-center text-app-muted hover:text-brand-blue transition-all">
                <Linkedin className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-8 rounded-[40px] glass border-app-border card-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-bold">Skills</h3>
              <button className="p-2 rounded-lg bg-app-surface border border-app-border text-app-muted hover:text-brand-blue">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill} className="px-3 py-1.5 rounded-lg bg-app-surface border border-app-border text-xs font-bold text-app-text">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Experience / Education */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 rounded-[40px] glass border-app-border card-shadow">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-brand-blue" />
                <h3 className="text-2xl font-display font-bold">Experience</h3>
              </div>
              <button className="flex items-center gap-2 text-sm font-bold text-brand-blue">
                <Plus className="w-4 h-4" /> Add Experience
              </button>
            </div>
            
            <div className="space-y-10">
              {[
                { company: 'TechFlow', role: 'Full Stack Wizard', date: '2022 - Present', desc: 'Leading the frontend team in building revolutionary AI tools.' },
                { company: 'DesignCo', role: 'UI Developer', date: '2020 - 2022', desc: 'Crafted seamless user experiences for high-growth startups.' }
              ].map((exp, i) => (
                <div key={i} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-app-border">
                  <div className="absolute left-[-5px] top-2 w-3 h-3 rounded-full bg-brand-blue" />
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold">{exp.role}</h4>
                    <span className="text-xs font-bold text-brand-blue bg-brand-blue/10 px-2 py-1 rounded-lg">{exp.date}</span>
                  </div>
                  <div className="text-sm font-bold text-app-muted mb-3">{exp.company}</div>
                  <p className="text-app-muted text-sm leading-relaxed">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-[40px] glass border-app-border card-shadow">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="w-6 h-6 text-brand-blue" />
              <h3 className="text-2xl font-display font-bold">Portfolio</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(p => (
                <div key={p} className="group cursor-pointer">
                  <div className="rounded-2xl overflow-hidden mb-3 aspect-video bg-app-surface border border-app-border relative">
                    <img 
                      src={`https://picsum.photos/seed/project${p}/400/250`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt="Project" 
                    />
                    <div className="absolute inset-0 bg-brand-blue/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="font-bold group-hover:text-brand-blue transition-colors">E-commerce Experience Design</h4>
                  <p className="text-xs text-app-muted font-medium mt-1">UX/UI • Next.js • Framer Motion</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
