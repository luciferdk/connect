// app/chat/page.tsx

'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ChatWindow from '../../components/ChatWindow';
import axiosInstance from '../../utils/axiosConfig';


export default function ChatPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{id: string; name:string; profileUrl: string } | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  useEffect(() => {
  async function fetchUser() {
  try {
  const res = await axiosInstance.get('/api/auth/check');
  setCurrentUser(res.data.user);
  } catch (err) {
  console.error('Failed to load user Info',err);
  }
  }
  fetchUser();
}, []);

  return (
    <div className="flex h-screen relative">
      {/* Sidebar with contact list */}
      <Sidebar onSelect={setSelectedContactId} />

      {/* If no contact selected → show placeholder */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        { selectedContactId && currentUser ? (
          <ChatWindow currentUserId={currentUser.id} otherUserId={selectedContactId} />
        ) : (
          <p className="text-gray-600 text-lg">Select a contact to start chatting</p>
        )}
      </div>

      {/* Floating Add Contact button */}
      <button
        onClick={() => router.push('../pages/SaveContact')}
        className="fixed top-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        + Add Contact
      </button>
    </div>
  );
}
