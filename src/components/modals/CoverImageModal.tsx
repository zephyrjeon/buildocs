'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { useCoverImage } from '@/hooks/useCoverImage';
import { SingleImageDropzone } from '@/components/single-image-dropzone';

export const CoverImageModal = () => {
  const params = useParams();
  const coverImage = useCoverImage();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      onClose();
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};
