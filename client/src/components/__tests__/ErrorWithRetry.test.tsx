import { render, screen, fireEvent } from '@testing-library/react';
import ErrorWithRetry from '../common/ErrorWithRetry';

// Mock CSS modules
jest.mock('../../styles/Callout.module.css', () => ({
  retryCallout: 'mock-retry-callout-class',
}));

// Mock Radix UI components
jest.mock('@radix-ui/themes', () => ({
  Button: (props: any) => (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      aria-disabled={props['aria-disabled']}
      aria-label={props['aria-label']}
      data-testid="button-mock"
    >
      {props.children}
    </button>
  ),
  Spinner: (props: any) => (
    <div data-testid="spinner-mock" data-size={props.size}>Spinner</div>
  ),
  Flex: (props: any) => (
    <div data-testid="flex-mock" data-gap={props.gap}>{props.children}</div>
  ),
  Callout: {
    Root: (props: any) => (
      <div
        role={props.role}
        data-testid="callout-root-mock"
        data-classname={props.className}
      >
        {props.children}
      </div>
    ),
    Text: (props: any) => <div data-testid="callout-text-mock">{props.children}</div>,
    Icon: (props: any) => <div data-testid="callout-icon-mock">{props.children}</div>,
  },
}));

// Mock Radix UI icons
jest.mock('@radix-ui/react-icons', () => ({
  ReloadIcon: () => <div data-testid="reload-icon-mock">Reload</div>,
  ExclamationTriangleIcon: () => <div data-testid="exclamation-icon-mock">ExclamationTriangle</div>,
}));

describe('ErrorWithRetry', () => {
  const mockRetry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<ErrorWithRetry retry={mockRetry} />);

    expect(screen.getByTestId('callout-root-mock')).toBeInTheDocument();
    expect(screen.getByTestId('callout-root-mock')).toHaveAttribute('role', 'alert');
    expect(screen.getByTestId('callout-root-mock')).toHaveAttribute('data-classname', 'mock-retry-callout-class');

    expect(screen.getByTestId('flex-mock')).toBeInTheDocument();
    expect(screen.getByTestId('flex-mock')).toHaveAttribute('data-gap', '2');

    expect(screen.getByTestId('callout-icon-mock')).toBeInTheDocument();
    expect(screen.getByTestId('exclamation-icon-mock')).toBeInTheDocument();

    expect(screen.getByTestId('callout-text-mock').textContent).toBe('Something went wrong. Please try again.');
    expect(screen.getByTestId('button-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('spinner-mock')).not.toBeInTheDocument();
    expect(screen.getByTestId('reload-icon-mock')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    const customMessage = 'Custom error message';
    render(<ErrorWithRetry retry={mockRetry} message={customMessage} />);

    expect(screen.getByTestId('callout-text-mock').textContent).toBe(customMessage);
  });

  it('renders loading state when retrying', () => {
    render(<ErrorWithRetry retry={mockRetry} isRetrying={true} />);

    expect(screen.getByTestId('spinner-mock')).toBeInTheDocument();
    expect(screen.getByText('Retrying...')).toBeInTheDocument();
    expect(screen.queryByTestId('reload-icon-mock')).not.toBeInTheDocument();
  });

  it('calls retry function when button is clicked', () => {
    render(<ErrorWithRetry retry={mockRetry} />);

    fireEvent.click(screen.getByTestId('button-mock'));
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('disables retry button when retrying', () => {
    render(<ErrorWithRetry retry={mockRetry} isRetrying={true} />);

    expect(screen.getByTestId('button-mock')).toBeDisabled();
    expect(screen.getByTestId('button-mock')).toHaveAttribute('aria-disabled', 'true');
  });

  it('has correct aria labels', () => {
    render(<ErrorWithRetry retry={mockRetry} />);
    expect(screen.getByTestId('button-mock')).toHaveAttribute('aria-label', 'Retry operation');

    render(<ErrorWithRetry retry={mockRetry} isRetrying={true} />);
    expect(screen.getAllByTestId('button-mock')[1]).toHaveAttribute('aria-label', 'Retrying operation');
  });
});
