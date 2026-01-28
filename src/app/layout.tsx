import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bakery Business Planner",
  description: "Plan and analyze your bakery business health",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
