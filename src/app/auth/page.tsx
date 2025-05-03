"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Auth from '@/components/pages/Auth';

// Component that uses useSearchParams
function AuthContent() {
  const searchParams = useSearchParams();
  // Display a parameter from the URL if available
  const code = searchParams.get('code');
  
  return (
    <div>
      {code && <p>Authorization code: {code}</p>}
      <Auth/>
    </div>
  );
}

// Main page component with Suspense boundary
export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
