// app/chat/page.tsx

'use client';

import { ChatProvider } from '../context/ChatContext';
import { useState } from 'react';
import { useChat } from '../context/ChatContext';
import SideBar from '../components/SideBar';
import ChatWindow from '../components/ChatWindow';


// Inner component that uses the ChatContext
function ChatPageContent() {
  const { selectedContact, currentUser } = useChat();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  return (
    <div className="flex h-screen lg:pl-[400px] lg:pr-[400px] bg-gradient-to-br from-gray-50 via-purple-400 to-black relative overflow-hidden">
      {/* 📱 Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSideBarOpen(!isSideBarOpen)}
        className="absolute top-4 left-2 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-md md:hidden focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform active:scale-95"
      >
        {isSideBarOpen ? '✕' : '☰'}
      </button>

      {/* 🧭 SideBar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white border-r shadow-xl rounded-r-2xl transform
          transition-transform duration-300 ease-in-out
          ${isSideBarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:w-[32%] lg:w-[28%] sm:w-[32%] md:rounded-none
        `}
      >
        <SideBar
          onSelect={() => {
            setIsSideBarOpen(false);
          }}
        />
      </div>

      {/* 💬 Chat Window Area */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 md:ml-0 transition-all duration-300 pl-8 sm:p-0 md:p-0 md:pl-0">
        {selectedContact && currentUser ? (
          <div className="w-full h-full bg-white md:rounded-xl shadow-md md:shadow-lg overflow-hidden flex flex-col transition-all duration-300">
            <ChatWindow />
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

      {/* 🕶️ Mobile Overlay when SideBar open */}
      {isSideBarOpen && (
        <div
          className="fixed inset-0 h-screen bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSideBarOpen(false)}
        />
      )}
    </div>
  );
}

// Main page component that wraps everything with ChatProvider
export default function ChatPage() {
  return (
    <ChatProvider>
      <ChatPageContent />
    </ChatProvider>
  );
}
