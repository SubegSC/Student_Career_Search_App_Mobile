import { User, CheckCircle, Calendar, Clock, XCircle } from 'lucide-react';
import { allJobs, featuredJobs } from '../data/jobsDatabase';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router';

export function MyApplications() {
  const navigate = useNavigate();
  const { applications } = useApp();

  const allJobsData = [...allJobs, ...featuredJobs];
  const appliedJobs = Array.from(applications.entries()).map(([jobId, appData]) => ({
    job: allJobsData.find(j => j.id === jobId)!,
    application: appData
  })).filter(item => item.job);

  const pendingApps = appliedJobs.filter(a => a.application.status === 'pending');
  const interviewApps = appliedJobs.filter(a => a.application.status === 'interview');
  const acceptedApps = appliedJobs.filter(a => a.application.status === 'accepted');
  const rejectedApps = appliedJobs.filter(a => a.application.status === 'rejected');

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Applications</h1>
        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
        >
          <User className="w-6 h-6 text-primary" />
        </button>
      </div>

      {/* Status badges */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {acceptedApps.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
            <CheckCircle className="w-4 h-4 text-green-600 fill-green-600" />
            <span className="text-sm font-medium text-green-800">
              {acceptedApps.length} Accepted
            </span>
          </div>
        )}
        {interviewApps.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-full">
            <Calendar className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">
              {interviewApps.length} Interviews
            </span>
          </div>
        )}
        {pendingApps.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-800 rounded-full">
            <Clock className="w-4 h-4 text-gray-700" />
            <span className="text-sm font-medium text-gray-800 dark:text-white">
              {pendingApps.length} Pending
            </span>
          </div>
        )}
      </div>

      {appliedJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No applications yet</p>
          <button
            onClick={() => navigate('/browse')}
            className="px-4 py-2 bg-primary text-primary-foreground dark:opacity-90 dark:hover:opacity-90 rounded-lg font-medium"
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Accepted */}
          {acceptedApps.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 fill-green-600" />
                Accepted
              </h2>
              <div className="space-y-3">
                {acceptedApps.map(({ job, application }) => (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/job/${job.id}`)}
                    className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-4 cursor-pointer hover:bg-green-100"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{job.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{job.company}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {job.location} • {job.term}
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interviews */}
          {interviewApps.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                Interviews Scheduled
              </h2>
              <div className="space-y-3">
                {interviewApps.map(({ job, application }) => (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/job/${job.id}`)}
                    className="bg-orange-50 dark:bg-orange-900/10 rounded-2xl p-4 cursor-pointer hover:bg-orange-100"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{job.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{job.company}</p>
                        <p className="text-sm text-orange-700 font-medium">
                          Interview: March 15, 2026
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending */}
          {pendingApps.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                Pending Response
              </h2>
              <div className="space-y-3">
                {pendingApps.map(({ job, application }) => {
                  const appliedDate = new Date(application.appliedDate);
                  const daysAgo = Math.floor((new Date('2026-03-06').getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div
                      key={job.id}
                      onClick={() => navigate(`/job/${job.id}`)}
                      className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{job.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{job.company}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Applied {daysAgo === 0 ? 'today' : `${daysAgo} days ago`}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-primary text-primary-foreground dark:opacity-90 dark:hover:opacity-90 rounded-lg font-medium text-sm">
                          Pending
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rejected */}
          {rejectedApps.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Not Selected
              </h2>
              <div className="space-y-3">
                {rejectedApps.map(({ job, application }) => (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/job/${job.id}`)}
                    className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 cursor-pointer hover:bg-gray-100 opacity-60"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{job.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{job.company}</p>
                      </div>
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}