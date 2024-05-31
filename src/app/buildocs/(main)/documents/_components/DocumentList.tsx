'use client';

import { DODocument } from '@/entities/document/DODocument';
import { useStore } from '@/stores/RootStore';
import { Utils } from '@/utils/Utils';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { DocumentItem } from './DocumentItem';
import { NavItem } from './NavItem';
import { PageList } from './PageList';

interface DocumentListProps {}

export const DocumentList = (props: DocumentListProps) => {
  const store = useStore();
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = React.useState<{ [key: string]: boolean }>(
    {}
  );

  const documents = store.documentStore.useMyDocumentList;

  const handleExpand = (documentId: string) => {
    setExpanded((prev) => ({ ...prev, [documentId]: !prev[documentId] }));
  };

  const handleRedirect = (document: DODocument) => {
    router.push(`${Utils.URLs.pagesURL(document.id, document.pages[0].id)}`);
  };

  // TODO: loading state
  if (!documents) {
    return (
      <>
        <NavItem.Skeleton />
        <NavItem.Skeleton />
        <NavItem.Skeleton />
      </>
    );
  }

  return (
    <>
      {documents.map((document) => (
        <div key={document.id}>
          <DocumentItem
            document={document}
            onClick={() => handleRedirect(document)}
            onExpand={() => handleExpand(document.id)}
            isActive={params.documentId === document.id}
            isExpanded={expanded[document.id]}
          />
          {expanded[document.id] && <PageList pages={document.pages} />}
        </div>
      ))}
    </>
  );
};
