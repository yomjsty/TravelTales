import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";
import { apiAuthPrefix, publicRoutes } from "./routes";

export default async function authMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.some(route => {
        const regex = new RegExp(`^${route.replace(/\*/g, ".*")}$`);
        return regex.test(pathname);
    });

    const isPublicApiRoute =
        pathname.startsWith('/api/posts') && request.method === 'GET' ||
        pathname.startsWith('/api/comments') && request.method === 'GET' ||
        pathname.startsWith('/api/uploadthing') ||
        pathname.startsWith('/blog');

    if (isApiAuthRoute || isPublicApiRoute) {
        return;
    }

    const { data: session } = await betterFetch<Session>(
        "/api/auth/get-session",
        {
            baseURL: request.nextUrl.origin,
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        },
    );

    if (!session && !isPublicRoute) {
        return Response.redirect(new URL("/", request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}