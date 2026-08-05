import { apiCall } from './httpClient';

// --- Rituals (catalog + preferences + optional daily checkmarks) ---
export type RitualSection = 'morning' | 'midday' | 'evening';
export type RitualInteraction = 'check' | 'action';

export interface RitualDefinitionDto {
  _id: string;
  keyId: string;
  title: string;
  description: string;
  /** True when user-authored (not seeded catalog) */
  isCustom?: boolean;
  /** Catalog hint: which cycle phases this often fits */
  phaseFitLabel?: string;
  /** Expandable copy: phase fit rationale (wellness framing) */
  phaseFitWhy?: string;
  tag: string;
  defaultSection: RitualSection;
  anchor: string;
  interaction: RitualInteraction;
  navigationTarget?: string | null;
  actionParams?: Record<string, unknown>;
  isCore: boolean;
  defaultSortOrder?: number;
  isActive: boolean;
}

export interface UserRitualPreferenceDto {
  ritualKey: string;
  section: RitualSection;
  userNote: string;
  sortIndex: number;
  enabled: boolean;
}

export interface RitualDefinitionsResponse {
  success: boolean;
  data: RitualDefinitionDto[];
}

export interface CreateCustomRitualRequest {
  title: string;
  description?: string;
  defaultSection: RitualSection;
}

export interface CreateCustomRitualResponse {
  success: boolean;
  data?: RitualDefinitionDto;
  message?: string;
}

export interface RitualPreferencesResponse {
  success: boolean;
  data: UserRitualPreferenceDto[];
}

export interface RitualCompletionsResponse {
  success: boolean;
  data: Record<string, boolean>;
}

export async function getRitualDefinitions(): Promise<RitualDefinitionsResponse> {
  return apiCall<RitualDefinitionsResponse>('/rituals/definitions', {
    method: 'GET',
  });
}

export async function postCustomRitual(
  body: CreateCustomRitualRequest,
): Promise<CreateCustomRitualResponse> {
  return apiCall<CreateCustomRitualResponse>('/rituals/custom', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function deleteCustomRitual(
  keyId: string,
): Promise<{ success: boolean; message?: string }> {
  return apiCall(`/rituals/custom/${encodeURIComponent(keyId)}`, {
    method: 'DELETE',
  });
}

export async function getRitualPreferences(): Promise<RitualPreferencesResponse> {
  return apiCall<RitualPreferencesResponse>('/rituals/preferences', {
    method: 'GET',
  });
}

export async function putRitualPreferences(
  preferences: UserRitualPreferenceDto[],
): Promise<RitualPreferencesResponse> {
  return apiCall<RitualPreferencesResponse>('/rituals/preferences', {
    method: 'PUT',
    body: JSON.stringify({ preferences }),
  });
}

export async function getRitualCompletions(
  date: string,
): Promise<RitualCompletionsResponse> {
  const qs = new URLSearchParams({ date });
  return apiCall<RitualCompletionsResponse>(
    `/rituals/completions?${qs.toString()}`,
    { method: 'GET' },
  );
}

export async function postRitualDayToggle(body: {
  date: string;
  ritualKey: string;
  completed: boolean;
}): Promise<{ success: boolean; data?: { date: string; ritualKey: string; completed: boolean } }> {
  return apiCall('/rituals/day-toggle', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
