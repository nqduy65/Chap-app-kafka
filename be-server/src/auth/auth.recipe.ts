import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SignInInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  userName: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  password: string;
}

@ObjectType()
export class SignInRecipe {
  @Field()
  userId: number;
}
