export const dynamic = 'force-dynamic';
export const revalidate = 0;

import dynamicImport from 'next/dynamic';

// Load the client component only on the client, never on the server/build
const Client = dynamicImport(() => import('./Client'), { ssr: false });

export default function Page() {
  return <Client />;
}