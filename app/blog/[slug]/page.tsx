import MainSection from "@/components/blogpost/mainsection"
import TitleHeroSection from "@/components/blogpost/titlehero"
import prisma from "@/lib/db"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

async function getPost(slug: string) {
    const post = await prisma.post.findFirst({
        where: {
            slug: slug,
            published: true
        },
        include: {
            author: true
        }
    })
    return post
}

async function getRecommendedPosts(currentPostId: string, category: string) {
    const posts = await prisma.post.findMany({
        where: {
            AND: [
                { published: true },
                { category: category },
                { id: { not: currentPostId } }
            ]
        },
        select: {
            slug: true,
            title: true,
            lokasi: true,
            featuredImage: true
        },
        take: 3,
        orderBy: {
            createdAt: 'desc'
        }
    })
    return posts
}

type RouteContext = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata(context: RouteContext): Promise<Metadata> {
    const post = await getPost((await context.params).slug)

    if (!post) {
        return {
            title: 'Post Not Found',
            description: 'The requested blog post could not be found'
        }
    }

    return {
        title: `${post.title} | Travel Tales`,
        description: post.content.substring(0, 160),
        openGraph: {
            title: post.title,
            description: post.content.substring(0, 160),
            images: post.featuredImage ? [post.featuredImage] : [],
        },
    }
}

async function BlogPostPage(context: RouteContext) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const post = await getPost((await context.params).slug)

    if (!post) {
        notFound()
    }

    const [recommendedPosts, likes, bookmarked, hasLiked] = await Promise.all([
        getRecommendedPosts(post.id, post.category),
        prisma.like.count({
            where: { postId: post.id }
        }),
        session ? prisma.bookmark.findUnique({
            where: {
                postId_userId: {
                    postId: post.id,
                    userId: session.user.id
                }
            }
        }) : null,
        session ? prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId: post.id,
                    userId: session.user.id
                }
            }
        }) : null
    ])

    const mappedRecommendedPosts = recommendedPosts.map(post => ({
        slug: post.slug,
        title: post.title,
        lokasi: post.lokasi,
        featuredImage: post.featuredImage || '/placeholder.jpg'
    }));

    return (
        <div className="-mt-16">
            <TitleHeroSection
                title={post.title}
                featuredImage={post.featuredImage || ""}
                createdAt={post.createdAt.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })}
                category={post.category}
            />
            <MainSection
                content={post.content}
                className="relative max-w-screen-xl mx-auto -mt-12 md:-mt-20 z-40 px-4 xl:px-0"
                avatarImage={post.author.image || ""}
                authorName={post.author.name || ""}
                memberSince={post.author.createdAt.toLocaleDateString('en-US', {
                    year: 'numeric'
                })}
                title={post.title}
                postId={post.id}
                initialLikes={likes}
                initialComments={0}
                isLiked={!!hasLiked}
                isBookmarked={!!bookmarked}
                recommendedPosts={mappedRecommendedPosts}
                bio={post.author.bio || ""}
            />
        </div>
    )
}
export default BlogPostPage
