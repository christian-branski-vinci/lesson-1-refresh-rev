import { useForm } from "react-hook-form";
import { ExpenseFormSchema, type ExpenseFormValues, type newExpense } from "../types/Expense";
import { zodResolver } from "@hookform/resolvers/zod";


interface ExpenseItemProps {
    addExpense: (expense: newExpense) => void;
}


function ExpenseAdd({ addExpense }: ExpenseItemProps) {
    const {register, handleSubmit, reset, formState: { errors },} = useForm<ExpenseFormValues>({
        resolver: zodResolver(ExpenseFormSchema),
    });

    const onSubmit =async (data: ExpenseFormValues) => {
        const newExpense: newExpense={
            description: data.description,
            payer: data.payer,
            amount: data.amount,
            date: data.date
        }
        await addExpense(newExpense);
        reset()
    };
    

    return(
        <div>
            <h2>Add Expense</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" {...register("description")} placeholder="Description"/>
                {errors.description && <span>{errors.description.message}</span>}

                <select {...register("payer")}>
                    <option value="">Choisir un payeur</option>
                    <option value="Alice">Alice</option>
                    <option value="Bob">Bob</option>
                </select>
                {errors.payer && <span>{errors.payer.message}</span>}

                <input type="number" step="0.01" {...register("amount", { valueAsNumber: true })} placeholder="Amount" />
                {errors.amount && <span>{errors.amount.message}</span>}

                <input type="text" {...register("date")} placeholder="Date"/>
                {errors.date && <span>{errors.date.message}</span>}

                <button type = "submit" className="btn btn-primary">Add</button>
            </form>
        </div>
    )
}

export default ExpenseAdd;