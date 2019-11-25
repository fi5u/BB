import gql from "graphql-tag";

export const ADD_USER = gql`
    mutation($email: String, $fbId: String, $name: String, $password: String, $salt: String) {
      addUser(email: $email, fbId: $fbId, name: $name, password: $password, salt: $salt) {
        id
        email
      }
    }
  `;

export const UPDATE_USER = gql`
    mutation($email: String, $id: Int, $name: String) {
      updateUser(email: $email, id: $id, name: $name) {
        id
        email
        name
      }
    }
  `;

export const GET_USER = gql`
    query($email: String, $fbId: String) {
      user(email: $email, fbId: $fbId) {
        email,
        fbId,
        id,
        name,
        password,
        salt
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
