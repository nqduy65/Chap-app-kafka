import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput, SignInRecipe } from './auth.recipe';

@Resolver()
export class AuthResolver {
  constructor(@Inject(AuthService) private userService: AuthService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation(() => SignInRecipe, { name: 'signIn' })
  async signIn(
    @Args({ name: 'signInInput' }) signInInput: SignInInput,
  ): Promise<SignInRecipe> {
    return await this.userService.signIn(signInInput.userName);
  }
}
