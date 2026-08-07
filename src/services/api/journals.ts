import { apiCall } from './httpClient';
import type {
  CreateJournalRequest,
  DeleteJournalResponse,
  JournalListParams,
  JournalResponse,
  JournalsResponse,
  UpdateJournalRequest,
} from '../../types/api';

export type {
  CreateJournalRequest,
  DeleteJournalResponse,
  Journal,
  JournalListParams,
  JournalResponse,
  JournalsCursorResponse,
  JournalsResponse,
  UpdateJournalRequest,
} from '../../types/api';

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
): Promise<DeleteJournalResponse> {
  return apiCall<DeleteJournalResponse>(`/journals/${id}`, {
    method: 'DELETE',
  });
}
