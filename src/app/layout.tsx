import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  DynamicEnvironmentId,
  DynamicContextProvider,
  EthereumWalletConnectors,
  EthersExtension
} from "@/utils/Dynamic";

import { DarkModeProvider } from "../contexts/DarkModeContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blox Solutions",
  description: "Blockchain Data Analytics Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DarkModeProvider>
          <DynamicContextProvider
            settings={{
              environmentId: DynamicEnvironmentId,
              walletConnectors: [EthereumWalletConnectors],
              walletConnectorExtensions: [EthersExtension],
              appName: "BLOX",
              appLogoUrl: "/blox400.jpg", // Updated URL
              privacyPolicyUrl: "/privacy-policy",
              termsOfServiceUrl: "/terms-of-service",
            }}
          >
            <div className="flex min-h-screen">
              {/* <SideNav /> */}
              <main className="flex-1">
                {children}
              </main>
            </div>
          </DynamicContextProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}