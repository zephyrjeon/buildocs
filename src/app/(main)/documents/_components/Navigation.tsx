'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  ChevronsLeft,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useMediaQuery } from 'usehooks-ts';
// import { useSearch } from "@/hooks/use-search";

import { useSettings } from '@/hooks/useSettings';
import { NavItem } from './NavItem';
import { NavUserItem } from './NavUserItem';
import { Topbar } from './TopBar';
import { DocumentList } from './DocumentList';
import { useStore } from '@/stores/RootStore';
// import { Item } from "./item";
// import { DocumentList } from "./document-list";
// import { TrashBox } from "./trash-box";

const MIN_NAV_WIDTH = 240;
const MAX_NAV_WIDTH = 480;

export const Navigation = () => {
  const store = useStore();
  const router = useRouter();
  const settings = useSettings();
  // const search = useSearch();
  const params = useParams();
  const documentId = 'test';
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const isResizingRef = React.useRef(false);
  const sidebarRef = React.useRef<React.ElementRef<'aside'>>(null);
  const topbarRef = React.useRef<React.ElementRef<'div'>>(null);
  const [isResetting, setIsResetting] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(isMobile);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDrag = (e: MouseEvent) => {
    if (!isResizingRef.current) return;

    let newWidth = e.clientX;

    if (newWidth < MIN_NAV_WIDTH) newWidth = MIN_NAV_WIDTH;
    if (newWidth > MAX_NAV_WIDTH) newWidth = MAX_NAV_WIDTH;

    if (sidebarRef.current && topbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      topbarRef.current.style.setProperty('left', `${newWidth}px`);
      topbarRef.current.style.setProperty(
        'width',
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const resetNavWidth = () => {
    if (sidebarRef.current && topbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? '100%' : `${MIN_NAV_WIDTH}px`;
      topbarRef.current.style.setProperty(
        'width',
        isMobile ? '0' : `calc(100% - ${MIN_NAV_WIDTH}px)`
      );
      topbarRef.current.style.setProperty(
        'left',
        isMobile ? '100%' : `${MIN_NAV_WIDTH}px`
      );
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const handleCollapse = () => {
    if (sidebarRef.current && topbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = '0';
      topbarRef.current.style.setProperty('width', '100%');
      topbarRef.current.style.setProperty('left', '0');
      setTimeout(() => setIsResetting(false), 300); // transition time on aside element
    }
  };

  const handleCreate = () => {
    // const promise = create({ title: "Untitled" })
    //   .then((documentId) => router.push(`/documents/${documentId}`))
    // toast.promise(promise, {
    //   loading: "Creating a new note...",
    //   success: "New note created!",
    //   error: "Failed to create a new note."
    // });
  };

  React.useEffect(() => {
    if (isMobile) {
      handleCollapse();
    } else {
      resetNavWidth();
    }
  }, [isMobile, resetNavWidth, handleCollapse]);

  React.useEffect(() => {
    if (isMobile) {
      handleCollapse();
    }
  }, [pathname, isMobile, handleCollapse]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          `group/sidebar h-full bg-secondary overflow-y-auto relative flex w-[${MIN_NAV_WIDTH}px] flex-col z-[99999]`,
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'w-0'
        )}
      >
        <div
          onClick={handleCollapse}
          role="button"
          className={cn(
            'h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition',
            isMobile && 'opacity-100'
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <NavUserItem />
          <NavItem label="Search" icon={Search} isSearch onClick={() => {}} />
          <NavItem label="Settings" icon={Settings} onClick={settings.onOpen} />
          <NavItem
            label="New Document"
            icon={PlusCircle}
            onClick={handleCreate}
          />
        </div>
        <div className="mt-4">
          <DocumentList />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <NavItem label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? 'bottom' : 'right'}
            >
              {/* <TrashBox /> */}
              <div>Not yet</div>
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetNavWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>

      <div
        ref={topbarRef}
        className={cn(
          `absolute top-0 z-[99999] left-[${MIN_NAV_WIDTH}px] w-[calc(100%-${MIN_NAV_WIDTH}px)]`,
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'left-0 w-full'
        )}
      >
        <Topbar isCollapsed={isCollapsed} onClickMenu={resetNavWidth} />
      </div>
    </>
  );
};
