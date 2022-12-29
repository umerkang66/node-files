import { gql } from '@apollo/client';

export const currentUserQuery = gql`
  query {
    currentUser {
      id
      email
    }
  }
`;
