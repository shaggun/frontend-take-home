import React from 'react';
import { Button, Spinner, Flex,Callout } from '@radix-ui/themes';
import { ReloadIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import styles from '../../styles/Callout.module.css';


interface ErrorWithRetryProps {
  retry: () => void;
  isRetrying?: boolean;
  message?: string;
  className?: string;
}

/**
 * Error component with retry functionality
 */
const ErrorWithRetry: React.FC<ErrorWithRetryProps> = ({
  retry,
  isRetrying = false,
  message = 'Something went wrong. Please try again.',
}) => {
  return (
    <Callout.Root
      size="2"
      color="red"
      role="alert"
      variant="surface"
      className={styles.retryCallout}
    >
      <Flex gap="2">
        <Callout.Icon>
          <ExclamationTriangleIcon />
        </Callout.Icon>
        <Callout.Text>
          {message}
        </Callout.Text>
      </Flex>
      <Button
        onClick={retry}
        disabled={isRetrying}
        aria-disabled={isRetrying}
        aria-label={isRetrying ? "Retrying operation" : "Retry operation"}
      >
        {isRetrying ? (
          <>
            <Spinner size="2" />
            <span>Retrying...</span>
          </>
        ) : (
          <>
            <ReloadIcon aria-hidden="true" />
            <span>Retry</span>
          </>
        )}
      </Button>
    </Callout.Root>
  );
};

export default ErrorWithRetry;
