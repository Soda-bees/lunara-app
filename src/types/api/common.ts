/**
 * Shared API response shapes from docs/api/openapi.yaml (DOC-001 / DOC-002).
 * Hand-maintained — keep in sync when OpenAPI common schemas change.
 */

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export interface ApiSuccessMessage {
  success: boolean;
  message?: string;
}

/** OpenAPI `PagePagination` */
export interface PagePagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/** OpenAPI `CursorPagination` (API-015) */
export interface CursorPagination {
  limit: number;
  nextCursor: string | null;
}
