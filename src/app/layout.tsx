import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://skenis.lt"),
  title: {
    default: "Skenis.lt | Programuojami Google atsiliepimų QR stendai",
    template: "%s | Skenis.lt"
  },
  description:
    "Programuojamos akrilinės QR kortelės ir stendai, nukreipiantys klientus į jūsų Google atsiliepimų puslapį.",
  openGraph: {
    title: "Skenis.lt",
    description:
      "Programuojamos akrilinės QR kortelės ir stendai Google atsiliepimams.",
    url: "https://skenis.lt",
    siteName: "Skenis.lt",
    locale: "lt_LT",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt">
      <body>{children}</body>
    </html>
  );
}
