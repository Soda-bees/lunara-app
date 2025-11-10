import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './src/navigation/stackNavigation';
import AnimatedSplash from './src/components/SplashScreen/splashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <AnimatedSplash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}
