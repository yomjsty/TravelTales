import React from 'react'
import ContentSection from "./contentsection"
import SidebarPostPage from "./sidebar"
import { cn } from "@/lib/utils"
import { Nunito } from "next/font/google"

const nunito = Nunito({
    subsets: ["latin"],
})

interface MainSectionProps {
    content: string
    className?: string
    avatarImage: string
    authorName: string
    memberSince: string
    title: string
    postId: string
    initialLikes?: number
    initialComments?: number
    isLiked?: boolean
    isBookmarked?: boolean
    bio: string
    recommendedPosts: {
        slug: string
        title: string
        lokasi: string
        featuredImage: string
    }[]
}

export default function MainSection({
    content,
    className,
    avatarImage,
    authorName,
    memberSince,
    title,
    postId,
    initialLikes = 0,
    initialComments = 0,
    isLiked = false,
    isBookmarked = false,
    recommendedPosts,
    bio
}: MainSectionProps) {
    return (
        <section className={cn(nunito.className, className)}>
            <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6 bg-background p-4 rounded">
                <ContentSection
                    content={content}
                    className="lg:col-span-2"
                    title={title}
                    postId={postId}
                    initialLikes={initialLikes}
                    initialComments={initialComments}
                    isLiked={isLiked}
                    isBookmarked={isBookmarked}
                />
                <SidebarPostPage
                    avatarImage={avatarImage}
                    authorName={authorName}
                    memberSince={memberSince}
                    recommendedPosts={recommendedPosts}
                    bio={bio}
                />
            </div>
        </section>
    )
}
