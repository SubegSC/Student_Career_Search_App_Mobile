import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { ArrowLeft, Save, Plus, X, Trash2, Download, Sparkles, Loader2 } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import type { Project, Resume, CoverLetter } from '../context/ProfileContext';

export function EditProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [location.pathname]);

  const isEducation   = location.pathname.includes('edit-education');
  const isExperience  = location.pathname.includes('edit-experience');
  const isSkills      = location.pathname.includes('edit-skills');
  const isResume      = location.pathname.includes('create-resume') || location.pathname.includes('resume/');
  const isProject     = location.pathname.includes('add-project')   || location.pathname.includes('project/');
  const isCoverLetter = location.pathname.includes('create-cover-letter') || location.pathname.includes('cover-letter/');

  const isBaseProfile =
    !isEducation && !isExperience && !isSkills &&
    !isResume && !isProject && !isCoverLetter;

  const { profile, updateProfile } = useProfile();

  // ── Skills ────────────────────────────────────────────────────────────────
  const [skills, setSkills]         = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  // ── Base profile ──────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', location: '',
    title: '', bio: '', github: '', linkedin: '', portfolio: '',
  });

  // ── Education ─────────────────────────────────────────────────────────────
  const [education, setEducation] = useState({
    school: '', degree: '', field: '',
    startDate: '', endDate: '', gpa: '',
  });

  // ── Experience ────────────────────────────────────────────────────────────
  const [experience, setExperience] = useState({
    company: '', position: '', location: '',
    startDate: '', endDate: '', current: false, description: '',
  });

  // ── Resume ────────────────────────────────────────────────────────────────
  interface ResumeSection { id: string; title: string; content: string }
  const [resumeName,     setResumeName]     = useState('');
  const [resumeSections, setResumeSections] = useState<ResumeSection[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  // ── Project ───────────────────────────────────────────────────────────────
  const [project, setProject]     = useState<Omit<Project, 'id'>>({
    title: '', description: '', technologies: [], githubUrl: '', liveUrl: '',
  });
  const [techInput, setTechInput] = useState('');

  // ── Cover Letter ──────────────────────────────────────────────────────────
  const [letterName,    setLetterName]    = useState('');
  const [letterJob,     setLetterJob]     = useState('');
  const [letterCompany, setLetterCompany] = useState('');
  const [letterBody,    setLetterBody]    = useState('');
  const [aiLoading,     setAiLoading]     = useState(false);
  const [aiError,       setAiError]       = useState('');

  // ── Seed all state from profile once loaded ───────────────────────────────
  useEffect(() => {
    if (!profile) return;

    // Always keep base form data fresh
    setFormData({
      fullName:  profile.fullName,
      email:     profile.email,
      phone:     profile.phone     || '',
      location:  profile.location  || '',
      title:     profile.title     || '',
      bio:       profile.bio       || '',
      github:    profile.github    || '',
      linkedin:  profile.linkedin  || '',
      portfolio: profile.portfolio || '',
    });

    if (isSkills) {
      setSkills(profile.skills || []);
    }

    if (isEducation && id) {
      const e = profile.education.find(e => e.id === id);
      if (e) setEducation({ school: e.school, degree: e.degree, field: e.field, startDate: e.startDate, endDate: e.endDate, gpa: e.gpa || '' });
    }

    if (isExperience && id) {
      const e = profile.experience.find(e => e.id === id);
      if (e) setExperience({ company: e.company, position: e.position, location: e.location, startDate: e.startDate, endDate: e.endDate, current: e.current, description: e.description });
    }

    if (isResume) {
      if (id) {
        const r = profile.resumes.find(r => r.id === id);
        if (r) setResumeName(r.name);
      }
      // Auto-populate sections from profile data
      const sections: ResumeSection[] = [];
      if (profile.bio) {
        sections.push({ id: 'summary', title: 'Summary', content: profile.bio });
      }
      if (profile.experience.length) {
        sections.push({
          id: 'experience', title: 'Experience',
          content: profile.experience.map(e =>
            `${e.position} at ${e.company} (${e.startDate} – ${e.current ? 'Present' : e.endDate})${e.location ? ` · ${e.location}` : ''}${e.description ? `\n${e.description}` : ''}`
          ).join('\n\n'),
        });
      }
      if (profile.education.length) {
        sections.push({
          id: 'education', title: 'Education',
          content: profile.education.map(e =>
            `${e.degree} in ${e.field} — ${e.school} (${e.startDate} – ${e.endDate})${e.gpa ? `\nGPA: ${e.gpa}` : ''}`
          ).join('\n\n'),
        });
      }
      if (profile.skills.length) {
        sections.push({ id: 'skills', title: 'Skills', content: profile.skills.join(', ') });
      }
      setResumeSections(sections);
    }

    if (isCoverLetter && id) {
      const cl = profile.coverLetters.find(c => c.id === id);
      if (cl) { setLetterName(cl.name); setLetterBody(cl.content); }
    }

    if (isProject && id) {
      const p = profile.projects.find(p => p.id === id);
      if (p) setProject({ title: p.title, description: p.description, technologies: p.technologies, githubUrl: p.githubUrl || '', liveUrl: p.liveUrl || '' });
    }
  }, [profile, isSkills, isEducation, isExperience, isResume, isCoverLetter, isProject, id]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // ── Save handlers ─────────────────────────────────────────────────────────

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ ...formData });
    navigate('/profile', { state: { tab: isResume ? 'resume' : isProject ? 'portfolio' : isCoverLetter ? 'documents' : 'overview' } });
  };

  const handleSaveEducation = () => {
    const updatedEducation = id
      ? profile.education.map(e => e.id === id ? { ...education, id } : e)
      : [...profile.education, { ...education, id: Date.now().toString() }];
    updateProfile({ education: updatedEducation });
    navigate('/profile', { state: { tab: isResume ? 'resume' : isProject ? 'portfolio' : isCoverLetter ? 'documents' : 'overview' } });
  };

  const handleSaveExperience = () => {
    const updatedExperience = id
      ? profile.experience.map(e => e.id === id ? { ...experience, id } : e)
      : [...(profile.experience || []), { ...experience, id: Date.now().toString() }];
    updateProfile({ experience: updatedExperience });
    navigate('/profile', { state: { tab: isResume ? 'resume' : isProject ? 'portfolio' : isCoverLetter ? 'documents' : 'overview' } });
  };

  const handleSaveSkills = () => {
    updateProfile({ skills });
    navigate('/profile', { state: { tab: isResume ? 'resume' : isProject ? 'portfolio' : isCoverLetter ? 'documents' : 'overview' } });
  };

  const handleSaveResume = () => {
    if (!resumeName.trim()) return;
    const newResume: Resume = {
      id: id || Date.now().toString(),
      name: resumeName.trim(),
      type: 'created',
      createdAt: new Date().toISOString(),
    };
    const updatedResumes = id
      ? profile.resumes.map(r => r.id === id ? newResume : r)
      : [...profile.resumes, newResume];
    updateProfile({ resumes: updatedResumes });
    navigate('/profile', { state: { tab: isResume ? 'resume' : isProject ? 'portfolio' : isCoverLetter ? 'documents' : 'overview' } });
  };

  const handlePrintResume = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>${resumeName || 'Resume'}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Georgia, serif; font-size: 12pt; color: #111; padding: 48px; max-width: 800px; margin: 0 auto; }
            h1 { font-size: 22pt; margin-bottom: 4px; }
            .subtitle { font-size: 11pt; color: #555; margin-bottom: 4px; }
            .contact { font-size: 9.5pt; color: #777; margin-bottom: 20px; }
            hr { border: none; border-top: 1px solid #ddd; margin: 16px 0; }
            .section-title { font-size: 9pt; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-bottom: 8px; margin-top: 20px; }
            .section-content { font-size: 10.5pt; line-height: 1.7; white-space: pre-wrap; color: #222; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  };

  const handleSaveProject = () => {
    if (!project.title.trim()) return;
    const newProject: Project = { ...project, id: id || Date.now().toString() };
    const updatedProjects = id
      ? profile.projects.map(p => p.id === id ? newProject : p)
      : [...profile.projects, newProject];
    updateProfile({ projects: updatedProjects });
    navigate('/profile', { state: { tab: isResume ? 'resume' : isProject ? 'portfolio' : isCoverLetter ? 'documents' : 'overview' } });
  };

  const handleSaveCoverLetter = () => {
    if (!letterName.trim()) return;
    const newLetter: CoverLetter = {
      id: id || Date.now().toString(),
      name: letterName.trim(),
      content: letterBody,
      createdAt: new Date().toISOString(),
    };
    const updatedLetters = id
      ? profile.coverLetters.map(c => c.id === id ? newLetter : c)
      : [...profile.coverLetters, newLetter];
    updateProfile({ coverLetters: updatedLetters });
    navigate('/profile', { state: { tab: isResume ? 'resume' : isProject ? 'portfolio' : isCoverLetter ? 'documents' : 'overview' } });
  };

  const handleGenerateCoverLetter = async () => {
    if (!letterJob.trim() || !letterCompany.trim()) {
      setAiError('Please enter both a job title and company name first.');
      return;
    }
    setAiError('');
    setAiLoading(true);
    try {
      const profileSummary = [
        `Name: ${profile.fullName}`,
        profile.title    ? `Title: ${profile.title}` : '',
        profile.bio      ? `Bio: ${profile.bio}` : '',
        profile.skills.length
          ? `Skills: ${profile.skills.join(', ')}` : '',
        profile.experience.length
          ? `Experience:\n${profile.experience.map(e => `  - ${e.position} at ${e.company} (${e.startDate}–${e.current ? 'Present' : e.endDate}): ${e.description}`).join('\n')}` : '',
        profile.education.length
          ? `Education:\n${profile.education.map(e => `  - ${e.degree} in ${e.field} at ${e.school}`).join('\n')}` : '',
      ].filter(Boolean).join('\n');

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Write a professional cover letter for the following applicant applying for the role of "${letterJob}" at "${letterCompany}".

Applicant profile:
${profileSummary}

Instructions:
- Write in first person
- 3–4 paragraphs: strong opening, relevant experience/skills, why this company specifically, warm closing
- Professional but personable tone
- Do NOT include date, address headers, salutation, or sign-off — just the body paragraphs
- Do NOT add any commentary, explanation, or markdown — just the letter text`,
          }],
        }),
      });
      const data = await res.json();
      const text = data.content
        ?.map((b: { type: string; text?: string }) => b.type === 'text' ? b.text : '')
        .join('') || '';
      if (text) setLetterBody(text.trim());
      else setAiError('No response received. Please try again.');
    } catch {
      setAiError('Failed to generate. Please check your connection and try again.');
    } finally {
      setAiLoading(false);
    }
  };

  // ── Tag helpers ───────────────────────────────────────────────────────────
  const addSkill = () => {
    if (!skillInput.trim()) return;
    setSkills(prev => [...prev, skillInput.trim()]);
    setSkillInput('');
  };
  const removeSkill = (i: number) => setSkills(prev => prev.filter((_, idx) => idx !== i));

  const addTech = () => {
    if (!techInput.trim()) return;
    setProject(prev => ({ ...prev, technologies: [...prev.technologies, techInput.trim()] }));
    setTechInput('');
  };
  const removeTech = (i: number) => setProject(prev => ({ ...prev, technologies: prev.technologies.filter((_, idx) => idx !== i) }));

  // ── Resume section helpers ────────────────────────────────────────────────
  const addSection = () => setResumeSections(prev => [...prev, { id: Date.now().toString(), title: 'New Section', content: '' }]);
  const removeSection = (i: number) => setResumeSections(prev => prev.filter((_, idx) => idx !== i));
  const updateSection = (i: number, field: 'title' | 'content', value: string) =>
    setResumeSections(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));

  // ── Page title ────────────────────────────────────────────────────────────
  const pageTitle =
    isEducation   ? (id ? 'Edit Education'   : 'Add Education')   :
    isExperience  ? (id ? 'Edit Experience'  : 'Add Experience')  :
    isSkills      ? 'Edit Skills'                                  :
    isResume      ? (id ? 'Edit Resume'      : 'Create Resume')   :
    isProject     ? (id ? 'Edit Project'     : 'Add Project')     :
    isCoverLetter ? (id ? 'Edit Cover Letter': 'Create Cover Letter') :
    'Edit Profile';

  const showHeaderSave = isBaseProfile || isSkills;

  const handleHeaderSave = (e: React.MouseEvent) => {
    if (isBaseProfile) handleProfileSubmit(e as unknown as React.FormEvent);
    else if (isSkills) handleSaveSkills();
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div ref={scrollRef} className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-y-auto h-full">

      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/profile', { state: { tab: isResume ? 'resume' : isProject ? 'portfolio' : isCoverLetter ? 'documents' : 'overview' } })}
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
            <div className="w-10 h-10" />
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6">

        {/* ── Base Profile ─────────────────────────────────────────────── */}
        {isBaseProfile && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">Basic Information</h2>
              <div className="space-y-4">
                {[
                  { label: 'Full Name *',         name: 'fullName',  type: 'text',  required: true },
                  { label: 'Email *',              name: 'email',     type: 'email', required: true },
                  { label: 'Phone',                name: 'phone',     type: 'tel',   required: false },
                  { label: 'Location',             name: 'location',  type: 'text',  required: false, placeholder: 'e.g., Toronto, ON' },
                  { label: 'Professional Title',   name: 'title',     type: 'text',  required: false, placeholder: 'e.g., Computer Science Student' },
                ].map(({ label, name, type, required, placeholder }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={formData[name as keyof typeof formData]}
                      onChange={e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                      required={required}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">Bio / Summary</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">Professional Links</h2>
              <div className="space-y-4">
                {[
                  { label: 'GitHub',           name: 'github',    placeholder: 'github.com/username' },
                  { label: 'LinkedIn',          name: 'linkedin',  placeholder: 'linkedin.com/in/username' },
                  { label: 'Portfolio Website', name: 'portfolio', placeholder: 'yourportfolio.com' },
                ].map(({ label, name, placeholder }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">{label}</label>
                    <input
                      type="text"
                      name={name}
                      value={formData[name as keyof typeof formData]}
                      onChange={e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90">
              Save Changes
            </button>
          </form>
        )}

        {/* ── Education ────────────────────────────────────────────────── */}
        {isEducation && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold dark:text-white">{id ? 'Edit Education' : 'Add Education'}</h2>
            {[
              { placeholder: 'School',                         field: 'school'    },
              { placeholder: 'Degree (e.g., BSc)',             field: 'degree'    },
              { placeholder: 'Field (e.g., Computer Science)', field: 'field'     },
            ].map(({ placeholder, field }) => (
              <input key={field} type="text" placeholder={placeholder}
                value={education[field as keyof typeof education] as string}
                onChange={e => setEducation({ ...education, [field]: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ))}
            <div className="flex gap-3">
              {(['startDate', 'endDate'] as const).map(field => (
                <input key={field} type="text"
                  placeholder={field === 'startDate' ? 'Start Date' : 'End Date'}
                  value={education[field]}
                  onChange={e => setEducation({ ...education, [field]: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ))}
            </div>
            <input type="text" placeholder="GPA (optional)"
              value={education.gpa}
              onChange={e => setEducation({ ...education, gpa: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="button" onClick={handleSaveEducation}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90">
              Save Education
            </button>
          </div>
        )}

        {/* ── Experience ───────────────────────────────────────────────── */}
        {isExperience && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold dark:text-white">{id ? 'Edit Experience' : 'Add Experience'}</h2>
            <input type="text" placeholder="Job Title"
              value={experience.position}
              onChange={e => setExperience({ ...experience, position: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input type="text" placeholder="Company"
              value={experience.company}
              onChange={e => setExperience({ ...experience, company: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-3">
              <input type="text" placeholder="Start Date"
                value={experience.startDate}
                onChange={e => setExperience({ ...experience, startDate: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input type="text" placeholder="End Date"
                value={experience.endDate}
                onChange={e => setExperience({ ...experience, endDate: e.target.value })}
                disabled={experience.current}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>
            <label className="flex items-center gap-2 text-sm dark:text-white cursor-pointer">
              <input type="checkbox" checked={experience.current}
                onChange={e => setExperience({ ...experience, current: e.target.checked })} />
              I currently work here
            </label>
            <input type="text" placeholder="Location"
              value={experience.location}
              onChange={e => setExperience({ ...experience, location: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea placeholder="Description" rows={4}
              value={experience.description}
              onChange={e => setExperience({ ...experience, description: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="button" onClick={handleSaveExperience}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90">
              Save Experience
            </button>
          </div>
        )}

        {/* ── Skills ───────────────────────────────────────────────────── */}
        {isSkills && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold dark:text-white">Skills</h2>
            <div className="flex gap-2">
              <input value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add a skill"
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="button" onClick={addSkill}
                className="px-4 py-3 bg-primary text-white rounded-lg hover:opacity-90">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <div key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center gap-2">
                  <span className="dark:text-white text-sm">{skill}</span>
                  <button type="button" onClick={() => removeSkill(i)} className="text-red-500 hover:text-red-700 leading-none">✕</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={handleSaveSkills}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90">
              Save Skills
            </button>
          </div>
        )}

        {/* ── Resume ───────────────────────────────────────────────────── */}
        {isResume && (
          <div className="space-y-6">

            {/* Title */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold dark:text-white">Resume Details</h2>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Resume Title *</label>
                <input type="text" placeholder="e.g., Software Engineer Resume"
                  value={resumeName}
                  onChange={e => setResumeName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Sections editor */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold dark:text-white">Sections</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Auto-populated from your profile. Edit freely or add custom sections.
                  </p>
                </div>
                <button type="button" onClick={addSection}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-primary font-medium border border-primary/30 rounded-lg hover:bg-primary/5">
                  <Plus className="w-4 h-4" /> Add Section
                </button>
              </div>

              {resumeSections.length === 0 && (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
                  No sections yet. Add your first section or fill in your profile to auto-populate.
                </p>
              )}

              <div className="space-y-4">
                {resumeSections.map((section, i) => (
                  <div key={section.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      <input
                        type="text"
                        value={section.title}
                        onChange={e => updateSection(i, 'title', e.target.value)}
                        className="flex-1 bg-transparent dark:text-white text-sm font-semibold focus:outline-none"
                      />
                      <button type="button" onClick={() => removeSection(i)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-400 hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <textarea
                      rows={5}
                      value={section.content}
                      onChange={e => updateSection(i, 'content', e.target.value)}
                      placeholder="Section content..."
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 dark:text-white text-sm focus:outline-none resize-y leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Preview + download */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold dark:text-white">Preview</h2>
                <button type="button" onClick={handlePrintResume}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>

              {/* Printable area */}
              <div
                ref={printRef}
                className="border border-gray-100 dark:border-gray-700 rounded-xl p-6 bg-white text-gray-900"
              >
                <h1 className="text-xl font-bold text-gray-900">{profile.fullName}</h1>
                {profile.title && <p className="text-sm text-gray-500 mt-0.5">{profile.title}</p>}
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-400 mt-2 mb-4">
                  {profile.email    && <span>{profile.email}</span>}
                  {profile.phone    && <span>{profile.phone}</span>}
                  {profile.location && <span>{profile.location}</span>}
                  {profile.github   && <span>{profile.github}</span>}
                  {profile.linkedin && <span>{profile.linkedin}</span>}
                </div>
                <hr className="border-gray-200 mb-2" />
                {resumeSections.filter(s => s.content.trim()).map(s => (
                  <div key={s.id} className="mt-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">{s.title}</h2>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{s.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/profile', { state: { tab: isResume ? 'resume' : isProject ? 'portfolio' : isCoverLetter ? 'documents' : 'overview' } })}
                className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800">
                Cancel
              </button>
              <button type="button" onClick={handleSaveResume}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90">
                Save Resume
              </button>
            </div>
          </div>
        )}

        {/* ── Portfolio / Project ───────────────────────────────────────── */}
        {isProject && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-5">
              <h2 className="text-lg font-semibold dark:text-white">{id ? 'Edit Project' : 'Add Project'}</h2>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Project Title *</label>
                <input type="text" placeholder="e.g., Personal Finance Tracker"
                  value={project.title}
                  onChange={e => setProject({ ...project, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Description</label>
                <textarea placeholder="What does this project do? What problem does it solve?"
                  rows={4} value={project.description}
                  onChange={e => setProject({ ...project, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Technologies</label>
                <div className="flex gap-2 mb-3">
                  <input value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    placeholder="e.g., React, TypeScript, Tailwind"
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button type="button" onClick={addTech}
                    className="px-4 py-3 bg-primary text-white rounded-lg hover:opacity-90">
                    Add
                  </button>
                </div>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i}
                        className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-sm font-medium">
                        {tech}
                        <button type="button" onClick={() => removeTech(i)} className="hover:text-red-500 leading-none">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">GitHub URL</label>
                <input type="text" placeholder="github.com/username/repo"
                  value={project.githubUrl}
                  onChange={e => setProject({ ...project, githubUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Live Demo URL</label>
                <input type="text" placeholder="yourproject.vercel.app"
                  value={project.liveUrl}
                  onChange={e => setProject({ ...project, liveUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/profile', { state: { tab: isResume ? 'resume' : isProject ? 'portfolio' : isCoverLetter ? 'documents' : 'overview' } })}
                className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800">
                Cancel
              </button>
              <button type="button" onClick={handleSaveProject}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90">
                Save Project
              </button>
            </div>
          </div>
        )}

        {/* ── Cover Letter ─────────────────────────────────────────────── */}
        {isCoverLetter && (
          <div className="space-y-6">

            {/* Meta */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold dark:text-white">Cover Letter Details</h2>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Letter Name / Title *</label>
                <input type="text" placeholder="e.g., Cover Letter – Shopify 2025"
                  value={letterName}
                  onChange={e => setLetterName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">Job Title</label>
                  <input type="text" placeholder="e.g., Frontend Developer"
                    value={letterJob}
                    onChange={e => setLetterJob(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">Company</label>
                  <input type="text" placeholder="e.g., Shopify"
                    value={letterCompany}
                    onChange={e => setLetterCompany(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* AI generation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold dark:text-white">Generate with AI</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    Writes a tailored letter using your profile data. Fill in Job Title and Company above first.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateCoverLetter}
                  disabled={aiLoading}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
                >
                  {aiLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                    : <><Sparkles className="w-4 h-4" /> Generate</>}
                </button>
              </div>
              {aiError && (
                <p className="mt-3 text-sm text-red-500 dark:text-red-400">{aiError}</p>
              )}
            </div>

            {/* Body editor */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold dark:text-white">Letter Body</h2>
                {letterBody && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {letterBody.split(/\s+/).filter(Boolean).length} words
                  </span>
                )}
              </div>
              <textarea
                rows={10}
                placeholder="Write your cover letter here, or use AI generation above to create a draft…"
                value={letterBody}
                onChange={e => setLetterBody(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y text-sm leading-relaxed"
              />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/profile', { state: { tab: isResume ? 'resume' : isProject ? 'portfolio' : isCoverLetter ? 'documents' : 'overview' } })}
                className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800">
                Cancel
              </button>
              <button type="button" onClick={handleSaveCoverLetter}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90">
                Save Cover Letter
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}