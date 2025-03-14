import type { Metadata } from "next";
import "../styles/globals.css";
import { AuthProvider } from "@/context";

export const metadata: Metadata = {
  title: "Strativ Quiz App",
  description: "A quiz app built with Next.js and Localstorage",
};

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
