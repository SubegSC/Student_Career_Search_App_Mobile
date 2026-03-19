import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { ArrowLeft, Save } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

export function EditProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isEducation = location.pathname.includes('edit-education');
  const isExperience = location.pathname.includes('edit-experience');
  const isSkills = location.pathname.includes('edit-skills');
  const isResume = location.pathname.includes('create-resume');
  const isProject = location.pathname.includes('add-project');
  const isCoverLetter = location.pathname.includes('create-cover-letter');

  const isBaseProfile =
    !isEducation &&
    !isExperience &&
    !isSkills &&
    !isResume &&
    !isProject &&
    !isCoverLetter;

  const { profile, updateProfile } = useProfile();

  // ── Skills state (used only on /profile/edit-skills) ──────────────────────
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  // ── Base profile form state ────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    bio: '',
    github: '',
    linkedin: '',
    portfolio: '',
  });

  // ── Education form state ───────────────────────────────────────────────────
  const [education, setEducation] = useState({
    school: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    gpa: '',
  });

  // ── Experience form state ──────────────────────────────────────────────────
  const [experience, setExperience] = useState({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });

  // ── Seed states once profile is loaded ────────────────────────────────────
  useEffect(() => {
    if (!profile) return;

    // Always seed base form data
    setFormData({
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone || '',
      location: profile.location || '',
      title: profile.title || '',
      bio: profile.bio || '',
      github: profile.github || '',
      linkedin: profile.linkedin || '',
      portfolio: profile.portfolio || '',
    });

    // Seed skills when on the skills route
    if (isSkills) {
      setSkills(profile.skills || []);
    }

    // Seed education when editing an existing entry
    if (isEducation && id) {
      const existing = profile.education.find((e) => e.id === id);
      if (existing) {
        setEducation({
          school: existing.school || '',
          degree: existing.degree || '',
          field: existing.field || '',
          startDate: existing.startDate || '',
          endDate: existing.endDate || '',
          gpa: existing.gpa || '',
        });
      }
    }

    // Seed experience when editing an existing entry
    if (isExperience && id) {
      const existing = profile.experience.find((e) => e.id === id);
      if (existing) {
        setExperience({
          company: existing.company || '',
          position: existing.position || '',
          location: existing.location || '',
          startDate: existing.startDate || '',
          endDate: existing.endDate || '',
          current: existing.current || false,
          description: existing.description || '',
        });
      }
    }
  }, [profile, isSkills, isEducation, isExperience, id]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Save base profile fields only (no skills)
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ ...formData });
    navigate('/profile');
  };

  // Save education entry
  const handleSaveEducation = () => {
    let updatedEducation;
    if (id) {
      // Editing existing entry
      updatedEducation = profile.education.map((e) =>
        e.id === id ? { ...education, id } : e
      );
    } else {
      // Adding new entry
      updatedEducation = [
        ...profile.education,
        { ...education, id: Date.now().toString() },
      ];
    }
    updateProfile({ education: updatedEducation });
    navigate('/profile');
  };

  // Save experience entry
  const handleSaveExperience = () => {
    let updatedExperience;
    if (id) {
      // Editing existing entry
      updatedExperience = profile.experience.map((e) =>
        e.id === id ? { ...experience, id } : e
      );
    } else {
      // Adding new entry
      updatedExperience = [
        ...(profile.experience || []),
        { ...experience, id: Date.now().toString() },
      ];
    }
    updateProfile({ experience: updatedExperience });
    navigate('/profile');
  };

  // Save skills
  const handleSaveSkills = () => {
    updateProfile({ skills });
    navigate('/profile');
  };

  // Skills helpers
  const addSkill = () => {
    if (!skillInput.trim()) return;
    setSkills((prev) => [...prev, skillInput.trim()]);
    setSkillInput('');
  };

  const removeSkill = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  // Header title
  const pageTitle = isEducation
    ? id
      ? 'Edit Education'
      : 'Add Education'
    : isExperience
    ? id
      ? 'Edit Experience'
      : 'Add Experience'
    : isSkills
    ? 'Edit Skills'
    : isResume
    ? 'Create Resume'
    : isProject
    ? 'Add Project'
    : isCoverLetter
    ? 'Create Cover Letter'
    : 'Edit Profile';

  // Header Save button action — only relevant for base profile and skills
  const handleHeaderSave = (e: React.MouseEvent) => {
    if (isBaseProfile) {
      handleProfileSubmit(e as unknown as React.FormEvent);
    } else if (isSkills) {
      handleSaveSkills();
    }
  };

  const showHeaderSave = isBaseProfile || isSkills;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <ArrowLeft className="w-5 h-5 dark:text-white" />
          </button>

          <h1 className="text-lg font-semibold dark:text-white">{pageTitle}</h1>

          {showHeaderSave ? (
            <button
              onClick={handleHeaderSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          ) : (
            // Placeholder to keep title centered
            <div className="w-10 h-10" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-6">

        {/* ── Base Profile ─────────────────────────────────────────────────── */}
        {isBaseProfile && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Toronto, ON"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">Professional Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science Student"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">Bio / Summary</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Professional Links */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">Professional Links</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">GitHub</label>
                  <input
                    type="text"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="github.com/username"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">LinkedIn</label>
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="linkedin.com/in/username"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">Portfolio Website</label>
                  <input
                    type="text"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="yourportfolio.com"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90"
            >
              Save Changes
            </button>
          </form>
        )}

        {/* ── Education ────────────────────────────────────────────────────── */}
        {isEducation && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold dark:text-white">
                {id ? 'Edit Education' : 'Add Education'}
              </h2>

              <input
                type="text"
                placeholder="School"
                value={education.school}
                onChange={(e) => setEducation({ ...education, school: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <input
                type="text"
                placeholder="Degree (e.g., BSc)"
                value={education.degree}
                onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <input
                type="text"
                placeholder="Field (e.g., Computer Science)"
                value={education.field}
                onChange={(e) => setEducation({ ...education, field: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Start Date"
                  value={education.startDate}
                  onChange={(e) => setEducation({ ...education, startDate: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="End Date"
                  value={education.endDate}
                  onChange={(e) => setEducation({ ...education, endDate: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <input
                type="text"
                placeholder="GPA (optional)"
                value={education.gpa}
                onChange={(e) => setEducation({ ...education, gpa: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                type="button"
                onClick={handleSaveEducation}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90"
              >
                Save Education
              </button>
            </div>
          </div>
        )}

        {/* ── Experience ───────────────────────────────────────────────────── */}
        {isExperience && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold dark:text-white">
                {id ? 'Edit Experience' : 'Add Experience'}
              </h2>

              <input
                type="text"
                placeholder="Job Title"
                value={experience.position}
                onChange={(e) => setExperience({ ...experience, position: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <input
                type="text"
                placeholder="Company"
                value={experience.company}
                onChange={(e) => setExperience({ ...experience, company: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Start Date"
                  value={experience.startDate}
                  onChange={(e) => setExperience({ ...experience, startDate: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="End Date"
                  value={experience.endDate}
                  onChange={(e) => setExperience({ ...experience, endDate: e.target.value })}
                  disabled={experience.current}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>

              <label className="flex items-center gap-2 text-sm dark:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={experience.current}
                  onChange={(e) => setExperience({ ...experience, current: e.target.checked })}
                />
                I currently work here
              </label>

              <input
                type="text"
                placeholder="Location"
                value={experience.location}
                onChange={(e) => setExperience({ ...experience, location: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <textarea
                placeholder="Description"
                value={experience.description}
                onChange={(e) => setExperience({ ...experience, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                type="button"
                onClick={handleSaveExperience}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90"
              >
                Save Experience
              </button>
            </div>
          </div>
        )}

        {/* ── Skills ───────────────────────────────────────────────────────── */}
        {isSkills && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold dark:text-white">Skills</h2>

              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill"
                  className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-3 bg-primary text-white rounded-lg hover:opacity-90"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center gap-2"
                  >
                    <span className="dark:text-white text-sm">{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-red-500 hover:text-red-700 leading-none"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSaveSkills}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90"
              >
                Save Skills
              </button>
            </div>
          </div>
        )}

        {/* ── Resume ───────────────────────────────────────────────────────── */}
        {isResume && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <p className="text-gray-500 dark:text-gray-400">Resume builder coming soon...</p>
          </div>
        )}

        {/* ── Project ──────────────────────────────────────────────────────── */}
        {isProject && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <p className="text-gray-500 dark:text-gray-400">Project form coming soon...</p>
          </div>
        )}

        {/* ── Cover Letter ─────────────────────────────────────────────────── */}
        {isCoverLetter && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <p className="text-gray-500 dark:text-gray-400">Cover letter builder coming soon...</p>
          </div>
        )}

      </div>
    </div>
  );
}