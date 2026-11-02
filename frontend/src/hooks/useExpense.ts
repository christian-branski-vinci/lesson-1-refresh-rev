import type { Expense, newExpense } from '../types/Expense';
import { useCallback, useEffect, useState } from "react";


const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

interface UseExpensesResult {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  addExpense: (expense: newExpense) => Promise<void>;
  resetExpenses: () => Promise<void>;
  searchExpenses: (filter?: ExpenseFilter) => Promise<void>;
}

export interface ExpenseFilter {
  amount?: number;
  payerId?: number | string;
  categoryId?: number | string;
}
function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown error';
}

async function fetchAllExpenses(filter?: ExpenseFilter): Promise<Expense[]> {
  let url = `${API_BASE_URL}/expenses`;
  console.log("filter", filter);

  if (filter) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    }
    url += `?${params.toString()}`;
  }
  
  return fetch(url)
    .then((res) => res.json())
    .then((data) => (Array.isArray(data) ? (data as Expense[]) : []))
    .catch((error) => {
      console.error("Error getting expenses:", error);
      return [] as Expense[];
    });
}

function useExpenses():UseExpensesResult{
    
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);

    const fetchExpenses = useCallback(async()=> {
        try{
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/expenses`);
            if (!response.ok){
                throw new Error(`Fetch failed (${response.status})`)
            }

            const data = (await response.json()) as Expense[];
            setExpenses(data);
        }catch(err){
            setError(errorMessage(err));
        }finally {
            setLoading(false);
        }
    
    },[])


    useEffect(()=>{
        fetchExpenses();
    }, [fetchExpenses]);


    const addExpense= useCallback(
        async(expense: newExpense) =>{
            try{
                setError(null)
                const response = await fetch(`${API_BASE_URL}/expenses`,{
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(expense)
                });
                if (!response.ok){
                    throw new Error(`Fetch failed (${response.status})`)
                }
                await fetchExpenses();
            }catch(err){
                setError(errorMessage(err))
            }
        },
        [fetchExpenses]
    )

    const resetExpenses = useCallback(
        async() =>{
            try{
                setError(null);
                const response = await fetch(`${API_BASE_URL}/expenses/reset`, {method: 'POST'});
                if (!response.ok){
                    throw new Error(`Failed fetch ${response.status}`)
                }
                await fetchExpenses();
            }catch (err){
                setError(errorMessage(err))
            }
        },
        [fetchExpenses]
    )
    const searchExpenses = useCallback(async (filter?: ExpenseFilter): Promise<void> => {
        const results = await fetchAllExpenses(filter);
        setExpenses(results);
    }, []);

    return {expenses, loading,error, addExpense, resetExpenses, searchExpenses}
}

export default useExpenses;