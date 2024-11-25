import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import { Separator } from "./ui/separator"

export default function MobileNavbar() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="md:hidden bg-white px-3 rounded-md ml-2">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Toggle navigation menu</span>
                </button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col justify-between bg-background text-foreground max-w-[320px]">
                <SheetHeader>
                    <SheetTitle className="self-start">
                        <Link href="/" className="text-2xl font-bold text-white">
                            <span className="relative inline-block px-2">
                                <span aria-hidden="true" className="absolute inset-0 -rotate-2 bg-[#0B4A53]"></span>
                                <span className="relative z-10">Travel Tales</span>
                            </span>
                        </Link>
                    </SheetTitle>
                    <SheetDescription></SheetDescription>
                    <div className="grid gap-4">
                        <Separator />
                        <div className="grid gap-4 text-sm text-start">
                            <Link href="/about" className="hover:underline underline-offset-4">About</Link>
                            <Link href="/blog" className="hover:underline underline-offset-4">Blog</Link>
                            <Link href="/disclaimer" className="hover:underline underline-offset-4">Disclaimer</Link>
                            <Link href="/privacy-policy" className="hover:underline underline-offset-4">Privacy Policy</Link>
                        </div>
                    </div>
                </SheetHeader>
                <SheetFooter className="flex-row items-center justify-between self-start">
                    <a href="#">
                        <button className="flex items-center gap-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4" viewBox="0 0 16 16">
                                <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
                            </svg>
                            <span className="mt-0.5">
                                Discord
                            </span>
                        </button>
                    </a>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}