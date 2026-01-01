import type { Metadata } from "next";
import { Montserrat, Cinzel_Decorative, Trade_Winds, Bebas_Neue } from "next/font/google";
import "./globals.css";

const montserratBoldItalic = Montserrat({
  weight: "700",
  style: "italic",
  variable: "--font-montserrat-bold-italic",
  subsets: ["latin"],
});

const cinzelDecorative = Cinzel_Decorative({
  weight: ["400", "700", "900"],
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
});

const tradeWinds = Trade_Winds({
  weight: "400",
  variable: "--font-trade-winds",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "El Capitán Takács - Captain Morgan",
  description: "DJing, Partying and Fifing at the same time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserratBoldItalic.variable} ${cinzelDecorative.variable} ${tradeWinds.variable} ${bebasNeue.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
