import { useStore } from '@/stores/RootStore';
import Link from 'next/link';
import { Button } from './ui/button';

interface IPageProps {}

export default function Page(props: IPageProps) {
  const store = useStore();

  return (
    <div>
      <div>Buildocs Home</div>
      <Link href={`${store.urls.documents}/temp/pages/temp`}>
        Create your first document
      </Link>
      <Button />
    </div>
  );
}
