import React from 'react';
import { render, screen } from '@testing-library/react';
import TablePaginationRow from '../common/TablePaginationRow';
import { PaginationData } from '../../types';

// Mock Radix UI components
jest.mock('@radix-ui/themes', () => ({
  Table: {
    Row: (props: any) => <tr data-testid="table-row-mock">{props.children}</tr>,
    Cell: (props: any) => (
      <td
        data-testid="table-cell-mock"
      >
        {props.children}
      </td>
    ),
  },
  Flex: (props: any) => (
    <div
      data-testid="flex-mock"
    >
      {props.children}
    </div>
  ),
  Text: (props: any) => <span data-testid="text-mock" data-size={props.size}>{props.children}</span>,
  Button: (props: any) => (
    <button
      data-testid="button-mock"
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  ),
}));

// Create a wrapper component to provide proper table structure
const TableWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <table>
    <tbody>
      {children}
    </tbody>
  </table>
);

describe('TablePaginationRow', () => {
  it('renders pagination controls correctly', () => {
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
      <TableWrapper>
        <TablePaginationRow
          paginationData={paginationData}
          isLoading={false}
          colSpan={4}
          className="test-class"
        />
      </TableWrapper>
    );

    // Check pagination text
    const textElement = screen.getByTestId('text-mock');
    expect(textElement.textContent).toBe('Page 2 of 5');

    // Check pagination buttons
    const buttons = screen.getAllByTestId('button-mock');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toBe('Previous');
    expect(buttons[1].textContent).toBe('Next');

    // Test button click handlers
    buttons[0].click();
    expect(mockOnPrevPage).toHaveBeenCalled();

    buttons[1].click();
    expect(mockOnNextPage).toHaveBeenCalled();
  });

  it('disables buttons correctly when no next/prev pages', () => {
    const mockOnNextPage = jest.fn();
    const mockOnPrevPage = jest.fn();

    const paginationData: PaginationData = {
      currentPage: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
      onNextPage: mockOnNextPage,
      onPrevPage: mockOnPrevPage
    };

    render(
      <TableWrapper>
        <TablePaginationRow
          paginationData={paginationData}
          isLoading={false}
          colSpan={4}
        />
      </TableWrapper>
    );

    // Check disabled state of buttons
    const buttons = screen.getAllByTestId('button-mock');
    expect(buttons[0]).toHaveAttribute('disabled');
    expect(buttons[1]).toHaveAttribute('disabled');
  });

  it('disables buttons when loading', () => {
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
      <TableWrapper>
        <TablePaginationRow
          paginationData={paginationData}
          isLoading={true}
          colSpan={4}
        />
      </TableWrapper>
    );

    // Check disabled state of buttons
    const buttons = screen.getAllByTestId('button-mock');
    expect(buttons[0]).toHaveAttribute('disabled');
    expect(buttons[1]).toHaveAttribute('disabled');
  });
});
