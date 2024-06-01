import Image from 'next/image';
import documents from '../../../../public/documents.png';
import documentsDark from '../../../../public/documents-dark.png';
import reading from '../../../../public/reading.png';
import readingDark from '../../../../public/reading-dark.png';

export const Heroes = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-[300px] h-[300px] sm:w-[320px] sm:h-[320px] lg:h-[400px] lg:w-[400px]">
          <Image
            src={documents}
            fill
            className="object-contain dark:hidden"
            alt="Documents"
          />
          <Image
            src={documentsDark}
            fill
            className="object-contain hidden dark:block"
            alt="Documents"
          />
        </div>
        <div className="relative h-[400px] w-[400px] hidden md:block">
          <Image
            src={reading}
            fill
            className="object-contain dark:hidden"
            alt="Reading"
          />
          <Image
            src={readingDark}
            fill
            className="object-contain hidden dark:block"
            alt="Reading"
          />
        </div>
      </div>
    </div>
  );
};
