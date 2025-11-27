import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "RoadmapAI - Turn Your Resume into a Learning Roadmap",
    description: "AI-powered platform that transforms your resume and career goals into a personalized learning roadmap with curated resources and progress tracking.",
    keywords: ["career", "learning", " roadmap", "AI", "resume", "skills", "education"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
