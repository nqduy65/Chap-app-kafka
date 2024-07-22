'use client';

import SideChat from '@/components/SideChat';
import { useCookies } from 'next-client-cookies';
import { useStore } from '@/zustand/store';
import { useEffect, useState } from 'react';

export default function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { socket, connect } = useStore((state) => state);
  const [onlineUsers, setOnlineUsers] = useState<Map<string, string>>(
    new Map()
  );

  const cookies = useCookies();
  const userId = JSON.parse(cookies.get('userId') ?? '')?.userId;
  useEffect(() => {
    connect(userId);
  }, [connect, userId]);

  useEffect(() => {
    if (!socket) return;
    const handleOnlineUsers = (onlineUsers: Array<[string, string]>) => {
      setOnlineUsers(new Map(onlineUsers));
    };

    socket.on('online_user', handleOnlineUsers);

    return () => {
      socket.off('online_user', handleOnlineUsers);
    };
  }, [socket]);

  return (
    <div className="flex flex-row h-full w-full overflow-x-hidden antialiased text-gray-800">
      <SideChat onlineUsers={onlineUsers} userId={userId} />
      {children}
    </div>
  );
}
