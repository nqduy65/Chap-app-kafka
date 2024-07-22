'use client';
import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/zustand/store';
import { useCookies } from 'next-client-cookies';
import { Message } from '../types';

interface PageProps {
  params: {
    conversationId: string;
  };
}

export default function Conversation({ params }: PageProps) {
  const toUserId = params.conversationId;
  const cookies = useCookies();
  const originalUserId = JSON.parse(
    cookies.get('userId') ?? ''
  )?.userId.toString();
  const [message, setMessage] = useState<string>('');
  const { socket } = useStore((state) => state);
  const [messageStore, setMessageStore] = useState<
    Map<string, Map<Date, Message>>
  >(new Map());
  const [onlineUsers, setOnlineUsers] = useState<Map<string, string>>(
    new Map()
  );

  const handleOnlineUsers = (onlineUsers: Array<[string, string]>) => {
    setOnlineUsers(new Map(onlineUsers));
  };

  const handleMessageStore = (messageStore: {
    conversationId: string;
    messages: Array<[Date, Message]>;
  }) => {
    const updatedMessages = new Map(messageStore?.messages);
    setMessageStore((prevStore) =>
      new Map(prevStore).set(messageStore?.conversationId, updatedMessages)
    );
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('online_user', handleOnlineUsers);
    socket.on('receive_message', handleMessageStore);

    return () => {
      socket.off('online_user', handleOnlineUsers);
      socket.off('receive_message', handleMessageStore);
    };
  }, [socket, originalUserId, toUserId, messageStore]);

  useEffect(() => {
    if (!socket) return;

    const convId = handleConversationId(originalUserId, toUserId);
    socket.emit('get_messages', { conversationId: convId });

    socket.on('get_messages', handleMessageStore);

    return () => {
      socket.off('get_messages', handleMessageStore);
    };
  }, [socket, originalUserId, toUserId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socket && message.trim()) {
      socket.emit('send_message', {
        fromUserId: originalUserId,
        toUserId: toUserId,
        fromSocketId: socket.id,
        toSocketId: onlineUsers.get(toUserId),
        message: message,
        sendAt: Date(),
      });
    }
    setMessage('');
  };

  const handleConversationId = (userA: string, userB: string): string => {
    if (userA > userB) {
      return `${userA}-${userB}`;
    }
    return `${userB}-${userA}`;
  };

  console.log(messageStore);

  const renderMessages = useMemo(() => {
    const convId = handleConversationId(originalUserId, toUserId);
    const messages = messageStore.get(convId);

    if (!messages) return null;

    return Array.from(messages.entries()).map(([sendAt, message], index) => {
      if (message.userId === originalUserId) {
        return (
          <div key={index} className="col-start-6 col-end-13 p-3 rounded-lg">
            <div className="flex items-center justify-start flex-row-reverse">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                {originalUserId}
              </div>
              <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                <div>{message.message}</div>
                <div className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500">
                  Seen
                </div>
              </div>
            </div>
          </div>
        );
      } else if (message.userId === toUserId) {
        return (
          <div key={index} className="col-start-1 col-end-8 p-3 rounded-lg">
            <div className="flex flex-row items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                {toUserId}
              </div>
              <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                <div>{message.message}</div>
              </div>
            </div>
          </div>
        );
      }
      // return null;
    });
  }, [originalUserId, toUserId, messageStore]);

  return (
    <div className="flex flex-col flex-auto h-screen p-6 ">
      <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
        <div className="flex flex-col h-full overflow-x-auto mb-4">
          <div className="flex flex-col h-full">
            <div className="grid grid-cols-12 gap-y-2">{renderMessages}</div>
          </div>
        </div>
        <form
          className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
          onSubmit={handleSubmit}
        >
          <div className="flex-grow ml-4">
            <div className="relative w-full">
              <input
                type="text"
                className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
              />
            </div>
          </div>
          <div className="ml-4">
            <button
              type="submit"
              className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
            >
              <span>Send</span>
              <span className="ml-2">
                <svg
                  className="w-4 h-4 transform rotate-45 -mt-px"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
