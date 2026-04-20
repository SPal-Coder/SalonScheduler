import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import SchedulerScreen from './src/screens/SchedulerScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
    <Provider store={store}>
      <SchedulerScreen />
    </Provider>
    </SafeAreaProvider>
  );
}