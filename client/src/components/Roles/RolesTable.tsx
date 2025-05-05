import React from 'react';
import { Table, Badge, Text, Flex } from '@radix-ui/themes';
import { Role, PaginationData } from '../../types';
import RoleActionsMenu from './RoleActionsMenu';
import { SkeletonTable } from '../common/Skeleton';
import TablePaginationRow from '../common/TablePaginationRow';
import tableStyles from '../../styles/Table.module.css';

interface RolesTableProps {
  rolesData: Role[];
  isLoading: boolean;
  paginationData?: PaginationData;
}

const RolesTable: React.FC<RolesTableProps> = ({ rolesData, isLoading, paginationData }) => {
  // Define table columns for skeleton and data table
  const tableColumns = [
    { header: 'Name', width: '150px' },
    { header: 'Description', width: '250px' },
    { header: 'Status', width: '100px' },
    { header: '', width: '50px', align: 'right' as const }
  ];

  // Render loading skeleton
  if (isLoading && rolesData.length === 0) {
    return (
      <SkeletonTable
        rows={4}
        columns={tableColumns}
      />
    );
  }

  if (rolesData.length === 0) {
    return (
      <Flex py="4" justify="center">
        <Text>No roles found.</Text>
      </Flex>
    );
  }

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell aria-label="Actions"></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {rolesData.map((role) => (
          <Table.Row key={role.id} className={tableStyles.tableRow}>
            <Table.Cell className={tableStyles.tableCell}>
              <Text>
                {role.name}
              </Text>
            </Table.Cell>
            <Table.Cell className={tableStyles.tableCell}>
              <Text>{role.description || '-'}</Text>
            </Table.Cell>
            <Table.Cell className={tableStyles.tableCell}>
              {role.isDefault && (
                <Badge
                  color="gray"
                  variant="outline"
                  radius="full"
                  highContrast
                >
                  Default
                </Badge>
              )}
            </Table.Cell>
            <Table.Cell className={tableStyles.tableCell} align="right">
              <RoleActionsMenu role={role} />
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

export default RolesTable;
