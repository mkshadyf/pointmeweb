import { PointMeProvider } from '../../lib/providers/point-me-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Metadata } from 'next'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PointMe - Service Booking Platform',
  description: 'Book services and manage appointments with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PointMeProvider>
            {children}
          </PointMeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}