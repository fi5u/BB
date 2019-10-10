<script>
  export let emailAddress = "";
  export let submittedForm;

  import * as sapper from "@sapper/app";

  import Form from "../form/Form.svelte";

  let signupForm = [
    {
      autocomplete: "email",
      errorMessage: "",
      id: "signup-email",
      label: "Email address",
      placeholder: "Email address",
      type: "email",
      value: emailAddress
    },
    {
      autocomplete: "new-password",
      errorMessage: "",
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
        email: signupForm[0].value,
        password: signupForm[1].value
      })
    });

    if (!response.ok) {
      // Get error message
      const data = await response.json();

      if (data.errors) {
        data.errors.forEach(error => {
          const i = signupForm.findIndex(
            item => item.id === `signup-${error.field}`
          );

          signupForm[i].errorMessage = error.error;
        });
      }
    }

    submittedForm(response.ok ? "success" : "fail");
  }
</script>

<Form bind:form={signupForm} onsubmit={submit} />
