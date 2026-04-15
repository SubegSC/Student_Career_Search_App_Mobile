import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, BookOpen, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { advisors } from '../data/advisorsDatabase';

const STATUS_COLORS = {
  available: 'bg-green-500',
  busy: 'bg-yellow-500',
  away: 'bg-gray-400',
};

function formatSlotDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function AdvisorDetail() {
  const navigate = useNavigate();
  const { advisorId } = useParams<{ advisorId: string }>();
  const advisor = advisors.find(a => a.id === advisorId);
  const [bookedSlot, setBookedSlot] = useState<string | null>(() => {
    return localStorage.getItem(`bookedSlot-${advisorId}`);
  });

  const [confirming, setConfirming] = useState<string | null>(null);

  if (!advisor) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 text-gray-500">
        Advisor not found.
      </div>
    );
  }

  const handleBook = (slotKey: string) => {
    if (confirming === slotKey) {
      setBookedSlot(slotKey);
      setConfirming(null);

      localStorage.setItem(`bookedSlot-${advisorId}`, slotKey);
    } else {
      setConfirming(slotKey);
    }
  };

  // Group slots by date
  const slotsByDate = advisor.availableSlots.reduce<Record<string, string[]>>((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot.time);
    return acc;
  }, {});

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
        <h1 className="text-xl font-semibold">Book an Advisor</h1>
      </div>

      <div className="px-6 py-6">
        {/* Advisor card */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold shrink-0"
              style={{ backgroundColor: advisor.avatarColor }}
            >
              {advisor.initials}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${STATUS_COLORS[advisor.availabilityStatus]}`}
                />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide">
                  {advisor.availabilityLabel}
                </span>
              </div>
              <h2 className="text-lg font-bold">{advisor.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{advisor.department}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{advisor.bio}</p>

          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Specializations</p>
            <div className="flex flex-wrap gap-2">
              {advisor.specializations.map(s => (
                <span
                  key={s}
                  className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Booking confirmed banner */}
        {bookedSlot && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-700 dark:text-green-300 text-sm">Appointment Booked!</p>
              <p className="text-sm text-green-600 dark:text-green-400">
                You'll receive a confirmation email with the meeting link or room details.
              </p>
            </div>
          </div>
        )}

        {/* Available slots */}
        <h3 className="text-lg font-semibold mb-4">Available Times</h3>

        {advisor.availabilityStatus === 'away' ? (
          <div className="text-center py-12 text-gray-400">
            <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">{advisor.name} is currently away</p>
            <p className="text-sm">{advisor.availabilityLabel}</p>
          </div>
        ) : Object.keys(slotsByDate).length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No available slots right now</p>
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(slotsByDate).map(([date, times]) => (
              <div key={date}>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  {formatSlotDate(date)}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {times.map(time => {
                    const slotKey = `${date}-${time}`;
                    const isBooked = bookedSlot === slotKey;
                    const isConfirming = confirming === slotKey;

                    return (
                      <button
                        key={time}
                        onClick={() => !isBooked && handleBook(slotKey)}
                        className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition-colors ${
                          isBooked
                            ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 cursor-default'
                            : isConfirming
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary'
                        }`}
                      >
                        {isBooked ? '✓ Booked' : isConfirming ? 'Confirm?' : time}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
