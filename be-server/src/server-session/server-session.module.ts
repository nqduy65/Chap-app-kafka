import { Module } from '@nestjs/common';
import { ServerSessionService } from './server-session.service';
import { ServerSessionResolver } from './server-session.resolver';

@Module({
  providers: [ServerSessionService, ServerSessionResolver],
})
export class ServerSessionModule {}
