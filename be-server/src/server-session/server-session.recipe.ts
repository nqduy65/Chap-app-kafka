import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ServerRecipe {
  @Field()
  server: string;
}
