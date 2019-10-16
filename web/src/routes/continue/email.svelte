<script>
  import * as sapper from "@sapper/app";

  import EmailCheck from "../../components/auth/EmailCheck.svelte";

  function submittedForm(userType, email) {
    if (userType === "new") {
      sapper.goto(`/continue/new?e=${email}`);
    } else {
      sapper.goto(`/continue/verify?e=${email}`);
    }
  }
</script>

<svelte:head>
  <title>Continue with email • Baby Book</title>
</svelte:head>

<p>Enter your email address to get going</p>
<EmailCheck {submittedForm} />
