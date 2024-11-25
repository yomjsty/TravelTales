"use client";

import Link from "next/link";
import SignInDialog from "./signindialog";
import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import MobileNavbar from "./mobile-navbar";

export default function Navbar() {
    const { data: session } = useSession();
    const router = useRouter();

    return <nav className="sticky top-0 z-50 backdrop-blur-sm">
        <div className="flex justify-between items-center h-16 p-4 md:px-2 xl:px-0 max-w-screen-xl mx-auto">
            <div>
                <Link href="/" className="text-2xl font-bold text-white">
                    <span className="px-3 relative inline-block mx-2">
                        <span aria-hidden="true" className="absolute inset-0 -rotate-2 bg-[#0B4A53]"></span>
                        <span className="relative z-10">Travel Tales</span>
                    </span>
                </Link>
            </div>
            <div className="hidden md:flex gap-4">
                <NavLinks
                    title="About"
                    link="/about"
                />
                <NavLinks
                    title="Blog"
                    link="/blog"
                />
                <NavLinks
                    title="Disclaimer"
                    link="/disclaimer"
                />
                <NavLinks
                    title="Privacy Policy"
                    link="/privacy-policy"
                />
            </div>
            <div className="flex lg:gap-4">
                {session ? (
                    <div className="flex gap-2 lg:gap-4">
                        <Button className="bg-[#0B4A53] hover:bg-[#0B4A53]/80 hidden md:flex" asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                        <Button onClick={async () => await authClient.signOut({
                            fetchOptions: {
                                onSuccess: () => {
                                    router.push("/")
                                },
                            },
                        })}
                            variant="secondary"
                        >
                            Logout
                        </Button>
                    </div>
                ) : <SignInDialog />}
                <MobileNavbar />
            </div>
        </div>
    </nav>;
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