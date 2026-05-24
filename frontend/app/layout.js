import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Video Generator',
  description: 'Generate AI videos with voiceovers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
          {children}
        </main>
      </body>
    </html>
  )
}
