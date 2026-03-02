import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.apoiêfy.com.br'),
  title: 'Apoiêfy - Gestão de Campanhas Digitais',
  description: 'Crie e gerencie campanhas digitais com facilidade e profissionalismo.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://www.apoiêfy.com.br',
    siteName: 'Apoiêfy',
    title: 'Apoiêfy - Gestão de Campanhas Digitais',
    description: 'Crie e gerencie campanhas digitais com facilidade e profissionalismo.',
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'Apoiêfy Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apoiêfy - Gestão de Campanhas Digitais',
    description: 'Crie e gerencie campanhas digitais com facilidade e profissionalismo.',
    images: ['/android-chrome-512x512.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' }
    ]
  },
  manifest: '/site.webmanifest'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
