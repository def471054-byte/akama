import type { Metadata } from "next";
import { Inter, Outfit, Tajawal, Alexandria } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const tajawal = Tajawal({ 
  subsets: ["arabic"], 
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal" 
});
const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["400", "700", "800"],
  variable: "--font-alexandria"
});

export const metadata: Metadata = {
  title: "Employee Identify & Verification System",
  description: "Secure QR-based identity verification system",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} ${tajawal.variable} ${alexandria.variable} font-sans`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
