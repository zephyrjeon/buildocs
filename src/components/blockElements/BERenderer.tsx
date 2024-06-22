'use client';

import { DOContainerBE } from '@/entities/blockElement/DOContainerBE';
import { DOHeadingBE } from '@/entities/blockElement/DOHeadingBE';
import { DOListableBE } from '@/entities/blockElement/DOListableBE';
import { DORootBE } from '@/entities/blockElement/DORootBE';
import { DOTextBE } from '@/entities/blockElement/DOTextBE';
import { useStore } from '@/stores/RootStore';
import { BEInput } from './BEInput';
import { ContainerBETag } from './ContainerBETag';
import { HeadingBETag } from './HeadingBETag';
import { ListableBETag } from './ListableBETag';
import { RootBETag } from './RootBETag';
import { TextBETag } from './TextBETag';

interface IBERendererProps {
  beIds: string[];
  isRootLevel?: boolean;
}

export const BERenderer = (props: IBERendererProps) => {
  const { beIds, isRootLevel } = props;
  const store = useStore();
  const BEs = store.BEStore.useGetBEs;

  const numberedListCounter = (indexOfId: number, count: number): number => {
    const prevBE = indexOfId > 0 ? BEs[beIds[indexOfId - 1]] : null;

    if (!prevBE || prevBE.tag !== store.enums.BE_TAGS.NUMBERED_LIST) {
      return count;
    } else {
      return numberedListCounter(indexOfId - 1, count + 1);
    }
  };

  const elements = beIds.map((id, index) => {
    const BE = BEs[id];

    if (BE instanceof DORootBE) {
      return (
        <RootBETag key={BE.id} data={BE}>
          <BERenderer beIds={BE.contents.childrenIds} />
        </RootBETag>
      );
    }

    if (BE instanceof DOHeadingBE) {
      return <HeadingBETag key={BE.id} data={BE} />;
    }

    if (BE instanceof DOTextBE) {
      return <TextBETag key={BE.id} data={BE} />;
    }

    if (BE instanceof DOContainerBE) {
      return (
        <ContainerBETag key={BE.id} data={BE}>
          <BERenderer beIds={BE.contents.childrenIds} />
        </ContainerBETag>
      );
    }

    if (BE instanceof DOListableBE) {
      const numberedListCount =
        BE.tag === store.enums.BE_TAGS.NUMBERED_LIST
          ? numberedListCounter(index, 1)
          : undefined;

      return (
        <ListableBETag
          key={BE.id}
          data={BE}
          numberedListCount={numberedListCount}
        >
          <BERenderer beIds={BE.contents.childrenIds} />
        </ListableBETag>
      );
    }
  });

  return (
    <>
      {elements}
      {isRootLevel && <BEInput />}
    </>
  );
};
