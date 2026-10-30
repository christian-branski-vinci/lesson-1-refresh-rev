import fs from "fs";
import type { Expense, NewExpense } from "../types/Expense.ts";
import { db } from "../prisma/db.ts";

export class ExpenseService {
    private static dataPath = "./data/expenses.json";
    private static resetPath = "./data/expenses.init.json"

    public static async getExpenses(): Promise<Expense[]>{
        try {
            const rows = await db.orm.public.Expense.all()
            const expenses = rows.map((row: any)=>({
                id: row.id.toString(),
                date: row.date,
                amount: row.amount,
                description: row.description,
                payer: row.payer
            }));
            return expenses;
        }catch (err){
            console.error(err)
            throw err;
        }
    }

    public static async addExpense(newExpense: NewExpense): Promise<Expense>{
        /** 
        const expenses = this.readExpenses();
        const expense: Expense = {
            ... newExpense,
            id: (expenses.length +1).toString()
        };
        expenses.push(expense);
        this.saveExpenses(expenses);
        return expenses
        */
       try{
            const expense = await db.orm.public.Expense.create(newExpense);
            return {
                id: expense.id.toString(),
                date: expense.date,
                amount: expense.amount,
                description: expense.description,
                payer: expense.payer,
            }
       }catch (err){
            console.error(err)
            throw err;
        }
    }

    private static initialExpenses = [
    { date: "2025-01-16", description: "Example expense #1 from Alice", payer: "Alice", amount: 25.5 },
    { date: "2025-01-15", description: "Example expense #2 from Bob", payer: "Bob", amount: 35 },
    { date: "2025-01-15", description: "Example expense #3 from Alice", payer: "Alice", amount: 2 },
    ];

    public static async resetExpenses(): Promise<Expense[]> {
        try {
            const rows = await db.orm.public.Expense.all();
            for (const row of rows) {
                await db.orm.public.Expense.where({ id: row.id }).delete();
            }   
            
            for (const e of this.initialExpenses) {
                await db.orm.public.Expense.create(e);
            }

            return await this.getExpenses();
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    
/*
    public static resetExpenses(): Expense[] {
        this._resetExpenses();
        return this.readExpenses();
    }

    private static readExpenses(): Expense[] {
        try {
            const data = JSON.parse(fs.readFileSync(this.dataPath, "utf-8"));
                return data;
            } catch (error) {
                console.error("Error reading expenses file:", error);
            throw error;
        }
    }

    
    
    private static saveExpenses(expenses: Expense[]): void {
        try {
            fs.writeFileSync(this.dataPath, JSON.stringify(expenses, null, 2));
        } catch (error) {
            console.error("Error saving expenses file:", error);
            throw error;
        }
    }

    private static _resetExpenses(): void {
        try {
            const defaultExpenses: Expense[] = JSON.parse(fs.readFileSync(this.resetPath, "utf-8"));
            fs.writeFileSync(this.dataPath, JSON.stringify(defaultExpenses, null, 2));
        } catch (error) {
            console.error("Error resetting expenses file:", error);
            throw error;
        }
    }
    */
}
