# TODO - Authentication wiring (backend APIs)

## Step 1
- [x] Fix frontend login response parsing to use backend `accessToken` + `user` correctly.

## Step 2
- [x] Persist `localStorage.token` as accessToken (so ProtectedRoute + axios interceptor work).

## Step 3
- [x] Wire logout to call backend `POST /auth/logout` before clearing localStorage.


## Step 4
- [ ] Quick manual test: login -> token stored -> protected routes accessible.

