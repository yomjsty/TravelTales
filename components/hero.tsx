"use client"

import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import Image from "next/image"
import hero1 from "@/public/hero1.webp"
import hero2 from "@/public/hero2.webp"
import { Button } from "./ui/button"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { useToast } from "@/hooks/use-toast"

function HeroSection() {
    const { data: session } = authClient.useSession()
    const { toast } = useToast()

    return (
        <section className="relative">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[
                    Autoplay({
                        delay: 3000,
                    }),
                ]}
            >
                <CarouselContent>
                    <CarouselItem className="relative h-[400px] md:h-[500px] w-full">
                        <Image src={hero1} alt="hero-1" fill priority className="object-cover" />
                    </CarouselItem>
                    <CarouselItem className="relative h-[400px] md:h-[500px] w-full">
                        <Image src={hero2} alt="hero-2" fill priority className="object-cover" />
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
            <div className="absolute inset-0 flex flex-col items-center justify-center md:text-center p-4 bg-black/30 gap-4">
                <p className="text-white text-4xl font-bold tracking-wider leading-relaxed text-balance">
                    A blog for
                    <span className="px-3 relative inline-block mx-2">
                        <span aria-hidden="true" className="absolute inset-0 -rotate-3 bg-[#0B4A53]"></span>
                        <span className="relative z-10">travel</span>
                    </span>
                    enthusiasts
                </p>
                <div className="flex gap-4 self-start sm:self-center">
                    <Button
                        className="bg-[#0B4A53] hover:bg-[#0B4A53]/80"

                    >
                        <Link href="#blog-section">Read Blog</Link>
                    </Button>
                    {session ? (
                        <Button
                            variant="secondary"
                        >
                            <Link href="/dashboard/create-post">Write Blog</Link>
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            onClick={() =>
                                toast({
                                    description: "Please sign in first to continue",
                                })
                            }
                        >
                            Write Blog
                        </Button>
                    )}
                </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-white to-transparent" />
        </section>
    )
}

export default HeroSection