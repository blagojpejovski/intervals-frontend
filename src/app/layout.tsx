import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intervals Calculator",
  description: "Merges intervals in a list",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
