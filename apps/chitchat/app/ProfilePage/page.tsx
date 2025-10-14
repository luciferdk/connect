'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface UserProfile {
  id: string;
  name: string;
  bio: string;
  profileUrl: string; // optional
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/user', { withCredentials: true });
        setUser(res.data);
      } catch (error: unknown) {

        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  if (!user) return <p className="p-6">No user found</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      {user.profileUrl && (
        <Image
          src={user.profileUrl}
          alt="Profile"
          width={48}
          height={48}
          className="w-32 h-32 rounded-full mb-4 object-cover"
        />
      )}

      <p className="text-lg font-semibold">Name: {user.name}</p>
      <p className="text-gray-600">Bio: {user.bio}</p>
    </div>
  );
}
