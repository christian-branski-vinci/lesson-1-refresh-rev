import { useNavigate } from "react-router";
import type { NewExpense } from "../../types/Expense";
import ExpenseAdd from "../../components/ExpenseAdd";
import { graphqlRequest } from "../../lib/graphql";


const CREATE_EXPENSE = /* GraphQL */ `
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      id
    }
  }
`;


function ExpenseNew() {
    const navigate = useNavigate();

    const createExpense = async(expense: NewExpense) => {
        await graphqlRequest(CREATE_EXPENSE, {input: expense});
        navigate("/expenses");
    }
    return(
    <ExpenseAdd addExpense={createExpense}/>
    )
}

export default ExpenseNew;