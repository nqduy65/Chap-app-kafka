import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { GraphModule } from './infrastructure/graphql/graphql.module';
import { EventsModule } from './events/events.module';
import { ServerSessionModule } from './server-session/server-session.module';

@Module({
  imports: [EventsModule, ServerSessionModule, AuthModule, GraphModule],
})
export class AppModule {}
