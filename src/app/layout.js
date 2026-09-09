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
    default: "SafeVoice | Anonymous Bullying Reports",
    template: "%s | SafeVoice",
  },
  description:
    "Submit anonymous bullying reports. Track case status with a private passphrase. No account required.",
  keywords: ["bullying", "report", "anonymous", "safe", "school", "india", "harassment", "cyberbullying"],
  openGraph: {
    title: "SafeVoice | Anonymous Bullying Reports",
    description:
      "Submit anonymous bullying reports. Track case status with a private passphrase.",
    type: "website",
    locale: "en_IN",
    siteName: "SafeVoice",
  },
  twitter: {
    card: "summary_large_image",
    title: "SafeVoice | Anonymous Bullying Reports",
    description: "Submit anonymous bullying reports. Track case status with a private passphrase.",
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
