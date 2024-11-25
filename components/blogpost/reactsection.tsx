"use client"

import { Bookmark, Heart, MessageCircle } from "lucide-react"
import { Separator } from "../ui/separator"
import { useSession } from "@/lib/auth-client"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ReactSectionProps {
    postId: string
    initialLikes: number
    commentCount: number
    isLiked: boolean
    isBookmarked: boolean
}

export default function ReactSection({ postId, initialLikes, commentCount, isLiked, isBookmarked }: ReactSectionProps) {
    const { data: session } = useSession()
    const { toast } = useToast()
    const [likes, setLikes] = useState(initialLikes)
    const [liked, setLiked] = useState(isLiked)
    const [bookmarked, setBookmarked] = useState(isBookmarked)

    const handleLike = async () => {
        if (!session) {
            toast({
                description: "Please sign in to like posts",
            })
            return
        }

        try {
            const response = await fetch(`/api/posts/${postId}/like`, {
                method: liked ? 'DELETE' : 'POST',
                credentials: 'include',
            })

            if (!response.ok) throw new Error()

            setLiked(!liked)
            setLikes(liked ? likes - 1 : likes + 1)
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Something went wrong. Please try again.",
            })
        }
    }

    const handleBookmark = async () => {
        if (!session) {
            toast({
                description: "Please sign in to bookmark posts",
            })
            return
        }

        try {
            const response = await fetch(`/api/posts/${postId}/bookmark`, {
                method: bookmarked ? 'DELETE' : 'POST',
                credentials: 'include',
            })

            if (!response.ok) throw new Error()

            setBookmarked(!bookmarked)
            toast({
                description: bookmarked ? "Post removed from bookmarks" : "Post added to bookmarks",
            })
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Something went wrong. Please try again.",
            })
        }
    }

    const scrollToComments = () => {
        const textarea = document.querySelector('#comment-textarea')
        if (textarea) {
            // Wait for next frame to ensure layout is complete
            requestAnimationFrame(() => {
                const headerOffset = 80
                const elementPosition = textarea.getBoundingClientRect().top
                const offsetPosition = elementPosition + window.scrollY - headerOffset

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                })

                // Focus after scrolling is complete
                setTimeout(() => {
                    (textarea as HTMLTextAreaElement).focus()
                }, 500)
            })
        }
    }

    return (
        <div className="flex gap-4 text-sm justify-end items-center">
            <button
                onClick={handleLike}
                className="flex gap-1 items-center hover:text-[#0B4A53] transition-colors"
            >
                <Heart className={cn(
                    "size-4",
                    liked && "fill-[#0B4A53] text-[#0B4A53]"
                )} />
                <span className="text-sm">{likes}</span>
            </button>
            <Separator orientation="vertical" />
            <button
                onClick={scrollToComments}
                className="flex gap-1 items-center hover:text-[#0B4A53] transition-colors"
            >
                <MessageCircle className="size-4" />
                <span className="text-sm">{commentCount}</span>
            </button>
            <Separator orientation="vertical" />
            <button
                onClick={handleBookmark}
                className="hover:text-[#0B4A53] transition-colors"
            >
                <Bookmark className={cn(
                    "size-4",
                    bookmarked && "fill-[#0B4A53] text-[#0B4A53]"
                )} />
            </button>
        </div>
    )
}
