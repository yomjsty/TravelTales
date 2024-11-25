"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, Loader2 } from "lucide-react"
import { useState } from "react"
import { UploadButton } from "./ui/upload-button"
import { useToast } from "@/hooks/use-toast"
import { User } from "better-auth"

interface ProfileProps {
    user: User;
    bio: string;
}

export default function SettingsForm({ user, bio }: ProfileProps) {
    const [avatar, setAvatar] = useState(user.image)
    const [name, setName] = useState(user.name || "");
    const [userBio, setUserBio] = useState(bio || "");
    const [loading, setLoading] = useState(false)
    const [uploaded, setUploaded] = useState(false);
    const { toast } = useToast()

    const handleImageUpload = (url: string) => {
        setAvatar(url);
        setUploaded(true);
    };

    const hasChanges = name !== user.name || userBio !== bio || avatar !== user.image;

    const handleSaveChanges = async () => {
        const payload = {
            name,
            bio: userBio,
            image: avatar,
        };
        setLoading(true)

        try {
            const response = await fetch("/api/profile/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast({
                    title: "Profile updated successfully",
                })
                setLoading(false)
            } else {
                toast({
                    title: "Failed to update profile.",
                    variant: "destructive"
                })
                setLoading(false)
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                title: "Failed to update profile.",
                variant: "destructive"
            })
            setLoading(false)
        }
    };

    return (
        <Card className="w-full max-w-screen-md">
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                    Update your profile details and public information.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={avatar || "/placeholder.svg"} alt="Profile picture" />
                            <AvatarFallback>{(name || '').charAt(0)}</AvatarFallback>
                        </Avatar>
                        <UploadButton
                            onUploadComplete={handleImageUpload}
                            onError={(error) => {
                                toast({
                                    title: "Error",
                                    description: error.message,
                                    variant: "destructive",
                                });
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            placeholder="Enter your name"
                            className="text-sm"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            defaultValue={user.email}
                            disabled
                        />
                        <p className="text-xs text-muted-foreground">
                            Your email address cannot be changed.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            value={userBio}
                            onChange={(e) => setUserBio(e.target.value)}
                            placeholder="Write a short bio about yourself..."
                            className="min-h-[100px] text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                            Brief description for your profile.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleSaveChanges} disabled={loading || !hasChanges}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving Changes
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
