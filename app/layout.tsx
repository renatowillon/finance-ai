import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

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
      <body className={`${mulish.className} dark antialiased`}>
        <AuthProvider>
          <div className="flex h-full flex-col">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
