export interface BaseResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: MetaResponse;
  error?: ErrorResponse;
}

export interface MetaResponse {
  page?: number;
  size?: number;
  total?: number;
  totalPages?: number;
}

export interface ErrorResponse {
  code?: string;
  message?: string;
  details?: unknown;
}
