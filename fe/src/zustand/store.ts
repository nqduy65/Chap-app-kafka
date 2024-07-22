import {
  SocketBroadcastMessage,
  SocketOnlineUser,
  SocketPrivateMessage,
} from '@/types';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import { createContext } from 'zustand-di';

export type SocketState = {
  socket: null | Socket;
  emitMode: keyof EmitModeDataTypes;
  setEmitMode: (mode: keyof EmitModeDataTypes) => void;
  emit: <T extends keyof EmitModeDataTypes>(
    event: T,
    data: EmitModeDataTypes[T]
  ) => void;
  connect: (userId: any) => void;
  disconnect: () => void;
};

type EmitModeDataTypes = {
  join: SocketOnlineUser;
  broadcast: SocketBroadcastMessage;
  private_message: SocketPrivateMessage;
};

const [Provider, useStore] = createContext<SocketState>();

const useSocketStore = () =>
  create<SocketState>((set, get) => {
    return {
      socket: null,
      emitMode: 'broadcast',
      setEmitMode: (mode: any) => {
        set({ emitMode: mode });
      },
      /**
       * Emits an event with data.
       *
       * @param event - The name of the event to emit.
       * @param data - The data to send along with the event.
       */
      emit: (event: any, data: any) => {
        const { socket }: any = get();
        if (!socket) return toast.error('Socket not connected');
        // This callback response needs to define on server at first.
        // Emit the event with the data and handle the response
        socket.emit(event, data, (response: { ok: boolean }) => {
          // Display an error message if response.ok is false
          if (!response.ok) toast.error('Something went wrong');
        });
      },
      /**
       * Connects to the socket server.
       */
      connect: async (userId) => {
        try {
          const response = await fetch(`/api/socket`);
          const jsonResponse = await response.json();
          const serverSocket = jsonResponse.server;
          console.log(serverSocket);
          const { socket }: any = get();
          if (serverSocket === undefined) {
            // Display error message if socket URL is undefined
            console.log('Socket URL is undefined');
            return toast.error('Socket URL is undefined');
          }
          if (socket) {
            console.log('Socket already connected', socket);
            // Display error message if socket is already connected
            toast.error('Socket already connected');
          } else {
            console.log('Connecting to socket', serverSocket);

            const socket = io(serverSocket, {
              query: {
                user: userId,
              },
              transports: ['websocket'],
            });
            socket
              .on('connect', () => {
                console.log('SOCKET CONNECTED!', socket.id);
                // Update the socket in the global state when connected
                set({ socket });
              })
              .on('disconnect', () => {
                console.log('SOCKET DISCONNECTED!');
                // Set socket to null in the global state when disconnected
                set({ socket: null });
              });
          }
        } catch (error) {
          toast.error('Failed to connect to api server');
        }
      },
      /**
       * Disconnects the socket if it is connected.
       * If the socket is not connected, displays an error message.
       */
      disconnect: () => {
        const { socket }: any = get();
        if (socket) {
          socket.disconnect();
          set({ socket: null });
        } else {
          toast.error('Socket not connected');
        }
      },
    };
  });

export { Provider, useStore, useSocketStore };
