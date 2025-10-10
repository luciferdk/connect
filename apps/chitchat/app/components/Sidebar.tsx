//app/componenets/Sidebar.tsx

'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { logoutUser } from '../utils/logoutUser';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

//---------- Interfaces ------------
interface Contact {
  id: string;
  name: string;
  nickname: string;
  profileUrl: string;
  bio: string | null;
  mobile: string;
}

interface UserData {
  user: {
    id: string;
    name: string;
    profileUrl: string;
  };
  contacts: Contact[];
}

//----------------------------------
export default function UserSidebar({
  onSelect,
}: {
  onSelect: (contact: {
    id: string;
    nickName: string;
    profileUrl: string;
  }) => void;
}) {
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
  const router = useRouter();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // featch user data
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get(API_ENDPOINT);
        setData(response.data);

        if (response.data?.user?.profileUrl) {
          setUserImgSrc(response.data.user.profileUrl);
        }
      } catch (err: unknown) {
        console.error('API call failed:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-100">
        <p>Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-400">
        <p>Error: Failed to fetch data.</p>
      </div>
    );

  return (
    <div className="sm:w-[19rem] w-[20rem] h-full bg-gray-800 text-white flex flex-col">
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

        <div>
          <h2 className="text-lg font-bold truncate">{data?.user.name}</h2>

          <button
            onClick={toggleMenu}
            className="text-sm text-blue-400 hover:bg-gray-400 activity:bg-gray-400 bg-gray-700 rounded-full p-2"
          >
            My Profile
          </button>

          {menuOpen && (
            <ul
              className="absolute top-[17] right-[-120] md:right-[-85] lg:right-[-85] m-2 w-40 sm:w-48 bg-gray-800 rounded-xl shadow-lg ring-1 ring-gray-700 z-50
                 text-gray-200 divide-y divide-gray-700"
            >
              <li>
                <button
                  onClick={() => router.push('/ProfilePage')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 active:bg-gray-600 transition-colors duration-200"
                >
                  View Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('../pages/SaveContact')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 active:bg-gray-600 transition-colors durtion-200"
                >
                  + Add Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => logoutUser(router)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 active:bg-gray-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Contacts */}
      <div className="flex-1 overflow-y-auto p-2">
        <button className="block item-center p-2 text-sm rounded-full hover:bg-sky-400 active:bg-sky-400 rounded-full bg-gray-700 m-2">
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
                  onClick={() =>
                    onSelect({
                      id: contact.id,
                      nickname: contact.nickname,
                      profileUrl: contact.profileUrl,
                    })
                  }
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
                      {contact.nickname || contact.name}
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
