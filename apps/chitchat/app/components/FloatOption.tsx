// app/components/FloatOption.tsx

'use client';

import { useRouter } from 'next/navigation';
import { logoutUser } from '../utils/logoutUser';

export default function FloatOption() {
  const router = useRouter();

  return (
    <div>
      <ul
        className="absolute top-[17px] right-[-120px] md:right-[-85px] lg:right-[-85px] m-2 w-40 sm:w-48 bg-gray-800 rounded-xl shadow-lg ring-1 ring-gray-700 z-50
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
            onClick={() => router.push('/SaveContact')}
            className="block w-full text-left px-4 py-2 hover:bg-gray-700 active:bg-gray-600 transition-colors duration-200"
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
    </div>
  );
}
