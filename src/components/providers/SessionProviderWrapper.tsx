'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface ProviderProps {
  readonly children: ReactNode;
}

export default function Providers({ children }: Readonly<ProviderProps>) {
  return <SessionProvider>{children}</SessionProvider>;
}