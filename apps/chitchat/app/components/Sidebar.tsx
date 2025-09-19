
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../utils/axiosConfig';


// This is the main Next.js page component.
// It fetches user and contact data and displays it in a sidebar layout.
export default function UserSidebar() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define the API endpoint for your backend
  const API_ENDPOINT = '/api/messages/users';

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch data from the backend API using Axios
        const response = await axiosInstance.get(API_ENDPOINT);

        // Axios wraps the response in a `data` property
        setData(response.data);
      } catch (e) {
        // Catch and set any errors that occur during the fetch
        setError(e.message);
      } finally {
        // Set loading to false once the fetch is complete
        setLoading(false);
      }
    }

    fetchData();
  }, []); // The empty dependency array ensures this runs once on component mount

  // Display a loading state while fetching data
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-100">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Display an error message if the fetch failed
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-400">
        <p className="text-center">Error: Failed to fetch data. Please check your backend server.</p>
      </div>
    );
  }

  // The main component content to be rendered after data is fetched
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900 font-sans">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col h-[600px] overflow-hidden">
        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-700 flex items-center space-x-4">
          <img 
            src={data.user.profileUrl || 'https://placehold.co/150x150/1f2937/d1d5db?text=User'} 
            alt={`${data.user.name}`} 
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 ring-2 ring-blue-500"
          />
          <div>
            <h2 className="text-xl font-bold text-white">{data.user.name}</h2>
            <p className="text-sm text-gray-400">My Profile</p>
          </div>
        </div>

        {/* Contacts List Section */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <ul className="space-y-4">
            {data.contacts.length > 0 ? (
              data.contacts.map((contact) => (
                <li key={contact.id} className="flex items-center space-x-4 p-3 hover:bg-gray-700 rounded-xl transition-colors duration-200 cursor-pointer">
                  <img 
                    src={contact.profileUrl || 'https://placehold.co/150x150/1f2937/d1d5db?text=Contact'} 
                    alt={`${contact.name}'s profile picture`} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500 transition-all"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">{contact.name}</h3>
                    <p className="text-sm text-gray-400">{contact.bio || 'No bio available.'}</p>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500 p-4">No contacts found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
