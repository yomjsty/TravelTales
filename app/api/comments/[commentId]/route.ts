import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
    req: NextRequest,
    { params }: { params: { commentId: string } }
) {
    const { commentId } = params

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

        // Get the comment to verify ownership
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: { authorId: true }
        })

        if (!comment) {
            return NextResponse.json(
                { error: "Comment not found" },
                { status: 404 }
            )
        }

        // Verify the user owns the comment
        if (comment.authorId !== session.user.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            )
        }

        // Delete the comment and all associated likes
        await prisma.$transaction([
            prisma.commentLike.deleteMany({
                where: { commentId }
            }),
            prisma.comment.delete({
                where: { id: commentId }
            })
        ])

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("Error deleting comment:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
} 