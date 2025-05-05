import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { PagedData, User, Role } from '../types';
import { config } from '../config/environment';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status?: number;
  data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Create an axios instance with the base URL and common configuration
 */
const api: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Safely access error data with type assertions
    const responseData = error.response?.data as Record<string, any> | undefined;
    const errorMessage = responseData?.message || error.message || 'Unknown error occurred';
    const status = error.response?.status;

    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', { message: errorMessage, status, data: responseData });
    }

    return Promise.reject(new ApiError(errorMessage, status, responseData));
  }
);

/**
 * Generic retry function for API requests
 * @param requestFn - The function that makes the API request
 * @param maxRetries - Maximum number of retries
 */
async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries = 2
): Promise<T> {
  let lastError: Error | AxiosError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error | AxiosError;

      // If it's the last attempt, don't wait, just throw
      if (attempt === maxRetries) {
        break;
      }

      // Skip retries for certain error types
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        // Don't retry 4xx errors except 429 (rate limit)
        if (status && status >= 400 && status < 500 && status !== 429) {
          break;
        }
      }

      // Exponential backoff: wait longer between retries
      const delay = Math.min(1000 * 2 ** attempt, 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// API Services for Users
export const userService = {
  // Get users with optional search term and page
  getUsers: async (search?: string, page = 1): Promise<PagedData<User>> => {
    return retryRequest(async () => {
      let url = `/users?page=${page}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const response = await api.get(url);
      return response.data;
    });
  },

  // Get a single user by ID
  getUser: async (id: string): Promise<User> => {
    return retryRequest(async () => {
      const response = await api.get(`/users/${id}`);
      return response.data;
    });
  },

  // Create a new user
  createUser: async (userData: Partial<User>): Promise<User> => {
    return retryRequest(async () => {
      const response = await api.post('/users', userData);
      return response.data;
    });
  },

  // Update a user
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    return retryRequest(async () => {
      const response = await api.patch(`/users/${id}`, userData);
      return response.data;
    });
  },

  // Delete a user
  deleteUser: async (id: string): Promise<User> => {
    return retryRequest(async () => {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    });
  }
};

// API Services for Roles
export const roleService = {
  // Get roles with optional search term and page
  getRoles: async (search?: string, page = 1): Promise<PagedData<Role>> => {
    return retryRequest(async () => {
      let url = `/roles?page=${page}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const response = await api.get(url);
      return response.data;
    });
  },

  // Get a single role by ID
  getRole: async (id: string): Promise<Role> => {
    return retryRequest(async () => {
      const response = await api.get(`/roles/${id}`);
      return response.data;
    });
  },

  // Create a new role
  createRole: async (roleData: Partial<Role>): Promise<Role> => {
    return retryRequest(async () => {
      const response = await api.post('/roles', roleData);
      return response.data;
    });
  },

  // Update a role
  updateRole: async (id: string, roleData: Partial<Role>): Promise<Role> => {
    return retryRequest(async () => {
      const response = await api.patch(`/roles/${id}`, roleData);
      return response.data;
    });
  },

  // Delete a role
  deleteRole: async (id: string): Promise<Role> => {
    return retryRequest(async () => {
      const response = await api.delete(`/roles/${id}`);
      return response.data;
    });
  }
};
