<script>
  import * as sapper from "@sapper/app";

  import Form from "../form/Form.svelte";

  export let submittedForm;

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
      `/api/auth/user?email=${emailCheckForm[0].value}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );

    const { user } = await response.json();

    submittedForm(user ? "current" : "new", emailCheckForm[0].value);
  }
</script>

<Form bind:form={emailCheckForm} onsubmit={submit} />
