import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
    req: NextRequest,
    { params }: { params: { commentId: string } }
) {
    const { commentId } = await params
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

        const existingLike = await prisma.commentLike.findUnique({
            where: {
                commentId_userId: {
                    commentId,
                    userId: session.user.id,
                },
            },
        })

        if (existingLike) {
            await prisma.commentLike.delete({
                where: {
                    commentId_userId: {
                        commentId,
                        userId: session.user.id,
                    },
                },
            })
            return new NextResponse(null, { status: 204 })
        }

        const like = await prisma.commentLike.create({
            data: {
                commentId,
                userId: session.user.id,
            },
        })

        return NextResponse.json(like)
    } catch (error) {
        console.error("Error handling like:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { commentId: string } }
) {
    const { commentId } = await params
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

        await prisma.commentLike.delete({
            where: {
                commentId_userId: {
                    commentId,
                    userId: session.user.id,
                },
            },
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
} 