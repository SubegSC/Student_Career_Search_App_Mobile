import { useState } from 'react';
import { User, CheckCircle, Calendar, Clock, XCircle, ExternalLink, ChevronRight, FileText, Minus } from 'lucide-react';
import { allJobs, featuredJobs } from '../data/jobsDatabase';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router';

type AppStatus = 'pending' | 'interview' | 'accepted' | 'rejected' | 'withdrawn' | 'offer';

// Application timeline steps
const TIMELINE_STEPS: { key: AppStatus; label: string; color: string; bgColor: string }[] = [
  { key: 'pending',   label: 'Applied',    color: 'text-blue-600',   bgColor: 'bg-blue-500'   },
  { key: 'interview', label: 'Interview',  color: 'text-orange-600', bgColor: 'bg-orange-500' },
  { key: 'offer',     label: 'Offer',      color: 'text-purple-600', bgColor: 'bg-purple-500' },
  { key: 'accepted',  label: 'Accepted',   color: 'text-green-600',  bgColor: 'bg-green-500'  },
];

function ApplicationTimeline({ status }: { status: AppStatus }) {
  if (status === 'rejected' || status === 'withdrawn') return null;

  const activeIndex = TIMELINE_STEPS.findIndex(s => s.key === status);

  return (
    <div className="flex items-center gap-1 mt-2">
      {TIMELINE_STEPS.map((step, i) => {
        const isActive = i <= activeIndex;
        const isCurrent = i === activeIndex;
        return (
          <div key={step.key} className="flex items-center gap-1 flex-1">
            <div className={`flex flex-col items-center flex-1`}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? step.bgColor : 'bg-gray-200 dark:bg-gray-600'} ${isCurrent ? 'ring-2 ring-offset-1 ring-current' : ''}`} />
              <span className={`text-[9px] mt-0.5 font-medium ${isActive ? step.color : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
            {i < TIMELINE_STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mb-3 ${i < activeIndex ? step.bgColor : 'bg-gray-200 dark:bg-gray-600'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function MyApplications() {
  const navigate = useNavigate();
  const { applications } = useApp();
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

  const allJobsData = [...allJobs, ...featuredJobs];
  const appliedJobs = Array.from(applications.entries()).map(([jobId, appData]) => ({
    job: allJobsData.find(j => j.id === jobId)!,
    application: appData
  })).filter(item => item.job);

  const pendingApps   = appliedJobs.filter(a => a.application.status === 'pending');
  const interviewApps = appliedJobs.filter(a => a.application.status === 'interview');
  const offerApps     = appliedJobs.filter(a => (a.application.status as AppStatus) === 'offer');
  const acceptedApps  = appliedJobs.filter(a => a.application.status === 'accepted');
  const rejectedApps  = appliedJobs.filter(a => a.application.status === 'rejected');
  const withdrawnApps = appliedJobs.filter(a => (a.application.status as AppStatus) === 'withdrawn');

  const statusGroups = [
    { key: 'accepted',  label: 'Accepted',      apps: acceptedApps,  icon: CheckCircle, iconClass: 'text-green-600',  bgClass: 'bg-green-50 dark:bg-green-900/10',  badgeBg: 'bg-green-100 dark:bg-green-900/30',  badgeText: 'text-green-800', dotBg: 'bg-green-500' },
    { key: 'offer',     label: 'Offer Received', apps: offerApps,     icon: FileText,    iconClass: 'text-purple-600', bgClass: 'bg-purple-50 dark:bg-purple-900/10', badgeBg: 'bg-purple-100 dark:bg-purple-900/30', badgeText: 'text-purple-800', dotBg: 'bg-purple-500' },
    { key: 'interview', label: 'Interviews',     apps: interviewApps, icon: Calendar,    iconClass: 'text-orange-600', bgClass: 'bg-orange-50 dark:bg-orange-900/10', badgeBg: 'bg-orange-100 dark:bg-orange-900/30', badgeText: 'text-orange-800', dotBg: 'bg-orange-500' },
    { key: 'pending',   label: 'Pending',        apps: pendingApps,   icon: Clock,       iconClass: 'text-blue-600',   bgClass: 'bg-gray-50 dark:bg-gray-800',        badgeBg: 'bg-blue-100 dark:bg-blue-900/30',    badgeText: 'text-blue-800',   dotBg: 'bg-blue-500' },
    { key: 'rejected',  label: 'Not Selected',   apps: rejectedApps,  icon: XCircle,     iconClass: 'text-red-500',    bgClass: 'bg-gray-50 dark:bg-gray-800',        badgeBg: 'bg-red-100 dark:bg-red-900/30',      badgeText: 'text-red-800',    dotBg: 'bg-red-500' },
    { key: 'withdrawn', label: 'Withdrawn',      apps: withdrawnApps, icon: Minus,       iconClass: 'text-gray-500',   bgClass: 'bg-gray-50 dark:bg-gray-800',        badgeBg: 'bg-gray-100 dark:bg-gray-800',       badgeText: 'text-gray-600',   dotBg: 'bg-gray-400' },
  ].filter(g => g.apps.length > 0);

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Applications</h1>
        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
        >
          <User className="w-6 h-6 text-primary" />
        </button>
      </div>

      {/* Elevate button */}
      <a
        href="https://elevate.ucalgary.ca/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 mb-6 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
      >
        <ExternalLink className="w-4 h-4" />
        Find More Jobs on Elevate
      </a>

      {/* View Mode Toggle */}
      {appliedJobs.length > 0 && (
        <div className="flex items-center gap-2 mb-5 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'timeline' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Timeline
          </button>
        </div>
      )}

      {/* Status summary badges */}
      {appliedJobs.length > 0 && (
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {statusGroups.map(g => (
            <div key={g.key} className={`flex items-center gap-1.5 px-2.5 py-1.5 ${g.badgeBg} rounded-full`}>
              <div className={`w-2 h-2 rounded-full ${g.dotBg}`} />
              <span className={`text-xs font-semibold ${g.badgeText}`}>
                {g.apps.length} {g.label}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full ml-auto">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
              {appliedJobs.length} Total
            </span>
          </div>
        </div>
      )}

      {appliedJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No applications yet</p>
          <button
            onClick={() => navigate('/browse')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
          >
            Browse Jobs
          </button>
        </div>
      ) : viewMode === 'timeline' ? (
        /* ── Timeline View ─────────────────────────────────────────── */
        <div className="space-y-3">
          {appliedJobs.map(({ job, application }) => {
            const status = application.status as AppStatus;
            const appliedDate = new Date(application.appliedDate);
            const daysAgo = Math.floor((new Date('2026-03-06').getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={job.id}
                onClick={() => navigate(`/job/${job.id}`)}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{job.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{job.company} · Applied {daysAgo === 0 ? 'today' : `${daysAgo}d ago`}</p>
                  </div>
                  {(status === 'rejected' || status === 'withdrawn') && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${
                      status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {status === 'rejected' ? 'Not Selected' : 'Withdrawn'}
                    </span>
                  )}
                </div>
                <ApplicationTimeline status={status} />
              </div>
            );
          })}
        </div>
      ) : (
        /* ── List View ─────────────────────────────────────────────── */
        <div className="space-y-8">

          {/* Accepted */}
          {acceptedApps.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 fill-green-600" />
                Accepted
              </h2>
              <div className="space-y-3">
                {acceptedApps.map(({ job }) => (
                  <div key={job.id} onClick={() => navigate(`/job/${job.id}`)}
                    className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-4 cursor-pointer hover:bg-green-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{job.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{job.company}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{job.location} • {job.term}</p>
                      </div>
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Offer */}
          {offerApps.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Offer Received
              </h2>
              <div className="space-y-3">
                {offerApps.map(({ job }) => (
                  <div key={job.id} onClick={() => navigate(`/job/${job.id}`)}
                    className="bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-4 cursor-pointer hover:bg-purple-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{job.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{job.company}</p>
                        <p className="text-sm text-purple-700 font-medium">🎉 Offer awaiting decision</p>
                      </div>
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-white" />
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
                {interviewApps.map(({ job }) => (
                  <div key={job.id} onClick={() => navigate(`/job/${job.id}`)}
                    className="bg-orange-50 dark:bg-orange-900/10 rounded-2xl p-4 cursor-pointer hover:bg-orange-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{job.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{job.company}</p>
                        <p className="text-sm text-orange-700 font-medium">Interview: March 15, 2026</p>
                      </div>
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
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
                    <div key={job.id} onClick={() => navigate(`/job/${job.id}`)}
                      className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 cursor-pointer hover:bg-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{job.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{job.company}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Applied {daysAgo === 0 ? 'today' : `${daysAgo} days ago`}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-medium text-sm flex-shrink-0">
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
                {rejectedApps.map(({ job }) => (
                  <div key={job.id} onClick={() => navigate(`/job/${job.id}`)}
                    className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 cursor-pointer hover:bg-gray-100 opacity-60">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{job.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{job.company}</p>
                      </div>
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Withdrawn */}
          {withdrawnApps.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Minus className="w-5 h-5 text-gray-500" />
                Withdrawn
              </h2>
              <div className="space-y-3">
                {withdrawnApps.map(({ job }) => (
                  <div key={job.id} onClick={() => navigate(`/job/${job.id}`)}
                    className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 cursor-pointer hover:bg-gray-100 opacity-60">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{job.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{job.company}</p>
                      </div>
                      <Minus className="w-5 h-5 text-gray-400 flex-shrink-0" />
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