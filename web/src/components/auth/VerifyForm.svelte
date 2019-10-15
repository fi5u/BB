<script>
  import { goto, stores } from "@sapper/app";
  import Form from "../form/Form.svelte";
  import fetch from "cross-fetch";

  export let emailAddress;
  export let handleFormSubmitted;

  const { session } = stores();

  let verifyForm = [
    {
      autocomplete: "current-password",
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

    const user = await response.json();

    handleFormSubmitted(user);

    // const response = await fetch("/login", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     email: verifyForm,
    //     password: event.target[1].value
    //   })
    // });
    // if (response.status === 201) {
    //   // Sets the User to true in the Store so we do not have to refresh the page.
    //   session.set({ user: true });
    // }

    // session.set({ user: true });

    // goto("/app");
  }
</script>

<Form bind:form={verifyForm} onsubmit={handleSubmit} />
<a href="/app">App</a>
