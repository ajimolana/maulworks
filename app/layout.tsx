import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";


const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maulana's Portfolio",
  description: "Explore the portfolio of Maulana Raji Shofil Fuadi, a Data Analyst and Actuarial Science graduate specializing in AI automation and data-driven insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark font-sans ${poppins.variable}`}>
      <body className={`${poppins.className} ${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
