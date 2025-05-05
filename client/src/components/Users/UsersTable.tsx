import React from 'react';
import { Table, Avatar, Flex, Text } from '@radix-ui/themes';
import { User, PaginationData } from '../../types';
import UserActionsMenu from './UserActionsMenu';
import { useQuery } from 'react-query';
import { roleService } from '../../api/apiService';
import { SkeletonTable } from '../common/Skeleton';
import TablePaginationRow from '../common/TablePaginationRow';
import { formatIsoToShortUS } from '../../utils/date';
import tableStyles from '../../styles/Table.module.css';

interface UsersTableProps {
  usersData: User[];
  isLoading: boolean;
  paginationData?: PaginationData;
}

const UsersTable: React.FC<UsersTableProps> = ({ usersData, isLoading, paginationData }) => {
  // Fetch all roles to display role names
  const { data: rolesData } = useQuery(
    'roles',
    () => roleService.getRoles(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Function to get role name by ID
  const getRoleName = (roleId: string) => {
    const role = rolesData?.data.find(role => role.id === roleId);
    return role ? role.name : 'Unknown Role';
  };

  // Define table columns for skeleton and data table
  const tableColumns = [
    { header: 'User', width: '200px' },
    { header: 'Role', width: '150px' },
    { header: 'Joined', width: '150px' },
    { header: '', width: '50px', align: 'right' as const }
  ];

  // Render loading skeleton
  if (isLoading && usersData.length === 0) {
    return (
      <SkeletonTable
        rows={5}
        columns={tableColumns}
      />
    );
  }

  if (usersData.length === 0) {
    return (
      <Flex py="4" justify="center">
        <Text>No users found.</Text>
      </Flex>
    );
  }

  return (
    <Table.Root variant="surface" size="2">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>User</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Joined</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell aria-label="Actions"></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {usersData.map((user) => (
          <Table.Row key={user.id} className={tableStyles.tableRow}>
            <Table.Cell className={tableStyles.tableCell}>
              <Flex align="center" gap="3">
                <Avatar
                  size="1"
                  src={user.photo}
                  fallback={`${user.first.charAt(0)}${user.last.charAt(0)}`}
                  radius="full"
                  alt="User avatar"
                />
                <Text>{user.first} {user.last}</Text>
              </Flex>
            </Table.Cell>
            <Table.Cell className={tableStyles.tableCell}>
              <Text>{getRoleName(user.roleId)}</Text>
            </Table.Cell>
            <Table.Cell className={tableStyles.tableCell}>
              <Text>{formatIsoToShortUS(user.updatedAt)}</Text>
            </Table.Cell>
            <Table.Cell className={tableStyles.tableCell} align="right">
              <UserActionsMenu userId={user.id} userName={user.first + ' ' + user.last} />
            </Table.Cell>
          </Table.Row>
        ))}
        {paginationData && paginationData.totalPages > 1 && (
          <TablePaginationRow
            paginationData={paginationData}
            isLoading={isLoading}
            colSpan={4}
            className={tableStyles.tableCell}
          />
        )}
      </Table.Body>
    </Table.Root>
  );
};

export default UsersTable;
