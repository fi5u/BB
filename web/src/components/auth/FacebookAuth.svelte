<script>
  import asyncScriptLoader from "async-script-loader";
  import { onMount, createEventDispatcher } from "svelte";
  import { log } from "../../utils/logging";
  import { authSuccess } from "../../utils/auth";

  const dispatch = createEventDispatcher();

  const appId = "565561970918201";
  const version = "v4.0";

  let disabled = true;
  export let text = "Continue with Facebook";

  onMount(() => {
    asyncScriptLoader("https://connect.facebook.net/en_US/sdk.js")
      .then(() => {
        disabled = false;
        initialize();
      })
      .catch(fbLoadError => {
        log.error(`Facebook sdk load`, { error: fbLoadError.message });
      });
  });

  function initialize() {
    const FB = window["FB"];

    FB.init({
      appId: appId,
      cookie: true,
      xfbml: false,
      version: version
    });

    disabled = false;
  }

  function login() {
    const FB = window["FB"];
    FB.login(
      function(response) {
        if (response.status === "connected") {
          const authResponse = response.authResponse;
          const accessToken = authResponse.accessToken;

          log.info("Facebook login");

          FB.api("/me?fields=id,email,name", async function(fieldsResponse) {
            const email = fieldsResponse.email;
            const fbId = fieldsResponse.id;
            const name = fieldsResponse.name;

            log.info("Facebook authenticated", {
              email,
              fbId,
              name
            });

            const response = await fetch("/api/auth/facebook", {
              body: JSON.stringify({ email, fbId, name }),
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              method: "POST"
            });

            const { user } = await response.json();

            if (user) {
              authSuccess(user);

              dispatch("auth-success", { user });
            } else {
              log.error("Facebook auth no user", {
                email,
                fbId,
                name
              });
            }
          });
        } else {
          dispatch("auth-failure", { response });

          log.error("Facebook auth no connection", {
            status: response.status
          });
        }
      },
      { scope: "email, public_profile" }
    );
  }
</script>

<style>
  button {
    width: 100%;
    border: 0;
    background-color: #4285f4;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    padding: 5px 1px;
    cursor: pointer;
  }

  button:disabled {
    background-color: grey;
  }

  img {
    padding: 4px;
    height: 36px;
    width: 36px;
    border-radius: 2px;
    margin: 0;
  }

  span {
    font-family: Roboto, sans-serif;
    font-size: 14px;
    font-weight: bold;
    padding: 0 12px;
    color: white;
  }
</style>

<button on:click={login} {disabled}>
  <img
    src="data:image/png;base64,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"
    alt="Facebook" />
  <span>{text}</span>
</button>