import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

type RouteContext = {
    params: Promise<{
        postId: string;
    }>;
};

export async function POST(
    req: NextRequest,
    context: RouteContext
) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers
        })

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { postId } = await context.params;

        const like = await prisma.bookmark.create({
            data: {
                postId: postId,
                userId: session.user.id,
            },
        })

        return NextResponse.json(like)
    } catch {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: NextRequest,
    context: RouteContext
) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers
        })

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { postId } = await context.params;

        await prisma.bookmark.delete({
            where: {
                postId_userId: {
                    postId: postId,
                    userId: session.user.id,
                },
            },
        })

        return new NextResponse(null, { status: 204 })
    } catch {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
} 