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

      // Check for overlap
      return (slotStart < bookingEnd && slotEnd > bookingStart);
    });
  };

  const handleTimeSlotClick = (time: string) => {
    const duration = selectedCallType === 'onboarding' ? 40 : 20;
    
    if (!isTimeSlotAvailable(time, duration)) {
      alert(`This time slot conflicts with existing bookings. ${selectedCallType === 'onboarding' ? 'Onboarding calls' : 'Follow-up calls'} require ${duration} minutes.`);
      return;
    }

    setSelectedTimeSlot(time);
    setShowClientSelector(true);
  };

  const handleClientSelect = async (client: Client) => {
    if (!selectedTimeSlot) return;

    setLoading(true);
    try {
      const bookingData = {
        clientId: client.id,
        type: selectedCallType,
        date: dateString,
        time: selectedTimeSlot,
        isRecurring: selectedCallType === 'follow-up'
      };

      console.log('Creating booking with data:', bookingData);
      await bookingService.createBooking(bookingData);
      
      // Reload bookings
      const [dayBookings, recurring] = await Promise.all([
        bookingService.getBookingsForDate(dateString),
        bookingService.getRecurringBookings()
      ]);
      
      setBookings(dayBookings);
      setRecurringBookings(recurring);
      
      setShowClientSelector(false);
      setSelectedTimeSlot('');
      setSelectedClient(null);
      
      alert('Booking created successfully!');
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create booking. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    setLoading(true);
    try {
      await bookingService.deleteBooking(bookingId);
      
      // Reload bookings
      const [dayBookings, recurring] = await Promise.all([
        bookingService.getBookingsForDate(dateString),
        bookingService.getRecurringBookings()
      ]);
      
      setBookings(dayBookings);
      setRecurringBookings(recurring);
      
      alert('Booking deleted successfully!');
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                HealthTick Calendar
              </h1>
              <p className="mt-2 text-lg text-slate-600">
                Manage your client appointments with ease
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-slate-500">Today</div>
                <div className="text-lg font-semibold text-slate-900">
                  {format(new Date(), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 rounded-xl border border-white/20 bg-white/60 backdrop-blur-sm p-6 shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Date Picker */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Select Date</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => date && setSelectedDate(date)}
                    dateFormat="EEEE, MMMM d, yyyy"
                    className="mt-1 block rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Call Type Selector */}
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Call Type</label>
                <select
                  value={selectedCallType}
                  onChange={(e) => setSelectedCallType(e.target.value as 'onboarding' | 'follow-up')}
                  className="mt-1 block rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="onboarding">Onboarding (40 min)</option>
                  <option value="follow-up">Follow-up (20 min)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="rounded-xl border border-white/20 bg-white/60 backdrop-blur-sm shadow-lg">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-slate-900">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Click on an available time slot to book a {selectedCallType} call
            </p>
          </div>

          <div className="p-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                  <span className="text-slate-600">Loading appointments...</span>
                </div>
              </div>
            )}

            {/* Time Slots Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-slate-100 p-3">
                  <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900">No appointments today</h3>
                <p className="mt-2 text-slate-600">Click on any time slot to schedule a call</p>
              </div>
            )}
          </div>
        </div>
      </div>

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
    </div>
  );
};
