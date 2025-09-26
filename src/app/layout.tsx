import { Cairo } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/header";
import { Directions, Languages } from "@/constants/enums";

const cairo = Cairo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
  style: "normal",
  display: "swap",
});

// export const metadata: Metadata = {
//   title: "E-Commerce App",
//   description: "Modern e-commerce application built with Next.js",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={Languages.ARABIC} dir={Directions.RTL}>
      <body className={`${cairo.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
