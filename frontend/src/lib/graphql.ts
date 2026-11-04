

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


export async function graphqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  const { data, errors } = await response.json();

  if (errors) {
    throw new Response(errors[0].message, { status: 500 });
  }
  return data as T;
}