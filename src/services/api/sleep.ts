import { apiCall } from './httpClient';

// Sleep API Types
export interface Sleep {
  _id: string;
  user: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  duration: number;
  quality: number;
  notes?: string;
  cyclePhase?: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | null;
  pregnancyWeek?: number | null;
  trimester?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LogSleepRequest {
  date: string;
  bedTime: string;
  wakeTime: string;
  quality: number;
  notes?: string;
}

export interface SleepResponse {
  success: boolean;
  data: Sleep;
  message?: string;
}

export interface SleepsResponse {
  success: boolean;
  data: Sleep[];
  pagination?: {
    page: number;
    pages: number;
    limit: number;
    total: number;
  };
}

export interface SleepStatisticsResponse {
  success: boolean;
  data: {
    sevenDayGoal: {
      totalDays: number;
      daysWith8Plus: number;
      percentage: number;
      recentLogCount: number;
      days: Array<{
        date: string;
        hours: number | null;
      }>;
    };
    averages: {
      duration: number | null;
      quality: number | null;
    };
    totalLogs: number;
  };
}

export interface SleepPhasePattern {
  phase: string;
  avgDuration: number | null;
  avgQuality: number | null;
  count: number;
}

export interface SleepPatternsResponse {
  success: boolean;
  data: SleepPhasePattern[];
}

export interface SleepInsightsResponse {
  success: boolean;
  data: string[];
}

export interface UpdateSleepRequest {
  date?: string;
  bedTime?: string;
  wakeTime?: string;
  quality?: number;
  notes?: string;
}

// Sleep API Functions
export async function logSleep(data: LogSleepRequest): Promise<SleepResponse> {
  return apiCall<SleepResponse>('/sleep', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface SleepFilters {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/** Matches backend PERF-002 default window for sleep analytics. */
export const SLEEP_ANALYTICS_DEFAULT_DAYS = 90;

export type AnalyticsDateRange = {
  startDate: string;
  endDate: string;
};

/** YYYY-MM-DD range for the last `days` ending today (local calendar). */
export function getDefaultAnalyticsDateRange(
  days: number = SLEEP_ANALYTICS_DEFAULT_DAYS,
): AnalyticsDateRange {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  const toYmd = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  return { startDate: toYmd(start), endDate: toYmd(end) };
}

function appendAnalyticsRangeParams(
  params: URLSearchParams,
  range?: Partial<AnalyticsDateRange> | null,
) {
  if (range?.startDate) params.append('startDate', range.startDate);
  if (range?.endDate) params.append('endDate', range.endDate);
}

export async function getSleepLogs(
  filters?: SleepFilters,
): Promise<SleepsResponse> {
  const params = new URLSearchParams();
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const queryString = params.toString();
  return apiCall<SleepsResponse>(
    `/sleep${queryString ? `?${queryString}` : ''}`,
    {
      method: 'GET',
    },
  );
}

/** Sleep statistics — pass range or omit to use server 90-day default (PERF-002). */
export async function getSleepStatistics(
  range?: Partial<AnalyticsDateRange>,
): Promise<SleepStatisticsResponse> {
  const params = new URLSearchParams();
  appendAnalyticsRangeParams(params, range);
  const qs = params.toString();
  return apiCall<SleepStatisticsResponse>(
    `/sleep/statistics${qs ? `?${qs}` : ''}`,
    { method: 'GET' },
  );
}

/** Sleep patterns — pass range or omit to use server 90-day default (PERF-002). */
export async function getSleepPatternsByPhase(
  range?: Partial<AnalyticsDateRange>,
): Promise<SleepPatternsResponse> {
  const params = new URLSearchParams();
  appendAnalyticsRangeParams(params, range);
  const qs = params.toString();
  return apiCall<SleepPatternsResponse>(
    `/sleep/patterns${qs ? `?${qs}` : ''}`,
    { method: 'GET' },
  );
}

/** Sleep insights — pass range or omit to use server 90-day default (PERF-002). */
export async function getSleepInsights(
  range?: Partial<AnalyticsDateRange>,
): Promise<SleepInsightsResponse> {
  const params = new URLSearchParams();
  appendAnalyticsRangeParams(params, range);
  const qs = params.toString();
  return apiCall<SleepInsightsResponse>(
    `/sleep/insights${qs ? `?${qs}` : ''}`,
    { method: 'GET' },
  );
}

export async function getSleep(id: string): Promise<SleepResponse> {
  return apiCall<SleepResponse>(`/sleep/${id}`, {
    method: 'GET',
  });
}

export async function updateSleep(
  id: string,
  data: UpdateSleepRequest,
): Promise<SleepResponse> {
  return apiCall<SleepResponse>(`/sleep/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSleep(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  return apiCall<{ success: boolean; message?: string }>(`/sleep/${id}`, {
    method: 'DELETE',
  });
}

