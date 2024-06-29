import { DOListableBE } from '@/entities/blockElement/DOListableBE';
import { useThrottle } from '@/hooks/useThrottle';
import { cn } from '@/lib/utils';
import { useStore } from '@/stores/RootStore';
import { Dot, Triangle } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { BaseBETag } from './BaseBETag';

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
  const innerTextRef = React.useRef(data.contents.innerText);
  const [isToggled, setIsToggled] = React.useState(false);

  const isToggleable =
    data.tag === store.enums.BE_TAGS.TOGGLE_LIST ||
    data.tag === store.enums.BE_TAGS.TOGGLE_HEADING_LIST;
  const isToggleHeading = data.tag === store.enums.BE_TAGS.TOGGLE_HEADING_LIST;
  const shouldShowChildren =
    data.contents.childrenIds.length > 0 &&
    (!isToggleable || (isToggleable && !isToggled));

  const handleInput = useThrottle((innerText: string) =>
    store.BEEditStore.updateBE(data, {
      contents: { innerText },
    })
  );

  const getListIcon = () => {
    switch (data.tag) {
      case store.enums.BE_TAGS.NUMBERED_LIST:
        return `${numberedListCount}. `;
      case store.enums.BE_TAGS.BULLETED_LIST:
        return <Dot size={20} strokeWidth={7} />;
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
            className={cn('w-6 h-6', isToggleHeading && 'w-8 h-8')}
          >
            <Triangle
              size={isToggleHeading ? 22 : 18}
              strokeWidth={2}
              className={cn('rotate-180', isToggled && 'rotate-90')}
            />
          </Button>
        );
    }
  };

  return (
    <BaseBETag isEditable BE={data}>
      <div className="flex ">
        <div
          className={cn(
            'mr-1 w-8 h-6 flex justify-center items-center',
            isToggleHeading && 'h-10'
          )}
        >
          {getListIcon()}
        </div>
        <p
          {...editableAttr}
          className={cn(
            "flex-1 empty:before:content-['List'] empty:before:text-muted-foreground",
            isToggleHeading &&
              "text-4xl font-medium empty:before:content-['Heading']"
          )}
          onInput={(e) => handleInput(e.currentTarget.innerText)}
        >
          {innerTextRef.current}
        </p>
      </div>
      <div className={cn('pl-5 mt-1', shouldShowChildren ? 'block' : 'hidden')}>
        {children}
      </div>
    </BaseBETag>
  );
};
