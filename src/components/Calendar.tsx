import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { format, getDay } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { TimeSlot } from './TimeSlot';
import { BookingCard } from './BookingCard';
import { ClientSelector } from './ClientSelector';
import { bookingService } from '../services/bookings';
import { DUMMY_CLIENTS } from '../data/clients';
import type { Booking, Client, TimeSlot as TimeSlotType } from '../types';

// Generate time slots from 10:30 AM to 7:30 PM (20-minute intervals)
const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  const startHour = 10;
  const startMinute = 30;
  const endHour = 19;
  const endMinute = 30;
  
  let hour = startHour;
  let minute = startMinute;
  
  while (hour < endHour || (hour === endHour && minute <= endMinute)) {
    slots.push(
      `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    );
    
    minute += 20;
    if (minute >= 60) {
      minute -= 60;
      hour += 1;
    }
  }
  
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

export const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [recurringBookings, setRecurringBookings] = useState<Booking[]>([]);
  const [showClientSelector, setShowClientSelector] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedCallType, setSelectedCallType] = useState<'onboarding' | 'follow-up'>('onboarding');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);

  const dateString = format(selectedDate, 'yyyy-MM-dd');

  // Load bookings when date changes
  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      try {
        const [dayBookings, recurring] = await Promise.all([
          bookingService.getBookingsForDate(dateString),
          bookingService.getRecurringBookings()
        ]);
        
        setBookings(dayBookings);
        setRecurringBookings(recurring);
      } catch (error) {
        console.error('Error loading bookings:', error);
        alert('Failed to load bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [dateString]);

  // Calculate all bookings for the selected date (including recurring)
  const allBookingsForDate = useMemo(() => {
    const dayOfWeek = getDay(selectedDate);
    const recurringForThisDay = recurringBookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return getDay(bookingDate) === dayOfWeek;
    });

    return [...bookings, ...recurringForThisDay];
  }, [bookings, recurringBookings, selectedDate]);

  // Generate time slots with availability
  const timeSlots = useMemo((): TimeSlotType[] => {
    return TIME_SLOTS.map(time => {
      const booking = allBookingsForDate.find(b => b.time === time);
      return {
        time,
        available: !booking,
        booking
      };
    });
  }, [allBookingsForDate]);

  // Check if a time slot conflicts with existing bookings
  const isTimeSlotAvailable = (time: string, duration: number): boolean => {
    const [hours, minutes] = time.split(':').map(Number);
    const slotStart = hours * 60 + minutes;
    const slotEnd = slotStart + duration;

    return !allBookingsForDate.some(booking => {
      const [bookingHours, bookingMinutes] = booking.time.split(':').map(Number);
      const bookingStart = bookingHours * 60 + bookingMinutes;
      const bookingDuration = booking.type === 'onboarding' ? 40 : 20;
      const bookingEnd = bookingStart + bookingDuration;

      // Check for overlap: slot starts before booking ends AND slot ends after booking starts
      return (slotStart < bookingEnd && slotEnd > bookingStart);
    });
  };

  // Enhanced time slot availability check with detailed conflict information
  const getSlotConflictInfo = (time: string, duration: number) => {
    const [hours, minutes] = time.split(':').map(Number);
    const slotStart = hours * 60 + minutes;
    const slotEnd = slotStart + duration;

    const conflicts = allBookingsForDate.filter(booking => {
      const [bookingHours, bookingMinutes] = booking.time.split(':').map(Number);
      const bookingStart = bookingHours * 60 + bookingMinutes;
      const bookingDuration = booking.type === 'onboarding' ? 40 : 20;
      const bookingEnd = bookingStart + bookingDuration;

      return (slotStart < bookingEnd && slotEnd > bookingStart);
    });

    return {
      hasConflict: conflicts.length > 0,
      conflicts: conflicts,
      isAvailable: conflicts.length === 0
    };
  };

  const handleTimeSlotClick = (time: string) => {
    const duration = selectedCallType === 'onboarding' ? 40 : 20;
    const conflictInfo = getSlotConflictInfo(time, duration);
    
    if (conflictInfo.hasConflict) {
      const conflictDetails = conflictInfo.conflicts.map(booking => {
        const client = DUMMY_CLIENTS.find(c => c.id === booking.clientId);
        return `${booking.time} - ${booking.type} with ${client?.name || 'Unknown Client'}`;
      }).join('\n');
      
      alert(`❌ Time Conflict Detected!\n\nThe selected ${selectedCallType} call (${duration} minutes) conflicts with:\n\n${conflictDetails}\n\nPlease choose a different time slot.`);
      return;
    }

    setSelectedTimeSlot(time);
    setShowClientSelector(true);
  };

  const handleClientSelect = async (client: Client) => {
    if (!selectedTimeSlot) return;

    // Final validation before creating booking
    const duration = selectedCallType === 'onboarding' ? 40 : 20;
    const conflictInfo = getSlotConflictInfo(selectedTimeSlot, duration);
    
    if (conflictInfo.hasConflict) {
      alert('❌ Booking conflict detected! This time slot is no longer available. Please refresh and try again.');
      setShowClientSelector(false);
      setSelectedTimeSlot('');
      setSelectedClient(null);
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        clientId: client.id,
        type: selectedCallType,
        date: dateString,
        time: selectedTimeSlot,
        isRecurring: selectedCallType === 'follow-up'
      };

      console.log('📅 Creating booking:', bookingData);
      const bookingId = await bookingService.createBooking(bookingData);
      console.log('✅ Booking created successfully with ID:', bookingId);
      
      // Reload bookings to reflect changes
      const [dayBookings, recurring] = await Promise.all([
        bookingService.getBookingsForDate(dateString),
        bookingService.getRecurringBookings()
      ]);
      
      setBookings(dayBookings);
      setRecurringBookings(recurring);
      
      setShowClientSelector(false);
      setSelectedTimeSlot('');
      setSelectedClient(null);
      
      // Success notification with details
      const timeStr = selectedTimeSlot;
      const clientName = client.name;
      const callTypeStr = selectedCallType === 'onboarding' ? 'Onboarding' : 'Follow-up';
      alert(`🎉 Booking Confirmed!\n\n${callTypeStr} call with ${clientName}\n${format(selectedDate, 'EEEE, MMMM d, yyyy')} at ${timeStr}\nDuration: ${duration} minutes`);
      
    } catch (error) {
      console.error('❌ Error creating booking:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create booking. Please try again.';
      alert(`❌ Booking Failed\n\n${errorMessage}\n\nPlease try again or contact support if the issue persists.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    const booking = allBookingsForDate.find(b => b.id === bookingId);
    const client = booking ? DUMMY_CLIENTS.find(c => c.id === booking.clientId) : null;
    
    const confirmMessage = booking && client 
      ? `🗑️ Delete Booking?\n\n${booking.type === 'onboarding' ? 'Onboarding' : 'Follow-up'} call with ${client.name}\n${format(selectedDate, 'EEEE, MMMM d')} at ${booking.time}\n\nThis action cannot be undone.`
      : '🗑️ Are you sure you want to delete this booking?\n\nThis action cannot be undone.';
    
    if (!confirm(confirmMessage)) return;

    setLoading(true);
    try {
      console.log('🗑️ Deleting booking:', bookingId);
      await bookingService.deleteBooking(bookingId);
      
      // Reload bookings to reflect changes
      const [dayBookings, recurring] = await Promise.all([
        bookingService.getBookingsForDate(dateString),
        bookingService.getRecurringBookings()
      ]);
      
      setBookings(dayBookings);
      setRecurringBookings(recurring);
      
      alert('✅ Booking deleted successfully!');
    } catch (error) {
      console.error('❌ Error deleting booking:', error);
      alert('❌ Failed to delete booking. Please try again or contact support if the issue persists.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
      {/* Controls */}
        <div className="mb-6 lg:mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Date Picker */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-healthtick-100 text-healthtick-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-900">Select Date</label>
                  <p className="text-xs text-slate-600">Choose your appointment date</p>
                </div>
              </div>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => date && setSelectedDate(date)}
                dateFormat="EEEE, MMMM d, yyyy"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-healthtick-500 focus:outline-none focus:ring-2 focus:ring-healthtick-500/20"
                calendarClassName="shadow-lg border-slate-200"
                popperClassName="z-50"
                popperPlacement="bottom-start"
              />
            </div>

            {/* Call Type Selector */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-healthtick-100 text-healthtick-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-900">Call Type</label>
                  <p className="text-xs text-slate-600">Select appointment duration</p>
                </div>
              </div>
              <div className="relative">
                <select
                  value={selectedCallType}
                  onChange={(e) => setSelectedCallType(e.target.value as 'onboarding' | 'follow-up')}
                  className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-3 pr-10 text-slate-900 shadow-sm transition focus:border-healthtick-500 focus:outline-none focus:ring-2 focus:ring-healthtick-500/20"
                >
                  <option value="onboarding">🚀 Onboarding Call (40 minutes)</option>
                  <option value="follow-up">📞 Follow-up Call (20 minutes)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Click on an available time slot to book a {selectedCallType} call
            </p>
          </div>

          <div className="p-4 sm:p-6">
            {loading && (
              <div className="flex items-center justify-center py-8 sm:py-12">
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 animate-spin rounded-full border-2 border-healthtick-600 border-t-transparent"></div>
                  <span className="text-sm sm:text-base text-slate-600">Loading appointments...</span>
                </div>
              </div>
            )}

            {/* Time Slots Grid - Improved responsive breakpoints */}
            <div className="grid grid-cols-1 gap-2 xs:grid-cols-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {timeSlots.map((slot) => (
                <div key={slot.time}>
                  {slot.booking ? (
                    <BookingCard
                      booking={slot.booking}
                      client={DUMMY_CLIENTS.find(c => c.id === slot.booking!.clientId)!}
                      onDelete={() => handleDeleteBooking(slot.booking!.id)}
                    />
                  ) : (
                    <TimeSlot
                      time={slot.time}
                      available={slot.available}
                      onClick={() => handleTimeSlotClick(slot.time)}
                      callType={selectedCallType}
                      isAvailableForDuration={isTimeSlotAvailable(slot.time, selectedCallType === 'onboarding' ? 40 : 20)}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {timeSlots.every(slot => slot.available) && !loading && (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
                <div className="mb-3 sm:mb-4 rounded-full bg-slate-100 p-2 sm:p-3">
                  <svg className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-medium text-slate-900">No appointments today</h3>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-600">Click on any time slot to schedule a call</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Client Selector Modal */}
      {showClientSelector && (
        <ClientSelector
          clients={DUMMY_CLIENTS}
          selectedClient={selectedClient}
          onClientSelect={handleClientSelect}
          onClose={() => {
            setShowClientSelector(false);
            setSelectedTimeSlot('');
            setSelectedClient(null);
          }}
        />
      )}
    </>
  );
};
