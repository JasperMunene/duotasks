import { ApiCategory, Category } from "@/types";

export const fetchCategories = async (): Promise<Category[]> => {
    const response = await fetch("/api/categories");
    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }

    // Tell TS that data.categories is an array of ApiCategory
    const data = (await response.json()) as { categories: ApiCategory[] };

    // Now `c` is strongly typed as ApiCategory
    return data.categories.map((c) => ({
        id: String(c.id),
        name: c.name,
        icon: c.icon,
    }));
};
