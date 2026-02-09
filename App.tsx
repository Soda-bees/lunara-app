import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './src/navigation/stackNavigation';
import AnimatedSplash from './src/components/SplashScreen/splashScreen';
import { CycleDataProvider } from './src/context/CycleDataContext';
import { SleepDataProvider } from './src/context/SleepDataContext';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <CycleDataProvider>
      <SleepDataProvider>
        {showSplash ? (
          <AnimatedSplash onFinish={() => setShowSplash(false)} />
        ) : (
          <NavigationContainer>
            <MainStack />
          </NavigationContainer>
        )}
      </SleepDataProvider>
    </CycleDataProvider>
  );
}
