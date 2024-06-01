'use client';

import { MenuIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';

interface ITopBarProps {
  isCollapsed: boolean;
  onClickMenu: () => void;
}

export const Topbar = (props: ITopBarProps) => {
  const { isCollapsed, onClickMenu } = props;
  const params = useParams();

  return (
    <div>
      {!!params.pageId && (
        <div className="border-b-2 p-3 flex items-center gap-x-4">
          {isCollapsed && (
            <MenuIcon
              role="button"
              onClick={onClickMenu}
              className="h-6 w-6 text-muted-foreground"
            />
          )}
          <div className="flex items-center justify-between w-full">
            <div className="text-muted-foreground text-sm">{`TODO: Breadcrumbs: Document Title > Page title > Anchor`}</div>
            <div className="flex items-center">TODO: Publish Btn</div>
          </div>
        </div>
      )}

      {!params.pageId && (
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
