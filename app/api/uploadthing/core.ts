import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
    imageUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1
        }
    })
        .middleware(async () => {
            console.log("Upload middleware executing");
            return { userId: "test" };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload completed", { metadata, file });
            return { url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;