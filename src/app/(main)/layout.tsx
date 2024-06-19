'use client';

import { useStore } from '@/stores/RootStore';
import { redirect } from 'next/navigation';
import React from 'react';
import { Navigation } from './documents/_components/Navigation';

interface IMainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = (props: IMainLayoutProps) => {
  const { children } = props;
  const store = useStore();
  const isAuthenticated = true;
  const isLoading = false;

  React.useEffect(() => {
    if (isAuthenticated) {
      store.documentStore.loadMyDocumentList();
    }
  }, [isAuthenticated, store.documentStore]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div>loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect(store.urls.root);
  }

  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
