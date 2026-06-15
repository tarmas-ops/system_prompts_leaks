import "./globals.css";
import { Cormorant_Garamond, Inter } from "next/font/google";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Grupo NV — Real Estate Private Equity",
  description:
    "Value is not found. It is created. An immersive journey through the lifecycle of institutional real estate value creation.",
};

export const viewport = {
  themeColor: "#0b2343",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
