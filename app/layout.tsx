import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";

const url = "https://wearetob.com";
const description =
  "We Are TOB, KOBİ'ler ve küçük işletmeler için kreatif marka ajansı. Küçük işletmeler için büyük marka fikirleri: marka stratejisi, logo ve görsel kimlik, web tasarım, sosyal medya yönetimi ve dijital pazarlama.";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: { default: "We Are TOB | KOBİ ve Küçük İşletmeler İçin Marka Ajansı", template: "%s | We Are TOB" },
  description,
  keywords: [
    "We Are TOB", "TOB ajans", "The Other Brands",
    "KOBİ ajansı", "KOBİ marka ajansı", "KOBİ dijital ajans", "KOBİ sosyal medya", "KOBİ web sitesi",
    "küçük işletmeler için büyük fikirler", "küçük işletmeler için büyük marka fikirleri", "küçük işletme ajansı",
    "küçük işletme markalaşma", "küçük işletme web sitesi", "küçük işletme sosyal medya yönetimi",
    "marka ajansı", "kreatif ajans", "reklam ajansı", "dijital ajans", "sosyal medya ajansı", "butik ajans",
    "marka stratejisi", "logo tasarım", "kurumsal kimlik", "web tasarım", "dijital pazarlama", "SEO",
  ],
  applicationName: "We Are TOB",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url,
    siteName: "We Are TOB",
    title: "We Are TOB | KOBİ ve Küçük İşletmeler İçin Marka Ajansı",
    description,
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: "WE ARE TOB." }],
  },
  twitter: { card: "summary_large_image", title: "We Are TOB | KOBİ ve Küçük İşletmeler İçin Marka Ajansı", description, images: ["/brand/og.jpg"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

// Organization + WebSite structured data so Google can show the brand name, logo and the site's sections.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${url}/#org`,
      name: "We Are TOB",
      alternateName: ["TOB", "The Other Brands", "TOB Ajans"],
      slogan: "Küçük işletmeler için büyük marka fikirleri.",
      areaServed: "TR",
      audience: { "@type": "BusinessAudience", name: "KOBİ'ler ve küçük işletmeler" },
      url,
      logo: `${url}/icon.png`,
      email: "projectstheother@gmail.com",
      description,
      knowsAbout: ["Marka stratejisi", "Görsel kimlik", "Web tasarım", "Sosyal medya", "Dijital pazarlama", "SEO"],
    },
    { "@type": "WebSite", "@id": `${url}/#website`, url, name: "We Are TOB", inLanguage: "tr-TR", publisher: { "@id": `${url}/#org` } },
    {
      "@type": "ItemList",
      name: "Hizmetler",
      itemListElement: ["Brand", "Web", "Social", "Marketing"].map((n, i) => ({ "@type": "ListItem", position: i + 1, name: n, url: `${url}/#hizmetler` })),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/images/ball.png" as="image" />
        {/* before first paint: switch the intro hero into its sticky zoom layout unless motion is reduced */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("tob-motion")`,
          }}
        />
      </head>
      <body className="font-ui">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
