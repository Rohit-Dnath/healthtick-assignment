import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Calendar } from './components/Calendar';
import { testFirebaseConnection } from './services/firebase';
import './styles/index.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firebaseStatus, setFirebaseStatus] = useState<string>('Checking...');

  useEffect(() => {
    console.log('🚀 App starting...');
    console.log('Environment check:', {
      NODE_ENV: import.meta.env.MODE,
      VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Not set',
      VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Set' : 'Not set'
    });
    
    // Test Firebase connection when app loads
    testFirebaseConnection().then((isConnected) => {
      if (isConnected) {
        console.log('🎉 App successfully connected to Firebase!');
        setFirebaseStatus('Connected');
      } else {
        console.warn('⚠️ App failed to connect to Firebase. Check your configuration.');
        setFirebaseStatus('Failed to connect');
      }
      setIsLoading(false);
    }).catch((err) => {
      console.error('❌ Error during app initialization:', err);
      setError(err.message);
      setFirebaseStatus('Error: ' + err.message);
      setIsLoading(false);
    });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Something went wrong</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="text-sm text-gray-600 mb-4">
            <p>Firebase Status: {firebaseStatus}</p>
            <p>Environment: {import.meta.env.MODE}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-healthtick-50/20 to-healthtick-100/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthtick-500 mx-auto mb-4"></div>
          <p className="text-healthtick-600">Loading HealthTick Calendar...</p>
          <p className="text-sm text-gray-500 mt-2">Firebase: {firebaseStatus}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-50 via-healthtick-50/20 to-healthtick-100/30">
      <Header />
      <Calendar />
    </div>
  );
}

export default App;
