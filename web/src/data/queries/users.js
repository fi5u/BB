import "cross-fetch/polyfill";
import { gql } from "apollo-boost";

export const GET_USERS = gql`
  {
    users {
      email
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($email: String!) {
    addUser(email: $email) {
      id
    }
  }
`