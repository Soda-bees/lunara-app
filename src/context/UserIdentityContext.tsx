import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DeviceEventEmitter } from 'react-native';
import {
  DISPLAY_NAME_CLEARED_EVENT,
  clearStoredDisplayName,
  getStoredDisplayName,
  persistDisplayName,
} from '../utils/displayNameStorage';

type UserIdentityContextValue = {
  displayName: string;
  setDisplayName: (name: string) => Promise<void>;
  clearDisplayName: () => Promise<void>;
};

const UserIdentityContext = createContext<UserIdentityContextValue>({
  displayName: '',
  setDisplayName: async () => {},
  clearDisplayName: async () => {},
});

export function UserIdentityProvider({ children }: { children: ReactNode }) {
  const [displayName, setDisplayNameState] = useState('');

  useEffect(() => {
    let cancelled = false;
    void getStoredDisplayName().then(name => {
      if (!cancelled && name) {
        setDisplayNameState(name);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      DISPLAY_NAME_CLEARED_EVENT,
      () => {
        setDisplayNameState('');
      },
    );
    const expired = DeviceEventEmitter.addListener('session_expired', () => {
      setDisplayNameState('');
    });
    return () => {
      sub.remove();
      expired.remove();
    };
  }, []);

  const setDisplayName = useCallback(async (name: string) => {
    const trimmed = name.trim();
    setDisplayNameState(trimmed);
    await persistDisplayName(trimmed);
  }, []);

  const clearDisplayName = useCallback(async () => {
    setDisplayNameState('');
    await clearStoredDisplayName();
  }, []);

  const value = useMemo(
    () => ({
      displayName,
      setDisplayName,
      clearDisplayName,
    }),
    [displayName, setDisplayName, clearDisplayName],
  );

  return (
    <UserIdentityContext.Provider value={value}>
      {children}
    </UserIdentityContext.Provider>
  );
}

export function useUserIdentity(): UserIdentityContextValue {
  return useContext(UserIdentityContext);
}
