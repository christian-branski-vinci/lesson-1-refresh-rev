import { db } from "./src/prisma/db.ts";

const expense = await db.orm.public.Expense.create({
    description: "1st expense",
    payer: "payer1",
    amount: 23,
});

