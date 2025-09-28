// app/chat/page.tsx

'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import ChatWindow from '../../components/ChatWindow';

export default function ChatPage() {
  const router = useRouter();
  const [otherUserId, setOtherUserId] = useState<string | null>(null);

  return (
    <div className="flex h-screen relative">
      {/* Sidebar with contact list */}
      <Sidebar onSelect={(id) => setOtherUserId(id)} />

      {/* If no contact selected → show placeholder */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        {otherUserId ? (
          <ChatWindow otherUserId={otherUserId} />
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
