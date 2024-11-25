import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
    req: NextRequest,
    { params }: { params: { postId: string } }
) {
    const { postId } = await params
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

        const like = await prisma.like.create({
            data: {
                postId: postId,
                userId: session.user.id,
            },
        })

        return NextResponse.json(like)
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { postId: string } }
) {
    const { postId } = await params
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

        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId: postId,
                    userId: session.user.id,
                },
            },
        })

        if (!existingLike) {
            return NextResponse.json(
                { error: "Like not found" },
                { status: 404 }
            )
        }

        await prisma.like.delete({
            where: {
                postId_userId: {
                    postId: postId,
                    userId: session.user.id,
                },
            },
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("Error deleting like:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
} 