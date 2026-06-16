import "./globals.css";
import { Jost } from "next/font/google";

// Geometric sans matching the Grupo NV logo lettering — used across the page.
const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata = {
  title: "Grupo NV — Real Estate Private Equity",
  description:
    "Capital. Disciplina. Diseño. Ejecución. Construimos plataformas inmobiliarias de largo plazo.",
};

export const viewport = {
  themeColor: "#0b2343",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={jost.variable}>
      <body>{children}</body>
    </html>
  );
}
