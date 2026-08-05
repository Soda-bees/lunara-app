import { apiCall } from './httpClient';

// Fasting API Types
export interface FastingProtocol {
  _id: string;
  user: string;
  name: string;
  fastDurationMinutes: number;
  eatingWindowMinutes?: number;
  startTimePreference: 'morning' | 'evening' | 'custom';
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FastingSession {
  _id: string;
  user: string;
  protocol?: string | FastingProtocol | null;
  protocolName?: string;
  startTime: string;
  endTime?: string | null;
  status: 'active' | 'completed' | 'cancelled';
  targetDurationMinutes?: number;
  actualDurationMinutes?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FastingInsights {
  rangeDays: number;
  totalSessions: number;
  averageDurationMinutes: number | null;
  longestDurationMinutes: number | null;
  currentStreakDays: number;
  longestStreakDays: number;
}

export interface GetFastingProtocolsResponse {
  success: boolean;
  data: FastingProtocol[];
}

export interface GetFastingCurrentResponse {
  success: boolean;
  data: FastingSession | null;
}

export interface GetFastingHistoryResponse {
  success: boolean;
  data: FastingSession[];
}

export interface GetFastingInsightsResponse {
  success: boolean;
  data: FastingInsights;
}

export interface CreateFastingProtocolRequest {
  name: string;
  fastDurationMinutes: number;
  eatingWindowMinutes?: number;
  startTimePreference?: 'morning' | 'evening' | 'custom';
  isDefault?: boolean;
}

export type UpdateFastingProtocolRequest =
  Partial<CreateFastingProtocolRequest>;

export interface StartFastingSessionRequest {
  protocolId?: string;
  customDurationMinutes?: number;
  startTimeOverride?: string;
}

export interface EndFastingSessionRequest {
  endTimeOverride?: string;
  notes?: string;
}

// Fasting API Functions
export async function getFastingProtocols(): Promise<GetFastingProtocolsResponse> {
  return apiCall<GetFastingProtocolsResponse>('/fasting/protocols', {
    method: 'GET',
  });
}

export async function createFastingProtocol(
  data: CreateFastingProtocolRequest,
): Promise<{ success: boolean; data: FastingProtocol }> {
  return apiCall<{ success: boolean; data: FastingProtocol }>(
    '/fasting/protocols',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
}

export async function updateFastingProtocol(
  id: string,
  data: UpdateFastingProtocolRequest,
): Promise<{ success: boolean; data: FastingProtocol }> {
  return apiCall<{ success: boolean; data: FastingProtocol }>(
    `/fasting/protocols/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
}

export async function deleteFastingProtocolApi(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  return apiCall<{ success: boolean; message?: string }>(
    `/fasting/protocols/${id}`,
    {
      method: 'DELETE',
    },
  );
}

export async function getFastingCurrent(): Promise<GetFastingCurrentResponse> {
  return apiCall<GetFastingCurrentResponse>('/fasting/current', {
    method: 'GET',
  });
}

export async function startFastingSession(
  data: StartFastingSessionRequest,
): Promise<{ success: boolean; data: FastingSession }> {
  return apiCall<{ success: boolean; data: FastingSession }>('/fasting/start', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function endFastingSession(
  data: EndFastingSessionRequest,
): Promise<{ success: boolean; data: FastingSession }> {
  return apiCall<{ success: boolean; data: FastingSession }>('/fasting/end', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function cancelFastingSession(): Promise<{
  success: boolean;
  data: FastingSession;
}> {
  return apiCall<{ success: boolean; data: FastingSession }>(
    '/fasting/cancel',
    {
      method: 'POST',
    },
  );
}

export interface UpdateFastingSessionRequest {
  targetDurationMinutes: number;
}

export async function updateFastingSession(
  data: UpdateFastingSessionRequest,
): Promise<{ success: boolean; data: FastingSession }> {
  return apiCall<{ success: boolean; data: FastingSession }>(
    '/fasting/current',
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
}

export interface GetFastingHistoryParams {
  from?: string;
  to?: string;
  limit?: number;
}

export async function getFastingHistory(
  params?: GetFastingHistoryParams,
): Promise<GetFastingHistoryResponse> {
  const search = new URLSearchParams();
  if (params?.from) search.append('from', params.from);
  if (params?.to) search.append('to', params.to);
  if (params?.limit) search.append('limit', params.limit.toString());

  const qs = search.toString();
  return apiCall<GetFastingHistoryResponse>(
    `/fasting/history${qs ? `?${qs}` : ''}`,
    {
      method: 'GET',
    },
  );
}

export async function getFastingInsights(
  range: number = 7,
): Promise<GetFastingInsightsResponse> {
  const qs = new URLSearchParams({ range: String(range) }).toString();
  return apiCall<GetFastingInsightsResponse>(`/fasting/insights?${qs}`, {
    method: 'GET',
  });
}

