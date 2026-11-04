import { useLoaderData, useNavigation } from "react-router";
import type { Expense} from "../../types/Expense";
import ExpenseSearch from "../../components/ExpenseSearch";
import ExpenseItem from "../../components/ExpenseItem";

function ExpenseList() {
    const expenses = useLoaderData() as Expense[];
    const navigation = useNavigation();
    const isFiltering = navigation.state ==="loading";

    return(
        <div>
            <h2>Your Expenses</h2>
            <ExpenseSearch />
            {isFiltering && <p>Updating</p>}

            {expenses.length===0 ? 
            (<p>No expense matching</p>): 
            (<ul className="expense-list">
                {expenses.map((expense)=> (
                    <li key={expense.id}>
                        <ExpenseItem expense={expense}/>
                    </li>
                ))}
            </ul>)}

        </div>
    )
}

export default ExpenseList;