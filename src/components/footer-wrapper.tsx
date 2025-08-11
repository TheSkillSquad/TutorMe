'use client';

import { useSession } from 'next-auth/react';
import Footer from './footer';

export default function FooterWrapper() {
  const { data: session } = useSession();
  return <Footer session={session} />;
}