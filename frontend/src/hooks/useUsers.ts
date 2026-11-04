import { useEffect, useState } from "react";
import type { User } from "../types/user";
import { apiRequest } from "../lib/rest";





function useUsers(){
    const [users, setUsers]= useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        apiRequest<User[]>("/api/users")
            .then(setUsers)
            .catch((error)=>console.error("error:", error))
            .finally(()=> setLoading(false));
    }, []);

    return {users, loading};
}

export default useUsers;