import type { Metadata } from "next";
// Font is now handled in theme.ts via theme configuration
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";

export const metadata: Metadata = {
  title: "Nespresso Barcode Generator",
  description: "Generate custom barcodes for Nespresso Vertuo machines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
