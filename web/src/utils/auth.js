/**
 * Submit signup / login form
 * @param {Event} event Submit event
 * @param {string} key Auth key
 * @param {object} inputData Email / password data
 * @param {object} formData Current form data
 * @param {(object) => void} success
 */
export async function submitAuthForm(key, inputData, formData, success) {
  const response = await fetch(`/api/auth/${key === 'verify' ? 'login' : key}`, {
    body: JSON.stringify(inputData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
  });

  const data = await response.json();

  if (data.errors) {
    data.errors.forEach(error => {
      const i = formData.findIndex(
        item => item.id === `${key}-${error.field}`
      );

      formData[i].errorMessage = error.error;
    });

    return formData
  } else {
    if (data.user) {
      success(data.user);

      return false
    } else {
      console.log("No errors, but no user!!");
      console.log(data);
    }
  }
}