import { Injectable } from '@nestjs/common';

export interface IServerSessionService {
  getAServerSocket(): string;
  setServerSocket(socketUrl: string): void;
  removeServerSocket(socketUrl: string): void;
  getSockets(): string[];
}

@Injectable()
export class ServerSessionService implements IServerSessionService {
  getSockets(): string[] {
    throw new Error('Method not implemented.');
  }
  private socketServerStore: string[] = ['http://localhost:8080'];
  getAServerSocket(): string {
    try {
      let socketServer = '';
      for (let i: number = 0; i < this.socketServerStore.length; i++) {
        socketServer = this.socketServerStore[0];
      }
      return socketServer;
    } catch (error) {}
  }
  setServerSocket(socketUrl: string): void {
    try {
      this.socketServerStore.push(socketUrl);
    } catch (error) {}
  }
  removeServerSocket(socketUrl: string): void {
    try {
      this.socketServerStore = this.socketServerStore.filter(
        (socket) => socket !== socketUrl,
      );
    } catch (error) {}
  }

  getServers(): string[] {
    return this.socketServerStore;
  }
}
