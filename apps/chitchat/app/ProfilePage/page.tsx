// /ProfilePage
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useChat } from '../context/ChatContext';
import { useRouter }  from 'next/navigation';
import UpdateProfile from '../UpdateProfile/page';

interface UserProfile {
  id: string;
  name: string;
  bio: string;
  profileUrl: string; // optional
  mobile?: string; // Add mobile to match your context
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useChat(); // Get currentUser from context

const router = useRouter();


  useEffect(() => {
    // If we have currentUser in context, use that data
    if (currentUser) {
      const userProfile: UserProfile = {
        id: currentUser.id,
        name: currentUser.name,
        bio: currentUser.bio,
        profileUrl: currentUser.profileUrl,
        mobile: currentUser.mobile,
      };
      setUser(userProfile);
    }
    setLoading(false);
  }, [currentUser]);

  if (loading) return <p className="p-6">Loading...</p>;

  if (!user) return <p className="p-6">No user found</p>;

  return (
    <div className="flex flex-col sm:flex-row gap-8 items-center justify-center min-h-screen p-6">
    <div>
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
      {user.mobile && <p className="text-gray-600">Mobile: {user.mobile}</p>}
      </div>
      <div>
      <UpdateProfile />
      <button className='bg-[#6d8abb] p-2 m-2 boder-ring rounded-lg' onClick = { () => router.push('/')} >Go Back</button>
      </div>
    </div>
  );
}
