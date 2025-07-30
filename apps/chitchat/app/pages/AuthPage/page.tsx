'use client';

import NavBar from '../components/NavBar';
import { Loader } from 'lucide-react';
import { useAuthStore } from '../utils/userAuthStore';
import { useEffect } from 'react';

export default function AuthPage() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if(isCheckingAuth) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-spin' />
    </div>
  )

  return (
    <div>
      <NavBar />
      <div>
        <h1>Auth Page</h1>
      </div>
    </div>
  );
}
