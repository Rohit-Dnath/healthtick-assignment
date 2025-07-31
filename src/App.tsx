import { useEffect } from 'react';
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
    <div className="App">
      <Calendar />
    </div>
  );
}

export default App;
