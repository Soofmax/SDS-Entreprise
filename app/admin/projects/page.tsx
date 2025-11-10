import dynamic from 'next/dynamic';

// Force client-only rendering to avoid importing client libs on the server during page data collection
const Client = dynamic(() => import('./Client'), { ssr: false });

export default Client;