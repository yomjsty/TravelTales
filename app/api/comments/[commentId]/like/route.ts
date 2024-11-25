import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type RouteContext = {
    params: Promise<{
        commentId: string;
    }>;
};

export async function POST(
    req: NextRequest,
    context: RouteContext
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const { commentId } = await context.params;

        const existingLike = await prisma.commentLike.findUnique({
            where: {
                commentId_userId: {
                    userId,
                    commentId,
                }
            }
        });

        if (existingLike) {
            await prisma.commentLike.delete({
                where: {
                    commentId_userId: {
                        userId,
                        commentId,
                    }
                }
            });
            return NextResponse.json({ message: "Like removed" });
        }

        await prisma.commentLike.create({
            data: {
                userId,
                commentId,
            }
        });

        return NextResponse.json({ message: "Comment liked" });
    } catch (error) {
        console.error("Error handling comment like:", error);
        return NextResponse.json(
            { error: "Failed to process like" },
            { status: 500 }
        );
    }
} 