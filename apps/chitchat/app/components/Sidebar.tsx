'use client';

import { useEffect, useState } from 'react';

import axiosInstance from '../utils/axiosConfig';

import { useNavigate } from 'react-router-dom';

import { useRouter } from 'next/navigation';

//---------- Interfaces ------------

interface Contact {
  id: string;
  name: string; // fallback if nickname missing
  nickname: string;
  profileUrl: string;
  bio: string | null;
  mobile: string;
}

interface UserData {
  user: {
    id: string;
    name: string;
    profileUrl: string;
  };
  contacts: Contact[];
}

//----------------------------------

export default function UserSidebar({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_ENDPOINT = '/api/messages/users';

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get(API_ENDPOINT);

        setData(response.data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-100">
        <p>Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-400">
        <p>Error: Failed to fetch data.</p>
      </div>
    );

  return (
    <div className="w-80 h-full bg-gray-800 text-white flex flex-col">
      {/* User Profile */}
      <div className="pl-[80px] pt-4 pb-4 pr-4 md:p-4 border-b border-gray-700 flex items-center space-x-4">
        <img
          src={
            data?.user.profileUrl ||
            'https://placehold.co/150x150/1f2937/d1d5db?text=User'
          }
          alt={data?.user.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
        />

        <div>
          <h2 className="text-lg font-bold truncate">{data?.user.name}</h2>

          <button
            onClick={() => router.push('../pages/ProfilePage')}
            className="text-xs text-gray-400"
          >
            My Profile
          </button>
        </div>
      </div>

      {/* Contacts */}

      <div className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-2">
          {data?.contacts?.length ? (
            data.contacts.map((contact) => (
              <li
                key={contact.id}
                onClick={() => onSelect(contact.id)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-xl transition cursor-pointer"
              >
                <img
                  src={
                    contact.profileUrl ||
                    'https://placehold.co/150x150/1f2937/d1d5db?text=Contact'
                  }
                  alt={contact.name}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div className="overflow-hidden">
                  <h3 className="text-sm font-semibold text-gray-100 truncate">
                    {contact.nickname || contact.name}
                  </h3>

                  <p className="text-xs text-gray-400 truncate">
                    {contact.bio || 'No bio available.'}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <li className="text-center text-gray-500 p-4">
              No contacts found.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
