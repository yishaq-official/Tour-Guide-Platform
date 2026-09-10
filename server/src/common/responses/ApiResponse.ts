export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    [key: string]: unknown;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export const successResponse = <T>(
  data: T,
  meta?: { total?: number; page?: number; limit?: number; [key: string]: unknown }
): ApiResponse<T> => ({
  success: true,
  data,
  ...(meta ? { meta } : {}),
});

export const errorResponse = (
  code: string,
  message: string,
  details?: unknown
): ApiErrorResponse => ({
  success: false,
  error: {
    code,
    message,
    ...(details !== undefined ? { details } : {}),
  },
});
