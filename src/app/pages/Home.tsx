import { User, ChevronRight } from 'lucide-react';
import { featuredJobs } from '../data/jobsDatabase';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';

export function Home() {
  const navigate = useNavigate();
  const { applications, isJobSaved, toggleSaveJob, isJobApplied } = useApp();
  
  const pendingCount = Array.from(applications.values()).filter(a => a.status === 'pending').length;
  const interviewCount = Array.from(applications.values()).filter(a => a.status === 'interview').length;
  const appliedCount = applications.size;

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Student Career Search</h1>
        <div className="relative">
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
          >
            <User className="w-6 h-6 text-primary" />
          </button>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            1
          </span>
        </div>
      </div>

      {/* Welcome message */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300">
          Welcome back! Here's an overview of your career search.
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold">{appliedCount}</span>
          <span className="text-gray-600 dark:text-gray-400">Applied</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold">{interviewCount}</span>
          <span className="text-gray-600 dark:text-gray-400">Interviews</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold">{pendingCount}</span>
          <span className="text-gray-600 dark:text-gray-400">Pending</span>
        </div>
      </div>

      {/* Quick Apply Opportunities */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Apply Opportunities</h2>
        <div className="space-y-3">
          {featuredJobs.slice(0, 2).map((job) => {
            const saved = isJobSaved(job.id);
            const applied = isJobApplied(job.id);
            
            return (
              <div
                key={job.id}
                onClick={() => navigate(`/job/${job.id}`)}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex items-start justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{job.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{job.company}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {job.term} | {job.skills.slice(0, 3).join(', ')}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!applied) {
                      navigate(`/job/${job.id}`);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    applied 
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  } transition-colors`}
                >
                  {applied ? 'Applied' : 'Apply'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personalized Suggestions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recommended Jobs</h2>
          <button 
            onClick={() => navigate('/browse')}
            className="flex items-center gap-1 text-primary text-sm font-medium"
          >
            View More
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {featuredJobs.slice(2, 4).map((job) => {
            const saved = isJobSaved(job.id);
            const applied = isJobApplied(job.id);
            
            return (
              <div
                key={job.id}
                onClick={() => navigate(`/job/${job.id}`)}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex items-start justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{job.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{job.company}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {job.skills.slice(0, 3).join(', ')}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (applied) return;
                    if (saved) {
                      navigate(`/job/${job.id}`);
                    } else {
                      toggleSaveJob(job.id);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    applied
                      ? 'bg-secondary text-secondary-foreground'
                      : saved
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : 'bg-white border-2 border-primary text-primary dark:text-black hover:bg-primary/10'
                  } transition-colors`}
                >
                  {applied ? 'Applied' : saved ? 'Apply' : 'Save'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}