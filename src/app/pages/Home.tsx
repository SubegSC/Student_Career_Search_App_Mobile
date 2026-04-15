import { useState, useEffect } from 'react';
import { User, ChevronRight, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { allJobs, featuredJobs } from '../data/jobsDatabase';
import { advisors } from '../data/advisorsDatabase';
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
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('registeredIds');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [bookedAdvisors, setBookedAdvisors] = useState<string[]>([]);

  // Load booked advisors from localStorage
  useEffect(() => {
    const booked = advisors
      .map(advisor => `bookedSlot-${advisor.id}`)
      .filter(key => localStorage.getItem(key) !== null);
    setBookedAdvisors(booked.map(key => key.replace('bookedSlot-', '')));
  }, []);

  // Sync registered events and booked advisors when page becomes visible or storage changes
  useEffect(() => {
    const handleRefresh = () => {
      // Refresh registered event IDs
      const saved = localStorage.getItem('registeredIds');
      setRegisteredIds(saved ? new Set(JSON.parse(saved)) : new Set());

      // Refresh booked advisors
      const booked = advisors
        .map(advisor => `bookedSlot-${advisor.id}`)
        .filter(key => localStorage.getItem(key) !== null);
      setBookedAdvisors(booked.map(key => key.replace('bookedSlot-', '')));
    };

    // Listen for visibility changes (when user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleRefresh();
      }
    };

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'registeredIds' || (e.key && e.key.startsWith('bookedSlot-'))) {
        handleRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const pendingCount = Array.from(applications.values()).filter(a => a.status === 'pending').length;
  const interviewCount = Array.from(applications.values()).filter(a => a.status === 'interview').length;
  const appliedCount = applications.size;

  const deadlineJobs = [...featuredJobs, ...allJobs]
    .map(job => ({
      job,
      days: getDaysUntilDeadline(job.deadline)
    }))
    .filter(({ days }) => days >= 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, 4);

  // Events
  const upcomingEvents = getUpcomingEvents(6);
  const registeredEvents = upcomingEvents.filter(event => registeredIds.has(event.id));

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

      {/* ── YOUR BOOKED ADVISORS ── */}
      {bookedAdvisors.length > 0 ? (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Booked Advisors</h2>
            <button
              onClick={() => navigate('/advisors')}
              className="flex items-center gap-1 text-primary text-sm font-medium"
            >
              See all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Horizontal scroll row for booked advisors */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
            {advisors.filter(advisor => bookedAdvisors.includes(advisor.id)).map((advisor) => (
              <button
                key={advisor.id}
                onClick={() => navigate(`/advisor/${advisor.id}`)}
                className="shrink-0 w-48 bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                    style={{ backgroundColor: advisor.avatarColor }}
                  >
                    {advisor.initials}
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Booked
                  </span>
                </div>
                <p className="text-sm font-semibold leading-snug mb-1 line-clamp-1">{advisor.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">{advisor.role}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{advisor.specializations.slice(0, 2).join(', ')}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-8 text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">No advisors booked yet</p>
          <button
            onClick={() => navigate('/advisors')}
            className="text-primary text-sm font-medium"
          >
            Browse advisors and book a session
          </button>
        </div>
      )}

      {/* ── YOUR REGISTERED WORKSHOPS ── */}
      {registeredEvents.length > 0 ? (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Registered Workshops</h2>
            <button
              onClick={() => navigate('/events')}
              className="flex items-center gap-1 text-primary text-sm font-medium"
            >
              See all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Horizontal scroll row for registered events */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
            {registeredEvents.map(event => (
              <button
                key={event.id}
                onClick={() => navigate('/events')}
                className="shrink-0 w-44 bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-1 gap-2">
                  <p className={`text-xs font-semibold tracking-wide ${EVENT_TYPE_COLORS[event.type]}`}>
                    {event.type}
                  </p>
                  <span className="flex items-center gap-0.5 text-xs font-medium text-green-600 dark:text-green-400 shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-sm font-semibold leading-snug mb-2 line-clamp-2">{event.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatEventDate(event.date)} · {event.time.split('–')[0].trim()}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-8 text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">No workshops registered yet</p>
          <button
            onClick={() => navigate('/events')}
            className="text-primary text-sm font-medium"
          >
            Browse workshops and register
          </button>
        </div>
      )}

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