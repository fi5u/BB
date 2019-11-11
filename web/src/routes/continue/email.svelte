<script context="module">
  import { protectRoute } from "../../utils/routes";

  export function preload(page, { user }) {
    return protectRoute(this, "visitor", user);
  }
</script>

<script>
  import { goto, stores } from "@sapper/app";

  import EmailCheck from "../../components/auth/EmailCheck.svelte";

  const { session } = stores();

  function submittedForm(userType, email) {
    $session.savedEmail = email;

    if (userType === "new") {
      goto("/continue/new");
    } else {
      goto("/continue/verify");
    }
  }
</script>

<svelte:head>
  <title>Continue with email • BB</title>
</svelte:head>

<p>Enter your email address to get going</p>
<EmailCheck {submittedForm} />
