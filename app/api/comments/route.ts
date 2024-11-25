import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const postId = searchParams.get('postId')

        if (!postId) {
            return new NextResponse("Post ID is required", { status: 400 })
        }

        const comments = await prisma.comment.findMany({
            where: {
                postId: postId,
                parentId: null // Only fetch top-level comments
            },
            include: {
                author: {
                    select: {
                        name: true,
                        image: true,
                        id: true
                    }
                },
                CommentLike: true,
                replies: {
                    take: 1, // Only fetch the first reply initially
                    include: {
                        author: {
                            select: {
                                name: true,
                                image: true,
                                id: true
                            }
                        },
                        CommentLike: true,
                        _count: {
                            select: {
                                CommentLike: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        CommentLike: true,
                        replies: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(comments)
    } catch (error) {
        console.error('Error fetching comments:', error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
} 