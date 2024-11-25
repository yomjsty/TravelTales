import Image from "next/image"
import { Separator } from "../ui/separator"
import Link from "next/link"

export default function TitleHeroSection({ title, featuredImage, createdAt, category }: { title: string, featuredImage: string, createdAt: string, category: string }) {
    return (
        <div className="relative">
            <div className="relative h-[350px] md:h-[450px] w-full">
                <Image
                    src={featuredImage}
                    alt={title}
                    fill
                    priority
                    className="object-cover"
                />
            </div>
            <div className="absolute inset-0 bg-black/40">
                <div className="max-w-screen-lg mx-auto flex flex-col items-center justify-center p-4 gap-4 w-full h-full">
                    <p
                        className="text-start md:text-center text-white text-3xl md:text-4xl font-bold tracking-wide leading-tight text-balance mt-4 line-clamp-4 w-full"
                        title={title}
                    >
                        {title}
                    </p>
                    <div className="flex items-center md:justify-center gap-4 text-start text-slate-100 w-full">
                        <div className="">
                            <p className="text-sm font-bold flex gap-2 items-center">
                                Posted In
                                <Link href={`/blog?search=${category}`} className="bg-[#0B4A53] px-2 py-1 rounded text-sm">
                                    {category}
                                </Link>
                            </p>
                        </div>
                        <Separator orientation="vertical" />
                        <div className="">
                            <p className="text-sm font-bold">Created At</p>
                            <p className="text-sm">{createdAt}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
