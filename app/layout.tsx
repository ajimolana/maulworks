import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maulana's Portfolio",
  description: "Explore the portfolio of Maulana Raji Shofil Fuadi, a Data Analyst and Actuarial Science graduate specializing in AI automation and data-driven insights.",
  openGraph: {
    title: "Maulana's Portfolio",
    description: "Explore the portfolio of Maulana Raji Shofil Fuadi, a Data Analyst and Actuarial Science graduate specializing in AI automation and data-driven insights.",
    siteName: "Maulana's Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maulana's Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "scroll-smooth", poppins.variable, "font-sans")}>
      <head>
      </head>
      <body className={`${poppins.className} ${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
