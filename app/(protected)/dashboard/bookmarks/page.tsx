import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import prisma from "@/lib/db"
import { notFound } from "next/navigation"

async function getBookmarkedPosts(userId: string) {
    const bookmarks = await prisma.bookmark.findMany({
        where: {
            userId: userId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    lokasi: true,
                    category: true,
                    featuredImage: true,
                    createdAt: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return bookmarks.map(bookmark => bookmark.post)
}

export default async function BookmarksPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        notFound()
    }

    const posts = await getBookmarkedPosts(session.user.id)

    return (
        <div className="max-w-screen-xl mx-auto p-4 xl:px-0 pb-10 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Bookmarked Posts</h1>
                <Button
                    className="bg-[#0B4A53] hover:bg-[#0B4A53]/80"
                    asChild
                >
                    <Link href="/blog">Explore Posts</Link>
                </Button>
            </div>
            <Button asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
            </Button>

            {posts.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">You haven't bookmarked any posts yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group block rounded-xl overflow-hidden focus:outline-none border hover:border-[#0B4A53]/50 transition-colors"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 p-4">
                                <div className="shrink-0 relative rounded-xl overflow-hidden w-full sm:w-56 h-44">
                                    <Image
                                        className="group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out size-full absolute top-0 start-0 object-cover rounded-xl"
                                        src={post.featuredImage || "/placeholder.svg"}
                                        alt={post.title}
                                        width={200}
                                        height={200}
                                    />
                                </div>

                                <div className="grow">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-[#0B4A53] text-white px-2 py-1 rounded text-sm">
                                            {post.category}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-600 dark:text-neutral-300 dark:group-hover:text-white">
                                        {post.title}
                                    </h3>
                                    <p className="mt-2 text-gray-600 dark:text-neutral-400">
                                        {post.lokasi}
                                    </p>
                                    <p className="mt-4 inline-flex items-center gap-x-1 text-sm text-[#0B4A53] decoration-2 group-hover:underline group-focus:underline font-medium">
                                        Read more
                                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

