export interface PaginationMetaRto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponseRto<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    [key: string]: unknown;
  };
  error?: {
    code: string;
    details?: unknown;
  };
  timestamp: string;
}

export interface PaginatedResponseRto<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMetaRto;
  timestamp: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
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

export function buildPaginatedSuccessRto<T>(
  dataItems: T[],
  currentPageNumber: number,
  itemsPerPageLimit: number,
  totalItemsCount: number,
  customMessage: string = 'Data list retrieved successfully'
): PaginatedResponseRto<T> {
  const calculatedTotalPages = Math.ceil(totalItemsCount / itemsPerPageLimit) || 1;
  const isHasNextPage = currentPageNumber < calculatedTotalPages;
  const isHasPreviousPage = currentPageNumber > 1;

  return {
    success: true,
    message: customMessage,
    data: dataItems,
    pagination: {
      page: currentPageNumber,
      limit: itemsPerPageLimit,
      total: totalItemsCount,
      totalPages: calculatedTotalPages,
      hasNextPage: isHasNextPage,
      hasPreviousPage: isHasPreviousPage,
    },
    timestamp: new Date().toISOString(),
  };
}

export function buildErrorRto(
  errorMessage: string,
  errorCode: string = 'INTERNAL_ERROR',
  errorDetails?: unknown
): ApiResponseRto<null> {
  return {
    success: false,
    message: errorMessage,
    error: {
      code: errorCode,
      details: errorDetails,
    },
    timestamp: new Date().toISOString(),
  };
}
