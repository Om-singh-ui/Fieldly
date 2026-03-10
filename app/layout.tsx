import "./globals.css";
import type { Metadata } from "next";
import HeaderRoot from "@/components/header/HeaderRoot";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import FieldlyAssist from "@/components/FieldlyAssist";

export const metadata: Metadata = {
  title: "Fieldly - Empowering Farmers, Unlocking Land",
  description:
    "Fieldly connects landowners and farmers through transparent land leasing.",
  icons: "/image.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClerkProvider>
          <HeaderRoot />
          <main className="min-h-screen">{children}</main>
          <FieldlyAssist />
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
