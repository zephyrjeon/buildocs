'use client';

import { Utils } from '@/utils/Utils';
import { mockMyDocuments } from '@/utils/mockData';
import { FileIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { DocumentItem } from './DocumentItem';
import { NavItem } from './NavItem';
import { PageList } from './PageList';

interface DocumentListProps {
  parentDocumentId?: any;
  data?: any[];
}

export const DocumentList = (props: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  const documents = mockMyDocuments;

  const onRedirect = (document: any) => {
    router.push(`${Utils.URLs.pagesURL(document.id, document.pages[0].id)}`);
  };

  if (documents === undefined) {
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
            id={document.id}
            onClick={() => onRedirect(document)}
            label={document.title}
            icon={FileIcon}
            active={params.documentId === document.id}
            onExpand={() => onExpand(document.id)}
            expanded={expanded[document.id]}
          />
          {expanded[document.id] && <PageList />}
        </div>
      ))}
    </>
  );
};
