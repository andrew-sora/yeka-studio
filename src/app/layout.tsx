import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yeka Creative Studio — Female Photographer Jogja & Solo | Wedding, Wisuda",
  description:
    "Yeka Creative Studio adalah female photographer profesional di Yogyakarta & Solo. Spesialis foto wisuda, wedding, prewedding, dan engagement. Dipercaya 2.500+ mahasiswa dari UGM, UII, UNY, UIN Suka, UAD, UMY, USD.",
  keywords: [
    "fotografer wisuda Jogja",
    "fotografer wedding Yogyakarta",
    "foto wisuda UGM",
    "foto wisuda UII",
    "prewedding Jogja Solo",
    "female photographer Yogyakarta",
    "Yeka Creative Studio",
  ],
  openGraph: {
    title: "Yeka Creative Studio — Female Photographer Jogja & Solo",
    description:
      "Spesialis foto wisuda, wedding & prewedding di Yogyakarta & Solo. 2.500+ momen terabadikan. Female photographer profesional.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
