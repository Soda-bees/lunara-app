import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './src/navigation/stackNavigation';
import AnimatedSplash from './src/components/SplashScreen/splashScreen';
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
      <CycleDataProvider>
        <SleepDataProvider>
          <DevErrorBoundaryProbe />
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
    </ErrorBoundary>
  );
}
