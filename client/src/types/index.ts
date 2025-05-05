// User model
export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  first: string;
  last: string;
  roleId: string;
  photo?: string;
}

// Role model
export interface Role {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description?: string;
  isDefault: boolean;
}

// Paged data interface for paginated responses
export interface PagedData<T> {
  data: T[];
  next: number | null;
  prev: number | null;
  pages: number;
}

// Pagination props for table components
export interface PaginationData {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
}
