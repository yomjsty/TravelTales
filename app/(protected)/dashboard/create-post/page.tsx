"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Loader2, Upload } from "lucide-react"
import { postSchema, type PostFormValues } from "@/lib/validation"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useUploadThing } from "@/utils/uploadthing";

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>
})

function CreatePostPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imagePreview, setImagePreview] = useState<string>("")
    const [hasImage, setHasImage] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    const form = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: "",
            slug: "",
            location: "",
            content: "",
            featuredImage: undefined
        }
    })

    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === 'title') {
                const slug = value.title
                    ?.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');
                form.setValue('slug', slug || '');
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);

    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === 'featuredImage') {
                const file = value.featuredImage as unknown as File
                if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                        setImagePreview(reader.result as string)
                    }
                    reader.readAsDataURL(file)
                }
            }
        })
        return () => subscription.unsubscribe()
    }, [form])

    const { startUpload } = useUploadThing("imageUploader");

    const onSubmit = async (data: PostFormValues) => {
        setIsSubmitting(true);
        try {
            let imageUrl = "";
            if (data.featuredImage) {
                try {
                    console.log("Starting image upload...");
                    const uploadResult = await startUpload([data.featuredImage as File]);
                    if (!uploadResult || !uploadResult[0]) {
                        throw new Error("Image upload failed - no result returned");
                    }
                    imageUrl = uploadResult[0].url;
                } catch (error) {
                    console.error("Image upload error details:", error);
                    throw new Error(error instanceof Error ? error.message : "Failed to upload image");
                }
            }

            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("slug", data.slug);
            formData.append("location", data.location);
            formData.append("content", data.content);
            formData.append("featuredImage", imageUrl);
            formData.append("category", data.category);

            const response = await fetch("/api/posts", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server response:", errorData);

                if (response.status === 401) {
                    throw new Error("Unauthorized - Please log in");
                }

                if (errorData.errors) {
                    const errorMessage = Object.values(errorData.errors)
                        .flat()
                        .join(", ");
                    throw new Error(errorMessage);
                }

                throw new Error(errorData.message || "Failed to create post");
            }

            const post = await response.json();

            // Wait a moment before redirecting to ensure the post is saved
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Use window.location.replace instead of href for a clean redirect
            window.location.replace(`/blog/${post.slug}`);

        } catch (error) {
            console.error("Full error details:", error);
            if (error instanceof Error) {
                form.setError("root", {
                    message: error.message || "An unexpected error occurred"
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveImage = () => {
        form.setValue("featuredImage", "")
        setImagePreview("")
        setHasImage(false)
    }

    const handleDragEvents = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true)
        } else if (e.type === "dragleave" || e.type === "drop") {
            setIsDragging(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            form.setError("featuredImage", {
                message: "File size must be less than 2MB"
            })
            return
        }

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            form.setError("featuredImage", {
                message: "File must be JPEG, PNG, or WebP"
            })
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        form.setValue("featuredImage", file)
        setHasImage(true)
        form.clearErrors("featuredImage")
    }

    return (
        <div className="max-w-screen-xl mx-auto mt-auto py-14 px-4">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Post</CardTitle>
                    <CardDescription>
                        Share your travel experience with others.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title <span className="text-red-500 text-xs">*</span></Label>
                            <Input
                                id="title"
                                {...form.register("title")}
                                placeholder="Enter post title"
                                className="text-sm"
                            />
                            {form.formState.errors.title && (
                                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug <span className="text-red-500 text-xs">*</span></Label>
                            <Input
                                id="slug"
                                {...form.register("slug")}
                                readOnly
                            />
                            {form.formState.errors.slug && (
                                <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location <span className="text-red-500 text-xs">*</span></Label>
                            <Input
                                id="location"
                                {...form.register("location")}
                                placeholder="Example: Palembang, Indonesia"
                                className="text-sm"
                            />
                            {form.formState.errors.location && (
                                <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category <span className="text-red-500 text-xs">*</span></Label>
                            <select
                                id="category"
                                {...form.register("category")}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Select a category</option>
                                <option value="Travel">Travel</option>
                                <option value="Food">Food</option>
                                <option value="Culture">Culture</option>
                                <option value="Adventure">Adventure</option>
                            </select>
                            {form.formState.errors.category && (
                                <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="featuredImage">Featured Image <span className="text-red-500 text-xs">*</span></Label>
                            {!hasImage ? (
                                <div
                                    className={`border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ease-in-out relative
                                        ${isDragging
                                            ? "border-primary bg-primary/5"
                                            : "border-muted-foreground/25 hover:border-primary/50"}`}
                                    onDragEnter={handleDragEvents}
                                    onDragLeave={handleDragEvents}
                                    onDragOver={handleDragEvents}
                                    onDrop={(e) => {
                                        handleDragEvents(e)
                                        const file = e.dataTransfer.files?.[0]
                                        if (file) handleFileChange({ target: { files: [file] } } as any)
                                    }}
                                >
                                    <Input
                                        id="featuredImage"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        onChange={handleFileChange}
                                        onClick={(e) => {
                                            (e.target as HTMLInputElement).value = ''
                                        }}
                                    />
                                    <div className="text-center space-y-4">
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload className="h-8 w-8 text-muted-foreground/80" />
                                            <div className="text-sm">
                                                <span className="font-semibold text-primary">Click to upload</span>{" "}
                                                or drag and drop
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            JPEG, PNG or WebP (MAX. 2MB)
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                hasImage && imagePreview && (
                                    <div className="space-y-2">
                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                                            <Image
                                                src={imagePreview}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={handleRemoveImage}
                                                >
                                                    Remove Image
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                            {form.formState.errors.featuredImage && (
                                <p className="text-sm text-red-500">{form.formState.errors.featuredImage.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Content <span className="text-red-500 text-xs">*</span></Label>
                            <div className="min-h-[300px]">
                                <ReactQuill
                                    theme="snow"
                                    value={form.watch("content")}
                                    onChange={(value) => form.setValue("content", value)}
                                    className="h-[250px]"
                                />
                            </div>
                            {form.formState.errors.content && (
                                <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Post
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreatePostPage