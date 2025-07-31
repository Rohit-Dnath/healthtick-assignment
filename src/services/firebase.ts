import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA2yoCTEdSz2wLmb5AvULl67tjIeOc9Osk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "healthtick-calendar-1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "healthtick-calendar-1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "healthtick-calendar-1.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "113480018782",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:113480018782:web:90f161d8d2130cb0fcbdcf",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-76SLTSQT4Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional - only if you want to use Firebase Analytics)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Firebase connection test function
export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testing Firebase connection...');
    console.log('📋 Configuration:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      apiKey: firebaseConfig.apiKey ? '***' + firebaseConfig.apiKey.slice(-4) : 'Not set'
    });
    
    // Test Firestore connection by attempting to read a collection
    const { collection, getDocs } = await import('firebase/firestore');
    const testCollection = collection(db, 'connection-test');
    await getDocs(testCollection);
    
    console.log('✅ Firebase connection successful!');
    console.log('✅ Firestore database accessible');
    return true;
  } catch (error: unknown) {
    console.error('❌ Firebase connection failed:', error);
    const errorInfo = error instanceof Error ? {
      message: error.message,
      name: error.name
    } : { message: 'Unknown error occurred' };
    console.error('❌ Error details:', errorInfo);
    return false;
  }
};

export default app;
