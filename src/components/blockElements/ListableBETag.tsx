import { DOListableBE } from '@/entities/blockElement/DOListableBE';
import React from 'react';
import { BaseBETag } from './BaseBETag';
import { useStore } from '@/stores/RootStore';
import { Dot, Triangle } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const editableAttr: React.HTMLAttributes<HTMLElement> = {
  contentEditable: true,
  suppressContentEditableWarning: true,
};

interface IListableBETagProps {
  data: DOListableBE;
  children?: React.ReactNode;
  numberedListCount?: number;
}

export const ListableBETag = (props: IListableBETagProps) => {
  const { data, children, numberedListCount } = props;
  const store = useStore();
  const [isToggled, setIsToggled] = React.useState(false);

  const isToggleable =
    data.tag === store.enums.BE_TAGS.TOGGLE_LIST ||
    data.tag === store.enums.BE_TAGS.TOGGLE_HEADING_LIST;
  const shouldShowChildren =
    data.contents.childrenIds.length > 0 &&
    (!isToggleable || (isToggleable && !isToggled));

  const getListIcon = () => {
    switch (data.tag) {
      case store.enums.BE_TAGS.NUMBERED_LIST:
        return `${numberedListCount}. `;
      case store.enums.BE_TAGS.BULLETED_LIST:
        return <Dot size={20} strokeWidth={6} />;
      case store.enums.BE_TAGS.TOGGLE_LIST:
      case store.enums.BE_TAGS.TOGGLE_HEADING_LIST:
        return (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsToggled(!isToggled);
            }}
            variant="ghost"
            size="icon"
            className="w-8 h-8"
          >
            <Triangle
              size={18}
              strokeWidth={2}
              className={cn('rotate-180', isToggled && 'rotate-90')}
            />
          </Button>
        );
    }
  };

  return (
    <BaseBETag isEditable BE={data}>
      <div className="flex items-center">
        <div className="mr-2 w-8 flex justify-center r">{getListIcon()}</div>
        <p {...editableAttr}>{data.contents.innerText}</p>
      </div>
      {shouldShowChildren && <div className="pl-4 mt-2">{children}</div>}
    </BaseBETag>
  );
};
