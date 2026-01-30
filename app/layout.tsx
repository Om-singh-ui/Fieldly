import "./globals.css";
import type { Metadata } from "next";
import HeaderRoot from "@/components/header/HeaderRoot";
import Footer from "@/components/Footer"; // Import the Footer component

export const metadata: Metadata = {
  title: "Fieldly - Empowering Farmers, Unlocking Land",
  description:
    "Fieldly connects landowners and farmers through transparent land leasing.",
  icons: "/icon.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <HeaderRoot />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer /> 
      </body>
    </html>
  );
}