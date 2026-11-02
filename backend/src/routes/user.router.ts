import express from "express"
import { UserService } from "../service/user.service.ts"


const userRouter = express.Router()

userRouter.get("/", async(req,res)=>{
    try{
        const users = await UserService.getUsers();
        res.json(users);
    }catch(error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

export default userRouter