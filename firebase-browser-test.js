// Simple Firebase test - open this in browser console
// Copy and paste this into your browser console while on localhost:5173

console.log('🧪 Testing Firebase connection...');

// Test creating a simple document
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './src/services/firebase.js';

async function testFirebase() {
  try {
    console.log('📝 Creating test document...');
    
    // Create a test document
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Hello from HealthTick Calendar'
    };
    
    const docRef = await addDoc(collection(db, 'test'), testData);
    console.log('✅ Test document created with ID:', docRef.id);
    
    // Read it back
    console.log('📖 Reading test documents...');
    const querySnapshot = await getDocs(collection(db, 'test'));
    console.log('✅ Found', querySnapshot.size, 'test documents');
    
    // Clean up
    await deleteDoc(doc(db, 'test', docRef.id));
    console.log('✅ Test document deleted');
    
    console.log('🎉 Firebase test completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    return false;
  }
}

// Run the test
testFirebase();
