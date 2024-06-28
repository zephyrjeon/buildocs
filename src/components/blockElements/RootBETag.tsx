import { DORootBE } from '@/entities/blockElement/DORootBE';
import { useStore } from '@/stores/RootStore';
import React from 'react';

interface IRootBETagProps {
  data: DORootBE;
  children?: React.ReactNode;
}

export const RootBETag = (props: IRootBETagProps) => {
  const { children, data } = props;
  const store = useStore();
  const childrenIds = data.contents.childrenIds;
  const lastBE =
    childrenIds.length > 0
      ? store.BEStore.getBEById(childrenIds[childrenIds.length - 1])
      : null;
  const focusedBERef = store.BEEditStore.useFocusedBERef;
  const canFocusLastTextBERef =
    focusedBERef &&
    lastBE &&
    lastBE.tag === store.enums.BE_TAGS.TEXT &&
    !lastBE.contents.innerText;

  const handleClick = () => {
    if (canFocusLastTextBERef) {
      focusedBERef.focus();
    } else if (
      !lastBE ||
      lastBE.tag !== store.enums.BE_TAGS.TEXT ||
      lastBE.contents.innerText
    ) {
      store.BEEditStore.createBE({
        parentId: data.id,
        tag: store.enums.BE_TAGS.TEXT,
      });
    }
  };

  React.useEffect(() => {
    if (canFocusLastTextBERef) {
      focusedBERef.focus();
    }
  }, [focusedBERef]);

  return (
    <div
      onClick={handleClick}
      className="pb-80 min-h-full whitespace-pre-wrap break-words"
    >
      {children}
    </div>
  );
};
