// /app/components/UpdateNickName.tsx

'use client';

import { useState } from 'react';
import { useChat } from '../context/ChatContext';
import axiosInstance from '../utils/axiosConfig';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

export default function UpdateNickName() {
  const router = useRouter();

  const { selectedContact, setSelectedContact } = useChat();
  const [nickName, setNickName] = useState(selectedContact?.nickName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!selectedContact) return null;

  const handleUpdate = async () => {
    if (!nickName.trim()) {
      setError('Nickname cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('jwt');
      const response = await axiosInstance.put(
        '/api/profile/updateNickName',
        { mobile: selectedContact.mobile, nickName },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSelectedContact({
        ...selectedContact,
        nickName: response.data.nickName,
      });
      setSuccess('Nickname updated successfully');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Failed to update nickname');
      } else {
        setError('Failed to Update nickName');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 bg-gray-800 rounded-xl shadow-lg ring-1 ring-gray-700 text-gray-200 p-4 divide-y divide-gray-700">
      <h3 className="text-white text-lg font-semibold mb-2">Update Nickname</h3>
      <input
        type="text"
        value={nickName}
        onChange={(e) => setNickName(e.target.value)}
        placeholder="Enter new nickname"
        className="w-full p-2 mb-2 rounded bg-gray-700 text-white focus:outline-none"
      />
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="w-full p-2 rounded bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500"
      >
        {loading ? 'Updating...' : 'Update'}
      </button>
      {error && <p className="text-red-400 mt-2">{error}</p>}
      {success && <p className="text-green-400 mt-2">{success}</p>}
    </div>
  );
}
