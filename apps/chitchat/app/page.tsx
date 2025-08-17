'use client';

import HomePage from './pages/HomePage/page';
import { Loader } from 'lucide-react';
import { useAuthStore } from './utils/userAuthStore';
import { useEffect } from 'react';

export default function Home() {
  

  return (
    <div>
      <HomePage />
        
      
    </div>
  );
}
