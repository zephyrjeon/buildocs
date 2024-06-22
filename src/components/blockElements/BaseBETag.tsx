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
import { BE_TAGS, DO_BE } from '@/entities/blockElement/BEInterfaces';
import { cn } from '@/lib/utils';
import { BE_DROP_POSITION } from '@/stores/BEEditorStore';
import { useStore } from '@/stores/RootStore';
import { GripVertical } from 'lucide-react';
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

  const handleSelectTag = (tag: BE_TAGS) => {
    store.BEEditStore.updateBE(BE, { tag });
  };

  const handleRemove = () => {
    store.BEEditStore.removeBE(BE);
  };

  const isParentContainerColumn =
    store.BEStore.getParentBE(BE).tag === store.enums.BE_TAGS.CONTAINER_COLUMN;

  const isFirstChildBE =
    store.BEStore.getParentBE(BE).contents.childrenIds[0] === BE.id;

  const isHovered = BE.id === store.BEEditStore.useHoveredBE?.id;
  const shouldShowActionBtn = isHovered || isDropdownOpen;

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

  return (
    <div
      onDragStart={(e) => {
        e.stopPropagation(); // prevent parent BE's onDragStart
        store.BEEditStore.setDraggingBE(BE);
      }}
      onDragOver={(e) => {
        e.stopPropagation(); // prevent parent BE's onDragOver
        e.preventDefault(); // without this, onDrop is not executed
        store.BEEditStore.setDraggedOverBE({
          target: BE,
          position: BE_DROP_POSITION.INSIDE,
        });
      }}
      onDragLeave={() => {
        store.BEEditStore.setDraggedOverBE(null);
      }}
      onDragEnd={() => {
        store.BEEditStore.setDraggedOverBE(null);
        store.BEEditStore.setDraggingBE(null);
      }}
      onDrop={() => store.BEEditStore.reoderBE()}
      onMouseLeave={() => {
        store.BEEditStore.setHoveredBE(null);
      }}
      onMouseOver={(e) => {
        e.stopPropagation();
        store.BEEditStore.setHoveredBE(BE);
      }}
      className="relative flex-1"
    >
      {shouldShowActionBtn && (
        <ActionBtn
          onSelectTag={handleSelectTag}
          onOpenChange={setIsDropdownOpen}
          onRemove={handleRemove}
        />
      )}
      {!isParentContainerColumn && isFirstChildBE && (
        <DropPositionIndicator
          isActive={isDraggedOverOnPrev}
          onDragOver={() =>
            store.BEEditStore.setDraggedOverBE({
              target: BE,
              position: BE_DROP_POSITION.PREV,
            })
          }
        />
      )}
      <div className="flex">
        {isParentContainerColumn && isFirstChildBE && (
          <DropPositionIndicator
            isActive={isDraggedOverOnPrev}
            onDragOver={() =>
              store.BEEditStore.setDraggedOverBE({
                target: BE,
                position: BE_DROP_POSITION.PREV,
              })
            }
          />
        )}
        <div
          draggable
          className={cn(
            'p-2 border-2 relative flex-1',
            isDraggedOverInside && 'border-blue-500/75',
            isDragging && 'border-violet-500/75'
          )}
        >
          {children}
        </div>
        {isParentContainerColumn && (
          <DropPositionIndicator
            isActive={isDraggedOverOnNext}
            onDragOver={() =>
              store.BEEditStore.setDraggedOverBE({
                target: BE,
                position: BE_DROP_POSITION.NEXT,
              })
            }
          />
        )}
      </div>
      {!isParentContainerColumn && (
        <DropPositionIndicator
          isActive={isDraggedOverOnNext}
          onDragOver={() =>
            store.BEEditStore.setDraggedOverBE({
              target: BE,
              position: BE_DROP_POSITION.NEXT,
            })
          }
        />
      )}
    </div>
  );
};

interface IDropPositionIndicator {
  onDragOver: () => void;
  isActive: boolean;
}

const DropPositionIndicator = (props: IDropPositionIndicator) => {
  const { onDragOver, isActive } = props;

  return (
    <div
      onDragOver={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onDragOver();
      }}
      className={cn('p-1', isActive && 'bg-blue-500/75')}
    />
  );
};

interface IActionBtnProps {
  onSelectTag: (selectedTag: BE_TAGS) => void;
  onOpenChange: (isOpen: boolean) => void;
  onRemove: () => void;
}

const ActionBtn = (props: IActionBtnProps) => {
  const { onSelectTag, onOpenChange, onRemove } = props;
  const store = useStore();

  const beTags = Object.values(store.enums.BE_TAGS).filter(
    (tag) => tag !== store.enums.BE_TAGS.ROOT
  );

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <div className="absolute left-[-0.80rem] top-[0rem] text-gray-600 cursor-pointer">
          <GripVertical />
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
  );
};
