// /app/components/ChatInput.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import socket from '../utils/socket';

interface Message {
  id: string;
  content?: string;
  mediaUrl?: string;
  mediaType?: string;
  senderId: string;
  recipientId: string;
  timestamp: string;
}

interface MessagePayload {
  content: string;
  mediaBase64?: string;
  mediaType?: string;
}

interface ChatInputProps {
  isConnected: boolean;
  currentUserId: string;
  otherUserId: string;
  onAddTempMessage: (tempMsg: Message) => void;
  onUpdateMessage: (tempId: string, newMessage: Message) => void;
  onRemoveTempMessage: (tempId: string) => void;
}

export default function ChatInput({ 
  isConnected, 
  currentUserId, 
  otherUserId,
  onAddTempMessage,
  onUpdateMessage,
  onRemoveTempMessage
}: ChatInputProps) {
  const [newMessage, setNewMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Emoji categories
  const emojis = {
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔'],
    gestures: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
    hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥'],
    food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕'],
    symbols: ['❤️', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '✨', '⭐', '🌟', '💫', '✔️', '✅', '❌', '❎', '🔥', '💧', '💦']
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [newMessage]);

  //-----------------Handle file selection---------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      // Limit to 10 files maximum
      const limitedFiles = selectedFiles.slice(0, 10);
      setFiles(limitedFiles);
    }
  };

  //-----------------Remove file from selection---------------------
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  //-----------------Insert emoji at cursor position---------------------
  const insertEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
    // Focus back on textarea
    textareaRef.current?.focus();
  };

  //-----------------Convert file to base64---------------------
  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  //-----------------Send text/file/audio,video/image to someone----------------
  const handleSend = async () => {
    if (!newMessage.trim() && files.length === 0) return;
    if (!socket || !isConnected) {
      console.error('Socket not connected');
      return;
    }

    setIsSending(true);

    try {
      // Send each file with the message
      for (const file of files) {
        const tempMsg: Message = {
          id: `temp~${Date.now()}~${Math.random()}`,
          content: newMessage.trim(),
          senderId: currentUserId,
          recipientId: otherUserId,
          timestamp: new Date().toISOString(),
          mediaUrl: URL.createObjectURL(file),
          mediaType: file.type,
        };
        onAddTempMessage(tempMsg);

        try {
          const payload: MessagePayload = { content: newMessage.trim() };

          const base64 = await toBase64(file);
          payload.mediaBase64 = base64;
          payload.mediaType = file.type;

          const res = await axiosInstance.post(
            `/api/messages/send/${otherUserId}`,
            payload,
          );

          onUpdateMessage(tempMsg.id, res.data);

          socket.emit('send_message', {
            recipientId: otherUserId,
            message: res.data,
          });
        } catch (err: unknown) {
          console.error('Failed to send file message', err);
          onRemoveTempMessage(tempMsg.id);
        }
      }

      // Send text-only message if no files
      if (files.length === 0 && newMessage.trim()) {
        const tempMsg: Message = {
          id: `temp~${Date.now()}`,
          content: newMessage.trim(),
          senderId: currentUserId,
          recipientId: otherUserId,
          timestamp: new Date().toISOString(),
        };
        onAddTempMessage(tempMsg);

        try {
          const payload: MessagePayload = { content: newMessage.trim() };

          const res = await axiosInstance.post(
            `/api/messages/send/${otherUserId}`,
            payload,
          );

          onUpdateMessage(tempMsg.id, res.data);

          socket.emit('send_message', {
            recipientId: otherUserId,
            message: res.data,
          });
        } catch (err: unknown) {
          console.error('Failed to send text message', err);
          onRemoveTempMessage(tempMsg.id);
        }
      }

      // Clear input after sending
      setNewMessage('');
      setFiles([]);
    } finally {
      setIsSending(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      {/* Selected Files Preview */}
      {files.length > 0 && (
        <div className="px-3 py-2 bg-gray-800 border-t border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <span>Selected files ({files.length}/10):</span>
          </div>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2 text-sm"
              >
                <div className="flex flex-col">
                  <span className="truncate max-w-[150px]" title={file.name}>
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-300 ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t border-gray-700 bg-gray-800 flex items-end gap-2 sm:gap-3 flex-shrink-0">
        {/* File Upload Button */}
        <label className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 cursor-pointer transition flex-shrink-0">
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
              d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
            />
          </svg>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={isSending}
          />
        </label>

        {/* Emoji Button */}
        <div className="relative flex-shrink-0" ref={emojiPickerRef}>
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 transition"
            disabled={isSending}
          >
            <span className="text-xl">😊</span>
          </button>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-3 w-80 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 z-50">
              {Object.entries(emojis).map(([category, emojiList]) => (
                <div key={category} className="mb-3">
                  <h3 className="text-xs text-gray-400 uppercase mb-2 capitalize">
                    {category}
                  </h3>
                  <div className="grid grid-cols-8 gap-1">
                    {emojiList.map((emoji, idx) => (
                      <button
                        key={idx}
                        onClick={() => insertEmoji(emoji)}
                        className="text-2xl hover:bg-gray-700 rounded p-1 transition"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Input Field */}
        <div className="flex-1 flex items-end bg-gray-900 border border-gray-700 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isConnected ? 'Type a message...' : 'Connecting...'}
            disabled={!isConnected || isSending}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            className="flex-1 resize-none bg-transparent text-gray-100 placeholder-gray-500 text-sm sm:text-base focus:outline-none overflow-hidden disabled:opacity-50 min-h-[24px] max-h-[120px]"
            style={{ height: 'auto' }}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!isConnected || isSending || (!newMessage.trim() && files.length === 0)}
          className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full shadow-md transition-all active:scale-95 flex-shrink-0"
        >
          {isSending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={0}
              className="w-5 h-5"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
