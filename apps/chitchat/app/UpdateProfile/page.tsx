'use client';

import { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useRouter } from 'next/navigation';

interface ErrorsHai {
  response?: {
    data?: { message?: string };
  };
}

export default function UpdateProfile() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileUrl, setProfileUrl] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const formData = new FormData();
      if (name.trim()) formData.append('name', name);
      if (bio.trim()) formData.append('bio', bio);
      if (profileUrl.trim()) formData.append('profileUrl', profileUrl);
      if (profileImage) formData.append('profileImage', profileImage);

      if (formData.entries().next().done) {
        setMessage('Please enter at least one field to update.');
        setLoading(false);
        return;
      }

      const res = await axiosInstance.put(
        '/api/profile/updateMySelf',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        },
      );
      setMessage(res.data.message || 'Profile updated successfully!');
      setName('');
      setBio('');
      setProfileImage(null);
      setProfileUrl('');

      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error: unknown) {
      const errorHai = error as ErrorsHai;
      const rawError = errorHai.response?.data?.message;
      setMessage(rawError || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center flex-col p-3 max-w-md mx-auto">
      <h1 className="text-xl text-center font-bold mb-4">Update Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />

        <textarea
          placeholder="Your Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="url"
          placeholder="Profile Image URL (optional)"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
          className="border p-2 rounded"
        />

        <div className="text-center text-sm text-gray-500">or upload image</div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
        />

        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? 'bg-gray-400' : 'bg-blue-500'
          } text-white py-2 rounded`}
        >
          {loading ? 'Updating...' : 'Save Changes'}
        </button>
      </form>

      {message && <p className="mt-3 text-center text-green-600">{message}</p>}
    </div>
  );
}
