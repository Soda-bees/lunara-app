import { apiCall } from './httpClient';

// Journal API Types
export interface Journal {
  _id: string;
  user?: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  pin?: boolean;
}

export interface JournalsResponse {
  success: boolean;
  data: Journal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface JournalResponse {
  success: boolean;
  data: Journal;
  message?: string;
}

export interface CreateJournalRequest {
  title: string;
  description?: string;
}

export interface UpdateJournalRequest {
  title?: string;
  description?: string;
  pin?: boolean;
}

export interface JournalListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getJournals(
  params?: JournalListParams,
): Promise<JournalsResponse> {
  const search = new URLSearchParams();
  if (params?.page != null) search.append('page', String(params.page));
  if (params?.limit != null) search.append('limit', String(params.limit));
  if (params?.search) search.append('search', params.search);

  const qs = search.toString();
  return apiCall<JournalsResponse>(`/journals${qs ? `?${qs}` : ''}`, {
    method: 'GET',
  });
}

export async function getJournal(id: string): Promise<JournalResponse> {
  return apiCall<JournalResponse>(`/journals/${id}`, {
    method: 'GET',
  });
}

export async function createJournal(
  data: CreateJournalRequest,
): Promise<JournalResponse> {
  return apiCall<JournalResponse>('/journals', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateJournal(
  id: string,
  data: UpdateJournalRequest,
): Promise<JournalResponse> {
  return apiCall<JournalResponse>(`/journals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteJournal(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  return apiCall<{ success: boolean; message?: string }>(`/journals/${id}`, {
    method: 'DELETE',
  });
}
