import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";

import {ConvexClientProvider} from "@/providers/convex-client-provider";
import {ThemeProvider} from "@/providers/theme-provider";

const inter = Inter({subsets: ["latin"]});

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
        <body className={inter.className}>
        <ConvexClientProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </ConvexClientProvider>

        </body>
        </html>

    );
}
