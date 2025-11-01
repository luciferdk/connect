// /context/ChatContext.tsx

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Contact {
  id: string;
  nickName: string;
  profileUrl: string;
  bio: string;
  mobile: string;
}
interface User {
  id: string;
  name: string;
  profileUrl: string;
  bio: string;
}

interface ChatContextType {
  selectedContact: Contact | null;
  currentUser: User | null;
  setSelectedContact: (contact: Contact | null) => void;
  setCurrentUser: (user: User | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <ChatContext.Provider
      value={{
        selectedContact,
        setSelectedContact,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
}
