"use client"

import { cn } from "@/lib/utils"
import SharePost from "./sharepost"
import Breadcrumb from "../breadcrumb"
import { Separator } from "../ui/separator"
import ReactSection from "./reactsection"
import CommentsSection from "./comments-section"
import { useState } from "react"

export default function ContentSection({ content, className, title, postId, initialLikes, initialComments, isLiked, isBookmarked }: { content: string, className?: string, title: string, postId: string, initialLikes: number, initialComments: number, isLiked: boolean, isBookmarked: boolean }) {
    const [commentCount, setCommentCount] = useState(initialComments)

    return (
        <div className={cn("prose lg:prose-xl flex flex-col gap-4", className)}>
            <div className="flex items-center justify-between">
                <Breadcrumb title={title} />
                <SharePost title={title} />
            </div>
            <Separator />
            <div className="text-[15px] blogpost-content" dangerouslySetInnerHTML={{ __html: content }} />
            <Separator />
            <ReactSection
                postId={postId}
                initialLikes={initialLikes}
                commentCount={commentCount}
                isLiked={isLiked}
                isBookmarked={isBookmarked}
            />
            <CommentsSection
                postId={postId}
                onCommentCountChange={setCommentCount}
            />
        </div>
    )
}