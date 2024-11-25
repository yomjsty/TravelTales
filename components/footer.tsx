import React from "react"
import Link from 'next/link';
import { Separator } from "./ui/separator";

export default function Footer() {
    return (
        <footer className="border-t">
            <div className="flex flex-col gap-2 sm:flex-row py-6 w-full max-w-screen-xl mx-auto shrink-0 items-center px-4 xl:px-0">
                <div className="flex flex-col items-center justify-center space-y-2 md:space-y-4">
                    <Link href="/" className="text-2xl font-bold text-white">
                        <span className="px-3 relative inline-block mx-2">
                            <span aria-hidden="true" className="absolute inset-0 -rotate-2 bg-[#0B4A53]"></span>
                            <span className="relative z-10">Travel Tales</span>
                        </span>
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Travel Tales. All rights reserved.</p>
                </div>
                <nav className="sm:ml-auto flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                        <NavLinks
                            title="About"
                            link="/about"
                        />
                        <Separator orientation="vertical" className="h-4" />
                        <NavLinks
                            title="Blog"
                            link="/blog"
                        />
                        <Separator orientation="vertical" className="h-4" />
                        <NavLinks
                            title="Contact"
                            link="/about#contact"
                        />
                        <Separator orientation="vertical" className="h-4" />
                        <NavLinks
                            title="Disclaimer"
                            link="/disclaimer"
                        />
                        <Separator orientation="vertical" className="h-4" />
                        <NavLinks
                            title="Privacy Policy"
                            link="/privacy-policy"
                        />
                    </div>
                    <Link className="text-xs hover:underline underline-offset-4 decoration-[#799122] text-center" href="https://www.instagram.com/akbarknawan" target="_blank" rel="noopener noreferrer">
                        Created with ❤️ by <span className="font-bold">Akbar</span>
                    </Link>
                </nav>
            </div>
        </footer>
    )
}

interface NavLinksProps {
    title: string
    link: string
}

function NavLinks({ title, link }: NavLinksProps) {
    return (
        <Link href={link} className="hover:underline text-sm underline-offset-4 decoration-[#0B4A53] bg-white px-2 py-1 text-[#0B4A53] rounded-sm">{title}</Link>
    )
}
