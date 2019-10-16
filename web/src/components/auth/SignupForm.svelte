<script>
  import * as sapper from "@sapper/app";

  import Form from "../form/Form.svelte";

  export let emailAddress = "";
  export let submittedForm;

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

    const response = await fetch("/api/auth/signup", {
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

    const data = await response.json();

    if (data.errors) {
      console.log("got errors..");
      data.errors.forEach(error => {
        const i = signupForm.findIndex(
          item => item.id === `signup-${error.field}`
        );

        signupForm[i].errorMessage = error.error;
      });
    } else {
      if (data.user) {
        submittedForm(data.user);
      } else {
        console.log("No errors, but no user!!");
        console.log(data);
      }
    }
  }
</script>

<Form bind:form={signupForm} onsubmit={submit} />
