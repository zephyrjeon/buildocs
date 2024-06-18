'use client';

import { DOPage } from '@/entities/page/DOPage';
import { useStore } from '@/stores/RootStore';
import { MenuIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';

interface ITopBarProps {
  isCollapsed: boolean;
  onClickMenu: () => void;
}

export const Topbar = (props: ITopBarProps) => {
  const { isCollapsed, onClickMenu } = props;
  const [page, setPage] = React.useState<DOPage | null>(null);
  const params = useParams();
  const store = useStore();
  const pageId = params?.pageId as string;
  const documentId = params?.documentId as string;

  React.useEffect(() => {
    if (pageId && documentId) {
      try {
        const page = store.pageStore.getPageById(pageId, documentId);
        setPage(page);
      } catch (error) {}
    }
  }, [pageId, documentId]);

  return (
    <div>
      {!!pageId && (
        <div className="border-b-2 p-3 flex items-center gap-x-4">
          {isCollapsed && (
            <MenuIcon
              role="button"
              onClick={onClickMenu}
              className="h-6 w-6 text-muted-foreground"
            />
          )}
          <div className="flex items-center justify-between w-full">
            <div className="flex-1">
              <div className="text-muted-foreground text-sm">{`TODO: Breadcrumbs: Document Title > Page title > Anchor`}</div>
            </div>
            <div className="flex-1 text-center">
              <div>{page?.title}</div>
            </div>
            <div className="flex-1 text-right">
              <div className="">TODO: Publish Btn</div>
            </div>
          </div>
        </div>
      )}

      {!pageId && (
        <div className="p-3 bg-transparent ">
          {isCollapsed && (
            <MenuIcon
              role="button"
              onClick={onClickMenu}
              className="h-6 w-6 text-muted-foreground"
            />
          )}
        </div>
      )}
    </div>
  );
};
