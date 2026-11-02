import { z } from "zod";
import { userSchema } from "./user.ts";

// Type de lecture (ce que l'API renvoie)
export const expenseSchema = z.object({
  id: z.number().int().positive(),
  date: z.string(),
  description: z.string().min(1).max(200),
  amount: z.number().nonnegative(),
  payerId: z.number().int().positive(),
  payer: userSchema.optional(),
  participants: z.array(userSchema).default([]),
});

// Type d'écriture (ce que le front envoie)
export const newExpenseSchema = z.object({
  description: z.string().min(1).max(200),
  amount: z.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}/, "Invalid date"),
  payerId: z.number().int().positive(),
  participants: z.array(z.number().int().positive()).default([]),
});

export const expenseFilterSchema = z.object({
  amount: z.coerce.number().nonnegative().optional(),
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