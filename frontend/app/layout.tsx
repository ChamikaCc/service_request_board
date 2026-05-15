import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Service Request Board",
  description: "A mini service request board for homeowners and tradespeople",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}