import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://localhost:50051/graphql',
  cache: new InMemoryCache(),
});
