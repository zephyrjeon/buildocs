'use client';

import React from 'react';
import { redirect } from 'next/navigation';
import { Utils } from '../../../utils/Utils';
import { Navigation } from './documents/_components/navigation';
// import { Spinner } from '../../../components/spinner';

export interface IMainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = (props: IMainLayoutProps) => {
  const { children } = props;
  const isAuthenticated = true;
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        {/* <Spinner size="lg" /> */}
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
      <main className="flex-1 h-full overflow-y-auto">
        {/* <SearchCommand /> */}
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
