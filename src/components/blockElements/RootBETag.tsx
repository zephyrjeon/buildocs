import { DORootBE } from '@/entities/blockElement/DORootBE';
import React from 'react';

interface IRootBETagProps {
  data: DORootBE;
  children?: React.ReactNode;
}

export const RootBETag = (props: IRootBETagProps) => {
  const { children } = props;
  return (
    <div
      style={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      {children}
    </div>
  );
};
