import Link from 'next/link';
import React from 'react';
import { Utils } from '../utils/Utils';
import { Button } from './ui/button';

export interface IPageProps {}

export default function Page(props: IPageProps) {
  return (
    <div>
      <div>Buildocs Home</div>
      <Link href={`${Utils.URLs.documentsURL}temp/pages/temp`}>
        Create your first document
      </Link>
      <Button />
    </div>
  );
}
