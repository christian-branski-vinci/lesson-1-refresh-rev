import * as z from "zod";

export interface Expense {
  id: string;
  date: string;
  description: string;
  payer: string;
  amount: number;
}

export const ExpenseFormSchema = z.object({
  description: z.string().min(1, "description is required").max(200, "description must be less than 200 characters"),
  payer:z.enum(["Alice", "Bob"], { message: "payer must be Alice or Bob" }),
  amount: z.number().positive("amount must be positive"),
  date: z.string().min(1,"date is required"),
});

export type ExpenseFormValues = z.infer<typeof ExpenseFormSchema>

export type newExpense = Omit<Expense, "id">