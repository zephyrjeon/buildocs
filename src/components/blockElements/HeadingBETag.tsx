import { DOHeadingBE } from '@/entities/blockElement/DOHeadingBE';
import React from 'react';
import { BaseBETag } from './BaseBETag';

const editableAttr: React.HTMLAttributes<HTMLElement> = {
  contentEditable: true,
  suppressContentEditableWarning: true,
};

interface IHeadingBETagProps {
  data: DOHeadingBE;
}

export const HeadingBETag = (props: IHeadingBETagProps) => {
  const { data } = props;

  return (
    <BaseBETag isEditable BE={data}>
      <h1
        // draggable
        // contentEditable
        {...editableAttr}
        className="text-4xl"
        onInput={(e) => console.log(13, e.currentTarget.innerText)}
      >
        {data.contents.innerText}
      </h1>
    </BaseBETag>
  );
};
