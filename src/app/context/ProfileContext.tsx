import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  activities?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

export interface Resume {
  id: string;
  name: string;
  type: 'created' | 'uploaded';
  fileUrl?: string;
  createdAt: string;
  sections: {
    education: Education[];
    experience: Experience[];
    skills: string[];
    projects: Project[];
    certifications: string[];
    languages: string[];
  };
}

export interface CoverLetter {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

export interface UserProfile {
  // Basic Information
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  title?: string;
  bio?: string;
  
  // Professional Links
  github?: string;
  linkedin?: string;
  portfolio?: string;
  otherLinks?: string[];
  
  // Profile image
  avatarUrl?: string;
  
  // Education & Experience
  education: Education[];
  experience: Experience[];
  
  // Skills
  skills: string[];
  
  // Projects/Portfolio
  projects: Project[];
  
  // Certifications
  certifications: string[];
  
  // Languages
  languages: string[];
  
  // Resumes
  resumes: Resume[];
  
  // Cover Letters
  coverLetters: CoverLetter[];
}

interface ProfileContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addEducation: (education: Education) => void;
  updateEducation: (id: string, updates: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, updates: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addResume: (resume: Resume) => void;
  updateResume: (id: string, updates: Partial<Resume>) => void;
  deleteResume: (id: string) => void;
  addCoverLetter: (letter: CoverLetter) => void;
  updateCoverLetter: (id: string, updates: Partial<CoverLetter>) => void;
  deleteCoverLetter: (id: string) => void;
  getProfileCompletion: () => number;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const defaultProfile: UserProfile = {
  fullName: 'John Doe',
  email: 'john.doe@university.ca',
  phone: '+1 (555) 123-4567',
  location: 'Toronto, ON',
  title: 'Computer Science Student',
  bio: 'Passionate software developer seeking internship opportunities',
  github: 'github.com/johndoe',
  linkedin: 'linkedin.com/in/johndoe',
  portfolio: 'johndoe.dev',
  education: [
    {
      id: 'edu-1',
      school: 'University of Toronto',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2023-09',
      endDate: '2027-05',
      gpa: '3.8',
      activities: 'Computer Science Club, Hackathon Team'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Tech Startup Inc.',
      position: 'Software Developer Intern',
      location: 'Toronto, ON',
      startDate: '2025-05',
      endDate: '2025-08',
      current: false,
      description: 'Developed web applications using React and Node.js. Collaborated with cross-functional teams to deliver features.'
    }
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'Git', 'AWS'],
  projects: [
    {
      id: 'proj-1',
      title: 'Task Management App',
      description: 'A full-stack task management application with user authentication and real-time updates',
      technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
      githubUrl: 'github.com/johndoe/task-app',
      liveUrl: 'taskapp.johndoe.dev'
    }
  ],
  certifications: ['AWS Cloud Practitioner', 'Google IT Support Certificate'],
  languages: ['English (Native)', 'French (Intermediate)', 'Spanish (Basic)'],
  resumes: [
    {
      id: 'resume-1',
      name: 'John_Doe_Resume_2026.pdf',
      type: 'created',
      createdAt: new Date().toISOString(),
      sections: {
        education: [],
        experience: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: []
      }
    }
  ],
  coverLetters: [
    {
      id: 'cl-1',
      name: 'Generic Cover Letter',
      content: 'Dear Hiring Manager,\n\nI am writing to express my interest...',
      createdAt: new Date().toISOString()
    }
  ]
};

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addEducation = (education: Education) => {
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, education]
    }));
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, ...updates } : e)
    }));
  };

  const deleteEducation = (id: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id)
    }));
  };

  const addExperience = (experience: Experience) => {
    setProfile(prev => ({
      ...prev,
      experience: [...prev.experience, experience]
    }));
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, ...updates } : e)
    }));
  };

  const deleteExperience = (id: string) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id)
    }));
  };

  const addProject = (project: Project) => {
    setProfile(prev => ({
      ...prev,
      projects: [...prev.projects, project]
    }));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const deleteProject = (id: string) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  const addResume = (resume: Resume) => {
    setProfile(prev => ({
      ...prev,
      resumes: [...prev.resumes, resume]
    }));
  };

  const updateResume = (id: string, updates: Partial<Resume>) => {
    setProfile(prev => ({
      ...prev,
      resumes: prev.resumes.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  };

  const deleteResume = (id: string) => {
    setProfile(prev => ({
      ...prev,
      resumes: prev.resumes.filter(r => r.id !== id)
    }));
  };

  const addCoverLetter = (letter: CoverLetter) => {
    setProfile(prev => ({
      ...prev,
      coverLetters: [...prev.coverLetters, letter]
    }));
  };

  const updateCoverLetter = (id: string, updates: Partial<CoverLetter>) => {
    setProfile(prev => ({
      ...prev,
      coverLetters: prev.coverLetters.map(l => l.id === id ? { ...l, ...updates } : l)
    }));
  };

  const deleteCoverLetter = (id: string) => {
    setProfile(prev => ({
      ...prev,
      coverLetters: prev.coverLetters.filter(l => l.id !== id)
    }));
  };

  const getProfileCompletion = () => {
    let completed = 0;
    const total = 10;

    if (profile.fullName && profile.email) completed++;
    if (profile.phone) completed++;
    if (profile.bio) completed++;
    if (profile.github || profile.linkedin || profile.portfolio) completed++;
    if (profile.education.length > 0) completed++;
    if (profile.experience.length > 0) completed++;
    if (profile.skills.length > 0) completed++;
    if (profile.projects.length > 0) completed++;
    if (profile.resumes.length > 0) completed++;
    if (profile.coverLetters.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <ProfileContext.Provider value={{
      profile,
      updateProfile,
      addEducation,
      updateEducation,
      deleteEducation,
      addExperience,
      updateExperience,
      deleteExperience,
      addProject,
      updateProject,
      deleteProject,
      addResume,
      updateResume,
      deleteResume,
      addCoverLetter,
      updateCoverLetter,
      deleteCoverLetter,
      getProfileCompletion,
      darkMode,
      toggleDarkMode
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
