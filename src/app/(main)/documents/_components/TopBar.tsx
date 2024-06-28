'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DODocument } from '@/entities/document/DODocument';
import { DOPage } from '@/entities/page/DOPage';
import { useStore } from '@/stores/RootStore';
import { BoxSelect, MenuIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';

import { Toggle } from '@/components/ui/toggle';

interface ITopBarProps {
  isCollapsed: boolean;
  onClickMenu: () => void;
}

export const Topbar = (props: ITopBarProps) => {
  const { isCollapsed, onClickMenu } = props;
  const [page, setPage] = React.useState<DOPage | null>(null);
  const [document, setDocument] = React.useState<DODocument | null>(null);
  const params = useParams();
  const store = useStore();
  const pageId = params?.pageId as string;
  const documentId = params?.documentId as string;
  const isOutlineVisible = store.BEEditStore.useIsOutlineVisible;

  React.useEffect(() => {
    if (pageId && documentId) {
      try {
        const page = store.pageStore.getPageById(pageId, documentId);
        const document = store.documentStore.getMyDocumentById(documentId);
        setPage(page);
        setDocument(document);
      } catch (error) {}
    }
  }, [pageId, documentId]);

  return (
    <div>
      {!!pageId && (
        <div className="border-b-[1px] border-border-default p-3 flex items-center gap-x-4">
          {isCollapsed && (
            <MenuIcon
              role="button"
              onClick={onClickMenu}
              className="h-6 w-6 text-muted-foreground"
            />
          )}
          <div className="flex items-center justify-between w-full">
            <div className="flex-1">
              <div className="text-muted-foreground text-sm">{`TODO: Breadcrumbs: ${document?.title} > ${page?.title}`}</div>
            </div>
            <div className="flex-1 text-center">
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Toggle
                          variant={'outline'}
                          pressed={isOutlineVisible}
                          onPressedChange={() =>
                            store.BEEditStore.toggleIsOutlineVisible()
                          }
                        >
                          <BoxSelect />
                        </Toggle>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle outlines</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
