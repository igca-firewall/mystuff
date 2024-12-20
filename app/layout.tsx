export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";

// import { ThemeProvider } from "@/components/ThemeProvider";

// import AuthProvider from "@/context/AuthContext";
import { QueryProvider } from "@/lib/react-query/QueryProvider";
import { ThemeProvider } from "@/components/utilities/ThemeProvider";
// import AuthChecker from "@/components/AuthChecker";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-serif",
});

export const metadata: Metadata = {
  title: "IGCA Portal",
  description: "School portal built under the IGCA firewall powered by Particles",
  icons: {
    icon: "/images/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${inter.variable} ${ibmPlexSerif.variable} `}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
         {children}
          </QueryProvider>

          {/* <Toaster /> */}
          {/* <AuthChecker /> */}
        </ThemeProvider>{" "}
      </body>
    </html>
  );
}
