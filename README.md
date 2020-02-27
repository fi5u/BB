## TODO

- [x] Profile edit page – change email, etc
- [x] Handle login with email when has FB account and no password
- [x] Forgot password link
- [x] Prettify
- [x] Log page views
- [x] Fix `unknown props` warnings
- [x] Clean up server dir
- [x] Log from server directory
- [x] Config file
- [x] Localization
- [x] Allow lang override
- [x] Add user language to logging
- [x] Build logout route
- [x] Implement Rollup import aliases
- [x] Create a client fetch helper function
- [ ] Remove serviceUrl from fetch calls
- [ ] Colorize dev terminal output
- [ ] Add external id to UUID format
- [ ] Add window error handler
- [ ] Theming
- [ ] Tests
- [ ] Upload to remote location
- [ ] Analytics

# Authentication logic

- Login route calls Passport local strategy.
- On success, generate an JWT access token with a short expiry (5 min.).
- Save the access token to the response cookie with Same site set to strict.
- When navigating to protected routes, call an authentication api, that checks the access token cookie and if valid, returns a user object.
- When accessing protected api, check the access token cookie and if valid, allow access to api.
