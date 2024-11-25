import Image from 'next/image'
import prisma from "@/lib/db"
import Link from "next/link"
import { Separator } from "./ui/separator"
import { Nunito } from "next/font/google"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

const nunito = Nunito({
    subsets: ["latin"],
})

async function getPosts() {
    const posts = await prisma.post.findMany({
        where: {
            published: true
        },
        include: {
            author: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 5
    })
    return posts
}

export default async function BlogSection() {
    const posts = await getPosts()

    return (
        <section id="blog-section" className={cn(nunito.className, "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-screen-xl mx-auto pb-14 px-6 lg:px-0")}>
            {posts.map((post) => (
                <Link
                    href={`/blog/${post.slug}`}
                    key={post.id}
                    className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
                >
                    <div className="relative h-48 md:h-36 lg:h-48 w-full">
                        <Image
                            className="object-cover object-center"
                            src={post.featuredImage || '/placeholder.jpg'}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                        <span className="bg-[#0B4A53] px-2 py-1 rounded text-sm w-fit text-slate-100">
                            {post.category}
                        </span>
                        <h1 className="title-font text-lg font-semibold text-gray-900 line-clamp-2">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xs text-gray-500">
                                {post.lokasi}
                            </h2>
                            <Separator orientation="vertical" className="h-4" />
                            <div className="text-xs text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                        <h2 className="text-xs text-gray-500 -mt-1">
                            {post.author.name}
                        </h2>
                    </div>
                </Link>
            ))}
            <Link
                href={`/blog/`}
                className="py-4 h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden hover:border-primary/50 transition-colors bg-[#0B4A53] flex items-center justify-center gap-4"
            >
                <span className="text-white">View All Posts</span>
                <div className="bg-[#0e5f6b] rounded-full p-2 w-fit">
                    <ChevronRight className="size-12 text-white" />
                </div>
            </Link>
        </section>
    )
}
