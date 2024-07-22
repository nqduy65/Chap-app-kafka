// import { User } from './typeorm';
import { Socket } from 'socket.io';

type User = {
  userId: number;
};

export interface AuthenticatedSocket extends Socket {
  user?: User;
}
