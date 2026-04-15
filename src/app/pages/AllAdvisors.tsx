import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { advisors } from '../data/advisorsDatabase';

const STATUS_DOT: Record<string, string> = {
  available: 'bg-green-500',
  busy: 'bg-yellow-500',
  away: 'bg-gray-400',
};

const STATUS_LABEL: Record<string, string> = {
  available: 'Available',
  busy: 'Busy',
  away: 'Away',
};

export function AllAdvisors() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold">All Advisors</h1>
      </div>

      {/* Advisor count */}
      <div className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
        {advisors.length} advisor{advisors.length !== 1 ? 's' : ''} available
      </div>

      {/* Advisor cards grid */}
      <div className="px-6 pb-6 grid grid-cols-1 gap-4">
        {advisors.map(advisor => (
          <div
            key={advisor.id}
            onClick={() => navigate(`/advisor/${advisor.id}`)}
            className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-start gap-4 mb-3">
              {/* Avatar */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-base shrink-0"
                style={{ backgroundColor: advisor.avatarColor }}
              >
                {advisor.initials}
              </div>

              {/* Name and role with status */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`w-2 h-2 rounded-full ${STATUS_DOT[advisor.availabilityStatus]}`} />
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {STATUS_LABEL[advisor.availabilityStatus]}
                  </span>
                </div>
                <p className="font-semibold text-base">{advisor.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{advisor.role}</p>
              </div>
            </div>

            {/* Department */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{advisor.department}</p>

            {/* Bio */}
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
              {advisor.bio}
            </p>

            {/* Specializations */}
            <div className="flex flex-wrap gap-2 mb-3">
              {advisor.specializations.slice(0, 3).map(spec => (
                <span
                  key={spec}
                  className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full"
                >
                  {spec}
                </span>
              ))}
            </div>

            {/* Available slots count */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {advisor.availableSlots.length} slots available
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/advisor/${advisor.id}`);
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
              >
                View & Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}