import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors } from '../../constants/colors';
import { fontSize } from '../../constants/fonts';
import { sizes } from '../../constants/sizes';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
  resetKey: number;
};

/**
 * Flip to `true` in __DEV__ to force a render throw and verify recovery UI (MOB-022 QA).
 * Keep `false` for normal development and all production builds.
 */
export const FORCE_ROOT_ERROR_BOUNDARY_TEST = false;

let hasForcedDevError = false;

/** Renders null; throws once when FORCE_ROOT_ERROR_BOUNDARY_TEST is enabled in __DEV__. */
export function DevErrorBoundaryProbe(): null {
  if (__DEV__ && FORCE_ROOT_ERROR_BOUNDARY_TEST && !hasForcedDevError) {
    hasForcedDevError = true;
    throw new Error('MOB-022 forced Error Boundary test');
  }
  return null;
}

function ErrorFallback({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry: () => void;
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>
          The app hit an unexpected error. You can try again without force-closing.
        </Text>
        {__DEV__ && error?.message ? (
          <Text style={styles.devDetail} numberOfLines={6}>
            {error.message}
          </Text>
        ) : null}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Try again"
          activeOpacity={0.8}
          onPress={onRetry}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Try again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/**
 * Root Error Boundary — catches render errors below and shows a recovery screen.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
    resetKey: 0,
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  handleRetry = (): void => {
    this.setState(prev => ({
      hasError: false,
      error: null,
      resetKey: prev.resetKey + 1,
    }));
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />
      );
    }

    return (
      <React.Fragment key={this.state.resetKey}>
        {this.props.children}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgLight || '#FFF9F9',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: sizes.screenWidth * 0.08,
    gap: 12,
  },
  title: {
    fontSize: fontSize.h4,
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
    textAlign: 'center',
  },
  message: {
    fontSize: fontSize.medium,
    color: colors.placeHolderGray || '#A0A0A0',
    textAlign: 'center',
    marginBottom: 8,
  },
  devDetail: {
    fontSize: fontSize.small,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 8,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    minWidth: sizes.screenWidth * 0.5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: fontSize.medium,
    fontFamily: 'Inter-SemiBold',
    color: colors.white,
  },
});
