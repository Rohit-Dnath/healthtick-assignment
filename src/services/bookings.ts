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
      console.log('Creating booking:', booking);
      const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), booking);
      console.log('✅ Booking created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to create booking: ${error.message}`);
      }
      throw new Error('Failed to create booking');
    }
  },

  // Get bookings for a specific date
  async getBookingsForDate(date: string): Promise<Booking[]> {
    try {
      const q = query(
        collection(db, BOOKINGS_COLLECTION),
        where('date', '==', date),
        where('isRecurring', '==', false)
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
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
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
  }
};
