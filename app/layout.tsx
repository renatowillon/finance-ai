import { Mulish } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { SidebarClient } from "./_components/sidebarClient";
import { Toaster } from "sonner";
import RegisterSW from "./_components/RegisterSW";
import { Provider } from "./context/Provider";

const mulish = Mulish({
  subsets: ["latin-ext"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-title" content="wFinance" />
        <meta name="theme-color" content="#233b6a" />
      </head>
      <body
        className={`${mulish.className} dark flex flex-col antialiased md:flex-row`}
      >
        <Provider>
          <RegisterSW />
          <Toaster richColors position="top-right" duration={2000} />
          <AuthProvider>
            <SidebarClient />
            <div className="mb-16 flex h-full w-full flex-col overflow-y-scroll lg:p-5">
              {children}
            </div>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
