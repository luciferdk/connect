// /app/components/ChatView.tsx

'use client';

import { useEffect, useState, useRef } from 'react';
import axiosInstance from '../utils/axiosConfig';
import socket from '../utils/socket';
import Image from 'next/image';
import ChatInput from './ChatInput';

interface Message {
  id: string;
  content?: string;
  mediaUrl?: string;
  mediaType?: string;
  senderId: string;
  recipientId: string;
  timestamp: string;
}

interface Contact {
  id: string;
  nickName: string;
  profileUrl?: string;
  bio?: string;
}

interface User {
  id: string;
}

interface ChatViewProps {
  selectedContact: Contact;
  currentUser: User;
  onConnectionChange: (connected: boolean) => void;
}

export default function ChatView({
  selectedContact,
  currentUser,
  onConnectionChange,
}: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isContactOnline, setIsContactOnline] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const currentUserId = currentUser?.id || '';
  const otherUserId = selectedContact?.id || '';

  //-------------------------Load chat history-------------------------------
  useEffect(() => {
    if (!otherUserId) return;

    async function fetchMessages() {
      try {
        const res = await axiosInstance.get(`/api/messages/${otherUserId}`);
        setMessages(res.data);
      } catch (err: unknown) {
        console.error('Failed to fetch messages', err);
      }
    }
    fetchMessages();
  }, [otherUserId]);

  //----------------------⚡Socket connection check------------------------------
  useEffect(() => {
    if (!socket || !currentUserId) {
      console.error('Socket is not available or user not logged in');
      return;
    }

    //-----------------------Connection event handlers-------------------------
    const handleConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);
      socket?.emit('join', currentUserId);
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    };

    const handleConnectError = (error: Error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    };

    const handleReceiveMessage = (msg: Message) => {
      console.log('Received message:', msg);
      if (
        (msg.senderId === otherUserId && msg.recipientId === currentUserId) ||
        (msg.senderId === currentUserId && msg.recipientId === otherUserId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    // listen for online/offline events
    const handleUserOnline = (userId: string) => {
      if (userId === otherUserId) setIsContactOnline(true);
    };

    const handleUserOffline = (userId: string) => {
      if (userId === otherUserId) {
        setTimeout(() => setIsContactOnline(false), 3000);
      }
    };

    const handleOnlineUsers = (users: string[]) => {
      setIsContactOnline(users.includes(otherUserId));
    };

    // Socket event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_online', handleUserOnline);
    socket.on('user_offline', handleUserOffline);
    socket.on('online_users', handleOnlineUsers);

    // Connect the socket
    socket.connect();

    // Cleanup
    return () => {
      if (socket) {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleConnectError);
        socket.off('receive_message', handleReceiveMessage);
        socket.off('user_online', handleUserOnline);
        socket.off('user_offline', handleUserOffline);
        socket.off('online_users', handleOnlineUsers);
        socket.disconnect();
      }
    };
  }, [currentUserId, otherUserId, onConnectionChange]);

  //--------------------Auto-scroll-------------------------------
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  //-------------- Message state management functions (for ChatInput) ----------------
  const addTempMessage = (tempMsg: Message) => {
    setMessages((prev) => [...prev, tempMsg]);
  };

  const updateMessage = (tempId: string, newMessage: Message) => {
    setMessages((prev) => prev.map((m) => (m.id === tempId ? newMessage : m)));
  };

  const removeTempMessage = (tempId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== tempId));
  };

  // ---------------- Sync status ----------------
  useEffect(() => {
    onConnectionChange(isContactOnline);
  }, [isContactOnline, onConnectionChange]);

  return (
    <div className="h-screen-dvh flex flex-col flex-1 overflow-hidden">
      {/* Chat Messages Display */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-900 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg mb-2">No messages yet</h3>
              <p className="text-sm">
                Start the conversation by sending a message below
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`w-fit max-w-[80%] md:max-w-[70%] lg:max-w-[60%] p-3 rounded-2xl break-words break-all overflow-hidden text-wrap shadow-sm whitespace-pre-wrap ${
                msg.senderId === currentUserId
                  ? 'bg-blue-600 text-white self-end ml-auto'
                  : 'bg-gray-700 text-gray-100 self-start mr-auto'
              }`}
            >
              {msg.mediaUrl ? (
                <div className="flex flex-col items-start space-y-2">
                  {msg.mediaType?.startsWith('image') ? (
                    <>
                      <Image
                        src={msg.mediaUrl}
                        alt="Media"
                        width={250}
                        height={250}
                        className="rounded-lg"
                        unoptimized={msg.mediaUrl.startsWith('blob:')}
                      />
                      <a
                        href={msg.mediaUrl}
                        download
                        className="px-3 py-1 hover:bg-rose-500 text-white rounded bg-blue-700 text-sm"
                      >
                        Download Image
                      </a>
                    </>
                  ) : msg.mediaType?.startsWith('video') ? (
                    <>
                      <video controls className="rounded-lg max-w-full h-auto">
                        <source src={msg.mediaUrl} type={msg.mediaType} />
                      </video>
                      <a
                        href={msg.mediaUrl}
                        download
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Download Video
                      </a>
                    </>
                  ) : msg.mediaType?.startsWith('audio') ? (
                    <>
                      <audio controls className="w-full">
                        <source src={msg.mediaUrl} type={msg.mediaType} />
                      </audio>
                      <a
                        href={msg.mediaUrl}
                        download
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Download Audio
                      </a>
                    </>
                  ) : (
                    <a
                      href={msg.mediaUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm underline"
                    >
                      Download {msg.mediaType || 'File'}
                    </a>
                  )}
                  {msg.content && (
                    <p className="text-sm sm:text-base mt-2">{msg.content}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm sm:text-base">{msg.content}</p>
              )}

              {/* Message timestamp */}
              <div
                className={`text-xs mt-1 opacity-70 ${
                  msg.senderId === currentUserId
                    ? 'text-blue-100'
                    : 'text-gray-400'
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input Component */}
      <ChatInput
        isConnected={isConnected}
        currentUserId={currentUserId}
        otherUserId={otherUserId}
        onAddTempMessage={addTempMessage}
        onUpdateMessage={updateMessage}
        onRemoveTempMessage={removeTempMessage}
      />
    </div>
  );
}
