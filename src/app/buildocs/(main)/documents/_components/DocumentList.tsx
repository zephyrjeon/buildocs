'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FileIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { NavItem } from './NavItem';
import { mockMyDocuments } from '@/utils/mockData';
import { DocumentItem } from './DocumentItem';
import { PageList } from './PageList';

interface DocumentListProps {
  parentDocumentId?: any;
  level?: number;
  data?: any[];
}

export const DocumentList = ({
  parentDocumentId,
  level = 0,
}: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  // const documents = useQuery(api.documents.getSidebar, {
  //   parentDocument: parentDocumentId
  // });
  const documents = mockMyDocuments;

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (documents === undefined) {
    return (
      <>
        <NavItem.Skeleton level={level} />
        {level === 0 && (
          <>
            <NavItem.Skeleton level={level} />
            <NavItem.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : undefined,
        }}
        className={cn(
          'hidden text-sm font-medium text-muted-foreground/80',
          expanded && 'last:block',
          level === 0 && 'hidden'
        )}
      >
        No pages inside
      </p>
      {documents.map((document) => (
        <div key={document.id}>
          <DocumentItem
            id={document.id}
            onClick={() => onRedirect(document.id)}
            label={document.title}
            icon={FileIcon}
            active={params.documentId === document.id}
            level={level}
            onExpand={() => onExpand(document.id)}
            expanded={expanded[document.id]}
          />
          {expanded[document.id] && <PageList />}
        </div>
      ))}
    </>
  );
};
