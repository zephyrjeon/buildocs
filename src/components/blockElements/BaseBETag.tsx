import { APP_ENUMS } from '@/common/enums';
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
  const [selectedTag, setSelectedTagTag] = React.useState<BE_TAGS>(BE.tag);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleSelectTag = (tag: BE_TAGS) => {
    setSelectedTagTag(tag);
    store.BEEditStore.updateBE(BE, { tag });
  };

  const handleRemove = () => {
    store.BEEditStore.removeBE(BE);
  };

  const isRecursive = store.BEStore.BETypeGuards.isRecursive(BE);

  const isHovered = BE.id === store.BEEditStore.useHoveredBE?.id;
  const shouldShowActionBtn = isHovered || isDropdownOpen;

  const draggedOverBE = store.BEEditStore.useDraggedOverBE;
  const isDraggedOver = BE.id === draggedOverBE?.target?.id;
  const isDraggedOverOnTop =
    isDraggedOver && draggedOverBE?.position === BE_DROP_POSITION.TOP;
  const isDraggedOverOnBottom =
    isDraggedOver && draggedOverBE?.position === BE_DROP_POSITION.BOTTOM;
  const isDraggedOverOnNext =
    isDraggedOver && draggedOverBE?.position === BE_DROP_POSITION.NEXT;

  const useDraggingBEs = store.BEEditStore.useDraggingBEs;
  const isDragging = !!useDraggingBEs.find((be) => be.id === BE.id);
  // console.log(57, useDraggingBEs);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.stopPropagation(); // prevent parent BE's onDragStart
        store.BEEditStore.setDraggingBE(BE);
      }}
      onDragOver={(e) => {
        e.stopPropagation(); // prevent parent BE's onDragOver
        e.preventDefault(); // without this, onDrop is not executed
        store.BEEditStore.setDraggedOverBE({
          target: BE,
          position: BE_DROP_POSITION.BOTTOM,
        });
      }}
      onDragEnter={(e) => {}}
      onDragLeave={() => {
        store.BEEditStore.setDraggedOverBE(null);
      }}
      onDragEnd={() => {
        store.BEEditStore.setDraggedOverBE(null);
        store.BEEditStore.setDraggingBE(null);
      }}
      onDrop={() => {
        store.BEEditStore.reoderBE();
      }}
      onMouseLeave={() => {
        store.BEEditStore.setHoveredBE(null);
      }}
      onMouseOver={(e) => {
        e.stopPropagation();
        store.BEEditStore.setHoveredBE(BE);
      }}
      className="relative"
    >
      {shouldShowActionBtn && (
        <ActionBtn
          selectedTag={selectedTag}
          onSelectTag={handleSelectTag}
          onOpenChange={setIsDropdownOpen}
          onRemove={handleRemove}
        />
      )}
      <div
        className={cn(
          'p-2 border-2 relative',
          isDraggedOverOnBottom && 'border-blue-500',
          isDragging && 'border-violet-500',
          isRecursive && 'pt-0'
        )}
      >
        {isRecursive && (
          <DropPositionIndicator
            onDragOver={() =>
              store.BEEditStore.setDraggedOverBE({
                target: BE,
                position: BE_DROP_POSITION.TOP,
              })
            }
            isActive={isDraggedOverOnTop}
          />
        )}
        <div draggable={false}>{children}</div>
      </div>
      <DropPositionIndicator
        onDragOver={() =>
          store.BEEditStore.setDraggedOverBE({
            target: BE,
            position: BE_DROP_POSITION.NEXT,
          })
        }
        isActive={isDraggedOverOnNext}
      />
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
      className={cn('p-1', isActive && 'bg-blue-500')}
    />
  );
};

interface IActionBtnProps {
  selectedTag: BE_TAGS;
  onSelectTag: (selectedTag: BE_TAGS) => void;
  onOpenChange: (isOpen: boolean) => void;
  onRemove: () => void;
}

const ActionBtn = (props: IActionBtnProps) => {
  const { onSelectTag, selectedTag, onOpenChange, onRemove } = props;

  const beTags = Object.values(APP_ENUMS.BE_TAGS).filter(
    (tag) => tag !== APP_ENUMS.BE_TAGS.ROOT
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
