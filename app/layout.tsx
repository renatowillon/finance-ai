import { Mulish } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { SidebarClient } from "./_components/sidebarClient";
import { Toaster } from "sonner";
import RegisterSW from "./_components/RegisterSW";
import { Provider } from "./context/Provider";
import { canUserAddTransaction } from "./_data/can-user-add-transaction";
import { SpeedInsights } from "@vercel/speed-insights/next";

const mulish = Mulish({
  subsets: ["latin-ext"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const usuarioPodeAdicionarTransacao = await canUserAddTransaction();
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-title" content="wFinance" />
        <meta name="theme-color" content="#030712" />
      </head>
      <body
        className={`${mulish.className} dark flex flex-row antialiased md:flex-row`}
      >
        <Provider>
          <RegisterSW />
          <Toaster richColors position="top-right" duration={2000} />
          <AuthProvider>
            <SidebarClient
              usuarioPodeAdicionarTransacao={usuarioPodeAdicionarTransacao}
            />
            <div className="mb-16 flex h-full w-full flex-col overflow-y-scroll lg:p-5">
              {children}
              <SpeedInsights />
            </div>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
