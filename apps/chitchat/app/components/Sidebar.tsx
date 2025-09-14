'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import axiosInstance from '../utils/axiosConfig';

interface Contact {
  id: string;
  name: string;
  profileUrl?: string;
  bio?: string;
}

export default function Sidebar({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ fetch logged-in user profile
        const userRes = await axios.get('/api/auth/verifyToken', {
          withCredentials: true,
        });
        setProfileUrl(userRes.data.profileUrl);

        // ✅ fetch contacts (use your API baseURL properly)
        const contactsRes = await axiosIntance.get('/api/messages/users');
        setContacts(contactsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-1/4 border-r p-4 overflow-y-auto">
      {/* Profile button */}
      <button
        onClick={() => router.push('/profile')}
        className="rounded-full shadow-lg hover:scale-105 transition"
      >
        <img
          src={profileUrl || '/Screen.png'} // fallback if no profile image
          alt="Profile"
          className="w-16 h-16 rounded-full border-2 border-white object-cover"
        />
      </button>

      <h2 className="text-lg font-semibold mb-2 mt-4">Your Contacts</h2>

      {contacts.map((c) => (
        <div
          key={c.id}
          onClick={() => onSelect(c.id)}
          className="cursor-pointer flex items-center gap-2 hover:bg-gray-100 p-2 rounded"
        >
          <img
            src={c.profileUrl || '/default.png'}
            alt={c.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-gray-500">{c.bio || 'No bio'}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
