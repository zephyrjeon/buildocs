'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

export interface INavProps {}

export function Nav(props: INavProps) {
  const router = useRouter();

  return <nav></nav>;
}
