import type { Metadata } from "next";
import Script from "next/script";
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
  metadataBase: new URL("https://yeka-studio.pages.dev"),
  openGraph: {
    title: "Yeka Creative Studio — Female Photographer Jogja & Solo",
    description:
      "Spesialis foto wisuda, wedding & prewedding di Yogyakarta & Solo. Cek live schedule slot kosong & katalog pricelist transparan.",
    url: "https://yeka-studio.pages.dev",
    siteName: "Yeka Creative Studio",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Yeka Creative Studio - Female Photographer Jogja & Solo",
        type: "image/jpeg",
      },
    ],
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yeka Creative Studio — Female Photographer Jogja & Solo",
    description:
      "Spesialis foto wisuda, wedding & prewedding di Yogyakarta & Solo. Cek live schedule slot kosong & katalog pricelist transparan.",
    images: ["/images/og-image.jpg"],
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* Google Analytics 4 Script */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}

        {/* Meta / Facebook Pixel Script */}
        {PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
