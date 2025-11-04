// /app/components/ChatWindow.tsx

'use client';

import { useChat } from '../context/ChatContext';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ChatView from './ChatView';
import UpdateNickName from '../UpdateNickName/page';

export default function ChatWindow() {
  const { selectedContact, currentUser } = useChat();
  const [isNickNameSaverOpen, setIsNickNameSaverOpen] = useState(false);
  const [contactImgSrc, setContactImgSrc] = useState(
    selectedContact?.profileUrl ||
      'https://placehold.co/150x150/1f2937/d1d5db?text=User',
  );
  const [isContactOnline, setIsContactOnline] = useState(false);

  const toggleRef = useRef<HTMLDivElement>(null);

  // Update contact image when selectedContact changes
  useEffect(() => {
    if (selectedContact?.profileUrl) {
      setContactImgSrc(selectedContact.profileUrl);
    }
  }, [selectedContact]);

  // Close nickname popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setIsNickNameSaverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedContact || !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen-dvh w-full bg-gray-900 text-gray-400">
        <div className="text-center">
          <h2 className="text-xl mb-2">Select a contact to start chatting</h2>
          <p className="text-sm">
            Choose someone from your contact list to begin a conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen-dvh w-full bg-gray-900 text-white relative">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gray-800 flex-shrink-0 relative">
        {/* Contact Button */}
        <div ref={toggleRef} className="relative">
          <button
            onClick={() => setIsNickNameSaverOpen(!isNickNameSaverOpen)}
            className="flex items-center space-x-3"
          >
            <Image
              src={contactImgSrc}
              alt={selectedContact.nickName || 'profile image'}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
              onError={() =>
                setContactImgSrc(
                  'https://placehold.co/150x150/1f2937/d1d5db?text=User',
                )
              }
            />
            <div className="flex flex-col">
              <h2 className="self-start text-lg font-semibold truncate">
                {selectedContact.nickName}
              </h2>
              <p className="text-xs text-gray-400 truncate max-w-[200px]">
                {selectedContact.bio || 'Online 1hr ago'}
              </p>
            </div>
          </button>

          {/* Floating UpdateNickName */}
          {isNickNameSaverOpen && (
            <div className="absolute top-full mt-2 left-0 z-50">
              <UpdateNickName />
            </div>
          )}
        </div>

        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          <span
            className={`text-xs ${isContactOnline ? 'text-green-400' : 'text-red-400'}`}
          >
            {isContactOnline ? 'Online' : 'Offline'}
          </span>
          <div
            className={`w-3 h-3 rounded-full ${isContactOnline ? 'bg-green-500' : 'bg-red-500'}`}
            title={isContactOnline ? 'Online' : 'Offline'}
          />
        </div>
      </div>

      {/* Chat View Component */}
      <ChatView
        selectedContact={selectedContact}
        currentUser={currentUser}
        onConnectionChange={setIsContactOnline}
      />
    </div>
  );
}
