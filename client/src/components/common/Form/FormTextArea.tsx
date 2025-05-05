import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, TextArea, Text } from '@radix-ui/themes';

interface FormTextAreaProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  rules?: Record<string, any>;
  className?: string;
  rows?: number;
}

/**
 * Reusable textarea form field component that integrates with React Hook Form
 */
export const FormTextArea: React.FC<FormTextAreaProps> = ({
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  defaultValue = '',
  rules = {},
  className,
  rows,
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
          <TextArea
            {...field}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!errors[name]}
            aria-describedby={errors[name] ? `${name}-error` : undefined}
            size="2"
            rows={rows}
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
