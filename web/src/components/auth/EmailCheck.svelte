<script>
  import * as sapper from "@sapper/app";
  import gql from "graphql-tag";
  import { getClient, query } from "svelte-apollo";

  import Form from "../form/Form.svelte";

  export let submittedForm;

  const GET_USER = gql`
    query($email: String!) {
      user(email: $email) {
        email
      }
    }
  `;

  const client = getClient();

  let userData;

  let emailCheckForm = [
    {
      autocomplete: "email",
      id: "check-email",
      label: "Email address",
      placeholder: "Email address",
      type: "email",
      value: ""
    },
    {
      id: "check-email-button",
      label: "Next",
      type: "submit"
    }
  ];

  async function submit(event) {
    event.preventDefault();

    const response = await fetch(
      `/api/auth/email-check?email=${emailCheckForm[0].value}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );

    const { emailStatus } = await response.json();

    // userData = query(client, {
    //   query: GET_USER,
    //   variables: { email: emailCheckForm[0].value }
    // });

    // const result = await userData.result();

    // let userType = "new";
    // if (result.data.user) {
    //   // TODO: can we store this to the session, so we don't have to pass in url?
    //   userType = "current";
    // }

    submittedForm(emailStatus, emailCheckForm[0].value);
  }
</script>

<Form bind:form={emailCheckForm} onsubmit={submit} />
