/**
 * Firebase Connection Test Script
 * Run this script to test if Firebase is properly configured
 * Usage: node test-firebase.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

async function testFirebaseConnection() {
  console.log('🔥 Firebase Connection Test');
  console.log('==========================');
  
  try {
    // Initialize Firebase
    console.log('📋 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized');

    // Initialize Firestore
    console.log('📊 Connecting to Firestore...');
    const db = getFirestore(app);
    console.log('✅ Firestore initialized');

    // Test reading from Firestore
    console.log('🔍 Testing Firestore read access...');
    const testCollection = collection(db, 'bookings');
    const snapshot = await getDocs(testCollection);
    
    console.log('✅ Firestore read test successful!');
    console.log(`📊 Found ${snapshot.size} documents in 'bookings' collection`);
    
    // Display project info
    console.log('\n📋 Project Information:');
    console.log(`   Project ID: ${firebaseConfig.projectId}`);
    console.log(`   Auth Domain: ${firebaseConfig.authDomain}`);
    console.log(`   Storage Bucket: ${firebaseConfig.storageBucket}`);
    
    console.log('\n🎉 Firebase connection test PASSED!');
    console.log('Your HealthTick Calendar is ready to use Firebase.');
    
    return true;
  } catch (error) {
    console.error('\n❌ Firebase connection test FAILED!');
    console.error('Error details:', error.message);
    console.error('\nPossible solutions:');
    console.error('1. Check if Firestore database is created in Firebase Console');
    console.error('2. Verify Firestore rules allow read/write access');
    console.error('3. Ensure your Firebase configuration is correct');
    console.error('4. Check your internet connection');
    
    return false;
  }
}

// Run the test
testFirebaseConnection()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
