import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign, Bookmark, CheckCircle, Building2, Globe, Users, TrendingUp } from 'lucide-react';
import { allJobs, featuredJobs } from '../data/jobsDatabase';
import { useApp } from '../context/AppContext';
import { useProfile } from '../context/ProfileContext';
import { useState } from 'react';

// Company info map for featured companies
const companyInfo: Record<string, { industry: string; size: string; founded: string; website: string; about: string }> = {
  'Shopify': {
    industry: 'E-commerce / Technology',
    size: '10,000+ employees',
    founded: '2006',
    website: 'shopify.com',
    about: 'Shopify is a leading global commerce company, providing trusted tools to start, grow, market, and manage a retail business of any size. Shopify powers millions of businesses across 175+ countries.'
  },
  'Google': {
    industry: 'Technology / Internet',
    size: '100,000+ employees',
    founded: '1998',
    website: 'google.com',
    about: "Google is a global technology leader focused on improving the ways people connect with information. Products include Search, Gmail, YouTube, Maps, Android, Chrome, and Google Cloud."
  },
  'RBC': {
    industry: 'Financial Services / Banking',
    size: '80,000+ employees',
    founded: '1864',
    website: 'rbc.com',
    about: "Royal Bank of Canada is Canada's largest bank by market capitalization. RBC serves 17+ million clients across personal, commercial, and corporate banking with operations in 36 countries."
  },
  'Amazon': {
    industry: 'E-commerce / Cloud Computing',
    size: '1,500,000+ employees',
    founded: '1994',
    website: 'amazon.com',
    about: "Amazon is guided by four principles: customer obsession, passion for invention, commitment to operational excellence, and long-term thinking. Amazon operates the world's largest cloud platform (AWS) and a leading marketplace."
  },
  'Microsoft': {
    industry: 'Technology / Software',
    size: '200,000+ employees',
    founded: '1975',
    website: 'microsoft.com',
    about: "Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge. Its mission is to empower every person and organization to achieve more."
  },
  'Meta': {
    industry: 'Social Media / Technology',
    size: '60,000+ employees',
    founded: '2004',
    website: 'meta.com',
    about: "Meta builds technologies that help people connect, find communities, and grow businesses. Products include Facebook, Instagram, WhatsApp, and the metaverse platform Horizon Worlds."
  },
  'Apple': {
    industry: 'Consumer Electronics / Software',
    size: '150,000+ employees',
    founded: '1976',
    website: 'apple.com',
    about: "Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. Known for design excellence and a tightly integrated hardware-software ecosystem."
  },
  'Deloitte': {
    industry: 'Professional Services / Consulting',
    size: '400,000+ employees',
    founded: '1845',
    website: 'deloitte.com',
    about: "Deloitte is one of the Big Four accounting and professional services firms, providing audit, consulting, financial advisory, risk advisory, tax, and legal services globally."
  },
  'TD Bank': {
    industry: 'Financial Services / Banking',
    size: '85,000+ employees',
    founded: '1855',
    website: 'td.com',
    about: "TD Bank Group is one of Canada's largest banks and a top-10 bank in North America, serving over 27 million customers across Canada, the United States, and globally."
  },
  'Scotiabank': {
    industry: 'Financial Services / Banking',
    size: '90,000+ employees',
    founded: '1832',
    website: 'scotiabank.com',
    about: "Scotiabank is one of Canada's Big Five banks and a leading bank in the Americas, with a strong presence in Canada, the United States, and Latin America."
  },
};

function getCompanyInfo(company: string) {
  return companyInfo[company] || {
    industry: 'Technology / Services',
    size: 'Mid-size company',
    founded: 'N/A',
    website: `${company.toLowerCase().replace(/\s+/g, '')}.com`,
    about: `${company} is a leading organization committed to innovation and excellence. They offer a dynamic work environment with opportunities for professional growth and development.`
  };
}

