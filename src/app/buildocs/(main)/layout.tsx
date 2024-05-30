'use client';

import React from 'react';
import { redirect } from 'next/navigation';
import { Utils } from '../../../utils/Utils';
import { NavBar } from './documents/_components/Navigation';

interface IMainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = (props: IMainLayoutProps) => {
  const { children } = props;
  const isAuthenticated = true;
  const isLoading = false;

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
      <NavBar />
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
