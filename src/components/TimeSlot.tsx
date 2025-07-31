import React from 'react';

interface TimeSlotProps {
  time: string;
  available: boolean;
  onClick: () => void;
  callType: 'onboarding' | 'follow-up';
  isAvailableForDuration: boolean;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({
  time,
  available,
  onClick,
  callType,
  isAvailableForDuration
}) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const duration = callType === 'onboarding' ? 40 : 20;

  if (!available) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4 opacity-60 h-20 sm:h-24">
        <div className="flex items-center justify-between h-full">
          <div>
            <div className="text-xs sm:text-sm font-medium text-slate-500">{formatTime(time)}</div>
            <div className="text-xs text-slate-400">Unavailable</div>
          </div>
          <div className="rounded-full bg-slate-200 p-1">
            <svg className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (!isAvailableForDuration) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4 h-20 sm:h-24">
        <div className="flex items-center justify-between h-full">
          <div>
            <div className="text-xs sm:text-sm font-medium text-red-700">{formatTime(time)}</div>
            <div className="text-xs text-red-600">
              Conflicts with {duration}min {callType}
            </div>
          </div>
          <div className="rounded-full bg-red-100 p-1">
            <svg className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-lg border border-slate-200 bg-white p-3 sm:p-4 shadow-sm transition-all duration-200 hover:border-healthtick-300 hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-healthtick-500 focus:ring-offset-2 cursor-pointer h-20 sm:h-24"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-healthtick-50 to-healthtick-100 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
      
      <div className="relative flex items-center justify-between h-full">
        <div className="text-left">
          <div className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-healthtick-900">
            {formatTime(time)}
          </div>
          <div className="text-xs text-slate-600 group-hover:text-healthtick-700">
            Book {callType}
          </div>
          <div className="text-xs text-slate-500 group-hover:text-healthtick-600">
            {duration} minutes
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-healthtick-100 p-1.5 sm:p-2 transition-colors duration-200 group-hover:bg-healthtick-200">
            <svg className="h-3 w-3 sm:h-4 sm:w-4 text-healthtick-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Subtle hover indicator */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-healthtick-500 to-healthtick-600 transition-all duration-300 group-hover:w-full"></div>
    </button>
  );
};
