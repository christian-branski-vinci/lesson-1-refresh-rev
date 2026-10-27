import type { Expense } from "../types/Expense";

interface ExpenseItemProps {
  expense: Expense;
}

function ExpenseItem({ expense }: ExpenseItemProps) {
  return (
    <div className="expense-item">
      <h3>Expense {expense.id}</h3>
        <p>Date: {expense.date}</p>
        <p>Description: {expense.description}</p>
        <p>Amount: {expense.amount.toFixed(2)}</p>
        <p>Payer: {expense.payer}</p>
    </div>
  );
}

export default ExpenseItem;