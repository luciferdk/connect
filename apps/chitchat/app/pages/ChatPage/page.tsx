// app/chat/page.tsx


'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ChatWindow from '../../components/ChatWindow';
import axiosInstance from '../../utils/axiosConfig';

export default function ChatPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; profileUrl: string } | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axiosInstance.get('/api/auth/check');
        setCurrentUser(res.data.user);
      } catch (err) {
        console.error('Failed to load user Info', err);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-200 relative overflow-hidden">
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
          md:relative md:translate-x-0 md:w-[17%] md:rounded-none
        `}
      >
        <Sidebar
          onSelect={(id) => {
            setSelectedContactId(id);
            setIsSidebarOpen(false);
          }}
        />
      </div>

      {/* 💬 Chat Window Area */}
      <div
        className="
          flex-1 flex flex-col items-center justify-center bg-gray-100
          md:ml-0 transition-all duration-300 pl-8 sm:p-0 md:p-0 md:pl-0
        "
      >
        {selectedContactId && currentUser ? (
          <div
            className="
              w-full h-full bg-white md:rounded-xl shadow-md md:shadow-lg
              overflow-hidden flex flex-col transition-all duration-300
            "
          >
            <ChatWindow currentUserId={currentUser.id} otherUserId={selectedContactId} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <p className="text-gray-600 text-lg sm:text-xl md:text-2xl font-medium">
              Select a contact to start chatting 💬
            </p>
            <p className="text-sm sm:text-base text-gray-500">Your messages will appear here.</p>
          </div>
        )}
      </div>

      {/* ➕ Floating Add Contact Button */}
      <button
        onClick={() => router.push('../pages/SaveContact')}
        className="
          fixed top-2 right-2 md:top-4 md:right-4
          bg-blue-600 text-white font-semibold text-base sm:text-sm
          px-3 py-2 rounded-full shadow-xl
          hover:bg-blue-700 active:scale-95 transition-all duration-200
        "
      >
        + Add Contact
      </button>

      {/* 🕶️ Mobile Overlay when Sidebar open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
