import { useState } from 'react';
import { User, Search, X } from 'lucide-react';
import { allJobs, featuredJobs } from '../data/jobsDatabase';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router';

export function SavedJobs() {
  const navigate = useNavigate();
  const { savedJobs, toggleSaveJob, isJobApplied } = useApp();
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<Set<string>>(new Set());

  const allJobsData = [...allJobs, ...featuredJobs];
  const saved = allJobsData.filter(job => savedJobs.has(job.id));

  const toggleCompareSelection = (jobId: string) => {
    setSelectedForCompare(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        if (newSet.size < 3) {
          newSet.add(jobId);
        }
      }
      return newSet;
    });
  };

  const compareJobs = Array.from(selectedForCompare).map(id => 
    allJobsData.find(job => job.id === id)!
  );

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Saved Jobs</h1>
        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
        >
          <User className="w-6 h-6 text-primary" />
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => {
            setCompareMode(!compareMode);
            setSelectedForCompare(new Set());
          }}
          className={`px-4 py-2 rounded-lg font-medium text-sm ${
            compareMode 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-white dark:bg-gray-900 border-2 border-primary text-primary'
          }`}
        >
          {compareMode ? 'Exit Compare' : 'Compare Jobs'}
        </button>
        {compareMode && selectedForCompare.size >= 2 && (
          <button
            onClick={() => navigate('/compare', { state: { jobIds: Array.from(selectedForCompare) } })}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium text-sm"
          >
            Compare ({selectedForCompare.size})
          </button>
        )}
      </div>

      {compareMode && (
        <div className="mb-4 p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
          <p className="text-sm text-primary">
            Select 2-3 jobs to compare. Tap jobs to select them.
          </p>
        </div>
      )}

      {/* Count */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {saved.length} saved jobs
      </p>

      {/* Job listings */}
      {saved.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No saved jobs yet</p>
          <button
            onClick={() => navigate('/browse')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {saved.map(job => {
            const applied = isJobApplied(job.id);
            const isSelected = selectedForCompare.has(job.id);
            const deadline = new Date(job.deadline);
            const today = new Date('2026-03-06');
            const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={job.id}
                onClick={() => {
                  if (compareMode) {
                    toggleCompareSelection(job.id);
                  } else {
                    navigate(`/job/${job.id}`);
                  }
                }}
                className={`rounded-2xl p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-primary/10 dark:bg-primary/20 border-2 border-primary'
                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{job.company}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {job.location} • {job.locationType}
                    </p>
                  </div>
                  {!compareMode && (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(job.id);
                        }}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  )}
                  {compareMode && isSelected && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {job.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="px-2 py-1 bg-white dark:bg-gray-700 rounded text-xs font-medium  dark:text-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className={daysUntilDeadline <= 7 ? 'text-red-600 font-medium' : ''}>
                      Deadline: {deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </p>
                  {applied && (
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-lg font-medium dark:text-gray-200">
                      Applied
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}