import { type Expense, type NewExpense, type ExpenseFilter, expenseFromDBO } from "../types/Expense.ts";
import { db } from "../prisma/db.ts";
import populate from "../seed.ts";
import { Temporal } from "temporal-polyfill";

export class ExpensesService {
  public static async getExpenses(filter: ExpenseFilter = {}): Promise<Expense[]> {
    try {
      let query = db.orm.public.Expense
        .include("participants")
        .include("payer")
        .include("category");

      if (filter.amount !== undefined) {
        const min = filter.amount;
        query = query.where((expense) => expense.amount.gte(min));
      }

      if (filter.payerId !==undefined){
        query = query.where({payerId: filter.payerId});
      }

      if (filter.categoryId !== undefined){
        query = query.where({categoryId: filter.categoryId})
      }

      const rows = await query.all();
      return rows.map(expenseFromDBO);
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
        date: Temporal.Instant.from(`${newExpense.date.slice(0, 10)}T00:00:00Z`).toString(),
        payerId: newExpense.payerId,
        participants: (mutator) =>
          mutator.connect(newExpense.participants.map((id) => ({ id }))),
      });
      if (!created) {
        throw new Error("Failed to create expense");
      }

      const expense = await db.orm.public.Expense
        .where({ id: created.id })
        .include("participants")
        .include("payer")
        .first();

      return {
        id: expense!.id,
        date: expense!.date.toString(),
        amount: expense!.amount,
        description: expense!.description,
        payerId: expense!.payerId,
        payer: expense!.payer,
        participants: expense!.participants.map((p) => p),
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