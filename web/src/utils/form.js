/**
 * Get a value from a form object using a key
 * @param {object} form Complete form object
 * @param {string} key Key from form to get
 */
export function getValueFromForm(form, key) {
  const formObject = form.find(item => item.id === key)

  if (formObject) {
    return formObject.value || ''
  }

  return ''
}

export function setValueInForm(form, key, updateObject) {
  const formObjectIndex = form.findIndex(item => item.id === key)

  if (formObjectIndex > -1) {
    form[formObjectIndex] = {
      ...form[formObjectIndex],
      ...updateObject,
    }
  }

  return form
}
