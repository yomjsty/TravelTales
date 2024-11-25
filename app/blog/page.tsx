import prisma from "@/lib/db";
import BlogList from "@/components/blog-list";
import SearchInput from "@/components/search-input";

interface SearchParams {
    search?: string;
}

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
    const search = (await searchParams).search;

    const posts = await prisma.post.findMany({
        where: {
            AND: [
                { published: true },
                search ? {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { lokasi: { contains: search, mode: 'insensitive' } },
                        { category: { contains: search, mode: 'insensitive' } }
                    ]
                } : {}
            ]
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
        }
    });

    return (
        <main className="max-w-screen-xl mx-auto py-14 px-6 lg:px-0">
            <div className="space-y-8">
                <SearchInput />
                <div className="flex justify-between items-center">
                    <h1 className="text-xl md:text-3xl font-bold">
                        {search ? `Search Results for "${search}"` : 'All Blog Posts'}
                    </h1>
                    <p className="text-muted-foreground">
                        {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
                    </p>
                </div>
                <BlogList posts={posts} />
            </div>
        </main>
    );
}