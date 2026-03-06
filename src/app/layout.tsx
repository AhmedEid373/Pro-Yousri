import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yousri - WordPress Developer & Web Specialist",
  description: "Expert WordPress developer with deep knowledge in domains, VPS, and hosting solutions. Building powerful digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
