import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { SidebarClient } from "./_components/sidebarClient";
import { Toaster } from "sonner";

const mulish = Mulish({
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Finance AI",
  description: "Finance AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="wFinance" />
      </head>
      <body
        className={`${mulish.className} dark flex flex-col antialiased md:flex-row`}
      >
        <Toaster richColors position="top-right" duration={2000} />
        <AuthProvider>
          <SidebarClient />
          <div className="flex h-full w-full flex-col overflow-scroll lg:p-5">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
