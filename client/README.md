# WorkOS FE

A React application for managing WorkOS users and roles with a focus on error handling and user experience.

## Stack

- React
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
  > Note: I use camelCase for CSS classes, inspired by Radix examples demonstrating custom styling. Additionally, since CSS Modules expose class names as JavaScript object properties, camelCase is a more natural choice for this particular case because of the dot notation access.
- **Skeleton Loading**: Reusable skeleton components for consistent loading states
- **Form Handling**: Uses React Hook Form for more robust form validation and management
- **Error Handling**: Handles API/network errors with retry functionality
- **Toast Notifications**: Toast system for success/error visual feedback
- **Test Coverage**: Unit tests for components
- **Custom Hooks**: Reusable logic for common tasks like debouncing and pagination
- **Lighthouse score of 96 for accessibility**: Use of ARIA attributes correctly when needed, keyboard navigation, etc.

## Error Handling Strategy

1. **API/Network Errors**: Handled with `ErrorWithRetry` component that shows:

   - User friendly error messages
   - Retry button for failed API calls
   - Loading state during retry attempts

2. **Toast Notifications**: Used to display error messages and success notifications

3. **Error Callouts**: `ErrorCallout` component for displaying inline error messages

## Pagination

The application implements pagination through:

- `usePagination` hook that manages pagination state and logic
- `TablePaginationRow` component that renders pagination controls
- `Page X of Y` provides visual feedback that improves UX by helping users immediately understand where they are in the dataset and how much more data is available.

## Nice to Have

Improvements that could enhance the application:

1. **Dark Mode Support**: Implement a theme switcher with dark mode support.
2. **Improve focus management**: When you submit a form, the focus moves to the URL bar instead of staying on an element in the page, this is related to how browsers handle form submission and page reloading.
3. **Add error boundary**: Handle runtime errors to prevent entire React app from crashing on production.

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