export function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { isJobSaved, toggleSaveJob, isJobApplied, applyToJob } = useApp();
  const { profile } = useProfile();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [selectedCoverLetterId, setSelectedCoverLetterId] = useState('');
  const [coverLetterText, setCoverLetterText] = useState('');

  const job = [...allJobs, ...featuredJobs].find(j => j.id === jobId);

  if (!job) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Job not found</h2>
          <button onClick={() => navigate('/browse')} className="text-primary font-medium">
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const saved = isJobSaved(job.id);
  const applied = isJobApplied(job.id);
  const deadline = new Date(job.deadline);
  const today = new Date('2026-03-06');
  const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const company = getCompanyInfo(job.company);

  const handleQuickApply = () => {
    if (profile?.resumes?.length) {
      setSelectedResumeId(profile.resumes[0].id);
    }
    if (profile?.coverLetters?.length) {
      setSelectedCoverLetterId(profile.coverLetters[0].id);
      setCoverLetterText(profile.coverLetters[0].content);
    } else {
      setCoverLetterText(`Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company}. As a dedicated student with a passion for technology and innovation, I am excited about the opportunity to contribute to your team.

Through my academic coursework and previous experiences, I have developed strong skills in ${job.skills.slice(0, 3).join(', ')}, which align perfectly with the requirements for this role. I am particularly drawn to ${job.company}'s commitment to excellence and innovation.

I am confident that my technical skills, combined with my enthusiasm and willingness to learn, make me a strong candidate for this position. I look forward to the opportunity to contribute to ${job.company}'s continued success.

Thank you for considering my application.

Best regards,
${profile?.fullName || '[Your Name]'}`);
    }
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = () => {
    const resumeName = profile?.resumes?.find(r => r.id === selectedResumeId)?.name || selectedResumeId || 'Resume';
    applyToJob(job.id, resumeName, coverLetterText);
    setShowApplicationModal(false);
    alert(`Application successfully submitted to ${job.company}!\n\n✓ Added to Applications → Pending\n✓ Deadline reminder set\n✓ Follow-up reminder set for ${new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
    navigate('/applications');
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold flex-1 text-gray-900 dark:text-white">Job Details</h1>
            <button
              onClick={() => toggleSaveJob(job.id)}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center"
            >
              <Bookmark className={`w-5 h-5 ${saved ? 'fill-primary text-primary' : 'text-gray-600 dark:text-gray-300'}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Company and Title */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">
                {job.company.charAt(0)}
              </span>
            </div>
            <h2 className="text-2xl font-semibold mb-2">{job.title}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{job.company}</p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>{job.location} • {job.locationType}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-5 h-5" />
                <span>{job.term}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className={daysUntilDeadline <= 7 ? 'text-red-600 font-medium' : 'text-gray-600 dark:text-gray-300'}>
                  Deadline: {deadline.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  {daysUntilDeadline <= 7 && ` (${daysUntilDeadline} days left!)`}
                </span>
              </div>
              {job.salary && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <DollarSign className="w-5 h-5" />
                  <span>{job.salary}</span>
                </div>
              )}
            </div>
          </div>

          {/* About Company */}
          <div className="mb-6 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              About {job.company}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-sm">{company.about}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Industry</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{company.industry}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Company Size</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{company.size}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Founded</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{company.founded}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Website</p>
                  <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={e => e.stopPropagation()}>
                    {company.website}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About this role</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{job.description}</p>
          </div>

          {/* Responsibilities */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Responsibilities</h3>
            <ul className="space-y-2">
              {job.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Skills */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map(skill => (
                <span key={skill} className="px-3 py-1.5 bg-primary/10 text-primary dark:bg-primary/20 rounded-lg text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Requirements</h3>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">{req}</span>
                </li>
              ))}
              {job.gpaRequirement && (
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Minimum GPA: {job.gpaRequirement}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Application Materials */}
          <div className="mb-20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Application Materials</h3>
            <div className="flex flex-wrap gap-2">
              {job.materials.map(material => (
                <span key={material} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                  {material}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-16 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
        {applied ? (
          <div className="flex items-center justify-center gap-2 py-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 fill-green-600" />
            <span className="font-semibold text-green-800">Application Submitted</span>
          </div>
        ) : (
          <button
            onClick={handleQuickApply}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-colors"
          >
            Quick Apply
          </button>
        )}
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Apply to {job.company}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{job.title}</p>

              {/* Resume */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Resume</label>
                {profile?.resumes?.length ? (
                  <>
                    <select
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {profile.resumes.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">✓ From your profile resumes</p>
                  </>
                ) : (
                  <div className="px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg text-sm text-yellow-800 dark:text-yellow-300">
                    No resumes saved. <button onClick={() => { setShowApplicationModal(false); navigate('/profile'); }} className="underline font-medium">Add one in your profile →</button>
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Cover Letter</label>
                {profile?.coverLetters?.length ? (
                  <div className="mb-3">
                    <select
                      value={selectedCoverLetterId}
                      onChange={(e) => {
                        const cl = profile.coverLetters.find(c => c.id === e.target.value);
                        setSelectedCoverLetterId(e.target.value);
                        if (cl) setCoverLetterText(cl.content);
                      }}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                    >
                      <option value="">— Write custom —</option>
                      {profile.coverLetters.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                ) : null}
                <textarea
                  value={coverLetterText}
                  onChange={(e) => { setSelectedCoverLetterId(''); setCoverLetterText(e.target.value); }}
                  rows={8}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="Write your cover letter..."
                />
                {!profile?.coverLetters?.length && (
                  <p className="text-xs text-gray-500 mt-1">✓ Template pre-filled for {job.company}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitApplication}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}