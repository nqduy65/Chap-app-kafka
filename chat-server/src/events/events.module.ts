import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { ChatModule } from '../chat/chat.module';
import { ChatService } from '../chat/chat.service';
import { GatewaySessionManager } from './events.session';

@Module({
  imports: [ChatModule],
  providers: [EventsGateway, ChatService, GatewaySessionManager],
})
export class EventsModule {}
