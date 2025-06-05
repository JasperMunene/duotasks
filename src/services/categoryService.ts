// fetchCategories.ts
import { ApiCategory, Category } from "@/types";

export const fetchCategories = async (): Promise<Category[]> => {
    const response = await fetch("/api/categories");
    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }

    // Cast the JSON to the shape you expect from your API
    const data = (await response.json()) as { categories: ApiCategory[] };

    // Now `c` is strongly typed as ApiCategory in both filter() and map()
    return data.categories
        .filter(c => c.name.toLowerCase() !== "uncategorized")
        .map(c => ({
            id: String(c.id),
            name: c.name,
            icon: c.icon,
        }));
};
