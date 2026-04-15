import { User, ChevronRight, Clock, MapPin } from 'lucide-react';
import { featuredJobs } from '../data/jobsDatabase';
import { featuredAdvisor } from '../data/advisorsDatabase';
import { getUpcomingEvents, formatEventDate, CareerEvent } from '../data/eventsDatabase';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';

// Jobs that have a deadline — reuse featuredJobs and sort by deadline
function getDaysUntilDeadline(deadline: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(deadline + 'T00:00:00');
  return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function DeadlineBadge({ days }: { days: number }) {
  if (days < 0) return <span className="text-xs text-gray-400">Closed</span>;
  if (days === 0) return <span className="text-xs font-semibold text-red-600">Due today</span>;
  if (days <= 3) return <span className="text-xs font-semibold text-red-500">{days} day{days !== 1 ? 's' : ''} left</span>;
  if (days <= 7) return <span className="text-xs font-semibold text-orange-500">{days} days left</span>;
  return <span className="text-xs font-medium text-gray-500">{days} days</span>;
}

const EVENT_TYPE_COLORS: Record<CareerEvent['type'], string> = {
  'CAREER FAIR':  'text-red-600 dark:text-red-400',
  'WORKSHOP':     'text-blue-600 dark:text-blue-400',
  'INFO SESSION': 'text-purple-600 dark:text-purple-400',
  'NETWORKING':   'text-green-600 dark:text-green-400',
  'PANEL':        'text-amber-600 dark:text-amber-400',
};

const STATUS_DOT: Record<string, string> = {
  available: 'bg-green-500',
  busy: 'bg-yellow-500',
  away: 'bg-gray-400',
};

export function Home() {
  const navigate = useNavigate();
  const { applications, isJobSaved, toggleSaveJob, isJobApplied } = useApp();

  const pendingCount = Array.from(applications.values()).filter(a => a.status === 'pending').length;
  const interviewCount = Array.from(applications.values()).filter(a => a.status === 'interview').length;
  const appliedCount = applications.size;

  // Upcoming deadlines: saved/applied jobs + featured jobs, sorted by deadline
  const deadlineJobs = featuredJobs
    .map(job => ({ job, days: getDaysUntilDeadline(job.deadline) }))
    .filter(({ days }) => days >= 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, 4);

  // Events
  const upcomingEvents = getUpcomingEvents(2);

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Student Career Search</h1>
        <div className="relative pt-2">
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
          >
            <User className="w-6 h-6 text-primary" />
          </button>
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

      {/* ── UPCOMING DEADLINES ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upcoming Deadlines</h2>
          <button
            onClick={() => navigate('/saved')}
            className="flex items-center gap-1 text-primary text-sm font-medium"
          >
            See saved
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal scroll row */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
          {deadlineJobs.length === 0 ? (
            <p className="text-sm text-gray-400">No upcoming deadlines.</p>
          ) : (
            deadlineJobs.map(({ job, days }) => (
              <button
                key={job.id}
                onClick={() => navigate(`/job/${job.id}`)}
                className="shrink-0 w-40 bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">{job.company}</p>
                <p className="text-sm font-semibold leading-snug mb-3 line-clamp-2">{job.title}</p>
                <DeadlineBadge days={days} />
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── YOUR ADVISOR ── */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Advisor</h2>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-4">
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-base shrink-0"
            style={{ backgroundColor: featuredAdvisor.avatarColor }}
          >
            {featuredAdvisor.initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className={`w-2 h-2 rounded-full ${STATUS_DOT[featuredAdvisor.availabilityStatus]}`} />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide">
                {featuredAdvisor.availabilityLabel}
              </span>
            </div>
            <p className="font-semibold text-sm">{featuredAdvisor.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{featuredAdvisor.department}</p>
          </div>

          {/* Book button */}
          <button
            onClick={() => navigate(`/advisor/${featuredAdvisor.id}`)}
            className="shrink-0 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Book
          </button>
        </div>
      </div>

      {/* ── EVENTS & WORKSHOPS ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Events & Workshops</h2>
          <button
            onClick={() => navigate('/events')}
            className="flex items-center gap-1 text-primary text-sm font-medium"
          >
            See all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal scroll row matching the mockup */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
          {upcomingEvents.map(event => (
            <button
              key={event.id}
              onClick={() => navigate('/events')}
              className="shrink-0 w-44 bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <p className={`text-xs font-semibold tracking-wide mb-1 ${EVENT_TYPE_COLORS[event.type]}`}>
                {event.type}
              </p>
              <p className="text-sm font-semibold leading-snug mb-2 line-clamp-2">{event.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatEventDate(event.date)} · {event.time.split('–')[0].trim()}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ── QUICK APPLY OPPORTUNITIES ── */}
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

      {/* ── RECOMMENDED JOBS ── */}
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