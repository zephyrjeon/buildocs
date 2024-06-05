'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { DODocument } from '@/entities/document/DODocument';
import { cn } from '@/lib/utils';
import { useStore } from '@/stores/RootStore';
import {
  Book,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Plus,
  SquarePen,
  Trash,
} from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface IDocumenttemProps {
  isActive?: boolean;
  isExpanded?: boolean;
  onExpand: () => void;
  onClick?: () => void;
  document: DODocument;
}

export const DocumentItem = (props: IDocumenttemProps) => {
  const { onClick, isActive, onExpand, isExpanded, document } = props;
  const [newTitle, setNewTitle] = React.useState(document.title);
  const [isRenaming, setIsRenaming] = React.useState(false);
  const user = { fullName: 'tester' };
  const store = useStore();

  const handleRename = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    store.documentStore.rename(document, newTitle);
  };

  const handleArchive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!document.id) return;
    store.documentStore.remove(document);
    toast.message('Document Archived');
  };

  const handleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onExpand();
  };

  const createPage = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!document.id) return;
    toast.message('New Page Created');
  };

  const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;

  return (
    <div
      onClick={onClick}
      role="button"
      className={cn(
        'group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium',
        isActive && 'bg-primary/5 text-primary'
      )}
    >
      <div
        role="button"
        className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
        onClick={handleExpand}
      >
        <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
      </div>
      <Book className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      <span className="truncate">{document.title}</span>
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
              className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
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
            <DropdownMenuItem onClick={handleArchive}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="text-xs text-muted-foreground p-2">
              Last edited by: {user?.fullName}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <div
          role="button"
          onClick={createPage}
          className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
        >
          <Plus className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

DocumentItem.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : '12px',
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
