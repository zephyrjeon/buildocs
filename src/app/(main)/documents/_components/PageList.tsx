import { mockPages } from '@/utils/mockData';
import { useRouter } from 'next/navigation';
import { PageItem } from './PageItem';
import { DOPage } from '@/entities/page/DOPage';
import { Utils } from '@/utils/Utils';

interface IPageListProps {
  pages: DOPage[];
}

export const PageList = (props: IPageListProps) => {
  const { pages } = props;

  const router = useRouter();

  const onRedirect = (documentId: string, pageId: string) => {
    router.push(`${Utils.URLs.pagesURL(documentId, pageId)}`);
  };

  return (
    <>
      {pages.length === 0 && (
        <p className={'text-sm font-medium text-muted-foreground/80 pl-16'}>
          No pages inside
        </p>
      )}
      {pages.map((page) => (
        <div
          key={page.id}
          className="ml-10 border-l-2 border-muted-foreground/10"
        >
          <PageItem
            onClick={() => onRedirect(page.documentId, page.id)}
            onArchive={() => {}}
            page={page}
          />
        </div>
      ))}
    </>
  );
};
