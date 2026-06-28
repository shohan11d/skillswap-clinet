import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Skillswap",
  description: "Freelance Micro-Task Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-screen bg-[#212121] text-neutral-400 selection:bg-blue-600/30">
        <Navbar />
        <main className="min-h-[calc(100vh-64px)] w-full flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}