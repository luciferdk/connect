'use client';

import { useState } from 'react';
import axios from 'axios';

interface ErrorsHai {
  response?: {
    data?: {
      // Safest catch-all: allows string, number, boolean, null, object, or array
      error?: string | number | boolean | object | null;
    };
  };
}

export default function UpdateProfile() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      if (profileImage) formData.append('profileImage', profileImage);

      // send to backend API
      await axios.put('/api/user/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // important if you use JWT in cookies
      });

      setMessage('Profile updated successfully!');
      setName('');
      setBio('');
      setProfileImage(null);
    } catch (error: unknown) {
      const errorHai = error as ErrorsHai;
      const rawError = errorHai.response?.data?.error;

      setMessage(rawError ? String(rawError) : 'Update failed');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Update Profile</h1>
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
          type="file"
          accept="image/*"
          onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
        />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded">
          Save Changes
        </button>
      </form>
      {message && <p className="mt-3 text-green-600">{message}</p>}
    </div>
  );
}
