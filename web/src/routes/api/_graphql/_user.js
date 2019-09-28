import gql from "graphql-tag";

export const ADD_USER = gql`
    mutation($email: String!, $password: String!) {
      addUser(email: $email, password: $password) {
        id
        email
      }
    }
  `;

export const GET_USER = gql`
    query($email: String!) {
      user(email: $email) {
        email,
        password
      }
    }
  `;
