import React, { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  ArrowLeft, 
  Rocket, 
  FileText, 
  Eye, 
  CheckCircle2, 
  Bold, 
  Italic, 
  Underline, 
  Link2, 
  List, 
  HelpCircle 
} from 'lucide-react';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';

interface CreateOpportunityTabProps {
  onBack: () => void;
  onSubmit: (newJob: any) => void;
}

export default function CreateOpportunityTab({ onBack, onSubmit }: CreateOpportunityTabProps) {
  const { userProfile } = useAuth();
  const organizationId = userProfile?.organizationId || 'default_university';

  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Full Time');
  const [packageLpa, setPackageLpa] = useState('');
  const [experience, setExperience] = useState('Freshers');
  const [location, setLocation] = useState('');
  const [eligibility, setEligibility] = useState('B.Tech - 2026 Batch');
  const [gradYear, setGradYear] = useState('2026');
  const [dept, setDept] = useState('CSE');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('My University');

  const checkDuplicate = async (orgId: string, companyName: string, jobTitle: string) => {
    try {
      const colRef = collection(db, 'organizations_universities', orgId, 'opportunities');
      const qSnapshot = await getDocs(colRef);
      let duplicate = false;
      qSnapshot.forEach((doc) => {
        const data = doc.data();
        if (
          data.companyName?.toLowerCase() === companyName.toLowerCase() && 
          data.title?.toLowerCase() === jobTitle.toLowerCase()
        ) {
          duplicate = true;
        }
      });
      return duplicate;
    } catch (e) {
      console.error('Error during duplicate check:', e);
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!company || !title || !packageLpa || !location) {
      alert('Please fill out all mandatory fields marked with an asterisk (*).');
      return;
    }

    try {
      const isDuplicate = await checkDuplicate(organizationId, company, title);
      if (isDuplicate) {
        alert(`An opportunity for "${title}" at "${company}" already exists in the system. Duplicate creation prevented.`);
        return;
      }

      const oppId = 'opp_' + Date.now();
      const newJob = {
        opportunityId: oppId,
        title,
        companyName: company,
        companyId: company.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        description,
        requirements: eligibility,
        skills: [dept, 'Engineering'],
        location,
        employmentType: type,
        salary: packageLpa.includes('LPA') ? packageLpa : `${packageLpa} LPA`,
        openings: 5,
        eligibleDepartments: [dept],
        eligibleBranches: [dept],
        minimumCgpa: 6.0,
        deadline: deadline || '2026-06-15',
        status: 'open',
        createdBy: auth.currentUser?.uid || 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = doc(db, 'organizations_universities', organizationId, 'opportunities', oppId);
      await setDoc(docRef, newJob);

      // Map to original schema to keep outer router content synced as fallback if needed
      const legacyJob = {
        id: oppId,
        company,
        title,
        type,
        package: newJob.salary,
        experience,
        location,
        eligibility,
        gradYear,
        dept,
        deadline: newJob.deadline,
        description,
        applicants: 0,
        visibility,
        status: 'open'
      };

      onSubmit(legacyJob);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `organizations_universities/${organizationId}/opportunities`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header back button */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="p-2 border border-app-border rounded-xl text-app-muted hover:text-app-text hover:bg-app-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-3xl font-display font-bold text-app-text">Create Opportunity</h2>
          <p className="text-app-muted">Home / Opportunities / Create</p>
        </div>
      </div>

      {/* Main Grid: Form Left - Visibility Options Right */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Form Body - Left Span-3 */}
        <div className="lg:col-span-3 p-6 sm:p-8 rounded-[32px] glass border-app-border card-shadow space-y-6">
          <h3 className="font-display font-black text-lg text-app-text border-b border-app-border/40 pb-3 mb-4">Opportunity Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold">
            {/* Company Name */}
            <div className="space-y-1.5">
              <label className="text-app-text font-bold block">Company Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="Enter company name (e.g. TCS, Wipro)" 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
                required
              />
            </div>

            {/* Job Title */}
            <div className="space-y-1.5">
              <label className="text-app-text font-bold block">Job Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="Enter job title (e.g. Software Engineer)" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
                required
              />
            </div>

            {/* Job Type */}
            <div className="space-y-1.5">
              <label className="text-app-text font-bold block">Job Type <span className="text-red-500">*</span></label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
              >
                <option value="Full Time">Full Time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Package LPA */}
            <div className="space-y-1.5">
              <label className="text-app-text font-bold block">Package (in LPA) <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="Enter package (e.g. 4.5)" 
                value={packageLpa}
                onChange={(e) => setPackageLpa(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
                required
              />
            </div>

            {/* Experience */}
            <div className="space-y-1.5">
              <label className="text-app-text font-bold block">Experience <span className="text-red-500">*</span></label>
              <select 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
              >
                <option value="Freshers">Freshers Only</option>
                <option value="1-2 Years">1 - 2 Years</option>
                <option value="3+ Years">3+ Years</option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-app-text font-bold block">Location <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="Enter location (e.g. Bangalore, Hyderabad)" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
                required
              />
            </div>

            {/* Eligibility Criteria */}
            <div className="space-y-1.5">
              <label className="text-app-text font-bold block">Eligibility Criteria <span className="text-red-500">*</span></label>
              <select 
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
              >
                <option value="B.Tech - 2026 Batch">B.Tech - 2026 Batch</option>
                <option value="B.Tech / MCA - 2026 Batch">B.Tech / MCA - 2026 Batch</option>
                <option value="Any Graduate - 2026">Any Graduate - 2026</option>
                <option value="B.E / B.Tech - 2026">B.E / B.Tech - 2026</option>
              </select>
            </div>

            {/* Graduation Year */}
            <div className="space-y-1.5">
              <label className="text-app-text font-bold block">Graduation Year <span className="text-red-500">*</span></label>
              <select 
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
              >
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>

            {/* Departments Allowed */}
            <div className="space-y-1.5">
              <label className="text-app-text font-bold block">Departments Allowed <span className="text-red-500">*</span></label>
              <select 
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
              >
                <option value="CSE">CSE (Computer Science)</option>
                <option value="ECE">ECE (Electronics)</option>
                <option value="IT">IT (Information Technology)</option>
                <option value="MBA">MBA (Business Administration)</option>
                <option value="All Departments">All Departments</option>
              </select>
            </div>

            {/* Application Deadline */}
            <div className="space-y-1.5">
              <label className="text-app-text font-bold block">Application Deadline <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors"
                required
              />
            </div>
          </div>

          {/* Job Description Textarea */}
          <div className="space-y-1.5 pt-2 text-xs font-semibold">
            <label className="text-app-text font-bold block">Job Description <span className="text-red-500">*</span></label>
            
            {/* Visual formatting toolbar matching mockup style */}
            <div className="flex gap-2 p-2 bg-app-surface border border-app-border/40 rounded-t-xl border-b-0">
              <button type="button" className="p-1 text-app-muted hover:text-app-text hover:bg-app-bg rounded" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
              <button type="button" className="p-1 text-app-muted hover:text-app-text hover:bg-app-bg rounded" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
              <button type="button" className="p-1 text-app-muted hover:text-app-text hover:bg-app-bg rounded" title="Underline"><Underline className="w-3.5 h-3.5" /></button>
              <span className="w-px bg-app-border/40 my-1 mx-1 animate-pulse" />
              <button type="button" className="p-1 text-app-muted hover:text-app-text hover:bg-app-bg rounded" title="Link"><Link2 className="w-3.5 h-3.5" /></button>
              <button type="button" className="p-1 text-app-muted hover:text-app-text hover:bg-app-bg rounded" title="List"><List className="w-3.5 h-3.5" /></button>
            </div>

            <textarea 
              rows={5} 
              placeholder="Enter job description and responsibilities..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-app-surface border border-app-border rounded-b-xl p-3 text-app-text font-medium focus:outline-none focus:border-brand-blue transition-colors resize-none"
              required
            />
          </div>
        </div>

        {/* Right Info pane: Visibility selector matching Screen 3 exactly */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-[28px] glass border-app-border card-shadow space-y-5">
            <h4 className="font-display font-black text-sm text-app-muted uppercase tracking-wider">Visibility <span className="text-red-500">*</span></h4>
            
            {/* Custom Radios block list */}
            <div className="space-y-4">
              {[
                { id: 'Private', label: 'Private', desc: 'Viable to specific students only' },
                { id: 'My University', label: 'My University', desc: 'Viable to students of my university' },
                { id: 'Selected Universities', label: 'Selected Universities', desc: 'Viable to selected universities' },
                { id: 'All Universities', label: 'All Universities', desc: 'Viables to all universities' },
              ].map((vis) => (
                <label 
                  key={vis.id} 
                  onClick={() => setVisibility(vis.id)}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <input 
                    type="radio" 
                    name="visibility" 
                    checked={visibility === vis.id}
                    onChange={() => {}}
                    className="mt-1 accent-brand-blue cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-black text-app-text leading-none group-hover:text-brand-blue transition-colors">{vis.label}</div>
                    <p className="text-[10px] text-app-muted font-semibold mt-1 leading-normal">{vis.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Bottom helpful notice box */}
            <div className="p-4 rounded-xl bg-app-surface border border-app-border/40 text-[11px] leading-relaxed font-semibold text-app-muted text-center pt-5">
              {visibility === 'My University' && "This opportunity will be visible to all students of your university."}
              {visibility === 'Private' && "This opportunity will remain hidden from generic index sheets."}
              {visibility === 'All Universities' && "This opportunity will be published across national databases."}
              {visibility === 'Selected Universities' && "This opportunity will be published to your endorsed sister colleges."}
            </div>
          </div>

          {/* Action form buttons */}
          <div className="space-y-2.5">
            <button 
              type="button"
              onClick={() => {
                alert('Draft saved safely in your campus dashboard repository.');
                onBack();
              }}
              className="w-full py-3 bg-app-surface hover:bg-app-surface/90 text-app-text-active border border-app-border rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Save Draft
            </button>
            <button 
              type="submit"
              className="w-full py-3 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md shadow-brand-blue/20"
            >
              <Rocket className="w-3.5 h-3.5" /> Publish Opportunity
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
