'use client';
import { toast } from 'sonner';
import { Footer } from './_components/footer';
import { Heading } from './_components/heading';
import { Heroes } from './_components/heroes';

const MarketingPage = () => {
  return (
    <div className="min-h-full flex flex-col dark:bg-[#1f1f1f]">
      <div className="flex-[2]" />
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1">
        <Heading />
        <Heroes />
      </div>
      <div onClick={() => toast('test')} className="flex-[3]" />
      <Footer />
    </div>
  );
};

export default MarketingPage;
