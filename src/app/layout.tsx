import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import WhatsAppButton from "@/components/common/WhatsAppButton";

import { Toaster } from 'sonner';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Renova Market - Moda Sostenible",
  description: "La mejor tienda de ropa de segunda mano en Cuba.",
};

import { cookies } from "next/headers";
import { getSellerPhoneByCode } from "@/actions/referral";
import ReferralTracker from "@/components/common/ReferralTracker";

// ... (Metadata export remains)

import { getCurrentUser } from "@/actions/user-session";
import SellerToolbar from "@/components/admin/SellerToolbar";
import PageTracker from "@/components/analytics/PageTracker";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const referralCode = cookieStore.get('referral_code')?.value;
  let whatsappNumber = null;

  if (referralCode) {
    whatsappNumber = await getSellerPhoneByCode(referralCode);
  }

  const currentUser = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <CartProvider>
          {/* Seller Tools */}
          {currentUser && (currentUser.role === 'SELLER' || currentUser.role === 'ADMIN') && currentUser.referralCode && (
            <SellerToolbar referralCode={currentUser.referralCode} userName={currentUser.name || 'Vendedor'} />
          )}

          <ReferralTracker />
          <PageTracker />
          <Navbar currentUser={currentUser} />
          <main className="flex-grow">
            {children}
          </main>

          {(!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SELLER')) && (
            <WhatsAppButton initialPhoneNumber={whatsappNumber} />
          )}
          <Footer />
          <Toaster position="top-center" richColors />
        </CartProvider>
      </body>
    </html>
  );
}
