import { useLocation, useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign } from 'lucide-react';
import { allJobs, featuredJobs } from '../data/jobsDatabase';
import { useApp } from '../context/AppContext';

export function CompareJobs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isJobSaved, toggleSaveJob, isJobApplied } = useApp();
  const jobIds = location.state?.jobIds as string[] || [];

  const allJobsData = [...allJobs, ...featuredJobs];
  const jobs = jobIds.map(id => allJobsData.find(j => j.id === id)!).filter(Boolean);

  if (jobs.length < 2) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Select jobs to compare</h2>
          <button
            onClick={() => navigate('/saved')}
            className="text-primary font-medium"
          >
            Back to Saved Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/saved')}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold flex-1">Compare Jobs</h1>
        </div>
      </div>

      {/* Comparison grid */}
      <div className="px-6 py-6">
        {/* Company & Title */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase">Position</h3>
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${jobs.length}, 1fr)` }}>
            {jobs.map(job => (
              <div key={job.id} className="bg-gray-50 rounded-xl p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-xl font-bold text-primary">
                    {job.company.charAt(0)}
                  </span>
                </div>
                <h4 className="font-semibold mb-1 text-sm">{job.title}</h4>
                <p className="text-sm text-gray-600">{job.company}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </h3>
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${jobs.length}, 1fr)` }}>
            {jobs.map(job => (
              <div key={job.id} className="bg-gray-50 rounded-xl p-4">
                <p className="font-medium text-sm mb-1">{job.location}</p>
                <p className="text-xs text-gray-600">{job.locationType}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Deadline */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Application Deadline
          </h3>
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${jobs.length}, 1fr)` }}>
            {jobs.map(job => {
              const deadline = new Date(job.deadline);
              const today = new Date('2026-03-06');
              const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={job.id} className="bg-gray-50 rounded-xl p-4">
                  <p className={`font-medium text-sm ${daysUntilDeadline <= 7 ? 'text-red-600' : ''}`}>
                    {deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className={`text-xs ${daysUntilDeadline <= 7 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                    {daysUntilDeadline} days left
                    {daysUntilDeadline <= 7 && ' ⚠️'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Salary */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Compensation
          </h3>
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${jobs.length}, 1fr)` }}>
            {jobs.map(job => (
              <div key={job.id} className="bg-gray-50 rounded-xl p-4">
                <p className="font-medium text-sm">{job.salary || 'Not disclosed'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Required Skills */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase">Required Skills</h3>
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${jobs.length}, 1fr)` }}>
            {jobs.map(job => (
              <div key={job.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex flex-wrap gap-1">
                  {job.skills.slice(0, 5).map(skill => (
                    <span key={skill} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 5 && (
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                      +{job.skills.length - 5}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GPA Requirement */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase">GPA Requirement</h3>
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${jobs.length}, 1fr)` }}>
            {jobs.map(job => (
              <div key={job.id} className="bg-gray-50 rounded-xl p-4">
                <p className="font-medium text-sm">{job.gpaRequirement || 'Not specified'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Application Materials */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase">Application Materials</h3>
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${jobs.length}, 1fr)` }}>
            {jobs.map(job => (
              <div key={job.id} className="bg-gray-50 rounded-xl p-4">
                <ul className="space-y-1">
                  {job.materials.map(material => (
                    <li key={material} className="text-sm text-gray-700">• {material}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid gap-3 mb-20" style={{ gridTemplateColumns: `repeat(${jobs.length}, 1fr)` }}>
          {jobs.map(job => {
            const saved = isJobSaved(job.id);
            const applied = isJobApplied(job.id);
            
            return (
              <div key={job.id} className="space-y-2">
                <button
                  onClick={() => navigate(`/job/${job.id}`)}
                  className={`w-full py-2.5 rounded-lg font-medium text-sm ${
                    applied
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  {applied ? 'Applied' : 'Apply Now'}
                </button>
                <button
                  onClick={() => navigate(`/job/${job.id}`)}
                  className="w-full py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50"
                >
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
