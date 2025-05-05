import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';

// Mock the Radix UI components to avoid the dependency issue
jest.mock('@radix-ui/themes', () => ({
  Theme: ({ children }: { children: React.ReactNode }) => <div data-testid="theme">{children}</div>,
  Container: ({ children, className }: { children: React.ReactNode, className?: string }) =>
    <div data-testid="container" className={className}>{children}</div>,
  Box: ({ children, py, pt, flexGrow }: { children: React.ReactNode, py?: string, pt?: string, flexGrow?: string }) =>
    <div data-testid="box">{children}</div>,
  Tabs: {
    Root: ({ children, defaultValue }: { children: React.ReactNode, defaultValue: string }) =>
      <div data-testid="tabs-root" data-default-value={defaultValue}>{children}</div>,
    List: ({ children }: { children: React.ReactNode }) =>
      <div data-testid="tabs-list">{children}</div>,
    Trigger: ({ children, value }: { children: React.ReactNode, value: string }) =>
      <button data-testid="tabs-trigger" data-value={value}>{children}</button>,
    Content: ({ children, value }: { children: React.ReactNode, value: string }) =>
      <div data-testid="tabs-content" data-value={value}>{children}</div>,
  },
}));

// Mock the UsersTab and RolesTab components
jest.mock('./components/Users/UsersTab', () => () => <div data-testid="users-tab">Users Tab Content</div>);
jest.mock('./components/Roles/RolesTab', () => () => <div data-testid="roles-tab">Roles Tab Content</div>);

// Create a test query client
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Create a wrapper for the App component with necessary providers
const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('App component', () => {
  test('renders the tabs navigation', () => {
    renderWithProviders(<App />);

    // Check for Users and Roles tabs
    const tabTriggers = screen.getAllByTestId('tabs-trigger');
    expect(tabTriggers).toHaveLength(2);

    // Verify the Users tab
    const usersTab = tabTriggers.find(trigger => trigger.textContent === 'Users');
    expect(usersTab).toBeInTheDocument();
    expect(usersTab).toHaveAttribute('data-value', 'users');

    // Verify the Roles tab
    const rolesTab = tabTriggers.find(trigger => trigger.textContent === 'Roles');
    expect(rolesTab).toBeInTheDocument();
    expect(rolesTab).toHaveAttribute('data-value', 'roles');

    // Check for tabs content
    const tabsContent = screen.getAllByTestId('tabs-content');
    expect(tabsContent).toHaveLength(2);
  });

  test('renders users tab content', () => {
    renderWithProviders(<App />);

    // Check that the UsersTab component is rendered
    const usersTabContent = screen.getByTestId('users-tab');
    expect(usersTabContent).toBeInTheDocument();
  });
});
