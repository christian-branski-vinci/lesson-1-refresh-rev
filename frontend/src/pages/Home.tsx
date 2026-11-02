import ExpenseAdd from "../components/ExpenseAdd";
import ExpenseItem from "../components/ExpenseItem";
import ExpenseReset from "../components/ExpenseReset";
import ExpenseSearch from "../components/ExpenseSearch";
import useExpenses from "../hooks/useExpense";


function Home() {

    const {expenses, addExpense, resetExpenses, searchExpenses} = useExpenses();
    return(
        <>
        <h1> Manage Expenses</h1>
            <ExpenseAdd addExpense={addExpense} />
            <ExpenseReset resetExpenses={resetExpenses} />
            {expenses.length > 0 && <ExpenseSearch searchExpenses={searchExpenses} />}
            <ul>
                {expenses.map((expense) => (
                    <li key={expense.id}>
                        <ExpenseItem expense={expense} />
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Home;