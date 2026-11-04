import { useForm } from "react-hook-form"; 
import useUsers from "../hooks/useUsers";
import useCategories from "../hooks/useCategories";
import { useSearchParams } from "react-router";

interface SearchFormValues {
  amount?: number;
  payerId?: string;
  categoryId?: string;
}

function ExpenseSearch() {

    const [searchParams, setSearchParams] = useSearchParams();
    const { users } = useUsers();
    const { categories } = useCategories();

   const { register, handleSubmit, reset } = useForm<SearchFormValues>({
    defaultValues: {
      amount: searchParams.get("amount") ? Number(searchParams.get("amount")) : undefined,
      payerId: searchParams.get("payerId") ?? "",
      categoryId: searchParams.get("categoryId") ?? "",
    },
  });

     const onSubmit = (data: SearchFormValues) => {
        const filter: Record<string, string> = {};
        if (data.amount) filter.amount = String(data.amount);
        if (data.payerId) filter.payerId = data.payerId;
        if (data.categoryId) filter.categoryId = data.categoryId;
        setSearchParams(filter);
    };


    const onClear=() =>{
        reset({amount:undefined, payerId:"", categoryId:""});
        setSearchParams({})
    }

    return (
    <div>
      <h3>Search expenses</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="amount">Minimum amount</label>
        <input
          type="number"
          step="0.01"
          id="amount"
          placeholder="Filter by amount"
          {...register("amount", { valueAsNumber: true })}
        />

        <label htmlFor="payerId">Payer</label>
        <select id="payerId" {...register("payerId")}>
          <option value="">All payers</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <label htmlFor="categoryId">Category</label>
        <select id="categoryId" {...register("categoryId")}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button type="submit">Search</button>
        <button type="button" onClick={onClear}>
          Clear
        </button>
      </form>
    </div>
  );
}


export default ExpenseSearch