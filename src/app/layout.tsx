import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "সময়যুদ্ধ 2.0 — SamayYudh | The Battle Between You & The Clock",
  description:
    "Practice real exam questions under realistic time pressure. Write your answers, track your speed, and let AI tell you whether your answer is exam-ready. Supports GATE, JEE, WBJEE, UPSC, University, and more.",
  keywords: ["exam preparation", "time pressure", "GATE", "JEE", "WBJEE", "UPSC", "AI evaluation", "exam simulator"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
