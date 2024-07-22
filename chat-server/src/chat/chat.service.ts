import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {
  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.query;
    if (!cookie) {
      throw new WsException('Invalid credentials.');
    }
    return;
  }
}
