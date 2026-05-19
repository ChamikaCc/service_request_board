import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Service Request Board | GlobalTNA",
  description: "A mini service request board for homeowners and tradespeople",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}