import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Primetrade.ai | Secure Task Hub",
  description: "Scalable REST API with Authentication & Role-Based Access",
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
