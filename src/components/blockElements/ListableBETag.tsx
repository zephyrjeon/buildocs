import { DOListableBE } from '@/entities/blockElement/DOListableBE';
import React from 'react';
import { BaseBETag } from './BaseBETag';

const editableAttr: React.HTMLAttributes<HTMLElement> = {
  contentEditable: true,
  suppressContentEditableWarning: true,
};

interface IListableBETagProps {
  data: DOListableBE;
  children?: React.ReactNode;
}

export const ListableBETag = (props: IListableBETagProps) => {
  const { data, children } = props;

  return (
    <BaseBETag isEditable BE={data}>
      <div className="flex mb-2">
        <div className="pr-4">{data.tag.charAt(0)}</div>
        <p {...editableAttr}>{data.contents.innerText}</p>
      </div>
      <div className="pl-4">{children}</div>
    </BaseBETag>
  );
};
