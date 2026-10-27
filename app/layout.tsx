import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blake Scrapes | Snow & Ice Removal", description: "Reliable morning snow and ice scraping for your vehicle." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
