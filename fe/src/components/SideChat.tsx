'use client';

import { useStore } from '@/zustand/store';
import { useEffect, useState } from 'react';
import { useCookies } from 'next-client-cookies';
import Link from 'next/link';

type SideChatProp = {
  onlineUsers: Map<string, string>;
  userId: number;
};

export default function SideChat({ onlineUsers, userId }: SideChatProp) {
  return (
    <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white h-screen flex-shrink-0">
      <div className="flex flex-row items-center justify-center w-full">
        <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            ></path>
          </svg>
        </div>
        <div className="ml-2 font-bold text-2xl">Ws Chat</div>
      </div>
      <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
        User Id: {userId}
      </div>
      <div className="flex flex-col mt-8">
        <div className="flex flex-row items-center justify-between text-xs">
          <span className="font-bold">List of Users</span>
          <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
            {onlineUsers.size - 1}
          </span>
        </div>
        <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
          {Array.from(onlineUsers.entries()).map(
            ([id, socketId]) =>
              userId.toString() !== id && (
                <div key={id}>
                  <Link
                    href={`/conversations/${id}`}
                    className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
                  >
                    <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
                      {id}
                    </div>
                    <div className="ml-2 text-sm font-semibold">{socketId}</div>
                  </Link>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
