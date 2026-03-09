import { createContext, useContext, useState, ReactNode } from 'react';
import { Job } from '../data/jobsDatabase';

interface ApplicationData {
  jobId: string;
  appliedDate: string;
  status: 'pending' | 'interview' | 'accepted' | 'rejected';
  resume?: string;
  coverLetter?: string;
}

interface AppContextType {
  savedJobs: Set<string>;
  applications: Map<string, ApplicationData>;
  toggleSaveJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
  applyToJob: (jobId: string, resume: string, coverLetter: string) => void;
  isJobApplied: (jobId: string) => boolean;
  getApplication: (jobId: string) => ApplicationData | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set(['google-ux', 'rbc-software', 'amazon-data']));
  const [applications, setApplications] = useState<Map<string, ApplicationData>>(new Map());

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const isJobSaved = (jobId: string) => {
    return savedJobs.has(jobId);
  };

  const applyToJob = (jobId: string, resume: string, coverLetter: string) => {
    setApplications(prev => {
      const newMap = new Map(prev);
      newMap.set(jobId, {
        jobId,
        appliedDate: new Date().toISOString(),
        status: 'pending',
        resume,
        coverLetter
      });
      return newMap;
    });
  };

  const isJobApplied = (jobId: string) => {
    return applications.has(jobId);
  };

  const getApplication = (jobId: string) => {
    return applications.get(jobId);
  };

  return (
    <AppContext.Provider value={{
      savedJobs,
      applications,
      toggleSaveJob,
      isJobSaved,
      applyToJob,
      isJobApplied,
      getApplication
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
