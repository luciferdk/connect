//apps/pages/SaveContact/page.tsx
'use client';

import { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useRouter } from 'next/navigation';

interface ApiError {
  response?: {
    data?: {
      message?: string | number | boolean | object | null;
    };
  };
}

export default function AddContactPage() {
  const router = useRouter();
  const [nickName, setNickName] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: 'success' | 'error' | '';
  }>({
    text: '',
    type: '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage({ text: '', type: '' });

    if (!nickName || !mobile) {
      setMessage({
        text: 'Please enter both name and mobile number.',
        type: 'error',
      });
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post('/api/contact/addcontact', { nickName, mobile });

      setMessage({ text: 'Contact added successfully!', type: 'success' });

      setNickName('');
      setMobile('');
      setTimeout(() => router.push('/ChatPage'), 1200);
    } catch (err: unknown) {
      console.error('Error saving contact:', err);
      const apiError = err as ApiError;

      setMessage({
        text:
          (apiError.response?.data?.message as string) ||
          'Failed to save contact. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <form
        onSubmit={handleSave}
        className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md border border-gray-100 transition-transform duration-300 hover:scale-[1.01]"
      >
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Add New Contact
        </h1>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-gray-700">Name</label>
          <input
            type="text"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            className="w-full border-b bg-transparent rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 placeholder-gray-400 text-gray-800 transition"
            placeholder="Enter name"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">
            Mobile Number
          </label>
          <input
            type="tel"
            pattern="\d{10}"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full outline-none border-b bg-transparent rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 placeholder-gray-400 text-gray-800 transition"
            placeholder="Enter mobile number"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Contact'}
        </button>

        {message.text && (
          <p
            className={`mt-4 text-center text-sm font-semibold transition-all ${
              message.type === 'success'
                ? 'text-green-600 animate-pulse'
                : 'text-red-600'
            }`}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}
