import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { BE_TAGS, DO_BE } from '@/entities/blockElement/BEInterfaces';
import { cn } from '@/lib/utils';
import { BE_DROP_POSITION } from '@/stores/BEEditorStore';
import { useStore } from '@/stores/RootStore';
import React from 'react';

export interface IBaseBETagProps {
  BE: DO_BE;
  isEditable: boolean;
  children: React.ReactNode;
}

export const BaseBETag = (props: IBaseBETagProps) => {
  const { isEditable, children, BE } = props;
  const store = useStore();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const isParentContainerColumn =
    store.BEStore.getParentBE(BE).tag === store.enums.BE_TAGS.CONTAINER_COLUMN;

  const isFirstChildBE =
    store.BEStore.getParentBE(BE).contents.childrenIds[0] === BE.id;

  const isHovered = BE.id === store.BEEditStore.useHoveredBE?.id;
  const shouldShowActionOverlay = isHovered || isDropdownOpen;

  const draggedOverBE = store.BEEditStore.useDraggedOverBE;
  const isDraggedOver = BE.id === draggedOverBE?.target?.id;
  const isDraggedOverOnPrev =
    isDraggedOver && draggedOverBE?.position === BE_DROP_POSITION.PREV;
  const isDraggedOverOnNext =
    isDraggedOver && draggedOverBE?.position === BE_DROP_POSITION.NEXT;
  const isDraggedOverInside =
    isDraggedOver && draggedOverBE?.position === BE_DROP_POSITION.INSIDE;

  const useDraggingBEs = store.BEEditStore.useDraggingBEs;
  const isDragging = !!useDraggingBEs.find((be) => be.id === BE.id);

  const handleDragOver =
    (position: BE_DROP_POSITION) => (e: React.MouseEvent) => {
      e.stopPropagation(); // prevent parent BE's onDragOver
      e.preventDefault(); // without this, onDrop is not executed
      store.BEEditStore.setDraggedOverBE({ target: BE, position });
    };

  const handleSelectTag = (tag: BE_TAGS) =>
    store.BEEditStore.updateBE(BE, { tag });

  const handleRemove = () => {
    store.BEEditStore.removeBE(BE);
  };

  return (
    <div
      onMouseOver={(e) => {
        e.stopPropagation();
        store.BEEditStore.setHoveredBE(BE);
      }}
      onMouseLeave={() => store.BEEditStore.setHoveredBE(null)}
      onDragStart={(e) => {
        e.stopPropagation(); // prevent parent BE's onDragStart
        store.BEEditStore.setDraggingBE(BE);

        // how to style ghost elements?
        //https://phuoc.ng/collection/react-drag-drop/customize-the-appearance-of-a-ghost-element/
        const dragEle = e.currentTarget;
        const nodeRect = dragEle.getBoundingClientRect();
        e.dataTransfer.setDragImage(
          dragEle,
          e.clientX - nodeRect.left,
          e.clientY - nodeRect.top
        );
        dragEle.style.opacity = '0';
        setTimeout(() => {
          dragEle.style.opacity = '1';
        }, 0);
      }}
      onDragLeave={() => store.BEEditStore.setDraggedOverBE(null)}
      onDragEnd={() => {
        store.BEEditStore.setDraggedOverBE(null);
        store.BEEditStore.setDraggingBE(null);
      }}
      onDragOver={handleDragOver(BE_DROP_POSITION.INSIDE)}
      onDrop={() => store.BEEditStore.reoderBE()}
      onClick={(e) => e.stopPropagation()}
      className={'w-full relative'}
    >
      {!isParentContainerColumn && isFirstChildBE && (
        <DropPositionIndicator
          isActive={isDraggedOverOnPrev}
          onDragOver={handleDragOver(BE_DROP_POSITION.PREV)}
        />
      )}
      <div className="flex">
        {isParentContainerColumn && isFirstChildBE && (
          <DropPositionIndicator
            isActive={isDraggedOverOnPrev}
            onDragOver={handleDragOver(BE_DROP_POSITION.PREV)}
          />
        )}
        <div
          draggable
          className={cn(
            'p-2 border-2 relative flex-1 border-dashed',
            store.BEEditStore.useIsOutlineVisible && 'border-border-default',
            shouldShowActionOverlay && 'border-blue-400 border-solid',
            isDraggedOverInside && 'border-blue-500/75',
            isDragging && 'border-violet-500/75'
          )}
        >
          {children}
          {shouldShowActionOverlay && (
            <ActionOverlay
              BE={BE}
              onSelectTag={handleSelectTag}
              onOpenChange={setIsDropdownOpen}
              onRemove={handleRemove}
              activeColor={isDragging ? 'bg-violet-500/75' : 'bg-blue-400'}
            />
          )}
        </div>
        {isParentContainerColumn && (
          <DropPositionIndicator
            isActive={isDraggedOverOnNext}
            onDragOver={handleDragOver(BE_DROP_POSITION.NEXT)}
          />
        )}
      </div>
      {!isParentContainerColumn && (
        <DropPositionIndicator
          isActive={isDraggedOverOnNext}
          onDragOver={handleDragOver(BE_DROP_POSITION.NEXT)}
        />
      )}
    </div>
  );
};

interface IDropPositionIndicator {
  onDragOver: (e: React.MouseEvent) => void;
  isActive: boolean;
}

const DropPositionIndicator = (props: IDropPositionIndicator) => {
  const { onDragOver, isActive } = props;

  return (
    <div
      onDragOver={(e) => onDragOver(e)}
      className={cn('p-1 ', isActive && 'bg-blue-500/50')}
    />
  );
};

interface IActionOverlayProps {
  BE: DO_BE;
  onSelectTag: (selectedTag: BE_TAGS) => void;
  onOpenChange: (isOpen: boolean) => void;
  onRemove: () => void;
  activeColor: string;
}

const ActionOverlay = (props: IActionOverlayProps) => {
  const { BE, onSelectTag, onOpenChange, onRemove, activeColor } = props;
  const store = useStore();

  const beTags = Object.values(store.enums.BE_TAGS).filter(
    (tag) => tag !== store.enums.BE_TAGS.ROOT
  );

  return (
    <>
      <div className="absolute flex left-0 top-[-18px] w-full justify-between items-end">
        <div className="text-xs first-letter:uppercase text-muted-foreground">
          {BE.tag.toLocaleLowerCase()}
        </div>
        <DropdownMenu onOpenChange={onOpenChange}>
          <DropdownMenuTrigger asChild>
            <div
              className={cn(
                'cursor-pointer rounded-tl-[20px] rounded-tr-[8px] relative left-[2px] pl-6 pr-4 h-4',
                activeColor
              )}
            >
              <span className="text-xs text-white relative bottom-[5px]">
                Menu
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select an action</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Select a type</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {beTags.map((tag) => {
                      return (
                        <DropdownMenuItem
                          key={tag}
                          onClick={() => onSelectTag(tag)}
                        >
                          <span className="first-letter:uppercase">
                            {tag.toLowerCase()}
                          </span>
                        </DropdownMenuItem>
                      );
                    })}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                      <span>More...</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>

                <DropdownMenuItem onClick={onRemove}>
                  <span>Remove</span>
                </DropdownMenuItem>
              </DropdownMenuSub>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem disabled>
                <span>Keyboard shortcuts</span>
                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(
                'p-[2px] h-full flex absolute justify-around right-0 top-0 cursor-pointer',
                activeColor
              )}
            >
              <span className="w-[2px] h-full ml-[2px] bg-gray-100" />
              <span className="w-[2px] h-full ml-[3px] bg-gray-100" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Drag to move</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};
