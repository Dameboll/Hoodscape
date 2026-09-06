import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HOODSCAPE — The Towers",
  description: "Make your name in Saint Mercer. A third-person urban RPG.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
