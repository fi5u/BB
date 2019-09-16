import "cross-fetch/polyfill";
import { gql } from "apollo-boost";

// export const GET_USER = gql`
//   {
//     getUser(email: $email) {
//       email
//       id
//     }
//   }
// `;

export const GET_USER = gql`
  query($email: String!) {
    getUser(email: $email) {
      email
      id
    }
  }
`;

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