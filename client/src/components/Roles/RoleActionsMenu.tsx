import React, { useState, useEffect } from 'react';
import { Dialog, Flex, Spinner, Text, DropdownMenu } from '@radix-ui/themes';
import { DotsHorizontalIcon, ReloadIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from 'react-query';
import { useForm, FormProvider } from 'react-hook-form';
import { roleService } from '../../api/apiService';
import { Role } from '../../types';
import { FormField, FormTextArea } from '../common/Form';
import { ApiError } from '../../api/apiService';
import ErrorCallout from '../common/ErrorCallout';
import Button from '../common/Button';
import calloutStyles from '../../styles/Callout.module.css';
import dropdownStyles from '../../styles/DropdownMenu.module.css';
import { useToast } from '../../context/ToastContext';

// Button components for better readability
const RetryButton: React.FC<{ isLoading: boolean; onClick: () => void }> = ({ isLoading, onClick }) => (
  <Button
    onClick={onClick}
    disabled={isLoading}
    color="red"
    weight="bold"
  >
    {isLoading ? (
      <>
        <Spinner size="2" />
        Retrying...
      </>
    ) : (
      <>
        <ReloadIcon />
        Retry
      </>
    )}
  </Button>
);

const SaveButton: React.FC<{ isLoading: boolean }> = ({ isLoading }) => (
  <Button
    type="submit"
    disabled={isLoading}
    weight="bold"
  >
    {isLoading ? (
      <>
        <Spinner size="2" />
        Saving...
      </>
    ) : (
      'Save Changes'
    )}
  </Button>
);

interface RoleActionsMenuProps {
  role: Role;
}

interface FormValues {
  name: string;
  description: string;
}

// Define the type for the context returned from onMutate
interface MutationContext {
  previousRoles: any;
}

// Define update type for setAsDefault function
interface DefaultUpdate {
  isDefault: boolean;
}

const RoleActionsMenu: React.FC<RoleActionsMenuProps> = ({ role }) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [defaultError, setDefaultError] = useState<string | null>(null);
  const { showToast } = useToast();

  const methods = useForm<FormValues>({
    defaultValues: {
      name: role.name,
      description: role.description || ''
    }
  });

  // Update form values when role prop changes
  useEffect(() => {
    methods.reset({
      name: role.name,
      description: role.description || ''
    });
  }, [role, methods]);

  const queryClient = useQueryClient();

  // Set role as default mutation with optimistic updates
  const setAsDefaultMutation = useMutation<Role, ApiError, DefaultUpdate, MutationContext>(
    () => roleService.updateRole(role.id, { isDefault: true }),
    {
      // Apply optimistic update
      onMutate: async () => {
        // Cancel any outgoing refetches to avoid overwriting optimistic update
        await queryClient.cancelQueries('roles');

        // Snapshot the previous value
        const previousRoles = queryClient.getQueryData<any>(['roles']);

        // Optimistically update the cache
        queryClient.setQueryData(['roles'], (old: any) => {
          // If there's any default role, set it to false
          // And set the current role as default
          if (old && old.data) {
            return {
              ...old,
              data: old.data.map((r: Role) =>
                r.id === role.id
                  ? { ...r, isDefault: true }
                  : { ...r, isDefault: false }
              )
            };
          }
          return old;
        });

        return { previousRoles };
      },
      onSuccess: () => {
        // Invalidate and refetch roles query to ensure data consistency
        queryClient.invalidateQueries('roles');
        setDefaultError(null);
        showToast('success', `Role ${role.name} set as default successfully`);
      },
      onError: (error, _, context) => {
        // If the mutation fails, revert to the previous value
        if (context && context.previousRoles) {
          queryClient.setQueryData(['roles'], context.previousRoles);
        }
        setDefaultError(error.message || 'Failed to set role as default. Please try again.');
      },
      onSettled: () => {
        // Always refetch after error or success to make server state the source of truth
        queryClient.invalidateQueries('roles');
      },
    }
  );

  // Update role mutation with optimistic updates
  const updateRoleMutation = useMutation<Role, ApiError, FormValues, MutationContext>(
    (formData) => roleService.updateRole(role.id, formData),
    {
      // Apply optimistic update
      onMutate: async (formData) => {
        // Cancel any outgoing refetches to avoid overwriting optimistic update
        await queryClient.cancelQueries('roles');

        // Snapshot the previous value
        const previousRoles = queryClient.getQueryData<any>(['roles']);

        // Optimistically update the cache
        queryClient.setQueryData(['roles'], (old: any) => {
          // We need to update the role in the data array
          if (old && old.data) {
            return {
              ...old,
              data: old.data.map((r: Role) =>
                r.id === role.id
                  ? { ...r, ...formData }
                  : r
              )
            };
          }
          return old;
        });

        return { previousRoles };
      },
      onSuccess: () => {
        // Invalidate and refetch roles query to ensure data consistency
        queryClient.invalidateQueries('roles');
        setOpen(false);
        setError(null);
        showToast('success', `Role ${role.name} updated successfully`);
      },
      onError: (error, _, context) => {
        // If the mutation fails, revert to the previous value
        if (context && context.previousRoles) {
          queryClient.setQueryData(['roles'], context.previousRoles);
        }
        setError(error.message || 'Something went wrong. Please try again.');
      },
      onSettled: () => {
        // Always refetch after error or success to make server state the source of truth
        queryClient.invalidateQueries('roles');
      },
    }
  );

  const onCancel = () => {
    setOpen(false);
    methods.reset();
    setError(null);
  };

  const onSubmit = (data: FormValues) => {
    updateRoleMutation.mutate(data);
  };

  const handleRetry = () => {
    methods.handleSubmit(onSubmit)();
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button
            variant="ghost"
            radius="full"
            size="1"
            color="gray"
            style={{ padding: '4px 4px' }}
            aria-label="Actions"
          >
            <DotsHorizontalIcon color="black" />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          className={dropdownStyles.dropdownContent}
          align="end"
          sideOffset={5}
          color="gray"
          variant="soft"
          highContrast
        >
          <DropdownMenu.Item
            className={dropdownStyles.dropdownItem}
            onSelect={() => setOpen(true)}
          >
            Edit role
          </DropdownMenu.Item>
          {!role.isDefault && (
            <DropdownMenu.Item
              className={dropdownStyles.dropdownItem}
              onSelect={() => setAsDefaultMutation.mutate({ isDefault: true })}
              disabled={setAsDefaultMutation.isLoading}
            >
              Set as default
            </DropdownMenu.Item>
          )}
          {role.isDefault && (
            <DropdownMenu.Item
              className={dropdownStyles.dropdownItem}
              disabled={true}
            >
              Default role
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Item
            className={dropdownStyles.dropdownItem}
          >
            Delete role
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {/* Edition Dialog */}
      <Dialog.Root open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setError(null);
          methods.reset();
        }
      }}>
        <Dialog.Content>
          <Dialog.Title>Edit Role</Dialog.Title>
          <Dialog.Description size="2" mb="4" color="gray">
            Update the role information below.
          </Dialog.Description>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Flex direction="column" gap="3">
                <FormField
                  name="name"
                  label="Name"
                  placeholder="Enter role name"
                  required
                />

                <FormTextArea
                  name="description"
                  label="Description"
                  placeholder="Enter role description"
                  rows={3}
                />

                {role.isDefault && (
                  <Flex p="2" gap="2" align="center">
                    <Text size="2" color="gray">This is the default role for new users</Text>
                  </Flex>
                )}

                {defaultError && (
                  <ErrorCallout
                    message={defaultError}
                    className={calloutStyles.retryCallout}
                    mt="0"
                  />
                )}

                {error && (
                  <ErrorCallout
                    message={error}
                    className={calloutStyles.retryCallout}
                    mt="0"
                  />
                )}

                <Flex gap="3" mt="4" justify="end">
                  <Button
                    variant="surface"
                    color="gray"
                    highContrast
                    disabled={updateRoleMutation.isLoading}
                    onClick={onCancel}
                    weight="bold"
                  >
                    Cancel
                  </Button>

                  {/* Action Button: Either "Retry" or "Save Changes" depending on error state */}
                  {error ? (
                    <RetryButton
                      isLoading={updateRoleMutation.isLoading}
                      onClick={handleRetry}
                    />
                  ) : (
                    <SaveButton
                      isLoading={updateRoleMutation.isLoading}
                    />
                  )}
                </Flex>
              </Flex>
            </form>
          </FormProvider>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default RoleActionsMenu;
