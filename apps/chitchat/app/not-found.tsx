
'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 text-white animate-fade-in">
      <h1 className="text-6xl font-extrabold mb-3 drop-shadow-lg">404</h1>
      <h2 className="text-2xl font-semibold mb-5">Page Not Found</h2>
      <p className="text-lg mb-8 text-center px-6 opacity-90">
        Sorry, the page you’re looking for doesn’t exist.
      </p>
      <button
        onClick={() => router.push('/')}
        className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition-transform hover:scale-105"
      >
        Go Back Home
      </button>
    </div>
  );
}
