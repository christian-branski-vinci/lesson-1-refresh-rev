import { useNavigate } from "react-router";
import ExpenseAdd, { type NewExpenseFormOutput } from "../../components/ExpenseAdd";
import { graphqlRequest } from "../../lib/graphql";
import { useAuth } from "../../contexts/AuthContext";


const CREATE_EXPENSE = /* GraphQL */ `
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      id
    }
  }
`;



function ExpenseNew() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const createExpense = async (expense: NewExpenseFormOutput) => {
    await graphqlRequest(CREATE_EXPENSE, {
      input: { ...expense, payerId: user!.id },
    });
    navigate("/expenses");
  };

  return <ExpenseAdd expenseAdd={createExpense} />;
}

export default ExpenseNew;