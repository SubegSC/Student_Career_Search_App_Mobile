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
    <div className="flex-1 overflow-y-auto px-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Saved Jobs</h1>
        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
        >
          <User className="w-6 h-6 text-blue-600" />
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
              ? 'bg-blue-600 text-white' 
              : 'bg-white border-2 border-blue-600 text-blue-600'
          }`}
        >
          {compareMode ? 'Exit Compare' : 'Compare Jobs'}
        </button>
        {compareMode && selectedForCompare.size >= 2 && (
          <button
            onClick={() => navigate('/compare', { state: { jobIds: Array.from(selectedForCompare) } })}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-sm"
          >
            Compare ({selectedForCompare.size})
          </button>
        )}
      </div>

      {compareMode && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Select 2-3 jobs to compare. Tap jobs to select them.
          </p>
        </div>
      )}

      {/* Count */}
      <p className="text-sm text-gray-600 mb-4">
        {saved.length} saved jobs
      </p>

      {/* Job listings */}
      {saved.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No saved jobs yet</p>
          <button
            onClick={() => navigate('/browse')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
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
                    ? 'bg-blue-100 border-2 border-blue-600'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{job.company}</p>
                    <p className="text-sm text-gray-500">
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
                        className="p-2 hover:bg-gray-200 rounded-lg"
                      >
                        <X className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  )}
                  {compareMode && isSelected && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {job.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-700">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    <span className={daysUntilDeadline <= 7 ? 'text-red-600 font-medium' : ''}>
                      Deadline: {deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </p>
                  {applied && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-lg font-medium">
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