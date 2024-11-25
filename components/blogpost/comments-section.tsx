'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { ArrowDownUp, MessageSquare, MoreHorizontal, ThumbsUp } from 'lucide-react'
import { useEffect, useState, useCallback } from "react"
import { useSession } from "@/lib/auth-client"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import SignInDialog from "../signindialog-2"

interface Comment {
    id: string
    author: {
        name: string
        image: string
        id: string
    }
    content: string
    createdAt: string
    _count: {
        CommentLike: number
        replies?: number
    }
    replies?: Comment[]
    CommentLike?: {
        userId: string
    }[]
}

interface CommentsSectionProps {
    postId: string
    onCommentCountChange: (count: number) => void
}

export default function CommentsSection({ postId, onCommentCountChange }: CommentsSectionProps) {
    const { data: session } = useSession()
    const user = session?.user
    const { toast } = useToast()
    const [sortBy, setSortBy] = useState("recent")
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState("")
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [visibleReplies, setVisibleReplies] = useState<Record<string, number>>({})
    const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({})
    const [hasMoreReplies, setHasMoreReplies] = useState<Record<string, boolean>>({})

    const fetchComments = useCallback(async () => {
        try {
            const response = await fetch(`/api/comments?postId=${postId}`);
            if (!response.ok) throw new Error('Failed to fetch comments');
            const data = await response.json();
            setComments(data);
            onCommentCountChange(data.length);
        } catch {
            toast({
                description: "Failed to load comments",
                variant: "destructive"
            });
        }
    }, [postId, onCommentCountChange, toast]);

    useEffect(() => {
        fetchComments()
    }, [postId, onCommentCountChange, fetchComments])

    useEffect(() => {
        fetchComments()
    }, [sortBy, fetchComments])

    const handleAddComment = async () => {
        if (!session) {
            toast({
                description: "Please sign in to comment",
            })
            return
        }

        if (!newComment.trim()) {
            toast({
                description: "Comment cannot be empty",
                variant: "destructive"
            })
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: newComment,
                }),
            })

            if (!response.ok) throw new Error('Failed to add comment')

            await fetchComments()
            setNewComment("")
            onCommentCountChange(comments.length + 1)
            toast({
                description: "Comment added successfully",
            })
        } catch {
            toast({
                description: "Failed to add comment",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleLike = async (commentId: string) => {
        if (!session) {
            toast({
                description: "Please sign in to like comments",
            })
            return
        }

        try {
            const comment = comments.find(c => c.id === commentId) ||
                comments.flatMap(c => c.replies || []).find(r => r.id === commentId)

            if (!comment) {
                throw new Error('Comment not found')
            }

            const isLiked = comment.CommentLike?.some(like => like.userId === session.user.id)
            const response = await fetch(`/api/comments/${commentId}/like`, {
                method: isLiked ? 'DELETE' : 'POST',
                credentials: 'include',
            })

            if (!response.ok) {
                if (response.status === 404 && isLiked) {
                    await fetchComments()
                    return
                }
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to like comment')
            }

            // Update comments state locally
            setComments(prevComments => {
                return prevComments.map(c => {
                    // If this is the target comment
                    if (c.id === commentId) {
                        return {
                            ...c,
                            _count: {
                                ...c._count,
                                CommentLike: isLiked ? c._count.CommentLike - 1 : c._count.CommentLike + 1
                            },
                            CommentLike: isLiked
                                ? c.CommentLike?.filter(like => like.userId !== session.user.id)
                                : [...(c.CommentLike || []), { userId: session.user.id }]
                        }
                    }
                    // If the target comment is in replies
                    if (c.replies) {
                        return {
                            ...c,
                            replies: c.replies.map(reply => {
                                if (reply.id === commentId) {
                                    return {
                                        ...reply,
                                        _count: {
                                            ...reply._count,
                                            CommentLike: isLiked ? reply._count.CommentLike - 1 : reply._count.CommentLike + 1
                                        },
                                        CommentLike: isLiked
                                            ? reply.CommentLike?.filter(like => like.userId !== session.user.id)
                                            : [...(reply.CommentLike || []), { userId: session.user.id }]
                                    }
                                }
                                return reply
                            })
                        }
                    }
                    return c
                })
            })
        } catch (error) {
            toast({
                description: error instanceof Error ? error.message : "Failed to like comment",
                variant: "destructive"
            })
        }
    }

    const handleReply = (commentId: string) => {
        if (!session) {
            toast({
                description: "Please sign in to reply",
            })
            return
        }
        setReplyingTo(replyingTo === commentId ? null : commentId)
        setReplyContent("")
    }

    const submitReply = async (commentId: string) => {
        if (!replyContent.trim()) {
            toast({
                description: "Reply cannot be empty",
                variant: "destructive"
            })
            return
        }

        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: replyContent,
                    parentId: commentId
                }),
            })

            if (!response.ok) throw new Error('Failed to add reply')

            await fetchComments()
            setReplyContent("")
            setReplyingTo(null)
            toast({
                description: "Reply added successfully",
            })
        } catch {
            toast({
                description: "Failed to add reply",
                variant: "destructive"
            })
        }
    }

    const handleLoadMoreReplies = async (commentId: string) => {
        if (loadingReplies[commentId]) return

        setLoadingReplies(prev => ({ ...prev, [commentId]: true }))
        try {
            const skip = visibleReplies[commentId] || 1 // Start from 1 since we always show the first reply
            const response = await fetch(
                `/api/posts/${postId}/comments?commentId=${commentId}&skip=${skip}&take=3`
            )
            if (!response.ok) throw new Error('Failed to fetch replies')
            const data = await response.json()

            setComments(prev => prev.map(comment => {
                if (comment.id === commentId) {
                    // Create a Map to track unique replies by ID
                    const uniqueReplies = new Map()

                    // Add existing replies to the Map
                    comment.replies?.forEach(reply => {
                        uniqueReplies.set(reply.id, reply)
                    })

                    // Add new replies to the Map (will overwrite if duplicate)
                    data.replies.forEach((reply: Comment) => {
                        uniqueReplies.set(reply.id, reply)
                    })

                    return {
                        ...comment,
                        replies: Array.from(uniqueReplies.values())
                    }
                }
                return comment
            }))

            setVisibleReplies(prev => ({
                ...prev,
                [commentId]: (prev[commentId] || 1) + 3
            }))

            setHasMoreReplies(prev => ({
                ...prev,
                [commentId]: data.hasMore
            }))
        } catch {
            toast({
                description: "Failed to load replies",
                variant: "destructive"
            })
        } finally {
            setLoadingReplies(prev => ({ ...prev, [commentId]: false }))
        }
    }

    const handleDeleteComment = async (commentId: string, authorId: string) => {
        if (!session || session.user.id !== authorId) {
            return
        }

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE',
                credentials: 'include',
            })

            if (!response.ok) throw new Error('Failed to delete comment')

            // First update the comments state
            setComments(prevComments => {
                const newComments = prevComments.filter(c => {
                    if (c.id === commentId) return false
                    if (c.replies) {
                        c.replies = c.replies.filter(r => r.id !== commentId)
                    }
                    return true
                })
                return newComments
            })

            // Then update the comment count in a separate effect
            setTimeout(() => {
                onCommentCountChange(comments.length - 1)
            }, 0)

            toast({
                description: "Comment deleted successfully",
            })
        } catch {
            toast({
                description: "Failed to delete comment",
                variant: "destructive"
            })
        }
    }

    const sortedComments = [...comments].sort((a, b) => {
        if (sortBy === "recent") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        } else {
            return b._count.CommentLike - a._count.CommentLike
        }
    })

    return (
        <div className="space-y-8 mt-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">Comments</h2>
                    <span className="bg-[#0B4A53] text-white px-3 py-0.5 rounded-full text-sm font-medium">
                        {comments.length}
                    </span>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <ArrowDownUp className="h-4 w-4" />
                            {sortBy === "recent" ? "Most recent" : "Most liked"}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSortBy("recent")}>
                            Most recent
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("likes")}>
                            Most liked
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Comment Input */}
            {session ? <div className="bg-gray-50/50 rounded-xl p-6 space-y-4 border shadow-sm">
                <Textarea
                    id="comment-textarea"
                    placeholder="Share your thoughts..."
                    className="min-h-[100px] bg-white resize-none"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex justify-end">
                    <Button
                        className="bg-[#0B4A53] hover:bg-[#0B4A53]/90 transition-colors"
                        onClick={handleAddComment}
                        disabled={isLoading}
                    >
                        {isLoading ? "Posting..." : "Post Comment"}
                    </Button>
                </div>
            </div> : <div className="bg-gray-50/50 rounded-xl p-6 space-y-4 border shadow-sm">
                <p className="text-center text-gray-500">Please <SignInDialog /> to comment</p>
            </div>}

            {/* Comments List */}
            <div className="space-y-8">
                {sortedComments.map((comment) => (
                    <div key={comment.id} className="space-y-6">
                        <div className="flex gap-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={comment.author.image} />
                                <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <span className="font-semibold block">{comment.author.name}</span>
                                        <span className="text-gray-500 text-sm">{new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    {user?.id === comment.author.id && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => handleDeleteComment(comment.id, comment.author.id)}
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                                <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleLike(comment.id)}
                                        className={cn(
                                            "text-gray-500 hover:text-gray-900 -ml-3",
                                            comment.CommentLike?.some(like => like.userId === session?.user.id) && "text-[#0B4A53]"
                                        )}
                                    >
                                        <ThumbsUp className={cn(
                                            "h-4 w-4 mr-1.5",
                                            comment.CommentLike?.some(like => like.userId === session?.user.id) && "fill-[#0B4A53]"
                                        )} />
                                        {comment._count.CommentLike}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleReply(comment.id)}
                                        className="text-gray-500 hover:text-gray-900"
                                    >
                                        <MessageSquare className="h-4 w-4 mr-1.5" />
                                        Reply
                                    </Button>
                                </div>

                                {replyingTo === comment.id && (
                                    <div className="mt-4 space-y-3">
                                        <Textarea
                                            placeholder="Write a reply..."
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            className="min-h-[80px] resize-none"
                                        />
                                        <div className="flex items-center gap-2 justify-end">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setReplyingTo(null)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => submitReply(comment.id)}
                                            >
                                                Reply
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Nested Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-14 space-y-6 border-l-2 border-gray-100 pl-6">
                                {comment.replies.map((reply) => (
                                    <div key={reply.id} className="flex gap-4">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={reply.author.image} />
                                            <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <span className="font-semibold block">{reply.author.name}</span>
                                                    <span className="text-gray-500 text-sm">{new Date(reply.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                                {session?.user.id === reply.author.id && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => handleDeleteComment(reply.id, reply.author.id)}
                                                            >
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </div>
                                            <p className="text-gray-700 leading-relaxed">{reply.content}</p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleLike(reply.id)}
                                                className={cn(
                                                    "text-gray-500 hover:text-gray-900 -ml-3",
                                                    reply.CommentLike?.some(like => like.userId === session?.user.id) && "text-[#0B4A53]"
                                                )}
                                            >
                                                <ThumbsUp className={cn(
                                                    "h-4 w-4 mr-1.5",
                                                    reply.CommentLike?.some(like => like.userId === session?.user.id) && "fill-[#0B4A53]"
                                                )} />
                                                {reply._count.CommentLike}
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {hasMoreReplies[comment.id] && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-[#0B4A53] hover:text-[#0B4A53]/90"
                                        onClick={() => handleLoadMoreReplies(comment.id)}
                                        disabled={loadingReplies[comment.id]}
                                    >
                                        {loadingReplies[comment.id] ? (
                                            "Loading..."
                                        ) : (
                                            `Load more replies`
                                        )}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
