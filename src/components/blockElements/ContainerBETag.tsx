import { DOContainerBE } from '@/entities/blockElement/DOContainerBE';
import React from 'react';
import { BaseBETag } from './BaseBETag';

interface IContainerBETagProps {
  data: DOContainerBE;
  children?: React.ReactNode;
}

export const ContainerBETag = (props: IContainerBETagProps) => {
  const { data, children } = props;
  return (
    <BaseBETag isEditable BE={data}>
      <div className="h-40">{children}</div>
    </BaseBETag>
  );
};
