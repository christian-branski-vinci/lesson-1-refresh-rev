/**
 * A simple component to display an expense item
 */

import { Link } from "react-router";
import type {  ExpenseListItem } from "../types/Expense";

interface ExpenseItemProps {
  expense: ExpenseListItem;
}

function ExpenseItem({ expense }: ExpenseItemProps) {
   return (
    <div style={{border: '1px solid black', padding: '10px', marginBottom: '10px'}}>
      <h3>
          <Link to={`/expenses/${expense.id}`}>{expense.description}</Link>
      </h3>
      <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
      <p>Description: {expense.description}</p>
      {/* amount must be restricted to 2 decimal places */}
      <p>Amount: {expense.amount.toFixed(2)}</p>
      <p>Payer: {expense.payer.name}</p>
      {expense.category &&(
        <p style={{color: expense.category.colour}}>Category: {expense.category.name}</p>
      )}
    </div>
   );
}

export default ExpenseItem;