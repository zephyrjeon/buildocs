'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const Heading = () => {
  const isAuthenticated = true;
  const isLoading = false;

  return (
    <div className="max-w-3xl space-y-4">
      <div className="text-3xl font-bold whitespace-pre sm:text-5xl md:text-6xl">
        <h1 className="sm:p-2">Document As You Wish</h1>
        <h1 className="sm:p-2">Publish Your Work With</h1>
        <h1 className="underline pt-3 sm:py-8 sm:text-6xl md:text-7xl">
          Buildocs
        </h1>
      </div>
      <h3 className="text-base font-medium whitespace-pre pb-4 sm:pb-8 sm:text-xl md:text-2xl">
        Create your documents, layout and style it{`\n`}
        in the way you want to present your work on the Web.
      </h3>

      {isLoading && (
        <div className="w-full flex items-center justify-center">
          loading...
        </div>
      )}

      {isAuthenticated && !isLoading && (
        <Button asChild className="py-6 pl-12 pr-10 text-lg">
          <Link href="/buildocs/documents/">
            Enter Buildocs
            <ArrowRight className="h-6 w-6 ml-2" />
          </Link>
        </Button>
      )}
      {/* {!isAuthenticated && !isLoading && (
        <SignInButton mode="modal">
          <Button>
            Get Jotion free
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </SignInButton>
      )} */}
    </div>
  );
};
