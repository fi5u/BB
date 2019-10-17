<script>
  import fetch from "cross-fetch";

  import Form from "../form/Form.svelte";

  export let emailAddress;
  export let handleFormSubmitted;

  let verifyForm = [
    {
      autocomplete: "current-password",
      errorMessage: "",
      id: "verify-password",
      label: "Password",
      placeholder: "Password",
      type: "password",
      value: ""
    },
    {
      id: "verify-button",
      label: "Log in",
      type: "submit"
    }
  ];

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await fetch("api/auth/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: emailAddress,
        password: verifyForm[0].value
      })
    });

    const data = await response.json();

    if (data.errors) {
      console.log("got errors..");
      data.errors.forEach(error => {
        const i = verifyForm.findIndex(
          item => item.id === `verify-${error.field}`
        );

        verifyForm[i].errorMessage = error.error;
      });
    } else {
      if (data.user) {
        handleFormSubmitted(data.user);
      } else {
        console.log("No errors, but no user!!");
        console.log(data);
      }
    }
  }
</script>

<Form bind:form={verifyForm} onsubmit={handleSubmit} />
<a href="/app">App</a>
