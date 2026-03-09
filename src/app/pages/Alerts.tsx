import { Bell, Calendar, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { allJobs, featuredJobs } from '../data/jobsDatabase';

interface Alert {
  id: string;
  type: 'deadline' | 'interview' | 'status' | 'followup';
  jobId?: string;
  title: string;
  message: string;
  date: string;
}

export function Alerts() {
  const navigate = useNavigate();
  const { applications, savedJobs } = useApp();

  const allJobsData = [...allJobs, ...featuredJobs];

  // Generate alerts based on saved jobs and applications
  const alerts: Alert[] = [];

  // Deadline reminders for saved jobs
  const today = new Date('2026-03-06');
  allJobsData
    .filter(job => savedJobs.has(job.id) && !applications.has(job.id))
    .forEach(job => {
      const deadline = new Date(job.deadline);
      const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntil <= 7 && daysUntil > 0) {
        alerts.push({
          id: `deadline-${job.id}`,
          type: 'deadline',
          jobId: job.id,
          title: 'Application Deadline Approaching',
          message: `${job.title} at ${job.company}`,
          date: `Deadline: ${deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (${daysUntil} days left)`
        });
      }
    });

  // Interview reminders
  Array.from(applications.entries()).forEach(([jobId, app]) => {
    if (app.status === 'interview') {
      const job = allJobsData.find(j => j.id === jobId);
      if (job) {
        alerts.push({
          id: `interview-${jobId}`,
          type: 'interview',
          jobId: job.id,
          title: 'Interview Reminder',
          message: `${job.title} at ${job.company}`,
          date: 'Interview: March 15, 2026 at 2:00 PM'
        });
      }
    }
  });

  // Follow-up reminders
  Array.from(applications.entries()).forEach(([jobId, app]) => {
    if (app.status === 'pending') {
      const appliedDate = new Date(app.appliedDate);
      const daysSinceApplied = Math.floor((today.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceApplied >= 14) {
        const job = allJobsData.find(j => j.id === jobId);
        if (job) {
          alerts.push({
            id: `followup-${jobId}`,
            type: 'followup',
            jobId: job.id,
            title: 'Follow-up Reminder',
            message: `Consider following up on your application to ${job.company}`,
            date: `Applied ${daysSinceApplied} days ago`
          });
        }
      }
    }
  });

  // Status update alerts (mock)
  if (applications.size > 0) {
    alerts.push({
      id: 'status-1',
      type: 'status',
      title: 'Application Status Update',
      message: 'Your application has been reviewed',
      date: 'March 5, 2026'
    });
  }

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'interview':
        return <Calendar className="w-5 h-5 text-orange-600" />;
      case 'deadline':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'status':
        return <Bell className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'interview':
        return 'bg-orange-50 border-orange-200';
      case 'deadline':
        return 'bg-red-50 border-red-200';
      case 'status':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Alerts</h1>
        <button
          onClick={() => navigate('/profile')}
          className="relative w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
        >
          <Bell className="w-6 h-6 text-blue-600" />
          {alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {alerts.length}
            </span>
          )}
        </button>
      </div>

      {/* Alerts list */}
      {alerts.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No alerts at this time</p>
          <p className="text-sm text-gray-400">
            You'll receive notifications about deadlines, interviews, and application updates here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-2xl p-4 border ${getAlertColor(alert.type)} cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => {
                if (alert.jobId) {
                  navigate(`/job/${alert.jobId}`);
                }
              }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{alert.title}</h3>
                  <p className="text-sm text-gray-700 mb-1">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.date}</p>
                </div>
                {alert.jobId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/job/${alert.jobId}`);
                    }}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
                  >
                    View
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      {alerts.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/browse')}
              className="w-full py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Browse More Jobs
            </button>
            <button
              onClick={() => navigate('/saved')}
              className="w-full py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              View Saved Jobs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}