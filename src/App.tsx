import { useEffect } from 'react';
import { Header } from './components/Header';
import { Calendar } from './components/Calendar';
import { testFirebaseConnection } from './services/firebase';
import './styles/index.css';

function App() {
  useEffect(() => {
    // Test Firebase connection when app loads
    testFirebaseConnection().then((isConnected) => {
      if (isConnected) {
        console.log('🎉 App successfully connected to Firebase!');
      } else {
        console.warn('⚠️ App failed to connect to Firebase. Check your configuration.');
      }
    });
  }, []);

  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-50 via-healthtick-50/20 to-healthtick-100/30">
      <Header />
      <Calendar />
    </div>
  );
}

export default App;
