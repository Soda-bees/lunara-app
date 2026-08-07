import { apiCall } from './httpClient';

export interface PartnerStatusResponse {
  success: boolean;
  partnerSessionActive: boolean;
  partnerConnectedAt: string | null;
  codeExpiresAt: string | null;
  hasActiveCode: boolean;
}

export interface GeneratePartnerCodeResponse {
  success: boolean;
  code: string;
  expiresAt: string;
}

export interface ConnectPartnerCodeResponse {
  success: boolean;
  token: string;
  primaryUserName?: string;
  message?: string;
}

export async function generatePartnerCode(): Promise<GeneratePartnerCodeResponse> {
  return apiCall<GeneratePartnerCodeResponse>('/partner/code/generate', {
    method: 'POST',
  });
}

export async function getPartnerStatus(): Promise<PartnerStatusResponse> {
  // Canonical partner connection status (API-011 / API-012). Do not use /auth/me for this.
  return apiCall<PartnerStatusResponse>('/partner/status', {
    method: 'GET',
  });
}

export async function disconnectPartner(): Promise<{
  success: boolean;
  message?: string;
}> {
  return apiCall<{ success: boolean; message?: string }>('/partner/disconnect', {
    method: 'POST',
  });
}

export async function connectWithPartnerCode(
  code: string,
): Promise<ConnectPartnerCodeResponse> {
  return apiCall<ConnectPartnerCodeResponse>('/partner/connect', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

export async function partnerLogout(): Promise<{
  success: boolean;
  message?: string;
}> {
  return apiCall<{ success: boolean; message?: string }>('/partner/logout', {
    method: 'POST',
  });
}
