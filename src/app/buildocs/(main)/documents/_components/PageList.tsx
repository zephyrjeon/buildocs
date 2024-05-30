import { mockPages } from '@/utils/mockData';
import { useRouter } from 'next/navigation';
import { PageItem } from './PageItem';

interface IPageListProps {}

export const PageList = (props: IPageListProps) => {
  const {} = props;

  const router = useRouter();

  const pages = mockPages;

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
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
            onClick={() => onRedirect(page.id)}
            onArchive={() => {}}
            page={page}
          />
        </div>
      ))}
    </>
  );
};
