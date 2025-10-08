// /app/components/ChatWindow.tsx

'use client';

import { useEffect, useState, useRef } from 'react';
import axiosInstance from '../utils/axiosConfig';
import socket from '../utils/socket';
import Image from 'next/image';

interface MessagePayload {
  content: string;
  mediaBase64?: string;
  mediaType?: string;
}
interface Message {
  id: string;
  content?: string;
  mediaUrl?: string;
  mediaType?: string;
  senderId: string;
  recipientId: string;
  timestamp: string;
}

export default function ChatWindow({
  currentUserId,
  otherUserId,
}: {
  currentUserId: string;
  otherUserId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Load chat history
  useEffect(() => {
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

  // Socket listeners
  useEffect(() => {
    socket.connect();
    socket.emit('join', currentUserId);
    socket.on('receive_message', (msg: Message) => {
      if (
        (msg.senderId === otherUserId && msg.recipientId === currentUserId) ||
        (msg.senderId === currentUserId && msg.recipientId === otherUserId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.disconnect();
      socket.off('receive_message');
    };
  }, [currentUserId, otherUserId]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Convert file to base64
  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // Send text/file
  const send = async () => {
    if (!newMessage.trim() && !file) return;

    const tempMsg: Message = {
      id: `temp~${Date.now()}`,
      content: newMessage.trim(),
      senderId: currentUserId,
      recipientId: otherUserId,
      timestamp: new Date().toISOString(),
      mediaUrl: file ? URL.createObjectURL(file) : undefined,
      mediaType: file ? file.type : undefined,
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const payload: MessagePayload = { content: newMessage.trim() };

      if (file) {
        const base64 = await toBase64(file);
        payload.mediaBase64 = base64;
        payload.mediaType = file.type;
      }

      const res = await axiosInstance.post(
        `/api/messages/send/${otherUserId}`,
        payload,
      );

      setMessages((prev) =>
        prev.map((m) => (m.id === tempMsg.id ? res.data : m)),
      );

      socket.emit('send_message', {
        recipientId: otherUserId,
        message: res.data,
      });

      setNewMessage('');
      setFile(null);
    } catch (err: unknown) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gray-800">
        <h2 className="text-lg font-semibold truncate">Chat</h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-900 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`w-fit max-w-[80%] md:max-w-[70%] lg:max-w-[60%] p-3 rounded-2xl break-words shadow-sm ${
              msg.senderId === currentUserId
                ? 'bg-blue-600 text-white self-end ml-auto'
                : 'bg-gray-700 text-gray-100 self-start mr-auto'
            }`}
          >
            {msg.mediaUrl ? (
              msg.mediaType?.startsWith('image') ? (
                msg.mediaUrl.startsWith('blob:') ? (
                  <Image
                    src={msg.mediaUrl}
                    alt="Media"
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                ) : (
                  <Image
                    src={msg.mediaUrl}
                    alt="Media"
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                )
              ) : msg.mediaType?.startsWith('video') ? (
                <video controls className="rounded-lg max-w-full h-auto">
                  <source src={msg.mediaUrl} type={msg.mediaType} />
                </video>
              ) : msg.mediaType?.startsWith('audio') ? (
                <audio controls className="w-full">
                  <source src={msg.mediaUrl} type={msg.mediaType} />
                </audio>
              ) : (
                <a
                  href={msg.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-300 hover:text-blue-400"
                >
                  Download {msg.mediaType}
                </a>
              )
            ) : (
              <p className="text-sm sm:text-base">{msg.content}</p>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-700 bg-gray-800 flex items-center gap-2 sm:gap-3">
        {/* File Upload Button */}
        <label className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 cursor-pointer transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 13.5V9.75A2.25 2.25 0 0 1 11.25 7.5h1.5A2.25 2.25 0 0 1 15 9.75V13.5m-6 0h6M9 13.5v3.75A2.25 2.25 0 0 0 11.25 19.5h1.5A2.25 2.25 0 0 0 15 17.25V13.5"
            />
          </svg>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>

        {/* Message Input Field */}
        <div className="flex-1 flex items-center bg-gray-900 border border-gray-700 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            className="flex-1 resize-none bg-transparent text-gray-100 placeholder-gray-500 text-sm sm:text-base focus:outline-none overflow-hidden"
          />

          {/* Send Button */}
          <button
            onClick={send}
            className="ml-2 bg-blue-600 hover:bg-blue-700 text-white p-2 sm:px-3 sm:py-2 rounded-full shadow-md transition-all active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={0}
              className="w-5 h-5 sm:w-6 sm:h-6"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
