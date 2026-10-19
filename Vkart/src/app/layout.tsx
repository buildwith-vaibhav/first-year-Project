import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WishlistDrawer } from "@/components/wishlist/WishlistDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vkart — Groceries & Daily Necessities, Beautifully Delivered",
  description:
    "Premium groceries, fresh produce, and everyday essentials delivered to your door. Shop Vkart for hand-picked quality, fair prices, and a beautifully simple experience.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://vkart.example.com",
  ),
  openGraph: {
    title: "Vkart — The everyday, elevated.",
    description:
      "Hand-picked groceries, fresh produce, and everyday essentials delivered to your door.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Vkart — Groceries & daily necessities" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vkart — The everyday, elevated.",
    description:
      "Hand-picked groceries, fresh produce, and everyday essentials delivered to your door.",
    images: ["/og.jpg"],
  },
  icons: {
    icon: [{ url: "/logo-mark.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo-mark.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#fbfaf7] text-[var(--color-ink)] antialiased">
        <CartProvider>
          <WishlistProvider>
            <Header />
            <main className="min-h-[60vh]">{children}</main>
            <Footer />
            <CartDrawer />
            <WishlistDrawer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
