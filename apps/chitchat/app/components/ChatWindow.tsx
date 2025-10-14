// /app/components/ChatWindow.tsx

'use client';

import { useChat } from '../context/ChatContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ChatView from './ChatView';

export default function ChatWindow() {
  const { selectedContact, currentUser } = useChat();

  const [contactImgSrc, setContactImgSrc] = useState(
    selectedContact?.profileUrl ||
      'https://placehold.co/150x150/1f2937/d1d5db?text=User',
  );
  const [isConnected, setIsConnected] = useState(false);

  // Update contact image when selectedContact changes
  useEffect(() => {
    if (selectedContact?.profileUrl) {
      setContactImgSrc(selectedContact.profileUrl);
    }
  }, [selectedContact]);

  // If no contact is selected, show nothing (or a placeholder)
  if (!selectedContact || !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-900 text-gray-400">
        <div className="text-center">
          <h2 className="text-xl mb-2">Select a contact to start chatting</h2>
          <p className="text-sm">Choose someone from your contact list to begin a conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gray-800 flex-shrink-0">
        <button className="flex items-center space-x-3">
          {/* Contact Profile Image */}
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

          {/* Contact Name and Bio */}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold truncate">
              {selectedContact.nickName}
            </h2>
            <p className="text-xs text-gray-400 truncate max-w-[200px]">
              {selectedContact.bio || 'Online 1hr ago'}
            </p>
          </div>
        </button>

        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          <span className={`text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          <div
            className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
            title={isConnected ? 'Connected' : 'Disconnected'}
          />
        </div>
      </div>

      {/* Chat View Component - Handles all message logic */}
      <ChatView 
        selectedContact={selectedContact}
        currentUser={currentUser}
        onConnectionChange={setIsConnected}
      />
    </div>
  );
}
