import { gql } from '@apollo/client';

export const SIGN_IN = gql`
  mutation Mutation($signInInput: SignInInput!) {
    signIn(signInInput: $signInInput) {
      userId
    }
  }
`;

// export const GET
