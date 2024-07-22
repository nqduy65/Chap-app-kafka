import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { ServerSessionModule } from '../server-session/server-session.module';
import { ServerSessionService } from '../server-session/server-session.service';

@Module({
  imports: [ServerSessionModule],
  providers: [EventsGateway, ServerSessionService],
})
export class EventsModule {}
