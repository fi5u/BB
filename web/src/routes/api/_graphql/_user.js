import gql from "graphql-tag";

export const ADD_USER = gql`
    mutation($email: String!, $password: String!, $salt: String!) {
      addUser(email: $email, password: $password, salt: $salt) {
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

export const GET_USER_BY_ID = gql`
    query($id: Int!) {
      user(id: $id) {
        email,
        password
      }
    }
  `;
