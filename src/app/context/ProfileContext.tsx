import { createContext, useContext, useState, ReactNode, useEffect } from "react";

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
  type: "created" | "uploaded";
  fileUrl?: string;
  createdAt: string;
}

export interface CoverLetter {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  title?: string;
  bio?: string;

  github?: string;
  linkedin?: string;
  portfolio?: string;

  education: Education[];
  experience: Experience[];
  skills: string[];
  projects: Project[];
  certifications: string[];
  languages: string[];

  resumes: Resume[];
  coverLetters: CoverLetter[];
}

interface ProfileContextType {
  profile: UserProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;

  updateProfile: (data: Partial<UserProfile>) => void;
  getProfileCompletion: () => number;

  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // 🔹 Fetch profile from Django backend
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("http://localhost:8000/api/profile/");
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    }

    loadProfile();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);

    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        ...data,
      };
    });
  };

  const getProfileCompletion = () => {
    if (!profile) return 0;

    let score = 0;

    const basicFields = [
      profile.fullName,
      profile.email,
      profile.phone,
      profile.location,
      profile.title,
      profile.bio,
    ];

    score += (basicFields.filter(Boolean).length / basicFields.length) * 50;

    score += profile.skills?.length ? 15 : 0;
    score += profile.education?.length ? 15 : 0;
    score += profile.experience?.length ? 20 : 0;

    return Math.round(score);
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        updateProfile,
        getProfileCompletion,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }

  return context;
}

