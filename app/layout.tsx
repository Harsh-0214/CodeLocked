import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harsh's Dev Lessons",
  description: "A personal software engineering knowledge base",
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
