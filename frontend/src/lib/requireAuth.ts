import { redirect, type MiddlewareFunction } from 'react-router';

import { getToken } from './token';

export const requireAuth: MiddlewareFunction = ({ request }) => {
  if (!getToken()) {
    // Remember where they were going, so login can send them back there.
    const from = new URL(request.url).pathname;
    // Thrown, not returned: this abandons the navigation and starts a new one.
    // Same move as the `throw new Response(...)` you wrote in lesson 5.
    throw redirect(`/login?from=${encodeURIComponent(from)}`);
  }
};