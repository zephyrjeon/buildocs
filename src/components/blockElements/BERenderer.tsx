'use client';

import { DOContainerBE } from '@/entities/blockElement/DOContainerBE';
import { DOHeadingBE } from '@/entities/blockElement/DOHeadingBE';
import { DORootBE } from '@/entities/blockElement/DORootBE';
import { DOTextBE } from '@/entities/blockElement/DOTextBE';
import { rootStore } from '@/stores/RootStore';
import { BEInput } from './BEInput';
import { ContainerBETag } from './ContainerBETag';
import { HeadingBETag } from './HeadingBETag';
import { RootBETag } from './RootBETag';
import { TextBETag } from './TextBETag';
import { DOListableBE } from '@/entities/blockElement/DOListableBE';
import { ListableBETag } from './ListableBETag';

interface IBERendererProps {
  beIds: string[];
  isRootLevel?: boolean;
}

export const BERenderer = (props: IBERendererProps) => {
  const { beIds, isRootLevel } = props;
  const store = rootStore.BEStore;
  const BEs = store.useGetBEs;

  const elements = beIds.map((id, index) => {
    const BE = BEs[id];
    const prevBE = index > 0 ? BEs[beIds[index - 1]] : null;

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
      return (
        <ListableBETag key={BE.id} data={BE}>
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
