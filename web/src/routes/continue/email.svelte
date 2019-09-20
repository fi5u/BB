<script>
  import * as sapper from "@sapper/app";
  import { mutate, restore, setClient, query } from "svelte-apollo";

  import { client } from "../_client";
  import EmailCheck from "../../components/auth/EmailCheck.svelte";

  setClient(client);

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
