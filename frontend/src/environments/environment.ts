/**
 * App configuration. The apiUrl points at our NestJS backend.
 * When we deploy, we'll swap this for the deployed API's address — same idea
 * as the backend's .env: keep environment-specific values in one place.
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
