import { DOTextBE } from '@/entities/blockElement/DOTextBE';
import { useThrottle } from '@/hooks/useThrottle';
import { useStore } from '@/stores/RootStore';
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
  const store = useStore();
  // Use ref instead of rendering value of data.contents.innerText directly to prevent cursor from jumping to the start of contentEditable element upon update.
  const innerTextRef = React.useRef(data.contents.innerText);

  const handleInput = useThrottle((innerText: string) =>
    store.BEEditStore.updateBE(data, {
      contents: { innerText },
    })
  );

  const handleRef = (ref: HTMLParagraphElement | null) => {
    const childrenIds = store.BEStore.getRootBE.contents.childrenIds;
    const lastBEId = childrenIds[childrenIds.length - 1];

    if (lastBEId === data.id) {
      store.BEEditStore.setFocusedBERef(ref);
    }
  };

  return (
    <BaseBETag isEditable BE={data}>
      <p
        ref={handleRef}
        {...editableAttr}
        onInput={(e) => handleInput(e.currentTarget.innerText)}
        className="px-2 focus:empty:before:content-['Start_typing_something_on_me_:)'] focus:empty:before:text-muted-foreground max-w-full"
      >
        {innerTextRef.current}
      </p>
    </BaseBETag>
  );
};
