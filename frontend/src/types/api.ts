export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  error?: string;
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
  code?: string;
}
