import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, TextField, Text } from '@radix-ui/themes';

interface FormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
  defaultValue?: string;
  rules?: Record<string, any>;
  className?: string;
}

/**
 * Reusable form field component that integrates with React Hook Form
 */
export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  type = 'text',
  defaultValue = '',
  rules = {},
  className,
}) => {
  const { control, formState: { errors } } = useFormContext();

  // Combine custom rules with required rule if needed
  const validationRules = {
    ...rules,
    ...(required && { required: `${label} is required` }),
  };

  return (
    <Box className={className} mb="3">
      <Box mb="1">
        <Text as="label" size="2" htmlFor={name}>
          {label}
          {required && <Text color="red" aria-hidden="true"> *</Text>}
        </Text>
      </Box>

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={validationRules}
        render={({ field }) => (
          <TextField.Root
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!errors[name]}
            aria-describedby={errors[name] ? `${name}-error` : undefined}
          />
        )}
      />

      {errors[name] && (
        <Text
          size="1"
          color="red"
          id={`${name}-error`}
          role="alert"
          mt="4px"
        >
          {errors[name]?.message as string}
        </Text>
      )}
    </Box>
  );
};
