export interface Client {
  id: string;
  name: string;
  phone: string;
}

export interface Booking {
  id: string;
  clientId: string;
  type: 'onboarding' | 'follow-up';
  date: string; // YYYY-MM-DD format
  time: string; // HH:mm format
  isRecurring: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  booking?: Booking;
}
