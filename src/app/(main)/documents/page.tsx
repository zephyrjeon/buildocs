'use client';

import { Button } from '@/components/ui/button';
import { useStore } from '@/stores/RootStore';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import emptyDark from '../../../../public/empty-dark.png';
import empty from '../../../../public/empty.png';

const DocumentsPage = () => {
  const store = useStore();
  const router = useRouter();
  const user = {
    firstName: 'Tester',
  };

  const onCreate = () => {
    // const promise = create({ title: "Untitled" })
    //   .then((documentId) => router.push(`/documents/${documentId}`))

    router.push(store.urls.pages('temp1', 'temp2'));

    //   toast.promise(promise, {
    //   loading: 'Creating a new note...',
    //   success: 'New note created!',
    //   error: 'Failed to create a new note.',
    // });
    toast.message('New document created');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <div className="flex-[2]" />
      <Image
        src={empty}
        height="400"
        width="400"
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src={emptyDark}
        height="400"
        width="400"
        alt="Empty"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Buildocs
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a documents
      </Button>
      <div className="flex-[3]" />
    </div>
  );
};

export default DocumentsPage;
