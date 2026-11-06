import { createSchema } from "graphql-yoga";
import { GraphQLError } from "graphql";
import { type Expense, parseNewExpense } from "../types/Expense.ts";
import { ExpensesService } from "../service/expenses.service.ts";
import { CategoriesService } from "../service/categories.service.ts";
import { UserService } from "../service/user.service.ts";
import {type GraphQLContext } from "../types/GraphQLContext.ts";
import { requireAuth } from './authHelpers.ts';


/**
 * The whole API surface, declared once.
 *
 * Compare this with the REST side: there, every screen that needs a different
 * shape needs its own route and its own mapping. Here the schema says what
 * *can* be asked, and each client picks the fields it wants.
 */
export const schema = createSchema<GraphQLContext>({
  typeDefs: /* GraphQL */ `
    type User {
      id: Int!
      name: String!
      email: String!
      # Nullable on purpose: not every user has given us a bank account.
      bankAccount: String
      expenses(filter: ExpenseFilter): [Expense!]!
    }

    type Category {
      id: Int!
      name: String!
      colour: String!
    }

    type Expense {
      id: Int!
      description: String!
      amount: Float!
      date: String!
      payer: User!
      participants: [User!]!
      category: Category
    }

    input ExpenseFilter {
      amount: Float
      payerId: Int
      categoryId: Int
    }

    type Query {
      me: User
      expenses(filter: ExpenseFilter): [Expense!]!
      expense(id: Int!): Expense
      users: [User!]!
      categories: [Category!]!
    }

    # One input type per mutation, named <MutationName>Input. Adding a field
    # later changes this block only, never the mutation's signature.
    input CreateExpenseInput {
      description: String!
      amount: Float!
      date: String!
      payerId: Int!
      participants: [Int!]!
      categoryId: Int
    }

    type Mutation {
      createExpense(input: CreateExpenseInput!): Expense!
    }
  `,
  resolvers: {
    Expense: {
      // Our business object carries a real Date. GraphQL's String scalar does
      // not know what to do with one, so we choose the wire format explicitly.
      date: (expense: Expense) => expense.date.toString(),
    },
    Query: {
      expenses: (_parent, args, ctx) => {
        requireAuth(ctx);
        return ExpensesService.getExpenses(args.filter ?? {});
      },
      expense: async (_parent, args, ctx) => {
        const user = requireAuth(ctx);

        const expense = await ExpensesService.getExpenseById(args.id);

        if (!expense) {
          throw new GraphQLError('Expense not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        // Check if user is involved in this expense (as payer or participant)
        const isInvolved =
          expense.payer?.id === user.userId ||
          expense.participants.some(p => p.id === user.userId);

        if (!isInvolved) {
          throw new GraphQLError("You don't have permission to view this expense", {
            extensions: { code: 'FORBIDDEN' },
          });
        }

        return expense;
      },

      // Same question, same answer. `users` hands out names, emails and bank
      // accounts; `categories` is harmless, but a stranger has no business
      // enumerating either.
      users: (_parent, _args, ctx) => {
        requireAuth(ctx);
        return UserService.getUsers();
      },
      categories: (_parent, _args, ctx) => {
        requireAuth(ctx);
        return CategoriesService.getCategories();
      },
    },
    Mutation: {
      createExpense: async (_parent, args, ctx) => {
        const user = requireAuth(ctx);

        // User can only create expenses where they are the payer
        if (user.userId !== args.input.payerId) {
          throw new GraphQLError('You can only create expenses that you paid for', {
            extensions: { code: 'FORBIDDEN' },
          });
        }

        const newExpense = parseNewExpense(args.input);
        if (newExpense === false) {
          throw new GraphQLError('Invalid expense');
        }
        return ExpensesService.addExpense(newExpense);
      },
    },
  },
});