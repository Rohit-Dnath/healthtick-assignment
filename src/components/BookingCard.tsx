import React from 'react';
import type { Booking, Client } from '../types';

interface BookingCardProps {
  booking: Booking;
  client: Client;
  onDelete: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  client,
  onDelete
}) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const getEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const duration = booking.type === 'onboarding' ? 40 : 20;
  const endTime = getEndTime(booking.time, duration);

  const getColorClasses = () => {
    if (booking.type === 'onboarding') {
      return {
        bg: 'bg-gradient-to-br from-healthtick-50 to-healthtick-100',
        border: 'border-healthtick-200',
        text: 'text-healthtick-900',
        badge: 'bg-healthtick-100 text-healthtick-800 border-healthtick-200',
        accent: 'bg-healthtick-500'
      };
    } else {
      return {
        bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
        border: 'border-purple-200',
        text: 'text-purple-900',
        badge: 'bg-purple-100 text-purple-800 border-purple-200',
        accent: 'bg-purple-500'
      };
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`group relative overflow-hidden rounded-lg border ${colors.border} ${colors.bg} p-3 sm:p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] h-20 sm:h-24`}>
      {/* Accent bar */}
      <div className={`absolute left-0 top-0 h-full w-1 ${colors.accent}`}></div>
      
      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="absolute right-2 top-2 rounded-full bg-white/80 p-1 sm:p-1.5 opacity-0 shadow-sm transition-all duration-200 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 cursor-pointer"
        title="Delete booking"
      >
        <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      <div className="space-y-1 sm:space-y-1.5 pr-6 sm:pr-8">{/* Time Range */}
        <div className="flex items-center space-x-1.5">
          <div className={`rounded-full ${colors.badge.split(' ')[0]} p-1`}>
            <svg className="h-2.5 w-2.5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className={`text-xs font-semibold ${colors.text} truncate`}>
            {formatTime(booking.time)} - {formatTime(endTime)}
          </div>
        </div>

        {/* Client Information */}
        <div className="min-w-0">
          <div className={`font-medium ${colors.text} text-xs leading-tight truncate`}>
            {client.name}
          </div>
        </div>

        {/* Call Type & Duration - Single line */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-xs font-medium ${colors.badge} truncate`}>
            {booking.type === 'onboarding' ? 'Onboarding' : 'Follow-up'}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {duration}min
          </span>
        </div>
      </div>

      {/* Subtle animation on hover */}
      <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
    </div>
  );
};
