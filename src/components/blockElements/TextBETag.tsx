import { DOTextBE } from '@/entities/blockElement/DOTextBE';
import React from 'react';
import { BaseBETag } from './BaseBETag';

const editableAttr: React.HTMLAttributes<HTMLElement> = {
  contentEditable: true,
  suppressContentEditableWarning: true,
};

interface ITextBETagProps {
  data: DOTextBE;
}

export const TextBETag = (props: ITextBETagProps) => {
  const { data } = props;

  return (
    <BaseBETag isEditable BE={data}>
      <p
        // draggable
        // contentEditable
        {...editableAttr}
        onInput={(e) => console.log(14, e.currentTarget.innerText)}
      >
        {data.contents.innerText}
      </p>
    </BaseBETag>
  );
};
