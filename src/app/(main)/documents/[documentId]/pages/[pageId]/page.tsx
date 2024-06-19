'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import { Toolbar } from '@/components/toolbar';
// import { Cover } from "@/components/cover";
import { Skeleton } from '@/components/ui/skeleton';
// import Editor from '@/components/editor';
import { rootStore, useStore } from '@/stores/RootStore';
import { BERenderer } from '@/components/blockElements/BERenderer';
import { mockBEData1 } from '@/utils/mockData';
import ShortUniqueId from 'short-unique-id';
import { DOHeadingBE } from '@/entities/blockElement/DOHeadingBE';
import { APP_ENUMS } from '@/common/enums';
import { DORootBE } from '@/entities/blockElement/DORootBE';
import {
  DOTest2,
  DOTest2Instance,
  DOTest3Data,
  DOTest3Instance,
} from '@/entities/blockElement/DOTest';
import React from 'react';
import { create } from 'zustand';

const parsed = rootStore.BEStore.parseBEs(JSON.stringify(mockBEData1));

interface DocumentIdPageProps {
  // params: {
  //   documentId: Id<"documents">;
  // };
}

const DocumentIdPage = ({}: DocumentIdPageProps) => {
  const store = useStore();

  // const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }) ,[]);

  // const document = useQuery(api.documents.getById, {
  //   documentId: params.documentId
  // });

  // const update = useMutation(api.documents.update);

  const document = {};

  const onChange = (content: string) => {
    // update({
    //   id: params.documentId,
    //   content
    // });
  };

  // const store = rootStore.bearStore();
  // const numBears = store.bears;
  // const store2 = rootStore.bearStore2;
  // const numBears2 = store2.bear;

  const onClick = () => {
    // store.increase(1);
    // store2.increase(1);
  };

  const onClickTest = () => {
    const uid = new ShortUniqueId({ length: 10 }).rnd();

    const newBE = {
      id: uid,
      parentId: 'be0',
      tag: APP_ENUMS.BE_TAGS.HEADING,
      contents: {
        innerText: uid,
      },
    };
    mockBEData1.push(newBE);
    // store.parseBEs(JSON.stringify(mockBEData1));
    console.log(75, mockBEData1);
    // store.updateBE(uid, newBE);
    // store.updateBE(uid, newBE);
  };

  if (document === undefined) {
    return (
      <div>
        {/* <Cover.Skeleton /> */}
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found</div>;
  }
  const rootBE = rootStore.BEStore.useGetRootBE;
  const beIds = rootBE?.contents?.childrenIds ?? [];

  return (
    <div className="pt-[50px] h-full">
      {/* <Cover url={document.coverImage} /> */}
      {/* <Toolbar initialData={document} /> */}
      <Editor>
        <BERenderer beIds={beIds} isRootLevel />
      </Editor>
    </div>
  );
};

export default DocumentIdPage;

interface IEditorProps {
  children: React.ReactNode;
}

const Editor = (props: IEditorProps) => {
  return (
    <div className="p-10 pb-40 min-h-full flex-1">
      <div className="md:max-w-3xl lg:max-w-5xl mx-auto">{props.children}</div>
    </div>
  );
};
