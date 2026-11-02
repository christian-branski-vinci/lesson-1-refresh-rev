import type { Expense, NewExpense, ExpenseFilter } from "../types/Expense.ts";
import { db } from "../prisma/db.ts";
import { populate } from "../seed.ts";
import { Temporal } from "temporal-polyfill";

export class ExpensesService {
  public static async getExpenses(filter: ExpenseFilter = {}): Promise<Expense[]> {
    try {
      let query = db.orm.public.Expense
        .include("participants", (p) => p.include("user"))
        .include("payer");

      if (filter.amount !== undefined) {
        const min = filter.amount;
        query = query.where((expense) => expense.amount.gte(min));
      }

      const rows = await query.all();
      return rows.map((row) => ({
        id: row.id,
        date: row.date.toString(),
        amount: row.amount,
        description: row.description,
        payerId: row.payerId,
        payer: row.payer,
        participants: row.participants.map((p) => p.user),
      }));
    } catch (error) {
      console.error("Error getting expenses:", error);
      throw error;
    }
  }

  public static async addExpense(newExpense: NewExpense): Promise<Expense> {
    try {
      const created = await db.orm.public.Expense.create({
        description: newExpense.description,
        amount: newExpense.amount,
        date: Temporal.Instant.from(`${newExpense.date.slice(0, 10)}T00:00:00Z`),
        payerId: newExpense.payerId,
        participants: (mutator) =>
          mutator.create(newExpense.participants.map((userId) => ({ userId }))),
      });
      if (!created) {
        throw new Error("Failed to create expense");
      }

      const expense = await db.orm.public.Expense
        .where({ id: created.id })
        .include("participants", (p) => p.include("user"))
        .include("payer")
        .first();

      return {
        id: expense!.id,
        date: expense!.date.toString(),
        amount: expense!.amount,
        description: expense!.description,
        payerId: expense!.payerId,
        payer: expense!.payer,
        participants: expense!.participants.map((p) => p.user),
      };
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  }

  public static async resetExpenses(): Promise<Expense[]> {
    try {
      await populate();
      return await this.getExpenses();
    } catch (error) {
      console.error("Error resetting expenses:", error);
      throw error;
    }
  }
}