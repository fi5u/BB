/**
 * Protect a route for a specific user type
 * @param {object} self Preload `this` object
 * @param {'visitor' | 'registered'} permittedUserType User type allowed for route
 * @param {object} user Current user in session
 */
export function protectRoute(self, permittedUserType, user) {
  if (user && permittedUserType === 'visitor') {
    return self.redirect(302, `/app`)
  }

  if (!user && permittedUserType === 'registered') {
    // TODO: save intended target page and redirect after login
    return self.redirect(302, `/continue/email`)
  }

  return { user }
}
