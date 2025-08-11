'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import MainNavigation from '@/components/main-navigation'
import InteractiveLanding from '@/components/interactive-landing'

export default function Home() {
  const { data: session, status } = useSession()

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading TutorMe...</p>
        </div>
      </div>
    )
  }

  // Show interactive landing page if not authenticated
  if (!session) {
    return <InteractiveLanding />;
  }

  // Show main navigation for authenticated users
  return <MainNavigation />;
}