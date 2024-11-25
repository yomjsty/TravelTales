import Image from "next/image";
import Link from "next/link";
import { Separator } from "./ui/separator";

interface Post {
    id: string;
    slug: string;
    title: string;
    lokasi: string;
    featuredImage: string | null;
    category: string;
    createdAt: Date;
    author: {
        name: string | null;
    };
}

export default function BlogList({ posts }: { posts: Post[] }) {
    if (posts.length === 0) {
        return (
            <div className="text-center">
                <p className="text-lg text-muted-foreground">No posts found</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                        <h2 className="title-font text-lg font-semibold text-gray-900 line-clamp-2">
                            {post.title}
                        </h2>
                        <div className="flex items-center gap-3">
                            <p className="text-xs text-gray-500">
                                {post.lokasi}
                            </p>
                            <Separator orientation="vertical" className="h-4" />
                            <div className="text-xs text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 -mt-1">
                            {post.author.name}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
} 