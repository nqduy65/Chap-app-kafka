import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'graphql.schema.gql'),
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      useGlobalPrefix: true,
      // uploads: false,
      introspection: true,
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
      formatError(error) {
        const originalError = error.extensions?.originalError;
        if (originalError)
          return {
            message: originalError['message'],
            code: originalError['error'],
            status: originalError['statusCode'],
          };
        return {
          message: error.message,
          code: error.extensions?.status || 400,
          status:
            error.extensions?.code !== 'GRAPHQL_VALIDATION_FAILED'
              ? error.extensions?.code !== 'INTERNAL_SERVER_ERROR'
                ? error.extensions?.code
                : 'BAD_REQUEST'
              : 'BAD_REQUEST',
        };
      },
    }),
  ],
})
export class GraphModule {}
