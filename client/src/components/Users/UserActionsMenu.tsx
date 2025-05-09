import React, { useState } from 'react';
import { Flex, Dialog, Spinner, Text, Strong, DropdownMenu } from '@radix-ui/themes';
import { DotsHorizontalIcon, ReloadIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from 'react-query';
import { userService } from '../../api/apiService';
import dropdownStyles from '../../styles/DropdownMenu.module.css';
import calloutStyles from '../../styles/Callout.module.css';
import dialogStyles from '../../styles/Dialog.module.css';
import ErrorCallout from '../common/ErrorCallout';
import Button from '../common/Button';
import { useToast } from '../../context/ToastContext';

// Action button components for better readability
const RetryButton: React.FC<{ isLoading: boolean; onClick: () => void }> = ({ isLoading, onClick }) => (
  <Button
    variant="outline"
    color="red"
    onClick={onClick}
    disabled={isLoading}
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

const DeleteButton: React.FC<{ isLoading: boolean; onClick: () => void }> = ({ isLoading, onClick }) => (
  <Button
    variant="outline"
    color="red"
    onClick={onClick}
    disabled={isLoading}
    weight="bold"
  >
    {isLoading ? (
      <>
        <Spinner size="2" />
        Deleting...
      </>
    ) : (
      'Delete user'
    )}
  </Button>
);

interface UserActionsMenuProps {
  userId: string;
  userName: string;
}

const UserActionsMenu: React.FC<UserActionsMenuProps> = ({ userId, userName }) => {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const queryClient = useQueryClient();

  // Delete user mutation
  const deleteUserMutation = useMutation(
    () => userService.deleteUser(userId),
    {
      onSuccess: () => {
        // Invalidate and refetch users query to update the UI
        queryClient.invalidateQueries('users');
        setConfirmDeleteOpen(false);
        setError(null);
        showToast('success', `User ${userName} has been successfully deleted.`);
      },
      onError: (error: any) => {
        setError(error.message || 'Something went wrong. Please try again.');
      }
    }
  );

  const handleDelete = () => {
    deleteUserMutation.mutate();
  };

  const handleRetry = () => {
    deleteUserMutation.mutate();
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
          >
            Edit user
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={dropdownStyles.dropdownItem}
            onSelect={() => setConfirmDeleteOpen(true)}
          >
            Delete user
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {/* Confirmation Dialog */}
      <Dialog.Root open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <Dialog.Content className={dialogStyles.dialogContent}>
          <Dialog.Title>Delete user</Dialog.Title>
          <Dialog.Description size="2" color="gray" highContrast>
            <Text as="span">Are you sure? The user <Strong>{userName}</Strong> will be permanently deleted.</Text>
          </Dialog.Description>

          {error && (
            <ErrorCallout
              message={error}
              className={calloutStyles.retryCallout}
            />
          )}

          <Flex gap="3" mt="4" justify="end">
            <Button
              variant="surface"
              color="gray"
              highContrast
              onClick={() => setConfirmDeleteOpen(false)}
              disabled={deleteUserMutation.isLoading}
              weight="bold"
            >
              Cancel
            </Button>

            {/* Action Button: Either "Retry" or "Delete" depending on error state */}
            {error ? (
              <RetryButton
                isLoading={deleteUserMutation.isLoading}
                onClick={handleRetry}
              />
            ) : (
              <DeleteButton
                isLoading={deleteUserMutation.isLoading}
                onClick={handleDelete}
              />
            )}
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default UserActionsMenu;
