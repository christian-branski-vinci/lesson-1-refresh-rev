import express from "express";
import type { Expense } from "../types/Expense.ts";
import { ExpensesService } from "../service/expenses.service.ts";
import { isValidNewExpense } from "../guards/expenses.guard.ts";

const expensesRouter = express.Router();

expensesRouter.get("/",async (req, res) => {
    try {
        const expenses = await ExpensesService.getExpenses();
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
})

expensesRouter.post("/", async (req, res) => {
    try {
        const expense: Expense = req.body;
         
        console.log("Received body:", req.body);
        if (!isValidNewExpense(req.body)) {
            return res.status(400).json({ error: "Invalid expense data", received: req.body });
        }
        if (!isValidNewExpense(expense)) {
            return res.status(400).json({ error: "Invalid expense data" });
        }

        const expenses = await ExpensesService.addExpense(expense);
        res.status(201).json(expenses);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

expensesRouter.post("/reset", (req, res)=> {
    try {
        const expenses = ExpensesService.resetExpenses();
        res.status(201).json(expenses);
    }catch(error){
        res.status(500).json({error: "server Error"})
    }
})


export default expensesRouter;