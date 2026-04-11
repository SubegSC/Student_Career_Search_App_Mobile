import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  ArrowLeft, User, Mail, Phone, MapPin, Briefcase,
  Github, Linkedin, Globe, Edit2, Plus, Trash2,
  GraduationCap, Award, Code, FileText, Moon, Sun, ExternalLink
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

export function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useProfile();
  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'portfolio' | 'documents'>(
    (location.state?.tab as 'overview' | 'resume' | 'portfolio' | 'documents') || 'overview'
  );

  const tabs = [
    { id: 'overview',   label: 'Overview',   icon: User     },
    { id: 'resume',     label: 'Resume',      icon: FileText },
    { id: 'portfolio',  label: 'Portfolio',   icon: Code     },
    { id: 'documents',  label: 'Documents',   icon: FileText },
  ];

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5 dark:text-white" />
          </button>
          <h1 className="text-lg font-semibold dark:text-white">Profile</h1>
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode
              ? <Sun  className="w-5 h-5 text-yellow-400" />
              : <Moon className="w-5 h-5 text-gray-600"   />}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 py-6">
        {activeTab === 'overview'  && <OverviewTab  />}
        {activeTab === 'resume'    && <ResumeTab    />}
        {activeTab === 'portfolio' && <PortfolioTab />}
        {activeTab === 'documents' && <DocumentsTab />}
      </div>
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────

