
'use client';

import { useEffect, useState } from 'react';
import api from '../utils/api'; // Axios instance with withCredentials
import socket from '../utils/socket'; // Socket.IO client

interface Message {
  id: string;
  content?: string;
  mediaUrl?: string;
  mediaType?: string; // image, video, doc, audio
  senderId: string;
  recipientId: string;
  timestamp: string;
}

export default function ChatWindow({
  otherUserId,
  currentUserId,
}: {
  otherUserId: string;
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // 🔁 Load previous messages with this user
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${otherUserId}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch messages', err);
      }
    };

    fetchMessages();
  }, [otherUserId]);

  // 📡 Set up socket.io listeners
  useEffect(() => {
    socket.connect();

    // 👤 Join your own socket room
    socket.emit('join', currentUserId);

    // 🔁 Incoming message from another user
    socket.on('receive_message', (msg: Message) => {
      if (msg.senderId === otherUserId || msg.recipientId === otherUserId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // ✅ Confirmation of sent message
    socket.on('message_sent', (msg: Message) => {
      if (msg.recipientId === otherUserId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.disconnect(); // 👈 optional
      socket.off('receive_message');
      socket.off('message_sent');
    };
  }, [otherUserId, currentUserId]);

  // 🚀 Send message
  const send = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    try {
      const res = await api.post(`/messages/send/${otherUserId}`, {
        content: trimmed,
      });

      // 🔊 Emit via socket
      socket.emit('send_message', {
        recipientId: otherUserId,
        message: res.data,
      });

      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto space-y-2 border rounded p-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs p-2 rounded ${
              msg.senderId === currentUserId
                ? 'bg-blue-100 self-end'
                : 'bg-gray-100 self-start'
            }`}
          >
            {msg.mediaUrl ? (
              msg.mediaType?.startsWith('image') ? (
                <img
                  src={msg.mediaUrl}
                  alt="Media"
                  className="rounded max-w-full h-auto"
                />
              ) : (
                <a
                  href={msg.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Download {msg.mediaType}
                </a>
              )
            ) : (
              <p>{msg.content}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border px-4 py-2 rounded-l focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={send}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
