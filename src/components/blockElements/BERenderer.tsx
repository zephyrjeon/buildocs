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

interface IBERendererProps {
  beIds: string[];
  isRootLevel?: boolean;
}

export const BERenderer = (props: IBERendererProps) => {
  const { beIds, isRootLevel } = props;
  const store = rootStore.BEStore;
  const BEs = store.useGetBEs;

  const elements = beIds.map((id) => {
    const data = BEs[id];

    if (data instanceof DORootBE) {
      return (
        <RootBETag key={data.id} data={data}>
          <BERenderer beIds={data.contents.childrenIds} />
        </RootBETag>
      );
    }

    if (data instanceof DOHeadingBE) {
      return <HeadingBETag key={data.id} data={data} />;
    }

    if (data instanceof DOTextBE) {
      return <TextBETag key={data.id} data={data} />;
    }

    if (data instanceof DOContainerBE) {
      return (
        <ContainerBETag key={data.id} data={data}>
          <BERenderer beIds={data.contents.childrenIds} />
        </ContainerBETag>
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
