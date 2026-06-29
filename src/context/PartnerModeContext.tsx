import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getMe,
  getStoredSessionType,
  type SessionType,
} from '../services/api';

type PartnerModeContextValue = {
  isPartnerMode: boolean;
  sessionType: SessionType;
  primaryUserName: string;
  refreshSessionType: () => Promise<void>;
};

const PartnerModeContext = createContext<PartnerModeContextValue>({
  isPartnerMode: false,
  sessionType: 'owner',
  primaryUserName: '',
  refreshSessionType: async () => {},
});

export function PartnerModeProvider({ children }: { children: ReactNode }) {
  const [sessionType, setSessionType] = useState<SessionType>('owner');
  const [primaryUserName, setPrimaryUserName] = useState('');

  const refreshSessionType = useCallback(async () => {
    try {
      const storedType = await getStoredSessionType();
      setSessionType(storedType);

      if (storedType === 'partner') {
        const me = await getMe();
        setPrimaryUserName(me.user?.fullName || 'Partner');
        if (me.sessionType) {
          setSessionType(me.sessionType);
        }
      } else {
        setPrimaryUserName('');
      }
    } catch {
      const storedType = await getStoredSessionType();
      setSessionType(storedType);
    }
  }, []);

  useEffect(() => {
    refreshSessionType();
  }, [refreshSessionType]);

  const value = useMemo(
    () => ({
      isPartnerMode: sessionType === 'partner',
      sessionType,
      primaryUserName,
      refreshSessionType,
    }),
    [sessionType, primaryUserName, refreshSessionType],
  );

  return (
    <PartnerModeContext.Provider value={value}>
      {children}
    </PartnerModeContext.Provider>
  );
}

export function usePartnerMode() {
  return useContext(PartnerModeContext);
}
