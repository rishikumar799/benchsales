import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, Share2, Search, Filter, TrendingUp, Users, Clock, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/marketing/common/Navbar';
import Footer from '../../components/marketing/common/Footer';
import { Link } from 'react-router-dom';

interface DiscussionsPageProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

const discussions = [
  {
    id: 1,
    title: "How to optimize resume for AI-driven ATS?",
    author: "John Doe",
    time: "2h ago",
    likes: 128,
    comments: 45,
    tags: ["RESUME", "AI", "TIPS"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    title: "Success Story: Landed a $150k role in 2 weeks!",
    author: "Sarah Smith",
    time: "5h ago",
    likes: 450,
    comments: 89,
    tags: ["SUCCESS", "MOTIVATION"],
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    title: "Best practices for video interviews in 2024",
    author: "Mike Ross",
    time: "1d ago",
    likes: 56,
    comments: 23,
    tags: ["INTERVIEW", "VIDEO"],
    color: "from-orange-500 to-amber-500"
  },
  {
    id: 4,
    title: "The role of AI agents in the current job market",
    author: "Elena Gilbert",
    time: "3h ago",
    likes: 210,
    comments: 34,
    tags: ["AI", "JOB-MARKET"],
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: 5,
    title: "Negotiating salary after an AI-assisted application",
    author: "David Brent",
    time: "6h ago",
    likes: 89,
    comments: 12,
    tags: ["SALARY", "NEGOTIATION"],
    color: "from-rose-500 to-red-500"
  },
  {
    id: 6,
    title: "Remote vs Hybrid: What AI agents are finding more",
    author: "Rachel Zane",
    time: "1d ago",
    likes: 145,
    comments: 56,
    tags: ["REMOTE", "HYBRID"],
    color: "from-indigo-500 to-blue-500"
  }
];

export default function DiscussionsPage({ theme, toggleTheme }: DiscussionsPageProps) {
  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <main className="pt-32 pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <div>
              <Link to="/community" className="inline-flex items-center gap-2 text-brand-blue text-sm font-bold mb-4 hover:gap-3 transition-all group">
                <ArrowLeft className="w-4 h-4" />
                Back to Community
              </Link>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">
                All <span className="text-gradient">Discussions</span>
              </h1>
              <p className="text-app-muted max-w-xl">
                Explore the latest insights, success stories, and tips from our global community of professionals.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted group-focus-within:text-brand-blue transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search discussions..." 
                  className="pl-12 pr-6 py-3 rounded-2xl glass border border-app-border focus:border-brand-blue outline-none transition-all w-full md:w-64"
                />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl glass border border-app-border hover:border-brand-blue transition-all font-bold">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar Stats */}
            <div className="lg:col-span-1 space-y-8">
              <div className="p-8 rounded-[32px] glass border border-app-border bg-brand-blue/5">
                <h3 className="font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-brand-blue" />
                  Community Stats
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-app-muted">Total Posts</span>
                    <span className="font-bold">2.4k</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-app-muted">Active Users</span>
                    <span className="font-bold">1.2k</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-app-muted">Questions Solved</span>
                    <span className="font-bold">850</span>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-[32px] glass border border-app-border">
                <h3 className="font-bold mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-violet" />
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["AI", "RESUME", "SALARY", "INTERVIEW", "REMOTE", "SUCCESS", "TIPS"].map((tag) => (
                    <button key={tag} className="px-3 py-1.5 rounded-lg bg-app-surface border border-app-border text-[10px] font-bold text-app-muted hover:text-brand-blue hover:border-brand-blue transition-all">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Discussions List */}
            <div className="lg:col-span-3 space-y-6">
              {discussions.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-[32px] glass border border-app-border hover:border-brand-blue/30 transition-all group cursor-pointer bg-white/5"
                >
                  <div className="flex flex-wrap gap-4 mb-6">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-lg bg-brand-blue/10 text-brand-blue text-[10px] font-bold">
                        {tag}
                      </span>
                    ))}
                    <div className="ml-auto flex items-center gap-2 text-app-muted text-xs">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-display font-bold mb-6 group-hover:text-brand-blue transition-colors leading-tight">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-app-border">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} shadow-lg`} />
                      <div>
                        <div className="text-sm font-bold">{item.author}</div>
                        <div className="text-[10px] text-app-muted">Community Member</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-app-muted group/like">
                        <Heart className="w-4 h-4 group-hover/like:text-rose-500 transition-colors" />
                        <span className="text-sm">{item.likes}</span>
                      </div>
                      <div className="flex items-center gap-2 text-app-muted group/comment">
                        <MessageSquare className="w-4 h-4 group-hover/comment:text-brand-blue transition-colors" />
                        <span className="text-sm">{item.comments}</span>
                      </div>
                      <button className="p-2 text-app-muted hover:text-brand-blue transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="pt-8 flex justify-center">
                <button className="px-8 py-4 rounded-2xl premium-gradient text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-brand-blue/20">
                  Load More Discussions
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
