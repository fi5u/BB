<script>
  export let emailAddress = "";

  import Form from "../form/Form.svelte";

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

  function submit(event) {
    event.preventDefault();
  }
</script>

<Form bind:form={verifyForm} onsubmit={submit} />
