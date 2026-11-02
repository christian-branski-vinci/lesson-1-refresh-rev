import express from "express";
import { parseExpenseFilter, parseNewExpense } from "../types/Expense.ts";
import { ExpensesService } from "../service/expenses.service.ts";
import { UserService } from "../service/user.service.ts";
import { CategoriesService } from "../service/categories.service.ts";

const expensesRouter = express.Router();

expensesRouter.get("/", async (req, res) => {
  try {
    const filter = parseExpenseFilter(req.query);
    if (filter === false) {
      return res.status(400).json({ error: "filter invalid" });
    }

    if (filter.payerId !== undefined && !(await UserService.getById(filter.payerId))) {
      return res.status(404).json({ error: "Payer not found" });
    }
    if (filter.categoryId !== undefined && !(await CategoriesService.getById(filter.categoryId))) {
      return res.status(404).json({ error: "Category not found" });
    }

    const expenses = await ExpensesService.getExpenses(filter);
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

expensesRouter.post("/", async (req, res) => {
  try {
    const newExpense = parseNewExpense(req.body);
    if (newExpense === false) {
      return res.status(400).json({ error: "invalid Expense" });
    }
    if (!(await UserService.getById(newExpense.payerId))) {
      return res.status(404).json({ error: "payer id not found" });
    } 
    if (newExpense.categoryId !== undefined && !(await CategoriesService.getById(newExpense.categoryId))) {
      return res.status(404).json({ error: "Category not found" });
    }
    const expense = await ExpensesService.addExpense(newExpense);
    res.status(201).json(expense);
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

expensesRouter.post("/reset", async (req, res) => {
  try {
    const expenses = await ExpensesService.resetExpenses();
    res.status(201).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export default expensesRouter;