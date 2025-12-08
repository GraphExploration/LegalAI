import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
// import { SessionProvider } from "next-auth/react" 
import Providers from "./providers"
// import Header from '../src/components/Header';
import Sidebar from '../src/components/Sidebar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Legal AI App",
  description: "LegalAI - Your AI Legal Assistant",
}

export default function RootLayout({ children,}: {  children: React.ReactNode}) {
  return (
    <html lang="en" className="h-full">
      {/* <body
        className={`h-full m-0 p-0 bg-white dark:bg-gray-900 overflow-hidden ${geistSans.variable} ${geistMono.variable}`}
      > */}
     <body className={`min-h-screen m-0 p-0 bg-white dark:bg-gray-900 overflow-y-auto ${geistSans.variable} ${geistMono.variable}`}>
      <div className="flex min-h-screen antialiased">
      <Sidebar /> 
        {/* <SessionProvider>{children}</SessionProvider> */}
        <main className="flex-1 w-full h-full overflow-auto bg-gray-100">
        <Providers >{children}</Providers>
        </main>
        </div>
      </body>
    </html>
  )
}
