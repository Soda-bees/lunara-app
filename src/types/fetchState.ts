export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  loadingBackground: boolean;
  error: string | null;
  lastFetchedAt: number | null;
}

// Shared staleness rule (5 minutes)
export const STALE_TIME_MS = 5 * 60 * 1000;

