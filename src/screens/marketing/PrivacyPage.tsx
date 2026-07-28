import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, CheckCircle2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/marketing/common/Navbar';
import Footer from '../../components/marketing/common/Footer';
import SectionWrapper from '../../components/marketing/common/SectionWrapper';

export default function PrivacyPage({ theme, toggleTheme }: { theme?: 'light' | 'dark', toggleTheme?: () => void }) {
  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Hero */}
      <div className="pt-36 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <nav className="flex justify-center items-center gap-2 text-xs font-semibold text-app-muted mb-6 uppercase tracking-wider">
            <Link to="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <span>/</span>
            <span className="text-app-text">Privacy Policy</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-widest mb-6">
              <Shield className="w-4 h-4" />
              <span>Data Protection</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="text-app-muted text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              At ARYX AI, we respect your privacy and are committed to safeguarding your personal information and career data.
            </p>
            <div className="text-xs font-bold text-app-muted uppercase tracking-widest mt-6">
              Last Updated: July 2026
            </div>
          </motion.div>
        </div>
      </div>

      <SectionWrapper>
        <div className="max-w-4xl mx-auto glass border border-app-border rounded-[36px] p-8 md:p-14 card-shadow space-y-12">
          {/* Section 1 */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue text-sm">1</span>
              Information We Collect
            </h2>
            <div className="text-app-muted text-sm leading-relaxed space-y-3 font-medium">
              <p>
                When you use ARYX AI, we collect information required to operate our autonomous career search and talent matching services. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-app-text">Account Information:</strong> Name, email address, password hash, phone number, and preferences.</li>
                <li><strong className="text-app-text">Career Data:</strong> Master resumes, work experience, education history, skills, target job titles, and compensation expectations.</li>
                <li><strong className="text-app-text">Application Telemetry:</strong> Log records of job postings evaluated, tailored resume mutations created, and application submission statuses.</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue text-sm">2</span>
              How We Use Your Data
            </h2>
            <div className="text-app-muted text-sm leading-relaxed space-y-3 font-medium">
              <p>We process your personal information strictly for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To parse and tailor your resume for specific employer job descriptions.</li>
                <li>To autonomously submit applications to job portals and vendor databases on your behalf.</li>
                <li>To provide recruiters and BDMs with AI-powered candidate fit scoring and pipeline analytics.</li>
                <li>To notify you in real-time regarding employer responses, interview invites, and agent status.</li>
              </ul>
              <p className="pt-2 font-bold text-app-text">We NEVER sell, rent, or monetize your candidate profile or personal contact data to third-party data brokers.</p>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue text-sm">3</span>
              AI Processing & Neural Models
            </h2>
            <div className="text-app-muted text-sm leading-relaxed space-y-3 font-medium">
              <p>
                ARYX AI utilizes specialized neural language models to analyze job postings and format resumes. All AI processing is conducted in isolated server-side containers. Your personal data is not used to train public foundational models.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue text-sm">4</span>
              Data Protection & Encryption
            </h2>
            <div className="text-app-muted text-sm leading-relaxed space-y-3 font-medium">
              <p>
                All data stored within the ARYX platform is encrypted using industry-standard AES-256 protocols at rest and transmitted using secure TLS 1.3 encryption. We conduct regular security audits and maintain strict access control barriers.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue text-sm">5</span>
              Your Rights (GDPR & CCPA)
            </h2>
            <div className="text-app-muted text-sm leading-relaxed space-y-3 font-medium">
              <p>Under global data protection regulations, you retain full ownership of your data, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-app-text">Right of Access:</strong> Request a complete JSON export of all personal profile and application records stored in our database.</li>
                <li><strong className="text-app-text">Right to Erasure:</strong> Permanently delete your account and all associated application logs at any time.</li>
                <li><strong className="text-app-text">Right to Rectification:</strong> Edit or update your master resume and preferences whenever required.</li>
              </ul>
            </div>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue text-sm">6</span>
              Contact Data Protection Office
            </h2>
            <div className="text-app-muted text-sm leading-relaxed font-medium">
              <p>If you have questions regarding this Privacy Policy or wish to exercise your data rights, contact our Privacy Officer at:</p>
              <p className="mt-2 text-brand-blue font-bold">privacy@aryxai.com</p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}
