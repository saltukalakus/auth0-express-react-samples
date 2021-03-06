# Sample 02 - Calling an External API

For this scenario, an API endpoint `/api/external` has been included in the Express server that requires a bearer token to be supplied as a bearer token in the `Authorization` header (as provided during the authentication flow). This uses the [`express-jwt`](https://github.com/auth0/express-jwt) middleware to validate the token against the identifier of your API as set up in the Auth0 dashboard, as well as checking that the signature is valid.

## Project setup

Use `yarn` or `npm` to install the project dependencies:

```bash
# Using npm..
npm install

# Using yarn..
yarn install
```

### Configuration

The project needs to be configured with your Auth0 domain and client ID in order for the authentication flow to work.

To do this, first copy `.env-sample` into a new file in the same folder called `.env`, and replace the values with your own Auth0 application credentials:

```bash
CLIENT_ID=YOUR_CLIENT_ID
CLIENT_SECRET=YOUR_CLIENT_SECRET
ISSUER_BASE_URL=https://YOUR_TENANT.[au|eu].auth0.com
BASE_URL=http://localhost:3000
SESSION_SECRET=supersecret
SESSION_NAME=YOUR_SESSION_NAME
API_URL=http://localhost:3001
API_AUDIENCE=YOUR_API_AUDIENCE
```

### Compiles and hot-reloads for development

This compiles and serves the React app, and starts the backend API server on port 3002. Calls to `http://localhost:3000/api/*` routes will be proxied through to the backend:

```bash
npm run dev
```

## Deployment

### Compiles and minifies for production

```bash
npm run build
```

### Run your tests

```bash
npm run test
```

## Frequently Asked Questions

This sample ilustrates samples for how to build a regular web appliction with React in the front-end. Applications also use the new express openid connect library.

## What is Auth0?

Auth0 helps you to:

- Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, among others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
- Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
- Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
- Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
- Analytics of how, when and where users are logging in.
- Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a Free Auth0 Account

1. Go to [Auth0](https://auth0.com/signup) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](https://auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](../LICENSE) file for more info.
