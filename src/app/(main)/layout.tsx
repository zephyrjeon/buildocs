'use client';

import React from 'react';
import { redirect } from 'next/navigation';
import { Utils } from '../../utils/Utils';
import { Navigation } from './documents/_components/Navigation';
import { useStore } from '@/stores/RootStore';

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
    return redirect(Utils.URLs.rootURL);
  }

  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
