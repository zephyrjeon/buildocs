'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DOPage } from '@/entities/page/DOPage';
import { cn } from '@/lib/utils';
import { useStore } from '@/stores/RootStore';
import {
  FileText,
  MoreHorizontal,
  Trash,
  SquarePen,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import React from 'react';

interface IPageItemProps {
  onClick: () => void;
  onRemove: () => void;
  page: DOPage;
}

export const PageItem = (props: IPageItemProps) => {
  const { onClick, onRemove, page } = props;
  const [newTitle, setNewTitle] = React.useState(page.title);
  const [isRenaming, setIsRenaming] = React.useState(false);
  const store = useStore();
  const param = useParams();

  const handleRename = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    store.pageStore.rename(page, newTitle);
  };

  return (
    <div
      onClick={onClick}
      role="button"
      className={cn(
        'flex items-center text-muted-foreground font-medium text-sm py-1 px-2 w-full hover:bg-primary/5 group/page-item min-h-[27px]',
        isRenaming && 'bg-primary/5 text-primary'
      )}
    >
      <FileText className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      <span className="truncate">{page.order + page.title}</span>
      <DropdownMenu open={isRenaming} onOpenChange={() => setIsRenaming(false)}>
        <DropdownMenuTrigger></DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" align="start">
          <DropdownMenuLabel>
            <div className="flex items-center">
              <Input
                onChange={(e) => setNewTitle(e.target.value)}
                value={newTitle}
                className="h-8 mr-2"
              />
              <DropdownMenuItem onClick={handleRename}>
                <SquarePen className="h-5 w-5 cursor-pointer" />
              </DropdownMenuItem>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="ml-auto flex items-center gap-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
            <div
              role="button"
              className="opacity-0 group-hover/page-item:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-60"
            align="start"
            side="right"
            forceMount
          >
            <DropdownMenuItem onClick={() => setIsRenaming(true)}>
              <SquarePen className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => store.documentStore.removePage(page)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => store.pageStore.reorder(page, page.order - 1)}
            >
              <ChevronUp className="h-4 w-4 mr-2" />
              Move Up
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => store.pageStore.reorder(page, page.order + 1)}
            >
              <ChevronDown className="h-4 w-4 mr-2" />
              Move Down
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <div className="text-xs text-muted-foreground p-2">
              Last edited by: TODO
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
