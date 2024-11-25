import type { Metadata } from "next";
import "./globals.css";
import { Bitter } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import 'react-quill-new/dist/quill.snow.css';
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/toaster";

const bitter = Bitter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travel Tales",
  description: "Travel Tales is a blog for travel enthusiasts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bitter.className} antialiased`}
      >
        <Navbar />
        <NextSSRPlugin
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
