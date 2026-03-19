import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SWGEmu Server Setup Guide",
  description:
    "Complete wizard-style guide for setting up a Star Wars Galaxies Emulator server from scratch. Covers VM creation, server installation, database setup, configuration, and maintenance.",
  keywords: ["SWGEmu", "Star Wars Galaxies", "server setup", "guide", "Core3"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-mesh-gradient hud-grid antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
