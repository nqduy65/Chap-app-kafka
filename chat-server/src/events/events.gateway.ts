import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';
import { UseFilters } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat/chat.service';
import { Message } from '../types';

@UseFilters(new AllExceptionsFilter())
@WebSocketGateway(8080, { cors: '*', transports: ['websocket'] })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  onlineUsers = new Map<string, string>();

  messageStore = new Map<string, Map<Date, Message>>();

  constructor(private readonly chatService: ChatService) {}

  private emitOnlineUsers() {
    this.server.emit('online_user', Array.from(this.onlineUsers.entries()));
  }

  private emitMessageStore(userId: string, socket: Socket) {
    this.server.to(socket.id).emit('get_messages');
  }

  private handleConversationId(userA: string, userB: string): string {
    if (userA > userB) {
      return `${userA}-${userB}`;
    }
    return `${userB}-${userA}`;
  }

  handleDisconnect(socket: Socket) {
    const userId = [...this.onlineUsers.entries()].find(
      ([id, socketId]) => socketId === socket.id,
    )?.[0];
    if (userId) {
      this.onlineUsers.delete(userId);
      this.emitOnlineUsers();
    }
  }

  async handleConnection(socket: Socket) {
    console.log('A new connection is coming');
    const userId = socket.handshake.query.user as string;
    if (userId) {
      this.onlineUsers.set(userId, socket.id);
      this.emitOnlineUsers();
      this.emitMessageStore(userId, socket);
    }
  }

  @SubscribeMessage('get_messages')
  async getMessage(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    const { conversationId } = data;
    this.server.to(socket.id).emit('receive_message', {
      conversationId,
      messages: Array.from(this.messageStore.get(conversationId).entries()),
    });
  }

  @SubscribeMessage('send_message')
  async listenForMessage(@MessageBody() data: any) {
    const { fromUserId, toUserId, fromSocketId, toSocketId, message, sendAt } =
      data;
    const conversationId = this.handleConversationId(fromUserId, toUserId);
    // Ensure the nested Map for the conversation exists
    if (!this.messageStore.has(conversationId)) {
      this.messageStore.set(conversationId, new Map());
    }

    // Add the message to the conversation
    this.messageStore
      .get(conversationId)
      .set(sendAt, { userId: fromUserId, message: message });

    // Broadcast the message to both sender and receiver
    // Broadcast the message to both sender and receiver
    this.server.to(toSocketId).emit('receive_message', {
      conversationId,
      messages: Array.from(this.messageStore.get(conversationId).entries()),
    });
    this.server.to(fromSocketId).emit('receive_message', {
      conversationId,
      messages: Array.from(this.messageStore.get(conversationId).entries()),
    });
    console.log(this.messageStore);
  }
}
