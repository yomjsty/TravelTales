import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    req: NextRequest,
    { params }: { params: { postId: string } }
) {
    const { postId } = await params
    const { searchParams } = new URL(req.url)
    const commentId = searchParams.get('commentId')
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('take') || '3')

    try {
        const session = await auth.api.getSession({
            headers: req.headers
        })

        if (commentId) {
            // Fetch paginated replies for a specific comment
            const replies = await prisma.comment.findMany({
                where: {
                    parentId: commentId
                },
                skip,
                take: take + 1, // Get one extra to check if there are more
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    },
                    _count: {
                        select: {
                            CommentLike: true
                        }
                    },
                    CommentLike: session ? {
                        where: {
                            userId: session.user.id
                        }
                    } : false
                },
                orderBy: {
                    createdAt: 'asc'
                }
            })

            const hasMore = replies.length > take
            const paginatedReplies = replies.slice(0, take)

            return NextResponse.json({
                replies: paginatedReplies,
                hasMore
            })
        }

        // Original code for fetching top-level comments
        const comments = await prisma.comment.findMany({
            where: {
                postId: postId,
                parentId: null
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                replies: {
                    take: 1,
                    orderBy: {
                        createdAt: 'asc'
                    },
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        },
                        _count: {
                            select: {
                                CommentLike: true
                            }
                        },
                        CommentLike: session ? {
                            where: {
                                userId: session.user.id
                            }
                        } : false
                    }
                },
                _count: {
                    select: {
                        CommentLike: true,
                        replies: true
                    }
                },
                CommentLike: session ? {
                    where: {
                        userId: session.user.id
                    }
                } : false
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(comments)
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}

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

        const { content, parentId } = await req.json()

        const comment = await prisma.comment.create({
            data: {
                id: crypto.randomUUID(),
                content,
                postId,
                authorId: session.user.id,
                parentId
            },
            include: {
                author: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            }
        })

        return NextResponse.json(comment)
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
} 