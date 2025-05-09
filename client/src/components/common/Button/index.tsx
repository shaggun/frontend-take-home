import React from 'react';
import { Button as RadixButton, ButtonProps as RadixButtonProps } from '@radix-ui/themes';

/*
  * Button component that extends Radix UI's Button component
  * and adds support for custom font weights.
  *
  * This component allows you to specify a font weight
  *
  * @param {string | number} fontWeight - Custom font weight value.
  * @param {React.CSSProperties} style - Additional styles to apply.
  * @param {React.ReactNode} children - Content of the button.
  *
  * Expand this component to include more props as needed.
*/


// Define font weight types for better TypeScript support
type FontWeight = 'normal' | 'bold' | 'semibold' | 'light' | 'medium' | number;

export interface ButtonProps extends RadixButtonProps {
  // Use 'weight' to follow Radix naming conventions
  weight?: FontWeight;

  // Add any additional props to support here
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ weight, style, children, ...props }, ref) => {
    // Only apply the style if we have a weight to apply
    const combinedStyle = weight
      ? { ...style, fontWeight: weight }
      : style;

    return (
      <RadixButton ref={ref} style={combinedStyle} {...props}>
        {children}
      </RadixButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;