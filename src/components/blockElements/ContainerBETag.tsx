import { DOContainerBE } from '@/entities/blockElement/DOContainerBE';
import { cn } from '@/lib/utils';
import { useStore } from '@/stores/RootStore';
import React from 'react';
import { BaseBETag } from './BaseBETag';

interface IContainerBETagProps {
  data: DOContainerBE;
  children?: React.ReactNode;
}

export const ContainerBETag = (props: IContainerBETagProps) => {
  const { data, children } = props;
  const store = useStore();
  const isColumn = data.tag === store.enums.BE_TAGS.CONTAINER_COLUMN;

  return (
    <BaseBETag isEditable BE={data}>
      <div className={cn('min-h-40', isColumn && 'flex')}>{children}</div>
    </BaseBETag>
  );
};
