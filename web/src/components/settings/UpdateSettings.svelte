<script>
  import { getContext } from "svelte";

  import Form from "../form/Form.svelte";
  import { updateUser } from "../../utils/auth";

  export let userStore;
  const user = $userStore;

  let updateSettingsForm = [
    {
      autocomplete: "name",
      errorMessage: "",
      id: "update-name",
      label: "Name",
      placeholder: "Name",
      type: "text",
      value: user.name
    },
    {
      autocomplete: "email",
      errorMessage: "",
      id: "update-email",
      label: "Email address",
      placeholder: "Email address",
      type: "email",
      value: user.email
    },
    {
      id: "update-button",
      label: "Save",
      type: "submit"
    }
  ];

  /**
   * Submit update settings form
   * @param event Submit event
   */
  async function submit(event) {
    event.preventDefault();

    const updateObject = {
      id: parseInt(user.id)
    };

    if (
      updateSettingsForm[0].value &&
      updateSettingsForm[0].value !== user.name
    ) {
      updateObject.name = updateSettingsForm[0].value;
    }

    if (
      updateSettingsForm[1].value &&
      updateSettingsForm[1].value !== user.email
    ) {
      updateObject.email = updateSettingsForm[1].value;
    }

    const { user: updatedUser, error } = await updateUser(updateObject);
    const notification = getContext("notification");

    if (updatedUser) {
      notification.createNotification("Settings updated!");

      userStore.update(prevValue => {
        const merged = {};

        // Loop through to merge, priority first order
        for (let key in updatedUser) {
          if (merged[key] === undefined || merged[key] === null) {
            merged[key] = updatedUser[key];
          }
        }

        for (let key in prevValue) {
          if (merged[key] === undefined || merged[key] === null) {
            merged[key] = prevValue[key];
          }
        }

        return merged;
      });
    } else {
      notification.createNotification(
        error || "Could not update settings at this time."
      );
    }
  }
</script>

<Form bind:form={updateSettingsForm} onsubmit={submit} />
