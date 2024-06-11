import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import Providers from "@/components/ui/Providers";
import {Toaster} from 'react-hot-toast'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatPDF-AI",

};

//wraps the entire application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      {/* we use providers to make sure that every component has access to data cache */}
      <Providers>
      <html lang="en">
          <body className={inter.className}>{children}</body>
          <Toaster/>
        </html>        
      </Providers>               
    </ClerkProvider>
  );
}
