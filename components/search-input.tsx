"use client"

import { Input } from "@/components/ui/input";
import { ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchInput() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        const encodedQuery = encodeURIComponent(searchQuery.trim());
        router.push(`/blog?search=${encodedQuery}`);
    };

    return (
        <div className="max-w-screen-xl mx-auto ml-auto px-6 lg:px-0">
            <form onSubmit={handleSubmit} className="relative">
                <Input
                    id="search-input"
                    className="peer pe-9 ps-9 text-sm"
                    placeholder="Search by title, location, or category..."
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                    <Search size={16} strokeWidth={2} />
                </div>
                <button
                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Submit search"
                    type="submit"
                >
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </button>
            </form>
        </div>
    );
}
