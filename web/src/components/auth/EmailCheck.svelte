<script>
  import * as sapper from "@sapper/app";
  import Form from "../form/Form.svelte";

  import { getClient, query } from "svelte-apollo";
  import { GET_USER } from "../../data/queries/users";
  import { client } from "../../data/client";

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

    // const client = getClient();
    const result = await client.query({
      query: GET_USER,
      variables: {
        email: emailCheckForm[0].value
      }
    });

    console.log(result);
    console.log(result.data);
    // console.log(await user.result());

    // TODO: replace this with an actual check of the email in db
    if (!user /* emailCheckForm[0].value.indexOf("new") > -1 */) {
      // TODO: can we store this to the session, so we don't have to pass in url
      sapper.goto(`/continue/new?e=${emailCheckForm[0].value}`);
    } else {
      sapper.goto(`/continue/verify?e=${emailCheckForm[0].value}`);
    }
  }
</script>

<Form bind:form={emailCheckForm} onsubmit={submit} />
