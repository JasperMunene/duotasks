import type { Metadata } from "next";
import {  Figtree } from "next/font/google";
import { Providers } from './providers';
import "./globals.css";


const figtree = Figtree({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Duotasks",
  description: "Connect with skilled taskers for any job, big or small.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body
        className={`${figtree.className} antialiased`}
      >
      <Providers>{children}</Providers>
      </body>
    </html>
  );
}
