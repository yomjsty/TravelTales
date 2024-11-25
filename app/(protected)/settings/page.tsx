import SettingsForm from "@/components/settingsform"
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth"
import prisma from "@/lib/db";
import { headers } from "next/headers"
import Link from "next/link";

async function SettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return <div>Something went wrong. Please reload or relog in.</div>;
    }

    const user = session.user;

    const bioData = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
        select: {
            bio: true,
        },
    });

    const bio = bioData?.bio ?? "";

    return (
        <div className="max-w-screen-md mx-auto mt-auto flex flex-col items-center justify-center py-14 px-4 md:px-0 space-y-6">
            <Button className="bg-[#0B4A53] hover:bg-[#0B4A53]/80 self-start" asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
            <SettingsForm user={user} bio={bio} />
        </div>
    )
}

export default SettingsPage