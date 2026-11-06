import { redirect, type LoaderFunctionArgs } from 'react-router';
import type { ExpenseListItem } from '../../types/Expense';
import { graphqlRequest } from '../../lib/graphql';
import { clearToken } from "../../lib/token.ts";

const EXPENSES_QUERY = /* GraphQL */ `
  query MyExpenses($filter: ExpenseFilter) {
    me {
      expenses(filter: $filter) {
        id
        description
        amount
        date
        payer { name }
        category { name colour }
      }
    }
  }
`;

export async function expenseListLoader({ request }: LoaderFunctionArgs): Promise<ExpenseListItem[]> {
  const params = new URL(request.url).searchParams;

  const filter = {
    amount: params.get('amount') ? Number(params.get('amount')) : undefined,
    payerId: params.get('payerId') ? Number(params.get('payerId')) : undefined,
    categoryId: params.get('categoryId') ? Number(params.get('categoryId')) : undefined,
  };

  const data = await graphqlRequest<{ me: { expenses: ExpenseListItem[] } | null }>(
    EXPENSES_QUERY,
    { filter }
  );

  // `me` answers null for an anonymous caller — and a caller whose token no
  // longer verifies *is* anonymous, as far as the server is concerned. The
  // route middleware only checked that a token existed; this is where we learn
  // it was not a good one.
  if (!data.me) {
    clearToken();
    throw redirect("/login");
  }

  return data.me.expenses;
}