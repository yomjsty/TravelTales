import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bookmark, Heart, PenSquare, Settings2 } from 'lucide-react'
import Link from "next/link"

export default function DashboardPage() {
    return (
        <div className="max-w-screen-xl mx-auto p-4 xl:px-0 pb-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Button
                    className="bg-[#0B4A53] hover:bg-[#0B4A53]/80"

                >
                    <Link href="/dashboard/create-post">Write a Blog</Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardCard
                    title="My Posts"
                    icon={<PenSquare className="h-6 w-6" />}
                    link="/dashboard/posts"
                />
                <DashboardCard
                    title="Bookmarks"
                    icon={<Bookmark className="h-6 w-6" />}
                    link="/dashboard/bookmarks"
                />
                <DashboardCard
                    title="Liked Posts"
                    icon={<Heart className="h-6 w-6" />}
                    link="/dashboard/liked"
                />
                <DashboardCard
                    title="Settings"
                    icon={<Settings2 className="h-6 w-6" />}
                    link="/settings"
                />
            </div>
        </div>
    )
}

interface DashboardCardProps {
    title: string
    icon: React.ReactNode
    link: string
}

function DashboardCard({ title, icon, link }: DashboardCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <Link
                    href={link}
                    className="text-2xl font-bold hover:underline"
                >
                    View {title}
                </Link>
            </CardContent>
        </Card>
    )
}