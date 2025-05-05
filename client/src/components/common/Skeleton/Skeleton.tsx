import React from 'react';
import { Box } from '@radix-ui/themes';
import styles from '../../../styles/Skeleton.module.css';

interface SkeletonProps {
  height?: string | number;
  width?: string | number;
  className?: string;
  borderRadius?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  height = '24px',
  width = '100%',
  className = '',
  borderRadius = '4px',
}) => {
  return (
    <Box
      className={`${styles.skeleton} ${className}`}
      style={{
        height,
        width,
        borderRadius,
      }}
      aria-hidden="true"
      data-testid="skeleton-element"
    />
  );
};
