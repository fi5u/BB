<script>
  import Form from "../form/Form.svelte";

  let signupForm = [
    {
      autocomplete: "email",
      id: "signup-email",
      label: "Email address",
      placeholder: "Email address",
      type: "email",
      value: ""
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

  function submit(event) {
    event.preventDefault();
  }
</script>

<Form bind:form={signupForm} onsubmit={submit} />
<p>Form: {JSON.stringify(signupForm)}</p>
