import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ToastContainer from "@/components/ui/ToastContainer";
import "material-icons/iconfont/material-icons.css";
import "material-symbols/outlined.css";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Rebost",
    template: "%s",
  },
  description:
    "Create your recipes and plan your weekly menu. Generate your shopping list and go shopping with it.",
  keywords: [
    "recipes",
    "meal planning",
    "shopping list",
    "weekly menu",
    "cooking",
  ],
  authors: [{ name: "Rebost" }],
  openGraph: {
    title: "Rebost",
    description:
      "Create your recipes and plan your weekly menu. Generate your shopping list and go shopping with it.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rebost",
    description: "Create your recipes and plan the menu",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="true" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
        }}
      >
        <Header />
        <main className="flex w-full flex-1 p flex-col p-5 bg-zinc-50 font-sans">
          {children}
        </main>
        <Footer />
        <ToastContainer />
      </body>
    </html>
  );
}
