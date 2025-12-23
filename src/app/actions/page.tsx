'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SearchParamsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');

  return (
    <div>
      <h1>Actions Page</h1>
      <p>Search Query: {query || 'None'}</p>
    </div>
  );
}

export default function ActionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsContent />
    </Suspense>
  );
}
