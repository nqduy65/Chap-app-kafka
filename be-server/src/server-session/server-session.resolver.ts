import { Inject } from '@nestjs/common';
import {
  // Args,
  //  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { ServerSessionService } from './server-session.service';
import { ServerRecipe } from './server-session.recipe';

@Resolver()
export class ServerSessionResolver {
  constructor(
    @Inject(ServerSessionService)
    private serverSessionService: ServerSessionService,
  ) {}

  @Query(() => ServerRecipe)
  getAServerSocket(): ServerRecipe {
    const server = this.serverSessionService.getAServerSocket();
    return { server: server };
  }
}
