"use client";

import { useDropzone } from "react-dropzone";
import { useUploadThing } from "@/utils/uploadthing";
import { generateReactHelpers } from "@uploadthing/react";
import { useState, useCallback } from "react";
import { Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";

interface UploadButtonProps {
    onUploadComplete: (url: string) => void;
    onError?: (error: Error) => void;
}

export function UploadButton({ onUploadComplete, onError }: UploadButtonProps) {
    const [isUploading, setIsUploading] = useState(false);
    const { startUpload } = useUploadThing("imageUploader");

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            setIsUploading(true);
            try {
                const res = await startUpload(acceptedFiles);
                if (res && res[0].url) {
                    onUploadComplete(res[0].url);
                }
            } catch (error) {
                onError?.(error as Error);
            } finally {
                setIsUploading(false);
            }
        },
        [startUpload, onUploadComplete, onError]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': []
        },
        maxSize: 2 * 1024 * 1024,
        maxFiles: 1
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ease-in-out w-full relative cursor-pointer
        ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}`}
        >
            <input {...getInputProps()} />
            <div className="text-center space-y-4">
                <div className="flex flex-col items-center gap-2">
                    {isUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/80" />
                    ) : (
                        <Upload className="h-8 w-8 text-muted-foreground/80" />
                    )}
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
    );
} 