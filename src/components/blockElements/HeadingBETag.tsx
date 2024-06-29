import { DOHeadingBE } from '@/entities/blockElement/DOHeadingBE';
import { useThrottle } from '@/hooks/useThrottle';
import { useStore } from '@/stores/RootStore';
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
  const store = useStore();
  const innerTextRef = React.useRef(data.contents.innerText);

  const handleInput = useThrottle((innerText: string) =>
    store.BEEditStore.updateBE(data, {
      contents: { innerText },
    })
  );

  return (
    <BaseBETag isEditable BE={data}>
      <h1
        {...editableAttr}
        className="text-4xl font-medium empty:before:content-['Heading'] empty:before:text-muted-foreground"
        onInput={(e) => handleInput(e.currentTarget.innerText)}
      >
        {innerTextRef.current}
      </h1>
    </BaseBETag>
  );
};
