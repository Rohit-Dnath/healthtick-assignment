import { collection, addDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import type { Booking } from '../types';

const BOOKINGS_COLLECTION = 'bookings';

export const bookingService = {
  // Test Firebase connection
  async testConnection(): Promise<boolean> {
    try {
      // Try to read from the bookings collection
      const q = query(collection(db, BOOKINGS_COLLECTION));
      await getDocs(q);
      console.log('✅ Firebase connection successful!');
      return true;
    } catch (error) {
      console.error('❌ Firebase connection failed:', error);
      return false;
    }
  },

  // Test booking creation (for debugging)
  async testBookingCreation(): Promise<void> {
    try {
      const testBooking = {
        clientId: 'client-1',
        type: 'onboarding' as const,
        date: '2025-08-01',
        time: '10:30',
        isRecurring: false
      };
      
      console.log('Testing booking creation with:', testBooking);
      const id = await this.createBooking(testBooking);
      console.log('✅ Test booking created successfully with ID:', id);
      
      // Clean up test booking
      await this.deleteBooking(id);
      console.log('✅ Test booking cleaned up');
    } catch (error) {
      console.error('❌ Test booking failed:', error);
      throw error;
    }
  },

  // Create a new booking
  async createBooking(booking: Omit<Booking, 'id'>): Promise<string> {
    try {
      // Validate booking data
      if (!booking.clientId || !booking.type || !booking.date || !booking.time) {
        throw new Error('Missing required booking information');
      }

      // Validate call type
      if (booking.type !== 'onboarding' && booking.type !== 'follow-up') {
        throw new Error('Invalid call type. Must be "onboarding" or "follow-up"');
      }

      // Validate time format (HH:mm)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(booking.time)) {
        throw new Error('Invalid time format. Expected HH:mm');
      }

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(booking.date)) {
        throw new Error('Invalid date format. Expected YYYY-MM-DD');
      }

      console.log('📅 Creating booking:', booking);
      const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
        ...booking,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log('✅ Booking created successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating booking:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to create booking: ${error.message}`);
      }
      throw new Error('Failed to create booking due to an unknown error');
    }
  },

  // Get bookings for a specific date
  async getBookingsForDate(date: string): Promise<Booking[]> {
    try {
      console.log('📊 Fetching bookings for date:', date);
      
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        throw new Error('Invalid date format. Expected YYYY-MM-DD');
      }

      const q = query(
        collection(db, BOOKINGS_COLLECTION),
        where('date', '==', date),
        where('isRecurring', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      const bookings: Booking[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        bookings.push({
          id: doc.id,
          clientId: data.clientId,
          type: data.type,
          date: data.date,
          time: data.time,
          isRecurring: data.isRecurring || false
        });
      });
      
      // Sort by time on the client side
      const sortedBookings = bookings.sort((a, b) => a.time.localeCompare(b.time));
      console.log(`✅ Found ${sortedBookings.length} bookings for ${date}`);
      return sortedBookings;
    } catch (error) {
      console.error('❌ Error fetching bookings for date:', date, error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch bookings: ${error.message}`);
      }
      throw new Error('Failed to fetch bookings due to an unknown error');
    }
  },

  // Get all recurring bookings
  async getRecurringBookings(): Promise<Booking[]> {
    try {
      const q = query(
        collection(db, BOOKINGS_COLLECTION),
        where('isRecurring', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const bookings: Booking[] = [];
      
      querySnapshot.forEach((doc) => {
        bookings.push({
          id: doc.id,
          ...doc.data()
        } as Booking);
      });
      
      // Sort by time on the client side
      return bookings.sort((a, b) => a.time.localeCompare(b.time));
    } catch (error) {
      console.error('Error fetching recurring bookings:', error);
      throw new Error('Failed to fetch recurring bookings');
    }
  },

  // Delete a booking
  async deleteBooking(bookingId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, BOOKINGS_COLLECTION, bookingId));
      console.log('✅ Booking deleted:', bookingId);
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw new Error('Failed to delete booking');
    }
  },

  // Delete all bookings from the database
  async deleteAllBookings(): Promise<void> {
    try {
      console.log('🗑️ Starting to delete all bookings...');
      
      // Get all bookings
      const q = query(collection(db, BOOKINGS_COLLECTION));
      const querySnapshot = await getDocs(q);
      
      const deletePromises: Promise<void>[] = [];
      
      querySnapshot.forEach((document) => {
        deletePromises.push(deleteDoc(doc(db, BOOKINGS_COLLECTION, document.id)));
      });
      
      // Wait for all deletions to complete
      await Promise.all(deletePromises);
      
      console.log(`✅ Successfully deleted ${deletePromises.length} bookings`);
      console.log('🎉 Database cleared successfully!');
    } catch (error) {
      console.error('❌ Error deleting all bookings:', error);
      throw new Error('Failed to delete all bookings');
    }
  }
};
