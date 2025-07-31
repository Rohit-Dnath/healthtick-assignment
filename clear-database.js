/**
 * Clear Database Script
 * This script will delete all bookings from the Firestore database
 * Usage: node clear-database.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2yoCTEdSz2wLmb5AvULl67tjIeOc9Osk",
  authDomain: "healthtick-calendar-1.firebaseapp.com",
  projectId: "healthtick-calendar-1",
  storageBucket: "healthtick-calendar-1.firebasestorage.app",
  messagingSenderId: "113480018782",
  appId: "1:113480018782:web:90f161d8d2130cb0fcbdcf",
  measurementId: "G-76SLTSQT4Z"
};

async function clearDatabase() {
  console.log('🗑️ HealthTick Calendar - Database Cleanup');
  console.log('========================================');
  
  try {
    // Initialize Firebase
    console.log('📋 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('✅ Firebase initialized');

    // Get all bookings
    console.log('🔍 Fetching all bookings...');
    const bookingsCollection = collection(db, 'bookings');
    const snapshot = await getDocs(bookingsCollection);
    
    const totalBookings = snapshot.size;
    console.log(`📊 Found ${totalBookings} bookings to delete`);
    
    if (totalBookings === 0) {
      console.log('✅ Database is already empty!');
      return;
    }

    // Confirm deletion
    console.log('⚠️  This will permanently delete ALL bookings!');
    
    // Delete all bookings
    console.log('🗑️ Deleting all bookings...');
    const deletePromises = [];
    
    snapshot.forEach((document) => {
      deletePromises.push(deleteDoc(doc(db, 'bookings', document.id)));
    });
    
    await Promise.all(deletePromises);
    
    console.log('✅ All bookings deleted successfully!');
    console.log(`🎉 Cleared ${totalBookings} records from the database`);
    console.log('📝 Your HealthTick Calendar database is now empty and ready for fresh data.');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
}

// Run the cleanup
clearDatabase()
  .then(() => {
    console.log('\n🎉 Database cleanup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Database cleanup failed:', error);
    process.exit(1);
  });
