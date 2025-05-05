# WorkOS FE

A React application for managing WorkOS users and roles with a focus on error handling and user experience.

## Stack

- React 18.3.1
- TypeScript
- Radix UI (for UI components)
- React Query (for data fetching)
- React Hook Form (for form handling)

## Project Structure

```
/src
  /api            - API service functions and error handling
  /components     - React components
    /common       - Reusable components
      /Form       - Reusable form components
      /Skeleton   - Skeleton loading components
      ErrorCallout.tsx    - Error callout component
      ErrorWithRetry.tsx  - Component for API/network errors
      TablePaginationRow.tsx - Table pagination component
    /Roles        - Role management components
    /Users        - User management components
    /__tests__    - Component tests
  /context        - React context providers. Toast context
  /hooks          - Custom React hooks
    useDebounce.ts - Hook for debouncing values
    usePagination.ts - Hook for pagination logic
  /styles         - CSS modules
  /types          - TypeScript type definitions
  /utils          - Utility functions
    date.tsx      - Date formatting utilities
  /config         - Configuration and environment settings
```

## Key Features

- **CSS Modules**: Modular styling approach for better organization and maintenance
- **Skeleton Loading**: Reusable skeleton components for consistent loading states
- **Form Handling**: Uses React Hook Form for more robust form validation and management
- **Error Handling**: Handles API/network errors with retry functionality
- **Toast Notifications**: Toast system for success/error visual feedback
- **Test Coverage**: Unit tests for components
- **Custom Hooks**: Reusable logic for common tasks like debouncing and pagination

## Error Handling Strategy

1. **API/Network Errors**: Handled with `ErrorWithRetry` component that shows:

   - User-friendly error messages
   - Retry button for failed API calls
   - Loading state during retry attempts

2. **Toast Notifications**: Used to display error messages and success notifications

3. **Error Callouts**: `ErrorCallout` component for displaying inline error messages

## Pagination

The application implements pagination through:

- `usePagination` hook that manages pagination state and logic
- `TablePaginationRow` component that renders pagination controls

## Nice to Have

Improvements that could enhance the application:

1. **Dark Mode Support**: Implement a theme switcher with dark mode support
2. **Improve focus management**: Keep focus on page on data submission
3. **Add error boundary**: Handle runtime errors to prevent entire app from crashing on production

## Getting Started

1. Install dependencies:

   ```
   npm install
   ```

2. Start the development server:

   ```
   npm start
   ```

3. Run tests:
   ```
   npm test
   ```
