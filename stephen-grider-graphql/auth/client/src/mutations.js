import { gql } from '@apollo/client';

export const logoutMutation = gql`
  mutation {
    logout {
      id
      email
    }
  }
`;

export const signinMutation = gql`
  mutation signin($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
    }
  }
`;

export const signupMutation = gql`
  mutation signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      id
      email
    }
  }
`;
