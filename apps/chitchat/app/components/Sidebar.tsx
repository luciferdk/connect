'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';

export default function UserSidebar() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_ENDPOINT = '/api/messages/users';

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
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-400">
        <p className="text-center">Error: Failed to fetch data.</p>
      </div>
    );

  return (
    <div className="flex justify-center min-h-screen py-[2px] px-2 sm:px-4 bg-gray-900">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg flex flex-col h-[calc(100vh-4px)] overflow-hidden">
        {/* User Profile */}
        <div className="p-4 border-b border-gray-700 flex items-center space-x-4 bg-gray-850">
          <img
            src={
              data.user.profileUrl ||
              'https://placehold.co/150x150/1f2937/d1d5db?text=User'
            }
            alt={data.user.name}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-blue-500 ring-2 ring-blue-500"
          />
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white truncate">
              {data.user.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">My Profile</p>
          </div>
        </div>

        {/* Contacts */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <ul className="space-y-3 sm:space-y-4">
            {data.contacts.length > 0 ? (
              data.contacts.map((contact: any) => (
                <li
                  key={contact.id}
                  className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 hover:bg-gray-700 rounded-xl transition-colors duration-200 cursor-pointer"
                >
                  <img
                    src={
                      contact.profileUrl ||
                      'https://placehold.co/150x150/1f2937/d1d5db?text=Contact'
                    }
                    alt={contact.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-transparent hover:border-blue-500 transition-all"
                  />
                  <div className="overflow-hidden">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-100 truncate">
                      {contact.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 truncate">
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
    </div>
  );
}
