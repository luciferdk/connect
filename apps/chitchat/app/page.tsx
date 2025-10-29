'use client';

import ChatPage from './ChatPage/page';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from './utils/axiosConfig';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axiosInstance.get('/api/auth/check', {
          withCredentials: true,
        });

        if (res.status === 200) {
          setLoading(false);
        } else {
          router.push('/HomePage');
        }
      } catch (error) {
        console.error('JWT Verification Failed:', error);
        router.push('/HomePage');
      }
    };
    verifyToken();
  }, [router]);

  if (loading) {
    const SpinLoader = Loader2 as React.FC<React.SVGProps<SVGSVGElement>>;

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <SpinLoader className="w-8 h-8 animate-spin text-blue-600" />
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
