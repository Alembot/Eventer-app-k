import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EVENTER — создавайте события",
  description: "Рабочее пространство участников event-индустрии Казахстана.",
  applicationName: "Eventer",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/eventer-icon.svg", type: "image/svg+xml" },
      { url: "/eventer-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/eventer-icon.svg",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
