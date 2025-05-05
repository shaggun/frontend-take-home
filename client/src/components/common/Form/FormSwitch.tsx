import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, Flex, Switch, Text } from '@radix-ui/themes';

interface FormSwitchProps {
  name: string;
  label: string;
  description?: string;
  disabled?: boolean;
  defaultValue?: boolean;
  className?: string;
}

/**
 * Reusable switch component that integrates with React Hook Form
 */
export const FormSwitch: React.FC<FormSwitchProps> = ({
  name,
  label,
  description,
  disabled = false,
  defaultValue = false,
  className,
}) => {
  const { control } = useFormContext();

  return (
    <Box className={className} mb="3">
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { value, onChange } }) => (
          <Flex align="center" gap="2">
            <Switch
              id={name}
              checked={value}
              onCheckedChange={onChange}
              disabled={disabled}
            />
            <Box>
              <Text as="label" size="2" htmlFor={name}>
                {label}
              </Text>
              {description && (
                <Text as="p" size="1" color="gray">
                  {description}
                </Text>
              )}
            </Box>
          </Flex>
        )}
      />
    </Box>
  );
};
