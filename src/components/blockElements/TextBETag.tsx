import { DOTextBE } from '@/entities/blockElement/DOTextBE';
import React from 'react';
import { BaseBETag } from './BaseBETag';
import { useStore } from '@/stores/RootStore';

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
        onInput={(e) => console.log(14, e.currentTarget.innerText)}
        className="focus:empty:before:content-['Start_typing_something_on_me_:)'] focus:empty:before:text-muted-foreground"
      >
        {data.contents.innerText}
      </p>
    </BaseBETag>
  );
};
