// app/chat/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ChatWindow from '../../components/ChatWindow';
import axiosInstance from '../../utils/axiosConfig';

// Define the selected contact type
interface SelectedContact {
  id: string;
  nickname: string;
  profileUrl: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  //storing toe data of user and the other selected user details to it can pass to other component
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    profileUrl: string;
  } | null>(null);

  // Store selected contact details (UPDATED type)
  const [selectedContact, setSelectedContact] =
    useState<SelectedContact | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axiosInstance.get('/api/auth/check');
        setCurrentUser(res.data.user);
      } catch (err: unknown) {
        console.error('Failed to load user Info', err);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="flex h-screen lg:pl-[400px] lg:pr-[400px] bg-gradient-to-br from-gray-50 via-purple-400 to-black relative overflow-hidden">
      {/* 📱 Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-4 left-2 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-md md:hidden focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform active:scale-95"
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* 🧭 Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white border-r shadow-xl rounded-r-2xl transform
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:w-[32%] lg:w-[28%] sm:w:[32%] md:rounded-none
        `}
      >
        <Sidebar
          onSelect={(contact) => {
            setSelectedContact(contact);
            setIsSidebarOpen(false);
          }}
        />
      </div>

      {/* 💬 Chat Window Area */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 md:ml-0 transition-all duration-300 pl-8 sm:p-0 md:p-0 md:pl-0">
        {selectedContact && currentUser ? (
          <div className="w-full h-full bg-white md:rounded-xl shadow-md md:shadow-lg overflow-hidden flex flex-col transition-all duration-300">
            <ChatWindow
              currentUserId={currentUser.id}
              otherUserId={selectedContact.id}
              contactInfo={{
                nickname: selectedContact.nickname,
                profileUrl: selectedContact.profileUrl,
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <p className="text-gray-600 text-lg sm:text-xl md:text-2xl font-medium">
              Select a contact to start chatting 💬
            </p>
            <p className="text-sm sm:text-base text-gray-500">
              Your messages will appear here.
            </p>
          </div>
        )}
      </div>

      {/* 🕶️ Mobile Overlay when Sidebar open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 h-screen bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
