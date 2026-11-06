import { clearToken, getToken } from './token';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Only when there is one. A header reading "Bearer null" is worse than no
      // header at all: the server will try to verify it and fail.
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const { data, errors } = await response.json();

  if (errors?.length) {
    // The token is gone, expired, or was never any good. The server is the
    // authority on that, so this is where we find out.
    if (errors[0]?.extensions?.code === 'UNAUTHENTICATED') {
      clearToken();
      window.location.href = '/login';
    }

    // Use the status the server chose. `AppError` put it there precisely so the
    // client would not have to guess — a deliberate 403 should not reach the
    // user disguised as a 500.
    const status = Number(errors[0]?.extensions?.statusCode) || 500;
    throw new Response(errors[0].message, { status });
  }

  return data as T;
}