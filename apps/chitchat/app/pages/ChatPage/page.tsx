'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import ChatWindow from '../../components/ChatWindow';

export default function ChatPage() {
  const router = useRouter();
  const [otherUserId, setOtherUserId] = useState<string | null>(null);

  const currentUserId = 'your-current-user-id'; // Replace with actual JWT decode

  return (
    <div className="flex h-screen relative">
      <Sidebar onSelect={(id) => setOtherUserId(id)} />
      {otherUserId ? (
        <ChatWindow otherUserId={otherUserId} currentUserId={currentUserId} />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          Select a user to chat
        </div>
      )}

      {/* Floating Add Contact button */}
      <button
        onClick={() => router.push('../pages/SaveContact')}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        + Add Contact
      </button>
    </div>
  );
}
