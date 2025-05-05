import { render, screen } from '@testing-library/react';
import { Role, PaginationData } from '../../types';
import RolesTable from '../Roles/RolesTable';

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

// Mock the RoleActionsMenu component
jest.mock('../Roles/RoleActionsMenu', () => ({
  __esModule: true,
  default: (props: any) => (
    <div
      data-testid="edit-role-button-mock"
      data-role-id={props.role.id}
      data-is-default={props.role.isDefault ? 'true' : 'false'}
    >
      Role Actions
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
  Badge: (props: any) => (
    <div
      data-testid="badge-mock"
    >
      {props.children}
    </div>
  ),
  Button: (props: any) => (
    <button
      data-testid="button-mock"
    >
      {props.children}
    </button>
  ),
}));

describe('RolesTable', () => {
  // Create mock roles that match the Role type
  const mockRoles: Role[] = [
    {
      id: 'role1',
      name: 'Admin',
      description: 'Administrator role with full access',
      isDefault: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'role2',
      name: 'User',
      description: 'Standard user role',
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'role3',
      name: 'Guest',
      // Missing description to test fallback
      isDefault: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  it('renders skeleton when loading and no data', () => {
    render(<RolesTable rolesData={[]} isLoading={true} />);
    expect(screen.getByTestId('skeleton-table-mock')).toBeInTheDocument();
  });

  it('renders empty message when no roles found', () => {
    render(<RolesTable rolesData={[]} isLoading={false} />);

    const textElement = screen.getByTestId('text-mock');
    expect(textElement.textContent).toBe('No roles found.');
  });

  it('renders roles data correctly', () => {
    render(<RolesTable rolesData={mockRoles} isLoading={false} />);

    // Check table structure
    expect(screen.getByTestId('table-root-mock')).toBeInTheDocument();
    expect(screen.getByTestId('table-header-mock')).toBeInTheDocument();
    expect(screen.getByTestId('table-body-mock')).toBeInTheDocument();


    // Check for role names
    const textElements = screen.getAllByTestId('text-mock');
    const textContents = textElements.map(el => el.textContent);

    expect(textContents).toContain('Admin');
    expect(textContents).toContain('User');
    expect(textContents).toContain('Guest');

    // Check for descriptions
    expect(textContents).toContain('Administrator role with full access');
    expect(textContents).toContain('Standard user role');
    expect(textContents).toContain('-'); // Fallback for missing description

    // Check for default badge on the User role (role2)
    const badges = screen.getAllByTestId('badge-mock');
    expect(badges).toHaveLength(1);
    expect(badges[0].textContent).toBe('Default');

    // Check if edit buttons are rendered for each role
    const editButtons = screen.getAllByTestId('edit-role-button-mock');
    expect(editButtons).toHaveLength(3);
    expect(editButtons[0]).toHaveAttribute('data-role-id', 'role1');
    expect(editButtons[0]).toHaveAttribute('data-is-default', 'false');
    expect(editButtons[1]).toHaveAttribute('data-role-id', 'role2');
    expect(editButtons[1]).toHaveAttribute('data-is-default', 'true');
    expect(editButtons[2]).toHaveAttribute('data-role-id', 'role3');
    expect(editButtons[2]).toHaveAttribute('data-is-default', 'false');
  });

  it('renders pagination controls when pagination data is provided', () => {
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

    render(
      <RolesTable
        rolesData={mockRoles}
        isLoading={false}
        paginationData={paginationData}
      />
    );

    // Check if TablePaginationRow is rendered
    const paginationRow = screen.getByTestId('table-pagination-row-mock');
    expect(paginationRow).toBeInTheDocument();
    expect(paginationRow.textContent).toContain('Page 2 of 5');
  });

  it('does not render pagination when not provided', () => {
    render(<RolesTable rolesData={mockRoles} isLoading={false} />);

    // Check that TablePaginationRow is not rendered
    const paginationRow = screen.queryByTestId('table-pagination-row-mock');
    expect(paginationRow).not.toBeInTheDocument();
  });
});
