'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
// import { Spinner } from "@/components/spinner";
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { useIsScrolled } from '../../../hooks/useIsScrolled';
import { ThemeToggle } from '../../../components/ThemeToggle';

export const Navbar = () => {
  const isAuthenticated = true;
  const isLoading = false;
  const isScrolled = useIsScrolled();

  return (
    <div
      className={cn(
        'z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6 bg-red-500',
        isScrolled && 'border-b shadow-sm'
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        {/* {isLoading && (
          <Spinner />
        )} */}
        {/* {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm">
                Get Jotion free
              </Button>
            </SignInButton>
          </>
        )} */}
        {isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/buildocs/documents">Enter Buildocs</Link>
            </Button>
            {/* <UserButton
              afterSignOutUrl="/"
            /> */}
          </>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
};
