import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Users, Calendar, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { events, formatEventDate, CareerEvent } from '../data/eventsDatabase';

const TYPE_COLORS: Record<CareerEvent['type'], { bg: string; text: string }> = {
  'CAREER FAIR':  { bg: 'bg-red-100 dark:bg-red-900/30',    text: 'text-red-600 dark:text-red-400' },
  'WORKSHOP':     { bg: 'bg-blue-100 dark:bg-blue-900/30',   text: 'text-blue-600 dark:text-blue-400' },
  'INFO SESSION': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
  'NETWORKING':   { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
  'PANEL':        { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
};

const ALL_FILTERS = ['All', 'CAREER FAIR', 'WORKSHOP', 'INFO SESSION', 'NETWORKING', 'PANEL'] as const;

export function AllEvents() {
  const navigate = useNavigate();
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(() => {
  const saved = localStorage.getItem("registeredIds");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [filter, setFilter] = useState<string>('All');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = events
    .filter(e => new Date(e.date + 'T00:00:00') >= today)
    .filter(e => filter === 'All' || e.type === filter)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const toggleRegister = (id: string) => {
    setRegisteredIds(prev => {
      const next = new Set(prev);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      localStorage.setItem("registeredIds", JSON.stringify([...next]));

      return next;
    });
  };

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
        <h1 className="text-xl font-semibold">Events & Workshops</h1>
      </div>

      {/* Filter chips */}
      <div className="px-6 pt-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
        {ALL_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filter === f
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary'
            }`}
          >
            {f === 'All' ? 'All Events' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Event count */}
      <div className="px-6 py-2 text-sm text-gray-500 dark:text-gray-400">
        {filtered.length} upcoming event{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Event cards */}
      <div className="px-6 pb-6 space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No events in this category</p>
          </div>
        ) : (
          filtered.map(event => {
            const registered = registeredIds.has(event.id);
            const colors = TYPE_COLORS[event.type];
            const spotsLeft = event.capacity && event.registeredCount
              ? event.capacity - event.registeredCount
              : null;
            const almostFull = spotsLeft !== null && spotsLeft <= 5;

            return (
              <div
                key={event.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4"
              >
                {/* Type badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold tracking-wide px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                    {event.type}
                  </span>
                  {registered && (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Registered
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-base mb-1">{event.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
                  {event.description}
                </p>

                {/* Meta info */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="w-4 h-4 shrink-0 text-primary" />
                    <span>{formatEventDate(event.date)} · {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4 shrink-0 text-primary" />
                    <span>{event.location}{event.locationDetail ? ` — ${event.locationDetail}` : ''}</span>
                  </div>
                  {spotsLeft !== null && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 shrink-0 text-primary" />
                      <span className={almostFull ? 'text-red-500 font-medium' : 'text-gray-600 dark:text-gray-300'}>
                        {almostFull ? `Only ${spotsLeft} spots left!` : `${spotsLeft} spots remaining`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {event.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => toggleRegister(event.id)}
                  className={`w-full py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    registered
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  {registered ? '✓ Registered — Click to cancel' : 'Register Now'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