function OverviewTab() {
  const navigate = useNavigate();
  const { profile, getProfileCompletion, updateProfile } = useProfile();

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const completion = getProfileCompletion();

  return (
    <div className="space-y-6 pb-38">

      {/* Profile Header */}
      <div className="text-center">
        <div className="w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl font-bold text-primary">
            {profile.fullName.charAt(0)}
          </span>
        </div>
        <h2 className="text-2xl font-semibold mb-1 dark:text-white">{profile.fullName}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">{profile.title || 'Add your title'}</p>
        <button
          onClick={() => navigate('/profile/edit')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
        >
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      {/* Profile Completion */}
      <div className="bg-gradient-to-r from-primary to-purple-50 dark:from-primary dark:to-purple-900/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-white dark:text-gray-700">Profile Completion</h3>
          <span className="text-2xl font-bold text-primary dark:text-primary">{completion}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
          <div
            className="bg-gradient-to-r bg-primary/10 to-purple-600 h-2 rounded-full transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>
        <p className="text-sm text-white dark:text-gray-700">
          {completion === 100 ? '🎉 Your profile is complete!' : 'Complete your profile to increase visibility'}
        </p>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <h3 className="font-semibold mb-3 dark:text-white">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">{profile.email}</span>
          </div>
          {profile.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{profile.phone}</span>
            </div>
          )}
          {profile.location && (
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{profile.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <h3 className="font-semibold mb-2 dark:text-white">About</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{profile.bio}</p>
        </div>
      )}

      {/* Professional Links */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <h3 className="font-semibold mb-3 dark:text-white">Professional Links</h3>
        <div className="space-y-3">
          {profile.github && (
            <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 text-primary hover:underline">
              <Github className="w-5 h-5" />
              <span>{profile.github}</span>
            </a>
          )}
          {profile.linkedin && (
            <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 text-primary hover:underline">
              <Linkedin className="w-5 h-5" />
              <span>{profile.linkedin}</span>
            </a>
          )}
          {profile.portfolio && (
            <a href={`https://${profile.portfolio}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 text-primary hover:underline">
              <Globe className="w-5 h-5" />
              <span>{profile.portfolio}</span>
            </a>
          )}
        </div>
      </div>

      {/* Education */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold dark:text-white">Education</h3>
          <button onClick={() => navigate('/profile/edit-education')} className="text-primary text-sm font-medium">
            Manage
          </button>
        </div>
        {profile.education.length > 0 ? (
          <div className="space-y-3">
            {profile.education.map(edu => (
              <div key={edu.id} className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <h4 className="font-medium dark:text-white">{edu.degree} in {edu.field}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{edu.school}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{edu.startDate} - {edu.endDate}</p>
                    {edu.gpa && <p className="text-xs text-gray-500 dark:text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/profile/edit-education/${edu.id}`)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => updateProfile({ education: profile.education.filter(e => e.id !== edu.id) })}
                    className="p-2 hover:bg-red-100 rounded-lg">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No education added yet</p>
        )}
      </div>

      {/* Experience */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold dark:text-white">Experience</h3>
          <button onClick={() => navigate('/profile/edit-experience')} className="text-primary text-sm font-medium">
            Manage
          </button>
        </div>
        {(profile.experience?.length ?? 0) > 0 ? (
          <div className="space-y-3">
            {profile.experience.map(exp => (
              <div key={exp.id} className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <h4 className="font-medium dark:text-white">{exp.position}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                    {exp.location    && <p className="text-xs text-gray-500">{exp.location}</p>}
                    {exp.description && <p className="text-xs text-gray-500">{exp.description}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/profile/edit-experience/${exp.id}`)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => updateProfile({ experience: profile.experience.filter(e => e.id !== exp.id) })}
                    className="p-2 hover:bg-red-100 rounded-lg">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No experience added yet</p>
        )}
      </div>

      {/* Skills */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold dark:text-white">Skills</h3>
          <button onClick={() => navigate('/profile/edit-skills')} className="text-primary text-sm font-medium">
            Edit
          </button>
        </div>
        {profile.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map(skill => (
              <span key={skill}
                className="px-3 py-1.5 bg-primary/10 dark:bg-primary/20 text-primary rounded-lg text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No skills added yet</p>
        )}
      </div>
    </div>
  );
}

// ── Resume Tab ────────────────────────────────────────────────────────────────

function ResumeTab() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-38">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold dark:text-white">My Resumes</h2>
        <button
          onClick={() => navigate('/profile/create-resume')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          New Resume
        </button>
      </div>

      {profile.resumes.length > 0 ? (
        <div className="space-y-3">
          {profile.resumes.map(resume => (
            <div key={resume.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-medium dark:text-white">{resume.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Created {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/profile/resume/${resume.id}`)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                >
                  <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => updateProfile({ resumes: profile.resumes.filter(r => r.id !== resume.id) })}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">No resumes yet</p>
          <button
            onClick={() => navigate('/profile/create-resume')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
          >
            Create Your First Resume
          </button>
        </div>
      )}
    </div>
  );
}

// ── Portfolio Tab ─────────────────────────────────────────────────────────────

function PortfolioTab() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-38">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold dark:text-white">Portfolio Projects</h2>
        <button
          onClick={() => navigate('/profile/add-project')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {profile.projects.length > 0 ? (
        <div className="space-y-4">
          {profile.projects.map(project => (
            <div key={project.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold dark:text-white">{project.title}</h3>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/profile/project/${project.id}`)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => updateProfile({ projects: profile.projects.filter(p => p.id !== project.id) })}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              {project.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
              )}

              {project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.technologies.map(tech => (
                    <span key={tech}
                      className="px-2 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                {project.githubUrl && (
                  <a href={`https://${project.githubUrl}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline">
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a href={`https://${project.liveUrl}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline">
                    <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Code className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">No projects yet</p>
          <button
            onClick={() => navigate('/profile/add-project')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
          >
            Add Your First Project
          </button>
        </div>
      )}
    </div>
  );
}

// ── Documents Tab ─────────────────────────────────────────────────────────────

function DocumentsTab() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const [showCertInput, setShowCertInput] = useState(false);
  const [certInput, setCertInput] = useState('');

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const handleAddCert = () => {
    if (!certInput.trim()) return;
    updateProfile({ certifications: [...profile.certifications, certInput.trim()] });
    setCertInput('');
    setShowCertInput(false);
  };

  const handleRemoveCert = (index: number) => {
    updateProfile({ certifications: profile.certifications.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6 pb-38">

      {/* Cover Letters */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-white">Cover Letters</h2>
          <button
            onClick={() => navigate('/profile/create-cover-letter')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>

        {profile.coverLetters.length > 0 ? (
          <div className="space-y-3">
            {profile.coverLetters.map(letter => (
              <div key={letter.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium dark:text-white">{letter.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(letter.createdAt).toLocaleDateString()}
                  </p>
                  {letter.content && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">
                      {letter.content.slice(0, 80)}…
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/profile/cover-letter/${letter.id}`)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => updateProfile({ coverLetters: profile.coverLetters.filter(c => c.id !== letter.id) })}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No cover letters yet</p>
            <button
              onClick={() => navigate('/profile/create-cover-letter')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm"
            >
              Create Your First Cover Letter
            </button>
          </div>
        )}
      </div>

      {/* Certifications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-white">Certifications</h2>
          <button
            onClick={() => setShowCertInput(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {showCertInput && (
          <div className="flex gap-2 mb-4">
            <input
              autoFocus
              type="text"
              value={certInput}
              onChange={e => setCertInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCert()}
              placeholder="e.g. AWS Certified Developer"
              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button onClick={handleAddCert} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Save</button>
            <button onClick={() => { setShowCertInput(false); setCertInput(''); }} className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">Cancel</button>
          </div>
        )}

        {profile.certifications.length > 0 ? (
          <div className="space-y-2">
            {profile.certifications.map((cert, index) => (
              <div key={index}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-sm dark:text-white">{cert}</span>
                </div>
                <button
                  onClick={() => handleRemoveCert(index)}
                  className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No certifications yet</p>
        )}
      </div>
    </div>
  );
}