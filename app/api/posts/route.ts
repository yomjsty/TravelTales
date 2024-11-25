import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { postSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers
        });

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string;
        const location = formData.get("location") as string;
        const content = formData.get("content") as string;
        const featuredImage = formData.get("featuredImage") as string;
        const category = formData.get("category") as string;

        console.log("Form data received:", {
            title,
            slug,
            location,
            content,
            featuredImage,
            category
        });

        const validation = postSchema.safeParse({
            title,
            slug,
            location,
            content,
            featuredImage,
            category
        });

        if (!validation.success) {
            console.error("Validation failed:", validation.error.format());
            return NextResponse.json(
                {
                    message: "Validation failed",
                    errors: validation.error.errors,
                    formData: {
                        title,
                        slug,
                        location,
                        content,
                        featuredImage,
                        category
                    }
                },
                { status: 400 }
            );
        }

        const post = await prisma.post.create({
            data: {
                id: crypto.randomUUID(),
                title,
                slug,
                content,
                lokasi: location,
                featuredImage: featuredImage,
                authorId: session.user.id,
                published: true,
                category
            }
        });

        return NextResponse.json(post, { status: 201 });

    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}