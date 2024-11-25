import { auth } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
    imageUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1
        }
    })
        .middleware(async ({ req }) => {
            const session = await auth.api.getSession({
                headers: req.headers
            });

            if (!session) {
                throw new Error("Unauthorized");
            }

            const user = session.user;

            return { userId: user.id };
        })
        .onUploadComplete(async ({ file }) => {
            return { url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;