"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Component that uses useSearchParams
function AuthContent() {
  const searchParams = useSearchParams();
  // Display a parameter from the URL if available
  const code = searchParams.get('code');
  
  return (
    <div>
      <h1>Authentication Page</h1>
      {code && <p>Authorization code: {code}</p>}
      {/* Your auth UI components here */}
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
