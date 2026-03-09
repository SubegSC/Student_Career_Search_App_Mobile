import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, User, Mail, Phone, MapPin, Briefcase, 
  Github, Linkedin, Globe, Edit2, Plus, Trash2,
  GraduationCap, Award, Code, FileText, Moon, Sun
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

export function Profile() {
  const navigate = useNavigate();
  const { profile, getProfileCompletion, darkMode, toggleDarkMode } = useProfile();
  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'portfolio' | 'documents'>('overview');
  
  const completion = getProfileCompletion();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'portfolio', label: 'Portfolio', icon: Code },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
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
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
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
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'resume' && <ResumeTab />}
        {activeTab === 'portfolio' && <PortfolioTab />}
        {activeTab === 'documents' && <DocumentsTab />}
      </div>
    </div>
  );
}

function OverviewTab() {
  const navigate = useNavigate();
  const { profile, getProfileCompletion } = useProfile();
  const completion = getProfileCompletion();

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Header */}
      <div className="text-center">
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {profile.fullName.charAt(0)}
          </span>
        </div>
        <h2 className="text-2xl font-semibold mb-1 dark:text-white">{profile.fullName}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">{profile.title || 'Add your title'}</p>
        <button
          onClick={() => navigate('/profile/edit')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      {/* Profile Completion */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold dark:text-white">Profile Completion</h3>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completion}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
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
            <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-600 dark:text-blue-400 hover:underline">
              <Github className="w-5 h-5" />
              <span>{profile.github}</span>
            </a>
          )}
          {profile.linkedin && (
            <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-600 dark:text-blue-400 hover:underline">
              <Linkedin className="w-5 h-5" />
              <span>{profile.linkedin}</span>
            </a>
          )}
          {profile.portfolio && (
            <a href={`https://${profile.portfolio}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-600 dark:text-blue-400 hover:underline">
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
          <button
            onClick={() => navigate('/profile/edit-education')}
            className="text-blue-600 dark:text-blue-400 text-sm font-medium"
          >
            Manage
          </button>
        </div>
        {profile.education.length > 0 ? (
          <div className="space-y-3">
            {profile.education.map(edu => (
              <div key={edu.id}>
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <h4 className="font-medium dark:text-white">{edu.degree} in {edu.field}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{edu.school}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{edu.startDate} - {edu.endDate}</p>
                    {edu.gpa && <p className="text-xs text-gray-500 dark:text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
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
          <button
            onClick={() => navigate('/profile/edit-experience')}
            className="text-blue-600 dark:text-blue-400 text-sm font-medium"
          >
            Manage
          </button>
        </div>
        {profile.experience.length > 0 ? (
          <div className="space-y-3">
            {profile.experience.map(exp => (
              <div key={exp.id}>
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <h4 className="font-medium dark:text-white">{exp.position}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
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
          <button
            onClick={() => navigate('/profile/edit-skills')}
            className="text-blue-600 dark:text-blue-400 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        {profile.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map(skill => (
              <span key={skill} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium">
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

function ResumeTab() {
  const navigate = useNavigate();
  const { profile } = useProfile();

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold dark:text-white">My Resumes</h2>
        <button
          onClick={() => navigate('/profile/create-resume')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          New Resume
        </button>
      </div>

      {profile.resumes.length > 0 ? (
        <div className="space-y-3">
          {profile.resumes.map(resume => (
            <div
              key={resume.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
          >
            Create Your First Resume
          </button>
        </div>
      )}
    </div>
  );
}

function PortfolioTab() {
  const navigate = useNavigate();
  const { profile } = useProfile();

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold dark:text-white">Portfolio Projects</h2>
        <button
          onClick={() => navigate('/profile/add-project')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {profile.projects.length > 0 ? (
        <div className="space-y-4">
          {profile.projects.map(project => (
            <div key={project.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <h3 className="font-semibold mb-2 dark:text-white">{project.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.technologies.map(tech => (
                  <span key={tech} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                {project.githubUrl && (
                  <a href={`https://${project.githubUrl}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a href={`https://${project.liveUrl}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    Live Demo
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
          >
            Add Your First Project
          </button>
        </div>
      )}
    </div>
  );
}

function DocumentsTab() {
  const navigate = useNavigate();
  const { profile } = useProfile();

  return (
    <div className="space-y-6 pb-20">
      {/* Cover Letters */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-white">Cover Letters</h2>
          <button
            onClick={() => navigate('/profile/create-cover-letter')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>
        {profile.coverLetters.length > 0 ? (
          <div className="space-y-3">
            {profile.coverLetters.map(letter => (
              <div
                key={letter.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium dark:text-white">{letter.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(letter.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/profile/cover-letter/${letter.id}`)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                >
                  <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No cover letters yet</p>
        )}
      </div>

      {/* Certifications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-white">Certifications</h2>
          <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">
            Add
          </button>
        </div>
        {profile.certifications.length > 0 ? (
          <div className="space-y-2">
            {profile.certifications.map((cert, index) => (
              <div key={index} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm dark:text-white">{cert}</span>
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
