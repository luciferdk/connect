'use client';
import ChatPage from './pages/ChatPage/page';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (you can replace this with actual data fetching)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600 font-medium">L o a d i n g...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ChatPage />
    </div>
  );
}
