/**
 * Environment configuration
 * Centralizes all environment variables and provides defaults
 */

export const config = {
  // API configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3002',
    timeout: 5000,
  },
};
