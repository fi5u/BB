/**
 * Protect a route for a specific user type
 * @param {object} self Preload `this` object
 * @param {'visitor' | 'registered'} permittedUserType User type allowed for route
 * @param {boolean} [returnFullUser] Should return full user
 */
export async function protectRoute(
  self,
  permittedUserType,
  returnFullUser = false
) {
  // Get user for authorization
  const response = await self.fetch(
    `/api/auth${returnFullUser ? '?fulluser=1' : ''}`,
    {
      credentials: 'include',
    }
  )

  const { user } = await response.json()

  if (user && permittedUserType === 'visitor') {
    return self.redirect(302, `/app`)
  }

  if (!user && permittedUserType === 'registered') {
    // TODO: save intended target page and redirect after login
    return self.redirect(302, `/continue/email`)
  }

  return { user }
}
