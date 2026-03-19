import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { ArrowLeft, Save } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

export function EditProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEducation = location.pathname.includes('edit-education');
  const isExperience = location.pathname.includes('edit-experience');
  const isSkills = location.pathname.includes('edit-skills');
  const isResume = location.pathname.includes('create-resume');
  const isProject = location.pathname.includes('add-project');
  const isCoverLetter = location.pathname.includes('create-cover-letter');
  const { id } = useParams();
  const isEditEducation = location.pathname.includes("edit-education");
  const isEditExperience = location.pathname.includes("edit-experience");
  const { profile, updateProfile } = useProfile();
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const [formData, setFormData] = useState({
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

  const [education, setEducation] = useState({
    school: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    gpa: '',
  });

  const [experience, setExperience] = useState({
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    current: false,
    location: '',
    description: '',
  });

  useEffect(() => {
    if (isEditEducation && id && profile) {
      const existing = profile.education.find(e => e.id === id);

      if (existing) {
        setEducation({
          school: existing.school || "",
          degree: existing.degree || "",
          field: existing.field || "",
          startDate: existing.startDate || "",
          endDate: existing.endDate || "",
          gpa: existing.gpa || ""
        });
      }
    }
  }, [id, isEditEducation, profile]);

  useEffect(() => {
    if (isEditExperience && id && profile) {
      const existing = profile.experience.find(e => e.id === id);

      if (existing) {
        setExperience({
          position: existing.position || "",
          company: existing.company || "",
          startDate: existing.startDate || "",
          endDate: existing.endDate || "",
          current: existing.current || false,
          location: existing.location || "",
          description: existing.description || "",
        });
      }
    }
  }, [id, isEditExperience, profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    navigate('/profile');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
          <h1 className="text-lg font-semibold dark:text-white">
            {isEducation && 'Edit Education'}
            {isExperience && 'Edit Experience'}
            {isSkills && 'Edit Skills'}
            {isResume && 'Create Resume'}
            {isProject && 'Add Project'}
            {isCoverLetter && 'Create Cover Letter'}
            {!isEducation && !isExperience && !isSkills && !isResume && !isProject && !isCoverLetter && 'Edit Profile'}
          </h1>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {isEducation && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold dark:text-white">Add Education</h2>

              <input
                type="text"
                placeholder="School"
                value={education.school}
                onChange={(e) => setEducation({ ...education, school: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              />

              <input
                type="text"
                placeholder="Degree (e.g., BSc)"
                value={education.degree}
                onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              />

              <input
                type="text"
                placeholder="Field (e.g., Computer Science)"
                value={education.field}
                onChange={(e) => setEducation({ ...education, field: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              />

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Start Date"
                  value={education.startDate}
                  onChange={(e) => setEducation({ ...education, startDate: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="End Date"
                  value={education.endDate}
                  onChange={(e) => setEducation({ ...education, endDate: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                />
              </div>

              <input
                type="text"
                placeholder="GPA (optional)"
                value={education.gpa}
                onChange={(e) => setEducation({ ...education, gpa: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              />

              <button
                onClick={() => {
                  if (isEditEducation) {
                    const updated = profile.education.map(e =>
                      e.id === id ? { ...education, id } : e
                    );

                    updateProfile({ education: updated });
                  } else {
                    const newEdu = {
                      ...education,
                      id: Date.now().toString(),
                    };

                    updateProfile({
                      education: [...profile.education, newEdu],
                    });
                  }

                  navigate('/profile');
                }}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold"
              >
                Save Education
              </button>
            </div>
          )}

          {isExperience && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold dark:text-white">
                {isEditExperience ? "Edit Experience" : "Add Experience"}
              </h2>

              <input
                type="text"
                placeholder="Job Title"
                value={experience.position}
                onChange={(e) =>
                  setExperience({ ...experience, position: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              />

              <input
                type="text"
                placeholder="Company"
                value={experience.company}
                onChange={(e) =>
                  setExperience({ ...experience, company: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              />

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Start Date"
                  value={experience.startDate}
                  onChange={(e) =>
                    setExperience({ ...experience, startDate: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="End Date"
                  value={experience.endDate}
                  onChange={(e) =>
                    setExperience({ ...experience, endDate: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                />
              </div>

              <label className="flex items-center gap-2 text-sm dark:text-white">
                <input
                  type="checkbox"
                  checked={experience.current}
                  onChange={(e) =>
                    setExperience({ ...experience, current: e.target.checked })
                  }
                />
                I currently work here
              </label>

              <input
                type="text"
                placeholder="Location"
                value={experience.location}
                onChange={(e) =>
                  setExperience({ ...experience, location: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              />

              <textarea
                placeholder="Description"
                value={experience.description}
                onChange={(e) =>
                  setExperience({ ...experience, description: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              />

              <button
                onClick={() => {
                  if (isEditExperience) {
                    const updated = profile.experience.map((e) =>
                      e.id === id ? { ...experience, id } : e
                    );

                    updateProfile({ experience: updated });
                  } else {
                    const newExp = {
                      ...experience,
                      id: Date.now().toString(),
                    };

                    updateProfile({
                      experience: [...profile.experience, newExp],
                    });
                  }

                  navigate("/profile");
                }}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold"
              >
                Save Experience
              </button>
            </div>
          )}

          {isSkills && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <p className="text-gray-500">Skills editor coming soon...</p>
            </div>
          )}

          {isResume && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <p className="text-gray-500">Resume builder coming soon...</p>
            </div>
          )}

          {isProject && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <p className="text-gray-500">Project form coming soon...</p>
            </div>
          )}

          {isCoverLetter && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <p className="text-gray-500">Cover letter builder coming soon...</p>
            </div>
          )}


          {!isEducation && !isExperience && !isSkills && !isResume && !isProject && !isCoverLetter && (
            <>
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
            </>)}
        </form>
      </div>
    </div >
  );
}
