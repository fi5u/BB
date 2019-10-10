/**
 * Validate an email address
 * @param {string} email Email address to validate
 */
export async function validateEmail(email) {
  const validator = await import(
    'email-validator'
  )

  return validator.validate(email)
}