'use client';

import { useEffect, useState } from 'react';
import api from '../utils/api';

interface Contact {
  id: string;
  name: string;
  profileUrl?: string;
  bio?: string;
}

export default function Sidebar({ onSelect }: { onSelect: (id: string) => void }) {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get('/messages/user'); // ✅ relative to your baseURL
        setContacts(res.data);
      } catch (err) {
        console.error('Error fetching contacts:', err);
      }
    };

    fetchContacts(); // ✅ Fixed call
  }, []);

  return (
    <div className="w-1/4 border-r p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">Contacts</h2>
      {contacts.map((c) => (
        <div
          key={c.id}
          onClick={() => onSelect(c.id)}
          className="cursor-pointer flex items-center gap-2 hover:bg-gray-100 p-2 rounded"
        >
          <img
            src={c.profileUrl || '/default.png'}
            alt={c.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-gray-500">{c.bio || 'No bio'}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
