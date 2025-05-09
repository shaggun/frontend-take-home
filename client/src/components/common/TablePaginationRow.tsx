import React from 'react';
import { Table, Text, Flex, Spinner } from '@radix-ui/themes';
import Button from './Button';
import { PaginationData } from '../../types';

interface TablePaginationRowProps {
  paginationData: PaginationData;
  isLoading: boolean;
  colSpan: number;
  className?: string;
}

const TablePaginationRow: React.FC<TablePaginationRowProps> = ({
  paginationData,
  isLoading,
  colSpan,
  className
}) => {
  return (
    <Table.Row>
      <Table.Cell colSpan={colSpan} className={className}>
        <Flex justify="between" align="center">
          <Text size="2">
            Page {paginationData.currentPage} of {paginationData.totalPages}
          </Text>
          <Flex gap="2">
            <Button
              variant={!paginationData.hasPrev || isLoading ? "soft" : "surface"}
              color="gray"
              size="1"
              disabled={!paginationData.hasPrev || isLoading}
              onClick={paginationData.onPrevPage}
              aria-label="Previous page"
              highContrast
              weight="bold"
            >
              Previous
            </Button>
            <Button
              variant={!paginationData.hasNext || isLoading ? "soft" : "surface"}
              color="gray"
              size="1"
              disabled={!paginationData.hasNext || isLoading}
              onClick={paginationData.onNextPage}
              aria-label="Next page"
              weight="bold"
              highContrast
            >
              <Spinner size="1" loading={isLoading} />
              Next
            </Button>
          </Flex>
        </Flex>
      </Table.Cell>
    </Table.Row>
  );
};

export default TablePaginationRow;
