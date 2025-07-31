import React from 'react';
import { format } from 'date-fns';
import { HealthTickLogo } from './HealthTickLogo';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6">
          {/* Logo and Title Section */}
          <div className="flex items-center space-x-3">
            <HealthTickLogo size="lg" className="shrink-0" />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                HealthTick Calendar
              </h1>
              <p className="text-sm text-slate-600 sm:text-base lg:text-lg">
                Manage your client appointments with ease
              </p>
            </div>
          </div>

          {/* Today's Date */}
          <div className="flex items-center space-x-3 text-center sm:text-right">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-healthtick-100 text-healthtick-600 sm:h-12 sm:w-12">
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 sm:text-sm">Today</div>
              <div className="text-sm font-semibold text-slate-900 sm:text-lg">
                {format(new Date(), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};