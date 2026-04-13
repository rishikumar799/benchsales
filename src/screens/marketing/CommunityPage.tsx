import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Globe, 
  Award, 
  Search,
  ArrowRight,
  Sparkles,
  Heart,
  Share2
} from 'lucide-react';
import SectionWrapper from '../../components/marketing/common/SectionWrapper';
import Navbar from '../../components/marketing/common/Navbar';
import Footer from '../../components/marketing/common/Footer';
import CTAButton from '../../components/marketing/common/CTAButton';

interface CommunityPageProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

export default function CommunityPage({ theme, toggleTheme }: CommunityPageProps) {
  const stats = [
    { label: 'Members', value: '50k+', icon: Users },
    { label: 'Discussions', value: '120k+', icon: MessageSquare },
    { label: 'Countries', value: '85+', icon: Globe },
    { label: 'Success Stories', value: '10k+', icon: Award },
  ];

  const discussions = [
    {
      title: 'How to optimize resume for AI-driven ATS?',
      author: 'John Doe',
      replies: 45,
      likes: 128,
      tags: ['Resume', 'AI', 'Tips'],
      time: '2h ago'
    },
    {
      title: 'Success Story: Landed a $150k role in 2 weeks!',
      author: 'Sarah Smith',
      replies: 89,
      likes: 450,
      tags: ['Success', 'Motivation'],
      time: '5h ago'
    },
    {
      title: 'Best practices for video interviews in 2024',
      author: 'Mike Ross',
      replies: 23,
      likes: 56,
      tags: ['Interview', 'Video'],
      time: '1d ago'
    }
  ];

  const events = [
    {
      title: 'AI Career Summit 2024',
      date: 'Oct 25, 2024',
      type: 'Virtual Conference',
      image: 'https://picsum.photos/seed/summit/800/400'
    },
    {
      title: 'Networking Mixer: Tech Leaders',
      date: 'Nov 02, 2024',
      type: 'Live Webinar',
      image: 'https://picsum.photos/seed/mixer/800/400'
    }
  ];

  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      {/* Hero Section */}
      <div className="pt-40 pb-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 premium-gradient rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-blue rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tight">
              Join the <span className="text-gradient">Global Community</span>
            </h1>
            <p className="text-xl text-app-muted max-w-2xl mx-auto mb-12 leading-relaxed">
              Connect with thousands of professionals, share insights, and accelerate your career growth together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAButton className="px-10 py-4">Join Community</CTAButton>
              <div className="relative w-full max-w-md sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-app-muted" />
                <input 
                  type="text" 
                  placeholder="Search discussions..." 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl glass border border-app-border focus:border-brand-blue outline-none transition-all font-medium"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <SectionWrapper>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[32px] glass border border-app-border text-center hover:border-brand-blue transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <stat.icon className="w-6 h-6 text-brand-blue" />
              </div>
              <div className="text-3xl font-display font-bold mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-app-muted uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Trending Discussions */}
      <SectionWrapper className="bg-app-surface/30">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-display font-bold mb-4 tracking-tight">Trending Discussions</h2>
            <p className="text-app-muted">The most active conversations in our community right now.</p>
          </div>
          <button className="flex items-center gap-2 text-brand-blue font-bold hover:gap-3 transition-all">
            View All Discussions <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {discussions.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[40px] glass border border-app-border card-shadow flex flex-col hover:bg-app-surface/50 transition-all"
            >
              <div className="flex gap-2 mb-6">
                {post.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-xl font-display font-bold mb-4 flex-1 leading-snug">
                {post.title}
              </h3>
              <div className="flex items-center justify-between pt-6 border-t border-app-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full premium-gradient" />
                  <div>
                    <div className="text-sm font-bold">{post.author}</div>
                    <div className="text-[10px] text-app-muted font-bold">{post.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-app-muted">
                  <div className="flex items-center gap-1 text-xs font-bold">
                    <Heart className="w-4 h-4" /> {post.likes}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold">
                    <MessageSquare className="w-4 h-4" /> {post.replies}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Community CTA */}
      <SectionWrapper containerClassName="text-center">
        <div className="p-16 rounded-[64px] premium-gradient text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <Sparkles className="w-16 h-16 text-white/20 absolute top-10 left-10 animate-pulse" />
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 relative z-10">Ready to contribute?</h2>
          <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed">
            Our community is built by professionals like you. Share your journey and help others succeed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <CTAButton variant="secondary" className="px-12 py-5">Start a Discussion</CTAButton>
            <button className="flex items-center gap-2 font-bold hover:gap-3 transition-all">
              Browse Success Stories <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}
