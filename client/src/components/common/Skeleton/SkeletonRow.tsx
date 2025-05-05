import React from 'react';
import { Table } from '@radix-ui/themes';
import { Skeleton } from './Skeleton';

interface SkeletonRowProps {
  columns: Array<{
    width?: string | number;
    height?: string | number;
    align?: 'left' | 'center' | 'right';
  }>;
}

export const SkeletonRow: React.FC<SkeletonRowProps> = ({ columns }) => {
  return (
    <Table.Row>
      {columns.map((column, index) => (
        <Table.Cell key={index} align={column.align}>
          <Skeleton width={column.width} height={column.height} />
        </Table.Cell>
      ))}
    </Table.Row>
  );
};
