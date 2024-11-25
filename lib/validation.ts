import * as z from "zod"

export const postSchema = z.object({
    title: z.string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must not exceed 100 characters"),
    slug: z.string()
        .min(3, "Slug must be at least 3 characters")
        .max(100, "Slug must not exceed 100 characters")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly (lowercase letters, numbers, and hyphens only)"),
    location: z.string()
        .min(3, "Location must be at least 3 characters")
        .max(100, "Location must not exceed 100 characters"),
    content: z.string()
        .min(10, "Content must be at least 10 characters")
        .max(10000, "Content must not exceed 10000 characters"),
    featuredImage: z.union([
        z.string().url("Invalid image URL"),
        z.instanceof(File, { message: "Featured image is required" })
    ]),
    category: z.string()
        .min(1, "Category is required")
})

export type PostFormValues = z.infer<typeof postSchema>