import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainStack from './src/navigation/stackNavigation';
import AnimatedSplash from './src/components/SplashScreen/splashScreen';
import OfflineBanner from './src/components/OfflineBanner';
import { CycleDataProvider } from './src/context/CycleDataContext';
import { SleepDataProvider } from './src/context/SleepDataContext';
import ErrorBoundary, {
  DevErrorBoundaryProbe,
} from './src/components/ErrorBoundary';
import type { SessionRoute } from './src/utils/resolveSessionRoute';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [initialSessionRoute, setInitialSessionRoute] =
    useState<SessionRoute>(null);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <CycleDataProvider>
          <SleepDataProvider>
            <DevErrorBoundaryProbe />
            <OfflineBanner />
            {showSplash ? (
              <AnimatedSplash
                onFinish={route => {
                  setInitialSessionRoute(route);
                  setShowSplash(false);
                }}
              />
            ) : (
              <NavigationContainer>
                <MainStack initialSessionRoute={initialSessionRoute} />
              </NavigationContainer>
            )}
          </SleepDataProvider>
        </CycleDataProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
