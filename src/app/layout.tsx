import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Household App",
  description: "Manage recipes, shopping lists, and household tasks",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className="antialiased bg-gray-50 min-h-screen font-sans">
      <Navigation />
      <main className="pt-20">
        {children}
      </main>
      </body>
      </html>
  );
}