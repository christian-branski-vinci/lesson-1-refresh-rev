import * as z from "zod";
import type { User } from "./user";

export interface Expense {
  id: number;
  date: string;
  description: string;
  payerId: number;
  payer: User;
  amount: number;
  participants: User[];
}

export const ExpenseFormSchema = z.object({
  description: z.string().min(1, "Description is required"),
  payerId: z.number().int().positive("Payer ID must be a positive integer"),
  amount: z.number().positive("Amount must be positive"),
  date: z.string().min(1, "Date is required"),
  participantsRaw: z.string(),
});




export type ExpenseFormValues = z.infer<typeof ExpenseFormSchema>;

export type newExpense = Omit<Expense, 'id' |'payer' | 'participants' | 'category'> & {
  participants: number[];
};