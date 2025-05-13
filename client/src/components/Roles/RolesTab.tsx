import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Box, Flex, TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons';
import RolesTable from './RolesTable';
import { roleService } from '../../api/apiService';
import { PagedData, Role, PaginationData } from '../../types';
import ErrorWithRetry from '../common/ErrorWithRetry';
import { useDebounce, usePagination } from '../../hooks';
import Button from '../common/Button';
import { useToast } from '../../context/ToastContext';

const RolesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { showToast } = useToast();

  // Use the pagination hook for pagination state management
  const {
    currentPage,
    setCurrentPage,
    resetPage,
  } = usePagination();

  // Reset to page 1 when search term changes
  useEffect(() => {
    resetPage();
  }, [debouncedSearchTerm, resetPage]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Fetch roles data - use a base query key for immediate updates
  const {
    data: rolesData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<PagedData<Role>, Error>(
    ['roles'],
    () => roleService.getRoles(debouncedSearchTerm, currentPage),
    {
      keepPreviousData: true,
      retry: false, // Disable automatic retries since we're handling it manually
      refetchOnWindowFocus: false,
      // The key change: manually trigger refetch when search or page changes
      // This avoids the debounce delay affecting direct updates to roles
      onError: (err) => {
        showToast('error', `Failed to load roles: ${err.message}`);
      }
    }
  );
  
  // Effect to refetch when search term or page changes
  useEffect(() => {
    // The slight delay here prevents an immediate refetch on mount
    const timer = setTimeout(() => {
      refetch();
    }, 10); // Very small delay to avoid double fetching
    
    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, currentPage, refetch]);

  // Handle pagination
  const handlePreviousPage = () => {
    if (rolesData?.prev) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (rolesData?.next) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Box>
      <Flex direction="column" gap="4">
        <Flex justify="between" gap="2" align="center">
          <Box flexGrow="1">
            <TextField.Root
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search roles"
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </Box>
          <Box flexGrow="0">
            <Button weight="bold">
              <PlusIcon height="16" width="16" />
              Create role
            </Button>
          </Box>
        </Flex>

        {isError ? (
          <ErrorWithRetry
            retry={() => refetch()}
            isRetrying={isFetching}
            message={error?.message || 'Failed to load roles. Please try again.'}
          />
        ) : (
          <>
            <RolesTable
              rolesData={rolesData?.data || []}
              isLoading={isLoading || isFetching}
              paginationData={rolesData ? {
                currentPage,
                totalPages: rolesData.pages,
                hasNext: !!rolesData.next,
                hasPrev: !!rolesData.prev,
                onNextPage: handleNextPage,
                onPrevPage: handlePreviousPage
              } as PaginationData : undefined}
            />
          </>
        )}
      </Flex>
    </Box>
  );
};

export default RolesTab;
