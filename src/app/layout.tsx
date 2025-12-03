import type { Metadata } from "next";
import { Chewy } from 'next/font/google';
import "./globals.css";

const chewy = Chewy({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-chewy",
});

export const metadata: Metadata = {
  title: "NadeeTeacher - Fun & Effective Online Learning for Kids",
  description: "Join NadeeTeacher for interactive online classes, quizzes, and video lessons designed to make learning fun and effective for preschool to Grade 5 students.",
  keywords: ["online classes", "home schooling", "kids learning", "math", "reading", "NadeeTeacher", "preschool", "elementary education"],
  openGraph: {
    title: "NadeeTeacher - Fun & Effective Online Learning for Kids",
    description: "Interactive online classes, quizzes, and video lessons for kids.",
    url: "https://nadeeteacher.online", // Assuming this is the URL, or I can leave it out or use a placeholder
    siteName: "NadeeTeacher",
    locale: "en_US",
    type: "website",
  },
};

import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { DialogProvider } from '@/context/DialogContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased font-sans ${chewy.variable}`}
      >
        <AuthProvider>
          <DialogProvider>
            <DataProvider>
              {children}
            </DataProvider>
          </DialogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
