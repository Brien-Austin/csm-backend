export interface ApiResponseRto<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: unknown;
  };
  error?: {
    code: string;
    details?: unknown;
  };
  timestamp: string;
}

export function buildSuccessRto<T>(
  data: T,
  message: string = 'Operation successful',
  meta?: ApiResponseRto['meta']
): ApiResponseRto<T> {
  return {
    success: true,
    message,
    data,
    meta,
    timestamp: new Date().toISOString(),
  };
}

export function buildErrorRto(
  message: string,
  code: string = 'INTERNAL_ERROR',
  details?: unknown
): ApiResponseRto<null> {
  return {
    success: false,
    message,
    error: {
      code,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}
