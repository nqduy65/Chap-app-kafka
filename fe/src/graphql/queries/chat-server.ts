import { gql } from '@apollo/client';

export const GET_SERVER_SOCKET = gql`
  query GetServerQuery {
    getAServerSocket {
      server
    }
  }
`;
