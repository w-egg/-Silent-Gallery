import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Silent Gallery - 今を残さず、今を感じる。',
  description: '1日1枚・無言の写真が7日だけ漂う静寂SNS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
