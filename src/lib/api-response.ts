/**
 * Shared API error types and a typed response wrapper.
 * Keep this file free of any Prisma or DB imports — it is safe to import
 * from both server components and client components (via Server Actions).
 */

// ---------------------------------------------------------------------------
// Error codes
// ---------------------------------------------------------------------------

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "INVALID_CREDENTIALS"
  | "FORBIDDEN"
  | "CONFLICT"
  | "RATE_LIMIT"
  | "INTERNAL_ERROR";

// ---------------------------------------------------------------------------
// Response envelope
// ---------------------------------------------------------------------------

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    fieldErrors?: Record<string, string[]>;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ---------------------------------------------------------------------------
// Pagination metadata
// ---------------------------------------------------------------------------

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  pageCount: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationMeta;
}

// ---------------------------------------------------------------------------
// Factory helpers
// ---------------------------------------------------------------------------

export function ok<T>(data: T): ApiSuccess<T> {
  return { success: true, data };
}

export function fail(
  code: ApiErrorCode,
  message: string,
  fieldErrors?: Record<string, string[]>
): ApiError {
  return { success: false, error: { code, message, fieldErrors } };
}

export function paginate<T>(
  items: T[],
  total: number,
  page: number,
  perPage: number
): PaginatedResult<T> {
  return {
    items,
    pagination: {
      page,
      perPage,
      total,
      pageCount: Math.ceil(total / perPage),
    },
  };
}
