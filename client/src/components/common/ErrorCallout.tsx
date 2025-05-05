import React from 'react';
import { Callout } from '@radix-ui/themes';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface ErrorCalloutProps {
  message: string;
  className?: string;
  variant?: 'surface' | 'outline' | 'soft';
  mt?: string;
  mb?: string;
}

/**
 * A standardized error callout component for displaying error messages
 */
const ErrorCallout: React.FC<ErrorCalloutProps> = ({
  message,
  className,
  variant = "surface",
  mt="4",
  mb="0",
}) => {
  return (
    <Callout.Root
      size="1"
      color="red"
      mt={mt}
      mb={mb}
      role="alert"
      variant={variant}
      className={className}
    >
      <Callout.Icon>
        <ExclamationTriangleIcon />
      </Callout.Icon>
      <Callout.Text>
        {message}
      </Callout.Text>
    </Callout.Root>
  );
};

export default ErrorCallout;
