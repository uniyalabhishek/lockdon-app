import type { Metadata } from "next";
import { ccDeadlineDreaded, ccDeadlineDreadedOpen } from './fonts';
import "./globals.css";
import Providers from '../components/Provider';
import WalletButton from '../components/ui/WalletButton';

export const metadata: Metadata = {
  title: "Lock Don",
  description: "Lock Don - Target Tracking System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ccDeadlineDreaded.variable} ${ccDeadlineDreadedOpen.variable}`}>
        <Providers>
          <div className="p-4">
            <div className="absolute top-4 right-4">
              <WalletButton />
            </div>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}