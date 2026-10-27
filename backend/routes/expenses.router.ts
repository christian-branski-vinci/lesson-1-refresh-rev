import express from "express";
import type { Expense } from "../types/Expense.ts";
import { ExpenseService } from "../service/expenses.service.ts";

const expensesRouter = express.Router();

expensesRouter.get("/",async (req, res) => {
    try {
        const expenses = await ExpenseService.getExpenses();
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
})

expensesRouter.post("/", async (req, res) => {
    try {
        const expense: Expense = req.body;
        /** 
        if (!isValidExpense(expense)) {
            return res.status(400).json({ error: "Invalid expense data" });
        }
        */
        const expenses = await ExpenseService.addExpense(expense);
        res.status(201).json(expenses);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});
/*
expensesRouter.post("/reset", (req, res)=> {
    try {
        const expenses = ExpenseService.resetExpenses();
        res.status(201).json(expenses);
    }catch(error){
        res.status(500).json({error: "server Error"})
    }
})
    */

export default expensesRouter;