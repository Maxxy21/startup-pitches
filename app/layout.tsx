import type {Metadata} from "next";
import {Noto_Sans_Georgian} from "next/font/google";
import "./globals.css";

import {ConvexClientProvider} from "@/providers/convex-client-provider";
import {ThemeProvider} from "@/providers/theme-provider";
import React from "react";

// const inter = Inter({subsets: ["latin"]});
const defaultFont = Noto_Sans_Georgian({subsets: ["latin"]});

const ORIGIN_URL =
    process.env.NODE === "production"
        ? "https://pitch-perfect.com"
        : "http://localhost:3000";


export const metadata: Metadata = {
    title: "Pitch Perfect",
    description: "Evaluate your startup pitches using AI:",
    metadataBase: new URL(ORIGIN_URL),
    alternates: {
        canonical: ORIGIN_URL,
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <html lang="en">
        <body className={defaultFont.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ConvexClientProvider>
                {children}
            </ConvexClientProvider>
        </ThemeProvider>
        </body>
        </html>

    );
}
