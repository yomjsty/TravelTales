import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "../ui/separator"
import Link from "next/link"
import Image from "next/image"

interface RecommendedPost {
    slug: string
    title: string
    lokasi: string
    featuredImage: string
}

interface SidebarPostPageProps {
    avatarImage: string
    authorName: string
    memberSince: string
    bio: string
    recommendedPosts: RecommendedPost[]
}

export default function SidebarPostPage({
    avatarImage,
    authorName,
    memberSince,
    bio,
    recommendedPosts
}: SidebarPostPageProps) {
    return (
        <div className="lg:col-span-1 lg:w-full lg:h-full lg:bg-gradient-to-r lg:from-gray-50 lg:via-transparent lg:to-transparent dark:from-neutral-800">
            <div className="sticky top-20 py-6 lg:py-0 lg:ps-6 space-y-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={avatarImage} />
                            <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="">
                            <p className="font-bold text-sm">{authorName}</p>
                            <p className="text-sm">Member since {memberSince}</p>
                        </div>
                    </div>
                    <p className="text-sm">{bio}</p>
                </div>
                <Separator />
                <p className="text-lg font-bold">
                    Other posts you might like
                </p>
                <div className="space-y-6">
                    {recommendedPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group flex items-center gap-x-6 focus:outline-none"
                        >
                            <div className="grow flex flex-col gap-1">
                                <span className="text-sm font-extrabold text-gray-800 group-hover:text-[#0B4A53] group-focus:text-[#0B4A53] line-clamp-2">
                                    {post.title}
                                </span>
                                <div className="flex justify-end">
                                    <p className="text-sm font-medium text-gray-500">{post.lokasi}</p>
                                </div>
                            </div>

                            <div className="shrink-0 relative rounded-lg overflow-hidden size-20">
                                <Image
                                    className="object-cover rounded-lg"
                                    src={post.featuredImage}
                                    alt={post.title}
                                    fill
                                    sizes="80px"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
