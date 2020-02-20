/**
 * Hash a plain text password with a salt
 * @param {string} password Plain text password to hash
 * @param {string} salt String to hash password with
 * @returns {string} Hashed password
 */
export async function hashPassword(password, salt) {
  const passwordHashed = await crypto
    .createHash('sha256')
    .update(password)
    .update(salt)
    .digest('hex')

  return passwordHashed
}
