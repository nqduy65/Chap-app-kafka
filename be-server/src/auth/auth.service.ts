import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class AuthService {
  private readonly users: User[] = [
    {
      userId: 1,
      userName: 'admin',
      passWord: '123456',
    },
    {
      userId: 2,
      userName: 'guest',
      passWord: '123456',
    },
    {
      userId: 3,
      userName: 'tester',
      passWord: '123456',
    },
  ];
  async signIn(userName?: string) {
    const user = this.users.find((user: User) => user.userName === userName);
    return { userId: user.userId };
  }
}
