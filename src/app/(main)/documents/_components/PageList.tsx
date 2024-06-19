import { useStore } from '@/stores/RootStore';
import { useRouter } from 'next/navigation';
import { PageItem } from './PageItem';

interface IPageListProps {
  documentId: string;
}

export const PageList = (props: IPageListProps) => {
  const { documentId } = props;
  const router = useRouter();
  const store = useStore();
  const pages = store.pageStore.usePagesByDocumentId(documentId);

  const onRedirect = (documentId: string, pageId: string) => {
    router.push(`${store.urls.pages(documentId, pageId)}`);
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
            onRemove={() => store.documentStore.removePage(page)}
            page={page}
          />
        </div>
      ))}
    </>
  );
};
