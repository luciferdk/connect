//app/components/Sidebar.tsx

'use client';

import { useChat } from '../context/ChatContext';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import Image from 'next/image';
import FloatOption from './FloatOption';

//---------- Interfaces ------------
interface Contact {
  id: string;
  name: string;
  nickName: string;
  profileUrl: string;
  bio: string;
  mobile: string;
}

interface UserData {
  user: {
    id: string;
    name: string;
    profileUrl: string;
    bio: string;
    mobile: string;
  };
  contacts: Contact[];
}

interface SideBarProps {
  onSelect?: () => void;
}

//----------------------------------
export default function UserSideBar({ onSelect }: SideBarProps) {
  const { setSelectedContact, setCurrentUser } = useChat();
  const [error, setError] = useState('');
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userImgSrc, setUserImgSrc] = useState(
    'https://placehold.co/150x150/1f2937/d1d5db?text=User',
  );
  const [imageErrorMap, setImageErrorMap] = useState<{ [id: string]: boolean }>(
    {},
  );

  const API_ENDPOINT = '/api/messages/users';

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // fetch user data
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get(API_ENDPOINT);
        setData(response.data);
        //console.log(response.data);
        //console.log("Fetched messages raw:", response.data);
        if (response.data?.user?.profileUrl) {
          setUserImgSrc(response.data.user.profileUrl);
        }
      } catch (err: unknown) {
        console.error('API call failed:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Set current user when data is loaded
  useEffect(() => {
    if (data?.user) {
      setCurrentUser({
        id: data.user.id,
        name: data.user.name,
        profileUrl: data.user.profileUrl,
        bio: data.user.bio,
      });
    }
  }, [data, setCurrentUser]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen-dvh bg-gray-900 text-gray-100">
        <p>Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen-dvh bg-gray-900 text-red-400">
        <p>Error: Failed to fetch data.</p>
      </div>
    );

  const handleSelectedContact = (contact: Contact) => {
    setSelectedContact({
      id: contact.id,
      nickName: contact.nickName,
      profileUrl: contact.profileUrl,
      bio: contact.bio,
      mobile: contact.mobile,
    });

    // Call onSelect callback to close sidebar on mobile
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <div className="h-screen-dvh sm:w-[19rem] w-[20rem] h-full bg-gray-800 text-white flex flex-col">
      {/* User Profile */}
      <div className="pl-[80px] pt-4 pb-4 pr-4 md:p-4 border-b border-gray-700 flex items-center space-x-4">
        <Image
          src={userImgSrc}
          alt={data?.user?.name ?? 'User Profile'}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
          onError={() =>
            setUserImgSrc(
              'https://placehold.co/150x150/1f2937/d1d5db?text=User',
            )
          }
        />

        <div className="relative">
          <h2 className="text-lg font-bold truncate">{data?.user.name}</h2>

          <button
            onClick={toggleMenu}
            className="text-sm text-blue-400 hover:bg-gray-600 active:bg-gray-600 bg-gray-700 rounded-full p-2"
          >
            My Profile
          </button>
        </div>
      </div>

      {/* Contacts */}
      <div className="flex-1 overflow-y-auto p-2">
        {menuOpen && <FloatOption />}
        <button className="block item-center p-2 text-sm hover:bg-sky-400 active:bg-sky-400 rounded-full bg-gray-700 m-2">
          Create group
        </button>
        <ul className="space-y-2">
          {data?.contacts?.length ? (
            data.contacts.map((contact) => {
              const imgSrc =
                imageErrorMap[contact.id] || !contact.profileUrl
                  ? 'https://placehold.co/150x150/1f2937/d1d5db?text=User'
                  : contact.profileUrl;

              return (
                <li
                  key={contact.id}
                  onClick={() => handleSelectedContact(contact)}
                  className="flex items-center space-x-3 p-2 border-b hover:bg-gray-700 rounded-xl transition cursor-pointer"
                >
                  <Image
                    src={imgSrc}
                    alt={contact.name}
                    width={48}
                    height={48}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={() =>
                      setImageErrorMap((prev) => ({
                        ...prev,
                        [contact.id]: true,
                      }))
                    }
                  />

                  <div className="overflow-hidden">
                    <h3 className="text-sm font-semibold text-gray-100 truncate">
                      {contact.nickName || contact.name}
                    </h3>
                    <p className="text-xs text-gray-400 truncate">
                      {contact.bio || 'No bio available.'}
                    </p>
                  </div>
                </li>
              );
            })
          ) : (
            <li className="text-center text-gray-500 p-4">
              No contacts found.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
