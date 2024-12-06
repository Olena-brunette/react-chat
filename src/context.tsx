import React, { createContext, useState, ReactNode, useMemo } from 'react';

export interface User {
  id: string;
  login: string;
}

export interface Message {
  chatId: string;
  sender?: string;
  timestamp: number;
  content: string;
  id: string;
}

export interface Chat {
  id: string;
  title: string;
  owner: string;
  lastMessage: Message | null;
  createdAt: number;
  updatedAt: number;
}

interface ChatContextType {
  chats: Chat[];
  user: User | null;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  activeChatId: string;
  setActiveChatId: React.Dispatch<React.SetStateAction<string>>;
  activeChat?: Chat;
}

export const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [user, setUser] = useState<User | null>({
    login: 'anna test',
    id: '67521eb010491354b4f3f5eb',
  });
  const [activeChatId, setActiveChatId] = useState('');

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId),
    [chats, activeChatId],
  );

  return (
    <ChatContext.Provider
      value={{
        chats,
        user,
        setChats,
        setUser,
        activeChatId,
        setActiveChatId,
        activeChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
