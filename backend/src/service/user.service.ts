import { db } from "../prisma/db.ts";
import {type User, userFromDBO } from "../types/user.ts";

export class UserService{

    public static async getUsers(): Promise<User[]>{
        return await db.orm.public.User.all()
    }

    public static async getById(id:number): Promise<User|undefined>{
        const row = await db.orm.public.User.where({id}).first();
        return row ? userFromDBO(row):undefined
    }
}

