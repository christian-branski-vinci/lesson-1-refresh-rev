import { db } from "../prisma/db.ts";
import { type Category, categoryFromDBO } from "../types/category.ts";

export class CategoriesService {
    public static async getCategories(): Promise<Category[]> {
    

    const rows = await db.orm.public.Category.all();


    const categories = rows.map(categoryFromDBO);


    return categories;
}

    public static async getById(id:number): Promise<Category | undefined>{
        const row = await db.orm.public.Category.where({id}).first();
        return row ? categoryFromDBO(row) : undefined
    }
}