<script>
  export let emailAddress = "";
  export let submittedForm;

  import * as sapper from "@sapper/app";

  import Form from "../form/Form.svelte";

  let signupForm = [
    {
      autocomplete: "email",
      id: "signup-email",
      label: "Email address",
      placeholder: "Email address",
      type: "email",
      value: emailAddress
    },
    {
      autocomplete: "new-password",
      id: "signup-password",
      label: "Password",
      placeholder: "Minimum 8 characters",
      type: "password",
      value: ""
    },
    {
      id: "signup-button",
      label: "Sign up",
      type: "submit"
    }
  ];

  async function submit(event) {
    event.preventDefault();

    const response = await fetch("/signup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: emailAddress,
        password: signupForm[1].value
      })
    });

    submittedForm(response.ok ? "success" : "fail");
  }
</script>

<Form bind:form={signupForm} onsubmit={submit} />
