'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// list of array for page along path
const NavList = [
  { name: 'Home', path: '/HomePage' },
  { name: 'Setting', path: '/settingPage' },
  { name: 'Profile', path: '/ProfilePage' },
  { name: 'Auth', path: '/AuthPage' },
  { name: 'Contact', path: '/contact' },
];

export default function NavBar() {
  const router = useRouter();
  // State to manage the menu toggle
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = (_prev: boolean) => {
    setIsOpen((prev) => !prev);
  };

  // Navigation handling function
  const handleNavigation = (path: string) => {
    try {
      router.push(path === '/' ? '/' : `../pages${path}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <nav className="bg-transparent p-3">
      {/* Main Container */}
      <div className="flex items-center justify-between flex-wrap">
        {/* First Div (Logo) */}
        <div
          className={`text-black font-bold flex-shrink-0 md:block ${isOpen ? 'hidden' : 'block'}`}
        >
          xDev
        </div>

        {/* Second Div (Nav Items) - Always Inline & Responsive */}
        <div
          className={`flex justify-center flex-wrap gap-1 sm:gap-2 flex-1 overflow-hidden ${isOpen ? 'block' : 'hidden'} md:flex`}
        >
          {NavList.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="text-black hover:bg-blue-500 py-1 px-2 sm:py-2 sm:px-3 rounded text-xs sm:text-sm"
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Third Div (Menu Toggle Button) */}
        <button
          onClick={() => toggleMenu(isOpen)}
          className="text-black flex-shrink-0 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
