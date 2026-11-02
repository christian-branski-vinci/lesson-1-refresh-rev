import { Router } from "express";
import { CategoriesService } from "../service/categories.service.ts";

const categoryRouter= Router()

categoryRouter.get("/", async (_req, res) => {
    try {

        const categories = await CategoriesService.getCategories();

        return res.status(200).json(categories);

    } catch (error) {
        console.error("ERROR:", error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
});

export default categoryRouter;