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
  keywords: [
    "NadeeTeacher", "Nadee Teacher", "Online Classes Sri Lanka", "Home Schooling Sri Lanka", 
    "Kids Learning Platform", "Primary Education", "Preschool Classes", "Kindergarten Online", 
    "Grade 1 Maths", "Grade 2 Environmental Studies", "Grade 3 Sinhala", "Grade 4 English", 
    "Grade 5 Scholarship Exam", "Scholarship Revision", "Mathematics for Kids", "English for Kids", 
    "Sinhala Lessons", "Environmental Studies (ERA)", "Science for Primary", "Interactive Learning", 
    "Video Lessons", "Online Quizzes", "Educational Games", "Remote Learning", "E-Learning Portal", 
    "Best Online Teacher Sri Lanka", "Sri Lankan Local Syllabus", "School Syllabus", "Term Test Papers", 
    "Revision Classes", "Model Papers", "Past Papers", "Fun Learning", "Child Development", 
    "Early Childhood Education", "Nursery Lessons", "Smart Classroom", "Digital Learning", 
    "Student Progress Tracking", "Live Classes", "Zoom Education", "Tuition Classes", "Online Tuition", 
    "Reading", "Writing", "Spoken English for Kids", "Elocution", "Abacus", "Coding for Kids"
  ],
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
        {/* <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "NadeeTeacher",
              "url": "https://nadeeteacher.online",
              "description": "Join NadeeTeacher for interactive online classes, quizzes, and video lessons designed to make learning fun and effective for preschool to Grade 5 students.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "LK"
              },
              "offers": {
                "@type": "Offer",
                "price": "1000",
                "priceCurrency": "LKR",
                "category": "Monthly Tuition"
              }
            }),
          }}
        /> */}
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
