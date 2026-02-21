import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ReduxProvider from '@/providers/ReduxProvider'

const inter = Inter({ subsets: ['latin'] })
const swVersion = process.env.NEXT_PUBLIC_BUILD_ID || 'dev'

export const metadata: Metadata = {
  title: 'TapTrack',
  description: 'Track your expenses with ease',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TapTrack'
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F59E0B',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/frog_120x120.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#F59E0B" />
        <link rel="apple-touch-icon" href="/frog_120x120.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TapTrack" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var key = 'taptrack-theme';
                  var saved = localStorage.getItem(key);
                  var theme = (saved === 'light' || saved === 'dark')
                    ? saved
                    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', theme);
                  var metaTheme = document.querySelector('meta[name=\"theme-color\"]');
                  if (metaTheme) {
                    metaTheme.setAttribute('content', theme === 'dark' ? '#0B1220' : '#F59E0B');
                  }
                } catch (_) {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              })();
            `,
          }}
        />
        <script dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined' && '${process.env.NODE_ENV}' === 'production' && 'serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js?v=${swVersion}')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `
        }} />
      </head>
      <body className={inter.className}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
