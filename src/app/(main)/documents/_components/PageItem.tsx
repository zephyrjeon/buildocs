'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { FileText, MoreHorizontal, Trash } from 'lucide-react';
import { useParams } from 'next/navigation';

interface IPageItemProps {
  onClick: () => void;
  onArchive: () => void;
  page: any;
}

export const PageItem = (props: IPageItemProps) => {
  const { onClick, onArchive, page } = props;
  const param = useParams();

  return (
    <div
      onClick={onClick}
      role="button"
      className={cn(
        'flex items-center text-muted-foreground font-medium text-sm py-1 px-2 w-full hover:bg-primary/5 group/page-item min-h-[27px]'
        // active && 'bg-primary/5 text-primary'
      )}
    >
      <FileText className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      <span className="truncate">Title comes here</span>
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
            <DropdownMenuItem onClick={onArchive}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
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
