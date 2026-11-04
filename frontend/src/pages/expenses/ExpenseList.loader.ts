import type { LoaderFunctionArgs } from 'react-router';
import type { ExpenseListItem } from '../../types/Expense';
import { graphqlRequest } from '../../lib/graphql';

const EXPENSES_QUERY = /* GraphQL */ `
  query Expenses($filter: ExpenseFilter) {
    expenses(filter: $filter) {
      id
      description
      amount
      date
      payer {
        name
      }
      category {
        name
        colour
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

  const data = await graphqlRequest<{ expenses: ExpenseListItem[] }>(EXPENSES_QUERY, { filter });
  return data.expenses;
}