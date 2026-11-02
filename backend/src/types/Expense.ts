import { z } from "zod";
import {type UserDBO, userFromDBO, userSchema } from "./user.ts";
import {type CategoryDBO, categoryFromDBO, categorySchema } from "./category.ts";

// Type de lecture (ce que l'API renvoie)
export const expenseSchema = z.object({
  id: z.number().int().positive(),
  date: z.string(),
  description: z.string().min(1).max(200),
  amount: z.number().nonnegative(),
  payerId: z.number().int().positive(),
  payer: userSchema.optional(),
  participants: z.array(userSchema).default([]),
  categoryId: z.number().int().positive().optional(),
  category: categorySchema.optional(),
});

// Type d'écriture (ce que le front envoie)
export const newExpenseSchema = expenseSchema
  .omit({ id: true, payer: true, participants: true, category: true })
  .extend({
    participants: z.array(z.number().int().positive()).default([]),
});

export const expenseFilterSchema = z.object({
  amount: z.coerce.number().nonnegative().optional(),
  payerId: z.coerce.number().int().positive().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
});

export type Expense = z.infer<typeof expenseSchema>;
export type NewExpense = z.infer<typeof newExpenseSchema>;
export type ExpenseFilter = z.infer<typeof expenseFilterSchema>;

function parseWithSchema<T>(schema: z.ZodType<T>, data: unknown): T | false {
  const result = schema.safeParse(data);
  return result.success ? result.data : false;
}

export function parseExpenseFilter(data: unknown): ExpenseFilter | false {
  return parseWithSchema(expenseFilterSchema, data);
}

export function parseNewExpense(data: unknown): NewExpense | false {
  return parseWithSchema(newExpenseSchema, data);
}
function dateFromDBO(value: string): Date {
  const isoish = value.replace(" ", "T").replace(/([+-]\d{2})$/, "$1:00");
  return new Date(isoish);
}

/** The shape Prisma gives us for an `expense` row, with its relations included. */
export interface ExpenseDBO {
  id: number;
  date: string;
  description: string;
  amount: number;
  payerId: number;
  payer?: UserDBO;
  participants?: UserDBO[];
  categoryId: number | null;
  category?: CategoryDBO | null;
}

export function expenseFromDBO(dbo: ExpenseDBO): Expense {
  return {
    id: dbo.id,
    date: dateFromDBO(dbo.date).toString(),
    description: dbo.description,
    amount: dbo.amount,
    payerId: dbo.payerId,
    payer: dbo.payer ? userFromDBO(dbo.payer) : undefined,
    participants: (dbo.participants ?? []).map(userFromDBO),
    categoryId: dbo.categoryId ?? undefined,
    category: dbo.category ? categoryFromDBO(dbo.category) : undefined,
  };
}

/** The inverse direction: a Date the database will accept. */
export function dateToDBO(date: Date): string {
  return date.toISOString();
}