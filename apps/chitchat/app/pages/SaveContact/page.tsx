'use client';

import { useState } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { useRouter } from 'next/navigation';

export default function AddContactPage() {
  const router = useRouter();
  const [nickname, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname || !mobile) {
      alert('Please enter both name and mobile number');
      return;
    }

    try {
      setLoading(true);

      // ✅ Call backend API
      await axiosInstance.post('/api/contact/addcontact', {
        nickname,
        mobile,
      });

      // ✅ Redirect on success
      router.push('/pages/ChatPage');
    } catch (err: any) {
      console.error('Error saving contact:', err);
      alert(err.response?.data?.message || 'Failed to save contact');
      router.push('/pages/ChatPage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSave}
        className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Add Contact</h1>

        <label className="block mb-2 font-medium">Name</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter name"
          required
        />

        <label className="block mb-2 font-medium">Mobile Number</label>
        <input
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter mobile number"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Contact'}
        </button>
      </form>
    </div>
  );
}
