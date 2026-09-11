import { Inter, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["400", "500"],
});

const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: {
    default: "RagRaksha | A Safer Tomorrow, Together",
    template: "%s | RagRaksha",
  },
  description:
    "RagRaksha - Anonymous bullying reporting platform. Submit reports, track case status with a private passphrase. A safer tomorrow, together.",
  keywords: ["bullying", "report", "anonymous", "ragraksha", "school", "india", "harassment", "cyberbullying", "safe"],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  themeColor: "#0E1011",
  openGraph: {
    title: "RagRaksha | A Safer Tomorrow, Together",
    description:
      "Anonymous bullying reporting platform. Submit reports, track case status. A safer tomorrow, together.",
    type: "website",
    locale: "en_IN",
    siteName: "RagRaksha",
  },
  twitter: {
    card: "summary_large_image",
    title: "RagRaksha | A Safer Tomorrow, Together",
    description: "Anonymous bullying reporting platform. A safer tomorrow, together.",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
