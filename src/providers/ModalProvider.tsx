'use client';

import { useEffect, useState } from 'react';
import { SettingsModal } from '@/components/modals/SettingsModal';
import { CoverImageModal } from '@/components/modals/CoverImageModal';
import { SigninModal } from '@/components/modals/SigninModal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SigninModal />
      <SettingsModal />
      <CoverImageModal />
    </>
  );
};
