import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { User, PaginationData } from '../../types';
import UsersTable from '../Users/UsersTable';

// Mock TablePaginationRow component
jest.mock('../common/TablePaginationRow', () => ({
  __esModule: true,
  default: (props: any) => (
    <tr data-testid="table-pagination-row-mock">
      <td colSpan={props.colSpan} className={props.className}>
        Pagination: Page {props.paginationData.currentPage} of {props.paginationData.totalPages}
      </td>
    </tr>
  ),
}));

// Mock the SkeletonTable component
jest.mock('../common/Skeleton', () => ({
  SkeletonTable: (props: any) => (
    <div data-testid="skeleton-table-mock" data-rows={props.rows} data-columns={props.columns.length}>
      Loading Skeleton
    </div>
  ),
}));

// Mock the UserActionsMenu component
jest.mock('../Users/UserActionsMenu', () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="user-actions-menu-mock" data-user-id={props.userId}>
      Actions
    </div>
  ),
}));

// Mock Radix UI components
jest.mock('@radix-ui/themes', () => ({
  Table: {
    Root: (props: any) => <table data-testid="table-root-mock">{props.children}</table>,
    Header: (props: any) => <thead data-testid="table-header-mock">{props.children}</thead>,
    Body: (props: any) => <tbody data-testid="table-body-mock">{props.children}</tbody>,
    Row: (props: any) => (
      <tr
        data-testid="table-row-mock"
        className={props.className}
      >
        {props.children}
      </tr>
    ),
    Cell: (props: any) => (
      <td
        data-testid="table-cell-mock"
      >
        {props.children}
      </td>
    ),
    ColumnHeaderCell: (props: any) => (
      <th
        data-testid="table-header-cell-mock"
      >
        {props.children}
      </th>
    ),
  },
  Flex: (props: any) => (
    <div
      data-testid="flex-mock"
    >
      {props.children}
    </div>
  ),
  Text: (props: any) => <span data-testid="text-mock">{props.children}</span>,
  Avatar: (props: any) => (
    <div
      data-testid="avatar-mock"
      data-fallback={props.fallback}
    >
      {props.fallback}
    </div>
  ),
  Button: (props: any) => (
    <button
      data-testid="button-mock"
      disabled={props.disabled}
      onClick={props.onClick}
      aria-label={props['aria-label']}
    >
      {props.children}
    </button>
  ),
}));

// Create a mock for the roleService
const mockGetRoles = jest.fn();
jest.mock('../../api/apiService', () => ({
  roleService: {
    getRoles: () => mockGetRoles()
  }
}));

// Silence console.error during tests to avoid React Query error logs
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // Filter out specific React Query error messages
    if (args[0]?.includes && args[0].includes('React Query')) {
      return;
    }
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('UsersTable', () => {
  // Create mock users that match the User type
  const mockUsers: User[] = [
    {
      id: 'user1',
      first: 'John',
      last: 'Doe',
      roleId: 'role1',
      photo: '',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'user2',
      first: 'Jane',
      last: 'Smith',
      roleId: 'role2',
      photo: '',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z'
    }
  ];

  const mockRoles = {
    data: [
      {
        id: 'role1',
        name: 'Admin',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        isDefault: false
      },
      {
        id: 'role2',
        name: 'User',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        isDefault: true
      }
    ]
  };

  // Helper function to render with React Query
  const renderWithQuery = (ui: React.ReactElement) => {
    // Create a fresh QueryClient for each test
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
          staleTime: 0,
          // Disable automatic refetching
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          refetchOnReconnect: false,
        },
      },
      // No logger property - we're handling errors with the console.error override above
    });

    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock implementation
    mockGetRoles.mockResolvedValue(mockRoles);
  });

  it('renders skeleton when loading and no data', async () => {
    renderWithQuery(<UsersTable usersData={[]} isLoading={true} />);
    expect(screen.getByTestId('skeleton-table-mock')).toBeInTheDocument();
  });

  it('renders empty message when no users found', async () => {
    renderWithQuery(<UsersTable usersData={[]} isLoading={false} />);

    // Wait for the query to resolve
    await waitFor(() => {
      expect(mockGetRoles).toHaveBeenCalled();
    });
    expect(screen.getByTestId('text-mock').textContent).toBe('No users found.');
  });

  it('renders users data correctly', async () => {
    renderWithQuery(<UsersTable usersData={mockUsers} isLoading={false} />);

    // Wait for the query to resolve
    await waitFor(() => {
      expect(mockGetRoles).toHaveBeenCalled();
    });

    // Check table structure
    expect(screen.getByTestId('table-root-mock')).toBeInTheDocument();

    // Check user data
    const textElements = screen.getAllByTestId('text-mock');
    const textContents = textElements.map(el => el.textContent);

    expect(textContents).toContain('John Doe');
    expect(textContents).toContain('Jane Smith');

    // Check action menus
    const actionMenus = screen.getAllByTestId('user-actions-menu-mock');
    expect(actionMenus).toHaveLength(2);
    expect(actionMenus[0]).toHaveAttribute('data-user-id', 'user1');
    expect(actionMenus[1]).toHaveAttribute('data-user-id', 'user2');
  });

  it('renders pagination controls when pagination data is provided', async () => {
    const mockOnNextPage = jest.fn();
    const mockOnPrevPage = jest.fn();

    const paginationData: PaginationData = {
      currentPage: 2,
      totalPages: 5,
      hasNext: true,
      hasPrev: true,
      onNextPage: mockOnNextPage,
      onPrevPage: mockOnPrevPage
    };

    renderWithQuery(
      <UsersTable
        usersData={mockUsers}
        isLoading={false}
        paginationData={paginationData}
      />
    );

    // Wait for the query to resolve
    await waitFor(() => {
      expect(mockGetRoles).toHaveBeenCalled();
    });

    // Check if TablePaginationRow is rendered
    const paginationRow = screen.getByTestId('table-pagination-row-mock');
    expect(paginationRow).toBeInTheDocument();
    expect(paginationRow.textContent).toContain('Page 2 of 5');
  });

  it('does not render pagination when not provided', async () => {
    renderWithQuery(<UsersTable usersData={mockUsers} isLoading={false} />);

    // Wait for the query to resolve
    await waitFor(() => {
      expect(mockGetRoles).toHaveBeenCalled();
    });

    // Check that TablePaginationRow is not rendered
    const paginationRow = screen.queryByTestId('table-pagination-row-mock');
    expect(paginationRow).not.toBeInTheDocument();
  });
});
