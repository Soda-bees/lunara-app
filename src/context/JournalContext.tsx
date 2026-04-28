import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { JournalType } from '../types/journal';
import {
  getJournals,
  createJournal,
  updateJournal as apiUpdateJournal,
  deleteJournal as apiDeleteJournal,
  getStoredToken,
} from '../services/api';

type CreateJournalPayload = {
  title: string;
  description: string;
};

type JournalContextValue = {
  journals: JournalType[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refreshJournals: () => Promise<void>;
  addJournal: (payload: CreateJournalPayload) => Promise<JournalType>;
  updateJournal: (
    id: string,
    payload: Partial<Pick<JournalType, 'title' | 'description'>>,
  ) => Promise<JournalType | null>;
  deleteJournal: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
};

const JournalContext = createContext<JournalContextValue | undefined>(
  undefined,
);

function toJournalType(j: {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  pin?: boolean;
}): JournalType {
  return {
    _id: j._id,
    title: j.title,
    description: j.description ?? '',
    createdAt: j.createdAt,
    updatedAt: j.updatedAt,
    pin: j.pin ?? false,
  };
}

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [journals, setJournals] = useState<JournalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const journalsRef = useRef<JournalType[]>([]);
  journalsRef.current = journals;

  const loadJournals = useCallback(async (isRefresh: boolean) => {
    const token = await getStoredToken();
    if (!token) {
      setJournals([]);
      setError(null);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const res = await getJournals();
      setJournals(res.data.map(toJournalType));
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Failed to load journals';
      setError(message);
      if (!isRefresh) {
        setJournals([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadJournals(false);
  }, [loadJournals]);

  const refreshJournals = useCallback(async () => {
    await loadJournals(true);
  }, [loadJournals]);

  const addJournal = useCallback(async (payload: CreateJournalPayload) => {
    const res = await createJournal({
      title: payload.title,
      description: payload.description,
    });
    const next = toJournalType(res.data);
    setJournals(prev => [next, ...prev]);
    return next;
  }, []);

  const updateJournal = useCallback(
    async (
      id: string,
      payload: Partial<Pick<JournalType, 'title' | 'description'>>,
    ) => {
      const body: { title?: string; description?: string } = {};
      if (payload.title !== undefined) body.title = payload.title;
      if (payload.description !== undefined) {
        body.description = payload.description;
      }
      const res = await apiUpdateJournal(id, body);
      const next = toJournalType(res.data);
      setJournals(prev => prev.map(item => (item._id === id ? next : item)));
      return next;
    },
    [],
  );

  const deleteJournal = useCallback(async (id: string) => {
    await apiDeleteJournal(id);
    setJournals(prev => prev.filter(item => item._id !== id));
  }, []);

  const togglePin = useCallback(async (id: string) => {
    const current = journalsRef.current.find(j => j._id === id);
    if (!current) return;
    const res = await apiUpdateJournal(id, { pin: !current.pin });
    const next = toJournalType(res.data);
    setJournals(prev => prev.map(item => (item._id === id ? next : item)));
  }, []);

  const value = useMemo<JournalContextValue>(
    () => ({
      journals,
      loading,
      refreshing,
      error,
      refreshJournals,
      addJournal,
      updateJournal,
      deleteJournal,
      togglePin,
    }),
    [
      journals,
      loading,
      refreshing,
      error,
      refreshJournals,
      addJournal,
      updateJournal,
      deleteJournal,
      togglePin,
    ],
  );

  return (
    <JournalContext.Provider value={value}>{children}</JournalContext.Provider>
  );
};

export const useJournal = (): JournalContextValue => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within JournalProvider');
  }
  return context;
};
