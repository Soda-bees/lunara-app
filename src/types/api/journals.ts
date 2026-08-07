/**
 * Journal schemas aligned with docs/api/openapi.yaml (DOC-001 / DOC-002).
 * Hand-maintained — keep in sync when OpenAPI Journal schemas change.
 */

import type { ApiSuccessMessage, CursorPagination, PagePagination } from './common';

/** OpenAPI `Journal` */
export interface Journal {
  _id: string;
  user?: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  pin?: boolean;
}

/** OpenAPI list success with page pagination */
export interface JournalsResponse {
  success: boolean;
  data: Journal[];
  pagination: PagePagination;
}

/** OpenAPI list success with cursor pagination */
export interface JournalsCursorResponse {
  success: boolean;
  data: Journal[];
  pagination: CursorPagination;
}

export interface JournalResponse {
  success: boolean;
  data: Journal;
  message?: string;
}

/** Create body — OpenAPI `JournalWrite` with required title */
export interface CreateJournalRequest {
  title: string;
  description?: string;
  pin?: boolean;
}

/** Update body — partial OpenAPI `JournalWrite` */
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

export type DeleteJournalResponse = ApiSuccessMessage;
