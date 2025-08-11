import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProviderWrapper } from "@/components/session-provider";
import FooterWrapper from "@/components/footer-wrapper";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "TutorMe - Skill Exchange & Microlearning Platform",
  description: "Trade skills, learn from AI-powered micro-courses, and join a community of learners and teachers.",
  keywords: ["TutorMe", "skill exchange", "microlearning", "AI courses", "education", "trading"],
  authors: [{ name: "TutorMe Team" }],
  openGraph: {
    title: "TutorMe - Skill Exchange Platform",
    description: "Trade skills and learn with AI-powered micro-courses",
    url: "https://tutorme.com",
    siteName: "TutorMe",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TutorMe - Skill Exchange Platform",
    description: "Trade skills and learn with AI-powered micro-courses",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-sans antialiased bg-background text-foreground"
      >
        <SessionProviderWrapper>
          {children}
          <FooterWrapper />
          <Toaster />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
