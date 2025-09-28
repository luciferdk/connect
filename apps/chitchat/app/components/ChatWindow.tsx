
'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import socket from '../utils/socket';
import { useParams } from 'react-router-dom';


interface Message {
  id: string;
  content?: string;
  mediaUrl?: string;
  mediaType?: string;
  senderId: string;
  recipientId: string;
  timestamp: string;
}

export default function ChatWindow({ otherUserId }: { otherUserId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const currentUserId = "me"; // TODO: replace with JWT decoded userId

  // Load chat history
  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await axiosInstance.get(`/messages/${otherUserId}`);
        setMessages(res.data);
      } catch (err) {
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
      if (msg.senderId === otherUserId || msg.recipientId === otherUserId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.disconnect();
      socket.off('receive_message');
    };
  }, [otherUserId]);

  // Send text / file
  const send = async () => {
    if (!newMessage.trim() && !file) return;

    try {
      let payload: any = { content: newMessage.trim() };

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await axiosInstance.post(`/messages/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        payload.mediaUrl = uploadRes.data.url;
        payload.mediaType = file.type;
      }

      const res = await axiosInstance.post(`/messages/send/${otherUserId}`, payload);

      socket.emit('send_message', { recipientId: otherUserId, message: res.data });

      setNewMessage('');
      setFile(null);
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen p-4 mb-[130]">
      {/* Chat history */}
      <div className="flex-1 overflow-y-auto space-y-2 border rounded p-2 pb-35">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs p-2 rounded ${
              msg.senderId === currentUserId ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'
            }`}
          >
            {msg.mediaUrl ? (
              msg.mediaType?.startsWith('image') ? (
                <img src={msg.mediaUrl} alt="Media" className="rounded max-w-full h-auto" />
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

      {/* Input */}
      <div className="mt-4 flex items-center space-x-2">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border px-2 py-1 rounded text-sm"
        />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border px-4 py-2 rounded focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={send}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
