import React from 'react';
import { motion } from 'motion/react';
import { FileCheck, Shield, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/marketing/common/Navbar';
import Footer from '../../components/marketing/common/Footer';
import SectionWrapper from '../../components/marketing/common/SectionWrapper';

export default function TermsPage({ theme, toggleTheme }: { theme?: 'light' | 'dark', toggleTheme?: () => void }) {
  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Hero */}
      <div className="pt-36 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <nav className="flex justify-center items-center gap-2 text-xs font-semibold text-app-muted mb-6 uppercase tracking-wider">
            <Link to="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <span>/</span>
            <span className="text-app-text">Terms & Conditions</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-widest mb-6">
              <FileCheck className="w-4 h-4" />
              <span>Legal Agreement</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
              Terms & <span className="text-gradient">Conditions</span>
            </h1>
            <p className="text-app-muted text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Please read these Terms & Conditions carefully before using the ARYX AI platform and autonomous career automation services.
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
              Acceptance of Terms
            </h2>
            <div className="text-app-muted text-sm leading-relaxed space-y-3 font-medium">
              <p>
                By creating an account, accessing, or using ARYX AI, you agree to be legally bound by these Terms & Conditions and our Privacy Policy. If you do not agree to these terms, you may not access or use our services.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue text-sm">2</span>
              Agent Authorization & Account Responsibility
            </h2>
            <div className="text-app-muted text-sm leading-relaxed space-y-3 font-medium">
              <p>
                When enabling ARYX AI Autopilot Mode, you explicitly authorize our autonomous AI agent to submit job applications, format resume bullet points, and communicate with employers on your behalf based on the master profile and guidelines you provide.
              </p>
              <p>
                You are responsible for ensuring all work history, qualifications, education records, and personal statements in your master profile are accurate and truthful.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue text-sm">3</span>
              Acceptable Use & Anti-Ban Pacing Rules
            </h2>
            <div className="text-app-muted text-sm leading-relaxed space-y-3 font-medium">
              <p>Users agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Bypass rate limits, bot prevention mechanisms, or security safeguards.</li>
                <li>Submit misleading, fraudulent, or harmful information via the platform.</li>
                <li>Attempt to reverse-engineer, decompile, or extract source code from ARYX AI models.</li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue text-sm">4</span>
              Intellectual Property Rights
            </h2>
            <div className="text-app-muted text-sm leading-relaxed space-y-3 font-medium">
              <p>
                The ARYX AI software, user interface, brand logos, proprietary algorithms, and content belong exclusively to ARYX AI, Inc. You retain full copyright and ownership over your personal resume documents and personal career credentials.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue text-sm">5</span>
              Subscription & Billing Terms
            </h2>
            <div className="text-app-muted text-sm leading-relaxed space-y-3 font-medium">
              <p>
                Certain tier upgrades or enterprise recruiter features may require paid subscriptions. Subscription fees are billed on a recurring monthly or annual basis. You may cancel your subscription at any time via account settings.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue text-sm">6</span>
              Limitation of Liability & Disclaimers
            </h2>
            <div className="text-app-muted text-sm leading-relaxed space-y-3 font-medium">
              <p>
                ARYX AI provides autonomous job search tools "as is" without guarantees of specific employment offers, salary levels, or employer interview callbacks. ARYX AI shall not be liable for indirect, incidental, or consequential damages resulting from platform usage.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue text-sm">7</span>
              Questions & Legal Contact
            </h2>
            <div className="text-app-muted text-sm leading-relaxed font-medium">
              <p>For questions concerning these Terms & Conditions, please contact our legal team at:</p>
              <p className="mt-2 text-brand-blue font-bold">legal@aryxai.com</p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}
