import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
});

export const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <p className={cn('font-semibold', font.className)}>Buildocs</p>
    </div>
  );
};
