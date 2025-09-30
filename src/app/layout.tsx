import { Cairo } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/header";
import { Directions, Languages } from "@/constants/enums";
import Footer from "@/components/shared/footer";
import { AuthProvider } from "@/providers/auth-provider";

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
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
