<script>
  import * as sapper from "@sapper/app";
  import Form from "../form/Form.svelte";

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

  function submit(event) {
    event.preventDefault();

    // TODO: replace this with an actual check of the email in db
    if (emailCheckForm[0].value.indexOf("new") > -1) {
      // TODO: can we store this to the session, so we don't have to pass in url
      sapper.goto(`/continue/new?e=${emailCheckForm[0].value}`);
    } else {
      sapper.goto(`/continue/verify?e=${emailCheckForm[0].value}`);
    }
  }
</script>

<Form bind:form={emailCheckForm} onsubmit={submit} />
