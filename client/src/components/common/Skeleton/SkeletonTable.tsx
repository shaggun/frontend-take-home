import React from 'react';
import { Table } from '@radix-ui/themes';
import { SkeletonRow } from './SkeletonRow';

interface SkeletonTableProps {
  rows?: number;
  columns: Array<{
    header: string;
    width?: string | number;
    height?: string | number;
    align?: 'left' | 'center' | 'right';
  }>;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns
}) => {
  return (
    <div aria-live="polite" aria-busy="true">
      <Table.Root variant="surface" size="2">
        <Table.Header>
          <Table.Row>
            {columns.map((column, index) => (
              <Table.ColumnHeaderCell key={index} align={column.align}>
                {column.header}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {Array.from({ length: rows }).map((_, index) => (
            <SkeletonRow
              key={index}
              columns={columns.map(({ width, height, align }) => ({ width, height, align }))}
            />
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};
